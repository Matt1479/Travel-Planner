const initialState = {
    trips: [],
    totalCost: 0
};

function tripReducer(state=initialState, action) {
    switch (action.type) {
        case ADD_TRIP:
            const newTrips = [...state.trips, action.payload];
            const newCost = newTrips.reduce((sum, trip) => sum + trip.cost, 0);
            return {
                trips: newTrips,
                totalCost: newCost
            };
        
        default:
            return state;
    }
}
