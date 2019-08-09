function bookController(Book){
    function post(req,res){
        const book = new Book(req.body);
        
        if (!req.body.title){
            res.status(400);
            return res.send('Title is required');
        }

        console.log(book);
        book.save();
        res.status(201);
        return res.json(book);
        };
    
    function get(req, res) {
        //These two items are the same, however in ES6 the introduced destructuring which allows us to pull a value out of another object granted they have the same name.
        // --old way--
        //const query = req.query
        // --new way (destructuring)--
        //const {query} = req
        const query = {};
        if(req.query.language){
            query.language = req.query.language;
        }
        else if(req.query.country){
            query.country = req.query.country;
        }

        // Book is being exported from the bookModel file which makes it callable here.
        Book.find(query, (err, books) => {
            if(err){
                return res.send(err);
            }
            const returnBooks = books.map((book) => {
                // Adds (map) a self refrence link to each book within the books array.
                const newBook = book.toJSON();
                newBook.links = {};
                newBook.links.self = `http://${req.headers.host}/api/books/${book._id}`;
                return newBook;
            }) 
            return res.json(returnBooks);
        });
    }

    function getById(req, res){ 
        const returnBook = req.book.toJSON();

        returnBook.links = {}
        const language = req.book.language.replace(' ', '%20');
        const country = req.book.country.replace(' ', '%20');
        returnBook.links.FilterByThisLanguage = `http://${req.headers.host}/api/books/?language=${language}`;
        returnBook.links.FilterByThisCountry = `http://${req.headers.host}/api/books/?country=${country}`;
        
        res.json(returnBook); }

    function put(req, res){
        // This is a great example of the Middleware. As you can see book is already available within the request. This is because of the above middleware. 
        const { book } = req;

        // TODO: use the foreach built in function to better add data here
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
    }

    function patch(req, res){
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
    }

    function bookDelete(req, res){
        req.book.remove((err) =>{
            if (err){
                res.send(err);
            }
            return res.sendStatus(204);
        });
    }

    return {post, get, getById, put, patch, bookDelete};
}

module.exports = bookController;