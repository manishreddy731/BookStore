const Book = require("./models/Book");
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/booksStore")
  .then(() => {
    console.log("MONGO CONNECTION OPEN");
  })
  .catch((err) => {
    console.log("Oh no! MONGO CONNECTION ERROR");
    console.log(err);
  });

// const b = new Book({
//   name: "Harry Potter and the Sorcerer's Stone",
//   img: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1474154022i/3._SY180_.jpg",
//   author: "J. K. Rowling",
//   pages: 223,
//   price: 500,
// });

// b.save()
//   .then((p) => console.log(p))
//   .catch((err) => console.log(err));


const seedBooks = [
  {
    name: "Harry Potter and the Sorcerer's Stone",
    img: "https://images.unsplash.com/photo-1600189261867-30e5ffe7b8da?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8aGFycnklMjBwb3R0ZXIlMjBib29rc3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
    author: "J. K. Rowling",
    pages: 290,
    price: 515,
    description: "Harry Potter's life is miserable. His parents are dead and he's stuck with his heartless relatives, who force him to live in a tiny closet under the stairs. But his fortune changes when he receives a letter that tells him the truth about himself: he's a wizard. A mysterious visitor rescues him from his relatives and takes him to his new home, Hogwarts School of Witchcraft and Wizardry."
  },
  {
    name: "Harry Potter and the Chamber of Secrets",
    img: "https://images.unsplash.com/photo-1616864814886-60cbfcac88c8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aGFycnklMjBwb3R0ZXIlMjBhbmQlMjB0aGUlMjBjaGFtYmVyJTIwb2YlMjBzZWNyZXRzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
    author: "J. K. Rowling",
    pages: 260,
    price: 550,
    description: "Ever since Harry Potter had come home for the summer, the Dursleys had been so mean and hideous that all Harry wanted was to get back to the Hogwarts School for Witchcraft and Wizardry. But just as he’s packing his bags, Harry receives a warning from a strange impish creature who says that if Harry returns to Hogwarts, disaster will strike."
  },
  {
    name: "Harry Potter and the Prisoner of Azkaban",
    img: "https://images.unsplash.com/photo-1618666012174-83b441c0bc76?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8aGFycnklMjBwb3R0ZXIlMjBib29rc3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
    author: "J. K. Rowling",
    pages: 245,
    price: 540,
    description:"During his third year at Hogwarts School for Witchcraft and Wizardry, Harry Potter must confront the devious and dangerous wizard responsible for his parents' deaths."
  },
  {
    name: "Harry Potter and the Goblet of Fire",
    img: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1554006152i/6._SX120_.jpg",
    author: "J. K. Rowling",
    pages: 210,
    price: 700,
    description:"Harry Potter is midway through his training as a wizard and his coming of age. Harry wants to get away from the pernicious Dursleys and go to the International Quidditch Cup with Hermione, Ron, and the Weasleys. He wants to dream about Cho Chang, his crush (and maybe do more than dream). He wants to find out about the mysterious event that's supposed to take place at Hogwarts this year, an event involving two other rival schools of magic, and a competition that hasn't happened for hundreds of years. He wants to be a normal, fourteen-year-old wizard. But unfortunately for Harry Potter, he's not normal - even by wizarding standards."
  },
  {
    name: "Harry Potter and the Order of the Phoenix",
    img: "https://images.unsplash.com/photo-1609866138210-84bb689f3c61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fGhhcnJ5JTIwcG90dGVyJTIwYm9va3N8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
    author: "J. K. Rowling",
    pages: 230,
    price: 590,
    description:"There is a door at the end of a silent corridor. And it’s haunting Harry Potter’s dreams. Why else would he be waking in the middle of the night, screaming in terror?"
  },
  {
    name: "Harry Potter and the Half-Blood Prince",
    img: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1587697303i/1._SX120_.jpg",
    author: "J. K. Rowling",
    pages: 300,
    price: 1000,
    description:"The war against Voldemort is not going well; even Muggle governments are noticing. Ron scans the obituary pages of the Daily Prophet, looking for familiar names. Dumbledore is absent from Hogwarts for long stretches of time, and the Order of the Phoenix has already suffered losses."
  },
];

const seedDB = async() =>{
  await Book.deleteMany({});
  await Book.insertMany(seedBooks)
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });
}
seedDB().then(()=>{
  mongoose.connection.close();
})

