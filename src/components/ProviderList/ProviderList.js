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
  const [watchProviders, setWatchProviders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchWatchProviders = async () => {
      try {
        let providerData;
        if (mediaType === 'movie') {
          providerData = await MainService.getMovieWatchProviders(mediaId);
        } else if (mediaType === 'tv') {
          providerData = await MainService.getTvShowWatchProviders(mediaId);
        } else {
          throw new Error('Invalid media type');
        }

        const countryProviders =
          providerData && Object.keys(providerData).length > 0
            ? providerData.US || Object.values(providerData)[0]
            : null;

        setWatchProviders(countryProviders);
      } catch (error) {
        setErrorMessage('An error occurred while fetching watch providers.');
      } finally {
        setLoading(false);
      }
    };

    if (mediaId && mediaType) fetchWatchProviders();
  }, [mediaId, mediaType]);

  if (loading) return <CircularProgress />;
  if (errorMessage) return <Alert severity="error">{errorMessage}</Alert>;
  if (!watchProviders) return null;

  return (
    <Box mt={2}>
      <Typography variant="h6">Where to Watch</Typography>

      {/* Streaming Providers */}
      {watchProviders.flatrate && watchProviders.flatrate.length > 0 && (
        <Box mt={1}>
          <Typography variant="subtitle1">Stream</Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {watchProviders.flatrate.map((provider) => (
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

      {/* Rent Providers */}
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

      {/* Buy Providers */}
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

      {/* Ads Providers */}
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
