import React from 'react';
import Header from '../../components/Header';
import { Helmet } from 'react-helmet';
import withStyles from '@material-ui/core/styles/withStyles';
import User from '../../components/User';

const styles = theme => ( {
  wrapper: {
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    backgroundColor: theme.palette.background.default
  },
  toolbar: theme.mixins.toolbar,
} );

const Layout = (props) => {
  return (
      <>
        <Helmet titleTemplate="%s | Hatás ERP" defaultTitle="Hatás Vállalatirányítás"/>
        <div className={props.classes.wrapper}>
          <User>
            {({ data: { me } }) => (
                me ? <Header {...props.childProps}/> : null
            )}
          </User>
          <main className={props.classes.content}>
            <div className={props.classes.toolbar}/>
            {props.children}
          </main>
        </div>
      </>
  );
};

export default withStyles(styles)(Layout);
