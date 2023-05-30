import React from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { PortfolioData } from '@types';
import { formatDate } from '@utils/dateHandler';
import { booleanToText } from '@utils/commonUtils';
import { fetchMainPage, updatePortfolio } from '@services/firebase/firestore/portfolioManager';
import CustomTableCell from '@components/CustomTableCell';
import Loading from '@components/Loading';

function MainPageManager() {
  const [portfolioDataList, setPortfolioDataList] = React.useState<PortfolioData[] | []>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    getAllMainPage();
  }, []);

  const getAllMainPage = async () => {
    try {
      setIsLoading(true);
      const fetchDataList = await fetchMainPage();
      setPortfolioDataList(fetchDataList);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      alert('오류가 발생했습니다.');
      console.error('Error pages/portfolioManager/getAllMainPage : ', error);
    }
  };

  const moveItemUp = async (id: string) => {
    try {
      const itemIndex = portfolioDataList.findIndex((item) => item.portfolioId === id);
      if (itemIndex > 0) {
        setIsLoading(true);
        const prevItem = portfolioDataList[itemIndex - 1];
        const currentItem = portfolioDataList[itemIndex];
        const prevNo = prevItem.mainPageNo;
        const currentNo = currentItem.mainPageNo;
        prevItem.mainPageNo = currentNo;
        currentItem.mainPageNo = prevNo;
        await updatePortfolio(prevItem);
        await updatePortfolio(currentItem);
        await getAllMainPage();
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      alert('오류가 발생했습니다.');
      console.error('Error pages/portfolioManager/moveItemUp : ', error);
    }
  };

  const moveItemDown = async (id: string) => {
    try {
      setIsLoading(true);
      const itemIndex = portfolioDataList.findIndex((item) => item.portfolioId === id);
      if (itemIndex < portfolioDataList.length - 1) {
        setIsLoading(true);
        const nextItem = portfolioDataList[itemIndex + 1];
        const currentItem = portfolioDataList[itemIndex];
        const nextNo = nextItem.mainPageNo;
        const currentNo = currentItem.mainPageNo;
        nextItem.mainPageNo = currentNo;
        currentItem.mainPageNo = nextNo;
        await updatePortfolio(nextItem);
        await updatePortfolio(currentItem);
        await getAllMainPage();
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      alert('오류가 발생했습니다.');
      console.error('Error pages/portfolioManager/moveItemDown : ', error);
    }
  };

  return (
    <Box sx={{ mt: 6 }}>
      <Loading isLoading={isLoading} />
      <Typography variant="h5" sx={{ mb: 3 }}>
        메인페이지 관리
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <CustomTableCell align="center">번호</CustomTableCell>
              <CustomTableCell align="center">회사명</CustomTableCell>
              <CustomTableCell align="center">포트폴리오 노출</CustomTableCell>
              <CustomTableCell align="center">등록일</CustomTableCell>
              <CustomTableCell align="center">순서</CustomTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {portfolioDataList.map((result, index) => {
              return (
                <TableRow hover key={index}>
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell align="center">
                    <Typography>{result.portfolioCompanyName}</Typography>
                  </TableCell>
                  <TableCell align="center">{booleanToText(result.isEnabledPortfolio)}</TableCell>
                  <TableCell align="center">{result.createdAt && formatDate(result.createdAt)}</TableCell>
                  <TableCell align="center">
                    <Button variant="outlined" onClick={() => moveItemUp(result.portfolioId)} sx={{ mr: 1 }}>
                      <KeyboardArrowUpIcon />
                    </Button>
                    <Button variant="outlined" onClick={() => moveItemDown(result.portfolioId)}>
                      <KeyboardArrowDownIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default MainPageManager;
