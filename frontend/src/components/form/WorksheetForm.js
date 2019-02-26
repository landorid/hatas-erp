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
} );

const formScheme = Yup.object().shape({
  name: Yup.string().required(),
  customer: Yup.object().shape({
    label: Yup.string(),
    value: Yup.string().required(),
  }).required(),
  cover: Yup.string(),
  products: Yup.array().min(1),
});

class WorksheetForm extends React.Component {
  render() {
    const { data, classes, templates, me, customers, tags, mutation, users } = this.props;
    const updatedAt = data ? data.updatedAt : null;

    const formDefaultValue = {
      name: 'Névjegyes munkalap 1.0',
      owner: me.id,
      responsible: {
        label: `${me.lastName} ${me.firstName}`,
        value: me.id,
      },
      customer: {
        label: 'Roadrecord Kft',
        value: 'cjs4vqx6gwlvh0b47y4uyswnz',
      },
      status: me.job,
      cover: 'https://hatas-dev.s3.amazonaws.com/avatar/worksheet-cover-1551097145925.jpeg',
      tags: [
        {
          label: 'Ügyfélre vár',
          value: 'cjs586f0i3m3g0b4772teepnh',
        },
        {
          label: 'Fontos',
          value: 'cjs58625w3lmw0b476ftjnbu2',
        },
      ],
      products: [
        {
          'id': 'cjs3yxn69d2an0b47xhkrd52t',
          'name': 'Névjegykártya',
          'status': 1,
          'updatedAt': '2019-02-25T12:25:21.675Z',
          'fields': [
            {
              'id': 'cjs3yxn6bd2ao0b47lrxasgwg',
              'type': 'text',
              'name': 'Magasság',
              'suffix': 'mm',
              'role': 'EVERYBODY',
              'required': 1,
              '__typename': 'ProductField',
              'value': '70',
            },
            {
              'id': 'cjsahur074bh80b97jgnpr4sg',
              'type': 'text',
              'name': 'Hosszúság',
              'suffix': 'mm',
              'role': 'EVERYBODY',
              'required': 1,
              '__typename': 'ProductField',
              'value': '360',
            },
            {
              'id': 'cjsahur0b4bha0b97bmyj0s23',
              'type': 'stockitem',
              'name': 'Anyag',
              'suffix': '',
              'role': 'OPERATOR',
              'required': 1,
              '__typename': 'ProductField',
              'value': {
                label: 'Avery 500 event film',
                value: 'cjr5kwewph7g70a89jvorlnr9',
              },
            },
            {
              'id': 'cjsahur0e4bhc0b9768eiduq2',
              'type': 'deadline',
              'name': 'Határidő',
              'suffix': '',
              'role': 'EVERYBODY',
              'required': 0,
              '__typename': 'ProductField',
              'value': '',
            },
            {
              'id': 'cjsahur0i4bhe0b97nnb0otju',
              'type': 'text',
              'name': 'Darabszám',
              'suffix': 'db',
              'role': 'EVERYBODY',
              'required': 1,
              '__typename': 'ProductField',
              'value': 236,
            },
            {
              'id': 'cjskbezhtbhfj0b68ws0rwidc',
              'type': 'textarea',
              'name': 'Megjegyzés',
              'suffix': '',
              'role': 'EVERYBODY',
              'required': 0,
              '__typename': 'ProductField',
              'value': 'Legszebb legyen ez a névjegy, ami a piacon létezik. Ez a megrendelő kérése. Köszi',
            },
          ],
          '__typename': 'ProductTemplate',
        },
      ],
      current_product: '',
    };

    const formOnSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
      console.log(values);
      const worksheetData = {
        name: values.name,
        owner: {
          connect: { id: values.owner },
        },
        responsible: {
          connect: { id: values.responsible.value },
        },
        cover: values.cover,
        status: 'FRONTOFFICE',
        customer: {
          connect: { id: values.customer.value },
        },
        tags: {
          connect: values.tags.map(item => ( {
            id: item.value,
          } )),
        },
        products: {
          create: values.products.map(item => ( {
            template: {
              connect: { id: item.id },
            },
            fields: {
              create: item.fields.map(item => ( {
                value: typeof item.value === 'string' ? item.value : item.value.value,
                field: {
                  connect: { id: item.id },
                },
              } )),
            },
          } )),
        },
      };

      console.log(worksheetData);

      const formData = {
        variables: {
          where: { id: values.id || 1 },
          create: { ...worksheetData },
          update: { ...worksheetData },
        },
      };

      await mutation(formData).then(({ errors }) => {
        handleErrors(errors, setErrors);
      }).catch(err => {
        setSubmitting(false);
      });
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

    return (
      <Formik initialValues={data || formDefaultValue}
              validateOnChange={false}
              validateOnBlur={false}
              validationSchema={formScheme}
              onSubmit={formOnSubmit}>
        {({ isSubmitting, dirty, values, setFieldValue, errors }) => {
          return ( <FormContainer>
            <Grid container spacing={16}>
              <Grid item xs={12} sm={7} style={{ paddingTop: 16 }}>
                <FieldArray validateOnChange={false}
                            name="products"
                            render={(props) =>
                              <WorksheetProducts
                                me={me}
                                templates={templates} {...props}/>}/>
              </Grid>

              <Grid item xs={12} sm={5}>
                <Input name="name"
                       label="Munkalap neve"
                       autoFocus/>
                <FastField component={MuiSelect}
                           newItem="Új ügyfél:"
                           name="customer"
                           label="Ügyfél"
                           creatable
                           options={customerList}
                           type="text"/>
                {values.customer && ( values.customer.value !== 'newItem' )
                && <CustomerInfoDrawer customer={values.customer.value}/>}

                <FastField component={MuiSelect}
                           newItem="Új címke:"
                           name="tags"
                           isMulti
                           creatable
                           label="Címkék"
                           options={tagsList}
                           type="text"/>
                {values.cover ?
                  <div className={classes.imageContainer}>
                    <Tooltip aria-label="Kép eltávolítása"
                             title="Kép eltávolítása"
                             placement="left">
                      <Fab size="small"
                           color="primary"
                           className={classes.removeImage}
                           onClick={(e) => setFieldValue('cover', '')}
                           aria-label="Kép eltávolítása">
                        <RemoveImage fontSize="small"/>
                      </Fab>
                    </Tooltip>
                    <img src={values.cover}
                         alt="Borítókép"
                         className={classes.image}/>
                  </div> :
                  <ImageUpload onChange={setFieldValue}
                               height={225}
                               width={400}
                               label="Borítókép"
                               name="cover"/>
                }
                <FastField component={MuiSelect}
                           name="responsible"
                           label="Felelős"
                           options={usersList}
                           type="text"/>
                <Field type="text"
                       name="status"
                       label="Státusz"
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
                          dirty={dirty}/>
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
  me: PropTypes.object.isRequired,
  mutation: PropTypes.func.isRequired,
};

export default withStyles(styles)(WorksheetForm);