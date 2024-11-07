// src/pages/InfoDisplayPage.js
import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Typography, Container, Grid } from '@mui/material';
import DisplayCardB from '../components/DisplayCardB/DisplayCardB';

function InfoDisplayPage() {
  const { topic } = useParams(); // Get the topic from the URL parameter
  const location = useLocation(); // Get the location object to access state
  const { mediaArray = [] } = location.state || {}; // Destructure state and provide a default value

  return (
    <Container sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        {topic} {/* Display the topic as a heading */}
      </Typography>
      {mediaArray.length > 0 ? (
        <Grid container spacing={3}>
          {mediaArray.map((media, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <DisplayCardB
                media={media}
                minWidth={275}
                maxWidth={400}
                minHeight={500}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1" color="text.secondary">
          No items available.
        </Typography>
      )}
    </Container>
  );
}

InfoDisplayPage.propTypes = {
  mediaArray: PropTypes.array,
};

export default InfoDisplayPage;
