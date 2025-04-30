const ADD_TRIP = 'ADD_TRIP';
const REMOVE_TRIP = 'REMOVE_TRIP';

function addTripAction(trip) {
    return {
        type: ADD_TRIP,
        payload: trip
    };
}

function removeTripAction(id) {
    return {
        type: REMOVE_TRIP,
        payload: id
    };
}
