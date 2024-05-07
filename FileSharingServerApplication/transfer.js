const fs = require('fs');
const net = require('net');
const port = 12345; // MAKE SURE THIS MATCHES ON DISCOVERY.JS RESPONSE

// TCP server
const server = net.createServer(socket => {
    const writeStream = fs.createWriteStream('received_file.txt');
    socket.pipe(writeStream);
    socket.on('end', () => console.log('File transferred successfully.'));
});

server.listen(port, () => console.log(`Server listening on port ${port}`));

// Send file function 
functionSendFile(targetIp, filePath) {
    const readStream = fs.createReadStream(filePath);
    const client = new net.Socket();
    client.connect(port, targetIp, () => {
        readStream.pipe(client);
    });
}

// Export function
module.exports = { sendFile };