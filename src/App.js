import React, { Component } from 'react';
import { EventEmitter } from 'events';
import _ from 'lodash'

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
      framerate:1000,
      intervalId: undefined,
      floors: [
        this.floorCreator.create({floorNumber: 0}),
        this.floorCreator.create({floorNumber: 1}),
        this.floorCreator.create({floorNumber: 2}),
        this.floorCreator.create({floorNumber: 3}),
        this.floorCreator.create({floorNumber: 4}),
        this.floorCreator.create({floorNumber: 5}),
      ],
      elevator: this.elevatorCreator.create({floorCount: 6}),
    }
    this.floorButtonQueue = []
  }

  componentWillMount() {
    this.eventEmitter = new EventEmitter()

    this.eventEmitter.addListener('start', () => {
      this.start()
    })

    this.eventEmitter.addListener('stop', () => {
      this.stop()
    })

    this.eventEmitter.addListener('floor-button-pressed', ({floorNumber, direction}) => {
      // VALIDATE FLOOR BUTTON PRESSES
      if(this.floorButtonQueue.indexOf({floorNumber, direction}) === -1) {
        this.floorButtonQueue.push({floorNumber, direction})
      }
    })

    this.eventEmitter.addListener('elevator-stopped-at-floor', () => {
      this.ejectPassengersFromElevator()
      this.getPassengersInElevator()
    })

    // TODO: add passing-floor event

    // TODO: add elevator-button-pressed event
  }

  start() {
    this.setState({intervalId: setInterval(() => {this.update()}, this.state.framerate)})
  }

  stop() {
    clearInterval(this.state.intervalId)
  }

  update() {
    if(this.floorButtonQueue.length !== 0) {
      let floorRequest = this.floorButtonQueue.pop()
      this.goToFloor(floorRequest.floorNumber)
    }
    this.addPassengerToFloor()
  }

  addPassengerToFloor() {
    let randomFloor = Math.floor(Math.random() * this.state.floors.length)
    let randomDirection = ''
    if(randomFloor+1 === this.props.floorCount) {
      randomDirection = 'down'
    } else if (randomFloor === 0) {
      randomDirection = 'up'
    } else {
      randomDirection = (Math.random < 0.5) ? 'up' : 'down'
    }

    this.floors = this.state.floors
    this.floors[randomFloor].passengers.push(randomDirection)
    this.setState({
      floors: this.floors
    })

    this.eventEmitter.emit('floor-button-pressed', {floorNumber:randomFloor, direction:randomDirection})
  }

  ejectPassengersFromElevator() {
    let floorNumber = this.state.elevator.currentFloor
    let floors = this.state.floors
    let elevator = this.state.elevator

    let remaining = elevator.passengers.filter((passenger) => {
      return (passenger !== floorNumber)
    })
    let newDelivered = elevator.passengers.filter((passenger) => {
      return (passenger === floorNumber)
    })

    floors[floorNumber].delivered = floors[floorNumber].delivered.concat(newDelivered)
    elevator.passengers = remaining

    this.setState({
      floors: floors,
      elevator: elevator
    })
  }

  getPassengersInElevator() {
    let floorNumber = this.state.elevator.currentFloor
    let floors = this.state.floors
    let elevator = this.state.elevator

    let boarding = floors[floorNumber].passengers.map((direction) => {
      let min, max
      if(direction === 'up') {
        min = floorNumber+1
        max = floors.length
      } else {
        min = 0
        max = floorNumber-1
      }
      return _.random(min,max)
    })
    
    floors[floorNumber].passengers = []
    elevator.passengers = elevator.passengers.concat(boarding)
    this.setState({
      floors: floors,
      elevator: elevator
    })
  }

  goToFloor(floorNumber) {
    // TODO: move elevator state changes to loop() function and make this add requests to a queue handled in said loop
    this.elevator = this.state.elevator
    // TODO: move elevator floor by floor and call passing-floor event
    this.elevator.currentFloor = floorNumber
    this.setState({
      elevator: this.elevator
    })
    this.eventEmitter.emit('elevator-stopped-at-floor')
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
            <ControlPanel eventEmitter={this.eventEmitter} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
