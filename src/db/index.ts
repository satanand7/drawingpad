import { openDB } from 'idb'; // lightweight wrapper around IndexedDB

const DB_NAME = 'drawing-db';
const STORE_NAME = 'snapshots';

export async function initDB() {
    const db = await openDB(DB_NAME, 1, {
        upgrade(db) {
            db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        },
    });
    return db;
}

export async function saveSnapshotToDB(snapshot: ImageData) {
    const db = await initDB();
    await db.add(STORE_NAME, { snapshot, timestamp: Date.now() });
}

export async function getSnapshotsFromDB() {
    const db = await initDB();
    return await db.getAll(STORE_NAME);
}

export async function clearSnapshotsDB() {
    const db = await initDB();
    await db.clear(STORE_NAME);
}
