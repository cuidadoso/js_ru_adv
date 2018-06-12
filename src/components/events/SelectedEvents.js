import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { selectedEventsSelector } from '../../ducks/events';
import SelectedEventCard from './SelectedEventCard';

class SelectedEvents extends Component {
  static defaultProps = {
    // from connect
    events: PropTypes.object
  };

  static propTypes = {};

  state = {};

  render() {
    return (
      <div>
        {this.props.events.map((event) => (
          <SelectedEventCard event={event} key={event.uid} />
        ))}
      </div>
    );
  }
}

export default connect((state) => ({
  events: selectedEventsSelector(state)
}))(SelectedEvents);
