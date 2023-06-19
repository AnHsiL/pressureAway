import { db } from './firebase.js';

export const getData = async (collection) => {
  const querySnapshot = await db.collection(collection).get();
  const data = querySnapshot.docs.map(doc => doc.data());
  return data;
}

export const getDoc = async (collection, doc) => {
  const docRef = db.collection(collection).doc(doc);
  const docSnapshot = await docRef.get();
  return docSnapshot.data();
}

export const getDocs = async (collection, docs) => {
  const docRefs = docs.map(doc => db.collection(collection).doc(doc));
  const docSnapshots = await Promise.all(docRefs.map(docRef => docRef.get()));
  const data = docSnapshots.map(docSnapshot => docSnapshot.data());
  return data;
}