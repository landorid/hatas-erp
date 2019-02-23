import React from 'react';
import PropTypes from 'prop-types';
import { FastField, FieldArray, Formik } from 'formik';
import Grid from '@material-ui/core/Grid';
import * as Yup from 'yup';
import withStyles from '@material-ui/core/styles/withStyles';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Add from '@material-ui/icons/Add';
import ActionFooter from './elements/ActionFooter';
import { fieldTypes, roles } from '../../config';
import Input from './elements/Input';
import MuiInput from './elements/MuiInput';
import FormContainer from './elements/FormContainer';
import Button from '@material-ui/core/Button';
import Remove from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import { handleErrors } from '../../lib/utils';

const style = (theme) => ( {
  root: {
    marginTop: 0,
    marginBottom: 0,
  },
  subField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    flex: '1 1 20%',
    [theme.breakpoints.up('md')]: {
      flex: '0 1 20%',
    },
  },
  subFieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    borderBottom: `solid 1px grey`,
  },
  subFieldList: {
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
    },
  },
  deleteSubField: {
    marginLeft: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
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
        role: Yup.string(),
      }),
    ).min(1, 'Minimum egy mezőt tartalmaznia kell a Terméknek'),
  });

  const fieldDefaultValue = {
    name: '',
    type: 'text',
    default: '',
    suffix: '',
    required: 0,
    role: 'EVERYBODY',
  };

  const formDefaultValue = {
    name: '',
    status: 1,
    fields: [{ ...fieldDefaultValue }],
  };

  const formOnSubmit = async (variables, { resetForm, setErrors, setSubmitting }) => {
    const fieldsToDelete = [];

    delete variables.__typename;
    delete variables.updatedAt;
    variables.fields.map(item => delete item.__typename);

    //Find fields, which is now not present int formtemplate, but there was
    if (data) {
      data.fields.forEach(item => {
        if (!variables.fields.some(fieldItem => fieldItem.id && ( fieldItem.id === item.id ))) {
          fieldsToDelete.push({ id: item.id });
        }
      });
    }

    const formData = {
      variables: {
        where: variables.id || 1,
        data: {
          delete: fieldsToDelete,
          ...variables,
        },
      },
    };

    await mutation(formData).then(({ errors }) => {
      handleErrors(errors, setErrors);
    }).catch(err => {
      console.log(err);
      setSubmitting(false);
    });

    if (data) {
      resetForm(variables);
    }
  };

  return (
    <Formik initialValues={data || formDefaultValue}
            validateOnChange={false}
            validateOnBlur={false}
            validationSchema={formScheme}
            onSubmit={formOnSubmit}>
      {({ isSubmitting, dirty, values, handleChange, errors }) => {
        return (
          <FormContainer>
            <Grid container className={classes.root} spacing={16}>
              <Grid item xs={12} sm={6} lg={4}>
                <Input name="name" label="Név" autoFocus/>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <FastField type="text"
                           name="status"
                           label="Állapot"
                           component={MuiInput}
                           variant="outlined"
                           select>
                  <MenuItem key="active" value={1}>Elérhető</MenuItem>
                  <MenuItem key="archive" value={0}>Nem elérhető</MenuItem>
                </FastField>
              </Grid>
            </Grid>
            <Typography variant={'h6'}>Mezők</Typography>
            <Typography variant={'body2'}>Ha bejelölöd a Kötelező Mező-t, akkor egyik felhasználó
              sem fogja tudni elmenteni a Munkalapot a mező kitöltése nélkül! Ha kiválasztod a jogosultságot is, akkor
              csak annak a felhasználónak lesz az adott bező kötelező</Typography>
            <FieldArray validateOnChange={false} name="fields">
              {({ push, remove }) => {
                return ( <>
                    {values.fields.map((item, index) => (
                      <div key={index} className={classes.subFieldGroup}>
                        <div className={classes.subFieldList}>
                          <Input name={`fields[${index}].name`}
                                 fullWidth={false}
                                 className={classes.subField}
                                 label="Mező neve"/>

                          <FastField name={`fields[${index}].type`}
                                     label="Típus"
                                     className={classes.subField}
                                     fullWidth={false}
                                     component={MuiInput}
                                     variant="outlined"
                                     select>
                            {fieldTypes.map(item => (
                              <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                            ))}
                          </FastField>

                          <Input name={`fields[${index}].default`}
                                 fullWidth={false}
                                 disabled={values.fields[index].type === 'stockitem'}
                                 className={classes.subField}
                                 label="Alap érték"/>

                          <Input name={`fields[${index}].suffix`}
                                 fullWidth={false}
                                 width={50}
                                 className={classes.subField}
                                 label="Mértékegység"/>
                        </div>
                        <div className={classes.subFieldList}>
                          <FastField name={`fields[${index}].required`}
                                     label="Kötelező"
                                     className={classes.subField}
                                     fullWidth={false}
                                     component={MuiInput}
                                     variant="outlined"
                                     select>
                            <MenuItem value={1}>Igen</MenuItem>
                            <MenuItem value={0}>Nem</MenuItem>
                          </FastField>

                          {!!values.fields[index].required &&
                          <FastField name={`fields[${index}].role`}
                                     label="Felelős"
                                     className={classes.subField}
                                     fullWidth={false}
                                     component={MuiInput}
                                     variant="outlined"
                                     select>
                            <MenuItem key={-1} value="EVERYBODY">Mindenki</MenuItem>
                            {roles.map(item => (
                              <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                            ))}
                          </FastField>}

                          {values.fields.length > 1 && <div className={classes.deleteSubField}>
                            <IconButton
                              onClick={() => remove(index)}
                              aria-label="Törlés">
                              <Remove/>
                            </IconButton>
                          </div>}
                        </div>
                      </div>
                    ))}

                    <Button
                      color="primary"
                      onClick={() => push(fieldDefaultValue)}>
                      <Add/> Mező hozzáadása
                    </Button>
                  </>
                );
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
  mutation: PropTypes.func.isRequired,
};

export default withStyles(style)(React.memo(ProductForm));