const fs = require('fs');
const path = require('path');

// Path to your data file
const dataFile = path.join(__dirname, 'data.txt');

// Read IDs from the file
const ids = fs.readFileSync(dataFile, 'utf-8')
  .split('\n')
  .map(line => line.trim())
  .filter(line => line.length > 0);

// Base query parts
const baseQueryStart = 'index:production service:backend-promptpay-scb container_name:http(';
const baseQueryEnd = ')';

// Generate the OR clauses
const orClauses = ids.map(id => `@_params.billPaymentRef2:${id}`).join(' OR\n');

// Final query
const finalQuery = `${baseQueryStart}\n${orClauses}\n${baseQueryEnd}`;

// Output to console
console.log(finalQuery);

// Optionally, write to a file
fs.writeFileSync(path.join(__dirname, 'datadog_query.txt'), finalQuery);
console.log('Query written to datadog_query.txt');
