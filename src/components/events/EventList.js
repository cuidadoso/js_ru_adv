import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { moduleName, fetchAll } from '../../ducks/events';

class EventList extends Component {
  static defaultProps = {};

  static propTypes = {
    // from connect
    events: PropTypes.object,
    fetchAll: PropTypes.func.isRequired
  };

  state = {};

  render() {
    console.log('---', this.props.events);
    return <div />;
  }

  componentDidMount() {
    this.props.fetchAll();
  }
}

export default connect(
  (state) => ({
    events: state[moduleName].entities
  }),
  { fetchAll }
)(EventList);
