import React from 'react';
import gql from 'graphql-tag';
import { Link } from 'react-router-dom';
import { Query } from 'react-apollo';
import MUIDataTable from 'mui-datatables';
import Button from '@material-ui/core/Button';
import PageTitle from '../components/PageTitle';
import TableLoading from '../components/table/elements/TableLoading';
import { tableLabels } from '../config';
import Chip from '@material-ui/core/Chip';

const WORKSHEETS_SQUERY = gql`
  query WORKSHEETS_SQUERY {
    worksheets(orderBy: createdAt_DESC) {
      id
      name
      customer {
        id
        name
      }
      status
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

const Worksheets = props => {
  const { history } = props;

  const columns = [
    {
      name: 'ID',
      display: 'excluded',
      options: {
        display: 'excluded',
        filter: false,
      },
    },
    {
      name: 'Megnevezés',
    },
    {
      name: 'Ügyfél',
      options: {
        customBodyRender: (value) => value.name,
      },
    },
    {
      name: 'Státusz',
      options: {
        customBodyRender: (value) => {
          return value;
        },
      },
    },
    {
      name: 'Felelős',
      options: {
        customBodyRender: (value) => {
          return `${value.lastName} ${value.firstName}`;
        },
      },
    },
    {
      name: 'Címkék',
      options: {
        filter: false,
        customBodyRender: (value) => {
          return value.map((item, index) => (
            <Chip label={item.name} style={{ marginRight: 10 }} key={index}/>
          ));
        },
      },
    },
  ];

  const options = {
    selectableRows: false,
    fixedHeader: true,
    print: false,
    onRowClick: (currentRowsSelected) => {
      history.push(`/worksheet/${currentRowsSelected[0]}`);
    },
    ...tableLabels,
  };

  return (
    <>
      <PageTitle title="Munkalapok"/>

      <Query query={WORKSHEETS_SQUERY}>
        {({ data, loading, error }) => {
          if (loading) return <TableLoading/>;
          const newData = data.worksheets.reduce((array, item) => {
            const newItem = [];
            delete item.__typename;
            Object.keys(item).map(key => newItem.push(item[key]));
            array.push(newItem);

            return array;
          }, []);

          return  <MUIDataTable
              title={<Button color="primary"
                             to="/worksheet/add"
                             component={Link}
                             variant="contained">Új Munkalap</Button>}
              data={newData}
              columns={columns}
              options={options}/>;
        }}
      </Query>
    </>
  );
};
export default Worksheets;