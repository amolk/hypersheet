import Relay from 'react-relay';

export default class extends Relay.Route {
  static queries = {
    currentUser: () => Relay.QL`
      query {
        currentUser
      }
    `,
  };
  static routeName = 'AppHomeRoute';
}
