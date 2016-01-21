import React from 'react';
import Relay from 'react-relay';

export default class SheetRowCell extends React.Component {
  render() {
    var {datum} = this.props;

    return (
      <td>
        {datum.key} = {datum.value}
      </td>
    )
  }
}
