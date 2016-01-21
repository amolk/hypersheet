import React from 'react';
import Relay from 'react-relay';
import {Table, Column, Cell} from 'fixed-data-table';

import SheetRow from './SheetRow';

class Sheet extends React.Component {
  render() {
    var {sheet} = this.props;

    var rows = sheet.rows.edges.map((row) => {
      return row.node.data.reduce((hash, datum) => {
        hash[datum.key] = datum.value;
        return hash;
      }, {});
    });

    var columns = sheet.columnInfos.map(columnInfo => {
      var header = <Cell>{columnInfo.name}</Cell>;
      var cells = ({rowIndex, ...props}) => {
        return <Cell {...props}>
          {rows[rowIndex][columnInfo.name]}
        </Cell>
      };

      return (<Column
        header={header}
        cell={cells}
        width={100}>
      </Column>);
    });

    return (
      <div>
        <h1>{sheet.name}</h1>

        <table>
          <tbody>
            <tr>
              {sheet.columnInfos.map(columnInfo => <th key={columnInfo.name}>{columnInfo.name}</th>)}
            </tr>
            {sheet.rows.edges.map(row => <SheetRow key={row.node.id} row={row.node} column='name'></SheetRow>)}
          </tbody>
        </table>

        <Table
          rowHeight={50}
          headerHeight={50}
          rowsCount={2}
          width={1000}
          height={500}>

          {columns}
        </Table>
      </div>
    )
  }
}

export default Relay.createContainer(Sheet, {
  initialVariables: {
    columns: null
  },

  fragments: {
    sheet: () => Relay.QL`
      fragment on Sheet {
        id,
        name,
        columnInfos {
          name
        }
        rows(first: 10, columns: $columns) {
          edges {
            node {
              id,
              ${SheetRow.getFragment('row')},
              data {
                key,
                value
              }
            }
          }
        }
      }
    `,
  },
});

