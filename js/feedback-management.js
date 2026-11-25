const STORAGE_KEY = "campusFeedback";

function readFeedback() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
        return Array.isArray(saved) ? saved : [];
    } catch (error) {
        return [];
    }
}

let feedbackList = readFeedback();

function normalizeFeedbackList(list) {
    return list.map((item, index) => {
        const rating = Number(item.rating);
        return {
            ...item,
            id: item.id ?? item.feedbackId ?? `feedback-${index + 1}`,
            studentName: item.studentName || item.name || "Unknown Student",
            eventName: item.eventName || item.event || "Unknown Event",
            comment: item.comment || "",
            date: item.date || item.feedbackDate || "",
            rating: Number.isFinite(rating)
                ? Math.min(5, Math.max(1, rating))
                : 1,
            status: item.status === "Reviewed" ? "Reviewed" : "Pending"
        };
    });
}

feedbackList = normalizeFeedbackList(feedbackList);
saveData();

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
        ? savedEvents.map(event => event.name || event.eventName).filter(Boolean)
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
        const commentText = String(item.comment || "");
        const comment = commentText.length > 35
            ? commentText.substring(0, 35) + "..."
            : commentText;

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

    const item = feedbackList.find(feedback =>
        String(feedback.id) === String(id)
    );

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

    const item = feedbackList.find(feedback =>
        String(feedback.id) === String(id)
    );

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

    feedbackList = feedbackList.filter(item =>
        String(item.id) !== String(id)
    );

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
            String(item.studentName || "").toLowerCase().includes(searchValue) ||
            String(item.eventName || "").toLowerCase().includes(searchValue) ||
            String(item.comment || "").toLowerCase().includes(searchValue);

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
        feedbackList = normalizeFeedbackList(readFeedback());
        loadEvents();
        applyFilters();
    }
});