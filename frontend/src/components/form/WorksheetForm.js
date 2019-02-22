import React from 'react';
import PropTypes from 'prop-types';
import { FastField, FieldArray, Formik } from 'formik';
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

const styles = (theme) => ( {
  imageContainer: {
    marginTop: theme.spacing.unit,
    position: 'relative',
  },
  image: {
    width: '100%',
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

const formDefaultValue = {
  name: '',
  customer: '',
  status: '',
  cover: '',
  tags: [],
  products: [],
  current_product: '',
};

const formScheme = Yup.object().shape({
  name: Yup.string().required(),
  customer: Yup.object().shape({
    label: Yup.string(),
    value: Yup.string().required(),
  }).required(),
  cover: Yup.string(),
  products: Yup.array().min(1),
});

const formOnSubmit = () => {
  console.log(formScheme);
  console.log('submit');
};

class WorksheetForm extends React.Component {
  render() {
    const { data, classes, templates, me, customers, tags } = this.props;
    const updatedAt = data ? data.updatedAt : null;

    const customerList = customers.map(item => ( {
      value: item.id,
      label: item.name,
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
              </Grid>
            </Grid>
            <FormikDebug/>
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
  me: PropTypes.object.isRequired,
};

export default withStyles(styles)(WorksheetForm);