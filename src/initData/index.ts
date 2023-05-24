import { PortfolioData, ContentsData } from '@types';

const initPortfolioData: PortfolioData = {
  portfolioId: '',
  portfolioNo: 0,
  mainPageNo: 0,
  portfolioCompanyName: '',
  portfolioLogoUrl: '',
  portfolioLogoName: '',
  portfolioLogo: null,
  portfolioInvertedLogoUrl: '',
  portfolioInvertedLogoName: '',
  portfolioInvertedLogo: null,
  logoBackground: '',
  portfolioCompanyDescription: '',
  isEnabledPortfolio: true,
  isEnabledMainPage: true,
  portfolioLink: '',
  portfolioCategory: '',
  createdAt: null,
  updatedAt: null,
};

const initContentsData: ContentsData = {
  contentsId: '',
  contentsNo: 0,
  contentsName: '',
  contentsImageUrl: '',
  contentsImageName: '',
  contentsImage: null,
  contentsDescription: '',
  isEnabledContents: true,
  contentsLink: '',
  createdAt: null,
  updatedAt: null,
};

export { initPortfolioData, initContentsData };
