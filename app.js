const calendar = document.querySelector('div#calendar');
const modal = new bootstrap.Modal(document.getElementById('tripModal'));
const tripForm = document.querySelector('form#tripForm');

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
    const date = event.currentTarget.dataset.date;
    document.getElementById('date').value = date;
    
    modal.show();
}

// Upon submitting the tripForm, add new trip
tripForm.addEventListener('submit', function(event) {
    // Prevent default behavior (don't submit the form to the server)
    event.preventDefault();

    const trip = {
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

function updateUI() {
    const state = store.getState();
    document.querySelector('span#totalCost').textContent = state.totalCost;

    console.log(state.trips);
}

function main() {
    generateCalendar();
}

document.addEventListener('DOMContentLoaded', main);
