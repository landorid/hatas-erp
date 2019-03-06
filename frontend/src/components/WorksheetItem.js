import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/es/styles/withStyles';
import { Link } from 'react-router-dom';
import { Chip } from '@material-ui/core';

const styles = {
  media: {
    height: 195,
  },
  chip: {
    marginRight: 4,
  },
  chipContainer: {
    marginTop: 12,
  },
};

const WorksheetItem = props => {
  const { classes, item } = props;
  console.log(item);
  return (
    <Card>
      {item.cover &&
      <CardActionArea component={Link} to={`/worksheet/${item.id}`}>
        <CardMedia
          className={classes.media}
          image={item.cover}
          title={item.name}
        />
      </CardActionArea>
      }
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          {item.name}
        </Typography>
        <Typography color="textSecondary" variant="body1">
          - {item.customer.name}
        </Typography>

        <div className={classes.chipContainer}>
          {item.tags.map((item, index) =>
            <Chip key={index}
                  className={classes.chip}
                  label={item.name}/>)}
        </div>

      </CardContent>
      <CardActions>
        <Button size="small"
                color="primary"
                component={Link}
                to={`/worksheet/${item.id}`}>
          Megtekintés
        </Button>
      </CardActions>
    </Card>
  );
};

WorksheetItem.propTypes = {
  item: PropTypes.object.isRequired,
};

export default withStyles(styles)(WorksheetItem);