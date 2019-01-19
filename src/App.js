import React, { Component } from 'react';
import './App.scss';
import Building from './components/building/Building';
import Floor from './components/floor/Floor';
import Elevator from './components/elevator/Elevator';

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      floors: [
        {number: 3, upButtonPressed: false, downButtonPressed: false},
        {number: 2, upButtonPressed: false, downButtonPressed: false},
        {number: 1, upButtonPressed: false, downButtonPressed: false},
      ],
      elevator: {
        currentFloor: 1, 
      }
    }
  }



  render() {
    return (
      <div className="App">
        <div className="world">
          <Building>
            {this.state.floors.map(floor => {
              return (<Floor key={floor.number} floor={floor} />)
            })}
            <Elevator/>
          </Building>
        </div>
      </div>
    );
  }
}

export default App;
