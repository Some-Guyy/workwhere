const admin = require('firebase-admin');
const db = admin.firestore()
const firestore = require('firebase-admin/firestore')
const fs = require('fs');
const { Readable} = require('stream');
const csv=require('csv-parser')


// Mock Firebase Firestore methods
const mockBatchSet = jest.fn();
const mockBatchCommit = jest.fn().mockResolvedValue();

jest.mock('firebase-admin', () => {
  const firestoreMock = {
    batch: () => ({
      set: mockBatchSet,
      commit: mockBatchCommit
    }),
    collection: jest.fn().mockReturnValue({
      doc: jest.fn().mockReturnValue({})
    })
  };

  return {
    initializeApp: jest.fn(),
    credential: {
      cert: jest.fn()
    },
    firestore: jest.fn(() => firestoreMock)
  };
});

// Mock fs
jest.mock('fs');

// Mock csv-parser to return a transform stream
jest.mock('csv-parser', () => {
  const {Transform}= require('stream');
  return jest.fn(() => {
    const transformStream = new Transform({
      objectMode: true,
      transform(chunk, encoding, callback) {
        const row = JSON.parse(chunk.toString());
        callback(null, row);
      }
    });
    return transformStream;
  });
});

// Import the function you're testing
const importCsvToFirestore = require('../../../backend/importCsvToFirestore.js');

describe('importCsvToFirestore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should import CSV data into Firestore successfully', async () => {
    // Mock CSV data
    const mockCsvData = [
      { Staff_ID: '999999', Staff_Fname: 'John', Staff_Lname: 'Doe', Dept: 'Test', Position: 'Director', Country: 'Singapore', Email: 'john.doe@asdf.com', Reporting_Manager: '000000', Role: '4', Password: '123' },
      { Staff_ID: '888888', Staff_Fname: 'Jane', Staff_Lname: 'Smith', Dept: 'Test', Position: 'Producer', Country: 'Singapore', Email: 'jane.smith@asdf.com', Reporting_Manager: '000000', Role: '4', Password: '123' }
    ];

    // Create a readable stream for mock CSV data
    const readableStream = new Readable({
      read() {
        this.push(JSON.stringify(mockCsvData[0]));  // Push first row
        this.push(JSON.stringify(mockCsvData[1]));  // Push second row
        this.push(null);  // End the stream
      }
    });

    fs.createReadStream.mockReturnValue(readableStream);  // Mock the file read

    // Call the function you're testing
    await importCsvToFirestore('./mockemployee.csv', 'mock_employee');

    // Ensure that Firestore's batch.set is called for each row
    expect(mockBatchSet).toHaveBeenCalledTimes(2);

    // Ensure that Firestore's batch.commit is called once after the rows are processed
    expect(mockBatchCommit).toHaveBeenCalled();
  });
});
