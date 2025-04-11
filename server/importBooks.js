const mongoose = require('mongoose');
const xlsx = require('xlsx');
const Book = require('./models/book'); // Updated to use lowercase filename

// Load the .env file for sensitive information
require('dotenv').config();

// Connect to MongoDB
const connectToDB = async () => {
    try {
        const uri = process.env.MONGODB_URI; // MongoDB URI from .env file
        console.log('MongoDB URI:', uri);
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

// Read data from the Excel file
const importBooks = async () => {
    try {
        const workbook = xlsx.readFile('./data/books.xlsx'); // Ensure the file path is correct
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Convert the sheet data to JSON
        const books = xlsx.utils.sheet_to_json(sheet);

        console.log(`Found ${books.length} books in the spreadsheet`);

        // Loop through each book and import it into MongoDB
        for (const bookData of books) {
            // Ensure the bookId is a string (or whatever format you prefer)
            const book = new Book({
                bookId: bookData.bookId ? String(bookData.bookId) : '',
                author: bookData.author,
                title: bookData.title,
                publisher: bookData.publisher,
                source: bookData.source,
                category: bookData.category,
                status: bookData.status || 'available',
                issuedDate: bookData.issuedDate ? new Date(bookData.issuedDate) : null,
                placeLocated: bookData.placeLocated || null,
            });

            // Insert or update the book based on the bookId
            await Book.updateOne(
                { bookId: book.bookId }, // Find the book by its bookId
                { $set: book.toObject() }, // Update the book data
                { upsert: true } // Create the book if it doesn't exist
            );

            console.log(`Book ${book.title} (${book.bookId}) imported/updated successfully`);
        }

        console.log('Books imported successfully!');
    } catch (error) {
        console.error('Error importing books:', error);
    }
};

// Run the import process
const runImportProcess = async () => {
    await connectToDB();
    await importBooks();
};

// Start the import
runImportProcess();