import React, { Component } from 'react';
import { Route } from 'react-router-dom';

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
    return (
      <div>
        <ProtectedRoute path="/admin" component={AdminPage} />
        <ProtectedRoute path="/person" component={PersonPage} />
        <ProtectedRoute path="/people" component={PeoplePage} />
        <ProtectedRoute path="/events" component={EventPage} />
        <Route path="/auth" component={AuthPage} />
      </div>
    );
  }
}

export default Root;
