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
        const exchange = 'topic_exchange';

        /*
            Topic exchange is powerful and can behave like other exchanges.

            When a queue is bound with # (hash) binding key 
            - it will receive all the messages, regardless of the routing key 
            - like in fanout exchange.

            When special characters * (star) and # (hash) aren't used in bindings, 
            the topic exchange will behave just like a direct one.
        */
        channel.assertExchange(exchange, 'topic', {
            durable: false
        });

        channel.assertQueue('', {
            exclusive: true
        }, function (error2, q) {
            if (error2) {
                throw error2;
            }
            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);

            args.forEach(function (key) {
                /*
                    eg. send: node topic/send.js [args] - 1st queue receive a.c, both queues receive a.c.c
                    eg. receive: node topic/receive.js *.b.c a.#
                    eg. receive: node topic/receive.js a.*.c
                */
                channel.bindQueue(q.queue, exchange, key);
            });

            channel.consume(q.queue, function (msg) {
                console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());
            }, {
                noAck: true
            });
        });
    });
});