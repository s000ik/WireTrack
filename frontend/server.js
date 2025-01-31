const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Mock database for batch data
// Mock database for batch data
const generatedBatchData = [
  { batch_id: '700001', uts: 10.3, elongation: 15.6, conductivity: 61.5, grade: 'WE20', material: 'WE200095', composition: { si: 0.07, fe: 0.25, ti: 0.002, v: 0.004, cu: 0.001, mn: 0.005, othimp: 0.02, al: 99.665 }, timestamp: '2024-09-02T00:10:00Z' },
  { batch_id: '700002', uts: 9.8, elongation: 18.2, conductivity: 61.3, grade: 'WE20', material: 'WE200095', composition: { si: 0.06, fe: 0.21, ti: 0.001, v: 0.003, cu: 0.001, mn: 0.004, othimp: 0.02, al: 99.705 }, timestamp: '2024-09-02T01:15:00Z' },
  { batch_id: '700003', uts: 10.0, elongation: 20.1, conductivity: 61.4, grade: 'WE20', material: 'WE200095', composition: { si: 0.06, fe: 0.18, ti: 0.001, v: 0.002, cu: 0.001, mn: 0.003, othimp: 0.02, al: 99.742 }, timestamp: '2024-09-02T02:22:00Z' },
  { batch_id: '700004', uts: 9.6, elongation: 22.3, conductivity: 61.2, grade: 'WE20', material: 'WE200095', composition: { si: 0.07, fe: 0.22, ti: 0.003, v: 0.005, cu: 0.001, mn: 0.004, othimp: 0.02, al: 99.688 }, timestamp: '2024-09-02T03:37:00Z' },
  { batch_id: '700005', uts: 10.2, elongation: 16.9, conductivity: 61.5, grade: 'WE20', material: 'WE200095', composition: { si: 0.06, fe: 0.19, ti: 0.002, v: 0.003, cu: 0.001, mn: 0.004, othimp: 0.02, al: 99.721 }, timestamp: '2024-09-02T04:45:00Z' },
  { batch_id: '800006', uts: 9.7, elongation: 19.8, conductivity: 61.3, grade: 'WE20', material: 'WE200095', composition: { si: 0.06, fe: 0.23, ti: 0.001, v: 0.002, cu: 0.001, mn: 0.005, othimp: 0.02, al: 99.678 }, timestamp: '2024-09-02T05:53:00Z' },
  { batch_id: '800007', uts: 10.1, elongation: 17.5, conductivity: 61.4, grade: 'WE20', material: 'WE200095', composition: { si: 0.07, fe: 0.20, ti: 0.002, v: 0.004, cu: 0.001, mn: 0.003, othimp: 0.02, al: 99.702 }, timestamp: '2024-09-02T06:11:00Z' },
  { batch_id: '800008', uts: 9.5, elongation: 21.6, conductivity: 61.2, grade: 'WE20', material: 'WE200095', composition: { si: 0.06, fe: 0.17, ti: 0.001, v: 0.003, cu: 0.001, mn: 0.004, othimp: 0.02, al: 99.759 }, timestamp: '2024-09-02T07:26:00Z' },
  { batch_id: '800009', uts: 10.4, elongation: 16.2, conductivity: 61.5, grade: 'WE20', material: 'WE200095', composition: { si: 0.07, fe: 0.21, ti: 0.002, v: 0.002, cu: 0.001, mn: 0.004, othimp: 0.02, al: 99.695 }, timestamp: '2024-09-02T08:39:00Z' },
  { batch_id: '800010', uts: 9.9, elongation: 18.7, conductivity: 61.3, grade: 'WE20', material: 'WE200095', composition: { si: 0.06, fe: 0.22, ti: 0.001, v: 0.003, cu: 0.001, mn: 0.005, othimp: 0.02, al: 99.687 }, timestamp: '2024-09-02T09:47:00Z' }
]

// Helper function to find a batch by ID
const findBatchById = (batchId) => generatedBatchData.find((b) => b.batch_id === batchId);

// Mock database with timestamp as the primary key
const batchDataByTimestamp = generatedBatchData.reduce((acc, batch) => {
  acc[batch.timestamp] = batch;
  return acc;
}, {});

// Helper function to find a batch by timestamp
const findBatchByTimestamp = (timestamp) => batchDataByTimestamp[timestamp];

