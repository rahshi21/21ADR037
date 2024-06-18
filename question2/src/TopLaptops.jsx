import React, { useState, useEffect } from 'react';
import axios from 'axios';

const apiUrl = 'http://20.244.56.144/test';
const authUrl = `${apiUrl}/auth`;
const dataUrl = `${apiUrl}/companies/AMZ/categories/Laptop/products?top=10&minPrice=1&maxPrice=10000`;

const App = () => {
  const [accessToken, setAccessToken] = useState('');
  const [products, setProducts] = useState([]);

  // Function to authenticate and get access token
  const authenticateAndGetToken = async () => {
    const requestBody = {
      companyName: 'AFFORDMED',
      clientID: '40913b07-f2f6-4d18-a745-c4619e1fad70',
      clientSecret: 'FQaDrGmFXOqPkbUl',
      ownerName: 'vibeesh',
      ownerEmail: 'vibeeshn.21aid@kongu.edu',
      rollNo: '21ADR059',
    };

    try {
      const response = await axios.post(authUrl, requestBody, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.data.access_token) {
        throw new Error('Access token not received');
      }

      setAccessToken(response.data.access_token);
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  // Function to fetch data using access token
  const fetchData = async () => {
    try {
      const response = await axios.get(dataUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setProducts(response.data); // Assuming data structure matches expected response
    } catch (error) {
      console.error('Data fetching error:', error);
    }
  };

  useEffect(() => {
    authenticateAndGetToken(); // Call authentication on component mount
  }, []); // Only runs once on mount

  useEffect(() => {
    if (accessToken) {
      fetchData(); // Fetch data when accessToken updates
    }
  }, [accessToken]); // Runs when accessToken changes

  return (
    <div>
      <h1>Product List</h1>
      <ul>
        {products.map((product, index) => (
          <li key={index}>{product.name}</li> // Replace with actual product properties
        ))}
      </ul>
    </div>
  );
};

export default App;
