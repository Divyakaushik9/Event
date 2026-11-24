const STORAGE_KEY = "campusFeedback";

let feedbackList = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// Demo feedback
if (feedbackList.length === 0) {

    feedbackList = [
        {
            id: 1,
            studentName: "Rahul Sharma",
            eventName: "Annual Cultural Fest",
            rating: 5,
            comment: "The event was amazing. I enjoyed all the activities.",
            date: "2026-10-20",
            status: "Pending"
        },
        {
            id: 2,
            studentName: "Priya Verma",
            eventName: "Technical Workshop",
            rating: 4,
            comment: "The workshop was informative and useful.",
            date: "2026-10-22",
            status: "Reviewed"
        },
        {
            id: 3,
            studentName: "Aman Kumar",
            eventName: "Sports Competition",
            rating: 3,
            comment: "The competition was good. Better arrangements are needed.",
            date: "2026-10-25",
            status: "Pending"
        },
        {
            id: 4,
            studentName: "Neha Singh",
            eventName: "Annual Cultural Fest",
            rating: 5,
            comment: "Excellent arrangements and great performances.",
            date: "2026-10-27",
            status: "Reviewed"
        }
    ];

    saveData();
}

// Save feedback
function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(feedbackList));
}

// HTML elements
const tableBody = document.getElementById("feedbackTableBody");
const searchInput = document.getElementById("searchInput");
const eventFilter = document.getElementById("eventFilter");
const statusFilter = document.getElementById("statusFilter");
const feedbackModal = document.getElementById("feedbackModal");

// Load event filter
function loadEvents() {

    const savedEvents =
        JSON.parse(localStorage.getItem("campusEvents")) || [];

    const eventNames = savedEvents.length > 0
        ? savedEvents.map(event => event.name)
        : [
            "Annual Cultural Fest",
            "Technical Workshop",
            "Sports Competition"
        ];

    eventFilter.innerHTML = '<option value="">All Events</option>';

    eventNames.forEach(name => {

        const option = document.createElement("option");

        option.value = name;
        option.textContent = name;

        eventFilter.appendChild(option);
    });

    // Include events already present in feedback
    const existingNames = new Set(eventNames);

    feedbackList.forEach(item => {

        if (!existingNames.has(item.eventName)) {

            const option = document.createElement("option");

            option.value = item.eventName;
            option.textContent = item.eventName;

            eventFilter.appendChild(option);
            existingNames.add(item.eventName);
        }
    });
}

// Update statistics
function updateStatistics() {

    const total = feedbackList.length;

    const average = total === 0
        ? 0
        : feedbackList.reduce(
            (sum, item) => sum + Number(item.rating), 0
        ) / total;

    document.getElementById("totalFeedback").textContent = total;

    document.getElementById("averageRating").textContent =
        average.toFixed(1) + " ⭐";

    document.getElementById("pendingFeedback").textContent =
        feedbackList.filter(item => item.status === "Pending").length;

    document.getElementById("reviewedFeedback").textContent =
        feedbackList.filter(item => item.status === "Reviewed").length;
}

// Create table cell
function createCell(row, value) {

    const cell = document.createElement("td");
    cell.textContent = value || "-";

    row.appendChild(cell);

    return cell;
}

// Create action button
function createButton(text, className, action) {

    const button = document.createElement("button");

    button.type = "button";
    button.textContent = text;
    button.className = className;

    button.addEventListener("click", action);

    return button;
}

