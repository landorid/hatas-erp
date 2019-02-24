import React from 'react';
import PropTypes from 'prop-types';
import Add from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import StockMainCategoryItem from './StockMainCategoryItem';

const style = (theme) => ( {
  activeInput: {
    background: theme.palette.grey[200],
  },
} );

const StockMainCategory = props => {
  const { push, form } = props;
  return (
    <div>
      {form.values.stockCategories && form.values.stockCategories.length > 0 ? (
        form.values.stockCategories.map((item, index) => (
          <StockMainCategoryItem key={index}
                                 index={index}
                                 {...props}/>
        ))
      ) : null}
      <Button
        color="primary"
        onClick={() => push({ name: '', id: null, children: [] })}>
        <Add/> Új kategória
      </Button>
    </div>
  );
};

StockMainCategory.propTypes = {};

export default withStyles(style)(StockMainCategory);