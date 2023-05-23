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
  Autocomplete
} from '@mui/material';
import { MuiColorInput } from 'mui-color-input'
import CustomTableCell from '@components/CustomTableCell';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

function PortfolioManager() {
  const [open, isOpen] = React.useState(false);
  const [mode, setDialogMode] = React.useState<'등록'|'수정'>('등록');
  const [value, setValue] = React.useState('#000');
  
  const handleChange = (newValue:string) => {
      setValue(newValue)
    }

  const handleClickOpen = (mode: '등록'|'수정') => {
    isOpen(true);
    setDialogMode(mode);
  };

  const handleClose = () => {
    isOpen(false);
    setValue('#ffffff');
  };

  return (
    <Box sx={{ mt: 6 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h5">포트폴리오 관리</Typography>
        <Button onClick={()=>handleClickOpen('등록')} variant="contained">등록</Button>
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
                    <Typography onClick={()=>handleClickOpen('수정')} sx={{ textDecoration: 'underline', cursor: 'pointer' }}>
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
        <DialogTitle id="alert-dialog-title">포트폴리오 {mode}</DialogTitle>
        <Box sx={{}}>
          <DialogContent>
            <Grid container sx={{ alignItems: 'center' }} spacing={1}>
              <Grid item xs={3} justifyContent={'center'}>
                <Typography align="center">회사명</Typography>
              </Grid>
              <Grid item xs={7}>
                <TextField placeholder="회사명을 입력해주세요" fullWidth type="companyName" size='small' onChange={() => {}}/>
              </Grid>
              <Grid item xs={3}>
                <Typography align="center">로고</Typography>
                <Typography align="center" fontSize={5}>(일반 색상 버전)</Typography>
              </Grid>
              <Grid item xs={7}>
                <TextField placeholder="등록된 파일이 없습니다" fullWidth type="companyName" size='small' onChange={() => {}}/>
              </Grid>
              <Grid item xs={2}>
                <Button onChange={() => {}} variant="contained" size='small'>찾아보기</Button>
              </Grid>
              <Grid item xs={3}>
                <Typography align="center">로고</Typography>
                <Typography align="center" fontSize={5}>(반전 색상 버전)</Typography>
              </Grid>
              <Grid item xs={7}>
                <TextField placeholder="등록된 파일이 없습니다" fullWidth type="companyName" size='small' onChange={() => {}} />
              </Grid>
              <Grid item xs={2}>
                <Button onChange={() => {}} variant="contained" size='small'>찾아보기</Button>
              </Grid>
              <Grid item xs={3}>
                <Typography align="center">로고 배경 색상</Typography>
              </Grid>
              <Grid item xs={7}>
                <MuiColorInput size='small' value={value} onChange={handleChange} />
              </Grid>
              <Grid item xs={3}>
                <Typography align="center">회사 설명</Typography>
              </Grid>
              <Grid item xs={9}>
                <TextField placeholder="회사 설명을 입력해주세요" fullWidth type="companyName" size='small' onChange={() => {}} />
              </Grid>
              <Grid item xs={3}>
                <Typography align="center">포트폴리오 노출</Typography>
              </Grid>
              <Grid item xs={9}>
              <Autocomplete
                size='small'
                options={[{label:"On", id: 1}, {label:"Off", id: 2}]}
                renderInput={(params) => <TextField {...params} />}/>
              </Grid>
              <Grid item xs={3}>
                <Typography align="center">메인페이지 노출</Typography>
              </Grid>
              <Grid item xs={9}>
              <Autocomplete
                size='small'
                options={[{label:"On", id: 1}, {label:"Off", id: 2}]}
                renderInput={(params) => <TextField {...params} />}/>
              </Grid>
              <Grid item xs={3}>
                <Typography align="center">링크(URL)</Typography>
              </Grid>
              <Grid item xs={9}>
                <TextField fullWidth type="companyName" size='small' onChange={() => {}} />
              </Grid>
              <Grid item xs={3}>
                <Typography align="center">카테고리</Typography>
              </Grid>
              <Grid item xs={9}>
                <TextField placeholder="카테고리를 입력해주세요" fullWidth type="companyName" size='small' onChange={() => {}} />
              </Grid>
            </Grid>
            {mode === '수정'
            ? <>
                <Grid item xs={3}>
                  <Typography align="center">최초등록일</Typography>
                </Grid>
                <Grid item xs={9}>
                  <TextField fullWidth type="companyName" size='small' />
                </Grid>
                
                <Grid item xs={3}>
                  <Typography align="center">최초수정일</Typography>
                </Grid>
                <Grid item xs={9}>
                  <TextField fullWidth type="companyName" size='small' />
                </Grid>
            </>
            :
            <></>
           }
          </DialogContent>
          {mode === '등록'
                    ? <DialogActions>
                        <Button onClick={() => {}} autoFocus variant="contained">등록</Button>
                        <Button onClick={handleClose} variant="contained">취소</Button>        
                      </DialogActions>    
                    : <DialogActions>
                        <Button onClick={() => {}} autoFocus variant="contained">수정</Button>
                        <Button onClick={() => {}} variant="contained">삭제</Button>
                        <Button onClick={handleClose} variant="contained">취소</Button>
                        </DialogActions>
          }
        </Box>
      </Dialog>
    </Box>
  );
}

export default PortfolioManager;
