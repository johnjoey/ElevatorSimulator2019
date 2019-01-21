# Elevator Simulator 2019

This is an attempt at this elevator themed kata: [https://gist.github.com/mattflo/4669508] built using Reactjs

## Getting started
* install nodejs
* download repo
* run `npm i`
* run `npm start`

##  Breaking problem down
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

## Issues with implementation
I initially thought Reactjs would be great for implementing this Kata, however due to my inexperience I ran into some unforseen issues:
* native react does not support changing complicated state well.
* all state had to be stored and changed in parent 
* Couldn't encapsulte behaviour within objects as any changes to state wouldn't trigger render(); defeating one of the main features of react
* The main App component because quite monolithic due to the above making it difficult keep track of elevator logic

I shot myself in the foot a little by choosing to build this in a framework I'm still getting to grips with. 


