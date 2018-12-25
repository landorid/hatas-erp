import React from 'react';

export const PageTitleContext = React.createContext();

export class PageTitleProvider extends React.Component {
  state = {
    title: '',
  };

  setTitle = (title) => {
    this.setState({ title });
  };

  render() {
    return (
      <PageTitleContext.Provider value={{ ...this.state, setTitle: this.setTitle }}>
        {this.props.children}
      </PageTitleContext.Provider>
    );
  }
}
