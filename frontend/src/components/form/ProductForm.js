import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray, Form, Formik } from 'formik';
import Grid from '@material-ui/core/Grid';
import * as Yup from 'yup';
import withStyles from '@material-ui/core/styles/withStyles';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Add from '@material-ui/icons/Add';
import ActionFooter from './elements/ActionFooter';
import { fieldTypes } from '../../config';
import Input from './elements/Input';
import MuiInput from './elements/MuiInput';
import FormContainer from './elements/FormContainer';
import Button from '@material-ui/core/Button';
import Remove from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const style = (theme) => ( {
  root: {
    marginTop: 0,
    marginBottom: 0,
  },
  subField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    flex: '1 1 30%',
  },
  subFieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    borderBottom: `solid 1px grey`,
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
    },
  },
  subFieldList: {
    display: 'flex',
    alignItems: 'center',
  },
  deleteSubField: {
    marginLeft: 'auto',
  },
} );

const ProductForm = props => {
  const { classes, mutation, data } = props;
  const updatedAt = data ? data.updatedAt : null;

  const formScheme = Yup.object().shape({
    name: Yup.string().required(),
    status: Yup.boolean(),
    fields: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required(),
        type: Yup.mixed().oneOf(fieldTypes.map(item => item.id)),
        default: Yup.string(),
        suffix: Yup.string(),
        required: Yup.boolean(),
      }),
    ).required(),
  });
  const fieldDefaultValue = {
    name: '',
    type: 'text',
    default: '',
    suffix: '',
    required: true,
  };

  const formDefaultValue = {
    name: '',
    status: 1,
    fields: [{ ...fieldDefaultValue }],
  };

  const formOnSubmit = async (variables, { resetForm, setErrors }) => {
    console.log('submitted');
  };

  return (
    <Formik initialValues={data || formDefaultValue}
            validateOnChange={false}
            validateOnBlur={false}
            validationSchema={formScheme}
            onSubmit={formOnSubmit}>
      {({ isSubmitting, dirty, values, handleChange }) => {
        return (
          <FormContainer>
            <Grid container className={classes.root} spacing={16}>
              <Grid item xs={12} sm={6} lg={4}>
                <Input name="name" label="Név" autoFocus/>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <Field type="text"
                       name="status"
                       label="Állapot"
                       component={MuiInput}
                       variant="outlined"
                       select>
                  <MenuItem key="active" value={1}>Elérhető</MenuItem>
                  <MenuItem key="archive" value={0}>Nem elérhető</MenuItem>
                </Field>
              </Grid>
            </Grid>
            <Typography variant={'h6'}>Mezők</Typography>
            <Typography variant={'body2'}>Ha beikszeled a Kötelező Mező-t, akkor a felhasználó
              nem fogja tudni elmenteni a Munkalapot, a mező kitöltése nélkül!</Typography>
            <FieldArray name="fields">
              {({ push, remove }) => {
                return ( <>
                  {values.fields.map((item, index) => (
                    <div key={index} className={classes.subFieldGroup}>
                      <div className={classes.subFieldList}>
                        <Input name={`fields[${index}].name`}
                               fullWidth={false}
                               className={classes.subField}
                               label="Mező neve"/>

                        <Field name={`fields[${index}].type`}
                               label="Típus"
                               className={classes.subField}
                               fullWidth={false}
                               component={MuiInput}
                               variant="outlined"
                               select>
                          {fieldTypes.map(item => (
                            <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                          ))}
                        </Field>

                        <Input name={`fields[${index}].default`}
                               fullWidth={false}
                               disabled={values.fields[index].type === 'stockitem'}
                               className={classes.subField}
                               label="Alap érték"/>
                      </div>
                      <div className={classes.subFieldList}>
                        <Input name={`fields[${index}].suffix`}
                               fullWidth={false}
                               width={50}
                               className={classes.subField}
                               label="Mértékegység"/>

                        <FormControlLabel
                          className={classes.subField}
                          control={
                            <Checkbox
                              name={`fields[${index}].required`}
                              checked={values.fields[index].required}
                              onChange={handleChange}
                              color="primary"
                              value={values.fields[index].required.toString()}
                            />
                          }
                          label="Kötelező mező"
                        />
                        <div>
                          <IconButton
                            className={classes.deleteSubField}
                            onClick={() => remove(index)}
                            aria-label="Törlés">
                            <Remove/>
                          </IconButton>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button
                    color="primary"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      push(fieldDefaultValue);
                    }}>
                    <Add/> Mező hozzáadása
                  </Button>
                </> );
              }}
            </FieldArray>

            <ActionFooter submitting={isSubmitting}
                          updatedAt={updatedAt}
                          dirty={dirty}/>
          </FormContainer> );
      }}
    </Formik>
  );
};

ProductForm.propTypes = {
  data: PropTypes.object,
};

export default withStyles(style)(ProductForm);