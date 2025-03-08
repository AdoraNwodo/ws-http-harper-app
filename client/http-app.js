import fetch from 'node-fetch';
import 'dotenv/config';
import { generateRandomBook, generateRandomId } from './utils.js';

const HTTP_ENDPOINT = process.env.HTTP_ENDPOINT || "http://localhost:9926/Books";

/**
 * Sends an HTTP POST request to create a new record.
 */
async function sendWriteRequest() {
  const newRecord = generateRandomBook();
  console.log("HTTP: Sending write request:", newRecord);
  
  try {
    const response = await fetch(HTTP_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRecord)
    });
    const data = await response.json();
    console.log("HTTP: Received write response:", data);
  } catch (error) {
    console.error("HTTP: Error in write request:", error);
  }
}

/**
 * Sends an HTTP GET request to fetch all records.
 */
async function sendReadAllRequest() {
  console.log("HTTP: Sending read request for all records");
  
  try {
    const response = await fetch(HTTP_ENDPOINT, { method: 'GET' });
    const data = await response.json();
    console.log("HTTP: Received read all response:", data);
  } catch (error) {
    console.error("HTTP: Error in read all request:", error);
  }
}

/**
 * Sends an HTTP GET request to fetch a record by a random id.
 */
async function sendReadByIdRequest() {
  const randomId = generateRandomId();
  const url = `${HTTP_ENDPOINT}/${randomId}`;
  console.log(`HTTP: Sending read request for id '${randomId}'`);
  
  try {
    const response = await fetch(url, { method: 'GET' });
    const data = await response.json();
    console.log("HTTP: Received read by id response:", data);
  } catch (error) {
    console.error("HTTP: Error in read by id request:", error);
  }
}

// Schedule the requests at regular intervals.
setInterval(sendWriteRequest, 10000); 
setInterval(sendReadAllRequest, 15000);
setInterval(sendReadByIdRequest, 20000);
