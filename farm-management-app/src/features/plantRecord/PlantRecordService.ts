import { PlantRecord } from './types';

const DB_NAME = 'FarmManagementDB';
const STORE_NAME = 'plantRecords';

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 2); // バージョンを2に更新

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // 既存のfarmAreasストアはそのまま保持
      if (!db.objectStoreNames.contains('farmAreas')) {
        db.createObjectStore('farmAreas', { keyPath: 'id' });
      }
      
      // plantRecordsストアを追加
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

export const getPlantRecords = async (): Promise<PlantRecord[]> => {
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

export const savePlantRecord = async (data: PlantRecord): Promise<void> => {
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

export const deletePlantRecord = async (id: string): Promise<void> => {
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

// モジュールとして認識させるための宣言
export type PlantRecordServiceTypes = typeof getPlantRecords | typeof savePlantRecord | typeof deletePlantRecord;