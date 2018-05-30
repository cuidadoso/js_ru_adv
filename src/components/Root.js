import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';

import { AuthPage, AdminPage } from './routes';

class Root extends Component {
  static defaultProps = {};

  static propTypes = {};

  state = {};

  render() {
    return (
      <div>
        <Route path="/admin" component={AdminPage} />
        <Route path="/auth" component={AuthPage} />
      </div>
    );
  }
}

export default Root;
