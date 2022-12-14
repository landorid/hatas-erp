import React from 'react';
import PropTypes from 'prop-types';
import { FastField, Field, FieldArray, Formik } from 'formik';
import * as Yup from 'yup';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';
import RemoveImage from '@material-ui/icons/Close';

import FormContainer from './elements/FormContainer';
import Input from './elements/Input';
import MuiSelect from './elements/MuiSelect';
import ActionFooter from './elements/ActionFooter';
import ImageUpload from '../worksheet/ImageUpload';
import WorksheetProducts from '../worksheet/WorksheetProducts';
import { FormikDebug } from '../helper/FormikDebug';
import CustomerInfoDrawer from '../worksheet/CustomerInfoDrawer';
import { handleErrors } from '../../lib/utils';
import MuiInput from './elements/MuiInput';
import MenuItem from '@material-ui/core/MenuItem';
import { status } from '../../config';
import Button from '@material-ui/core/Button';

const styles = (theme) => ( {
  imageContainer: {
    marginTop: theme.spacing.unit,
    position: 'relative',
  },
  image: {
    maxWidth: '100%',
    display: 'flex',
    margin: '0 auto',
    borderRadius: theme.shape.borderRadius,
  },
  removeImage: {
    position: 'absolute',
    top: theme.spacing.unit,
    right: theme.spacing.unit,
    width: theme.spacing.unit * 4,
    height: theme.spacing.unit * 4,
    minHeight: theme.spacing.unit * 4,
  },
  closeProjectButton: {
    marginLeft: theme.spacing.unit,
  },
} );

const formScheme = Yup.object().shape({
  name: Yup.string().required(),
  customer: Yup.object().shape({
    label: Yup.string(),
    value: Yup.string().required(),
  }).required(),
  cover: Yup.string(),
  products: Yup.array().min(1),
  status: Yup.string().required(),
  responsible: Yup.object().shape({
    label: Yup.string(),
    value: Yup.string().required(),
  }).required(),
});

class WorksheetForm extends React.Component {
  render() {
    const { data, classes, templates, me, customers, tags, mutation, users, stock } = this.props;
    const updatedAt = data ? data.updatedAt : null;
    //rebase laoded data to form
    const newData = { ...data };

    if (data) {
      newData.customer = {
        value: data.customer.id,
        label: data.customer.name,
      };

      newData.responsible = {
        value: data.responsible.id,
        label: `${data.responsible.lastName} ${data.responsible.firstName}`,
      };

      newData.tags = data.tags.map(item => ( {
        value: item.id,
        label: item.name,
      } ));

      newData.products = data.products.map(item => ( {
        id: item.id,
        template: {
          ...item.template,
        },
        fields: item.template.fields.map((field, index) => {
          let value;
          if (field.type === 'stockitem') {
            const [stockItem] = stock.filter(st => st.id === item.fields[index].value);
            //if there is stockitem, then set it to react-select, if its empty show: kezdj el g??pelni
            value = stockItem ? {
              label: stockItem.name,
              value: item.fields[index].value,
            } : '';

          } else {
            //Check if there was template update
            if (!item.fields[index]) {
              item.fields[index] = {
                id: -1,
                value: '',
                __typename: 'ProductData',
              };
            }

            value = item.fields[index].value;
          }

          return ( {
            ...field,
            id: item.fields[index].id,
            value,
          } );
        }),
      } ));
    }

    const formDefaultValue = {
      name: '',
      owner: { id: me.id },
      responsible: {
        label: `${me.lastName} ${me.firstName}`,
        value: me.id,
      },
      customer: '',
      status: '',
      cover: '',
      tags: [],
      products: [],
      current_product: '',
    };

    const customerList = customers.map(item => ( {
      value: item.id,
      label: item.name,
    } ));

    const usersList = users.map(item => ( {
      value: item.id,
      label: `${item.lastName} ${item.firstName}`,
    } ));

    const tagsList = tags.map(item => ( {
      value: item.id,
      label: item.name,
    } ));

    const formOnSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
      const productsToDelete = [];
      const tagsToDisconnect = [];

      if (data) {
        data.products.forEach(item => {
          if (!values.products.some(fieldItem => fieldItem.id && ( fieldItem.id === item.id ))) {
            productsToDelete.push({ id: item.id });
          }
        });

        data.tags.forEach(item => {
          if (!values.tags.some(tag => tag.value !== 'newItem' && ( tag.value === item.id ))) {
            tagsToDisconnect.push({ id: item.id });
          }
        });
      }

      const createData = {
        name: values.name,
        owner: {
          connect: { id: values.owner.id },
        },
        responsible: {
          connect: { id: values.responsible.value },
        },
        cover: values.cover,
        status: values.status,
        customer: {
          connect: values.customer.value !== 'newItem' ? { id: values.customer.value } : undefined,
          create: values.customer.value === 'newItem' ? {
            name: values.customer.label,
          } : undefined,
        },
        tags: {
          connect: values.tags.map(item => ( {
            id: item.value,
          } )),
        },
        products: {
          create: values.products.map(item => ( {
            template: {
              connect: { id: item.template.id },
            },
            fields: {
              create: item.fields.map((field, index) => ( {
                value: typeof field.value === 'string' ? field.value : field.value.value,
                field: {
                  connect: { id: item.template.fields[index].id },
                },
              } )),
            },
          } )),
        },
      };

      const updateData = {
        name: values.name,
        owner: {
          connect: { id: values.owner.id },
        },
        responsible: {
          connect: { id: values.responsible.value },
        },
        cover: values.cover,
        status: values.status,
        customer: {
          connect: { id: values.customer.value },
        },
        tags: {
          connect: values.tags.filter(tag => !/newItem/g.test(tag.value)).map(item => ( {
            id: item.value,
          } )),
          disconnect: tagsToDisconnect,
          create: values.tags.filter(tag => /newItem/g.test(tag.value)).map(item => ( {
            name: item.label,
          } )),
        },
        products: {
          upsert: values.products.map(product => ( {
            where: { id: product.id || 1 },
            update: {
              template: {
                connect: { id: product.template.id },
              },
              fields: {
                upsert: product.fields.map((field, index) => ( {
                  where: { id: field.id || 1 },
                  update: {
                    field: {
                      connect: { id: product.template.fields[index].id },
                    },
                    value: typeof field.value === 'string' ? field.value : field.value.value,
                  },
                  create: {
                    field: {
                      connect: { id: product.template.fields[index].id },
                    },
                    value: typeof field.value === 'string' ? field.value : field.value.value,
                  },
                } )),
              },
            },
            create: {
              template: {
                connect: { id: product.template.id },
              },
              fields: {
                create: product.fields.map((field, index) => ( {
                  field: {
                    connect: { id: product.template.fields[index].id },
                  },
                  value: typeof field.value === 'string' ? field.value : field.value.value,
                } )),
              },
            },
          } )),
          delete: productsToDelete,
        },
      };

      const formData = {
        variables: {
          where: { id: values.id || 1 },
          create: { ...createData },
          update: { ...updateData },
        },
      };

      await mutation(formData).then(({ errors }) => {
        handleErrors(errors, setErrors);
      }).catch(err => {
        setSubmitting(false);
      });

      resetForm(values);
    };

