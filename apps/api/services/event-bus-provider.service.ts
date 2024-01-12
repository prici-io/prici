import { kafkaConfig, kafkaGroup, kafkaTopics } from '../config';


export async function registerToEvents() {
  if (kafkaConfig) {
    const res = await loadKafka();
    if (res) {
      res.run();
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

  const run = async (callback?: () => void) => {
    await consumer.connect()
    await consumer.subscribe({ topic: kafkaTopics.incoming, fromBeginning: true })
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {

        const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`
        console.log(`- ${prefix} ${message.key}#${message.value}`)
      },
    });
  }

  return { kafka, run };
}