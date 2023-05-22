import React from 'react';
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
import CustomTableCell from '@components/CustomTableCell';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

function tempPort() {


  return (
            <Grid container rowSpacing={-1} >
              <Grid item xs={3}>
                <Typography>회사명</Typography>
              </Grid>
              <Grid item xs={9}>
                <TextField fullWidth type="companyName" margin="none" onChange={() => {}} />
              </Grid>
              <Grid item xs={3}>
                <Typography>로고(일반 색상 버전)</Typography>
              </Grid>
              <Grid item xs={9}>
                <TextField fullWidth type="companyName" margin="normal" onChange={() => {}} />
              </Grid>
              <Grid item xs={3}>
                <Typography>로고(반전 색상 버전)</Typography>
              </Grid>
              <Grid item xs={9}>
                <TextField fullWidth type="companyName" margin="normal" onChange={() => {}} />
              </Grid>
              <Grid item xs={3}>
                <Typography>로고 배경 색상</Typography>
              </Grid>
              <Grid item xs={9}>
                <TextField fullWidth type="companyName" margin="normal" onChange={() => {}} />
              </Grid>
              <Grid item xs={3}>
                <Typography>회사 설명</Typography>
              </Grid>
              <Grid item xs={9}>
                <TextField fullWidth type="companyName" margin="normal" onChange={() => {}} />
              </Grid>
              <Grid item xs={3}>
                <Typography>포트폴리오 노출</Typography>
              </Grid>
              <Grid item xs={9}>
                <TextField fullWidth type="companyName" margin="normal" onChange={() => {}} />
              </Grid>
              <Grid item xs={3}>
                <Typography>메인페이지 노출</Typography>
              </Grid>
              <Grid item xs={9}>
                <TextField fullWidth type="companyName" margin="normal" onChange={() => {}} />
              </Grid>
              <Grid item xs={3}>
                <Typography>링크(URL)</Typography>
              </Grid>
              <Grid item xs={9}>
                <TextField fullWidth type="companyName" margin="normal" onChange={() => {}} />
              </Grid>
              <Grid item xs={3}>
                <Typography>카테고리</Typography>
              </Grid>
              <Grid item xs={9}>
                <TextField fullWidth type="companyName" margin="normal" onChange={() => {}} />
              </Grid>
            </Grid>

  );
}

export default tempPort;
