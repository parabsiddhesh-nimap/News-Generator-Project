// API key :- 161dfbada0f34bb88bb6856d27ed0946

var express = require('express');
const axios = require('axios');
var path = require('path');
require('./models');
require('dotenv').config();

var app = express();
var customerRoute = require('./routes/customer');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(customerRoute);

// app.get('/', async (req,res) => {
//     const { q } = req.query;
//     q ? q.split(' ').join('+') : 'internation+news';
//     await axios.get(`https://newsapi.org/v2/everything?apiKey=${process.env.API_KEY}&q=${q}`)
//     .then(response => {
//         let data = response.data.articles;
//         res.status(200).send(data)
//     })
//     .catch(err => console.log(err))
// });

app.listen(3000);

