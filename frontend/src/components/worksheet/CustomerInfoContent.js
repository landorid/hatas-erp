import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import { distanceInWordsToNow } from 'date-fns';
import dateLocale from 'date-fns/locale/hu';

const style = (theme) => ( {
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  editButton: {
    alignSelf: 'flex-end',
  },
  title: {
    marginTop: theme.spacing.unit * 2,
  },
} );

const CustomerInfoContent = props => {
  const { classes, data } = props;

  const renderItem = (title, data) => (
    data ? <>
      <Typography
        className={classes.title}
        variant="overline">{title}</Typography>
      <Typography variant="body1">{data}</Typography>
    </> : null
  );

  return (
    <div className={classes.root}>

      {renderItem('Név', data.name)}
      {renderItem('Adószám', data.taxNumber)}
      {renderItem('Cím', data.address)}
      {renderItem('Kapcsolattartó', data.contactName)}
      {renderItem('Email', data.email)}
      {renderItem('Telefonszám', data.phone)}
      {renderItem('Utolsó módosítás',
        distanceInWordsToNow(new Date(data.updatedAt), { locale: dateLocale }),
      )}
      {renderItem('Megjegyzés', data.note)}

    </div>
  );
};

CustomerInfoContent.propTypes = {
  data: PropTypes.object.isRequired,
};

export default React.memo(withStyles(style)(CustomerInfoContent));