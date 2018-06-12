import React, { Component } from 'react';
import { DragSource } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

class PersonCard extends Component {
  static propTypes = {};

  render() {
    const { person, style, connectDragSource, isDragging } = this.props;
    const dragStyle = {
      backgroundColor: isDragging ? 'grey' : 'white'
    };
    return (
      <div style={{ width: 200, height: 100, ...dragStyle, ...style }}>
        {connectDragSource(
          <h3>
            {person.firstName}&nbsp;{person.lastName}
          </h3>
        )}
        <p>{person.email}</p>
      </div>
    );
  }

  componentDidMount() {
    this.props.connectPreview(getEmptyImage());
  }
}

const spec = {
  beginDrag(props) {
    return {
      uid: props.person.uid
    };
  },
  endDrag(props, monitor) {
    const personUid = props.person.uid;
    const dropResult = monitor.getDropResult();
    const eventUid = dropResult && dropResult.eventUid;

    console.log('---', 'eventDrug', personUid, eventUid);
  }
};

const collect = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectPreview: connect.dragPreview(),
  isDragging: monitor.isDragging()
});

export default DragSource('person', spec, collect)(PersonCard);
