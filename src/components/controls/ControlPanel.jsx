import React, { Component } from 'react'

export default class ControlPanel extends Component {

  constructor(props) {
    super(props)
    this.state = {
      running:false
    }
  }
      
  toggleSimulation() {
    let event = (this.state.running) ? 'stop' : 'start'
    this.setState({running: !this.state.running})
    this.props.eventEmitter.emit(event)
    console.log()
  }
  

  render() {
    return (
      <div className="controls">
        <button onClick={() => {this.toggleSimulation()}}>{(this.state.running) ? 'stop' : 'start'}</button>
      </div>
    )
  }
}
