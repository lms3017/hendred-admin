import { Timestamp } from 'firebase/firestore';

type ContentsData = {
  docId: string;
  docNo: number;
  contentsName: string;
  contentsImageUrl: string;
  contentsImage: File | null;
  contentsDescription: string;
  isEnabledContents: boolean;
  contentsLink: string;
  uploadDate: Timestamp | null;
  updateDate: Timestamp | null;
};

export type { ContentsData };
