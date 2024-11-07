import React, { useEffect, useState } from 'react';
import MainService from '../../services/MainService';
import {
  Typography,
  CircularProgress,
  Box,
  Chip,
  Avatar,
  Alert,
} from '@mui/material';

function ProviderList({ mediaId, mediaType }) {
  const [watchProviders, setWatchProviders] = useState(null); // State to store watch provider data
  const [loading, setLoading] = useState(true); // State to track loading status
  const [errorMessage, setErrorMessage] = useState(''); // State to store error messages

  // Fetch watch provider data when component mounts or when mediaId/mediaType changes
  useEffect(() => {
    const fetchWatchProviders = async () => {
      try {
        let providerData;
        // Fetch watch provider data based on the media type (movie or TV)
        if (mediaType === 'movie') {
          providerData = await MainService.getMovieWatchProviders(mediaId);
        } else if (mediaType === 'tv') {
          providerData = await MainService.getTvShowWatchProviders(mediaId);
        } else {
          throw new Error('Invalid media type'); // Handle invalid media types
        }

        // Extract watch providers for the US or use the first available region
        const countryProviders =
          providerData && Object.keys(providerData).length > 0
            ? providerData.US || Object.values(providerData)[0]
            : null;

        setWatchProviders(countryProviders);
      } catch (error) {
        // Handle errors
        setErrorMessage('An error occurred while fetching watch providers.');
      } finally {
        // Set loading to false after fetching is complete
        setLoading(false);
      }
    };

    // Only fetch data if mediaId and mediaType are provided
    if (mediaId && mediaType) fetchWatchProviders();
  }, [mediaId, mediaType]);

  // Display a loading indicator while data is being fetched
  if (loading) return <CircularProgress />;
  // Display an error message if an error occurred during data fetching
  if (errorMessage) return <Alert severity="error">{errorMessage}</Alert>;
  // Return null if no watch providers are found
  if (!watchProviders) return null;

  return (
    <Box mt={2}>
      <Typography variant="h6">Where to Watch</Typography>

      {/* Render streaming providers */}
      {watchProviders.flatrate && watchProviders.flatrate.length > 0 && (
        <Box mt={1}>
          <Typography variant="subtitle1">Stream</Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {watchProviders.flatrate.map((provider) => (
              <Chip
                key={provider.provider_id} // Unique key for each provider
                label={provider.provider_name} // Display provider name
                avatar={
                  provider.logo_path ? ( // Display provider logo if available
                    <Avatar src={`https://image.tmdb.org/t/p/w45${provider.logo_path}`} />
                  ) : (
                    <Avatar>{provider.provider_name[0]}</Avatar> // Fallback to first letter of provider name
                  )
                }
                sx={{ backgroundColor: 'white' }}
                component="a" // Render as a link
                href={watchProviders.link} // Link to the provider's page
                target="_blank"
                rel="noopener noreferrer"
                clickable
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Render providers offering rentals */}
      {watchProviders.rent && watchProviders.rent.length > 0 && (
        <Box mt={1}>
          <Typography variant="subtitle1">Rent</Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {watchProviders.rent.map((provider) => (
              <Chip
                key={provider.provider_id}
                label={provider.provider_name}
                avatar={
                  provider.logo_path ? (
                    <Avatar src={`https://image.tmdb.org/t/p/w45${provider.logo_path}`} />
                  ) : (
                    <Avatar>{provider.provider_name[0]}</Avatar>
                  )
                }
                sx={{ backgroundColor: 'white' }}
                component="a"
                href={watchProviders.link}
                target="_blank"
                rel="noopener noreferrer"
                clickable
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Render providers offering purchases */}
      {watchProviders.buy && watchProviders.buy.length > 0 && (
        <Box mt={1}>
          <Typography variant="subtitle1">Buy</Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {watchProviders.buy.map((provider) => (
              <Chip
                key={provider.provider_id}
                label={provider.provider_name}
                avatar={
                  provider.logo_path ? (
                    <Avatar src={`https://image.tmdb.org/t/p/w45${provider.logo_path}`} />
                  ) : (
                    <Avatar>{provider.provider_name[0]}</Avatar>
                  )
                }
                sx={{ backgroundColor: 'white' }}
                component="a"
                href={watchProviders.link}
                target="_blank"
                rel="noopener noreferrer"
                clickable
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Render providers offering ad-supported viewing */}
      {watchProviders.ads && watchProviders.ads.length > 0 && (
        <Box mt={1}>
          <Typography variant="subtitle1">Watch with Ads</Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {watchProviders.ads.map((provider) => (
              <Chip
                key={provider.provider_id}
                label={provider.provider_name}
                avatar={
                  provider.logo_path ? (
                    <Avatar src={`https://image.tmdb.org/t/p/w45${provider.logo_path}`} />
                  ) : (
                    <Avatar>{provider.provider_name[0]}</Avatar>
                  )
                }
                sx={{ backgroundColor: 'white' }}
                component="a"
                href={watchProviders.link}
                target="_blank"
                rel="noopener noreferrer"
                clickable
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default ProviderList;
