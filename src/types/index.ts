import { Timestamp } from 'firebase/firestore';

type DialogModeOptions = '등록' | '수정';

type ContentsData = {
  contentsId: string;
  contentsNo: number;
  contentsName: string;
  contentsImageUrl: string;
  contentsImageName: string;
  contentsImage: File | null;
  contentsDescription: string;
  isEnabledContents: boolean;
  contentsLink: string;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
};

export type { DialogModeOptions, ContentsData };
