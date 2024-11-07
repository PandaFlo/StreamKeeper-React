import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MainService from '../services/MainService';
import { Container, Typography, CircularProgress, Alert, Box, Grid, Rating } from '@mui/material';
import TvShow from '../models/TvShow';
import ProviderList from '../components/ProviderList/ProviderList';
import DisplayCardCarousel from '../components/DisplayCardCarousel/DisplayCardCarousel';

// Define color variables
const WHITE = "white";
const OFF_WHITE = "#D3D3D4";

function TvShowDetailPage() {
  const { id } = useParams();
  const [tvShow, setTvShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [similarTvShows, setSimilarTvShows] = useState([]);

  useEffect(() => {
    const fetchTvShowDetails = async () => {
      try {
        const data = await MainService.getTvShowById(id);
        const tvShowInstance = new TvShow(data);
        setTvShow(tvShowInstance);
      } catch (error) {
        setErrorMessage('An error occurred while fetching the TV show details.');
      } finally {
        setLoading(false);
      }
    };

    const fetchRecommendations = async () => {
      try {
        const recommendedData = await MainService.getTvShowRecommendations(id);
        const transformedRecommendations = recommendedData.map(item => new TvShow(item));
        setRecommendations(transformedRecommendations);
      } catch (error) {
        setErrorMessage('Failed to fetch recommendations.');
      }
    };
  
    const fetchSimilarTvShows = async () => {
      try {
        const similarData = await MainService.getSimilarTvShows(id);
        const transformedSimilarShows = similarData.map(item => new TvShow(item));
        setSimilarTvShows(transformedSimilarShows);
      } catch (error) {
        setErrorMessage('Failed to fetch similar TV shows.');
      }
    };

    if (id) {
      fetchTvShowDetails();
      fetchRecommendations();
      fetchSimilarTvShows();
    }
  }, [id]);

  if (loading) {
    return (
      <Container style={{ marginTop: '20px', textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (errorMessage) {
    return (
      <Container style={{ marginTop: '20px' }}>
        <Alert severity="error">{errorMessage}</Alert>
      </Container>
    );
  }

  return (
    <Container style={{ marginTop: '20px' }}>
      <Grid container spacing={4}>
        {/* TV Show Poster */}
        <Grid item xs={12} md={4}>
          <Box>
            <img
              src={tvShow?.posterUrl || 'placeholder.jpg'}
              alt={tvShow?.name || 'TV Show Poster'}
              style={{ width: '100%', borderRadius: '8px' }}
            />
          </Box>

          {/* Watch Providers */}
          <ProviderList mediaId={id} mediaType="tv" />
        </Grid>

        {/* TV Show Details */}
        <Grid item xs={12} md={8}>
          <Typography variant="h4" gutterBottom style={{ color: WHITE }}>
            {tvShow?.name || 'N/A'}{' '}
            <Typography variant="subtitle1" component="span" style={{ color: WHITE }}>
              (
              {tvShow?.firstAirDate ? tvShow.firstAirDate.split('-')[0] : 'Unknown'}
              )
            </Typography>
          </Typography>
          <Typography variant="subtitle1" style={{ color: WHITE }} gutterBottom>
            Original Name: <span style={{ color: OFF_WHITE }}>{tvShow?.originalName || 'N/A'}</span>
          </Typography>
          <Typography variant="body1" paragraph style={{ color: OFF_WHITE }}>
            {tvShow?.overview || 'No overview available.'}
          </Typography>

          {/* TV Show Metadata */}
          <Box my={2}>
            <Typography variant="h6" style={{ color: WHITE }}>TV Show Information</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" style={{ color: WHITE }}>
                  First Air Date:
                </Typography>
                <Typography variant="body1" style={{ color: OFF_WHITE }}>{tvShow?.firstAirDate || 'Unknown'}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" style={{ color: WHITE }}>
                  Popularity:
                </Typography>
                <Typography variant="body1" style={{ color: OFF_WHITE }}>{tvShow?.popularity?.toFixed(1) || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" style={{ color: WHITE }}>
                  Vote Average:
                </Typography>
                <Rating
                  name="read-only"
                  value={tvShow?.voteAverage / 2 || 0}
                  readOnly
                  precision={0.1}
                />
                <Typography variant="body1" style={{ color: OFF_WHITE }}>
                  {tvShow?.voteAverage ? tvShow.voteAverage.toFixed(1) : 'N/A'} / 10
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" style={{ color: WHITE }}>
                  Vote Count:
                </Typography>
                <Typography variant="body1" style={{ color: OFF_WHITE }}>{tvShow?.voteCount || 'N/A'}</Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Backdrop Image */}
          {tvShow?.backdropUrl && (
            <Box my={2}>
              <Typography variant="h6" style={{ color: WHITE }}>Backdrop</Typography>
              <img
                src={tvShow.backdropUrl}
                alt={`${tvShow.name} backdrop`}
                style={{ width: '100%', borderRadius: '8px', marginTop: '10px' }}
              />
            </Box>
          )}
        </Grid>
      </Grid>

      {/* Recommended TV Shows Carousel */}
      {recommendations.length > 0 && (
        <Box my={4}>
          <Typography variant="h5" gutterBottom style={{ color: WHITE }}>
            Recommended TV Shows
          </Typography>
          <DisplayCardCarousel items={recommendations} cardType="A" />
        </Box>
      )}

      {/* Similar TV Shows Carousel */}
      {similarTvShows.length > 0 && (
        <Box my={4}>
          <Typography variant="h5" gutterBottom style={{ color: WHITE }}>
            Similar TV Shows
          </Typography>
          <DisplayCardCarousel items={similarTvShows} cardType="A" />
        </Box>
      )}
    </Container>
  );
}

export default TvShowDetailPage;
