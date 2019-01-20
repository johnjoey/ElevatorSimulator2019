class FloorCreator {
    create({floorNumber}) {
        return {
            floorNumber,
            passengers: [],
            delivered: [],
            upButton: false,
            downButton: false
        }
    }
}

export default FloorCreator