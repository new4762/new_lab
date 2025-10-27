const fs = require('fs');
const path = require('path');

// Path to your data file
const dataFile = path.join(__dirname, 'data.txt');

// Read IDs from the file
const ids = fs.readFileSync(dataFile, 'utf-8')
  .split('\n')
  .map(line => line.trim())
  .filter(line => line.length > 0);

// ----------------------------
// Query 1: @_params.billPaymentRef2
// ----------------------------
const baseQueryStart1 = 'index:production service:backend-promptpay-scb container_name:http (';
const baseQueryEnd1 = ')';
const orClauses1 = ids.map(id => `@_params.billPaymentRef2:${id}`).join(' OR\n');
const finalQuery1 = `${baseQueryStart1}\n${orClauses1}\n${baseQueryEnd1}`;

// Write to file
fs.writeFileSync(path.join(__dirname, 'datadog_query_billPaymentRef2.txt'), finalQuery1);
console.log('✅ Query 1 written to datadog_query_billPaymentRef2.txt');

// ----------------------------
// Query 2: @request.body.payment.payment_references.reference_number_1
// ----------------------------
const baseQueryStart2 = 'index:production service:backend-promptpay-scb @grpc.method:Void (';
const baseQueryEnd2 = ')';
const orClauses2 = ids.map(id => `@request.body.payment.payment_references.reference_number_1:${id}`).join(' OR\n');
const finalQuery2 = `${baseQueryStart2}\n${orClauses2}\n${baseQueryEnd2}`;

// Write to file
fs.writeFileSync(path.join(__dirname, 'datadog_query_reference_number_1.txt'), finalQuery2);
console.log('✅ Query 2 written to datadog_query_reference_number_1.txt');

// Also print both queries to console
console.log('\n--- Query 1 ---\n');
console.log(finalQuery1);
console.log('\n--- Query 2 ---\n');
console.log(finalQuery2);
