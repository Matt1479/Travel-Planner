const calendar = document.querySelector('div#calendar');
const modal = new bootstrap.Modal(document.getElementById('tripModal'));
const tripForm = document.querySelector('form#tripForm');
const deleteBtn = document.querySelector('button#delete');

const API_KEY = 'YOUR_API_KEY';
const TIME_WAIT = 1000;
let timeoutId = null;

document.getElementById('tripModal')
.addEventListener('hidden.bs.modal', () => {
    document.querySelector('label[for="weather"]').innerText = 'Weather';
    tripForm.reset();
});

function generateCalendar() {
    const date = new Date();
    const days = ["Monday", "Tuesday", "Wednesday",
        "Thursday", "Friday", "Saturday", "Sunday"];

    for (let i = 0; i < 7; i++) {
        const div = document.createElement('div');
        div.className = 'col day-box';
        div.dataset.date = `${date.getFullYear()}`
        + `-${String(date.getMonth()).padStart(2, '0')}`
        + `-${String(i + 1).padStart(2, '0')}`;

        div.innerHTML = `
        <div class="row">
            <div class="col">
                <string>${days[i]}</strong>
            </div>
        </div>`;

        div.addEventListener('click', openModal);
        calendar.appendChild(div);
    }
}

function openModal(event) {
    // Prevent the trigger of click event by the parent element
    event.stopPropagation();

    // If adding a new trip
    if (event.currentTarget.dataset.date) {
        document.getElementById('date').value = event.currentTarget.dataset.date;

        deleteBtn.hidden = true;
    } else {
        const id = event.currentTarget.dataset.id;
        const trip = store.getState().trips.find((t) => t.id === id);

        // Update trip form
        document.querySelector('input[type="hidden"][data-id]').dataset.id = id;
        document.getElementById('date').value = trip.date;
        document.querySelector('#country').value = trip.country;
        document.getElementById('city').value = trip.city;
        document.querySelector('#cost').value = trip.cost;
        document.querySelector('#weather').value = trip.weather;

        deleteBtn.dataset.id = id;
        deleteBtn.hidden = false;
    }

    modal.show();
}

// Upon submitting the tripForm, add new trip
tripForm.addEventListener('submit', function(event) {
    // Prevent default behavior (don't submit the form to the server)
    event.preventDefault();

    const id = document.querySelector('input[type="hidden"]').dataset.id;
    const trip = {
        id: id ? id : crypto.randomUUID(),
        date: document.getElementById('date').value,
        country: document.querySelector('#country').value,
        city: document.getElementById('city').value,
        cost: parseFloat(document.querySelector('#cost').value),
        weather: document.querySelector('#weather').value
    };

    store.dispatch(addTripAction(trip));
    updateUI();
    modal.hide();
    tripForm.reset();
});

deleteBtn.addEventListener('click', function(event) {
    if (deleteBtn.dataset.id) {
        store.dispatch(removeTripAction(deleteBtn.dataset.id));
    }

    modal.hide();
});

function updateUI() {
    const state = store.getState();

    // Update total cost
    document.querySelector('span#totalCost').textContent = state.totalCost;

    // Clear all trip info in calendar
    document.querySelectorAll('div.day-box').forEach((dayBox) => {
        const tripBoxes = dayBox.querySelectorAll('div.trip-box');
        if (tripBoxes) {
            tripBoxes.forEach((tripBox) => tripBox.remove());
        }
    });
    
    // Add trip info to corresponding day box
    state.trips.forEach((trip) => {
        const dayBox = document.querySelector(`.day-box[data-date='${trip.date}']`);
        if (dayBox) {
            const tripBox = document.createElement('div');
            tripBox.className = 'row trip-box m-1';
            tripBox.dataset.id = trip.id;

            tripBox.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h6 class="card-title mb-3">${trip.city}</h6>
                    <p>Country: ${trip.country}</p>
                    <p>Cost: ${trip.cost}</p>
                    <p>Date: ${trip.date}</p>
                    <p>Weather: ${trip.weather}</p>
                </div>
            </div>
            `;

            tripBox.addEventListener('click', openModal);
            dayBox.appendChild(tripBox);
        }
    });
}

async function getWeather(city, date, API_KEY) {
    try {
        const response = await fetch(
            `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q="${city}"&dt="${date}"`
        );
        const json_response = await response.json();
        
        // return json_response['forecast']['forecastday'][0]['day']['condition'];
        return json_response?.forecast?.forecastday?.at(0)?.day?.condition;
    } catch (error) {
        console.log("Error: ", error);
    }
}

document.querySelector('#city').addEventListener('keyup', (event) => {
    const country = document.querySelector('#country').value;
        const city = document.querySelector('#city').value;
        const cost = document.querySelector('#cost').value;
        const date = document.querySelector('#date').value;

        if (country && city && cost && date) {
            if (timeoutId) {
                window.clearTimeout(timeoutId);
                timeoutId = null;
            } else {
                // After 1 second...
                timeoutId = window.setTimeout(async () => {
                    // Get weather
                    const weather = await getWeather(city, date, API_KEY);  

                    if (weather) {
                        document.querySelector('label[for="weather"]').innerHTML = `
                        Weather: <img src=${weather.icon} width="40">
                        `;

                        // Fill with data
                        const weatherInput = document.querySelector('#weather');
                        weatherInput.value = weather.text;
                    }
                }, TIME_WAIT);
            }
    }
});

async function main() {
    generateCalendar();
    updateUI();

    store.subscribe(updateUI);
}

document.addEventListener('DOMContentLoaded', main);
