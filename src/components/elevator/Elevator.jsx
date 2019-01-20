import React, { Component } from 'react'

export default class Elevator extends Component {

    //TODO: add elevator doors that open and close
    //TODO: add ding
    //TODO: add direction arrows
    render() {
        return (
            <div style={{bottom: this.props.elevator.currentFloor*60+'px'}} className="elevator">
                {this.props.elevator.currentFloor}
            </div>
        )
    }
}
