const express = require('express'); //Import the express dependency
const ads = require('ads-client')

const app = express();     // Instantiate an express app, the main work horse of this server
const port = 8000;              // Save the port number where your server will be listening

const client = new ads.Client({
    localAmsNetId: '192.168.0.20.1.1',  // Can be anything but needs to be in PLC StaticRoutes.xml file
    localAdsPort: 32750,                // Can be anything that is not used
    targetAmsNetId: '172.16.21.180.1.1',
    targetAdsPort: 851,
    routerAddress: '192.168.0.30',
    routerTcpPort: 48898
})

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
