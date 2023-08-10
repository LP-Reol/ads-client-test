const express = require('express'); //Import the express dependency
const ads = require('ads-client')

const app = express();     // Instantiate an express app, the main work horse of this server
const port = 8000;              // Save the port number where your server will be listening

const client = new ads.Client({

    // Setup 2: client <-> client ADS router <-> PLC ADS router <-> PLC
    targetAmsNetId: "10.3.0.20.1.1",
    targetAdsPort: 851,

    // Setup 3: client <-> PLC ADS router <-> PLC
    // localAmsNetId: "192.168.0.2.1.1",
    // localAdsPort: 32752,
    // targetAmsNetId: "10.3.0.20.1.1",
    // targetAdsPort: 851,
    // routerAddress: "192.168.0.13",
    // routerTcpPort: 48898,
})

// Enable verbose debug output
// client.setDebugging(3)

client.connect()
    .then(res => {
        console.log(`Connected to the ${res.targetAmsNetId}`)
        console.log(`Router assigned us AmsNetId ${res.localAmsNetId} and port ${res.localAdsPort}`)
        client.subscribe('MAIN.cnt',
            (res) => console.log(`cnt = ${res.value}`))
    })
    .then(() => {
        console.log('Disconnected')
    })
    .catch(err => {
        console.log('Something Failed:', err)
    })

// HTTP server
app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
});

process.on('SIGINT', function () {
    console.log("Caught interrupt signal, disconnecting ADS ...")
    client.disconnect().finally(() => process.exit())
});
