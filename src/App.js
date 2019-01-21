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
    // TMP STATE TO MODIFY TO SIMPLIFY UPDATING COMPONENT STATE
    this.elevator = this.state.elevator
    this.floors = this.state.floors

    this.elevatorQueue = []
  }

  /**
   * Original idea was to encapsulate elevator and floor behavior within their components
   * and emit events to tell parent to modify their state
   */
  componentWillMount() {
    this.eventEmitter = new EventEmitter()

    this.eventEmitter.addListener('start', () => {
      this.start()
    })

    this.eventEmitter.addListener('stop', () => {
      this.stop()
    })

    this.eventEmitter.addListener('elevator-stopped-at-floor', () => {
      this.elevator.moving = false
      this.ejectPassengersFromElevator()
      this.getPassengersInElevator()
      // TODO: fix bug causing queue to lose requests that are still valid
      this.elevatorQueue = this.elevatorQueue.filter((items) => {
        return items.floorNumber === this.elevator.currentFloor
      })
    })

    this.eventEmitter.addListener('elevator-passing-floor', ({floorNumber, direction}) => {
      let res = this.elevatorQueue.find(o => o.floorNumber === floorNumber)
      if(res !== undefined) {
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
    this.addPassengerToFloor()
    console.log(this.elevatorQueue)

    if(this.elevator.moving) {
      this.moveElevator()
    } else {
      if(this.elevator.targetFloor !== this.elevator.currentFloor) {
        // IF ELEVATOR HAS A DESTINATION SET IT MOVING
        this.elevator.moving = true
      } else if(this.elevatorQueue.length !== 0) {
        // ELSE IF ELEVATOR HAS QUEUED REQUESTS SET DESTINATION 
        let floorRequest = this.elevatorQueue.shift()
        this.elevator.targetFloor = floorRequest.floorNumber
        this.elevator.moving = true
      }
    }

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
  /**
   * RANDOMLY ADD A PASSENGER TO A FLOOR, GIVE IT A DIRECTION
   */
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
    if(this.elevatorQueue.indexOf({floorNumber:randomFloor, direction:randomDirection}) === -1) {
      this.elevatorQueue.push({floorNumber:randomFloor, direction:randomDirection})
    }
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
        max = this.floors.length-1
      } else {
        min = 0
        max = floorNumber-1
      }
      return _.random(min,max)
    })
    
    this.floors[floorNumber].passengers = []
    this.elevator.passengers = this.elevator.passengers.concat(boarding)

    _.each(boarding, (passenger) => {
      this.goToFloor(passenger, undefined)
    })
  }


  goToFloor(floorNumber, direction) {
    if(undefined === this.elevatorQueue.find(o => o.floorNumber === floorNumber && o.direction === direction)) {
      this.elevatorQueue.push({floorNumber:floorNumber, direction:direction})
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