    return (
      <Formik initialValues={data ? newData : formDefaultValue}
              validateOnChange={false}
              validateOnBlur={false}
              validationSchema={formScheme}
              onSubmit={formOnSubmit}>
        {({ isSubmitting, dirty, values, setFieldValue, errors }) => {
          let customerInfo = null;
          if (values.customer && values.customer.value && ( values.customer.value !== 'newItem' )) {
            customerInfo = <CustomerInfoDrawer currentWorksheet={data ? data.id : 'newItem'}
                                               customer={values.customer.value}/>;
          }

          return ( <FormContainer>
            <Grid container spacing={16}>
              <Grid item xs={12} sm={7} style={{ paddingTop: 16 }}>
                <FieldArray validateOnChange={false}
                            name="products"
                            render={(props) =>
                              <WorksheetProducts
                                me={me}
                                stock={stock}
                                templates={templates} {...props}/>}/>
              </Grid>

              <Grid item xs={12} sm={5}>
                <Input name="name"
                       label="Munkalap neve"
                       autoFocus/>
                <FastField component={MuiSelect}
                           newItem="??j ??gyf??l:"
                           name="customer"
                           label="??gyf??l"
                           creatable={!!!data}
                           options={customerList}
                           type="text"/>
                {customerInfo}

                <FastField component={MuiSelect}
                           newItem="??j c??mke:"
                           name="tags"
                           isMulti
                           creatable
                           label="C??mk??k"
                           options={tagsList}
                           type="text"/>
                {values.cover ?
                  <div className={classes.imageContainer}>
                    <Tooltip aria-label="K??p elt??vol??t??sa"
                             title="K??p elt??vol??t??sa"
                             placement="left">
                      <Fab size="small"
                           color="primary"
                           className={classes.removeImage}
                           onClick={(e) => setFieldValue('cover', '')}
                           aria-label="K??p elt??vol??t??sa">
                        <RemoveImage fontSize="small"/>
                      </Fab>
                    </Tooltip>
                    <img src={values.cover}
                         alt="Bor??t??k??p"
                         className={classes.image}/>
                  </div> :
                  <ImageUpload onChange={setFieldValue}
                               height={225}
                               width={400}
                               label="Bor??t??k??p"
                               name="cover"/>
                }
                <FastField component={MuiSelect}
                           name="responsible"
                           label="Felel??s"
                           options={usersList}
                           type="text"/>
                <Field type="text"
                       name="status"
                       label="St??tusz"
                       component={MuiInput}
                       variant="outlined"
                       select>
                  {status.map(item => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)}
                </Field>
              </Grid>
            </Grid>
            {/*<FormikDebug/>*/}
            <ActionFooter submitting={isSubmitting}
                          updatedAt={updatedAt}
                          dirty={dirty}>
              {/*{(submitting, dirty, updatedAt) => updatedAt ? (*/}
              {/*  <Button onClick={() => console.log('submitted')}*/}
              {/*          variant="contained"*/}
              {/*          color="secondary"*/}
              {/*          className={classes.closeProjectButton}*/}
              {/*          disabled={submitting || dirty}>*/}
              {/*    Projekt lez??r??sa*/}
              {/*  </Button>*/}
              {/*) : ''}*/}
            </ActionFooter>
          </FormContainer> );
        }}
      </Formik>
    );
  }
};

WorksheetForm.propTypes = {
  data: PropTypes.object,
  templates: PropTypes.array.isRequired,
  customers: PropTypes.array.isRequired,
  tags: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
  stock: PropTypes.array.isRequired,
  me: PropTypes.object.isRequired,
  mutation: PropTypes.func.isRequired,
};

export default withStyles(styles)(WorksheetForm);
