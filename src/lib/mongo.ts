import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("Missing env variable: MONGODB_URI");

// reuse the client in dev so hot reload does not open new connections
const globalForMongo = globalThis as unknown as { mongoClient?: MongoClient };

export const mongoClient = globalForMongo.mongoClient ?? new MongoClient(uri);
if (process.env.NODE_ENV !== "production") globalForMongo.mongoClient = mongoClient;

export const db = mongoClient.db(process.env.DB_NAME || "kindred");
