const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
// Creates a database connection to our mongodb
// bookAPI is the collection name within mongo
const db = mongoose.connect('mongodb://localhost/bookAPI');
const port = process.env.PORT || 3000;
const Book = require('./models/bookModel');
const bookRouter = require('./routes/bookRouter')(Book);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Bind the 'api' string to the application middlewear then binds the 'bookRouter' route. 
app.use('/api', bookRouter);

app.get('/', (req, res)=>{
    res.send('Welcome to my api');
});

app.listen(port, ()=>{
    console.log(`Running on port ${port}`);
});
