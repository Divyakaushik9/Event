const STORAGE_KEY = "campusCompetitions";

let competitions = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// Demo competitions
if (competitions.length === 0) {

    competitions = [
        {
            id: 1,
            name: "Singing Competition",
            category: "Singing",
            eventName: "Annual Cultural Fest",
            date: "2026-11-15",
            venue: "Main Auditorium",
            maxParticipants: 50,
            registeredParticipants: 32,
            status: "Upcoming",
            firstWinner: "",
            secondWinner: "",
            thirdWinner: ""
        },
        {
            id: 2,
            name: "Coding Challenge",
            category: "Coding",
            eventName: "Technical Workshop",
            date: "2026-11-18",
            venue: "Computer Lab",
            maxParticipants: 40,
            registeredParticipants: 40,
            status: "Active",
            firstWinner: "",
            secondWinner: "",
            thirdWinner: ""
        },
        {
            id: 3,
            name: "Quiz Competition",
            category: "Quiz",
            eventName: "Annual Cultural Fest",
            date: "2026-10-20",
            venue: "Seminar Hall",
            maxParticipants: 30,
            registeredParticipants: 25,
            status: "Completed",
            firstWinner: "Rahul Sharma",
            secondWinner: "Priya Verma",
            thirdWinner: "Aman Kumar"
        }
    ];

    saveData();
}

// Save data
function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(competitions));
}

// HTML elements
const competitionModal = document.getElementById("competitionModal");
const competitionForm = document.getElementById("competitionForm");
const tableBody = document.getElementById("competitionTableBody");
const searchInput = document.getElementById("searchInput");
const eventSelect = document.getElementById("eventName");

// Load events from Event Management
function loadEvents() {

    eventSelect.innerHTML = "";

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Select Event";

    eventSelect.appendChild(defaultOption);

    const savedEvents =
        JSON.parse(localStorage.getItem("campusEvents")) || [];

    const eventNames = savedEvents.length > 0
        ? savedEvents.map(event => event.name)
        : [
            "Annual Cultural Fest",
            "Technical Workshop",
            "Sports Competition"
        ];

    eventNames.forEach(name => {

        const option = document.createElement("option");

        option.value = name;
        option.textContent = name;

        eventSelect.appendChild(option);
    });
}

// Statistics
function updateStatistics() {

    document.getElementById("totalCompetitions").textContent =
        competitions.length;

    document.getElementById("activeCompetitions").textContent =
        competitions.filter(item => item.status === "Active").length;

    document.getElementById("completedCompetitions").textContent =
        competitions.filter(item => item.status === "Completed").length;

    document.getElementById("totalParticipants").textContent =
        competitions.reduce(
            (total, item) => total + Number(item.registeredParticipants),
            0
        );
}

// Create table cell
function createCell(row, value) {

    const cell = document.createElement("td");
    cell.textContent = value || "-";

    row.appendChild(cell);

    return cell;
}

// Create button
function createButton(text, className, action) {

    const button = document.createElement("button");

    button.type = "button";
    button.textContent = text;
    button.className = className;

    button.addEventListener("click", action);

    return button;
}

// Display competitions
function displayCompetitions(data = competitions) {

    tableBody.replaceChildren();

    document.getElementById("emptyMessage").style.display =
        data.length === 0 ? "block" : "none";

    data.forEach(item => {

        const row = document.createElement("tr");

        createCell(row, item.id);
        createCell(row, item.name);
        createCell(row, item.category);
        createCell(row, item.eventName);
        createCell(row, item.date);

        createCell(
            row,
            `${item.registeredParticipants}/${item.maxParticipants}`
        );

        // Status
        const statusCell = document.createElement("td");
        const statusBadge = document.createElement("span");

        statusBadge.className = "status " + item.status;
        statusBadge.textContent = item.status;

        statusCell.appendChild(statusBadge);
        row.appendChild(statusCell);

        // Results
        const resultCell = document.createElement("td");
        const resultText = document.createElement("div");

        resultText.className = "result-text";

        resultText.textContent =
            `🥇 ${item.firstWinner || "-"}\n` +
            `🥈 ${item.secondWinner || "-"}\n` +
            `🥉 ${item.thirdWinner || "-"}`;

        resultCell.appendChild(resultText);
        row.appendChild(resultCell);

        // Actions
        const actionCell = document.createElement("td");

        const editButton = createButton(
            "Edit",
            "action-btn edit-btn",
            () => editCompetition(item.id)
        );

        const resultButton = createButton(
            "Results",
            "action-btn result-btn",
            () => manageResults(item.id)
        );

        const deleteButton = createButton(
            "Delete",
            "action-btn delete-btn",
            () => deleteCompetition(item.id)
        );

        actionCell.append(editButton, resultButton, deleteButton);

        row.appendChild(actionCell);

        tableBody.appendChild(row);
    });

    updateStatistics();
}

