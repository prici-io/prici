import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { KafkaConfig, Mechanism, SASLOptions } from 'kafkajs';

export const defaultTenant = process.env.DEFAULT_TENANT || 'default'

export const jwtSecret: string = getJwtSecret();

export const port = Number(process.env.PORT || 9000);

export const host = process.env.HOST || '0.0.0.0';


export const kafkaTopics = {
  incoming: process.env.KAFKA_TOPIC_INCOMING || 'prici-incoming',
  outgoing: process.env.KAFKA_TOPIC_OUTGOING || 'prici-outgoing',
  incomingReply: process.env.KAFKA_TOPIC_INCOMING_REPLY || 'prici-incoming-reply',
  incomingDeadLetter: process.env.KAFKA_TOPIC_INCOMING_DEAD_LETTER,
};
export const kafkaGroup = process.env.KAFKA_GROUP_ID || 'prici-api';

export const kafkaConfig = getKafkaConfig();

function getKafkaConfig(): KafkaConfig | undefined {
  if (!process.env.KAFKA_URL) {
    return;
  }

  const brokers = process.env.KAFKA_URL.split(',');
  const clientId = process.env.KAFKA_CLIENT_ID || 'prici-api'
  const saslMechanism = process.env.KAFKA_SASL_MECHANISM as 'plain' | undefined

  let sasl: SASLOptions | Mechanism | undefined
  if (saslMechanism === 'plain') {
    sasl = {
      mechanism: saslMechanism,
      username: process.env.KAFKA_USERNAME as string,
      password: process.env.KAFKA_PASSWORD as string
    }
  } else {
    const kafkaCertPath = process.env.KAFKA_CERT_PATH || join(process.cwd(), 'kafka-cert');
    if (existsSync(kafkaCertPath)) {
      sasl = {
        // @ts-ignore
        ca: [readFileSync(join(kafkaCertPath, 'ca.crt'), 'utf8').toString()],
        key: readFileSync(join(kafkaCertPath, 'client-key.pem'), 'utf8') as string,
        cert: readFileSync(join(kafkaCertPath, 'client-cert.pem'), 'utf8') as string,
      }
    }
  }

  return {
    clientId,
    brokers,
    ssl: process.env.KAFKA_SSL === 'true',
    sasl
  };
}

function getJwtSecret() {
  const privateKeyPath = process.env.PRIVATE_KEY_PATH || join(process.cwd(), 'private_key.pem');
  return existsSync(privateKeyPath) ? readFileSync(privateKeyPath, 'utf8') : process.env.JWT_SECRET || 'default';
}