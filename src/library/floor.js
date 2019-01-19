class FloorCreator {
    create({floorNumber}) {
        return {
            floorNumber,
            passengers: [],
            upButton: false,
            downButton: false
        }
    }
}

export default FloorCreator