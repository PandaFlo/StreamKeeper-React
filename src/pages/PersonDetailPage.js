// src/pages/PersonDetailPage.js

import MainService from '../services/MainService';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Box,
  CardMedia,
  Paper,
} from '@mui/material';
import DisplayCardCarousel from '../components/DisplayCardCarousel/DisplayCardCarousel';
import Movie from '../models/Movie';
import TVShow from '../models/TvShow';

const PersonDetailPage = () => {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [personImage, setPersonImage] = useState(null);
  const [movieCredits, setMovieCredits] = useState([]);
  const [tvCredits, setTvCredits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchPersonDetails = async () => {
      setLoading(true);
      try {
        const personData = await MainService.getPersonById(id);
        const imagesData = await MainService.getPersonImages(id);
        const movieCreditsData = await MainService.getPersonMovieCredits(id);
        const tvCreditsData = await MainService.getPersonTvCredits(id);

        setPerson(personData);
        setPersonImage(
          imagesData.profiles?.length
            ? `https://image.tmdb.org/t/p/w500${imagesData.profiles[0].file_path}`
            : null
        );

        const processedMovieCredits = movieCreditsData
          ? movieCreditsData.map((item) => {
              const movieInstance = new Movie(item);
              return { ...movieInstance, mediaType: 'Movie' };
            })
          : [];
        setMovieCredits(processedMovieCredits);

        const processedTvCredits = tvCreditsData
          ? tvCreditsData.map((item) => {
              const tvShowInstance = new TVShow(item);
              return { ...tvShowInstance, mediaType: 'TvShow' };
            })
          : [];
        setTvCredits(processedTvCredits);
      } catch (error) {
        setErrorMessage('An error occurred while fetching the person details.');
      } finally {
        setLoading(false);
      }
    };

    fetchPersonDetails();
  }, [id]);

  if (loading) {
    return (
      <Container sx={{ mt: 2, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (errorMessage) {
    return (
      <Container sx={{ mt: 2 }}>
        <Alert severity="error">{errorMessage}</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 2 }}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Paper elevation={5} sx={{ p: 2, mb: 2, width: '80%', textAlign: 'center' }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            flexDirection={{ xs: 'column', md: 'row' }}
          >
            {personImage && (
              <CardMedia
                component="img"
                height="300"
                image={personImage}
                alt={person?.name || 'Person Image'}
                sx={{ borderRadius: '10px', width: 200, mr: 2 }}
              />
            )}
            <Box flex={1} ml={{ xs: 0, md: 3 }}>
              <Typography variant="h4" gutterBottom>
                {person?.name || 'N/A'}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Department: {person?.knownForDepartment || 'N/A'}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Popularity: {person?.popularity || 'N/A'}
              </Typography>
            </Box>
          </Box>
        </Paper>

        {movieCredits.length > 0 && (
          <>
            <Typography variant="h3" sx={{ mt: 2, mb: 1 }}>
              Movies
            </Typography>
            <DisplayCardCarousel items={movieCredits} cardType="A" />
          </>
        )}

        {tvCredits.length > 0 && (
          <>
            <Typography variant="h3" sx={{ mt: 4, mb: 1 }}>
              TV Shows
            </Typography>
            <DisplayCardCarousel items={tvCredits} cardType="B" carouselHeight={500} />
          </>
        )}
      </Box>
    </Container>
  );
};

export default PersonDetailPage;
