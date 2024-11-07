import axios from 'axios';
class TmdbService {
  constructor() {
    this.api = axios.create({
      baseURL: 'http://localhost:3001/api', // Update to your actual backend URL
    });
  }

  // Health Check
  async checkHealth() {
    try {
      const response = await this.api.get('/health');
      return response.data;
    } catch (error) {
      console.error('Error checking health status:', error);
      throw error;
    }
  }

  // Validate TMDB API Key by requesting a new token
  async validateApiKey() {
    try {
      await this.api.get('/auth/validate');
      return { message: 'API Key is valid' };
    } catch (error) {
      console.error('Invalid API Key:', error);
      throw error;
    }
  }

  // Search for collections by name
  async searchCollections(query) {
    try {
      const response = await this.api.get('/search/collection', {
        params: { query },
      });
      return response.data.results;
    } catch (error) {
      console.error('Error fetching collections:', error);
      throw error;
    }
  }

  // Search for companies by name
  async searchCompanies(query) {
    try {
      const response = await this.api.get('/search/company', {
        params: { query },
      });
      return response.data.results;
    } catch (error) {
      console.error('Error fetching companies:', error);
      throw error;
    }
  }

  // Multi-search across movies, TV shows, and people
  async multiSearch(query) {
    try {
      const response = await this.api.get('/search/multi', {
        params: { query },
      });
      return response.data;

    } catch (error) {
      console.error('Error fetching multi-search results:', error);
      throw error;
    }
  }

  // Search for keywords by name
  async searchKeywords(query) {
    try {
      const response = await this.api.get('/search/keyword', {
        params: { query },
      });
      return response.data.results;
    } catch (error) {
      console.error('Error fetching keywords:', error);
      throw error;
    }
  }






  
}

// Export a single instance of the TmdbService class
const tmdbServiceInstance = new TmdbService();
export default tmdbServiceInstance;
