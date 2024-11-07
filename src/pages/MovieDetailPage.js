import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainService from "../services/MainService";
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Box,
  Grid,
  Chip,
  Rating,
} from "@mui/material";
import Movie from "../models/Movie";
import ProviderList from "../components/ProviderList/ProviderList";
import DisplayCardCarousel from "../components/DisplayCardCarousel/DisplayCardCarousel";

function MovieDetailPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);

  const titleColor = "white";
  const textColor = "#D3D3D3";

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const data = await MainService.getMovieById(id);
        const movieInstance = new Movie(data);
        setMovie(movieInstance);
      } catch (error) {
        console.error("Error fetching movie details:", error);
        setErrorMessage("An error occurred while fetching the movie details.");
      } finally {
        setLoading(false);
      }
    };

    const fetchRecommendationsAndSimilarMovies = async () => {
      try {
        const recommendationsData = await MainService.getMovieRecommendations(id);
        const formattedRecommendations = (recommendationsData || []).map(
          (movieData) => new Movie(movieData)
        );
        setRecommendations(formattedRecommendations);

        const similarMoviesData = await MainService.getSimilarMovies(id);
        const formattedSimilarMovies = (similarMoviesData || []).map(
          (movieData) => new Movie(movieData)
        );
        setSimilarMovies(formattedSimilarMovies);
      } catch (error) {
        console.error("Error fetching recommendations and similar movies:", error);
      }
    };

    if (id) {
      fetchMovieDetails();
      fetchRecommendationsAndSimilarMovies();
    }
  }, [id]);

  if (loading) {
    return (
      <Container style={{ marginTop: "20px", textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (errorMessage) {
    return (
      <Container style={{ marginTop: "20px" }}>
        <Alert severity="error">{errorMessage}</Alert>
      </Container>
    );
  }

  return (
    <Container style={{ marginTop: "20px" }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Box>
            <img
              src={movie?.posterUrl || "placeholder.jpg"}
              alt={movie?.title || "Movie Poster"}
              style={{ width: "100%", borderRadius: "8px" }}
            />
          </Box>
          <ProviderList mediaId={id} mediaType="movie" />
        </Grid>

        <Grid item xs={12} md={8}>
          <Typography variant="h4" gutterBottom style={{ color: titleColor }}>
            {movie?.title || "N/A"}{" "}
            <Typography variant="subtitle1" component="span" style={{ color: titleColor }}>
              ({movie?.releaseDate ? movie.releaseDate.split("-")[0] : "Unknown"})
            </Typography>
          </Typography>
          <Typography variant="subtitle1" gutterBottom style={{ color: titleColor }}>
            Original Title: {movie?.originalTitle || "N/A"}
          </Typography>
          <Typography variant="body1" paragraph style={{ color: textColor }}>
            {movie?.overview || "No overview available."}
          </Typography>

          <Box my={2}>
            <Typography variant="h6" style={{ color: titleColor }}>
              Movie Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" style={{ color: titleColor }}>
                  Release Date:
                </Typography>
                <Typography variant="body1" style={{ color: textColor }}>
                  {movie?.releaseDate || "Unknown"}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" style={{ color: titleColor }}>
                  Popularity:
                </Typography>
                <Typography variant="body1" style={{ color: textColor }}>
                  {movie?.popularity?.toFixed(1) || "N/A"}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" style={{ color: titleColor }}>
                  Vote Average:
                </Typography>
                <Rating
                  name="read-only"
                  value={movie?.voteAverage / 2 || 0}
                  readOnly
                  precision={0.1}
                />
                <Typography variant="body1" style={{ color: textColor }}>
                  {movie?.voteAverage ? movie.voteAverage.toFixed(1) : "N/A"} / 10
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" style={{ color: titleColor }}>
                  Vote Count:
                </Typography>
                <Typography variant="body1" style={{ color: textColor }}>
                  {movie?.voteCount || "N/A"}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {movie?.genreIds && movie.genreIds.length > 0 && (
            <Box my={2}>
              <Typography variant="h6" style={{ color: titleColor }}>Genres</Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {movie.genreIds.map((genreId) => (
                  <Chip key={genreId} label={`Genre ${genreId}`} variant="outlined" style={{ color: titleColor }} />
                ))}
              </Box>
            </Box>
          )}

          {movie?.backdropUrl && (
            <Box my={2}>
              <Typography variant="h6" style={{ color: titleColor }}>Backdrop</Typography>
              <img
                src={movie.backdropUrl}
                alt={`${movie.title} backdrop`}
                style={{
                  width: "100%",
                  borderRadius: "8px",
                  marginTop: "10px",
                }}
              />
            </Box>
          )}
        </Grid>
      </Grid>

      {recommendations.length > 0 && (
        <Box my={4}>
          <Typography variant="h5" gutterBottom style={{ color: titleColor }}>
            Recommended Movies
          </Typography>
          <DisplayCardCarousel items={recommendations} cardType="A" />
        </Box>
      )}

      {similarMovies.length > 0 && (
        <Box my={4}>
          <Typography variant="h5" gutterBottom style={{ color: titleColor }}>
            Similar Movies
          </Typography>
          <DisplayCardCarousel items={similarMovies} cardType="A" />
        </Box>
      )}
    </Container>
  );
}

export default MovieDetailPage;
