// ANNOUNCEMENT MANAGEMENT

const STORAGE_KEY = "campusAnnouncements";

let announcementList = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// Save data in browser
function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(announcementList));
}

// Generate unique ID
function generateId() {
    return Date.now().toString();
}

// Get current date
function getToday() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

// Automatically determine expired status
function getStatus(item) {
    if (item.status === "Published" && item.expiryDate < getToday()) {
        return "Expired";
    }

    return item.status;
}

// Load event names from Event Management
function loadEvents() {
    const eventSelect = document.getElementById("event");

    const savedEvents = JSON.parse(localStorage.getItem("campusEvents")) || [];

    const eventNames = savedEvents
        .map(item => item.eventName || item.name)
        .filter(Boolean);

    const feedbackEvents = announcementList
        .map(item => item.event)
        .filter(Boolean);

    const demoEvents = [
        "Annual Cultural Fest",
        "Technical Workshop",
        "Sports Competition"
    ];

    const allEvents = [...new Set([
        ...demoEvents,
        ...eventNames,
        ...feedbackEvents
    ])];

    eventSelect.innerHTML = '<option value="">No Event Selected</option>';

    allEvents.forEach(eventName => {
        const option = document.createElement("option");
        option.value = eventName;
        option.textContent = eventName;
        eventSelect.appendChild(option);
    });
}

// Update statistics
function updateStatistics() {
    const total = announcementList.length;

    const published = announcementList.filter(
        item => getStatus(item) === "Published"
    ).length;

    const drafts = announcementList.filter(
        item => item.status === "Draft"
    ).length;

    const expired = announcementList.filter(
        item => getStatus(item) === "Expired"
    ).length;

    document.getElementById("totalCount").textContent = total;
    document.getElementById("publishedCount").textContent = published;
    document.getElementById("draftCount").textContent = drafts;
    document.getElementById("expiredCount").textContent = expired;
}

// Display announcements
function displayAnnouncements(data = announcementList) {
    const table = document.getElementById("announcementTable");
    const emptyMessage = document.getElementById("emptyMessage");

    table.innerHTML = "";

    if (data.length === 0) {
        emptyMessage.style.display = "block";
    } else {
        emptyMessage.style.display = "none";
    }

    data.forEach(item => {
        const status = getStatus(item);

        const row = document.createElement("tr");

        const values = [
            item.id,
            item.title,
            item.audience,
            item.event || "—",
            item.publishDate,
            item.expiryDate
        ];

        values.forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        const statusCell = document.createElement("td");
        const badge = document.createElement("span");

        badge.className = "status status-" + status.toLowerCase();
        badge.textContent = status;

        statusCell.appendChild(badge);
        row.appendChild(statusCell);

        const actionCell = document.createElement("td");
        const actions = document.createElement("div");
        actions.className = "action-buttons";

        const viewButton = document.createElement("button");
        viewButton.className = "view-btn";
        viewButton.textContent = "View";
        viewButton.addEventListener("click", () => viewAnnouncement(item.id));

        const editButton = document.createElement("button");
        editButton.className = "edit-btn";
        editButton.textContent = "Edit";
        editButton.addEventListener("click", () => editAnnouncement(item.id));

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => deleteAnnouncement(item.id));

        actions.append(viewButton, editButton, deleteButton);
        actionCell.appendChild(actions);
        row.appendChild(actionCell);

        table.appendChild(row);
    });

    updateStatistics();
}

// Open modal
function openModal() {
    document.getElementById("announcementModal").classList.add("show");
}

// Close modal
function closeModal() {
    document.getElementById("announcementModal").classList.remove("show");
    document.getElementById("announcementForm").reset();
    document.getElementById("announcementId").value = "";
    document.getElementById("modalTitle").textContent = "Create Announcement";
    document.getElementById("saveBtn").textContent = "Save Announcement";
}

// Create new announcement
document.getElementById("addAnnouncementBtn").addEventListener("click", function() {
    closeModal();
    loadEvents();
    openModal();
});

