import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@config/firebase';
import { uploadImage } from '@utils/fileHandler';
import { getCurrentDate } from '@utils/dateHandler';
import { ContentsData } from '@types';

const collectionName = 'contents';

export const createContents = async (contentsData: ContentsData) => {
  try {
    const currentDate = getCurrentDate();
    if (contentsData.contentsImage) {
      console.log(new Date());
      const contentsImageUrl = await uploadImage(contentsData.contentsImage);
      console.log(new Date());
      contentsData.contentsImageUrl = contentsImageUrl;
      contentsData.contentsImage = null;
    }
    const prefDocNo = await fetchDocNo();
    contentsData.docNo = prefDocNo + 1;
    contentsData.uploadDate = currentDate;
    const docRef = await addDoc(collection(db, collectionName), contentsData);
    console.log(new Date());
    console.log('Success services/createContents : ', docRef.id);
  } catch (error) {
    console.error('Error services/createContents : ', error);
    throw error;
  }
};

export const fetchAllContents = async (): Promise<ContentsData[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    let result: ContentsData[] = [];

    querySnapshot.forEach((doc) => {
      const docData = doc.data() as ContentsData;
      const contentsData: ContentsData = docData;
      contentsData.docId = doc.id;
      result.push(contentsData);
    });
    return result.sort((a, b) => a.docNo - b.docNo);
  } catch (error) {
    console.error('Error services/fetchContents : ', error);
    throw error;
  }
};

export const updateDocNo = async (docId: string, docNo: number) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, { docNo });
  } catch (error) {
    console.error('Error services/updateDocNo : ', error);
    throw error;
  }
};

const fetchDocNo = async (): Promise<number> => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.size;
  } catch (error) {
    console.error('Error services/fetchDocNo : ', error);
    throw error;
  }
};
