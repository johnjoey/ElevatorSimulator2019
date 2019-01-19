import React, { Component } from 'react'

export default class Elevator extends Component {
    render() {
        return (
            <div style={{bottom: this.props.elevator.currentFloor*60+'px'}} className="elevator">
                {this.props.elevator.currentFloor}
            </div>
        )
    }
}
