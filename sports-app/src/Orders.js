import React, { useEffect, useState } from 'react';
import Link from '@mui/material/Link';
import { styled } from '@mui/system';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination, {
  tablePaginationClasses as classes,
} from '@mui/base/TablePagination';


import Title from './Title';
import { TableFooter } from '@mui/material';

// Generate Order Data
function createData(Rk, Franchise, From, To, W, L) {
  return {Rk, Franchise, From, To, W, L};
}


function preventDefault(event) {
  event.preventDefault();
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

const blue = {
  200: '#A5D8FF',
  400: '#3399FF',
};

const grey = {
  50: '#f6f8fa',
  100: '#eaeef2',
  200: '#d0d7de',
  300: '#afb8c1',
  400: '#8c959f',
  500: '#6e7781',
  600: '#57606a',
  700: '#424a53',
  800: '#32383f',
  900: '#24292f',
};

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function ratingAlgo (row)  { 
  let multipler = 1 
  let championship = 0
  if (row["SB"] && row.Sport || row.sport == "NFL") { 
    multipler = 10
    championship = row["SB"] *1000
  } else if (row.Champ && row.Sport || row.sport == "NBA")  { 
    multipler = 5
    championship = row.Champ * 1000
  } else if (row["WS"] && row.Sport || row.sport == "MLB") { 

    championship = row["WS"] * 1000
  }

  return Math.ceil(championship + multipler * row.G * row["W-L%"])
}


const CustomTablePagination = styled(TablePagination)(
  ({ theme }) => `
  & .${classes.spacer} {
    display: none;
  }

  & .${classes.toolbar}  {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    background-color: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};

    @media (min-width: 768px) {
      flex-direction: row;
      align-items: center;
    }
  }

  & .${classes.selectLabel} {
    margin: 0;
  }

  & .${classes.select}{
    padding: 2px 6px;
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[800] : grey[200]};
    border-radius: 50px;
    background-color: transparent;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};

    &:hover {
      background-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[50]};
    }

    &:focus {
      outline: 1px solid ${theme.palette.mode === 'dark' ? blue[400] : blue[200]};
    }
  }

  & .${classes.displayedRows} {
    margin: 0;

    @media (min-width: 768px) {
      margin-left: auto;
    }
  }

  & .${classes.actions} {
    padding: 2px;
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[800] : grey[200]};
    border-radius: 50px;
    text-align: center;
  }

  & .${classes.actions} > button {
    margin: 0 8px;
    border: transparent;
    border-radius: 4px;
    background-color: transparent;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};

    &:hover {
      background-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[100]};
    }

    &:focus {
      outline: 1px solid ${theme.palette.mode === 'dark' ? blue[400] : blue[200]};
    }
  }
  `,
);

function Orders() {   
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/`
        );
        if (!response.ok) {
          console.log("here")
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        const actualData = await response.json();
        setData(actualData);
        console.log(actualData)
        setError(null);
      } catch(err) {
        setError(err.message);
        setData(null);
      } finally {
        setLoading(false);
      }  
    }
    getData()
    console.log(data)
   }, []);

   return (
    <React.Fragment>
        <Title>Sports Team ArvOutram Rating</Title>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell><b>Sports Team</b></TableCell>
              <TableCell><b>Sport</b></TableCell>
              <TableCell><b>Wins</b></TableCell>
              <TableCell><b>Win %</b></TableCell>
              <TableCell align="right"><b>Ratings</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {(rowsPerPage > 0 && data 
            ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : []
          ).map((row) => (
        <TableRow key={`${row.Rk}-${row.Franchise}`}>
          <TableCell>{row.Franchise}</TableCell>
          <TableCell>{row.Sport || row.sport} </TableCell>
          <TableCell>{row.W}</TableCell>
          <TableCell>{row["W-L%"]}</TableCell>
          <TableCell align="right">{ratingAlgo(row)}</TableCell>
        </TableRow>
      ))}
          </TableBody>
          <TableFooter>
          <TableRow>
            <CustomTablePagination
              rowsPerPageOptions={[10, 20, 50, { label: 'All', value: -1 }]}
              colSpan={3}
              count={data ? data.length : 0}
              rowsPerPage={rowsPerPage}
              page={page}
              slotProps={{
                select: {
                  'aria-label': 'rows per page',
                },
                actions: {
                  showFirstButton: true,
                  showLastButton: true,
                },
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableRow>
        </TableFooter>
        </Table>
      </React.Fragment>
   )
    
   
    
}

export default Orders;

