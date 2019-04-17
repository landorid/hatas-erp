import React from 'react';
import ContentLoader from 'react-content-loader';
import Paper from '../form/elements/FormContainer';

const WorksheetLoading = () => (
  <Paper square>
    <ContentLoader
      height={250}
      width={400}
      speed={2}
      primaryColor="#f3f3f3"
      secondaryColor="#ecebeb"
    >
      <rect x="0" y="0" rx="0" ry="0" width="233" height="34"/>
      <rect x="265" y="0" rx="0" ry="0" width="130" height="35"/>
      <rect x="265" y="50" rx="0" ry="0" width="130" height="35"/>
      <rect x="265" y="100" rx="0" ry="0" width="130" height="35"/>
      <rect x="265" y="150" rx="0" ry="0" width="130" height="100"/>
      <rect x="0" y="75" rx="0" ry="0" width="142" height="35"/>
      <rect x="158" y="76" rx="0" ry="0" width="70" height="35"/>
    </ContentLoader>
  </Paper>
);

export default WorksheetLoading;