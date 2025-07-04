const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    // required: true,
  },
  author: {
    type: String,
    required: true,
  },
  pages: {
    type: Number,
    required: true,
    min: 0,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type : String,
    required: true,
  },
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
