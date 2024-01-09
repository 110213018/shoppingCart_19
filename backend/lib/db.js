import { MongoClient } from "mongodb";

let client;
let session;

async function conn(uri, db) {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
    session = client.db(db);
  }
  return session;
}

async function close() {
  await client.close();
}

export { conn, close };
