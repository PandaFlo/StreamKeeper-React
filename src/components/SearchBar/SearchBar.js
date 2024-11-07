// src/components/SearchBar.js

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@mui/material';
import { SearchBarWrapper, StyledTextField } from './SearchBar.styled';
import { useNavigate } from 'react-router-dom';

function SearchBar({ currentMovie }) {
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  const handleSearchInput = (e) => {
    setSearchText(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && searchText.trim()) {
      navigate(`/search/${encodeURIComponent(searchText.trim())}`); // Navigate to SearchResultsPage
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      const placeholder = currentMovie ? currentMovie.title : '';
      if (searchText.trim() === '') {
        setSearchText(placeholder);
      }
      // Prevent default Tab behavior to avoid changing focus
      e.preventDefault();
    }
  };

  const handleSpaceClick = (e) => {
    if (e.key === ' ' && searchText.trim() === '') {
      const placeholder = currentMovie ? currentMovie.title : '';
      setSearchText(placeholder);
      // Prevent default space behavior when placeholder is still visible
      e.preventDefault();
    }
  };

  return (
    <SearchBarWrapper>
      <StyledTextField
        variant="outlined"
        value={searchText}
        onChange={handleSearchInput}
        onKeyPress={handleKeyPress}
        onKeyDown={(e) => {
          handleKeyDown(e);
          handleSpaceClick(e);
        }}
        placeholder={currentMovie ? `"${currentMovie.title}"...` : 'Search for media ...'}
      />
    </SearchBarWrapper>
  );
}

SearchBar.propTypes = {
  currentMovie: PropTypes.object, // Optional, used for dynamic placeholder
};

export default SearchBar;
