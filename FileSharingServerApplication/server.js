const WebSocket = require('ws');
const path = require('path');
const express = require('express');
const app = express();
const port = 3000;

const wss = new WebSocket.Server({ port: 8080 });

// Serving up static files from the public directory
app.use(express.static('public'));

app.listen(port, () => {
   console.log(`Server running on http://localhost:${port}`);
});

wss.on('connection', function connection(ws) {
   console.log('A new connection has been established.');

   // For processing incoming messages
   ws.on('message', function incoming(message) {
      console.log('received %s', message);

      // Broadcasting message while also excluding the sender
      wss.clients.forEach(function each(client) {
         if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(message);
         }
      });
   });

   // Disconnecting
   ws.on('close', () => {
      console.log('Client has disconnected.');
   });
});

console.log('Signaling server running on ws://localhost:8080');


// Brendan is a retard