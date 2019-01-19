import React, { Component } from 'react'

export default class Floor extends Component {
  render() {
    return (
      <div className="floor">
        {this.props.floor.number}
      </div>
    )
  }
}
