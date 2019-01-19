import React, { Component } from 'react'

export default class ControlPanel extends Component {

  addPassengerToFloor() {
      let randomFloor = Math.floor(Math.random() * this.props.floorCount)
      let randomDirection = ''
      if(randomFloor+1 === this.props.floorCount) {
        randomDirection = 'down'
      } else if (randomFloor === 0) {
        randomDirection = 'up'
      } else {
        randomDirection = (Math.random < 0.5) ? 'up' : 'down'
      }
      
      this.props.eventEmitter.emit('floor-button-pressed', {floorNumber:randomFloor, direction:randomDirection})
  }  

  render() {
    return (
      <div className="controls">
        <button onClick={() => {this.addPassengerToFloor()}} >Add passenger</button>
      </div>
    )
  }
}
