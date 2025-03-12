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
        const queue = 'hello-world-queue';
        const msg = 'Hello world';

        // Declare queue to send message to
        channel.assertQueue(queue, {
            durable: false
        });

        // Send message to queue
        channel.sendToQueue(queue, Buffer.from(msg));
        console.log(" [x] Sent %s", msg);

        // Close connection and exit
        setTimeout(function () {
            connection.close();
            process.exit(0)
        }, 500);
    });
});