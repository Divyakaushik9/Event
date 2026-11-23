const STORAGE_KEY = "campusStallApplications";

let applications = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// Demo applications
if (applications.length === 0) {

    applications = [
        {
            id: 1,
            studentName: "Rahul Sharma",
            studentEmail: "rahul@example.com",
            studentPhone: "9876543210",
            stallName: "Food Corner",
            stallCategory: "Food",
            eventName: "Annual Cultural Fest",
            description: "Food and snacks stall",
            stallNumber: "",
            status: "Pending"
        },
        {
            id: 2,
            studentName: "Priya Verma",
            studentEmail: "priya@example.com",
            studentPhone: "9876543211",
            stallName: "Handmade Crafts",
            stallCategory: "Handmade Products",
            eventName: "Technical Workshop",
            description: "Handmade decorative products",
            stallNumber: "S-101",
            status: "Approved"
        },
        {
            id: 3,
            studentName: "Aman Kumar",
            studentEmail: "aman@example.com",
            studentPhone: "9876543212",
            stallName: "Art Gallery",
            stallCategory: "Other",
            eventName: "Sports Competition",
            description: "Art and creative products",
            stallNumber: "",
            status: "Rejected"
        }
    ];

    saveData();
}

// Save data
function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
}

// HTML elements
const tableBody = document.getElementById("stallTableBody");
const searchInput = document.getElementById("searchInput");
const stallModal = document.getElementById("stallModal");
const stallForm = document.getElementById("stallForm");
const eventSelect = document.getElementById("eventName");

// Event dropdown
function loadEvents() {

    eventSelect.innerHTML = "";

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Select Event";
    eventSelect.appendChild(defaultOption);

    const savedEvents = JSON.parse(localStorage.getItem("campusEvents")) || [];

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

    document.getElementById("totalApplications").textContent =
        applications.length;

    document.getElementById("pendingApplications").textContent =
        applications.filter(item => item.status === "Pending").length;

    document.getElementById("approvedApplications").textContent =
        applications.filter(item => item.status === "Approved").length;

    document.getElementById("rejectedApplications").textContent =
        applications.filter(item => item.status === "Rejected").length;
}

// Create table cell safely
function createCell(row, value) {

    const cell = document.createElement("td");
    cell.textContent = value || "-";
    row.appendChild(cell);

    return cell;
}

// Display applications
function displayApplications(data = applications) {

    tableBody.replaceChildren();

    document.getElementById("emptyMessage").style.display =
        data.length === 0 ? "block" : "none";

    data.forEach(item => {

        const row = document.createElement("tr");

        createCell(row, item.id);
        createCell(row, item.studentName);
        createCell(row, item.stallName);
        createCell(row, item.stallCategory);
        createCell(row, item.eventName);
        createCell(row, item.stallNumber);

        // Status
        const statusCell = document.createElement("td");
        const statusBadge = document.createElement("span");

        statusBadge.className = "status " + item.status;
        statusBadge.textContent = item.status;

        statusCell.appendChild(statusBadge);
        row.appendChild(statusCell);

        // Actions
        const actionCell = document.createElement("td");

        const editButton = createButton("Edit", "action-btn edit-btn");
        editButton.addEventListener("click", () => editApplication(item.id));

        const approveButton = createButton("Approve", "action-btn approve-btn");
        approveButton.addEventListener("click", () => {
            updateStatus(item.id, "Approved");
        });

        const rejectButton = createButton("Reject", "action-btn reject-btn");
        rejectButton.addEventListener("click", () => {
            updateStatus(item.id, "Rejected");
        });

        const deleteButton = createButton("Delete", "action-btn delete-btn");
        deleteButton.addEventListener("click", () => {
            deleteApplication(item.id);
        });

        actionCell.append(
            editButton,
            approveButton,
            rejectButton,
            deleteButton
        );

        row.appendChild(actionCell);
        tableBody.appendChild(row);
    });

    updateStatistics();
}

