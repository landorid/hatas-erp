import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { Mutation } from 'react-apollo';
import { CURRENT_USER_QUERY } from './User';
import gql from 'graphql-tag';

const HeadContainer = styled.ul`
  text-align: center;
  margin: 12px 0;
  display: flex;
  justify-content: center;
  
  li {
  list-style-type: none;  
  
  + li {
    margin-left: 12px;
  }
  
  a {
      color: black;
  }
  }
`;
const SIGN_OUT_MUTATION = gql`
    mutation SIGN_OUT_MUTATION {
        signOut {
            message
        }
    }
`;

class Header extends Component {
  render() {
    return (
        <HeadContainer>
          <li>
            <NavLink to={'/'}>Kezdőlap</NavLink>
          </li>
          <li>
            <NavLink to={'/profile'}>Profil</NavLink>
          </li>
          <li>
            <NavLink to={'/login'}>Belépés</NavLink>
          </li>
          <li>
            <Mutation mutation={SIGN_OUT_MUTATION} fetchPolicy={'no-cache'} refetchQueries={[{query: CURRENT_USER_QUERY}]}>
              {(signOut) => (
                  <button onClick={signOut}>Kilépés</button>
              )}
            </Mutation>
          </li>
        </HeadContainer>
    );
  }
}

export default Header;