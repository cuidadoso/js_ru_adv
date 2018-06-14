import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import { connect } from 'react-redux';
import { deleteEvent, stateSelector } from '../../ducks/events';
import Loader from '../common/Loader';

class Trash extends Component {
  static propTypes = {
    // from connect
    loading: PropTypes.bool,
    deleteEvent: PropTypes.func,
    // from collect for dragging
    isOver: PropTypes.bool,
    connectDropTarget: PropTypes.func
  };

  render() {
    const { connectDropTarget, isOver, loading } = this.props;
    const style = {
      border: `1px solid ${isOver ? 'green' : 'black'}`,
      width: 100,
      height: 100,
      position: 'fixed',
      top: 0,
      right: 0
    };
    return connectDropTarget(
      <div style={{ ...style }}>
        Trash
        {loading && <Loader />}
      </div>
    );
  }
}

const collect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver()
});

const spec = {
  drop(props, monitor) {
    const item = monitor.getItem();
    props.deleteEvent(item.uid);
  }
};

export default connect(
  (state) => ({
    loading: stateSelector(state).loading
  }),
  { deleteEvent }
)(DropTarget('event', spec, collect)(Trash));
