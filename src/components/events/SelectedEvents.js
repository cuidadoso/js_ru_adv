import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { TransitionMotion, spring } from 'react-motion';

import { selectedEventsSelector } from '../../ducks/events';
import SelectedEventCard from './SelectedEventCard';

class SelectedEvents extends Component {
  static defaultProps = {
    // from connect
    events: PropTypes.object
  };

  static propTypes = {};

  state = {};

  willLeave = () => ({
    opacity: spring(0, { stiffness: 100 })
  });

  willEnter = () => ({
    opacity: 0
  });

  getStyles() {
    return this.props.events.map((event) => ({
      style: {
        opacity: spring(1, { stiffness: 50 })
      },
      key: event.uid,
      data: event
    }));
  }

  render() {
    return (
      <TransitionMotion
        styles={this.getStyles()}
        willLeave={this.willLeave}
        willEnter={this.willEnter}
      >
        {(interpolated) => (
          <div>
            {interpolated.map((config) => (
              <div style={config.style} key={config.key}>
                <SelectedEventCard event={config.data} />
              </div>
            ))}
          </div>
        )}
      </TransitionMotion>
    );
  }
}

export default connect((state) => ({
  events: selectedEventsSelector(state)
}))(SelectedEvents);