// Create action button
function createButton(text, className) {

    const button = document.createElement("button");

    button.type = "button";
    button.textContent = text;
    button.className = className;

    return button;
}

// Open modal
function openModal() {

    loadEvents();

    stallForm.reset();

    document.getElementById("applicationId").value = "";
    document.getElementById("modalTitle").textContent =
        "Add Stall Application";

    document.getElementById("stallStatus").value = "Pending";

    stallModal.style.display = "flex";
}

// Close modal
function closeModal() {
    stallModal.style.display = "none";
}

document.getElementById("addStallBtn").addEventListener("click", openModal);

document.getElementById("closeModal").addEventListener("click", closeModal);

document.getElementById("cancelBtn").addEventListener("click", closeModal);

// Edit application
function editApplication(id) {

    const item = applications.find(app => app.id === id);

    if (!item) return;

    loadEvents();

    document.getElementById("applicationId").value = item.id;
    document.getElementById("studentName").value = item.studentName;
    document.getElementById("studentEmail").value = item.studentEmail;
    document.getElementById("studentPhone").value = item.studentPhone;
    document.getElementById("stallName").value = item.stallName;
    document.getElementById("stallCategory").value = item.stallCategory;
    document.getElementById("eventName").value = item.eventName;
    document.getElementById("stallDescription").value = item.description;
    document.getElementById("stallNumber").value = item.stallNumber;
    document.getElementById("stallStatus").value = item.status;

    document.getElementById("modalTitle").textContent =
        "Edit Stall Application";

    stallModal.style.display = "flex";
}

// Add or update application
stallForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const id = document.getElementById("applicationId").value;

    const application = {
        id: id ? Number(id) : Date.now(),
        studentName: document.getElementById("studentName").value.trim(),
        studentEmail: document.getElementById("studentEmail").value.trim(),
        studentPhone: document.getElementById("studentPhone").value.trim(),
        stallName: document.getElementById("stallName").value.trim(),
        stallCategory: document.getElementById("stallCategory").value,
        eventName: document.getElementById("eventName").value,
        description: document.getElementById("stallDescription").value.trim(),
        stallNumber: document.getElementById("stallNumber").value.trim(),
        status: document.getElementById("stallStatus").value
    };

    if (id) {

        const index = applications.findIndex(item => item.id === Number(id));

        if (index !== -1) {
            applications[index] = application;
        }

    } else {

        applications.push(application);
    }

    saveData();
    displayApplications();
    closeModal();

    alert(id
        ? "Stall application updated successfully!"
        : "Stall application added successfully!"
    );
});

// Update status
function updateStatus(id, status) {

    const item = applications.find(app => app.id === id);

    if (!item) return;

    if (status === "Approved") {

        if (item.status === "Approved") {
            alert("This application is already approved.");
            return;
        }

        const stallNumber = prompt(
            "Enter stall number for allotment:",
            item.stallNumber || ""
        );

        if (stallNumber === null) return;

        if (stallNumber.trim() === "") {
            alert("Please enter a stall number.");
            return;
        }

        item.stallNumber = stallNumber.trim();
    }

    if (status === "Rejected") {

        const confirmReject = confirm(
            "Are you sure you want to reject this application?"
        );

        if (!confirmReject) return;
    }

    item.status = status;

    saveData();
    displayApplications();

    alert("Application status updated successfully!");
}

// Delete application
function deleteApplication(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this application?"
    );

    if (!confirmDelete) return;

    applications = applications.filter(item => item.id !== id);

    saveData();
    displayApplications();
}

// Search applications
searchInput.addEventListener("input", function() {

    const searchValue = this.value.toLowerCase();

    const filteredData = applications.filter(item =>

        item.studentName.toLowerCase().includes(searchValue) ||
        item.stallName.toLowerCase().includes(searchValue) ||
        item.stallCategory.toLowerCase().includes(searchValue) ||
        item.eventName.toLowerCase().includes(searchValue) ||
        item.status.toLowerCase().includes(searchValue)
    );

    displayApplications(filteredData);
});

// Initial display
loadEvents();
displayApplications();