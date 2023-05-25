import React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { DialogModeOptions, PortfolioData } from '@types';
import { initPortfolioData } from '@initData';
import { formatDate, formatDateTime } from '@utils/dateHandler';
import { booleanToText, uniqueFileNameToFileName } from '@utils/commonUtils';
import {
  createPortfolio,
  fetchPortfolio,
  updatePortfolio,
  deletePortfolio,
} from '@services/firebase/firestore/portfolioManager';
import CustomTableCell from '@components/CustomTableCell';
import Loading from '@components/Loading';
import { MuiColorInput } from 'mui-color-input';

function PortfolioManager() {
  const [portfolioData, setPortfolioData] = React.useState<PortfolioData>(initPortfolioData);
  const [portfolioDataList, setPortfolioDataList] = React.useState<PortfolioData[] | []>([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [dialogMode, setDialogMode] = React.useState<DialogModeOptions>('등록');

  React.useEffect(() => {
    getAllPortfolio();
  }, []);

  const handleOpenCreateDialog = () => {
    setIsOpen(true);
    setDialogMode('등록');
  };

  const handleOpenUpdateDialog = (portfolioId: string) => {
    const selectedPortfolioData = portfolioDataList.find((data) => data.portfolioId === portfolioId);
    if (selectedPortfolioData) setPortfolioData(selectedPortfolioData);
    setIsOpen(true);
    setDialogMode('수정');
  };

  const handleClose = () => {
    setIsOpen(false);
    setPortfolioData(initPortfolioData);
  };

  const getAllPortfolio = async () => {
    try {
      setIsLoading(true);
      const fetchDataList = await fetchPortfolio();
      setPortfolioDataList(fetchDataList);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error('Error pages/portfolioManager/fetchPortfolio : ', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPortfolioData((prevPortfolioData) => ({
      ...prevPortfolioData,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<unknown>) => {
    const { name, value } = e.target;
    setPortfolioData((prevPortfolioData) => ({
      ...prevPortfolioData,
      [name]: value === '표시' ? true : false,
    }));
  };

  const handleColorChange = (color: string) => {
    setPortfolioData((prevPortfolioData) => ({
      ...prevPortfolioData,
      logoBackground: color,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const file = e.target.files?.[0] || null;
    let uniqueFileName = '';
    if (file) uniqueFileName = `${Date.now()}_${file.name}`;

    setPortfolioData((prevPortfolioData) => ({
      ...prevPortfolioData,
      [name]: file,
      [name + 'Name']: uniqueFileName,
    }));
  };

  const moveItemUp = async (id: string) => {
    try {
      const itemIndex = portfolioDataList.findIndex((item) => item.portfolioId === id);
      if (itemIndex > 0) {
        setIsLoading(true);
        const prevItem = portfolioDataList[itemIndex - 1];
        const currentItem = portfolioDataList[itemIndex];
        const prevNo = prevItem.portfolioNo;
        const currentNo = currentItem.portfolioNo;
        prevItem.portfolioNo = currentNo;
        currentItem.portfolioNo = prevNo;
        await updatePortfolio(prevItem);
        await updatePortfolio(currentItem);
        await getAllPortfolio();
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
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
        const nextNo = nextItem.portfolioNo;
        const currentNo = currentItem.portfolioNo;
        nextItem.portfolioNo = currentNo;
        currentItem.portfolioNo = nextNo;
        await updatePortfolio(nextItem);
        await updatePortfolio(currentItem);
        await getAllPortfolio();
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Error pages/portfolioManager/moveItemDown : ', error);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await createPortfolio(portfolioData);
      await getAllPortfolio();
      handleClose();
      setPortfolioData(initPortfolioData);
      alert('등록이 완료됐습니다.');
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error('Error pages/portfolioManager/handleCreateSubmit : ', error);
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const prefItem = portfolioDataList.find((item) => item.portfolioId === portfolioData.portfolioId);
      const prefLogoName = prefItem ? prefItem.portfolioLogoName : '';
      const prefInvLogoName = prefItem ? prefItem.portfolioInvLogoName : '';
      await updatePortfolio(portfolioData, prefLogoName, prefInvLogoName);
      await getAllPortfolio();
      handleClose();
      setPortfolioData(initPortfolioData);
      alert('수정이 완료됐습니다.');
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error('Error pages/portfolioManager/handleUpdateSubmit : ', error);
    }
  };

  const handleDeleteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await deletePortfolio(portfolioData);
      await getAllPortfolio();
      handleClose();
      setPortfolioData(initPortfolioData);
      alert('삭제가 완료됐습니다.');
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error('Error pages/portfolioManager/handleDeleteSubmit : ', error);
    }
  };

  return (
    <Box sx={{ mt: 6 }}>
      <Loading isLoading={isLoading} />
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h5">포트폴리오 관리</Typography>
        <Button onClick={() => handleOpenCreateDialog()} variant="contained">
          등록
        </Button>
      </Stack>
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
                    <Typography
                      onClick={() => handleOpenUpdateDialog(result.portfolioId)}
                      sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                    >
                      {result.portfolioCompanyName}
                    </Typography>
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
      <Dialog open={isOpen} onClose={handleClose}>
        <DialogTitle id="alert-dialog-title">포트폴리오 {dialogMode}</DialogTitle>
        <DialogContent>
          <Grid container sx={{ alignItems: 'center' }} spacing={1}>
            <Grid item xs={3} justifyContent={'center'}>
              <Typography align="center">회사명</Typography>
            </Grid>
            <Grid item xs={7}>
              <TextField
                placeholder="회사명을 입력해주세요"
                fullWidth
                type="text"
                size="small"
                name="portfolioCompanyName"
                value={portfolioData.portfolioCompanyName}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={3}>
              <Typography align="center">로고</Typography>
              <Typography align="center" fontSize={5}>
                (일반 색상 버전)
              </Typography>
            </Grid>
            <Grid item xs={7}>
              <TextField
                placeholder="등록된 파일이 없습니다"
                fullWidth
                type="text"
                size="small"
                value={uniqueFileNameToFileName(portfolioData.portfolioLogoName)}
              />
              <input
                accept="image/*"
                id="portfolioLogo"
                type="file"
                name="portfolioLogo"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </Grid>
            <Grid item xs={2}>
              <label htmlFor="portfolioLogo">
                <Button variant="contained" component="span" size="small">
                  찾아보기
                </Button>
              </label>
            </Grid>
            <Grid item xs={3}>
              <Typography align="center">로고</Typography>
              <Typography align="center" fontSize={5}>
                (반전 색상 버전)
              </Typography>
            </Grid>
            <Grid item xs={7}>
              <TextField
                placeholder="등록된 파일이 없습니다"
                fullWidth
                type="text"
                size="small"
                value={uniqueFileNameToFileName(portfolioData.portfolioInvLogoName)}
              />
              <input
                accept="image/*"
                id="portfolioInvLogo"
                type="file"
                name="portfolioInvLogo"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </Grid>
            <Grid item xs={2}>
              <label htmlFor="portfolioInvLogo">
                <Button variant="contained" component="span" size="small">
                  찾아보기
                </Button>
              </label>
            </Grid>
            <Grid item xs={3}>
              <Typography align="center">로고 배경 색상</Typography>
            </Grid>
            <Grid item xs={7}>
              <MuiColorInput
                size="small"
                value={portfolioData.logoBackground}
                name="logoBackground"
                onChange={handleColorChange}
              />
            </Grid>
            <Grid item xs={3}>
              <Typography align="center">회사 설명</Typography>
            </Grid>
            <Grid item xs={9}>
              <TextField
                placeholder="회사 설명을 입력해주세요"
                fullWidth
                type="text"
                name="portfolioCompanyDescription"
                size="small"
                value={portfolioData.portfolioCompanyDescription}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={3}>
              <Typography align="center">포트폴리오 노출</Typography>
            </Grid>
            <Grid item xs={9}>
              <Select
                size="small"
                name="isEnabledPortfolio"
                value={booleanToText(portfolioData.isEnabledPortfolio)}
                onChange={handleSelectChange}
              >
                <MenuItem value={booleanToText(true)}>On</MenuItem>
                <MenuItem value={booleanToText(false)}>Off</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={3}>
              <Typography align="center">메인페이지 노출</Typography>
            </Grid>
            <Grid item xs={9}>
              <Select
                size="small"
                name="isEnabledMainPage"
                value={booleanToText(portfolioData.isEnabledMainPage)}
                onChange={handleSelectChange}
              >
                <MenuItem value={booleanToText(true)}>On</MenuItem>
                <MenuItem value={booleanToText(false)}>Off</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={3}>
              <Typography align="center">링크(URL)</Typography>
            </Grid>
            <Grid item xs={9}>
              <TextField
                placeholder="링크(URL)을 입력해주세요"
                fullWidth
                type="text"
                size="small"
                name="portfolioLink"
                value={portfolioData.portfolioLink}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={3}>
              <Typography align="center">카테고리</Typography>
            </Grid>
            <Grid item xs={9}>
              <TextField
                placeholder="카테고리를 입력해주세요"
                fullWidth
                type="text"
                size="small"
                name="portfolioCategory"
                value={portfolioData.portfolioCategory}
                onChange={handleInputChange}
              />
            </Grid>
            {dialogMode === '수정' && (
              <>
                <Grid item xs={3}>
                  <Typography align="center">최초등록일</Typography>
                </Grid>
                <Grid item xs={9}>
                  <TextField
                    fullWidth
                    type="text"
                    size="small"
                    value={(portfolioData.createdAt && formatDateTime(portfolioData.createdAt)) || ''}
                  />
                </Grid>
                <Grid item xs={3}>
                  <Typography align="center">최종수정일</Typography>
                </Grid>
                <Grid item xs={9}>
                  <TextField
                    fullWidth
                    type="text"
                    size="small"
                    value={(portfolioData.updatedAt && formatDateTime(portfolioData.updatedAt)) || ''}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          {dialogMode === '등록' ? (
            <Button onClick={handleCreateSubmit} autoFocus variant="contained">
              등록
            </Button>
          ) : (
            <>
              <Button onClick={handleUpdateSubmit} autoFocus variant="contained">
                수정
              </Button>
              <Button onClick={handleDeleteSubmit} variant="contained">
                삭제
              </Button>
            </>
          )}
          <Button onClick={handleClose} variant="contained">
            취소
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default PortfolioManager;
