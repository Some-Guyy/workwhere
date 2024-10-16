const admin = require('firebase-admin');
const csv = require('csv-parser');
const fs = require('fs');

// Initialize Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Path to your CSV file
// const filePath = './employeenew.csv';

// Function to import CSV data into Firestore
const importCsvToFirestore = (filePath,collection) => {
  const batch = db.batch();  // Create a batch to write multiple documents at once
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      const docRef = db.collection(collection).doc();  // You can also specify an ID instead of using .doc()
      batch.set(docRef, row);  // Add the row to Firestore
    })
    .on('end', async () => {
      await batch.commit();  // Commit the batch
      console.log('CSV file successfully imported to Firestore');
    })
    .on('error', (error) => {
      console.error('Error importing CSV file: ', error);
    });
};

// Run the import function
// importCsvToFirestore('./employeenew.csv','employee');
// importCsvToFirestore('./mockemployee.csv','mock_employee')
// importCsvToFirestore('./mockworkarrangement.csv','mock_working_arrangements')

module.exports=importCsvToFirestore
