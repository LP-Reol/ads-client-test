const express = require('express'); //Import the express dependency
const ads = require('ads-client')

const app = express();     // Instantiate an express app, the main work horse of this server
const port = 8000;              // Save the port number where your server will be listening

// const client = new ads.Client({
//     localAmsNetId: '192.168.56.1.1.1',  // Can be anything but needs to be in PLC StaticRoutes.xml file
//     localAdsPort: 32750,                // Can be anything that is not used
//     targetAmsNetId: '5.95.200.189.1.1',
//     targetAdsPort: 851,
//     routerAddress: '169.254.9.60',
//     routerTcpPort: 48898
// })

// const client = new ads.Client({
//     localAmsNetId: '192.168.56.1.1.1',  // Can be anything but needs to be in PLC StaticRoutes.xml file
//     localAdsPort: 32750,                // Can be anything that is not used
//     targetAmsNetId: '172.16.21.180.1.1',
//     targetAdsPort: 851,
//     routerAddress: '169.254.233.76',
//     routerTcpPort: 48898
// })

// const client = new ads.Client({
//     targetAmsNetId: '192.168.56.1.1.1',
//     targetAdsPort: 851,
// })

const client = new ads.Client({
    targetAmsNetId: '5.95.200.189.1.1',
    targetAdsPort: 851,
})
// client.setDebugging(4)
client.connect()
    .then(res => {
        console.log(`Connected to the ${res.targetAmsNetId}`)
        console.log(`Router assigned us AmsNetId ${res.localAmsNetId} and port ${res.localAdsPort}`)
        client.readSymbol('MAIN.sMachineState').then((res) => {
            console.log(`sMachineState = ${res.value}`)
            return client.disconnect()
        })
    })
    .then(() => {
        console.log('Disconnected')
    })
    .catch(err => {
        console.log('Something Failed:', err)
    })

app.listen(port, () => {            //server starts listening for any attempts from a client to connect at port: {port}
    console.log(`Now listening on port ${port}`);
});
