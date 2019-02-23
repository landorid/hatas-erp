import React from 'react';
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
tagszd
    </div>
  );
};

export default Tags;
export { TAGS_SQUERY };