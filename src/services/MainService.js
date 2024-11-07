import movieServiceInstance from './MovieService';
import tvShowServiceInstance from './TvShowService';
import personServiceInstance from './PersonService';
import tmdbServiceInstance from './TmdbService';
import Cache from '../cache/cache';

class MainService {
  constructor() {
    this.tmdbService = tmdbServiceInstance;
    this.movieService = movieServiceInstance;
    this.tvShowService = tvShowServiceInstance;
    this.personService = personServiceInstance;

    // Create separate caches for each service
    this.tmdbCache = new Cache();
    this.movieCache = new Cache();
    this.tvShowCache = new Cache();
    this.personCache = new Cache();
  }

  async fetchWithCache(serviceFunction, cache, command, query) {
    if (cache.has(command, query)) {
      return cache.get(command, query);
    }
    const response = await serviceFunction();
    cache.set(command, query, response);
    return response;
  }

  // Health Checks
  async checkHealthTMDBService() {
    return this.tmdbService.checkHealth();
  }

  async checkHealthMovieService() {
    return this.movieService.checkHealth();
  }

  async checkHealthTvShowService() {
    return this.tvShowService.checkHealth();
  }

  async checkHealthPersonService() {
    return this.personService.checkHealth();
  }

  // TMDB API Key Validation
  async validateApiKey() {
    return this.tmdbService.validateApiKey();
  }

  // TMDB-specific Searches
  async searchCollections(query) {
    return this.fetchWithCache(() => this.tmdbService.searchCollections(query), this.tmdbCache, 'searchCollections', query);
  }

  async searchCompanies(query) {
    return this.fetchWithCache(() => this.tmdbService.searchCompanies(query), this.tmdbCache, 'searchCompanies', query);
  }

  async multiSearch(query) {
    return this.fetchWithCache(() => this.tmdbService.multiSearch(query), this.tmdbCache, 'multiSearch', query);
  }

  async searchKeywords(query) {
    return this.fetchWithCache(() => this.tmdbService.searchKeywords(query), this.tmdbCache, 'searchKeywords', query);
  }

  // Movies
  async getPopularMovies() {
    return this.fetchWithCache(() => this.movieService.getPopularMovies(), this.movieCache, 'getPopularMovies', null);
  }

  async getLatestMovie() {
    return this.fetchWithCache(() => this.movieService.getLatestMovie(), this.movieCache, 'getLatestMovie', null);
  }

  async getNowPlayingMovies() {
    return this.fetchWithCache(() => this.movieService.getNowPlayingMovies(), this.movieCache, 'getNowPlayingMovies', null);
  }

  async getTopRatedMovies() {
    return this.fetchWithCache(() => this.movieService.getTopRatedMovies(), this.movieCache, 'getTopRatedMovies', null);
  }

  async getUpcomingMovies() {
    return this.fetchWithCache(() => this.movieService.getUpcomingMovies(), this.movieCache, 'getUpcomingMovies', null);
  }

  async searchMovies(query) {
    return this.fetchWithCache(() => this.movieService.searchMovies(query), this.movieCache, 'searchMovies', query);
  }

  async getMovieById(id) {
    return this.fetchWithCache(() => this.movieService.getMovieById(id), this.movieCache, 'getMovieById', { id });
  }

  async getMovieRecommendations(id) {
    return this.fetchWithCache(() => this.movieService.getMovieRecommendations(id), this.movieCache, 'getMovieRecommendations', { id });
  }

  async getSimilarMovies(id) {
    return this.fetchWithCache(() => this.movieService.getSimilarMovies(id), this.movieCache, 'getSimilarMovies', { id });
  }

  async getMovieImages(id) {
    return this.fetchWithCache(() => this.movieService.getMovieImages(id), this.movieCache, 'getMovieImages', { id });
  }

  async getMovieVideos(id) {
    return this.fetchWithCache(() => this.movieService.getMovieVideos(id), this.movieCache, 'getMovieVideos', { id });
  }

  async getMovieWatchProviders(id) {
    return this.fetchWithCache(() => this.movieService.getMovieWatchProviders(id), this.movieCache, 'getMovieWatchProviders', { id });
  }

