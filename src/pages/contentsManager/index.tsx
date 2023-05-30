import React, { useEffect, useState } from 'react';
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
import { DialogModeOptions, ContentsData } from '@types';
import { initContentsData } from '@initData';
import { formatDate, formatDateTime } from '@utils/dateHandler';
import { booleanToText, uniqueFileNameToFileName } from '@utils/commonUtils';
import {
  createContents,
  fetchContents,
  updateContents,
  deleteContents,
} from '@services/firebase/firestore/contentsManager';
import CustomTableCell from '@components/CustomTableCell';
import Loading from '@components/Loading';

function ContentsManager() {
  const [contentsData, setContentsData] = useState<ContentsData>(initContentsData);
  const [contentsDataList, setContentsDataList] = useState<ContentsData[] | []>([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [dialogMode, setDialogMode] = React.useState<DialogModeOptions>('등록');

  useEffect(() => {
    getAllContents();
  }, []);

  const handleOpenCreateDialog = () => {
    setIsOpen(true);
    setDialogMode('등록');
  };

  const handleOpenUpdateDialog = (contentsId: string) => {
    const selectedContentsData = contentsDataList.find((data) => data.contentsId === contentsId);
    if (selectedContentsData) setContentsData(selectedContentsData);
    setIsOpen(true);
    setDialogMode('수정');
  };

  const handleClose = () => {
    setIsOpen(false);
    setContentsData(initContentsData);
  };

  const getAllContents = async () => {
    try {
      setIsLoading(true);
      const fetchDataList = await fetchContents();
      setContentsDataList(fetchDataList);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      alert('오류가 발생했습니다.');
      console.error('Error pages/contentsManager/fetchContents : ', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContentsData((prevContentsData) => ({
      ...prevContentsData,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<unknown>) => {
    const { name, value } = e.target;
    setContentsData((prevContentsData) => ({
      ...prevContentsData,
      [name]: value === '표시' ? true : false,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const file = e.target.files?.[0] || null;
    let uniqueFileName = '';
    if (file) uniqueFileName = `${Date.now()}_${file.name}`;

    setContentsData((prevContentsData) => ({
      ...prevContentsData,
      [name]: file,
      [name + 'Name']: uniqueFileName,
    }));
  };

  const moveItemUp = async (id: string) => {
    try {
      const itemIndex = contentsDataList.findIndex((item) => item.contentsId === id);
      if (itemIndex > 0) {
        setIsLoading(true);
        const prevItem = contentsDataList[itemIndex - 1];
        const currentItem = contentsDataList[itemIndex];
        const prevNo = prevItem.contentsNo;
        const currentNo = currentItem.contentsNo;
        prevItem.contentsNo = currentNo;
        currentItem.contentsNo = prevNo;
        await updateContents(prevItem, '');
        await updateContents(currentItem, '');
        await getAllContents();
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      alert('오류가 발생했습니다.');
      console.error('Error pages/contentsManager/moveItemUp : ', error);
    }
  };

  const moveItemDown = async (id: string) => {
    try {
      const itemIndex = contentsDataList.findIndex((item) => item.contentsId === id);
      if (itemIndex < contentsDataList.length - 1) {
        setIsLoading(true);
        const nextItem = contentsDataList[itemIndex + 1];
        const currentItem = contentsDataList[itemIndex];
        const nextNo = nextItem.contentsNo;
        const currentNo = currentItem.contentsNo;
        nextItem.contentsNo = currentNo;
        currentItem.contentsNo = nextNo;
        await updateContents(nextItem, '');
        await updateContents(currentItem, '');
        await getAllContents();
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      alert('오류가 발생했습니다.');
      console.error('Error pages/contentsManager/moveItemDown : ', error);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await createContents(contentsData);
      await getAllContents();
      handleClose();
      setContentsData(initContentsData);
      alert('등록이 완료됐습니다.');
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      alert('오류가 발생했습니다.');
      console.error('Error pages/contentsManager/handleCreateSubmit : ', error);
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const prefFileName = contentsDataList.find((item) => item.contentsId === contentsData.contentsId)
        ?.contentsImageName as string;
      await updateContents(contentsData, prefFileName);
      await getAllContents();
      handleClose();
      setContentsData(initContentsData);
      alert('수정이 완료됐습니다.');
      setIsLoading(false);
      alert('오류가 발생했습니다.');
    } catch (error) {
      console.error('Error pages/contentsManager/handleUpdateSubmit : ', error);
    }
  };

  const handleDeleteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await deleteContents(contentsData);
      await getAllContents();
      handleClose();
      setContentsData(initContentsData);
      alert('삭제가 완료됐습니다.');
      setIsLoading(false);
    } catch (error) {
      alert('오류가 발생했습니다.');
      console.error('Error pages/contentsManager/handleDeleteSubmit : ', error);
    }
  };

  return (
    <Box sx={{ mt: 6 }}>
      <Loading isLoading={isLoading} />
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h5">컨텐츠 관리</Typography>
        <Button onClick={() => handleOpenCreateDialog()} variant="contained">
          등록
        </Button>
      </Stack>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <CustomTableCell align="center">번호</CustomTableCell>
              <CustomTableCell align="center">콘텐츠 제목</CustomTableCell>
              <CustomTableCell align="center">콘텐츠 노출</CustomTableCell>
              <CustomTableCell align="center">등록일</CustomTableCell>
              <CustomTableCell align="center">순서</CustomTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contentsDataList.map((result, index) => {
              return (
                <TableRow hover key={index}>
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell align="center">
                    <Typography
                      onClick={() => handleOpenUpdateDialog(result.contentsId)}
                      sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                    >
                      {result.contentsName || '---'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">{booleanToText(result.isEnabledContents)}</TableCell>
                  <TableCell align="center">{result.createdAt && formatDate(result.createdAt)}</TableCell>
                  <TableCell align="center">
                    <Button variant="outlined" onClick={() => moveItemUp(result.contentsId)} sx={{ mr: 1 }}>
                      <KeyboardArrowUpIcon />
                    </Button>
                    <Button variant="outlined" onClick={() => moveItemDown(result.contentsId)}>
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
        <DialogTitle id="alert-dialog-title">콘텐츠 {dialogMode}</DialogTitle>
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
                name="contentsName"
                value={contentsData.contentsName}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={3}>
              <Typography align="center">콘텐츠 표지</Typography>
            </Grid>
            <Grid item xs={7}>
              <TextField
                placeholder="등록된 파일이 없습니다"
                fullWidth
                type="text"
                size="small"
                value={uniqueFileNameToFileName(contentsData.contentsImageName)}
              />
              <input
                accept="image/*"
                id="file-upload"
                type="file"
                name="contentsImage"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </Grid>
            <Grid item xs={2}>
              <label htmlFor="file-upload">
                <Button variant="contained" component="span" size="small">
                  파일 추가
                </Button>
              </label>
            </Grid>
            <Grid item xs={3}>
              <Typography align="center">회사 설명</Typography>
            </Grid>
            <Grid item xs={9}>
              <TextField
                placeholder="회사 설명을 입력해주세요"
                fullWidth
                type="text"
                name="contentsDescription"
                size="small"
                value={contentsData.contentsDescription}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={3}>
              <Typography align="center">콘텐츠 노출</Typography>
            </Grid>
            <Grid item xs={9}>
              <Select
                size="small"
                name="isEnabledContents"
                value={booleanToText(contentsData.isEnabledContents)}
                onChange={handleSelectChange}
              >
                <MenuItem value={booleanToText(true)}>표시</MenuItem>
                <MenuItem value={booleanToText(false)}>비표시</MenuItem>
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
                name="contentsLink"
                value={contentsData.contentsLink}
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
                    value={(contentsData.createdAt && formatDateTime(contentsData.createdAt)) || ''}
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
                    value={(contentsData.updatedAt && formatDateTime(contentsData.updatedAt)) || ''}
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

export default ContentsManager;
