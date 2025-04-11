require('dotenv').config();
const mongoose = require('mongoose');
const xlsx = require('xlsx');
const Faculty = require('./models/faculty');

const MONGODB_URI = process.env.MONGODB_URI;
console.log("MongoDB URI:", MONGODB_URI);

// Connect to MongoDB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('✅ Connected to MongoDB');

    const workbook = xlsx.readFile('./data/faculty.xlsx');
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const facultyData = xlsx.utils.sheet_to_json(sheet);

    if (!facultyData.length) {
      console.log('❌ No faculty data found in the Excel file.');
      return process.exit();
    }

    const formattedData = facultyData.map(faculty => ({
      facultyId: faculty.facultyId?.toString().trim(),
      facultyName: faculty.facultyName?.toString().trim(),
      facultyEmail: faculty.facultyEmail?.toString().trim(),
      currentlyIssuedBooks: [],
      totalBooksIssued: 0,
      role: faculty.role?.toLowerCase() || 'faculty',
    }));

    await Faculty.insertMany(formattedData, { ordered: false });
    console.log(`✅ ${formattedData.length} faculty records imported successfully.`);
    process.exit();
  })
  .catch(err => {
    console.error('❌ Error importing faculty:', err);
    process.exit(1);
  });
