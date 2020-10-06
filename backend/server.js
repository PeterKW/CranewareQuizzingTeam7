const express = require('express');

const app = express();

app.listen(3000)

app.get('/test', (req, res) => {

    res.send('<p>hello team 7</p>');
})