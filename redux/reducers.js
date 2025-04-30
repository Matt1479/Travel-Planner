const initialState = {
    trips: [],
    totalCost: 0
};

// Adds some starter trips
const date = new Date();
let initialTrips = [
    {
        country: 'United Kingdom',
        city: 'London',
        date: `${date.getFullYear()}`
        + `-${String(date.getMonth()).padStart(2, '0')}`
        + `-${String(1).padStart(2, '0')}`,
        weather: 'Cloudy'
    },
    {
        country: 'Italy',
        city: 'Rome',
        date: `${date.getFullYear()}`
        + `-${String(date.getMonth()).padStart(2, '0')}`
        + `-${String(2).padStart(2, '0')}`,
        weather: 'Sunny'
    },
    {
        country: 'Spain',
        city: 'Madrid',
        date: `${date.getFullYear()}`
        + `-${String(date.getMonth()).padStart(2, '0')}`
        + `-${String(3).padStart(2, '0')}`,
        weather: 'Sunny'
    },
    {
        country: 'Morocco',
        city: 'Rabat',
        date: `${date.getFullYear()}`
        + `-${String(date.getMonth()).padStart(2, '0')}`
        + `-${String(3).padStart(2, '0')}`,
        weather: 'Sunny'
    },
    {
        country: 'Czech Republic',
        city: 'Prague',
        date: `${date.getFullYear()}`
        + `-${String(date.getMonth()).padStart(2, '0')}`
        + `-${String(4).padStart(2, '0')}`,
        weather: 'Windy'
    },
    {
        country: 'Thailand',
        city: 'Bangkok',
        date: `${date.getFullYear()}`
        + `-${String(date.getMonth()).padStart(2, '0')}`
        + `-${String(5).padStart(2, '0')}`,
        weather: 'Sunny'
    },
    {
        country: 'Egypt',
        city: 'Cairo',
        date: `${date.getFullYear()}`
        + `-${String(date.getMonth()).padStart(2, '0')}`
        + `-${String(5).padStart(2, '0')}`,
        weather: 'Sunny'
    },
    {
        country: 'Japan',
        city: 'Tokyo',
        date: `${date.getFullYear()}`
        + `-${String(date.getMonth()).padStart(2, '0')}`
        + `-${String(6).padStart(2, '0')}`,
        weather: 'Sunny'
    },
];
initialTrips = initialTrips.map((t, index) => {
    t.id = crypto.randomUUID();
    t.cost = 100 + Math.floor(Math.random() * 500) + index * 50;
    
    // Could use getRandomColorHex here...
    const limit = Math.pow(2, 24);
    do {
        t.backgroundColor = Math.floor(Math.random() * limit);
    }
    while (t.backgroundColor < (limit / 1.5));
    t.backgroundColor = '#' + t.backgroundColor.toString(16);

    return t;
});
initialState.trips = [...initialTrips];
initialState.totalCost = initialTrips.reduce((sum, trip) => sum + trip.cost, 0);

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
