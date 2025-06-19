interface Memo {
  id?: number;
  text: string;
  timestamp: number;
}

const DB_NAME = 'memoDB';
const STORE_NAME = 'memos';
const DB_VERSION = 1;

let db: IDBDatabase | null = null;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };

    request.onsuccess = (event) => {
      db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };

    request.onerror = (event) => {
      reject('IndexedDB error: ' + (event.target as IDBRequest).error);
    };
  });
}

export async function addMemo(text: string): Promise<Memo> {
  const database = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const newMemo: Memo = { text, timestamp: Date.now() };
    const request = store.add(newMemo);

    request.onsuccess = () => {
      resolve({ ...newMemo, id: request.result as number });
    };

    request.onerror = (event) => {
      reject('Add memo error: ' + (event.target as IDBRequest).error);
    };
  });
}

export async function getMemos(): Promise<Memo[]> {
  const database = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result.sort((a, b) => b.timestamp - a.timestamp));
    };

    request.onerror = (event) => {
      reject('Get memos error: ' + (event.target as IDBRequest).error);
    };
  });
}

export async function deleteMemo(id: number): Promise<void> {
  const database = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = (event) => {
      reject('Delete memo error: ' + (event.target as IDBRequest).error);
    };
  });
}