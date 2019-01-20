import React, { Component } from 'react'
import Passenger from '../passenger/Passenger';

export default class Floor extends Component {
  render() {
    return (
      <div className="floor">
        {this.props.floor.floorNumber}
        {this.props.floor.passengers.map((passenger, index) => {
            return (<Passenger key={index} identifier={passenger} />)
        })}
        {this.props.floor.delivered.map((passenger, index) => {
            return (<Passenger key={index} identifier={passenger} delivered={true}/>)
        })} 
      </div>
    )
  }
}
