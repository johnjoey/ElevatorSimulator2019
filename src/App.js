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
    this.elevator = this.state.elevator
    this.floors = this.state.floors
    this.elevatorQueue = []
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
      if(this.elevatorQueue.indexOf({floorNumber, direction}) === -1) {
        this.elevatorQueue.push({floorNumber, direction})
      }
    })

    this.eventEmitter.addListener('elevator-stopped-at-floor', () => {
      this.elevator.moving = false
      this.ejectPassengersFromElevator()
      this.getPassengersInElevator()
    })

    this.eventEmitter.addListener('elevator-passing-floor', ({floorNumber, direction}) => {
      if(this.elevatorQueue.indexOf({floorNumber, direction}) === -1) {
        this.eventEmitter.emit('elevator-stopped-at-floor')
      }
    })
  }

  start() {
    this.setState({intervalId: setInterval(() => {this.update()}, this.state.framerate)})
  }

  stop() {
    clearInterval(this.state.intervalId)
  }

  update() {
    // FIRST, ACT UPON STATE CHANGED IN PREVIOUS "FRAME"
    if(!this.elevator.moving) {
      if(this.elevator.targetFloor !== this.elevator.currentFloor) {
        this.elevator.moving = true
        this.moveElevator()
      } else if(this.elevatorQueue.length !== 0) {
        let floorRequest = this.elevatorQueue.pop()
        this.elevator.targetFloor = floorRequest.floorNumber
        this.elevator.moving = true
        this.moveElevator()
      }
    }

    this.moveElevator()
    this.addPassengerToFloor()

    // THEN, UPDATE STATE WITH CHANGES FROM THIS FRAME
    this.setState({
      elevator: this.elevator,
      floors: this.floors
    })
  }

  moveElevator() {
    if(this.elevator.moving) {
      if(this.elevator.targetFloor > this.elevator.currentFloor) {
        this.elevator.currentFloor++
        this.eventEmitter.emit('elevator-passing-floor', {floorNumber:this.elevator.currentFloor})
      } else if(this.elevator.targetFloor < this.elevator.currentFloor) {
        this.elevator.currentFloor--
        this.eventEmitter.emit('elevator-passing-floor', {floorNumber:this.elevator.currentFloor})
      } else {
        this.eventEmitter.emit('elevator-stopped-at-floor')
      }
    }
  }

  addPassengerToFloor() {
    let randomFloor = Math.floor(Math.random() * this.floors.length)
    let randomDirection = ''
    if(randomFloor+1 === this.floors.length) {
      randomDirection = 'down'
    } else if (randomFloor === 0) {
      randomDirection = 'up'
    } else {
      randomDirection = (Math.random() > 0.5) ? 'down' : 'up'
    }
  
    this.floors[randomFloor].passengers.push(randomDirection)

    this.eventEmitter.emit('floor-button-pressed', {floorNumber:randomFloor, direction:randomDirection})
  }

  ejectPassengersFromElevator() {
    let floorNumber = this.state.elevator.currentFloor

    let remaining = this.elevator.passengers.filter((passenger) => {
      return (passenger !== floorNumber)
    })
    let newDelivered = this.elevator.passengers.filter((passenger) => {
      return (passenger === floorNumber)
    })

    this.floors[floorNumber].delivered = this.floors[floorNumber].delivered.concat(newDelivered)
    this.elevator.passengers = remaining
  }

  getPassengersInElevator() {
    let floorNumber = this.state.elevator.currentFloor

    let boarding = this.floors[floorNumber].passengers.map((direction) => {
      let min, max
      if(direction === 'up') {
        min = floorNumber+1
        max = this.floors.length
      } else {
        min = 0
        max = floorNumber-1
      }
      return _.random(min,max)
    })
    
    this.floors[floorNumber].passengers = []
    this.elevator.passengers = this.elevator.passengers.concat(boarding)

    _.each(boarding, (passenger) => {
      this.goToFloor(passenger)
    })
  }

  goToFloor(floorNumber) {
    // TODO: move elevator state changes to loop() function and make this add requests to a queue handled in said loop
    // TODO: move elevator floor by floor and call passing-floor event
    if(this.elevatorQueue.indexOf({floorNumber}) === -1) {
      this.elevatorQueue.push({floorNumber, undefined})
    }
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
