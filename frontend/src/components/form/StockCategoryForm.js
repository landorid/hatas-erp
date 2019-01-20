import React from 'react';
import { FieldArray, Formik } from 'formik';
import * as Yup from 'yup';
import * as PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/es/Button/Button';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import ArrowRight from '@material-ui/icons/ArrowRight';
import Remove from '@material-ui/icons/Delete';

import FormContainer from './elements/FormContainer';
import ActionFooter from './elements/ActionFooter';
import Input from './elements/Input';
import { createCategoryTree, handleErrors } from '../../lib/utils';
import { STOCKCATEGORIES_QUERY } from '../../containers/StockCategory';
import { Typography } from '@material-ui/core';

const style = (theme) => ( {
  root: {
    marginTop: 0,
    marginBottom: 0,
  },
  activeInput: {
    background: theme.palette.grey[200],
  },
} );

class StockItemCategory extends React.Component {
  state = {
    activeCategory: 0,
    deleteOnSubmit: [],
  };

  render() {
    const { classes, mutation, data, deleteMutation } = this.props;

    const formScheme = Yup.object().shape({
      stockCategories: Yup.array().of(
        Yup.object().shape({
          name: Yup.string().required(),
          children: Yup.array().of(
            Yup.object().shape({
              name: Yup.string().required(),
            }),
          ),
        }),
      ),
    });

    const formDefaultValue = {
      stockCategories: [
        { id: null, name: '', children: [] },
      ],
    };

    const formInitValue = data ? {
      stockCategories: [...createCategoryTree(data)],
    } : formDefaultValue;

    const formOnSubmit = async (variables, { resetForm, setErrors }) => {
      const modIDs = [];
      const modSubIDs = [];

      // Look for new/modified main category
      for (let i = 0; i < variables.stockCategories.length; i++) {
        //(it is a new value || modified category name)
        if (!formInitValue.stockCategories[i] ||
          variables.stockCategories[i].name !== formInitValue.stockCategories[i].name) {
          modIDs.push(i);
        }

        //if there is subcategory
        if (variables.stockCategories[i].children) {
          for (let j = 0; j < variables.stockCategories[i].children.length; j++) {
            if (!formInitValue.stockCategories[i].children[j] ||
              variables.stockCategories[i].children[j].name !== formInitValue.stockCategories[i].children[j].name) {
              modSubIDs.push({
                id: variables.stockCategories[i].children[j].id || 1,
                name: variables.stockCategories[i].children[j].name,
                parent: variables.stockCategories[i].id,
              });
            }
          }
        }
      }

      await modIDs.map(async (item) => {
        const itemData = {
          variables: {
            where: { id: variables.stockCategories[item].id || 1 },
            update: { name: variables.stockCategories[item].name },
            create: { name: variables.stockCategories[item].name },
          },
          update: (cache, payload) => {
            const data = cache.readQuery({ query: STOCKCATEGORIES_QUERY });

            const newStockItem = {
              id: payload.data.upsertStockCategory.id,
              name: payload.data.upsertStockCategory.name,
              parent: null,
              __typename: 'StockCategory',
            };

            cache.writeQuery({
              query: STOCKCATEGORIES_QUERY,
              data: {
                stockCategories: [...data.stockCategories, newStockItem],
              },
            });
          },
        };

        if (variables.stockCategories[item].parent) {
          itemData.variables.create.parent = { connect: { id: variables.stockCategories[item].parent } };
        }

        await mutation(itemData).then(({ errors }) => {
          handleErrors(errors, setErrors);
        }).catch(err => {
          console.log(err);
        });
      });

      await modSubIDs.map(async (item) => {
        const itemData = {
          variables: {
            where: { id: item.id || 1 },
            update: { name: item.name },
            create: {
              name: item.name,
              parent: { connect: { id: item.parent } },
            },
          },
          update: (cache, payload) => {
            const data = cache.readQuery({ query: STOCKCATEGORIES_QUERY });

            const newStockItem = {
              id: payload.data.upsertStockCategory.id,
              name: payload.data.upsertStockCategory.name,
              parent: payload.data.upsertStockCategory.parent,
              __typename: 'StockCategory',
            };

            cache.writeQuery({
              query: STOCKCATEGORIES_QUERY,
              data: {
                stockCategories: [...data.stockCategories, newStockItem],
              },
            });
          },
        };

        await mutation(itemData).then(({ errors }) => {
          handleErrors(errors, setErrors);
        }).catch(err => {
          console.log(err);
        });
      });

      if (this.state.deleteOnSubmit && this.state.deleteOnSubmit.length > 0) {
        await deleteMutation({
          variables: {
            where: { id_in: this.state.deleteOnSubmit },
          },
          update: (cache) => {
            const data = cache.readQuery({ query: STOCKCATEGORIES_QUERY });
            data.stockCategories = data.stockCategories.filter(item => !this.state.deleteOnSubmit.includes(item.id));
            cache.writeQuery({
              query: STOCKCATEGORIES_QUERY,
              data,
            });
          },
        }).then(({ errors }) => {
          handleErrors(errors, setErrors);
        }).catch(err => {
          console.log(err);
        });
      }
      this.setState({ deleteOnSubmit: [] });
      resetForm(variables);
    };

    const subCatHandler = (activeCategory) => {
      this.setState({ activeCategory });
    };

    const deleteItem = (handler, index, id) => {
      handler.remove(index);
      const deleteOnSubmit = [...this.state.deleteOnSubmit];
      deleteOnSubmit.push(id);
      this.setState({ deleteOnSubmit });
    };

    return (
      <Formik initialValues={formInitValue}
              validationSchema={formScheme}
              onSubmit={formOnSubmit}>
        {({ isSubmitting, dirty, values, error }) => (
          <FormContainer>
            {JSON.stringify(error)}
            <Grid container className={classes.root} spacing={16}>
              <Grid item xs={12} sm={6} lg={5}>
                <FieldArray
                  name="stockCategories">
                  {arrayHelpers => (
                    <div>
                      {values.stockCategories && values.stockCategories.length > 0 ? (
                        values.stockCategories.map((item, index) => (
                          <Input name={`stockCategories[${index}].name`}
                                 key={index}
                                 className={index === this.state.activeCategory ? classes.activeInput : null}
                                 autoComplete="off"
                                 onFocus={() => subCatHandler(index, values)}
                                 inputProps={{
                                   endAdornment: (
                                     <InputAdornment variant="filled" position="end">
                                       {index === this.state.activeCategory ? <ArrowRight/> :
                                         <IconButton
                                           aria-label="Törlés"
                                           onClick={() => deleteItem(arrayHelpers, index,
                                             values.stockCategories[index].id)}
                                         >
                                           <Remove/>
                                         </IconButton>}
                                     </InputAdornment>
                                   ),
                                 }}
                          />
                        ))
                      ) : null}
                      <Button onClick={() => arrayHelpers.push({ name: '', id: null, children: [] })}>
                        Új kategória
                      </Button>
                    </div>
                  )}
                </FieldArray>

              </Grid>
              <Grid item xs={12} sm={6} lg={7}>
                <FieldArray
                  name={`stockCategories[${this.state.activeCategory}].children`}>
                  {arrayHelpers => {
                    const currentCategory = values.stockCategories[this.state.activeCategory];
                    return ( <div>
                      {currentCategory && currentCategory.children.length > 0 ? (
                        currentCategory.children.map((item, index) => (
                          <Input name={`stockCategories[${this.state.activeCategory}].children[${index}].name`}
                                 key={index}
                                 margin="normal"
                                 variant="standard"
                                 autoComplete="off"
                                 inputProps={{
                                   endAdornment: (
                                     <InputAdornment variant="filled" position="end">
                                       <IconButton
                                         aria-label="Törlés"
                                         onClick={() => deleteItem(arrayHelpers, index,
                                           values.stockCategories[this.state.activeCategory].children[index].id)}
                                       >
                                         <Remove/>
                                       </IconButton>
                                     </InputAdornment>
                                   ),
                                 }}
                          />
                        ))

                      ) : null}
                      {currentCategory.id ?
                        <Button onClick={() => arrayHelpers.push({
                          name: '',
                          id: null,
                          parent: {
                            id: values.stockCategories[this.state.activeCategory].id,
                          },
                        })}>
                          Új alkategória
                        </Button> : <Typography
                          variant="body1">
                          Mentsd el a főkategóriát, hogy alkategóriát hozzáadhass!
                        </Typography>}
                    </div> );
                  }}
                </FieldArray>
              </Grid>
            </Grid>

            <ActionFooter submitting={isSubmitting}
                          dirty={dirty}/>
          </FormContainer>
        )}
      </Formik>
    );
  }
};

StockItemCategory.propTypes = {
  mutation: PropTypes.func.isRequired,
  deleteMutation: PropTypes.func.isRequired,
  data: PropTypes.array,
};

export default withStyles(style)(StockItemCategory);