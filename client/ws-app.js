import WebSocket from 'ws';
import 'dotenv/config';
import { generateRandomBook, generateRandomId } from './utils.js';

const WS_ENDPOINT = process.env.WS_ENDPOINT || "ws://localhost:9926/Books";
const ws = new WebSocket(WS_ENDPOINT);

ws.onopen = () => {
  console.log("WebSocket connection established.");

  // Every 10 seconds, send a write request with a new record.
  setInterval(() => {
    const newRecord = generateRandomBook();
    console.log("Sending write request:", newRecord);
    ws.send(JSON.stringify({ action: "write", data: newRecord }));
  }, 10000);

  // Every 15 seconds, send a read request for all records.
  setInterval(() => {
    console.log("Sending read request for all records");
    ws.send(JSON.stringify({ action: "read" }));
  }, 15000);

  // Every 20 seconds, send a read request with a specific random id from the list
  setInterval(() => {
    const randomId = generateRandomId();
    console.log(`Sending read request with id '${randomId}'`);
    ws.send(JSON.stringify({ action: "read", id: randomId }));
  }, 20000);
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log("Received from WS server:", data);
};

ws.onerror = (err) => {
  console.error("WebSocket error:", err);
};

ws.onclose = () => {
  console.log("WebSocket connection closed.");
};
