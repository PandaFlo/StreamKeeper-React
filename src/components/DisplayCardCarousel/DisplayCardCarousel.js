import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, IconButton, Typography } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import DisplayCardA from '../DisplayCardA/DisplayCardA';
import DisplayCardB from '../DisplayCardB/DisplayCardB';

function DisplayCardCarousel({
  items,
  initialCarouselWidth = 800,
  carouselHeight = 400,
  displayLimit = 4,
  showArrows = true,
  cardType = 'A', // new prop to toggle between DisplayCardA and DisplayCardB
}) {
  const scrollContainerRef = useRef(null);
  const [carouselWidth, setCarouselWidth] = useState(initialCarouselWidth);

  const sampleCard = items[0] instanceof Object ? items[0] : {};
  const cardWidth = sampleCard.fixedWidth || sampleCard.minWidth || 275;
  const cardHeight = sampleCard.fixedHeight || sampleCard.minHeight || carouselHeight; // Fallback to carouselHeight
  const gap = 20;

  const scrollAmount = cardWidth + gap;
  const maxCards = Math.floor(carouselWidth / scrollAmount);
  const cardsDisplayed = Math.min(displayLimit, maxCards);

  useEffect(() => {
    const handleResize = () => setCarouselWidth(window.innerWidth * 0.8);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePrev = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (initialCarouselWidth < scrollAmount) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          width: '100%',
          height: carouselHeight,
          
        }}
      >
        <Typography variant="h6" color="error" sx={{ textAlign: 'center' }}>
          Carousel dimensions mismatch!
        </Typography>
        <Typography variant="body1" sx={{ textAlign: 'center' }}>
          Initial carousel width ({initialCarouselWidth}px) is less than the required scroll amount ({scrollAmount}px).
        </Typography>
        <Typography variant="body2" sx={{ textAlign: 'center' }}>
          Card dimensions: {cardWidth}px (width) x {cardHeight}px (height)
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        verticalAlign: 'top',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      <Box
        sx={{
          width: cardWidth * cardsDisplayed + gap * (cardsDisplayed - 1),
          height: cardHeight + 100,
          position: 'relative',
        }}
      >
        {showArrows && (
          <IconButton
            onClick={handlePrev}
            sx={{
              position: 'absolute',
              left: '-60px',
              top: '40%',
              transform: 'translateY(-50%)',
              zIndex: 9,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              borderRadius: '50%',
              padding: '10px',
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
              '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' },
            }}
          >
            <ArrowBackIos fontSize="small" />
          </IconButton>
        )}

        <Box
          ref={scrollContainerRef}
          sx={{
            transform: 'translateY(-12%)',
            alignItems: 'center',
            display: 'flex',
            gap: `${gap}px`,
            overflowX: 'scroll',
            scrollSnapType: 'x mandatory',
            width: '100%',
            height: '100%',
            padding: '10px 0',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          {items.map((item, idx) => (
            <Box
              key={idx}
              sx={{
                minWidth: cardWidth,
                maxWidth: cardWidth,
                height: cardHeight,
                scrollSnapAlign: 'start',
                alignItems: 'center',
              }}
            >
              {React.isValidElement(item) ? (
                item
              ) : (
                cardType === 'A' ? (
                  <DisplayCardA media={item} fixedWidth={cardWidth} fixedHeight={cardHeight} />
                ) : (
                  <DisplayCardB media={item} fixedWidth={cardWidth} fixedHeight={cardHeight} />
                )
              )}
            </Box>
          ))}
        </Box>

        {showArrows && (
          <IconButton
            onClick={handleNext}
            sx={{
              position: 'absolute', 
              right: '-60px', 
              top: '40%', 
              transform: 'translateY(-50%)', 
              zIndex: 999999,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              borderRadius: '50%',
              padding: '10px',
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
              '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' },
            }}
          >
            <ArrowForwardIos fontSize="small" />
          </IconButton>
        )}
      </Box>
    </Box>
  );
}

DisplayCardCarousel.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.shape({
        mediaType: PropTypes.string,
        title: PropTypes.string,
        overview: PropTypes.string,
        voteAverage: PropTypes.number,
        posterUrl: PropTypes.string,
        backdropUrl: PropTypes.string,
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      }),
      PropTypes.element,
    ])
  ).isRequired,
  initialCarouselWidth: PropTypes.number,
  carouselHeight: PropTypes.number,
  displayLimit: PropTypes.number,
  showArrows: PropTypes.bool,
  cardType: PropTypes.oneOf(['A', 'B']), // accepts 'A' or 'B' to toggle between DisplayCardA and DisplayCardB
};

export default DisplayCardCarousel;
