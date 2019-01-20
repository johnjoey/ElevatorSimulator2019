class ElevatorCreator {
    create({floorCount}) {
        return {
            floorCount,
            currentFloor: 0,
            targetFloor: 0,
            moving:false,
            passengers: []
        }
    }
}

export default ElevatorCreator