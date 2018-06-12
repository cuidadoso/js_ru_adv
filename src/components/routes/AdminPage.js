import React, { Component } from 'react';
import PeopleList from '../people/PeopleList';
import EventTable from '../events/VirtualizedEventList';
import SelectedEvents from '../events/SelectedEvents';

class AdminPage extends Component {
  render() {
    return (
      <div>
        <h3>Admin page</h3>
        <PeopleList />
        <SelectedEvents />
        <EventTable />
      </div>
    );
  }
}

export default AdminPage;
