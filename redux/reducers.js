const initialState = {
    trips: [],
    totalCost: 0
};

function tripReducer(state=initialState, action) {
    switch (action.type) {
        case ADD_TRIP:
            // Replace trip with the same id if it exists
            const existingIndex = state.trips.findIndex((trip) => trip.id === action.payload.id);
            let updatedTrips;

            if (existingIndex !== -1) {
                updatedTrips = [...state.trips];
                updatedTrips[existingIndex] = action.payload;
            } else {
                updatedTrips = [...state.trips, action.payload];
            }
            
            const totalCost = updatedTrips.reduce((sum, trip) => sum + trip.cost, 0);
            
            return {
                ...state,
                trips: updatedTrips,
                totalCost: totalCost
            };
        
        case REMOVE_TRIP:
            let trips = state.trips.filter((t) => t.id !== action.payload);

            return {
                ...state,
                trips: trips,
                totalCost: trips.reduce((sum, trip) => sum + trip.cost, 0)
            }
        
        default:
            return state;
    }
}
