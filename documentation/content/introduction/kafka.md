# Kafka Integration

Some Prici feature are asynchronous and can be available via a Kafka broker to work.

## Available environment variables

| Name                             | Description                                                                                 | Required? | Default value          |
|----------------------------------|---------------------------------------------------------------------------------------------|-----------|------------------------|
| KAFKA_URL                        | Kafka broker URL (multiple URLs can be split with comma)                                    | Yes       | -                      |
| KAFKA_CLIENT_ID                  | Kafka client ID                                                                             | No        | 'prici-api'            |
| KAFKA_GROUP_ID                   | Kafka group ID                                                                              | No        | 'prici-api'            |
| KAFKA_SASL_MECHANISM             | SASL mechanism                                                                              | No        | 'plain'                |
| KAFKA_USERNAME                   | SASL username                                                                               | No        | -                      |
| KAFKA_PASSWORD                   | SASL password                                                                               | No        | -                      |
| KAFKA_CERT_PATH                  | Path to the certificate folder (must inclde files: ca.crt, client-key.pem, client-cert.pem) | No        | 'kafka-cert'           |
| KAFKA_SSL                        | Enable SSL (insert "true" as string to enable)                                              | No        | 'false'                |
| KAFKA_TOPIC_INCOMING             | Incoming topic name                                                                         | No        | 'prici-incoming'       |
| KAFKA_TOPIC_OUTGOING             | Outgoing topic name                                                                         | No        | 'prici-outgoing'       |
| KAFKA_TOPIC_INCOMING_REPLY       | Incoming reply topic name                                                                   | No        | 'prici-incoming-reply' |
| KAFKA_TOPIC_INCOMING_DEAD_LETTER | Incoming dead letter topic name                                                             | No        | -                      |