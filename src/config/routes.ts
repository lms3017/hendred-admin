import PortfolioManager from '@pages/portfolioManager';
import MainPageManager from '@pages/mainPageManager';
import NodeManager from '@pages/nodeManager';
import ContentManager from '@pages/contentManager';
import InboxIcon from '@mui/icons-material/MoveToInbox';

const menus = {
  portfolioManager: {
    menuName: '포트폴리오 관리',
    path: '/PortfolioManager',
    component: PortfolioManager,
    menuIcon: InboxIcon,
  },
  mainPageManager: {
    menuName: '메인페이지 노출관리',
    path: '/MainPageManager',
    component: MainPageManager,
    menuIcon: InboxIcon,
  },
  nodeManager: {
    menuName: '노드 관리',
    path: '/NodeManager',
    component: NodeManager,
    menuIcon: InboxIcon,
  },
  contentManager: {
    menuName: '콘텐츠 관리',
    path: '/ContentManager',
    component: ContentManager,
    menuIcon: InboxIcon,
  },
};

export { menus };
