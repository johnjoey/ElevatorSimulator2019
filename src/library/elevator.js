class ElevatorCreator {
    create({floorCount}) {
        return {
            floorCount,
            currentFloor: 0
        }
    }
}

export default ElevatorCreator