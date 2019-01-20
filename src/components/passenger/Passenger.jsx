import React, { Component } from 'react'

export default class Passenger extends Component {
  render() {
    return (
        <i className={(this.props.delivered) ? "fas fa-male delivered" : "fas fa-male"}></i>
    )
  }
}
