import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';

import { AuthPage, AdminPage, PersonPage } from './routes';
import ProtectedRoute from './common/ProtectedRoute';

class Root extends Component {
  static defaultProps = {};

  static propTypes = {};

  state = {};

  render() {
    return (
      <div>
        <ProtectedRoute path="/admin" component={AdminPage} />
        <Route path="/auth" component={AuthPage} />
        <Route path="/person" component={PersonPage} />
      </div>
    );
  }
}

export default Root;
