const WebSocket = require('ws');
const path = require('path');
const express = require('express');
const db = require('./database');
const app = express();
const port = 3000;

const wss = new WebSocket.Server({ port: 8080 });

// Setting EJS as the default engine
app.set('view engine', 'ejs');

// Setting the views directory
app.set('views', path.join(__dirname, 'views'));

// Creating the routes between the different web pages
app.get('/', async (req, res) => {
   try {
      const users = await db.getAllUsers(); // Make sure db.getAllUsers() is an async function
      res.render('index', {
          currentTime: new Date().toTimeString(),
          users: users
      });
  } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).send('Error fetching user data');
  }
});

app.get('/about', (req, res) => {
   res.render('about')
});

app.get('/contact', (req, res) => {
   res.render('contact')
});

app.get('/new', (req, res) => {
   res.render('new')
});

app.get('/known', (req, res) => {
   res.render('known')
});

// Routing for error 404
app.use((err, req, res, next) => {
   console.error(err.stack);
   res.status(404).render('404', {title: '404: Page Not Found'});
});

// Error handling for unforeseen server issues
app.use((err, req, res, next) => {
   console.error(err.stack); // Logging for debugging
   res.status(500).render('500', { title: '500: Internal Server Error' });
});

// Serving up static files from the public directory
app.use(express.static('public'));

// Creating an event listener for the port and logging to the console where the hosted page is addressed to
app.listen(port, () => {
   console.log(`Server running on http://localhost:${port}`);
});

// IMPORTANT NOTE: THIS NEEDS TO BE SECURE. USE FIREWALLS AND HTTPS. LOOK FOR THE TOOL 'Let's Encrypt'
/* app.listen(port, '0.0.0.0', () => {
   console.log(`Server running on http://0.0.0.0:${port}`) // for when I can launch the server for external connections outside the local network
}); */ // Check out Dynamic DNS so as to not be forced to use a static ip

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

