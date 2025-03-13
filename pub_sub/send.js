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
        const exchange = 'pub-sub-exchange';
        const msg = 'Hello World';

        // Declare exchange to send message to; types of exchange: direct, topic, headers and fanout
        channel.assertExchange(exchange, 'fanout', { durable: false })

        // Publish to exchange; second argument set as empty string to specify to not send to specific queue
        channel.publish(exchange, '', Buffer.from(msg));
        console.log(" [x] Sent %s", msg);

        // Close connection and exit
        setTimeout(function () {
            connection.close();
            process.exit(0)
        }, 500);
    });
});