import styled from 'styled-components';

export const MediaDisplayCarouselWrapper = styled.div`.fade-enter {
  opacity: 0;
}
.fade-enter-active {
  opacity: 1;
  transition: opacity 1000ms;
}
.fade-exit {
  opacity: 1;
}
.fade-exit-active {
  opacity: 0;
  transition: opacity 1000ms;
}

`;
