import axios from 'axios';

class PersonService {
  constructor() {
    this.api = axios.create({
      baseURL: 'http://localhost:3004/api/person', // Update this to your actual backend URL
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

  // Fetch popular persons
  async getPopularPersons() {
    try {
      const response = await this.api.get('/popular');
      return response.data;
    } catch (error) {
      console.error('Error fetching popular persons:', error);
      throw error;
    }
  }


  // Fetch person's details by ID
  async getPersonById(id) {
    try {
      const response = await this.api.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching person with ID ${id}:`, error);
      throw error;
    }
  }

  // Fetch person's movie credits by ID
  async getPersonMovieCredits(id) {
    try {
      const response = await this.api.get(`/${id}/movie_credits`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching movie credits for person ID ${id}:`, error);
      throw error;
    }
  }

  // Fetch person's TV credits by ID
  async getPersonTvCredits(id) {
    try {
      const response = await this.api.get(`/${id}/tv_credits`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching TV credits for person ID ${id}:`, error);
      throw error;
    }
  }

  // Fetch person's images by ID
  async getPersonImages(id) {
    try {
      const response = await this.api.get(`/${id}/images`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching images for person ID ${id}:`, error);
      throw error;
    }
  }

  // Fetch external IDs for a person by ID
  async getPersonExternalIds(id) {
    try {
      const response = await this.api.get(`/${id}/external_ids`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching external IDs for person ID ${id}:`, error);
      throw error;
    }
  }
}

// Export a single instance of the PersonService class
const personServiceInstance = new PersonService();
export default personServiceInstance;
