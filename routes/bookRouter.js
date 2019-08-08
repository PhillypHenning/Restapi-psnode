const express = require('express');

function routes(Book){
    // Gives us access to our API's express Router routes
    const bookRouter = express.Router();

    bookRouter.route('/books')
    // POST - Add book
    .post((req,res)=>{
    const book = new Book(req.body);

    console.log(book);
    book.save();
    return res.status(201).json(book)
    })

    //GET - Display all books
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

    // GET - Find book by ID
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

    return bookRouter;
}

module.exports = routes;