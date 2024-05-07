const mdns = require('multicast-dns')();

const serviceName = '_p2p-file-transfer._tcp.local';

// Listening for responses
mdns.on('response', (response) => {
    response.answers.forEach(answer => {
        if (answer.name === serviceName && answer.type === 'SRV') {
            console.log(`Found peer at ${answer.data.target}: ${answer.data.port}`);
        }
    });
});

// Broadcasting presence
function advertise() {
    mdns.query({
        questions: [{
            name: serviceName,
            type: 'SRV'
        }]
    });
}

// Setting the advertise invterval for every 5 seconds
setInterval(advertise, 5000);