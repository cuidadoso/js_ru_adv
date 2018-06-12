import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { personSelector } from '../../ducks/people';

class PersonCardDragPreview extends Component {
  static defaultProps = {};

  static propTypes = {};

  state = {};

  render() {
    return (
      <div>
        <h1>{this.props.person.firstName}</h1>
      </div>
    );
  }
}

export default connect((state, props) => ({
  person: personSelector(state, props)
}))(PersonCardDragPreview);
