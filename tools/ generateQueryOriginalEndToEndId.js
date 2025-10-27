const fs = require('fs');
const path = require('path');

// Path to your data file (e.g., "data_endtoend.txt")
const dataFile = path.join(__dirname, 'data_endtoend.txt');

// Read IDs from the file
const ids = fs.readFileSync(dataFile, 'utf-8')
  .split('\n')
  .map(line => line.trim())
  .filter(line => line.length > 0);

// Base query
const baseQueryStart = 'index:production service:backend-promptpay-scb @http.url_details.path:*void* (';
const baseQueryEnd = ')';

// Generate OR clauses
const orClauses = ids
  .map(id => `@request.body.originalPaymentInformationAndReversal.originalEndToEndIdentification:${id}`)
  .join(' OR\n');

// Final query
const finalQuery = `${baseQueryStart}\n${orClauses}\n${baseQueryEnd}`;

// Write to file
const outputFile = path.join(__dirname, 'datadog_query_originalEndToEndId.txt');
fs.writeFileSync(outputFile, finalQuery);

console.log('✅ Query written to datadog_query_originalEndToEndId.txt');
console.log('\n--- Query Preview ---\n');
console.log(finalQuery);