// Close buttons
document.getElementById("closeModalBtn").addEventListener("click", closeModal);
document.getElementById("cancelBtn").addEventListener("click", closeModal);

// Save or update announcement
document.getElementById("announcementForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const id = document.getElementById("announcementId").value;
    const title = document.getElementById("title").value.trim();
    const message = document.getElementById("message").value.trim();
    const audience = document.getElementById("audience").value;
    const relatedEvent = document.getElementById("event").value;
    const publishDate = document.getElementById("publishDate").value;
    const expiryDate = document.getElementById("expiryDate").value;
    const status = document.getElementById("status").value;

    if (expiryDate < publishDate) {
        alert("Expiry date cannot be earlier than publish date.");
        return;
    }

    const announcementData = {
        id: id || generateId(),
        title,
        message,
        audience,
        event: relatedEvent,
        publishDate,
        expiryDate,
        status,
        createdAt: id
            ? (announcementList.find(item => item.id === id)?.createdAt || getToday())
            : getToday()
    };

    if (id) {
        const index = announcementList.findIndex(item => item.id === id);

        if (index !== -1) {
            announcementList[index] = announcementData;
        }
    } else {
        announcementList.push(announcementData);
    }

    saveData();
    displayAnnouncements();
    closeModal();

    alert(id ? "Announcement updated successfully!" : "Announcement created successfully!");
});

// Edit announcement
function editAnnouncement(id) {
    const item = announcementList.find(item => item.id === id);

    if (!item) return;

    loadEvents();

    document.getElementById("announcementId").value = item.id;
    document.getElementById("title").value = item.title;
    document.getElementById("message").value = item.message;
    document.getElementById("audience").value = item.audience;
    document.getElementById("event").value = item.event || "";
    document.getElementById("publishDate").value = item.publishDate;
    document.getElementById("expiryDate").value = item.expiryDate;
    document.getElementById("status").value = item.status;

    document.getElementById("modalTitle").textContent = "Edit Announcement";
    document.getElementById("saveBtn").textContent = "Update Announcement";

    openModal();
}

// View announcement
function viewAnnouncement(id) {
    const item = announcementList.find(item => item.id === id);

    if (!item) return;

    alert(
        "ANNOUNCEMENT DETAILS\n\n" +
        "Title: " + item.title + "\n\n" +
        "Message: " + item.message + "\n\n" +
        "Audience: " + item.audience + "\n" +
        "Event: " + (item.event || "No Event Selected") + "\n" +
        "Publish Date: " + item.publishDate + "\n" +
        "Expiry Date: " + item.expiryDate + "\n" +
        "Status: " + getStatus(item)
    );
}

// Delete announcement
function deleteAnnouncement(id) {
    const confirmDelete = confirm("Are you sure you want to delete this announcement?");

    if (!confirmDelete) return;

    announcementList = announcementList.filter(item => item.id !== id);

    saveData();
    displayAnnouncements();

    alert("Announcement deleted successfully!");
}

// Search and filters
function filterAnnouncements() {
    const search = document.getElementById("searchInput").value.toLowerCase();
    const status = document.getElementById("statusFilter").value;
    const audience = document.getElementById("audienceFilter").value;

    const filteredData = announcementList.filter(item => {
        const matchesSearch =
            item.title.toLowerCase().includes(search) ||
            item.message.toLowerCase().includes(search) ||
            (item.event || "").toLowerCase().includes(search);

        const matchesStatus =
            status === "all" || getStatus(item) === status;

        const matchesAudience =
            audience === "all" || item.audience === audience;

        return matchesSearch && matchesStatus && matchesAudience;
    });

    displayAnnouncements(filteredData);
}

document.getElementById("searchInput").addEventListener("input", filterAnnouncements);
document.getElementById("statusFilter").addEventListener("change", filterAnnouncements);
document.getElementById("audienceFilter").addEventListener("change", filterAnnouncements);

// Initial setup
loadEvents();
displayAnnouncements();