import { qstashClient } from "@/lib/qstash";
import { MessageBroker, MessageBrokerPayload } from "./dispatcher";

const PLATFORM = process.env.PLATFORM ? "-" + process.env.PLATFORM : "";
const QUEUE_NAME = "sync-jobs" + PLATFORM;

const queueFn = qstashClient.queue;

export class QStashBroker implements MessageBroker {
  private queue: ReturnType<typeof queueFn>;

  constructor() {
    this.queue = qstashClient.queue({
      queueName: QUEUE_NAME,
    });
  }

  async publish({ url, body }: MessageBrokerPayload) {
    await this.queue.enqueueJSON({
      url,
      body,
      retries: 0,
    });
  }

  async publishBulk(messages: MessageBrokerPayload[]) {
    await qstashClient.batchJSON(
      messages.map(({ url, body }) => ({
        url,
        body,
        queueName: QUEUE_NAME,
        retries: 0,
      })),
    );
  }
}