  async getMovieCredits(id) {
    return this.fetchWithCache(() => this.movieService.getMovieCredits(id), this.movieCache, 'getMovieCredits', { id });
  }

  async getMovieReviews(id) {
    return this.fetchWithCache(() => this.movieService.getMovieReviews(id), this.movieCache, 'getMovieReviews', { id });
  }

  // TV Shows
  async getPopularTvShows() {
    return this.fetchWithCache(() => this.tvShowService.getPopularTvShows(), this.tvShowCache, 'getPopularTvShows', null);
  }

  async getAiringTodayTvShows() {
    return this.fetchWithCache(() => this.tvShowService.getAiringTodayTvShows(), this.tvShowCache, 'getAiringTodayTvShows', null);
  }

  async getOnTheAirTvShows() {
    return this.fetchWithCache(() => this.tvShowService.getOnTheAirTvShows(), this.tvShowCache, 'getOnTheAirTvShows', null);
  }

  async getTopRatedTvShows() {
    return this.fetchWithCache(() => this.tvShowService.getTopRatedTvShows(), this.tvShowCache, 'getTopRatedTvShows', null);
  }

  async getLatestTvShow() {
    return this.fetchWithCache(() => this.tvShowService.getLatestTvShow(), this.tvShowCache, 'getLatestTvShow', null);
  }

  async searchTvShows(query) {
    return this.fetchWithCache(() => this.tvShowService.searchTvShows(query), this.tvShowCache, 'searchTvShows', query);
  }

  async getTvShowById(id) {
    return this.fetchWithCache(() => this.tvShowService.getTvShowById(id), this.tvShowCache, 'getTvShowById', { id });
  }

  async getTvShowRecommendations(id) {
    return this.fetchWithCache(() => this.tvShowService.getTvShowRecommendations(id), this.tvShowCache, 'getTvShowRecommendations', { id });
  }

  async getSimilarTvShows(id) {
    return this.fetchWithCache(() => this.tvShowService.getSimilarTvShows(id), this.tvShowCache, 'getSimilarTvShows', { id });
  }

  async getTvShowImages(id) {
    return this.fetchWithCache(() => this.tvShowService.getTvShowImages(id), this.tvShowCache, 'getTvShowImages', { id });
  }

  async getTvShowVideos(id) {
    return this.fetchWithCache(() => this.tvShowService.getTvShowVideos(id), this.tvShowCache, 'getTvShowVideos', { id });
  }

  async getTvShowWatchProviders(id) {
    return this.fetchWithCache(() => this.tvShowService.getTvShowWatchProviders(id), this.tvShowCache, 'getTvShowWatchProviders', { id });
  }

  async getTvShowCredits(id) {
    return this.fetchWithCache(() => this.tvShowService.getTvShowCredits(id), this.tvShowCache, 'getTvShowCredits', { id });
  }

  async getTvShowReviews(id) {
    return this.fetchWithCache(() => this.tvShowService.getTvShowReviews(id), this.tvShowCache, 'getTvShowReviews', { id });
  }

  // Persons
  async getPopularPersons() {
    return this.fetchWithCache(() => this.personService.getPopularPersons(), this.personCache, 'getPopularPersons', null);
  }

  async searchPerson(query) {
    return this.fetchWithCache(() => this.personService.searchPerson(query), this.personCache, 'searchPerson', query);
  }

  async getPersonById(id) {
    return this.fetchWithCache(() => this.personService.getPersonById(id), this.personCache, 'getPersonById', { id });
  }

  async getPersonMovieCredits(id) {
    return this.fetchWithCache(() => this.personService.getPersonMovieCredits(id), this.personCache, 'getPersonMovieCredits', { id });
  }

  async getPersonTvCredits(id) {
    return this.fetchWithCache(() => this.personService.getPersonTvCredits(id), this.personCache, 'getPersonTvCredits', { id });
  }

  async getPersonImages(id) {
    return this.fetchWithCache(() => this.personService.getPersonImages(id), this.personCache, 'getPersonImages', { id });
  }

  async getPersonExternalIds(id) {
    return this.fetchWithCache(() => this.personService.getPersonExternalIds(id), this.personCache, 'getPersonExternalIds', { id });
  }
}

// Export a single instance of MainService
const mainServiceInstance = new MainService();
export default mainServiceInstance;
