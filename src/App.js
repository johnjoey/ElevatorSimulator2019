import React, { Component } from 'react';
import { EventEmitter } from 'events';

import './App.scss';

import Building from './components/building/Building';
import Floor from './components/floor/Floor';
import Elevator from './components/elevator/Elevator';
import ControlPanel from './components/controls/ControlPanel';

import FloorCreator from './library/floor.js' 
import ElevatorCreator from './library/elevator.js';


class App extends Component {

  constructor(props) {
    super(props)

    this.elevatorCreator = new ElevatorCreator()
    this.floorCreator = new FloorCreator()
    

    this.state = {
      floors: [
        this.floorCreator.create({floorNumber: 0}),
        this.floorCreator.create({floorNumber: 1}),
        this.floorCreator.create({floorNumber: 2}),
      ],
      elevator: this.elevatorCreator.create({floorCount: 3})
    }
  }

  componentWillMount() {
    this.eventEmitter = new EventEmitter()

    this.eventEmitter.addListener('floor-button-pressed', ({floorNumber, direction}) => {
      this.addPassengerToFloor({floorNumber:floorNumber, direction: direction})
      this.goToFloor(floorNumber)
    })
  }

  addPassengerToFloor({floorNumber, direction}) {
    this.floors = this.state.floors
    this.floors[floorNumber].passengers.push(direction)
    this.setState({
      floors: this.floors
    })
  }

  goToFloor(floorNumber) {
    this.elevator = this.state.elevator
    this.elevator.currentFloor = floorNumber
    this.setState({
      elevator: this.elevator
    })
  }

  render() {
    return (
      <div className="App">
        <div className="world">
          <div className="world__inner">
            <Building>
              {this.state.floors.map(floor => {
                return (<Floor key={floor.floorNumber} floor={floor} />)
              })} 
              <Elevator elevator={this.state.elevator}/>
            </Building>
            <ControlPanel eventEmitter={this.eventEmitter} floorCount={this.state.floors.length}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
