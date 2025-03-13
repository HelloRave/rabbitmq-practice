import amqp from 'amqplib/callback_api.js';

// Connect to rabbitmq server
amqp.connect('amqp://localhost', function (error0, connection) {
    if (error0) {
        console.log(error0)
    }
    // Create channel
    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }
        const queue = 'work-queue';
        const msg = Array.from({ length: Math.ceil(Math.random() * 5) }, () => ".").join(" ")

        // Declare queue to send message to; durable: true - queue not lost if rabbitmq server restarts
        channel.assertQueue(queue, {
            durable: true
        });

        // Send message to queue; persistent: true - rabbitmq saves message to disk
        channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
        console.log(" [x] Sent %s", msg);

        // Close connection and exit
        setTimeout(function () {
            connection.close();
            process.exit(0)
        }, 500);
    });
});