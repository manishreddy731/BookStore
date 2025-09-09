require('dotenv').config();
const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const methodOverride = require("method-override"); 
const MongoStore = require('connect-mongo');

const Book = require("./models/book");
const User = require("./models/user");

// Helper to catch async errors
const catchAsync = (fn) => {
    return function(req, res, next){
        fn(req, res, next).catch(next);
    }
}

// MongoDB connection
const mongoURL = process.env.MONGO_URI || 'mongodb://localhost:27017/booksStore';
mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log("MongoDB connection error:", err));

// Session store
const store = MongoStore.create({
    mongoUrl: mongoURL,
    secret: 'thisshouldbeabettersecret',
    touchAfter: 24*60*60
});
store.on("error", e => console.log("SESSION STORE ERROR", e));

// Express config
app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")));

// Session & flash
app.use(session({
    store,
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: { httpOnly: true, expires: Date.now()+1000*60*60*24*7, maxAge: 1000*60*60*24*7 }
}));
app.use(flash());

// Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Locals
app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// Middleware
const isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first');
        return res.redirect('/login');
    }
    next();
};

// Routes

app.get("/", (req,res) => res.render("home"));

// BOOK ROUTES
app.get("/books", catchAsync(async (req,res)=>{
    const {author} = req.query;
    const books = author ? await Book.find({author}) : await Book.find({});
    res.render("books/index", { books, author: author || "ALL" });
}));

app.get("/books/new", isLoggedIn, (req,res)=> res.render("books/new"));

app.post("/books", isLoggedIn, catchAsync(async (req,res)=>{
    const newBook = new Book(req.body.book);
    await newBook.save();
    req.flash('success', 'Successfully added a new book!');
    res.redirect(`/books/${newBook.id}`);
}));

app.get("/books/:id", isLoggedIn, catchAsync(async (req,res)=>{
    const {id} = req.params;
    const foundBook = await Book.findById(id);
    if(!foundBook){
        req.flash('error', 'Book not found!');
        return res.redirect('/books');
    }
    res.render("books/show", { foundBook });
}));

app.get("/books/:id/edit", isLoggedIn, catchAsync(async (req,res)=>{
    const {id} = req.params;
    const foundBook = await Book.findById(id);
    if(!foundBook){
        req.flash('error', 'Book not found');
        return res.redirect(`/books`);
    }
    res.render("books/edit", { foundBook });
}));

app.put("/books/:id", isLoggedIn, catchAsync(async (req,res)=>{
    const {id} = req.params;
    const updatedBook = await Book.findByIdAndUpdate(id, req.body.book, { runValidators: true, new: true });
    req.flash('success', 'Successfully updated book!');
    res.redirect(`/books/${updatedBook._id}`);
}));

app.delete("/books/:id", catchAsync(async (req,res)=>{
    const {id} = req.params;
    await Book.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted a book!');
    res.redirect("/books");
}));

// USER ROUTES
app.get('/register', (req,res) => res.render('users/register'));

app.post('/register', catchAsync(async (req,res)=>{
    const {email, username, password} = req.body;
    const user = new User({email, username});
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err => {
        if(err){
            req.flash('error', err.message);
            return res.redirect('/register');
        }
        req.flash('success', 'Welcome to BookStore!');
        res.redirect('/books');
    });
}));

app.get('/login', (req,res) => res.render('users/login'));

app.post('/login', passport.authenticate('local', {failureFlash:true, failureRedirect:'/login', failureMessage:true, keepSessionInfo:true}), (req,res)=>{
    req.flash('success', 'Welcome Back!');
    const redirectURL = req.session.returnTo || '/books';
    delete req.session.returnTo;
    res.redirect(redirectURL);
});

app.get('/logout', (req,res,next) => {
    req.logout(function(err){
        if(err) return next(err);
        req.flash('success', 'Logged You Out');
        res.redirect('/books');
    });
});

// ERROR HANDLING
app.use((err, req, res, next)=>{
    console.log(err);
    req.flash('error', err.message);
    res.redirect('/books');
});

// Start server
app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
});
