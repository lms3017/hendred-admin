import { Timestamp } from 'firebase/firestore';

type DialogModeOptions = '등록' | '수정';

type PortfolioData = {
  portfolioId: string;
  portfolioNo: number;
  mainPageNo: number;
  portfolioCompanyName: string;
  portfolioLogoUrl: string;
  portfolioLogoName: string;
  portfolioLogo: File | null;
  portfolioInvertedLogoUrl: string;
  portfolioInvertedLogoName: string;
  portfolioInvertedLogo: File | null;
  logoBackground: string;
  portfolioCompanyDescription: string;
  isEnabledPortfolio: boolean;
  isEnabledMainPage: boolean;
  portfolioLink: string;
  portfolioCategory: string;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
};

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

export type { PortfolioData, DialogModeOptions, ContentsData };
