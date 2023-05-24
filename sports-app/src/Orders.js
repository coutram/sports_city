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

async function getData(props) {
  const resp = await fetch(
    'http://localhost:5000/', {
        method: "get",
        headers: {
            'Content-Type': 'application/json'
        }
    })

    const result = await resp.json()
    return result
}

function ratingAlgo (row)  { 
  return Math.ceil(row.G * row["W-L%"])
}


function Orders() { 
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        <Title>Recent Orders</Title>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Sports Team</TableCell>
              <TableCell>Wins</TableCell>
              <TableCell>Win %</TableCell>
              <TableCell align="right">Ratings</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data && data.map((row) => (
        <TableRow key={row.Rk}>
          <TableCell>{row.Franchise}</TableCell>
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

