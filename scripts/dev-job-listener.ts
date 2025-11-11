import * as amqplib from "amqplib";

interface Message {
  url: string;
  body: any;
}

(async () => {
  console.log("Starting dev-job-listener...");

  const queue = "dev-jobs";
  const conn = await amqplib.connect(
    "amqp://opennewswire:informationwantstobefree@localhost",
  );

  console.log("Connected to RabbitMQ");

  const ch1 = await conn.createChannel();
  await ch1.assertQueue(queue);

  ch1.consume(queue, async (msg) => {
    if (msg !== null) {
      console.log("Received:", msg.content.toString());
      ch1.ack(msg);

      const content = JSON.parse(msg.content.toString()) as Message;
      console.log(content)

      await fetch(content.url, {
        method: 'POST',
        body: JSON.stringify(content.body)
      })

      console.log("Sync request complete")
    } else {
      console.log("Consumer cancelled by server");
    }
  });

  console.log("Listening for messages...");
})();
