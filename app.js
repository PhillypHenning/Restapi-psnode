const express = require('express');
const mongoose = require('mongoose');

const app = express();
// Creates a database connection to our mongodb
const db = mongoose.connect('mongodb://localhost/bookAPI');
const port = process.env.PORT || 3000;
const bookRouter = express.Router();
const Book = require('./models/bookModel');

bookRouter.route('/books')
    .get((req, res) => {
        // Book is being exported from the bookModel file which makes it callable here.
        Book.find((err, books) => {
            if(err){
                return res.send(err);
            }
            return res.json(books);
        });
    });

// Bind the 'api' string to the application middlewear then binds the 'bookRouter' route. 
app.use('/api', bookRouter);

app.get('/', (req, res)=>{
    res.send('Welcome to my api');
});

app.listen(port, ()=>{
    console.log(`Running on port ${port}`);
});