// Updated chatbot endpoint
app.post('/api/chatbot', (req, res) => {
  const { question } = req.body;
  const lowercaseQuestion = question.toLowerCase();

  let response = "I'm sorry, I don't understand the question.";

  // Extract batch ID (assumes numeric format like "700001")
  const batchIdMatch = question.match(/\b\d{6}\b/);
  const batchId = batchIdMatch ? batchIdMatch[0] : null;

  // Extract timestamp (adjusted for new format with tab and space separation)
  const timestampMatch = question.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z/);
  const timestamp = timestampMatch ? timestampMatch[0] : null;

  if (batchId) {
    const batch = findBatchById(batchId);

    if (batch) {
      // Handle various property queries with flexible matching
      if (lowercaseQuestion.includes('uts') || 
          lowercaseQuestion.includes('ultimate') || 
          lowercaseQuestion.includes('tensile') || 
          lowercaseQuestion.includes('strength')) {
        response = `The UTS of batch ${batchId} is ${batch.uts}.`;
      } 
      else if (lowercaseQuestion.includes('elongation')) {
        response = `The elongation of batch ${batchId} is ${batch.elongation}%.`;
      } 
      else if (lowercaseQuestion.includes('conductivity')) {
        response = `The conductivity of batch ${batchId} is ${batch.conductivity}.`;
      } 
      else if (lowercaseQuestion.includes('grade')) {
        response = `The grade of batch ${batchId} is ${batch.grade}.`;
      } 
      else if (lowercaseQuestion.includes('material')) {
        response = `The material of batch ${batchId} is ${batch.material}.`;
      } 
      else if (lowercaseQuestion.includes('composition')) {
        const composition = batch.composition;
        response = `The composition of batch ${batchId} is: Si: ${composition.si}, Fe: ${composition.fe}, Ti: ${composition.ti}, V: ${composition.v}, Cu: ${composition.cu}, Mn: ${composition.mn}, Other Impurities: ${composition.othimp}, Al: ${composition.al}.`;
      } 
      else if (lowercaseQuestion.includes('timestamp')) {
        response = `The timestamp of batch ${batchId} is ${batch.timestamp}.`;
      }
      else {
        // If no specific property is mentioned, provide all details
        response = `Details for batch ${batchId}: UTS: ${batch.uts}, Elongation: ${batch.elongation}%, Conductivity: ${batch.conductivity}, Grade: ${batch.grade}, Material: ${batch.material}.`;
      }
    } else {
      response = `Batch ${batchId} not found.`;
    }
  } else if (timestamp) {
    const batch = findBatchByTimestamp(timestamp);

    if (batch) {
      // Handle various property queries with flexible matching
      if (lowercaseQuestion.includes('uts') || 
          lowercaseQuestion.includes('ultimate') || 
          lowercaseQuestion.includes('tensile') || 
          lowercaseQuestion.includes('strength')) {
        response = `The UTS at timestamp ${timestamp} is ${batch.uts}.`;
      } 
      else if (lowercaseQuestion.includes('elongation')) {
        response = `The elongation at timestamp ${timestamp} is ${batch.elongation}%.`;
      } 
      else if (lowercaseQuestion.includes('conductivity')) {
        response = `The conductivity at timestamp ${timestamp} is ${batch.conductivity}.`;
      } 
      else if (lowercaseQuestion.includes('grade')) {
        response = `The grade at timestamp ${timestamp} is ${batch.grade}.`;
      } 
      else if (lowercaseQuestion.includes('material')) {
        response = `The material at timestamp ${timestamp} is ${batch.material}.`;
      } 
      else if (lowercaseQuestion.includes('composition')) {
        const composition = batch.composition;
        response = `The composition at timestamp ${timestamp} is: Si: ${composition.si}, Fe: ${composition.fe}, Ti: ${composition.ti}, V: ${composition.v}, Cu: ${composition.cu}, Mn: ${composition.mn}, Other Impurities: ${composition.othimp}, Al: ${composition.al}.`;
      } 
      else {
        // If no specific property is mentioned, provide all details
        response = `Details at timestamp ${timestamp}: UTS: ${batch.uts}, Elongation: ${batch.elongation}%, Conductivity: ${batch.conductivity}, Grade: ${batch.grade}, Material: ${batch.material}.`;
      }
    } else {
      response = `No batch found at timestamp ${timestamp}.`;
    }
  }

  res.json({ answer: response });
});

// Start server
const PORT = 5005;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));