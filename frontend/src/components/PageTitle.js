import React, { Component } from 'react';
import { PageTitleContext } from '../lib/pageTitleProvider';
import { Helmet } from 'react-helmet';
import * as PropTypes from 'prop-types';

class PageTitle extends Component {
  componentDidMount() {
    if (this.props.title)
      this.props.context.setTitle(this.props.title);
  }

  render() {
    if (this.props.title) {
      return <Helmet>
        <title>{this.props.context.title}</title>
      </Helmet>;
    }

    if (!this.props.title) {
      return this.props.context.title;
    }
  }
}

PageTitle.propTypes = {
  title: PropTypes.string,
  context: PropTypes.object.isRequired,
};

export default (props) => (
  <PageTitleContext.Consumer>
    {(context) => <PageTitle {...props} context={context}/>}
  </PageTitleContext.Consumer>
)