import React, { Component } from 'react'

export default class Building extends Component {
  render() {
    return (
      <div id="building">
        {this.props.children}
      </div>
    )
  }
}
