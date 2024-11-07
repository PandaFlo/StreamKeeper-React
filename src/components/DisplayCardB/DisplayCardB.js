import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, CardMedia, Typography, Rating, Box, ButtonBase } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MainService from '../../services/MainService';
import PrefetchService from '../../services/PrefetchService'; // Adjust import path as necessary

const prefetchService = new PrefetchService();

function DisplayCardB({
  media,
  minWidth,
  maxWidth,
  minHeight,
  maxHeight,
  fixedWidth,
  fixedHeight,
  onClick,
  disableClick = false,
}) {
  const navigate = useNavigate();
  const [personImage, setPersonImage] = useState('');

  useEffect(() => {
    if (media.mediaType === 'Person') {
      const fetchPersonImage = async () => {
        const imagesData = await MainService.getPersonImages(media.id);
        setPersonImage(
          imagesData.profiles?.length
            ? `https://image.tmdb.org/t/p/w500${imagesData.profiles[0].file_path}`
            : null
        );
      };
      fetchPersonImage();
    }
  }, [media]);

  const handleCardClick = () => {
    if (disableClick) return;

    if (onClick) {
      onClick();
    } else {
      switch (media.mediaType) {
        case 'Movie':
          navigate(`/movie/${media.id}`);
          break;
        case 'TvShow':
          navigate(`/tvshow/${media.id}`);
          break;
        case 'Person':
          navigate(`/person/${media.id}`);
          break;
        default:
          navigate('/');
      }
    }
  };

  const handleCardHover = () => {
    if (media.mediaType) {
      prefetchService.executePrefetch(media.mediaType, media.mediaType, media.id);
    }
  };

  const {
    title = media.name || media.title || 'Unnamed',
    description = media.mediaType === 'Person'
      ? media.knownForDepartment || 'No information available.'
      : media.overview
        ? media.overview.length > 70
          ? `${media.overview.slice(0, 70)}...`
          : media.overview
        : 'No description available.',
    rating = media.voteAverage || 0,
    imageUrl = media.mediaType === 'Person' ? personImage : media.posterUrl || media.backdropUrl || '',
  } = media;

  const knownFor =
    media.mediaType === 'Person' && media.knownFor
      ? media.knownFor.slice(0, 2).map(item => item.name || item.title).join(', ')
      : '';

  const cardStyles = {
    minWidth: fixedWidth || minWidth || 275,
    maxWidth: fixedWidth || maxWidth || '100%',
    minHeight: fixedHeight || minHeight || 300,
    maxHeight: fixedHeight || maxHeight || 'auto',
    cursor: disableClick ? 'default' : 'pointer',
    display: 'flex',
    flexDirection: 'column',
    height: 'auto',
  };

  return (
    <Box
      onClick={handleCardClick}
      onMouseEnter={handleCardHover} // Trigger prefetch on hover
      disabled={disableClick}
      sx={{
        minWidth: cardStyles.minWidth,
        maxWidth: cardStyles.maxWidth,
        cursor: cardStyles.cursor,
        flexGrow: 1,
        position: 'relative',
      }}
    >
      <ButtonBase
        sx={{
          width: '100%',
          height: '100%',
          borderRadius: 1,
          overflow: 'hidden',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
          display: 'block',
          '&:hover': {
            boxShadow: disableClick ? 'none' : '0px 4px 12px rgba(0, 0, 0, 0.4)',
          },
        }}
      >
        <Card
          sx={{
            minHeight: cardStyles.minHeight,
            maxHeight: cardStyles.maxHeight,
            display: 'flex',
            flexDirection: 'column',
            height: 'auto',
            width: '100%',
          }}
        >
          <CardMedia
            component="img"
            image={imageUrl}
            alt={title}
            sx={{ height: 300 }}
          />
          <CardContent sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, pb: 1 }}>
            <Typography variant="h6">{title}</Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {description}
            </Typography>
            {media.mediaType === 'Person' && knownFor && (
              <Typography variant="body2" color="text.secondary">
                Known For: {knownFor}
              </Typography>
            )}
            {/* Spacer to push the rating box to the bottom */}
            <Box sx={{ flexGrow: 1 }} />
            {/* Seamlessly integrated rating box at the bottom */}
            {media.mediaType !== 'Person' && (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                <Rating value={rating / 2} precision={0.1} readOnly />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  {rating} ({media.voteCount || 0} votes)
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </ButtonBase>
    </Box>
  );
}

DisplayCardB.propTypes = {
  media: PropTypes.shape({
    mediaType: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string,
    name: PropTypes.string,
    overview: PropTypes.string,
    voteAverage: PropTypes.number,
    voteCount: PropTypes.number,
    posterUrl: PropTypes.string,
    backdropUrl: PropTypes.string,
    knownFor: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        title: PropTypes.string,
      })
    ),
    knownForDepartment: PropTypes.string,
  }).isRequired,
  minWidth: PropTypes.number,
  maxWidth: PropTypes.number,
  minHeight: PropTypes.number,
  maxHeight: PropTypes.number,
  fixedWidth: PropTypes.number,
  fixedHeight: PropTypes.number,
  onClick: PropTypes.func,
  disableClick: PropTypes.bool,
};

export default DisplayCardB;
