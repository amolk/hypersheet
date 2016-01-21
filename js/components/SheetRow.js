import React from 'react';
import Relay from 'react-relay';

import SheetRowCell from './SheetRowCell';

class SheetRow extends React.Component {
  render() {
    var {row} = this.props;

    return (
      <tr>
        {row.data.map(datum => <SheetRowCell datum={datum} />)}
      </tr>
    )
  }
}

export default Relay.createContainer(SheetRow, {
  fragments: {
    row: () => Relay.QL`
      fragment on SheetRow {
        data {
          key,
          value
        },
      }
    `,
  },
});
