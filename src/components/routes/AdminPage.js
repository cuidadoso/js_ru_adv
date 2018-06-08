import React, { Component } from 'react';
import PeopleList from '../people/PeopleList';

class AdminPage extends Component {
  render() {
    return (
      <div>
        <h3>Admin page</h3>
        <PeopleList />
      </div>
    );
  }
}

export default AdminPage;
