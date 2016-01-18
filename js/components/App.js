import React from 'react';
import Relay from 'react-relay';
import AppBar from 'material-ui/lib/app-bar';
import Paper from 'material-ui/lib/paper';
import {Table, Column, Cell} from 'fixed-data-table';

class App1 extends React.Component {
  render() {
    const paperStyle = {
      height: 100,
      width: 100,
      margin: 20,
      textAlign: 'center',
      display: 'inline-block',
    };

    return (
      <div>
        <AppBar title="hypersheet.io"/>
        <ul>
          {this.props.currentUser.sheets.edges.map(edge =>
            <li key={edge.node.id}>
              <Paper style={paperStyle} zDepth={2}>
                {edge.node.name}
              </Paper>
            </li>
          )}
        </ul>
      </div>
    );
  }
}

const rows = [
  ['a1', 'b1', 'c1'],
  ['a2', 'b2', 'c2'],
  ['a3', 'b3', 'c3'],
];

class App extends React.Component {
  render() {
    return (
      <div>
        <Table
          rowHeight={50}
          rowsCount={rows.length}
          width={500}
          height={500}
          headerHeight={50}>
          <Column
            header={<Cell>Col 1</Cell>}
            cell={<Cell>Column 1 static content</Cell>}
            width={200}
          />
          <Column
            header={<Cell>Col 2</Cell>}
            cell={<Cell mySpecialProp="column2" />}
            width={100}
          />
          <Column
            header={<Cell>Col 3</Cell>}
            cell={({rowIndex, ...props}) => (
              <Cell {...props}>
                Data for column 3: {rows[rowIndex][2]}
              </Cell>
            )}
            width={200}
          />
        </Table>
      </div>
    );
  }
}

export default Relay.createContainer(App, {
  fragments: {
    currentUser: () => Relay.QL`
      fragment on User {
        sheets(first: 10) {
          edges {
            node {
              id,
              name,
            },
          },
        },
      }
    `,
  },
});
