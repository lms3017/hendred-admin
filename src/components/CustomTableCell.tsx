import { styled } from '@mui/material/styles';
import { TableCell, tableCellClasses } from '@mui/material';

const CustomTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.common.white,
    fontWeight: 'bold',
  },
}));

export default CustomTableCell;
