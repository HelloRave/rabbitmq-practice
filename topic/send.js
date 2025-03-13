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

        const exchange = 'topic_exchange';
        const args = process.argv.slice(2);
        const msg = 'Hello World!';
        const key = (args.length > 0) ? args[0] : 'anonymous.info';

        // Similar to direct exchange but type: topic
        channel.assertExchange(exchange, 'topic', {
            durable: false
        });

        channel.publish(exchange, key, Buffer.from(msg));
        console.log(" [x] Sent %s: '%s'", key, msg);

        // Close connection and exit
        setTimeout(function () {
            connection.close();
            process.exit(0)
        }, 500);
    });
});