import { Backdrop, CircularProgress, Skeleton, styled, TableCell, tableCellClasses, TableRow } from '@mui/material';
import { BarLoader } from 'react-spinners';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#00ADEE",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  border: 8,
  borderColor: '#D2D2D2',
  boxShadow: '0 4 16 0 #0000000A',
  backgroundColor: "#FFFFFF",
  color: theme.palette.common.white,
}))

export default function LoadingScreen(): React.JSX.Element {
  return (
    <Backdrop open={true} sx={{ zIndex: 99 }}>
      <BarLoader color="#37d7b7" width={300} />
    </Backdrop>
  );
}

export function LoadingComponent(): React.JSX.Element {
  return (
    <Backdrop open={true} sx={{ zIndex: 99 }}>
      <CircularProgress color="inherit" />
    </Backdrop>
  )
}

export function TableLoadingComponent({ rowsNum, colsNum }: { rowsNum: number, colsNum: number }): React.JSX.Element[] {
  return [...Array(rowsNum)].map((_row, index) => (
    <StyledTableRow key={index}>
      {
        Array(colsNum).fill('--').map((_, colIndex) => (
          <StyledTableCell key={colIndex} component="th" scope="row">
            <Skeleton animation="wave" variant="text" />
          </StyledTableCell>
        ))
      }
    </StyledTableRow>
  ));
};
