import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { moduleName } from '../../ducks/auth';
import UnAuthorized from './UnAuthorized';

class ProtectedRoute extends Component {
  static defaultProps = {};

  static propTypes = {};

  state = {};

  renderProtected = (routeProps) => {
    const { component: ProtectedComponent, authorized } = this.props;
    return authorized ? (
      <ProtectedComponent {...routeProps} />
    ) : (
      <UnAuthorized />
    );
  };

  render() {
    const { component, ...rest } = this.props;
    return <Route {...rest} render={this.renderProtected} />;
  }
}

export default connect((state) => ({
  authorized: !!state[moduleName].user
}))(ProtectedRoute);
