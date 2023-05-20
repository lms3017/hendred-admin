import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@config/firebase';

export const createDocument = async (collectionName: string, data: any) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    console.log('Document created with ID:', docRef.id);
  } catch (error) {
    console.error('Error adding document:', error);
  }
};

export const fetchDocument = async (collectionName: string): Promise<any> => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    let result: object[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      data.docId = doc.id;
      result.push(data);
    });
    return result;
  } catch (error) {
    console.error('Error fetching documents:', error);
  }
};

export const updateDocument = async (collectionName: string, docId: string, newData: any) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, newData);
    console.log('Document updated with ID:', docId);
  } catch (error) {
    console.error('Error updating document:', error);
  }
};

export const deleteDocument = async (collectionName: string, docId: string) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    console.log('Document deleted with ID:', docId);
  } catch (error) {
    console.error('Error deleting document:', error);
  }
};
