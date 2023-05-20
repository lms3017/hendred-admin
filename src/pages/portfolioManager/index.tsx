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

function PortfolioManager() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ mt: 6 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h5">포트폴리오 관리</Typography>
        <Button variant="contained">등록</Button>
      </Stack>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <CustomTableCell align="center">순서</CustomTableCell>
              <CustomTableCell align="center">회사명</CustomTableCell>
              <CustomTableCell align="center">포트폴리오 노출</CustomTableCell>
              <CustomTableCell align="center">등록일</CustomTableCell>
              <CustomTableCell align="center">순서</CustomTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[1, 2, 3].map((result, index) => {
              return (
                <TableRow hover key={index}>
                  <TableCell align="center">{result}</TableCell>
                  <TableCell align="center">
                    <Typography onClick={handleClickOpen} sx={{ textDecoration: 'underline', cursor: 'pointer' }}>
                      회사명 표기공간으로 사용
                    </Typography>
                  </TableCell>
                  <TableCell align="center">노출</TableCell>
                  <TableCell align="center">YYYY.MM.DD</TableCell>
                  <TableCell align="center">
                    <Button variant="outlined" sx={{ mr: 1 }}>
                      <KeyboardArrowUpIcon />
                    </Button>
                    <Button variant="outlined">
                      <KeyboardArrowDownIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle id="alert-dialog-title">포트폴리오 등록</DialogTitle>
        <Box sx={{}}>
          <DialogContent>
            <Grid container sx={{ alignItems: 'center' }}>
              <Grid item xs={3}>
                <Typography>회사명</Typography>
              </Grid>
              <Grid item xs={9}>
                <TextField fullWidth type="companyName" margin="normal" onChange={() => {}} />
              </Grid>
            </Grid>
            <TextField>asdf</TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} autoFocus>
              등록
            </Button>
            <Button onClick={handleClose}>취소</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}

export default PortfolioManager;
