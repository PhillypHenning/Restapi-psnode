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

    // Creates a middleware function specifically for the '/book/:bookId' route. This function does a small piece of work then calls next() which allows the function call to continue. 
    bookRouter.use('/books/:bookId', (req, res, next) =>{
        Book.findById(req.params.bookId, (err, book) => {
            if(err){
                return res.send(err);
            }
            if(book){
                req.book = book;
                return next();
            }
            return res.sendStatus(404);
        });
    });

    // GET - Find book by ID
    bookRouter.route('/books/:bookId')
    .get((req, res) => { res.json(req.book); })

    // PUT - PUT IN NEW INFO ABOUT A ALREADY EXISTING BOOK
    .put((req, res) => {
        // This is a great example of the Middleware. As you can see book is already available within the request. This is because of the above middleware. 
        const { book } = req;
        book.title = req.body.title;
        book.author = req.body.author;
        book.country = req.body.country;
        book.language = req.body.language;
        book.pages = req.body.pages;
        book.year = req.body.year;

        req.book.save((err) =>{
            if(err){
                return res.send(err);
            }
            return res.json(book);
        });
    })
    
    // PATCH - Single book, single item updating.
    .patch((req, res) =>{
        const { book } = req;

        // Ids are not to be updated.
        if (req.body._id){
            delete req.body._id;
        }
        
        Object.entries(req.body).forEach((item) => {
            const key = item[0];
            const value = item[1];
            book[key] = value;
        });

        req.book.save((err) =>{
            if(err){
                return res.send(err);
            }
            return res.json(book);
        });
    })

    // DELETE - Deletes a single book
    .delete((req, res) => {
        req.book.remove((err) =>{
            if (err){
                res.send(err);
            }
            return res.sendStatus(204);
        });
    });

    return bookRouter;
}

module.exports = routes;