// Display feedback
function displayFeedback(data = feedbackList) {

    tableBody.replaceChildren();

    document.getElementById("emptyMessage").style.display =
        data.length === 0 ? "block" : "none";

    data.forEach(item => {

        const row = document.createElement("tr");

        createCell(row, item.id);
        createCell(row, item.studentName);
        createCell(row, item.eventName);

        // Rating
        const ratingCell = document.createElement("td");

        const rating = document.createElement("span");

        rating.className = "rating";
        rating.textContent =
            "★".repeat(Number(item.rating)) +
            "☆".repeat(5 - Number(item.rating));

        ratingCell.appendChild(rating);
        row.appendChild(ratingCell);

        // Comment
        const comment = item.comment.length > 35
            ? item.comment.substring(0, 35) + "..."
            : item.comment;

        createCell(row, comment);
        createCell(row, item.date);

        // Status
        const statusCell = document.createElement("td");

        const statusBadge = document.createElement("span");

        statusBadge.className = "status " + item.status;
        statusBadge.textContent = item.status;

        statusCell.appendChild(statusBadge);
        row.appendChild(statusCell);

        // Actions
        const actionCell = document.createElement("td");

        const viewButton = createButton(
            "View",
            "action-btn view-btn",
            () => viewFeedback(item.id)
        );

        const reviewButton = createButton(
            item.status === "Reviewed" ? "Pending" : "Reviewed",
            "action-btn review-btn",
            () => toggleStatus(item.id)
        );

        const deleteButton = createButton(
            "Delete",
            "action-btn delete-btn",
            () => deleteFeedback(item.id)
        );

        actionCell.append(
            viewButton,
            reviewButton,
            deleteButton
        );

        row.appendChild(actionCell);

        tableBody.appendChild(row);
    });

    updateStatistics();
}

// View feedback details
function viewFeedback(id) {

    const item = feedbackList.find(feedback => feedback.id === id);

    if (!item) return;

    document.getElementById("viewStudentName").textContent =
        item.studentName;

    document.getElementById("viewEventName").textContent =
        item.eventName;

    document.getElementById("viewRating").textContent =
        "★".repeat(Number(item.rating)) +
        "☆".repeat(5 - Number(item.rating)) +
        ` (${item.rating}/5)`;

    document.getElementById("viewDate").textContent =
        item.date;

    document.getElementById("viewComment").textContent =
        item.comment;

    document.getElementById("viewStatus").textContent =
        item.status;

    feedbackModal.style.display = "flex";
}

// Close modal
function closeModal() {
    feedbackModal.style.display = "none";
}

document.getElementById("closeModal")
    .addEventListener("click", closeModal);

document.getElementById("closeModalBtn")
    .addEventListener("click", closeModal);

// Toggle feedback status
function toggleStatus(id) {

    const item = feedbackList.find(feedback => feedback.id === id);

    if (!item) return;

    item.status = item.status === "Pending"
        ? "Reviewed"
        : "Pending";

    saveData();
    applyFilters();
}

// Delete feedback
function deleteFeedback(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this feedback?"
    );

    if (!confirmDelete) return;

    feedbackList = feedbackList.filter(item => item.id !== id);

    saveData();
    applyFilters();
}

// Search and filters
function applyFilters() {

    const searchValue = searchInput.value.toLowerCase();
    const selectedEvent = eventFilter.value;
    const selectedStatus = statusFilter.value;

    const filteredData = feedbackList.filter(item => {

        const matchesSearch =
            item.studentName.toLowerCase().includes(searchValue) ||
            item.eventName.toLowerCase().includes(searchValue) ||
            item.comment.toLowerCase().includes(searchValue);

        const matchesEvent =
            selectedEvent === "" || item.eventName === selectedEvent;

        const matchesStatus =
            selectedStatus === "" || item.status === selectedStatus;

        return matchesSearch && matchesEvent && matchesStatus;
    });

    displayFeedback(filteredData);
}

// Filter events
searchInput.addEventListener("input", applyFilters);
eventFilter.addEventListener("change", applyFilters);
statusFilter.addEventListener("change", applyFilters);

// Initial display
loadEvents();
displayFeedback();

window.addEventListener("campusdatachange", function(event) {
    if (event.detail.key === "campusEvents") {
        loadEvents();
    }

    if (event.detail.key === STORAGE_KEY) {
        feedbackList = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        displayFeedback();
    }
});