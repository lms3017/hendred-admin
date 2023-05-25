import { PortfolioData, ContentsData, NodeData } from '@types';

const initPortfolioData: PortfolioData = {
  portfolioId: '',
  portfolioNo: 0,
  mainPageNo: 0,
  portfolioCompanyName: '',
  portfolioLogoUrl: '',
  portfolioLogoName: '',
  portfolioLogo: null,
  portfolioInvLogoUrl: '',
  portfolioInvLogoName: '',
  portfolioInvLogo: null,
  logoBackground: 'rgb(255, 255, 255)',
  portfolioCompanyDescription: '',
  isEnabledPortfolio: true,
  isEnabledMainPage: true,
  portfolioLink: '',
  portfolioCategory: '',
  createdAt: null,
  updatedAt: null,
};

const initNodeData: NodeData = {
  nodeId: '',
  nodeNo: 0,
  nodeCompanyName: '',
  nodeLogoUrl: '',
  nodeLogoName: '',
  nodeLogo: null,
  nodeCompanyDescription: '',
  nodeExtraDescription: '',
  isEnabledNode: true,
  nodeLink: '',
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

export { initPortfolioData, initNodeData, initContentsData };
