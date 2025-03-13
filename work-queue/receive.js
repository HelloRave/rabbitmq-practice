import amqp from 'amqplib/callback_api.js';

// Connect to rabbitmq server
amqp.connect('amqp://localhost', function (error0, connection) {
    if (error0) {
        throw error0;
    }
    // Create a channel
    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }
        const queue = 'work-queue';

        // Declare the queue to receive message from; durable: true - queue not lost if rabbitmq server restarts
        channel.assertQueue(queue, {
            durable: true
        });

        /*
            tells RabbitMQ not to give more than one message to a worker at a time. Default is round-robin
        */
        channel.prefetch(1);

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
        // Consume message from queue
        channel.consume(queue, function (msg) {
            const secs = msg.content.toString().split('.').length;

            console.log(" [x] Received %s", msg.content.toString());
            setTimeout(function() {
              console.log(" [x] Done");
              // message acknowledgement
              channel.ack(msg)
            }, secs * 1000);
        }, {
            /*
                In order to make sure a message is never lost, RabbitMQ supports message acknowledgments.
                An ack(nowledgement) is sent back by the consumer to tell RabbitMQ that a particular message has been received,
                processed and that RabbitMQ is free to delete it.

                If a consumer dies (its channel is closed, connection is closed, or TCP connection is lost) without sending an ack,
                RabbitMQ will understand that a message wasn't processed fully and will re-queue it.
            */
            noAck: false
        });
    });
});