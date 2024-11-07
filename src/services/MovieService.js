import axios from 'axios';

class MovieService {
  constructor() {
    this.api = axios.create({
      baseURL: 'http://localhost:3002/api/movies', // Update to your actual backend URL
    });
  }

  // Health Check
  async checkHealth() {
    try {
      const response = await this.api.get(`/health`);
      return response.data;
    } catch (error) {
      console.error('Error checking health status:', error);
      throw error;
    }
  }

  // Fetch movie details by ID
  async getMovieById(movieId) {
    try {
      const response = await this.api.get(`/${movieId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching movie with ID ${movieId}:`, error);
      throw error;
    }
  }

  // Fetch movie images by ID
  async getMovieImages(movieId) {
    try {
      const response = await this.api.get(`/${movieId}/images`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching images for movie ID ${movieId}:`, error);
      throw error;
    }
  }

  // Fetch movie credits by ID
  async getMovieCredits(movieId) {
    try {
      const response = await this.api.get(`/${movieId}/credits`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching credits for movie ID ${movieId}:`, error);
      throw error;
    }
  }

  // Fetch movie external IDs by ID
  async getMovieExternalIds(movieId) {
    try {
      const response = await this.api.get(`/${movieId}/external_ids`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching external IDs for movie ID ${movieId}:`, error);
      throw error;
    }
  }

  // Fetch movie recommendations by ID
  async getMovieRecommendations(movieId) {
    try {
      const response = await this.api.get(`/${movieId}/recommendations`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching recommendations for movie ID ${movieId}:`, error);
      throw error;
    }
  }

  // Fetch similar movies by ID
  async getSimilarMovies(movieId) {
    try {
      const response = await this.api.get(`/${movieId}/similar`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching similar movies for movie ID ${movieId}:`, error);
      throw error;
    }
  }

  // Fetch movie videos by ID
  async getMovieVideos(movieId) {
    try {
      const response = await this.api.get(`/${movieId}/videos`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching videos for movie ID ${movieId}:`, error);
      throw error;
    }
  }

  // Fetch watch providers for a movie by ID
  async getMovieWatchProviders(movieId) {
    try {
      const response = await this.api.get(`/${movieId}/watch/providers`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching watch providers for movie ID ${movieId}:`, error);
      throw error;
    }
  }

  // Fetch movie reviews by ID
  async getMovieReviews(movieId) {
    try {
      const response = await this.api.get(`/${movieId}/reviews`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching reviews for movie ID ${movieId}:`, error);
      throw error;
    }
  }

  // Fetch popular movies
  async getPopularMovies() {
    try {
      const response = await this.api.get(`/popular`);
      return response.data;
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      throw error;
    }
  }

  // Fetch now playing movies
  async getNowPlayingMovies() {
    try {
      const response = await this.api.get(`/now_playing`);
      return response.data;
    } catch (error) {
      console.error('Error fetching now playing movies:', error);
      throw error;
    }
  }

  // Fetch top-rated movies
  async getTopRatedMovies() {
    try {
      const response = await this.api.get(`/top_rated`);
      return response.data;
    } catch (error) {
      console.error('Error fetching top-rated movies:', error);
      throw error;
    }
  }

  // Fetch upcoming movies
  async getUpcomingMovies() {
    try {
      const response = await this.api.get(`/upcoming`);
      return response.data;
    } catch (error) {
      console.error('Error fetching upcoming movies:', error);
      throw error;
    }
  }

  // Search for movies
  async searchMovies(query) {
    try {
      const response = await this.api.get(`/search`, {
        params: { query },
      });
      return response.data;
    } catch (error) {
      console.error('Error searching for movies:', error);
      throw error;
    }
  }
}

// Export a single instance of the MovieService class
const movieServiceInstance = new MovieService();
export default movieServiceInstance;
