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

        const exchange = 'pub-sub-exchange';

        channel.assertExchange(exchange, 'fanout', {
          durable: false
        });
    
        /*
            Supply queue name as an empty string, we create a non-durable queue with a generated name.
            When the connection that declared it closes, the queue will be deleted because it is declared as exclusive
        */
        channel.assertQueue('', {
          exclusive: true
        }, function(error2, q) {
          if (error2) {
            throw error2;
          }
          console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
          // Tell the exchange to send messages to our queue.
          // That relationship between exchange and a queue is called a binding.  
          channel.bindQueue(q.queue, exchange, '');
    
          channel.consume(q.queue, function(msg) {
              if(msg.content) {
                console.log(" [x] %s", msg.content.toString());
              }
          }, {
            noAck: true
          }) });
    });
});