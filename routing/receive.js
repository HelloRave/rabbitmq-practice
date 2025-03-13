import amqp from 'amqplib/callback_api.js';

const args = process.argv.slice(2);

if (args.length == 0) {
    console.log("Usage: receive_logs_direct.js [info] [warning] [error]");
    process.exit(1);
}

amqp.connect('amqp://localhost', function (error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }
        const exchange = 'direct_exchange';

        channel.assertExchange(exchange, 'direct', {
            durable: false
        });

        channel.assertQueue('', {
            exclusive: true
        }, function (error2, q) {
            if (error2) {
                throw error2;
            }
            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);

            args.forEach(function (severity) {
                // severity is the binding key - queue will be bound to exchange if binding key = routing key in exchange
                // eg. receiving: node routing/receive.js info warning 
                // eg. sending: node routing/send.js info - sends to receiving queue above
                // eg. sending: node routing/send.js error - does not send to receiving queue above
                channel.bindQueue(q.queue, exchange, severity);
            });

            channel.consume(q.queue, function (msg) {
                console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());
            }, {
                noAck: true
            });
        });
    });
});