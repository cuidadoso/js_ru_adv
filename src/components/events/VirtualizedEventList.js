import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Table, Column, InfiniteLoader } from 'react-virtualized';
import 'react-virtualized/styles.css';

import {
  moduleName,
  fetchLazy,
  eventListSelector,
  selectEvent
} from '../../ducks/events';
// import Loader from '../common/Loader';

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
    fetchLazy: PropTypes.func,
    selectEvent: PropTypes.func
  };

  handleRowClick = ({ rowData: { uid } }) => {
    const { selectEvent } = this.props;
    selectEvent && selectEvent(uid);
  };

  rowGetter = ({ index }) => {
    return this.props.events[index];
  };

  isRowLoaded = ({ index }) => index < this.props.events.length;

  loadMoreRows = () => {
    console.log('---', 'load more');
    this.props.fetchLazy();
  };

  render() {
    const { loaded, events } = this.props;
    // if (loading) return <Loader />;
    return (
      <InfiniteLoader
        isRowLoaded={this.isRowLoaded}
        loadMoreRows={this.loadMoreRows}
        rowCount={
          loaded ? this.props.events.length : this.props.events.length + 1
        }
      >
        {({ onRowsRendered, registerChild }) => (
          <Table
            ref={registerChild}
            height={300}
            headerHeight={50}
            overscanRowCount={5}
            rowGetter={this.rowGetter}
            rowHeight={40}
            rowCount={events.length}
            width={700}
            onRowClick={this.handleRowClick}
            onRowsRendered={onRowsRendered}
          >
            <Column dataKey="title" label="title" width={300} />
            <Column dataKey="where" label="where" width={250} />
            <Column dataKey="month" label="when" width={150} />
          </Table>
        )}
      </InfiniteLoader>
    );
  }

  componentDidMount() {
    this.props.fetchLazy();
  }
}

export default connect(
  (state) => ({
    events: eventListSelector(state),
    loading: state[moduleName].loading
  }),
  { fetchLazy, selectEvent }
)(EventList);
