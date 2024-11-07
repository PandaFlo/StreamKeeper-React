import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import MainService from '../services/MainService';
import Movie from '../models/Movie';
import TVShow from '../models/TvShow';
import Person from '../models/Person';
import Media from '../models/Media';
import DisplayCardA from '../components/DisplayCardA/DisplayCardA';
import SearchBar from '../components/SearchBar/SearchBar';

function SearchResultsPage() {
  const { query } = useParams();
  const [mediaArray, setMediaArray] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const data = await MainService.multiSearch(query);
        

        const resultsArray = data?.searchResults;
        if (!Array.isArray(resultsArray)) {
          console.error('Expected an array but got:', data);
          setMediaArray([]);
          return;
        }

        const processedMediaArray = await Promise.all(
          resultsArray.map(async (result) => {
            let mediaInstance;
            const mediaType = result.mediaType?.toLowerCase();

            switch (mediaType) {
              case 'movie':
                mediaInstance = new Movie(result);
                break;
              case 'tvshow':
                mediaInstance = new TVShow(result);
                break;
              case 'person':
                mediaInstance = new Person(result);
                try {
                  const imagesData = await MainService.getPersonImages(result.id);
                  if (imagesData.profiles && imagesData.profiles.length > 0) {
                    mediaInstance.imageUrl = `https://image.tmdb.org/t/p/w500${imagesData.profiles[0].file_path}`;
                  } else {
                    mediaInstance.imageUrl = 'placeholder.jpg';
                    
                  }
                } catch (error) {
                  console.error(`Error fetching images for person ID ${result.id}:`, error);
                  mediaInstance.imageUrl = 'placeholder.jpg';
                }
                break;
              default:
                console.warn('Unhandled mediaType:', result.mediaType);
                mediaInstance = new Media(result);
            }
            return mediaInstance;
          })
        );

        setMediaArray(processedMediaArray);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setMediaArray([]);
      } finally {
        setLoading(false);
      }
    };

    if (query) fetchSearchResults();
  }, [query]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, p: 3 }}>
      <Box sx={{ width: '100%', maxWidth: 600 }}>
        <SearchBar defaultValue={query} />
      </Box>
      <Typography variant="h4" align="center" sx={{ mt: 2 }}>
        Search Results for "{query}"
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {mediaArray.length > 0 ? (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
              {mediaArray.map((media) => (
                <Box key={media.id}>
                  <DisplayCardA
                    media={media}
                    minWidth={300}
                    maxWidth={300}
                    minHeight={500}
                    maxHeight={500}
                  />
                </Box>
              ))}
            </Box>
          ) : (
            <Typography variant="body1" color="textSecondary">
              No results found for "{query}".
            </Typography>
          )}

          <Box sx={{ width: '100%', mt: 4, p: 2, backgroundColor: '#f4f4f4', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              Raw JSON Data:
            </Typography>
            <Typography
              variant="body2"
              component="pre"
              sx={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', overflowX: 'auto' }}
            >
              {JSON.stringify(mediaArray, null, 2)}
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );
}

export default SearchResultsPage;
