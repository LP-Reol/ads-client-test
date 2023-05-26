
const express = require('express'); //Import the express dependency
const ads = require('ads-client')

const app = express();              //Instantiate an express app, the main work horse of this server
const port = 8000;                  //Save the port number where your server will be listening

const client = new ads.Client({
    targetAmsNetId: 'localhost',
    targetAdsPort: 851,
})

client.connect()
    .then(res => {
        console.log('Connected to the ${res.targetAmsNetId}')
        console.log('Router assigned us AmsNetId ${res.localAmsNetId} and port ${res.localAdsPort}')
        return client.disconnect()
    })
    .then(() => {
        console.log('Disconnected')
    })
    .catch(err => {
        console.log('Something Failed:', err)
    })

//Idiomatic expression in express to route and respond to a client request
app.get('/', (req, res) => {        //get requests to the root ("/") will route here
    res.sendFile('index.html', {root: __dirname});      //server responds by sending the index.html file to the client's browser
                                                        //the .sendFile method needs the absolute path to the file, see: https://expressjs.com/en/4x/api.html#res.sendFile 
});

app.listen(port, () => {            //server starts listening for any attempts from a client to connect at port: {port}
    console.log(`Now listening on port ${port}`); 
});