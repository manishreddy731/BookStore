require('dotenv').config();
const express = require("express");
const app = express();

const port = process.env.PORT || 8000
const path = require("path");
const Book = require("./models/book");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const User = require("./models/user");
const LocalStrategy = require("passport-local");
const methodOverride = require("method-override"); 
const MongoStore = require('connect-mongo');
const mongoURL =  process.env.mongoURL ||'mongodb://localhost:27017/booksStore'
mongoose
  .connect(mongoURL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MONGO CONNECTION OPEN");
  })
  .catch((err) => {
    console.log("Oh no! MONGO CONNECTION ERROR");
    console.log(err);
  });

  const store = MongoStore.create({
    mongoUrl : mongoURL,
    secret : 'thisshouldbeabettersecret',
    touchAfter : 24*60*60,
  });
  
  store.on("error", function(e) {
    console.log("SESSION STORE ERROR");
})

const sessionConfig = {
  store,
  secret : 'thisshouldbeabettersecret',
  resave: false,
  saveUninitialized: true,
  cookie : {
    httpOnly :true,
    expires: Date.now() + 1000*60*60*24*7,
    maxAge:1000*60*60*24*7
  }
}
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}))
app.use(methodOverride("_method"))
app.use(express.static(path.join(__dirname, "/public")));
app.engine('ejs', ejsMate)
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next)=>{
  // console.log(req.session);
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})

const isLoggedIn = (req, res, next) => {
  if(!req.isAuthenticated()){
    req.session.returnTo =  req.originalUrl
    // req.session.returnTo = req.originalUrl;
    req.flash('error', 'You must be signed in first');
    return res.redirect('/login');
  }
  next();
}

app.get("/books",  async (req, res) => {
    const {author} = req.query;
    if(author){
        const books = await Book.find({author});
        res.render("books/index", { books , author });
    } else {
        const books = await Book.find({});
        //   console.log(books);
        res.render("books/index", {books , author:"ALL"});
}
});

app.get("/books/new", isLoggedIn, async (req, res) => {
    res.render("books/new")
});

app.post("/books", isLoggedIn, async (req, res) => {
    const newBook = new Book(req.body.book);
    await newBook.save();
    req.flash('success' , 'Sucessfully added a new book!' )
    // console.log(newProduct);
    res.redirect(`/books/${newBook.id}`);
})

app.get("/books/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const foundBook = await Book.findById(id);
  if(!foundBook) {
    req.flash('error', 'Book not found!');
    return res.redirect(`/books`);
  }
//   console.log(foundBook);
  res.render(`books/show`, { foundBook});
});

app.get("/books/:id/edit", isLoggedIn, async (req, res) => {
    const {id} = req.params;
    const foundBook = await Book.findById(id);
    if(!foundBook){
      req.flash('error', 'Book not found');
      return res.redirect(`/books`);
    }
    // console.log(foundBook);
    res.render("books/edit", {foundBook});
});

app.put("/books/:id", isLoggedIn, async (req, res) => {
    const {id} = req.params;
    const updatedBook = await Book.findByIdAndUpdate(id, req.body.book, {runvalidators: true, new:true});
    req.flash('success' , 'Sucessfully updated book!' )
    // console.log(req.body)
    res.redirect(`/books/${updatedBook._id}`)
})

app.delete("/books/:id", async (req, res) => {
    const {id} = req.params;
    const deletedBook = await Book.findByIdAndDelete(id);
    // console.log(deletedBook);
    req.flash('success' , 'Sucessfully deleted a book!' )
    res.redirect(`/books`);
});

app.get('/register', (req, res) => {
  res.render('users/register');
})

app.post('/register', async (req, res) => {
  try{
  const {email,username,password} = req.body;
  const user = new User({email, username})
  const registeredUser = await User.register(user, password);
  req.login(registeredUser, err =>{
    if(err) {
      req.flash('error', err.message);
    }
    else{
      req.flash('success' ,'Welcome to BookStore')
      res.redirect('books')
    }
  })

  } catch(e){
  // console.log(registeredUser);
  req.flash('error' , e.message);
  res.redirect(`/register`);
  }
});


app.get('/login', (req, res) => {
  res.render('users/login');
})

app.post('/login',passport.authenticate('local', {failureFlash:true, failureRedirect:'login' ,failureMessage:true, keepSessionInfo:true}) ,async (req, res) => {
  req.flash('success','Welcome Back!')
  const redirectURL = req.session.returnTo || '/books';
    delete req.session.returnTo;
    res.redirect(redirectURL);
});


app.get('/logout' , (req, res) => {
    req.logout(function(err) {
        if (err){
            return next(err);
        }
        req.flash('success', 'Logged You Out');
        res.redirect('/books');
    });
});

app.get("/", (req, res) => {
  res.render("home");
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

