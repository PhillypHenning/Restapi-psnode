const express = require('express');
const booksController = require('../controllers/booksController'); // TODO : Add project level direcotry string to remove static directory strings.

function routes(Book){
    // Gives us access to our API's express Router routes
    const bookRouter = express.Router();
    const controller = booksController(Book);

    bookRouter.route('/books')
    .post(controller.post) //POST - Add new book
    .get(controller.get) // GET - Gets all books

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

    bookRouter.route('/books/:bookId')
    .get(controller.getById) // GET - Find book by ID
    .put(controller.put) // PUT - PUT IN NEW INFO ABOUT A ALREADY EXISTING BOOK
    .patch(controller.patch)    // PATCH - Single book, single item updating.
    .delete(controller.bookDelete);    // DELETE - Deletes a single book

    return bookRouter;
}

module.exports = routes;