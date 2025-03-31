// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FarmArea, FarmAreaInput } from './types';

const DB_NAME = 'FarmManagementDB';
const STORE_NAME = 'farmAreas';

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};

const getObjectStore = async (
  mode: IDBTransactionMode
): Promise<IDBObjectStore> => {
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, mode);
  return transaction.objectStore(STORE_NAME);
};

export const getFarmAreas = async (): Promise<FarmArea[]> => {
  const store = await getObjectStore('readonly');
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onerror = () => {
      reject(request.error);
    };
  });
};

export const saveFarmArea = async (data: FarmArea): Promise<void> => {
  const store = await getObjectStore('readwrite');
  return new Promise((resolve, reject) => {
    const request = store.put(data);
    request.onsuccess = () => {
      resolve();
    };
    request.onerror = () => {
      reject(request.error);
    };
  });
};

export const deleteFarmArea = async (id: string): Promise<void> => {
  const store = await getObjectStore('readwrite');
  return new Promise((resolve, reject) => {
    const request = store.delete(id);
    request.onsuccess = () => {
      resolve();
    };
    request.onerror = () => {
      reject(request.error);
    };
  });
};

// モジュールとして認識させるための空エクスポート
export {}