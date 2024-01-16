import { kafkaConfig, kafkaGroup, kafkaTopics } from '../config';
import { IncrementFieldEvent } from '@prici/shared-remult/controllers/account-fields.controller';

export type PriciEvent = IncrementFieldEvent | any

export type OnEventCallback = (event: PriciEvent) => Promise<void>

export async function registerToEvents(onEvent: OnEventCallback) {
  if (kafkaConfig) {
    console.log('kafka is configured. logging events to kafka');
    const res = await loadKafka();
    if (res) {
      res.run(onEvent).catch()
    }
  }
}

async function loadKafka() {
  if (!kafkaConfig) {
    return;
  }
  const { Kafka } = await import('kafkajs');

  const kafka = new Kafka(kafkaConfig);

  const consumer = kafka.consumer({ groupId: kafkaGroup })
  const producer = kafka.producer();

  await producer.connect()

  const run = async (callback: OnEventCallback) => {
    await consumer.connect()
    await consumer.subscribe({ topic: kafkaTopics.incoming, fromBeginning: true })
    await consumer.run({
      eachMessage: async ({ message }) => {
        try {
          const data = JSON.parse(message.value?.toString() || '{}')
          await callback(data);
        } catch {
          await producer.send({
            topic: kafkaTopics.incomingReply,
            messages: [
              {
                value: JSON.stringify({
                  error: 'failed to parse message',
                  givenMessage: message.value?.toString()
                })
              },
            ],
          })
        }
      },
    });
  }
  process.on('exit', async () => {
    console.log('disconnecting kafka consumer')
    await consumer.disconnect()
    await producer.disconnect()
  });

  return { kafka, run };
}