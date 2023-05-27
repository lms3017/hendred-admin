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
import { DialogModeOptions, NodeData } from '@types';
import { initNodeData } from '@initData';
import { formatDate, formatDateTime } from '@utils/dateHandler';
import { booleanToText, uniqueFileNameToFileName } from '@utils/commonUtils';
import { createNode, fetchNode, updateNode, deleteNode } from '@services/firebase/firestore/nodeManager';
import CustomTableCell from '@components/CustomTableCell';
import Loading from '@components/Loading';

function NodeManager() {
  const [nodeData, setNodeData] = React.useState<NodeData>(initNodeData);
  const [nodeDataList, setNodeDataList] = React.useState<NodeData[] | []>([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [dialogMode, setDialogMode] = React.useState<DialogModeOptions>('등록');

  React.useEffect(() => {
    getAllNode();
  }, []);

  const handleOpenCreateDialog = () => {
    setIsOpen(true);
    setDialogMode('등록');
  };

  const handleOpenUpdateDialog = (nodeId: string) => {
    const selectedNodeData = nodeDataList.find((data) => data.nodeId === nodeId);
    if (selectedNodeData) setNodeData(selectedNodeData);
    setIsOpen(true);
    setDialogMode('수정');
  };

  const handleClose = () => {
    setIsOpen(false);
    setNodeData(initNodeData);
  };

  const getAllNode = async () => {
    try {
      setIsLoading(true);
      const fetchDataList = await fetchNode();
      setNodeDataList(fetchDataList);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      alert('오류가 발생했습니다.');
      console.error('Error pages/nodeManager/fetchNode : ', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNodeData((prevNodeData) => ({
      ...prevNodeData,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<unknown>) => {
    const { name, value } = e.target;
    setNodeData((prevNodeData) => ({
      ...prevNodeData,
      [name]: value === '표시' ? true : false,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const file = e.target.files?.[0] || null;
    let uniqueFileName = '';
    if (file) uniqueFileName = `${Date.now()}_${file.name}`;

    setNodeData((prevNodeData) => ({
      ...prevNodeData,
      [name]: file,
      [name + 'Name']: uniqueFileName,
    }));
  };

  const moveItemUp = async (id: string) => {
    try {
      const itemIndex = nodeDataList.findIndex((item) => item.nodeId === id);
      if (itemIndex > 0) {
        setIsLoading(true);
        const prevItem = nodeDataList[itemIndex - 1];
        const currentItem = nodeDataList[itemIndex];
        const prevNo = prevItem.nodeNo;
        const currentNo = currentItem.nodeNo;
        prevItem.nodeNo = currentNo;
        currentItem.nodeNo = prevNo;
        await updateNode(prevItem, '');
        await updateNode(currentItem, '');
        await getAllNode();
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      alert('오류가 발생했습니다.');
      console.error('Error pages/nodeManager/moveItemUp : ', error);
    }
  };

  const moveItemDown = async (id: string) => {
    try {
      setIsLoading(true);
      const itemIndex = nodeDataList.findIndex((item) => item.nodeId === id);
      if (itemIndex < nodeDataList.length - 1) {
        setIsLoading(true);
        const nextItem = nodeDataList[itemIndex + 1];
        const currentItem = nodeDataList[itemIndex];
        const nextNo = nextItem.nodeNo;
        const currentNo = currentItem.nodeNo;
        nextItem.nodeNo = currentNo;
        currentItem.nodeNo = nextNo;
        await updateNode(nextItem, '');
        await updateNode(currentItem, '');
        await getAllNode();
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      alert('오류가 발생했습니다.');
      console.error('Error pages/nodeManager/moveItemDown : ', error);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await createNode(nodeData);
      await getAllNode();
      handleClose();
      setNodeData(initNodeData);
      alert('등록이 완료됐습니다.');
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      alert('오류가 발생했습니다.');
      console.error('Error pages/nodeManager/handleCreateSubmit : ', error);
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const prefFileName = nodeDataList.find((item) => item.nodeId === nodeData.nodeId)?.nodeLogoName as string;
      await updateNode(nodeData, prefFileName);
      await getAllNode();
      handleClose();
      setNodeData(initNodeData);
      alert('수정이 완료됐습니다.');
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      alert('오류가 발생했습니다.');
      console.error('Error pages/nodeManager/handleUpdateSubmit : ', error);
    }
  };

  const handleDeleteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await deleteNode(nodeData);
      await getAllNode();
      handleClose();
      setNodeData(initNodeData);
      alert('삭제가 완료됐습니다.');
      setIsLoading(false);
    } catch (error) {
      console.error('Error pages/nodeManager/handleDeleteSubmit : ', error);
    }
  };

  return (
    <Box sx={{ mt: 6 }}>
      <Loading isLoading={isLoading} />
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h5">노드 관리</Typography>
        <Button onClick={() => handleOpenCreateDialog()} variant="contained">
          등록
        </Button>
      </Stack>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <CustomTableCell align="center">번호</CustomTableCell>
              <CustomTableCell align="center">노드 제목</CustomTableCell>
              <CustomTableCell align="center">노드 노출</CustomTableCell>
              <CustomTableCell align="center">등록일</CustomTableCell>
              <CustomTableCell align="center">순서</CustomTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {nodeDataList.map((result, index) => {
              return (
                <TableRow hover key={index}>
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell align="center">
                    <Typography
                      onClick={() => handleOpenUpdateDialog(result.nodeId)}
                      sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                    >
                      {result.nodeCompanyName || '---'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">{booleanToText(result.isEnabledNode)}</TableCell>
                  <TableCell align="center">{result.createdAt && formatDate(result.createdAt)}</TableCell>
                  <TableCell align="center">
                    <Button variant="outlined" onClick={() => moveItemUp(result.nodeId)} sx={{ mr: 1 }}>
                      <KeyboardArrowUpIcon />
                    </Button>
                    <Button variant="outlined" onClick={() => moveItemDown(result.nodeId)}>
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
        <DialogTitle id="alert-dialog-title">노드 {dialogMode}</DialogTitle>
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
                name="nodeCompanyName"
                value={nodeData.nodeCompanyName}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={3}>
              <Typography align="center">로고</Typography>
            </Grid>
            <Grid item xs={7}>
              <TextField
                placeholder="등록된 파일이 없습니다"
                fullWidth
                type="text"
                size="small"
                value={uniqueFileNameToFileName(nodeData.nodeLogoName)}
              />
              <input
                accept="image/*"
                id="file-upload"
                type="file"
                name="nodeLogo"
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
                name="nodeCompanyDescription"
                size="small"
                value={nodeData.nodeCompanyDescription}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={3}>
              <Typography align="center">추가 설명</Typography>
            </Grid>
            <Grid item xs={9}>
              <TextField
                multiline
                rows={10}
                placeholder="추가 설명을 입력해주세요"
                fullWidth
                type="text"
                name="nodeExtraDescription"
                size="small"
                value={nodeData.nodeExtraDescription}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={3}>
              <Typography align="center">노드 노출</Typography>
            </Grid>
            <Grid item xs={9}>
              <Select
                size="small"
                name="isEnabledNode"
                value={booleanToText(nodeData.isEnabledNode)}
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
                name="nodeLink"
                value={nodeData.nodeLink}
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
                    value={(nodeData.createdAt && formatDateTime(nodeData.createdAt)) || ''}
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
                    value={(nodeData.updatedAt && formatDateTime(nodeData.updatedAt)) || ''}
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

export default NodeManager;
