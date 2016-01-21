import React from 'react';
import Relay from 'react-relay';

import SheetRow from './SheetRow';

class Sheet extends React.Component {
  render() {
    var {sheet} = this.props;

    return (
      <div>
        <h1>{sheet.name}</h1>

        <table>
          <tbody>
            {sheet.rows.edges.map(row => <SheetRow key={row.node.id} row={row.node} column='name'></SheetRow>)}
          </tbody>
        </table>
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
        rows(first: 10, columns: $columns) {
          edges {
            node {
              id,
              ${SheetRow.getFragment('row')}
            }
          }
        }
      }
    `,
  },
});

