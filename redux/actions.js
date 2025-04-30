const ADD_TRIP = 'ADD_TRIP';

function addTripAction(trip) {
    return {
        type: ADD_TRIP,
        payload: trip
    };
}
