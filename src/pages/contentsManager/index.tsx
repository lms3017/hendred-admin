import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Paper,
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
import { ContentsData } from '@types';
import { initContentsData } from '@constants';
import { formatDate } from '@utils/dateHandler';
import { booleanToText } from '@utils/DataFormatter';
import { createContents, fetchAllContents, updateDocNo } from '@services/contentsManager';
import CustomTableCell from '@components/CustomTableCell';

function ContentsManager() {
  const [contentsData, setContentsData] = useState<ContentsData>(initContentsData);
  const [contentsDataList, setContentsDataList] = useState<ContentsData[] | []>([]);

  useEffect(() => {
    getAllContents();
  }, []);

  const getAllContents = () => {
    fetchAllContents()
      .then((fetchDataList) => {
        setContentsDataList(fetchDataList);
      })
      .catch((error) => console.error('Error pages/contentsManager/fetchContents : ', error));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContentsData((prevContentsData) => ({
      ...prevContentsData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setContentsData((prevContentsData) => ({
      ...prevContentsData,
      contentsImage: file,
    }));
  };

  const moveItemUp = async (id: string) => {
    const itemIndex = contentsDataList.findIndex((item) => item.docId === id);
    if (itemIndex > 0) {
      const prevItem = contentsDataList[itemIndex - 1];
      const currentItem = contentsDataList[itemIndex];
      prevItem.docNo += 1;
      currentItem.docNo -= 1;
      await updateDocNo(prevItem.docId, prevItem.docNo);
      await updateDocNo(currentItem.docId, currentItem.docNo);
      alert('업데이트가 완료됬습니다.');
      getAllContents();
    }
  };

  const moveItemDown = async (id: string) => {
    const itemIndex = contentsDataList.findIndex((item) => item.docId === id);
    if (itemIndex < contentsDataList.length - 1) {
      const nextItem = contentsDataList[itemIndex + 1];
      const currentItem = contentsDataList[itemIndex];
      nextItem.docNo -= 1;
      currentItem.docNo += 1;
      await updateDocNo(nextItem.docId, nextItem.docNo);
      await updateDocNo(currentItem.docId, currentItem.docNo);
      alert('업데이트가 완료됬습니다.');
      getAllContents();
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      //todo: test code
      setContentsData((pref) => ({
        ...pref,
        contentsDescription: '컨텐츠설명 작성',
        isEnabledContents: true,
      }));

      await createContents(contentsData);
      getAllContents();
    } catch (error) {
      console.error('Error pages/contentsManager/handleFormSubmit : ', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          name="contentsName"
          value={contentsData.contentsName}
          onChange={handleInputChange}
          placeholder="Name"
        />
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit">Upload data</button>
      </form>
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
                  <TableCell align="center">{result.docNo}</TableCell>
                  <TableCell align="center">
                    <Typography onClick={() => {}} sx={{ textDecoration: 'underline', cursor: 'pointer' }}>
                      {result.contentsName}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">{booleanToText(result.isEnabledContents)}</TableCell>
                  <TableCell align="center">{result.uploadDate && formatDate(result.uploadDate)}</TableCell>
                  <TableCell align="center">
                    <Button variant="outlined" onClick={() => moveItemUp(result.docId)} sx={{ mr: 1 }}>
                      <KeyboardArrowUpIcon />
                    </Button>
                    <Button variant="outlined" onClick={() => moveItemDown(result.docId)}>
                      <KeyboardArrowDownIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default ContentsManager;
