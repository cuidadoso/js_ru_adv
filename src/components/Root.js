import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';

import { AuthPage, AdminPage, EventPage, PersonPage } from './routes';
import ProtectedRoute from './common/ProtectedRoute';

class Root extends Component {
  static defaultProps = {};

  static propTypes = {};

  state = {};

  render() {
    return (
      <div>
        <ProtectedRoute path="/admin" component={AdminPage} />
        <ProtectedRoute path="/person" component={PersonPage} />
        <ProtectedRoute path="/events" component={EventPage} />
        <Route path="/auth" component={AuthPage} />
      </div>
    );
  }
}

export default Root;
