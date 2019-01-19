import React, { Component } from 'react';
import './App.scss';
import Building from './components/building/Building';
import Floor from './components/floor/Floor';
import Elevator from './components/elevator/Elevator';

import FloorCreator from './library/floor.js' 
import ElevatorCreator from './library/elevator.js';

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      floors: [
        new FloorCreator(3),
        new FloorCreator(2),
        new FloorCreator(1),
      ],
      elevator: new ElevatorCreator(3)
    }
  }



  render() {
    return (
      <div className="App">
        <div className="world">
          <Building>
            {this.state.floors.map(floor => {
              return (<Floor key={floor.floorNumber} floor={floor} />)
            })} 
            <Elevator elevator={this.state.elevator}/>
          </Building>
        </div>
      </div>
    );
  }
}

export default App;
