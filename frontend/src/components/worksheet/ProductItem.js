import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray } from 'formik';
import { Query } from 'react-apollo';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Warning from '@material-ui/icons/Error';
import Divider from '@material-ui/core/Divider';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import Input from '../form/elements/Input';
import MuiSelect from '../form/elements/MuiSelect';
import { STOCK_ITEMS_QUERY } from '../../containers/Stock';
import { hasPermission } from '../../lib/utils';
import * as classnames from 'classnames';

const styles = theme => ( {
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexShrink: 1,
  },
  headingError: {
    color: theme.palette.error.main,
    display: 'flex',
    alignItems: 'center',
  },
  warningIcon: {
    height: theme.typography.pxToRem(16),
    width: theme.typography.pxToRem(16),
    marginRight: theme.spacing.unit,
  },
} );

const ProductItem = (props) => {
  const { classes, item, data, remove, errors, me } = props;

  const validateField = (value, required, roles, myRoles) => {
    let error;
    if (!required) return error;
    if (required && !value && hasPermission([...myRoles, 'EVERYBODY'], roles)) {
      error = 'A mező kitöltése kötelező';
    }

    return error;
  };

  const isErrorInProduct = errors.products && errors.products[item]
    && errors.products[item].fields
    && errors.products[item].fields.length;

  return (
    <ExpansionPanel>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
        <Typography className={classnames(classes.heading, { [classes.headingError]: isErrorInProduct })}>
          {isErrorInProduct ? <Warning className={classes.warningIcon}/> : ''}
          {data.name}
        </Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <FieldArray validateOnChange={false}
                    name={`products[${item}]`}>
          {() => {
            return (
              <div style={{ width: '100%' }}>
                {data.fields.map((field, index) => {
                  if (field.type === 'text' || field.type === 'textarea') {
                    return (
                      <Input name={`products[${item}].fields[${index}].value`}
                             label={field.name}
                             margin='dense'
                             multiline={field.type === 'textarea'}
                             rows={5}
                             validate={(value) => validateField(value, field.required, [field.role], me.job)}
                             InputProps={{
                               endAdornment: field.suffix
                                 ? <InputAdornment position="end">{field.suffix}</InputAdornment>
                                 : null,
                             }}
                             inputProps={{
                               style: { textAlign: field.suffix ? 'right' : 'left' },
                             }}
                             key={index}
                             type="text"/> );
                  }
                  if (field.type === 'deadline') {
                    return ( <Input name={`products[${item}].fields[${index}].value`}
                                    label={field.name}
                                    margin='dense'
                                    InputLabelProps={{ shrink: true }}
                                    type="date"
                                    key={index}/> );
                  }
                  if (field.type === 'stockitem') {
                    return (
                      <Query query={STOCK_ITEMS_QUERY}
                             key={index}
                             fetchPolicy="cache-first">
                        {({ data, loading }) => {
                          const list = !data.stockItems ? [] : data.stockItems.map(item => ( {
                              value: item.id,
                              label: item.name,
                            } ),
                          );

                          return (
                            <Field component={MuiSelect}
                                   name={`products[${item}].fields[${index}].value`}
                                   label={field.name}
                                   isLoading={loading}
                                   isDisabled={loading}
                                   options={list}
                                   type="text"
                                   margin='dense'
                                   isClearable/>
                          );
                        }}
                      </Query>
                    );
                  }
                  return '';
                })}
              </div>
            );
          }}
        </FieldArray>
      </ExpansionPanelDetails>
      <Divider/>
      <ExpansionPanelActions>
        <Button size="small"
                onClick={() => remove(item)}>
          Törlés</Button>
      </ExpansionPanelActions>
    </ExpansionPanel>
  );
};

ProductItem.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  me: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  remove: PropTypes.func.isRequired,
  item: PropTypes.number.isRequired,
};

export default withStyles(styles)(React.memo(ProductItem));