// SIDEBAR NAVIGATION

const menuLinks = document.querySelectorAll(".menu-link");
const sections = document.querySelectorAll(".content-section");

const dashboardDataKeys = [
    "campusStudents",
    "campusEvents",
    "campusVolunteers",
    "campusStallApplications"
];

function getStoredRecords(key) {
    const saved = localStorage.getItem(key);
    if (!saved) {
        return [];
    }

    const records = JSON.parse(saved);
    if (!Array.isArray(records)) {
        throw new TypeError("Expected an array in localStorage key: " + key);
    }

    return records;
}

function getLocalDate() {
    const date = new Date();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return date.getFullYear() + "-" + month + "-" + day;
}

function renderRecentEvents(events) {
    const container = document.getElementById("recentEvents");
    container.innerHTML = "";

    if (events.length === 0) {
        const message = document.createElement("p");
        message.className = "empty-message";
        message.textContent = "No events have been created yet.";
        container.appendChild(message);
        return;
    }

    const today = getLocalDate();

    events.slice(-3).reverse().forEach(event => {
        const eventDate = event.date || "";
        const parsedDate = eventDate
            ? new Date(eventDate + "T00:00:00")
            : null;
        const dateIsValid = parsedDate && !Number.isNaN(parsedDate.getTime());
        const status = dateIsValid && eventDate < today
            ? "Completed"
            : "Upcoming";
        const item = document.createElement("div");
        item.className = "event-item";

        const date = document.createElement("div");
        date.className = "event-date";
        const day = document.createElement("strong");
        day.textContent = dateIsValid
            ? String(parsedDate.getDate()).padStart(2, "0")
            : "—";
        const month = document.createElement("span");
        month.textContent = dateIsValid
            ? parsedDate.toLocaleDateString("en-IN", { month: "short" }).toUpperCase()
            : "";
        date.append(day, month);

        const details = document.createElement("div");
        details.className = "event-details";
        const name = document.createElement("h3");
        name.textContent = event.eventName || event.name || "Unnamed Event";
        const venue = document.createElement("p");
        venue.textContent = "📍 " + (event.venue || "Venue not specified");
        details.append(name, venue);

        const badge = document.createElement("span");
        badge.className = "status " + status.toLowerCase();
        badge.textContent = status;

        item.append(date, details, badge);
        container.appendChild(item);
    });
}

function refreshDashboardData() {
    const students = getStoredRecords("campusStudents");
    const events = getStoredRecords("campusEvents");
    const volunteers = getStoredRecords("campusVolunteers");
    const stalls = getStoredRecords("campusStallApplications");

    document.getElementById("totalStudents").textContent = students.length;
    document.getElementById("totalEvents").textContent = events.length;
    document.getElementById("totalVolunteers").textContent = volunteers.length;
    document.getElementById("totalStalls").textContent = stalls.length;
    renderRecentEvents(events);
}

window.addEventListener("storage", function(event) {
    if (event.key === null || dashboardDataKeys.includes(event.key)) {
        refreshDashboardData();
    }
});

window.addEventListener("campusdatachange", function(event) {
    if (dashboardDataKeys.includes(event.detail.key)) {
        refreshDashboardData();
    }
});

window.addEventListener("pageshow", refreshDashboardData);
window.addEventListener("focus", refreshDashboardData);

menuLinks.forEach(link => {

    link.addEventListener("click", function(event) {

        // Allow separate pages to open normally
        if (!this.getAttribute("href").startsWith("#")) {
            return;
        }

        event.preventDefault();

        // Remove active class from all links
        menuLinks.forEach(item => {
            item.classList.remove("active");
        });

        // Add active class to clicked link
        this.classList.add("active");

        // Hide all sections
        sections.forEach(section => {
            section.classList.remove("active-section");
        });

        // Show selected section
        const targetId = this.getAttribute("href").substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
            targetSection.classList.add("active-section");
        }

        // Close sidebar on mobile
        document.getElementById("sidebar").classList.remove("show-sidebar");

    });

});


// MOBILE SIDEBAR

const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");

menuToggle.addEventListener("click", function() {

    sidebar.classList.toggle("show-sidebar");

});


// CURRENT DATE

const currentDate = document.getElementById("currentDate");

const today = new Date();

currentDate.textContent = today.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
});


// DEMO MESSAGE

function showMessage(message) {

    alert(message);

}


// LOGOUT

document.getElementById("logoutBtn").addEventListener("click", function() {

    const confirmLogout = confirm("Are you sure you want to logout?");

    if (confirmLogout) {

        window.location.href = "../login.html";

    }

});


// DEFAULT SECTION

document.getElementById("overview").classList.add("active-section");
refreshDashboardData();