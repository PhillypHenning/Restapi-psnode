const express = require('express');
const mongoose = require('mongoose');

const app = express();
// Creates a database connection to our mongodb
// bookAPI is the collection name within mongo
const db = mongoose.connect('mongodb://localhost/bookAPI');
const port = process.env.PORT || 3000;
const bookRouter = express.Router();
const Book = require('./models/bookModel');

bookRouter.route('/books')
    .get((req, res) => {

        //These two items are the same, however in ES6 the introduced destructuring which allows us to pull a value out of another object granted they have the same name.
        // --old way--
        //const query = req.query
        // --new way (destructuring)--
        //const {query} = req

        const query = {};
        if(req.query.language){
            query.language = req.query.language;
        }

        // Book is being exported from the bookModel file which makes it callable here.
        Book.find(query, (err, books) => {
            if(err){
                return res.send(err);
            }
            return res.json(books);
        });
    });

bookRouter.route('/books/:bookId')
    .get((req, res) => {

        const query = {};
        if(req.query.language){
            query.language = req.query.language;
        }

        Book.findById(req.params.bookId, (err, book) => {
            if(err){
                return res.send(err);
            }
            return res.json(book);
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
