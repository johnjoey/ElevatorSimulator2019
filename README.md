# Elevator Simulator 2019

This is an attempt at this elevator themed kata: [https://gist.github.com/mattflo/4669508] built using Reactjs

## 1. Breaking problem down
* an elevator responds to calls containing a source floor and direction
    * elevator.goToFloor(floorNumber: int)
    * app needs stack containing requests: {sourceFloor: int, direction: string}
    * need eventEmitted for "arrived-at-floor"
    * passengers popped of floor.passengers array and on to elevator.passengers array
* an elevator delivers passengers to requested floors
    * need second request queue for passengers on elevator
* an elevator doesn't respond immediately. consider options to simulate time
    * setTimeout() to begin with. Add animation if time allows
* elevator calls are queued not necessarily FIFO
    * need "passing-floor" event to allow app to check if either request queue contains a request for that floor so passengers can get on/off
* you may validate passenger floor requests
    * ignore dupplicate requests for both stacks
* you may implement current floor monitor
    * elevator.getCurrentFloor()?
* you may implement direction arrows
    * button compenents for each floor component
* you may implement doors (opening and closing)
* you may implement DING!
* there can be more than one elevator
    * come back to this last...


