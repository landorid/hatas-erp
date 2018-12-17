import React from 'react';
import Header from '../../components/Header';
import { Helmet } from 'react-helmet';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = theme => ( {
  wrapper: {
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
  },
  toolbar: theme.mixins.toolbar,
  backgroundColor: theme.palette.background.default,
} );

const Layout = (props) => {
  return (
      <>
        <Helmet titleTemplate="%s | Hatás ERP" defaultTitle="Hatás Vállalatirányítás"/>
        <div className={props.classes.wrapper}>
          <Header {...props.childProps}/>
          <main className="main">
            <div className={props.classes.toolbar}/>
            {props.children}
          </main>
        </div>
      </>
  );
};

export default withStyles(styles)(Layout);
