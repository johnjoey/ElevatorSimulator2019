import React, { Component } from 'react'
import Passenger from '../passenger/Passenger';

export default class Elevator extends Component {

    //TODO: add elevator doors that open and close
    //TODO: add ding
    //TODO: add direction arrows
    render() {
        return (
            <div style={{bottom: this.props.elevator.currentFloor*60+'px'}} className="elevator">
                {this.props.elevator.passengers.map((passenger, index) => {
                    return (<Passenger key={index} identifier={passenger}/>)
                })}
            </div>
        )
    }
}
