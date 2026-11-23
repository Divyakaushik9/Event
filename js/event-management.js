// EVENT MANAGEMENT

let events = JSON.parse(
    localStorage.getItem("campusEvents")
) || [];

const eventForm = document.getElementById("eventForm");

const tableBody = document.getElementById("eventTableBody");

const searchInput = document.getElementById("searchInput");

const editIndex = document.getElementById("editIndex");


// SAVE DATA

function saveData() {

    localStorage.setItem(
        "campusEvents",
        JSON.stringify(events)
    );

}


// GET FACILITIES

function getFacilities(event) {

    let facilities = [];

    if (event.stalls) {
        facilities.push("Stalls");
    }

    if (event.competitions) {
        facilities.push("Competitions");
    }

    if (event.results) {
        facilities.push("Results");
    }

    if (event.volunteers) {
        facilities.push("Volunteers");
    }

    return facilities.length > 0
        ? facilities.join(", ")
        : "None";

}


// UPDATE STATISTICS

function updateStatistics() {

    document.getElementById("totalEvents").textContent =
        events.length;

    document.getElementById("competitionEvents").textContent =
        events.filter(event => event.competitions).length;

    document.getElementById("stallEvents").textContent =
        events.filter(event => event.stalls).length;

    document.getElementById("volunteerEvents").textContent =
        events.filter(event => event.volunteers).length;

}


// DISPLAY EVENTS

function displayEvents(data = events) {

    tableBody.innerHTML = "";

    updateStatistics();

    document.getElementById("emptyMessage").style.display =
        data.length === 0 ? "block" : "none";


    data.forEach(event => {

        const index = events.indexOf(event);

        const row = document.createElement("tr");


        const values = [
            index + 1,
            event.name,
            event.category,
            event.date,
            event.startTime + " - " + event.endTime,
            event.venue,
            getFacilities(event)
        ];


        values.forEach((value, cellIndex) => {

            const cell = document.createElement("td");

            cell.textContent = value;

            if (cellIndex === 2) {
                const category = document.createElement("span");
                category.textContent = value;
                category.className = "category";
                cell.textContent = "";
                cell.appendChild(category);
            }

            row.appendChild(cell);

        });


        // ACTION BUTTONS

        const actionCell = document.createElement("td");

        const editButton = document.createElement("button");

        editButton.textContent = "Edit";

        editButton.className = "action-btn edit-btn";

        editButton.addEventListener("click", function() {
            editEvent(index);
        });


        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";

        deleteButton.className = "action-btn delete-btn";

        deleteButton.addEventListener("click", function() {
            deleteEvent(index);
        });


        actionCell.appendChild(editButton);

        actionCell.appendChild(deleteButton);

        row.appendChild(actionCell);

        tableBody.appendChild(row);

    });

}


// ADD / UPDATE EVENT

eventForm.addEventListener("submit", function(event) {

    event.preventDefault();


    const name = document.getElementById("eventName").value.trim();

    const category = document.getElementById("category").value;

    const date = document.getElementById("eventDate").value;

    const venue = document.getElementById("venue").value.trim();

    const startTime = document.getElementById("startTime").value;

    const endTime = document.getElementById("endTime").value;

    const description = document.getElementById("description").value.trim();


    const stalls = document.getElementById("stalls").checked;

    const competitions = document.getElementById("competitions").checked;

    const results = document.getElementById("results").checked;

    const volunteers = document.getElementById("volunteers").checked;


    if (startTime >= endTime) {

        alert("End time must be later than start time.");

        return;

    }


    const currentIndex = editIndex.value;


    const duplicate = events.some((existingEvent, index) => {

        return existingEvent.name.toLowerCase() === name.toLowerCase() &&
               existingEvent.date === date &&
               index !== Number(currentIndex);

    });


    if (duplicate) {

        alert("An event with this name and date already exists.");

        return;

    }


    const newEvent = {

        name: name,
        category: category,
        date: date,
        venue: venue,
        startTime: startTime,
        endTime: endTime,
        description: description,
        stalls: stalls,
        competitions: competitions,
        results: results,
        volunteers: volunteers

    };


    if (currentIndex === "") {

        events.push(newEvent);

        alert("Event created successfully!");

    } else {

        events[Number(currentIndex)] = newEvent;

        alert("Event updated successfully!");

    }


    saveData();

    displayEvents();

    resetForm();

});


// EDIT EVENT

function editEvent(index) {

    const event = events[index];

    document.getElementById("eventName").value = event.name;

    document.getElementById("category").value = event.category;

    document.getElementById("eventDate").value = event.date;

    document.getElementById("venue").value = event.venue;

    document.getElementById("startTime").value = event.startTime;

    document.getElementById("endTime").value = event.endTime;

    document.getElementById("description").value = event.description;

    document.getElementById("stalls").checked = event.stalls;

    document.getElementById("competitions").checked = event.competitions;

    document.getElementById("results").checked = event.results;

    document.getElementById("volunteers").checked = event.volunteers;


    editIndex.value = index;

    document.getElementById("formHeading").textContent =
        "Update Event Details";

    document.getElementById("submitBtn").textContent =
        "Update Event";


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// DELETE EVENT

function deleteEvent(index) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this event?"
    );

    if (confirmDelete) {

        events.splice(index, 1);

        saveData();

        displayEvents();

        resetForm();

        alert("Event deleted successfully!");

    }

}


// RESET FORM

function resetForm() {

    eventForm.reset();

    editIndex.value = "";

    document.getElementById("formHeading").textContent =
        "Create New Event";

    document.getElementById("submitBtn").textContent =
        "+ Create Event";

}


// CLEAR FORM BUTTON

document.getElementById("resetBtn").addEventListener("click", function() {

    resetForm();

});


// SEARCH EVENTS

searchInput.addEventListener("input", function() {

    const searchValue = this.value.toLowerCase();

    const filteredEvents = events.filter(event => {

        return event.name.toLowerCase().includes(searchValue) ||
               event.category.toLowerCase().includes(searchValue) ||
               event.venue.toLowerCase().includes(searchValue);

    });

    displayEvents(filteredEvents);

});


// INITIAL DISPLAY

displayEvents();

window.addEventListener("campusdatachange", function(event) {
    if (event.detail.key !== "campusEvents") {
        return;
    }

    events = JSON.parse(localStorage.getItem("campusEvents") || "[]");
    displayEvents();
});