import { useEffect, useState } from 'react';

function FetchEmployees() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchEmployees() {
      const response = await fetch('http://localhost:5000/');
      const actualData = await response.json();
      setData(actualData);
    }

    fetchEmployees();
  }, []);

  return (
    <div>
      {data.map(name => <div>{name}</div>)}
    </div>
  );
}