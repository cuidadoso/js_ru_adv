import React, { Component } from 'react';
import PropTypes from 'prop-types';

import EventList from '../events/EventList';

class EventPage extends Component {
  static defaultProps = {};

  static propTypes = {};

  state = {};

  render() {
    return (
      <div>
        <h1>Events page</h1>
        <EventList />
      </div>
    );
  }
}

export default EventPage;
