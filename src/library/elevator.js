class ElevatorCreator {
    create({floorCount}) {
        return {
            floorCount,
            currentFloor: 0,
            passengers: []
        }
    }
}

export default ElevatorCreator