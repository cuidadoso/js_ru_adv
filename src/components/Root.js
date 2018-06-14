import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Link } from 'react-router-dom';
import CustomDragLayer from './CustomDrugLayer';

import { moduleName, signOut } from '../ducks/auth';

import {
  AuthPage,
  AdminPage,
  EventPage,
  PersonPage,
  PeoplePage
} from './routes';
import ProtectedRoute from './common/ProtectedRoute';

class Root extends Component {
  render() {
    const { signOut, signIn } = this.props;
    const btn = signIn ? (
      <button onClick={signOut}>Sign out</button>
    ) : (
      <Link to="/auth/signin">Sign in</Link>
    );
    return (
      <div>
        {btn}
        <ul>
          <li>
            <Link to={'/admin'}>admin</Link>
          </li>
          <li>
            <Link to={'/people'}>people</Link>
          </li>
          <li>
            <Link to={'/events'}>events</Link>
          </li>
        </ul>
        <CustomDragLayer />
        <ProtectedRoute path="/admin" component={AdminPage} />
        <ProtectedRoute path="/person" component={PersonPage} />
        <ProtectedRoute path="/people" component={PeoplePage} />
        <ProtectedRoute path="/events" component={EventPage} />
        <Route path="/auth" component={AuthPage} />
      </div>
    );
  }
}

export default connect(
  (state) => ({
    signedIn: !!state[moduleName].user
  }),
  { signOut },
  null,
  { pure: false }
)(Root);
