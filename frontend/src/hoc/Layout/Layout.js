import React, { Component } from 'react';
import Header from '../../components/Header';
import { Helmet } from 'react-helmet';

class Layout extends Component {
  render() {
    return (
        <>
          <Helmet titleTemplate="%s | Hatás ERP" defaultTitle="Hatás Vállalatirányítás">

          </Helmet>
          <Header {...this.props.childProps}/>
          <main className="main">
            {this.props.children}
          </main>
        </>
    );
  }
}

export default Layout;
