import React, { useEffect } from 'react';
import { createDocument, fetchDocument } from '@services/firebaseApi';
import {
  Box,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

function ContentManager() {
  useEffect(() => {
    const test = async () => {
      try {
        const a = await fetchDocument('testA');
        console.log(a);
      } catch (error) {
        console.log(error);
      }
    };
    // test();
  }, []);

  const handleFormSubmit = async (event: React.FormEvent) => {};

  return (
    // <div>
    //   <form onSubmit={handleFormSubmit}>
    //     <input type="text" name="name" value={1} onChange={() => {}} placeholder="Name" />
    //     <input type="text" name="logoBackground" value={1} onChange={() => {}} placeholder="logoBackground" />
    //     <input type="file" accept="image/*" onChange={() => {}} />
    //     <button type="submit">Upload Image</button>
    //   </form>
    // </div>
    <Box sx={{ mt: 6 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h5">포트폴리오 관리</Typography>
        <Button variant="contained">등록</Button>
      </Stack>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">순서</TableCell>
              <TableCell align="center">회사명</TableCell>
              <TableCell align="center">포트폴리오 노출</TableCell>
              <TableCell align="center">등록일</TableCell>
              <TableCell align="center">순서</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[1, 2, 3].map((result, index) => {
              return (
                <TableRow hover key={index}>
                  <TableCell align="center">{result}</TableCell>
                  <TableCell align="center">
                    <Typography onClick={() => {}} sx={{ textDecoration: 'underline', cursor: 'pointer' }}>
                      회사명 표기공간으로 사용
                    </Typography>
                  </TableCell>
                  <TableCell align="center">{result}</TableCell>
                  <TableCell align="center">{result}</TableCell>
                  <TableCell align="center">
                    <Button>{'<'}</Button>
                    <Button>{'>'}</Button>
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

export default ContentManager;
