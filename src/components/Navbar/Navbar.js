import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Alert, Box } from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../../images/Logo.png';
import MainService from '../../services/MainService';
import SearchBar from '../SearchBar/SearchBar'; // Import the SearchBar component

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showAlerts, setShowAlerts] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [alertCount, setAlertCount] = useState(0);
  const [errorMessages, setErrorMessages] = useState([]);

  const handleTitleClick = async () => {
    try {
      const serviceNames = [
        'TMDB Service',
        'Movie Service',
        'TV Show Service',
        'Person Service',
        'TMDB API Key'
      ];

      const checks = [
        MainService.checkHealthTMDBService(),
        MainService.checkHealthMovieService(),
        MainService.checkHealthTvShowService(),
        MainService.checkHealthPersonService(),
        MainService.validateApiKey()
      ];

      const responses = await Promise.allSettled(checks);

      const failedResponses = responses
        .map((res, index) => {
          if (res.status === 'rejected' || !res.value) {
            return index === 4
              ? 'Key is invalid'
              : `${serviceNames[index]} is not Available`;
          }
          return null;
        })
        .filter(Boolean);

      if (failedResponses.length === 0) {
        setAlertType('success');
        setAlertCount(1);
        setErrorMessages([]);
      } else {
        setAlertType('error');
        setAlertCount(failedResponses.length);
        setErrorMessages(failedResponses);
      }
      setShowAlerts(true);
    } catch (error) {
      setAlertType('error');
      setAlertCount(1);
      setErrorMessages(['Unexpected error occurred while checking services.']);
      setShowAlerts(true);
    }
  };

  useEffect(() => {
    let timer;
    if (showAlerts) {
      timer = setTimeout(() => {
        setShowAlerts(false);
      }, 4000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [showAlerts]);

  // Determine if the search bar should be displayed
  const shouldShowSearchBar = location.pathname !== '/' && !location.pathname.includes('search');
  console.log('shouldShowSearchBar:', shouldShowSearchBar, 'location.pathname:', location.pathname);

  return (
    <>
      <AppBar position="static" sx={{ background: 'linear-gradient(45deg, black, red)' }}>
        <Toolbar>
          <img
            src={logo}
            alt="App Logo"
            style={{ marginRight: 16, width: 150, height: 'auto', cursor: 'pointer' }}
            onClick={handleTitleClick}
          />
          <div style={{ flexGrow: 1 }}>
            {location.pathname !== '/' && (
              <Typography
                variant="h6"
                sx={{
                  display: 'inline-block',
                  cursor: 'pointer',
                  color: 'white',
                }}
                onClick={() => navigate('/')}
              >
                Stream Keeper
              </Typography>
            )}
          </div>
          {shouldShowSearchBar && <SearchBar />} {/* Render SearchBar conditionally */}
          <Button
            color="inherit"
            component={Link}
            to="/browse"
          >
            Browse
          </Button>
        </Toolbar>
      </AppBar>
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
          {alertType === 'success' ? (
            <Alert variant="filled" severity="success">
              Success! All services are healthy.
            </Alert>
          ) : (
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
