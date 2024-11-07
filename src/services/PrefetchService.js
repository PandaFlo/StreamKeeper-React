import MainService from './MainService'; // Adjust import based on your project structure

class PrefetchService {
  constructor() {
    this.prefetchMap = new Map(); // Map to track completed prefetches
    this.pendingFetches = new Map(); // Map to track pending fetches as promises
  }

  generateMapKey(pagename, mediaType, id) {
   return `${pagename}_${mediaType || 'none'}_${id || 'none'}`;
  }

  async executePrefetch(pagename, mediaType = null, id = null) {
    const mapKey = this.generateMapKey(pagename, mediaType, id);

    // If the prefetch is already completed, skip
    if (this.prefetchMap.has(mapKey)) {
      
      return;
    }

    // If a fetch is already in progress for this key, wait for it to complete
    if (this.pendingFetches.has(mapKey)) {
      
      await this.pendingFetches.get(mapKey); // Wait for the pending fetch to resolve
      return;
    }

    // Create a promise to track the prefetch operation
    const fetchPromise = this.performPrefetch(pagename,  id)
      .then(() => {
        this.prefetchMap.set(mapKey, true); // Mark as completed
      })
      .catch(error => {
        console.error(`Error during prefetch for ${pagename}:`, error);
        // Optional: consider whether you want to mark this as failed or retry
      })
      .finally(() => {
        this.pendingFetches.delete(mapKey); // Clean up pending fetch
      });

    // Store the promise in the pendingFetches map
    this.pendingFetches.set(mapKey, fetchPromise);

    // Await the promise before returning
    await fetchPromise;
  }

  async performPrefetch(pagename, id,) {
    
    switch (pagename) {
      case 'Browse':
        await this.fetchBrowseData();
        break;

      case 'Home':
        await this.fetchHomeData();
        break;

      case 'Person':
        if (!id) throw new Error('ID is required for Person page prefetch.');
        await this.fetchPersonData(id);
        break;

      case 'TvShow':
        if (!id) throw new Error('ID is required for TVShow page prefetch.');
        await this.fetchTvShowData(id);
        break;

      case 'Movie':
        if (!id) throw new Error('ID is required for Movie page prefetch.');
        await this.fetchMovieData(id);
        break;

      default:
        throw new Error(`Invalid pagename: ${pagename}`);
    }

    
  }

  async fetchBrowseData() {
    await MainService.getTopRatedMovies();
    await MainService.getPopularMovies();
    await MainService.getNowPlayingMovies();
    await MainService.getUpcomingMovies();
    await MainService.getPopularTvShows();
    await MainService.getAiringTodayTvShows();
    await MainService.getOnTheAirTvShows();
    await MainService.getTopRatedTvShows();
  }

  async fetchHomeData() {
    await MainService.getPopularMovies();
    await MainService.getPopularTvShows();
    await MainService.getTopRatedMovies();
    await MainService.getUpcomingMovies();
    await MainService.getTopRatedTvShows();
    await MainService.getOnTheAirTvShows();
  }

  async fetchPersonData(id) {
    await MainService.getPersonById(id);
    await MainService.getPersonImages(id);
    await MainService.getPersonMovieCredits(id);
    await MainService.getPersonTvCredits(id);
  }

  async fetchTvShowData(id) {
    await MainService.getTvShowById(id);
    await MainService.getTvShowRecommendations(id);
    await MainService.getSimilarTvShows(id);
  }

  async fetchMovieData(id) {
    await MainService.getMovieById(id);
    await MainService.getMovieRecommendations(id);
    await MainService.getSimilarMovies(id);
  }






}

export default PrefetchService;
