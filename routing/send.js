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

        const exchange = 'direct_exchange';
        const args = process.argv.slice(2);
        const msg = 'Hello World!';
        const severity = (args.length > 0) ? args[0] : 'info';

        /*
            fanout exchange, which doesn't give us much flexibility - it's only capable of mindless broadcasting
            channel.assertExchange(exchange, 'fanout', { durable: false })

            routing algorithm behind a direct exchange is simple - 
            a message goes to the queues whose binding key exactly matches the routing key of the message
        */
        channel.assertExchange(exchange, 'direct', {
            durable: false
        });
        // severity is the routing key here
        channel.publish(exchange, severity, Buffer.from(msg));
        console.log(" [x] Sent %s: '%s'", severity, msg);

        // Close connection and exit
        setTimeout(function () {
            connection.close();
            process.exit(0)
        }, 500);
    });
});