import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Alert, Box } from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../../images/Logo.png';
import MainService from '../../services/MainService';
import PrefetchService from '../../services/PrefetchService'; // Import PrefetchService
import SearchBar from '../SearchBar/SearchBar'; // Import the SearchBar component

function Navbar() {
  const navigate = useNavigate(); // Navigation hook for programmatic routing
  const location = useLocation(); // Access the current location
  const [showAlerts, setShowAlerts] = useState(false); // State to control the display of alerts
  const [alertType, setAlertType] = useState(''); // State to manage the type of alert (success or error)
  const [alertCount, setAlertCount] = useState(0); // State to track the number of alerts
  const [errorMessages, setErrorMessages] = useState([]); // State to store error messages

  // Function to handle the click event on the logo or title, checking the health of various services
  const handleTitleClick = async () => {
    try {
      const serviceNames = [
        'TMDB Service',
        'Movie Service',
        'TV Show Service',
        'Person Service',
        'TMDB API Key'
      ];

      // Array of service health check promises
      const checks = [
        MainService.checkHealthTMDBService(),
        MainService.checkHealthMovieService(),
        MainService.checkHealthTvShowService(),
        MainService.checkHealthPersonService(),
        MainService.validateApiKey()
      ];

      // Execute all health checks concurrently and process the results
      const responses = await Promise.allSettled(checks);

      // Identify failed responses and create error messages
      const failedResponses = responses
        .map((res, index) => {
          if (res.status === 'rejected' || !res.value) {
            return index === 4
              ? 'Key is invalid'
              : `${serviceNames[index]} is not Available`;
          }
          return null;
        })
        .filter(Boolean); // Remove null values

      if (failedResponses.length === 0) {
        // If all checks pass
        setAlertType('success');
        setAlertCount(1);
        setErrorMessages([]);
      } else {
        // If there are failed checks
        setAlertType('error');
        setAlertCount(failedResponses.length);
        setErrorMessages(failedResponses);
      }
      setShowAlerts(true); // Display alerts
    } catch (error) {
      // Handle unexpected errors
      setAlertType('error');
      setAlertCount(1);
      setErrorMessages(['Unexpected error occurred while checking services.']);
      setShowAlerts(true);
    }
  };

  // Automatically hide alerts after a specified timeout
  useEffect(() => {
    let timer;
    if (showAlerts) {
      timer = setTimeout(() => {
        setShowAlerts(false);
      }, 4000);
    }
    return () => {
      clearTimeout(timer); // Clear timeout on component unmount
    };
  }, [showAlerts]);

  // Determine if the search bar should be displayed based on the current path
  const shouldShowSearchBar = location.pathname !== '/' && !location.pathname.includes('search');
  
  return (
    <>
      {/* AppBar containing the navbar */}
      <AppBar position="static" sx={{ background: 'linear-gradient(45deg, black, red)' }}>
        <Toolbar>
          {/* Logo with click handler for health checks */}
          <img
            src={logo}
            alt="App Logo"
            style={{ marginRight: 16, width: 150, height: 'auto', cursor: 'pointer' }}
            onClick={handleTitleClick}
          />
          <div style={{ flexGrow: 1 }}>
            {/* Conditional title rendering based on the current path */}
            {location.pathname !== '/' && (
              <Typography
                variant="h6"
                sx={{
                  display: 'inline-block',
                  cursor: 'pointer',
                  color: 'white',
                }}
                onClick={() => navigate('/')} // Navigate to the homepage on click
              >
                Stream Keeper
              </Typography>
            )}
          </div>
          {/* Render the SearchBar component conditionally */}
          {shouldShowSearchBar && <SearchBar />}
          <Button
            color="inherit"
            component={Link}
            to="/browse" // Navigate to browse page
            onMouseEnter={() => PrefetchService.executePrefetch('Browse')} // Prefetch on hover
          >
            Browse
          </Button>
        </Toolbar>
      </AppBar>
      {/* Display alerts if any */}
      {showAlerts && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 16,
            left: 10,
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          {/* Success alert */}
          {alertType === 'success' ? (
            <Alert variant="filled" severity="success">
              Success! All services are healthy.
            </Alert>
          ) : (
            // Display each error message as an individual alert
            errorMessages.map((message, index) => (
              <Alert key={index} variant="filled" severity="error">
                {message}
              </Alert>
            ))
          )}
        </Box>
      )}
    </>
  );
}

export default Navbar;
