// src/pages/HomePage.js

import React, { useEffect, useState } from 'react';
import { Container, CircularProgress, Box, Typography, Tabs, Tab } from '@mui/material';
import MainService from '../services/MainService';
import MediaDisplayCarousel from '../components/MediaDisplayCarousel/MediaDisplayCarousel';
import DisplayCardCarousel from '../components/DisplayCardCarousel/DisplayCardCarousel';
import Movie from '../models/Movie';
import TVShow from '../models/TvShow';
import SearchBar from '../components/SearchBar/SearchBar';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);

  const [popularTVShows, setPopularTVShows] = useState([]);
  const [topRatedTVShows, setTopRatedTVShows] = useState([]);
  const [onAirTVShows, setOnAirTVShows] = useState([]);

  const [loading, setLoading] = useState(true);
  const [currentMovie, setCurrentMovie] = useState(null);

  const [movieTab, setMovieTab] = useState(0);
  const [tvTab, setTvTab] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const moviesData = await MainService.getPopularMovies();
        const movieInstances = (moviesData || []).map((movieData) => new Movie(movieData));
        setPopularMovies(movieInstances);
        setCurrentMovie(movieInstances[0] || null);

        const tvData = await MainService.getPopularTvShows();
        const tVShowInstances = (tvData || []).map((tvShowData) => new TVShow(tvShowData));
        setPopularTVShows(tVShowInstances);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const fetchMoviesData = async () => {
    try {
      if (movieTab === 1 && topRatedMovies.length === 0) {
        const data = await MainService.getTopRatedMovies();
        const movieInstances = (data || []).map((movieData) => new Movie(movieData));
        setTopRatedMovies(movieInstances);
      } else if (movieTab === 2 && upcomingMovies.length === 0) {
        const data = await MainService.getUpcomingMovies();
        const movieInstances = (data || []).map((movieData) => new Movie(movieData));
        setUpcomingMovies(movieInstances);
      }
    } catch (error) {
      console.error('Error fetching movies data:', error);
    }
  };

  const fetchTvData = async () => {
    try {
      if (tvTab === 1 && topRatedTVShows.length === 0) {
        const data = await MainService.getTopRatedTvShows();
        const tVShowInstances = (data || []).map((tvShowData) => new TVShow(tvShowData)); // Corrected line here
        setTopRatedTVShows(tVShowInstances);
      } else if (tvTab === 2 && onAirTVShows.length === 0) {
        const data = await MainService.getOnTheAirTvShows();
        const tVShowInstances = (data || []).map((tvShowData) => new TVShow(tvShowData)); // Corrected line here
        setOnAirTVShows(tVShowInstances);
      }
    } catch (error) {
      console.error('Error fetching TV shows data:', error);
    }
  };

  useEffect(() => {
    fetchMoviesData();
  }, [movieTab]);

  useEffect(() => {
    fetchTvData();
  }, [tvTab]);

  const handleMovieTabChange = (event, newValue) => {
    setMovieTab(newValue);
  };

  const handleTvTabChange = (event, newValue) => {
    setTvTab(newValue);
  };

  const handleSearch = (query) => {
    console.log('Search triggered with query:', query);
  };

  const handleNavigate = (topic, mediaArray, fetchFunction) => {
    navigate('/info', { state: { topic, mediaArray, fetchFunction } });
  };

  const movieCarouselItems =
    movieTab === 0 ? popularMovies : movieTab === 1 ? topRatedMovies : upcomingMovies;

  const tVShowCarouselItems =
    tvTab === 0 ? popularTVShows : tvTab === 1 ? topRatedTVShows : onAirTVShows;

  return (
    <Container>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h3" align="left" gutterBottom>
          Welcome to Steam Keeper
        </Typography>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Box mt={4}>
          <Box sx={{ position: 'relative', width: '100%', height: '70vh', mb: 6 }}>
            <MediaDisplayCarousel
              mediaItems={popularMovies || []}
              autoPlay={true}
              interval={5000}
              onItemChange={(item) => setCurrentMovie(item)}
            />
            <Box
              sx={{
                position: 'absolute',
                top: '45%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: { xs: '90%', sm: '70%', md: '50%' },
                zIndex: 2,
                borderRadius: 2,
                padding: 2,
              }}
            >
              <SearchBar currentMovie={currentMovie} onSearch={handleSearch} />
            </Box>
          </Box>

          {/* Movies Section */}
          <Typography variant="h4" gutterBottom>
            Movies
          </Typography>
          <Typography
            variant="h5"
            align="left"
            gutterBottom
            onClick={() =>
              handleNavigate(
                movieTab === 0
                  ? 'Popular Movies'
                  : movieTab === 1
                  ? 'Top Rated Movies'
                  : 'Upcoming Movies',
                movieCarouselItems,
                movieTab === 0
                  ? 'getPopularMovies'
                  : movieTab === 1
                  ? 'getTopRatedMovies'
                  : 'getUpcomingMovies'
              )
            }
            sx={{ cursor: 'pointer', color: 'inherit' }}
          >
            {movieTab === 0
              ? 'Popular Movies'
              : movieTab === 1
              ? 'Top Rated Movies'
              : 'Upcoming Movies'}
          </Typography>
          <Box display="flex" justifyContent="flex-start" alignItems="center" mb={2}>
            <Tabs
              value={movieTab}
              onChange={handleMovieTabChange}
              textColor="inherit"
              indicatorColor="primary"
              sx={{
                '& .MuiTab-root': {
                  color: 'red',
                  fontSize: '1.2rem',
                  padding: '12px 24px',
                  transition: 'all 0.3s ease',
                  '&:not(.Mui-selected):hover': {
                    color: '#ffffff',
                  },
                },
                '& .MuiTabs-indicator': { backgroundColor: 'red' },
              }}
            >
              <Tab label="Popular" />
              <Tab label="Top Rated" />
              <Tab label="Upcoming" />
            </Tabs>
          </Box>
          <Box mt={4}>
            <DisplayCardCarousel
              items={movieCarouselItems || []}
              initialCarouselWidth={1200}
              carouselHeight={300}
              cardType="A"
            />
          </Box>

          {/* TV Shows Section */}
          <Typography variant="h4" gutterBottom>
            TV Shows
          </Typography>
          <Typography
            variant="h5"
            align="left"
            gutterBottom
            onClick={() =>
              handleNavigate(
                tvTab === 0
                  ? 'Popular TV Shows'
                  : tvTab === 1
                  ? 'Top Rated TV Shows'
                  : 'On The Air TV Shows',
                tVShowCarouselItems,
                tvTab === 0
                  ? 'getPopularTvShows'
                  : tvTab === 1
                  ? 'getTopRatedTvShows'
                  : 'getOnTheAirTvShows'
              )
            }
            sx={{ cursor: 'pointer', color: 'inherit' }}
          >
            {tvTab === 0
              ? 'Popular TV Shows'
              : tvTab === 1
              ? 'Top Rated TV Shows'
              : 'On The Air TV Shows'}
          </Typography>
          <Box display="flex" justifyContent="flex-start" alignItems="center" mb={2}>
            <Tabs
              value={tvTab}
              onChange={handleTvTabChange}
              textColor="inherit"
              indicatorColor="primary"
              sx={{
                '& .MuiTab-root': {
                  color: 'red',
                  fontSize: '1.2rem',
                  padding: '12px 24px',
                  transition: 'all 0.3s ease',
                  '&:not(.Mui-selected):hover': {
                    color: '#ffffff',
                  },
                },
                '& .MuiTabs-indicator': { backgroundColor: 'red' },
              }}
            >
              <Tab label="Popular" />
              <Tab label="Top Rated" />
              <Tab label="On The Air" />
            </Tabs>
          </Box>
          <Box mt={4}>
            <DisplayCardCarousel
              items={tVShowCarouselItems || []}
              initialCarouselWidth={1200}
              carouselHeight={300}
              cardType="A"
            />
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default HomePage;
