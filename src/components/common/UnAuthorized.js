import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class UnAuthorized extends Component {
  static defaultProps = {};

  static propTypes = {};

  state = {};

  render() {
    return (
      <div>
        <h1>
          Unauthorized, please <Link to="/auth/signin">Sign In</Link>
        </h1>
      </div>
    );
  }
}

export default UnAuthorized;
