import React from 'react';
import PropTypes from 'prop-types';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import ArrowRight from '@material-ui/icons/ArrowRight';
import Remove from '@material-ui/icons/Delete';
import withStyles from '@material-ui/core/styles/withStyles';
import Input from './form/elements/Input';

const style = (theme) => ( {
  activeInput: {
    background: theme.palette.grey[200],
  },
} );

class StockMainCategoryItem extends React.Component {
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    if (( this.props.active !== nextProps.active ) && ( nextProps.active === this.props.index )) {
      return true;
    }

    return ( this.props.active === this.props.index ) && ( nextProps.active !== nextProps.index );
  }

  render() {
    const { subCatHandler, active, form: { values }, index, classes, remove, deleteHandler } = this.props;
    return (
      <Input name={`stockCategories[${index}].name`}
             key={index}
             margin="dense"
             className={index === active ? classes.activeInput : null}
             autoComplete="off"
             noFast
             onFocus={() => subCatHandler(index, values)}
             InputProps={{
               endAdornment: (
                 <InputAdornment variant="filled" position="end">
                   {index === active ? <ArrowRight/> :
                     <IconButton
                       aria-label="Törlés"
                       onClick={() => deleteHandler(remove, index,
                         values.stockCategories[index].id)}
                     >
                       <Remove/>
                     </IconButton>}
                 </InputAdornment>
               ),
             }}
      />
    );
  };
};

StockMainCategoryItem.propTypes = {
  subCatHandler: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
  deleteHandler: PropTypes.func.isRequired,
  active: PropTypes.number.isRequired,
  form: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(style)(StockMainCategoryItem);