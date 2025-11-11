
export const DB_NAME = 'tc.db';
export const DB_VER = 1;

function openDB(): Promise<IDBDatabase>{
  return new Promise((resolve, reject)=>{
    const req = indexedDB.open(DB_NAME, DB_VER);
    req.onupgradeneeded = ()=>{
      const db = req.result;
      if(!db.objectStoreNames.contains('journal')) db.createObjectStore('journal');
      if(!db.objectStoreNames.contains('env')) db.createObjectStore('env');
    };
    req.onerror = ()=> reject(req.error);
    req.onsuccess = ()=> resolve(req.result);
  });
}

export async function idbSet(store: string, key: string, val: any){
  const db = await openDB();
  return new Promise<void>((resolve, reject)=>{
    const tx = db.transaction(store, 'readwrite');
    const st = tx.objectStore(store);
    st.put(val, key);
    tx.oncomplete = ()=> resolve();
    tx.onerror = ()=> reject(tx.error);
  });
}

export async function idbGet(store: string, key: string){
  const db = await openDB();
  return new Promise<any>((resolve, reject)=>{
    const tx = db.transaction(store, 'readonly');
    const st = tx.objectStore(store);
    const req = st.get(key);
    req.onsuccess = ()=> resolve(req.result);
    req.onerror = ()=> reject(req.error);
  });
}
