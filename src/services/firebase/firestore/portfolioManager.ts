import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from '@config/firebase';
import { uploadImage, deleteImage } from '@services/firebase/storage/fileHandler';
import { getCurrentDate, formatDateTime } from '@utils/dateHandler';
import { PortfolioData } from '@types';

const collectionName = 'portfolio';

export const createPortfolio = async (portfolioData: PortfolioData) => {
  try {
    const currentDate = getCurrentDate();
    if (portfolioData.portfolioLogo) {
      // logo
      const portfolioLogoUrl = await uploadImage(portfolioData.portfolioLogo, portfolioData.portfolioLogoName);
      portfolioData.portfolioLogoUrl = portfolioLogoUrl;
      portfolioData.portfolioLogo = null;
    }
    if (portfolioData.portfolioInvertedLogo) {
      // invertedLogo
      const portfolioInvertedLogoUrl = await uploadImage(
        portfolioData.portfolioInvertedLogo,
        portfolioData.portfolioInvertedLogoName
      );
      portfolioData.portfolioInvertedLogoUrl = portfolioInvertedLogoUrl;
      portfolioData.portfolioInvertedLogo = null;
    }
    const prefPortfolioNo = await getMaxPortfolioNo();
    portfolioData.portfolioNo = prefPortfolioNo + 1;
    const prefMainpageNo = await getMaxMainpageNo();
    portfolioData.mainPageNo = prefMainpageNo + 1;
    portfolioData.createdAt = currentDate;
    const docRef = await addDoc(collection(db, collectionName), portfolioData);

    portfolioData.portfolioId = docRef.id;
    await updatePortfolio(portfolioData);
  } catch (error) {
    console.error('Error services/firebase/firestore/createPortfolio : ', error);
    throw error;
  }
};

export const fetchPortfolio = async (): Promise<PortfolioData[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    let result: PortfolioData[] = [];

    querySnapshot.forEach((doc) => {
      const portfolioData: PortfolioData = doc.data() as PortfolioData;
      result.push(portfolioData);
    });
    return result.sort((a, b) => a.portfolioNo - b.portfolioNo);
  } catch (error) {
    console.error('Error services/firebase/firestore/fetchPortfolio : ', error);
    throw error;
  }
};

export const fetchPortfolioById = async (id: string): Promise<PortfolioData | null> => {
  try {
    const docRef = doc(db, collectionName, id);
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      const data = docSnapshot.data() as PortfolioData;
      return data;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error services/firebase/firestore/fetchPortfolioById : ', error);
    throw error;
  }
};

export const updatePortfolio = async (newData: PortfolioData) => {
  try {
    await updatedAtEqual(newData);
    newData.updatedAt = getCurrentDate();
    if (newData.portfolioLogo || newData.portfolioInvertedLogoName) {
      await deletePortfolio(newData.portfolioId, newData.portfolioLogoName, newData.portfolioInvertedLogoName);
      if (newData.portfolioLogo) {
        const portfolioLogoUrl = await uploadImage(newData.portfolioLogo, newData.portfolioLogoName);
        newData.portfolioLogoUrl = portfolioLogoUrl;
        newData.portfolioLogo = null;
      }
      if (newData.portfolioInvertedLogo) {
        const portfolioInvertedLogoUrl = await uploadImage(
          newData.portfolioInvertedLogo,
          newData.portfolioInvertedLogoName
        );
        newData.portfolioInvertedLogoUrl = portfolioInvertedLogoUrl;
        newData.portfolioInvertedLogo = null;
      }
    }

    const docRef = doc(db, collectionName, newData.portfolioId);
    await updateDoc(docRef, newData);
  } catch (error) {
    console.error('Error services/firebase/firestore/updatePortfolio : ', error);
    throw error;
  }
};

export const deletePortfolio = async (id: string, logoName: string, invertedLogo: string) => {
  try {
    if (logoName) await deleteImage(logoName);
    if (invertedLogo) await deleteImage(invertedLogo);
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error services/firebase/firestore/deletePortfolio : ', error);
    throw error;
  }
};

const getMaxPortfolioNo = async (): Promise<number> => {
  try {
    const q = query(collection(db, collectionName), orderBy('portfolioNo', 'desc'), limit(1));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const maxValue = doc.get('portfolioNo');
      return maxValue;
    } else {
      return 0;
    }
  } catch (error) {
    console.error('Error services/firebase/firestore/getMaxPortfolioNo : ', error);
    throw error;
  }
};

const getMaxMainpageNo = async (): Promise<number> => {
  try {
    const q = query(collection(db, collectionName), orderBy('MainpageNo', 'desc'), limit(1));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const maxValue = doc.get('MainpageNo');
      return maxValue;
    } else {
      return 0;
    }
  } catch (error) {
    console.error('Error services/firebase/firestore/getMaxMainpageNo : ', error);
    throw error;
  }
};

const updatedAtEqual = async (data: PortfolioData) => {
  try {
    const compareData = await fetchPortfolioById(data.portfolioId);
    if (compareData?.updatedAt?.nanoseconds !== data.updatedAt?.nanoseconds) {
      alert('이미 이전에 수정된 항목입니다. \r\n새로고침을 해주세요.');
      throw new Error();
    }
  } catch (error) {
    console.error('Error services/firebase/firestore/updatedAtEqual : ', error);
    throw error;
  }
};
