import React, { useState, useEffect } from 'react';

const apiUrl = 'http://20.244.56.144/test/companies/AMZ/categories/Laptop/products?top=10&minPrice=1&maxPrice=10000';

const TopLaptops = () => {
  const [laptops, setLaptops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl, {
          headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzE4Njg3NTQwLCJpYXQiOjE3MTg2ODcyNDAsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6Ijg1MzAxYTE2LTJhMWMtNGQ4Yy04OWE3LTI0ODMwZDQ3YjhmZCIsInN1YiI6InJhaHNoaXRoYWtzLjIxYWlkQGtvbmd1LmVkdSJ9LCJjb21wYW55TmFtZSI6IktPTkdVIEVOR0lORUVSSU5HIENPTExFR0UiLCJjbGllbnRJRCI6Ijg1MzAxYTE2LTJhMWMtNGQ4Yy04OWE3LTI0ODMwZDQ3YjhmZCIsImNsaWVudFNlY3JldCI6InhEeVlHekRqTXhndmxlckQiLCJvd25lck5hbWUiOiJSQUhTSElUSEEgSyBTIiwib3duZXJFbWFpbCI6InJhaHNoaXRoYWtzLjIxYWlkQGtvbmd1LmVkdSIsInJvbGxObyI6IjIxQURSMDM3In0.0Swzvye_Z17ZxDmc8GY0qE9Xau3nJNUypY0DzmdsxJI'
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setLaptops(data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data. Please try again later.'); // Set an error message
      } finally {
        setLoading(false); // Set loading to false whether fetch was successful or not
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Render a loading indicator while fetching data
  }

  if (error) {
    return <div>Error: {error}</div>; // Render an error message if fetch fails
  }

  return (
    <div>
      <h1>Top 10 Laptops Sold on Amazon</h1>
      <ul>
        {laptops.map((laptop, index) => (
          <li key={index}>
            <strong>{laptop.productName}</strong>
            <p>Price: ${laptop.price}</p>
            <p>Rating: {laptop.rating}</p>
            <p>Discount: {laptop.discount}%</p>
            <p>Availability: {laptop.availability}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopLaptops;
