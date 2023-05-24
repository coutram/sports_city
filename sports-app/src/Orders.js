import React, { useEffect, useState } from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import Title from './Title';

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
  console.log(row)
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

function Orders() { 
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
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
            {data && data.map((row) => (
        <TableRow key={`${row.Rk}-${row.Franchise}`}>
          <TableCell>{row.Franchise}</TableCell>
          <TableCell>{row.Sport || row.sport} </TableCell>
          <TableCell>{row.W}</TableCell>
          <TableCell>{row["W-L%"]}</TableCell>
          <TableCell align="right">{ratingAlgo(row)}</TableCell>
        </TableRow>
      ))}
          </TableBody>
        </Table>
      </React.Fragment>
   )
    
    
}

export default Orders;

