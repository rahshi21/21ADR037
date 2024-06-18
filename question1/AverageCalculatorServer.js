const express = require('express');
const axios = require('axios').default;

const PORT = 9876;
const WINDOW_SIZE = 5; // Adjusted for clarity
const SERVER_URL = 'http://20.244.56.144/test/'; // Test server base URL
const accessToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzE4Njg3NTQwLCJpYXQiOjE3MTg2ODcyNDAsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6Ijg1MzAxYTE2LTJhMWMtNGQ4Yy04OWE3LTI0ODMwZDQ3YjhmZCIsInN1YiI6InJhaHNoaXRoYWtzLjIxYWlkQGtvbmd1LmVkdSJ9LCJjb21wYW55TmFtZSI6IktPTkdVIEVOR0lORUVSSU5HIENPTExFR0UiLCJjbGllbnRJRCI6Ijg1MzAxYTE2LTJhMWMtNGQ4Yy04OWE3LTI0ODMwZDQ3YjhmZCIsImNsaWVudFNlY3JldCI6InhEeVlHekRqTXhndmxlckQiLCJvd25lck5hbWUiOiJSQUhTSElUSEEgSyBTIiwib3duZXJFbWFpbCI6InJhaHNoaXRoYWtzLjIxYWlkQGtvbmd1LmVkdSIsInJvbGxObyI6IjIxQURSMDM3In0.0Swzvye_Z17ZxDmc8GY0qE9Xau3nJNUypY0DzmdsxJI'; // Replace with your access token

const app = express();

let window = [1, 2, 3, 4, 5]; // Initial window array with some pre-populated numbers

const getNumberType = (id) => {
  switch (id) {
    case 'p':
      return `${SERVER_URL}primes`;
    case 'f':
      return `${SERVER_URL}fibonacci`;
    case 'e':
      return `${SERVER_URL}even`;
    case 'r':
      return `${SERVER_URL}random`;
    default:
      return null;
  }
};

const fetchData = async (url) => {
  try {
    const response = await axios.get(url, {
      headers: { Authorization: accessToken },
      timeout: 500, // Timeout after 500ms
    });
    return response.data.numbers;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

// Function to fetch initial data on server startup
const fetchInitialData = async () => {
  try {
    const initialNumbers = await fetchData(`${SERVER_URL}e`); // Replace 'e' with desired initial number type
    window = initialNumbers.slice(0, WINDOW_SIZE); // Update window with fetched numbers
  } catch (error) {
    console.error('Error fetching initial data:', error);
  }
};

fetchInitialData(); // Call fetchInitialData on server startup

app.get('/numbers/:numberid', async (req, res) => {
  const numberTypeUrl = getNumberType(req.params.numberid);
  if (!numberTypeUrl) {
    return res.status(400).send('Invalid number ID');
  }

  const newNumbers = await fetchData(numberTypeUrl);
  const uniqueNumbers = [...new Set([...window, ...newNumbers])]; // Ensure unique numbers

  window = uniqueNumbers.slice(-WINDOW_SIZE); // Limit window size to WINDOW_SIZE

  const windowPrevState = window.slice(0, window.length - newNumbers.length); // Previous state of window
  const windowCurrState = window; // Current state of window
  const avg = window.length >= WINDOW_SIZE ? window.slice(-WINDOW_SIZE).reduce((sum, num) => sum + num, 0) / WINDOW_SIZE : 0.00; // Calculate average of last WINDOW_SIZE numbers

  res.json({
    windowPrevState,
    windowCurrState,
    numbers: newNumbers,
    avg,
  });
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
