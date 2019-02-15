import React from 'react';
import PropTypes from 'prop-types';
import { Field, Formik } from 'formik';
import { Query } from 'react-apollo';
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
import { CUSTOMERS_QUERY } from '../../containers/Customers';
import { TAGS_SQUERY } from '../../containers/Tags';
import ImageUpload from '../worksheet/ImageUpload';

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

const formOnSubmit = () => {
  console.log('submit');
};

const formDefaultValue = {
  name: '',
  customer: '',
  status: '',
  cover: '',
  tags: [],
  // products: [],
};

const formScheme = Yup.object().shape({
  name: Yup.string().required(),
  customer: Yup.object().shape({
    label: Yup.string(),
    value: Yup.string().required(),
  }).required(),
  cover: Yup.string()
});

const WorksheetForm = props => {
  const { data, classes } = props;
  const updatedAt = data ? data.updatedAt : null;

  return (
    <Formik initialValues={data || formDefaultValue}
            validateOnChange={false}
            validateOnBlur={false}
            validationSchema={formScheme}
            onSubmit={formOnSubmit}>
      {({ isSubmitting, dirty, values, setFieldValue, errors }) => {
        return ( <FormContainer>
          <Grid container spacing={16} style={{ height: 500 }}>
            <Grid item xs={12} sm={7}>

            </Grid>

            <Grid item xs={12} sm={5}>
              <Input name="name"
                     label="Munkalap neve"
                     autoFocus/>

              <Query query={CUSTOMERS_QUERY}
                     fetchPolicy="cache-first"
                     variables={{ where: { status: 1 } }}>
                {({ data, loading }) => {
                  const items = [];
                  if (!loading && data && data.customers) {
                    data.customers.forEach(item => (
                      items.push({
                        value: item.id,
                        label: item.name,
                      }) ),
                    );
                  }

                  return (
                    <Field component={MuiSelect}
                           newItem="Új ügyfél:"
                           name="customer"
                           label="Ügyfél"
                           options={items}
                           isDisabled={loading}
                           isLoading={loading}
                           type="text"/>
                  );
                }}
              </Query>

              <Query query={TAGS_SQUERY}
                     fetchPolicy="cache-first">
                {({ data, loading }) => {
                  const items = [];
                  if (!loading && data && data.tags) {
                    data.tags.forEach(item => (
                      items.push({
                        value: item.id,
                        label: item.name,
                      }) ),
                    );
                  }

                  return (
                    <Field component={MuiSelect}
                           newItem="Új címke:"
                           name="tags"
                           isMulti
                           label="Címkék"
                           options={items}
                           isDisabled={loading}
                           isLoading={loading}
                           type="text"/>
                  );
                }}
              </Query>
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
          {JSON.stringify(values)}
          <ActionFooter submitting={isSubmitting}
                        updatedAt={updatedAt}
                        dirty={dirty}/>
        </FormContainer> );
      }}
    </Formik>
  );
};

WorksheetForm.propTypes = {
  data: PropTypes.object,
  // mutation: PropTypes.func.isRequired,
};

export default withStyles(styles)(WorksheetForm);