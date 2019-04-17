import React from 'react';
import ContentLoader from 'react-content-loader';

const WorksheetLoading = () => (
  <ContentLoader
    height={272}
    width={260}
    speed={2}
    primaryColor="#f3f3f3"
    secondaryColor="#ecebeb"
  >
    <rect x="0" y="162" rx="0" ry="0" width="260" height="29"/>
    <rect x="0" y="203" rx="0" ry="0" width="260" height="9"/>
    <rect x="0" y="240" rx="0" ry="0" width="108" height="32"/>
    <rect x="0" y="3" rx="0" ry="0" width="260" height="135"/>
  </ContentLoader>
);

export default WorksheetLoading;