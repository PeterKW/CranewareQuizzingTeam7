const express = require('express');

const app = express();
const ports = 3000

app.listen(ports)

//Responds to request for test page
app.get('/test', (req, res) => {
    //TODO get actual webpage to respond
    res.send('<p>hello team 7</p>');
})

//Responds to request for home page
app.get('/home', (req, res) => {
    //TODO get actual webpage to respond
    res.send('<p>Homepage</p>');
})

//Responds 404 if page requested is not known
app.use((req, res) => {
    res.status(404).send('<h2>404 Page Not Found</h2>');
})