// Open modal
function openModal() {

    loadEvents();

    competitionForm.reset();

    document.getElementById("competitionId").value = "";

    document.getElementById("registeredParticipants").value = 0;

    document.getElementById("modalTitle").textContent =
        "Add Competition";

    competitionModal.style.display = "flex";
}

// Close modal
function closeModal() {
    competitionModal.style.display = "none";
}

document.getElementById("addCompetitionBtn")
    .addEventListener("click", openModal);

document.getElementById("closeModal")
    .addEventListener("click", closeModal);

document.getElementById("cancelBtn")
    .addEventListener("click", closeModal);

// Edit competition
function editCompetition(id) {

    const item = competitions.find(comp => comp.id === id);

    if (!item) return;

    loadEvents();

    document.getElementById("competitionId").value = item.id;
    document.getElementById("competitionName").value = item.name;
    document.getElementById("competitionCategory").value = item.category;
    document.getElementById("eventName").value = item.eventName;
    document.getElementById("competitionDate").value = item.date;
    document.getElementById("competitionVenue").value = item.venue;
    document.getElementById("maxParticipants").value = item.maxParticipants;
    document.getElementById("registeredParticipants").value =
        item.registeredParticipants;

    document.getElementById("competitionStatus").value = item.status;
    document.getElementById("firstWinner").value = item.firstWinner;
    document.getElementById("secondWinner").value = item.secondWinner;
    document.getElementById("thirdWinner").value = item.thirdWinner;

    document.getElementById("modalTitle").textContent =
        "Edit Competition";

    competitionModal.style.display = "flex";
}

// Add or update competition
competitionForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const id = document.getElementById("competitionId").value;

    const maxParticipants =
        Number(document.getElementById("maxParticipants").value);

    const registeredParticipants =
        Number(document.getElementById("registeredParticipants").value);

    if (registeredParticipants > maxParticipants) {
        alert("Registered participants cannot exceed maximum participants.");
        return;
    }

    const competition = {

        id: id ? Number(id) : Date.now(),

        name: document.getElementById("competitionName").value.trim(),

        category: document.getElementById("competitionCategory").value,

        eventName: document.getElementById("eventName").value,

        date: document.getElementById("competitionDate").value,

        venue: document.getElementById("competitionVenue").value.trim(),

        maxParticipants: maxParticipants,

        registeredParticipants: registeredParticipants,

        status: document.getElementById("competitionStatus").value,

        firstWinner: document.getElementById("firstWinner").value.trim(),

        secondWinner: document.getElementById("secondWinner").value.trim(),

        thirdWinner: document.getElementById("thirdWinner").value.trim()
    };

    // Check duplicate competition name for same event and date
    const duplicate = competitions.some(item =>
        item.id !== competition.id &&
        item.name.toLowerCase() === competition.name.toLowerCase() &&
        item.eventName === competition.eventName &&
        item.date === competition.date
    );

    if (duplicate) {
        alert("This competition already exists for the selected event and date.");
        return;
    }

    if (id) {

        const index = competitions.findIndex(
            item => item.id === Number(id)
        );

        if (index !== -1) {
            competitions[index] = competition;
        }

    } else {

        competitions.push(competition);
    }

    saveData();
    displayCompetitions();
    closeModal();

    alert(id
        ? "Competition updated successfully!"
        : "Competition added successfully!"
    );
});

// Manage results
function manageResults(id) {

    const item = competitions.find(comp => comp.id === id);

    if (!item) return;

    editCompetition(id);

    document.getElementById("modalTitle").textContent =
        "Manage Competition Results";
}

// Delete competition
function deleteCompetition(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this competition?"
    );

    if (!confirmDelete) return;

    competitions = competitions.filter(item => item.id !== id);

    saveData();
    displayCompetitions();
}

// Search
searchInput.addEventListener("input", function() {

    const searchValue = this.value.toLowerCase();

    const filteredData = competitions.filter(item =>

        item.name.toLowerCase().includes(searchValue) ||
        item.category.toLowerCase().includes(searchValue) ||
        item.eventName.toLowerCase().includes(searchValue) ||
        item.status.toLowerCase().includes(searchValue)
    );

    displayCompetitions(filteredData);
});

// Initial display
loadEvents();
displayCompetitions();