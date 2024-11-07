import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Typography, Box, styled } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Styled component for smooth crossfade transitions between carousel items
const FadeBox = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '70vh',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  transition: 'opacity 1s ease-in-out', // Smooth transition effect
});

function MediaDisplayCarousel({ mediaItems, autoPlay = true, interval = 5000, onItemChange }) {
  const [currentIndex, setCurrentIndex] = useState(0); // Track the index of the currently visible media item
  const [prevIndex, setPrevIndex] = useState(null); // Track the index of the previous media item (for crossfade)
  const navigate = useNavigate(); // Navigation hook for routing
  const timeoutRef = useRef(null); // Ref to manage the autoplay timeout

  // Utility function to format image URLs if needed
  const formatImageUrl = (url) => {
    const baseUrl = 'https://image.tmdb.org/t/p/original';
    return url && url.startsWith('http') ? url : `${baseUrl}${url}`;
  };

  // Automatically advance the carousel at specified intervals
  useEffect(() => {
    if (autoPlay && mediaItems.length > 0) {
      timeoutRef.current = setInterval(() => {
        setPrevIndex(currentIndex); // Track the previous index
        setCurrentIndex((prevIndex) => (prevIndex + 1) % mediaItems.length); // Move to next item, looping around
      }, interval);
      return () => clearInterval(timeoutRef.current); // Clear interval on unmount
    }
  }, [autoPlay, interval, mediaItems.length, currentIndex]);

  // Trigger callback whenever the current item changes
  useEffect(() => {
    if (onItemChange && mediaItems[currentIndex]) {
      onItemChange(mediaItems[currentIndex]);
    }
  }, [currentIndex, mediaItems, onItemChange]);

  // Handle navigation based on the media type
  const handleNavigation = (media) => {
    if (media && media.mediaType) {
      switch (media.mediaType.toLowerCase()) {
        case 'movie':
          navigate(`/movie/${media.id}`);
          break;
        case 'tvshow':
          navigate(`/tvshow/${media.id}`);
          break;
        case 'person':
          navigate(`/person/${media.id}`);
          break;
        default:
          navigate('/');
      }
    }
  };

  // Render individual media item as a carousel slide
  const renderMediaItem = (media, isVisible) => {
    if (!media) return null;

    const {
      mediaType,
      title,
      name,
      overview,
      backdropUrl,
      posterUrl,
      releaseDate,
      firstAirDate,
      voteAverage,
    } = media;

    const displayTitle = title || name; // Fallback title
    const imageUrl = formatImageUrl(backdropUrl || posterUrl); // Use backdrop or poster image
    const displayDate = mediaType.toLowerCase() === 'movie' ? releaseDate : firstAirDate; // Display date based on media type
    const rating = voteAverage ? `Rating: ${voteAverage}/10` : 'No rating available';

    return (
      <FadeBox
        key={media.id}
        sx={{
          backgroundImage: `url(${imageUrl})`, // Background image
          opacity: isVisible ? 1 : 0, // Control visibility with opacity
          zIndex: isVisible ? 1 : 0,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            padding: '20px',
            color: '#fff',
            background: 'rgba(0, 0, 0, 0.6)', // Semi-transparent background for text
            cursor: 'pointer',
            boxSizing: 'border-box',
            borderRadius: '10px', // Rounded corners
          }}
          onClick={() => handleNavigation(media)} // Navigate on click
        >
          <Typography variant="h4" sx={{ wordWrap: 'break-word' }}>
            {displayTitle}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            {displayDate}
          </Typography>
          <Typography variant="body1" sx={{ wordWrap: 'break-word' }}>
            {overview}
          </Typography>
          <Typography variant="caption" display="block" mt={2}>
            {rating}
          </Typography>
        </Box>
      </FadeBox>
    );
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '70vh',
        overflow: 'hidden',
        borderRadius: '10px', // Rounded corners for the entire carousel
      }}
    >
      {mediaItems.map((media, index) => {
        const isVisible = index === currentIndex; // Determine if the item is currently visible
        const wasVisible = index === prevIndex; // Determine if the item was previously visible
        return renderMediaItem(media, isVisible || wasVisible); // Render visible and transitioning items
      })}
    </Box>
  );
}

MediaDisplayCarousel.propTypes = {
  mediaItems: PropTypes.arrayOf(PropTypes.object).isRequired, // Array of media items to display
  autoPlay: PropTypes.bool, // Whether to autoplay the carousel
  interval: PropTypes.number, // Interval for autoplay in milliseconds
  onItemChange: PropTypes.func, // Callback for item change
};

export default MediaDisplayCarousel;
