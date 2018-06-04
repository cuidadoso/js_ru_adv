import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Table, Column } from 'react-virtualized';
import 'react-virtualized/styles.css';

import {
  moduleName,
  fetchAll,
  eventListSelector,
  selectEvent
} from '../../ducks/events';
import Loader from '../common/Loader';

export class EventList extends Component {
  static defaultProps = {
    events: [],
    loading: false,
    fetchAll: () => {}
  };

  static propTypes = {
    // from connect
    events: PropTypes.array,
    loading: PropTypes.bool,
    fetchAll: PropTypes.func,
    selectEvent: PropTypes.func
  };

  handleRowClick = ({ rowData: { uid } }) => {
    const { selectEvent } = this.props;
    selectEvent && selectEvent(uid);
  };

  rowGetter = ({ index }) => {
    return this.props.events[index];
  };

  render() {
    const { loading, events } = this.props;
    if (loading) return <Loader />;
    return (
      <Table
        height={300}
        headerHeight={50}
        overscanRowCount={5}
        rowGetter={this.rowGetter}
        rowHeight={40}
        rowCount={events.length}
        width={700}
        onRowClick={this.handleRowClick}
      >
        <Column dataKey="title" label="title" width={300} />
        <Column dataKey="where" label="where" width={250} />
        <Column dataKey="month" label="when" width={150} />
      </Table>
    );
  }

  componentDidMount() {
    this.props.fetchAll();
  }
}

export default connect(
  (state) => ({
    events: eventListSelector(state),
    loading: state[moduleName].loading
  }),
  { fetchAll, selectEvent }
)(EventList);
