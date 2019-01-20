import React, { Component } from 'react'

export default class Passenger extends Component {
  render() {
    return (
      <div className={(this.props.delivered) ? "passenger delivered" : "passenger"}>
        <span>{this.props.identifier}</span>
        <i className="fas fa-male"></i>
      </div> 
    )
  }
}
