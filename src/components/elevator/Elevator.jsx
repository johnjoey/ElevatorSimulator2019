import React, { Component } from 'react'
import Passenger from '../passenger/Passenger';

export default class Elevator extends Component {

    //TODO: add elevator doors that open and close
    //TODO: add ding

    render() {
        let ding = (this.props.elevator.moving) ? "" : <div className="ding">DING</div>
        return (
            <div style={{bottom: this.props.elevator.currentFloor*60+'px'}} className="elevator">
                {this.props.elevator.passengers.map((passenger, index) => {
                    return (<Passenger key={index} identifier={passenger}/>)
                })}
                <div className={(this.props.elevator.moving) ? "door door--left" : "door door--left open"}></div>
                <div className={(this.props.elevator.moving) ? "door door--right" : "door door--right open"}></div>
                {ding}
            </div>
        )
    }
}
