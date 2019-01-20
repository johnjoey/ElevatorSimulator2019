import React, { Component } from 'react'
import Passenger from '../passenger/Passenger';

export default class Floor extends Component {

  

  render() {
    let delivered = [];
    for(var i = 0; i < this.props.floor.delivered; i++) {
      delivered.push(<i key={i} className="fas fa-male delivered"></i>)
    }
    return (
      <div className="floor">
        {this.props.floor.floorNumber}
        {this.props.floor.passengers.map((passenger, index) => {
            return (<Passenger key={index}/>)
        })}
        {delivered}
      </div>
    )
  }
}
