import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';

const TAGS_SQUERY = gql`
  query TAGS_SQUERY {
    tags {
      id
      name
    }
  }
`;

const Tags = props => {
  return (
    <div>
tagsz
    </div>
  );
};

Tags.propTypes = {};

export default Tags;
export { TAGS_SQUERY };