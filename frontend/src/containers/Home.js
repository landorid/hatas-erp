import React from 'react';
import PageTitle from '../components/PageTitle';
import gql from 'graphql-tag';
import { adopt } from 'react-adopt';
import { CURRENT_USER_QUERY } from '../components/User';
import Query from 'react-apollo/Query';
import WorksheetItem from '../components/WorksheetItem';
import Grid from '@material-ui/core/es/Grid';
import WorksheetsLoading from '../components/worksheet/WorksheetsLoading';

const CURRENT_USER_WORKSHEET_QUERY = gql`
  query CURRENT_USER_WORKSHEET_QUERY($where: WorksheetWhereInput) {
    worksheets(where: $where, orderBy: createdAt_DESC) {
      id
      name
      customer {
        id
        name
      }
      status
      cover
      responsible {
        id
        firstName
        lastName
      }
      tags {
        id
        name
      }
    }
  }
`;

const ComposedWorksheet = adopt({
  me: ({ single, render }) =>
    <Query query={CURRENT_USER_QUERY}
           children={render}/>,
  worksheet: ({ single, render, me }) =>
    <Query query={CURRENT_USER_WORKSHEET_QUERY}
           children={render}
           variables={{ where: { responsible: { id: me.data.me.id } } }}
           fetchPolicy="cache-and-network"/>,
});

const Home = () => {
  return (
    <div style={{padding: 8}}>
      <PageTitle title="Irányítópult"/>

      <Grid container
            spacing={16}
            alignItems="stretch">
        <Grid container item
              alignItems="stretch"
              xs={12} sm={12} md={6} lg={8}
              spacing={16}>
          <ComposedWorksheet>
            {({ worksheet: { data, loading } }) => {
              if (loading) return [...Array(4).keys()].map(item =>
                <Grid item xs={12} sm={12} lg={6} xl={4} key={item}> <WorksheetsLoading/> </Grid>);

              if (loading) return <WorksheetsLoading/>;
              if (!data.worksheets) return '';

              return ( data.worksheets.map((item, index) =>
                <Grid item xs={12} sm={12} lg={6} xl={4} key={index}>
                  <WorksheetItem item={item}/>
                </Grid>,
              ) );
            }}
          </ComposedWorksheet>
        </Grid>
      </Grid>
    </div>
  );
};

export default Home;