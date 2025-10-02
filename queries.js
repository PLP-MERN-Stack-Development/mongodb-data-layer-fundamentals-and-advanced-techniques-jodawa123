
// Connect to MongoDB (replace with your connection string if using Atlas)
const uri = 'mongodb://localhost:27017';
const dbName = 'plp_bookstore';
const collectionName = 'books';

// =============================================
// TASK 2: BASIC CRUD OPERATIONS
// =============================================

// 1. Find all books in a specific genre
db.books.find({ genre: "Fiction" });

// 2. Find books published after a certain year
db.books.find({ published_year: { $gt: 1950 } });

// 3. Find books by a specific author
db.books.find({ author: "George Orwell" });

// 4. Update the price of a specific book
db.books.updateOne(
  { title: "The Great Gatsby" },
  { $set: { price: 11.99 } }
);

// 5. Delete a book by its title
db.books.deleteOne({ title: "Moby Dick" });

// =============================================
// TASK 3: ADVANCED QUERIES
// =============================================

// 1. Find books that are both in stock and published after 2010
db.books.find({ 
  $and: [
    { in_stock: true },
    { published_year: { $gt: 2010 } }
  ]
});

// 2. Use projection to return only title, author, and price fields
db.books.find(
  { genre: "Fiction" },
  { title: 1, author: 1, price: 1, _id: 0 }
);

// 3. Implement sorting by price (ascending)
db.books.find().sort({ price: 1 });

// 4. Implement sorting by price (descending)
db.books.find().sort({ price: -1 });

// 5. Implement pagination (5 books per page, page 1)
db.books.find().limit(5).skip(0);

// 6. Implement pagination (5 books per page, page 2)
db.books.find().limit(5).skip(5);

// =============================================
// TASK 4: AGGREGATION PIPELINE
// =============================================

// 1. Calculate the average price of books by genre
db.books.aggregate([
  {
    $group: {
      _id: "$genre",
      averagePrice: { $avg: "$price" },
      count: { $sum: 1 }
    }
  },
  {
    $sort: { averagePrice: -1 }
  }
]);

// 2. Find the author with the most books in the collection
db.books.aggregate([
  {
    $group: {
      _id: "$author",
      bookCount: { $sum: 1 }
    }
  },
  {
    $sort: { bookCount: -1 }
  },
  {
    $limit: 1
  }
]);

// 3. Group books by publication decade and count them
db.books.aggregate([
  {
    $project: {
      title: 1,
      published_year: 1,
      decade: {
        $subtract: [
          "$published_year",
          { $mod: ["$published_year", 10] }
        ]
      }
    }
  },
  {
    $group: {
      _id: "$decade",
      bookCount: { $sum: 1 },
      books: { $push: "$title" }
    }
  },
  {
    $sort: { _id: 1 }
  }
]);

// =============================================
// TASK 5: INDEXING
// =============================================

// 1. Create an index on the title field
db.books.createIndex({ title: 1 });

// 2. Create a compound index on author and published_year
db.books.createIndex({ author: 1, published_year: 1 });

// 3. Use explain() to demonstrate performance improvement

// Without index (on a field without index, like publisher)
db.books.find({ publisher: "HarperOne" }).explain("executionStats");

// With index (on title field)
db.books.find({ title: "The Alchemist" }).explain("executionStats");

// With compound index
db.books.find({ 
  author: "J.R.R. Tolkien", 
  published_year: { $gte: 1950 } 
}).explain("executionStats");

// =============================================
// ADDITIONAL USEFUL QUERIES
// =============================================

// Find books with specific price range
db.books.find({
  price: { $gte: 10, $lte: 15 }
});

// Find books by multiple authors
db.books.find({
  author: { $in: ["George Orwell", "J.R.R. Tolkien"] }
});

// Count total number of books
db.books.countDocuments();

// Find books with more than 300 pages
db.books.find({ pages: { $gt: 300 } });

// Update multiple documents (increase price by 10% for all books)
db.books.updateMany(
  {},
  { $mul: { price: 1.1 } }
);

// Find distinct genres in the collection
db.books.distinct("genre");