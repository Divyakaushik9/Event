// ORGANIZER DASHBOARD

const menuLinks = document.querySelectorAll(".menu-link");
const sections = document.querySelectorAll(".content-section");

let currentOrganizer = null;
let assignedEvents = [];

// LOCAL STORAGE DATA
function getData(key) {
    try {
        return JSON.parse(localStorage.getItem(key)) || [];
    } catch (error) {
        return [];
    }
}

// SAFE HTML
function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

// GET ORGANIZER
function loadOrganizer() {
    const organizers = getData("campusOrganizers");

    currentOrganizer = organizers[0] || {
        fullName: "Demo Organizer",
        name: "Demo Organizer",
        email: "organizer@example.com",
        phone: "Not Available",
        department: "General",
        designation: "Event Organizer",
        assignedEvent: ""
    };

    const name = currentOrganizer.fullName ||
                 currentOrganizer.name || "Organizer";

    document.getElementById("organizerName").textContent = name;
    document.getElementById("profileName").textContent = name;
    document.getElementById("profileEmail").textContent =
        currentOrganizer.email || "-";
    document.getElementById("profilePhone").textContent =
        currentOrganizer.phone || currentOrganizer.phoneNumber || "-";
    document.getElementById("profileDepartment").textContent =
        currentOrganizer.department || "-";
    document.getElementById("profileDesignation").textContent =
        currentOrganizer.designation || "-";
}

// GET ASSIGNED EVENTS
function loadAssignedEvents() {
    const allEvents = getData("campusEvents");

    const assignedName = currentOrganizer.assignedEvent ||
                         currentOrganizer.eventName ||
                         currentOrganizer.event || "";

    assignedEvents = allEvents.filter(event => {
        const eventName = event.eventName || event.name || "";
        return assignedName &&
               eventName.toLowerCase() === assignedName.toLowerCase();
    });

    // Also support assignment stored as an array of event names.
    const assignedList = currentOrganizer.assignedEvents;

    if (Array.isArray(assignedList) && assignedList.length > 0) {
        assignedList.forEach(name => {
            const found = allEvents.find(event =>
                (event.eventName || event.name || "").toLowerCase() ===
                String(name).toLowerCase()
            );

            if (found && !assignedEvents.includes(found)) {
                assignedEvents.push(found);
            }
        });
    }

    renderEvents();
}

// EVENT NAME HELPER
function getEventName(event) {
    return event.eventName || event.name || "Unnamed Event";
}

// CHECK EVENT ASSIGNMENT
function isAssignedEvent(eventName) {
    return assignedEvents.some(event =>
        getEventName(event).toLowerCase() ===
        String(eventName || "").toLowerCase()
    );
}

// RENDER EVENTS
function renderEvents() {
    const containers = [
        document.getElementById("assignedEvents"),
        document.getElementById("overviewEvents")
    ];

    const html = assignedEvents.length
        ? assignedEvents.map(event => `
            <div class="event-card">
                <span class="event-category">
                    ${escapeHTML(event.category || "Event")}
                </span>
                <h3>${escapeHTML(getEventName(event))}</h3>
                <p>📅 Date: ${escapeHTML(event.date || "-")}</p>
                <p>📍 Venue: ${escapeHTML(event.venue || "-")}</p>
                <p>🕒 Time: ${escapeHTML(event.startTime || "-")}
                    ${event.endTime ? " - " + escapeHTML(event.endTime) : ""}
                </p>
                <p>${escapeHTML(event.description || "No description available.")}</p>
            </div>
        `).join("")
        : `<p class="empty-message">No events have been assigned to you yet.</p>`;

    containers.forEach(container => {
        container.innerHTML = html;
    });

    document.getElementById("totalEvents").textContent =
        assignedEvents.length;

    fillEventFilters();
}

// EVENT FILTERS
function fillEventFilters() {
    const filters = [
        document.getElementById("participantEventFilter"),
        document.getElementById("attendanceEventFilter")
    ];

    filters.forEach(filter => {
        filter.innerHTML = filter.id === "attendanceEventFilter"
            ? '<option value="">Select Assigned Event</option>'
            : '<option value="">All Assigned Events</option>';

        assignedEvents.forEach(event => {
            const name = getEventName(event);
            const option = document.createElement("option");
            option.value = name;
            option.textContent = name;
            filter.appendChild(option);
        });
    });
}

// PARTICIPANTS
function loadParticipants() {
    const registrations = getData("campusRegistrations");

    const participants = registrations.filter(registration => {
        const eventName = registration.eventName ||
                          registration.event ||
                          registration.eventTitle || "";

        return isAssignedEvent(eventName);
    });

    document.getElementById("totalParticipants").textContent =
        participants.length;

    const tbody = document.getElementById("participantsTable");

    if (participants.length === 0) {
        tbody.innerHTML = `
            <tr><td colspan="5" class="empty-message">
                No participants found for your assigned events.
            </td></tr>`;
        return;
    }

    tbody.innerHTML = participants.map(student => `
        <tr>
            <td>${escapeHTML(student.studentName || student.name || student.fullName || "-")}</td>
            <td>${escapeHTML(student.email || "-")}</td>
            <td>${escapeHTML(student.eventName || student.event || student.eventTitle || "-")}</td>
            <td>${escapeHTML(student.registrationDate || student.date || "-")}</td>
            <td><span class="status">${escapeHTML(student.status || "Registered")}</span></td>
        </tr>
    `).join("");

    searchParticipants();
}

// PARTICIPANT SEARCH
function searchParticipants() {
    const search = document.getElementById("participantSearch")
        .value.toLowerCase();

    const eventFilter = document.getElementById("participantEventFilter")
        .value.toLowerCase();

    document.querySelectorAll("#participantsTable tr").forEach(row => {
        const text = row.textContent.toLowerCase();

        const matchesSearch = text.includes(search);
        const matchesEvent = !eventFilter ||
            text.includes(eventFilter);

        row.style.display = matchesSearch && matchesEvent ? "" : "none";
    });
}

document.getElementById("participantSearch")
    .addEventListener("input", searchParticipants);

document.getElementById("participantEventFilter")
    .addEventListener("change", searchParticipants);

// VOLUNTEERS
function loadVolunteers() {
    const volunteers = getData("campusVolunteers").filter(volunteer => {
        const eventName = volunteer.eventName ||
                          volunteer.event || "";

        return isAssignedEvent(eventName);
    });

    document.getElementById("totalVolunteers").textContent =
        volunteers.length;

    const tbody = document.getElementById("volunteersTable");

    if (volunteers.length === 0) {
        tbody.innerHTML = `
            <tr><td colspan="6" class="empty-message">
                No volunteers assigned to your events.
            </td></tr>`;
        return;
    }

    tbody.innerHTML = volunteers.map(volunteer => `
        <tr>
            <td>${escapeHTML(volunteer.studentName || volunteer.name || volunteer.fullName || "-")}</td>
            <td>${escapeHTML(volunteer.collegeId || volunteer.collegeID || "-")}</td>
            <td>${escapeHTML(volunteer.eventName || volunteer.event || "-")}</td>
            <td>${escapeHTML(volunteer.duty || "-")}</td>
            <td>${escapeHTML(volunteer.date || volunteer.dutyDate || "-")}</td>
            <td><span class="status">${escapeHTML(volunteer.status || "Active")}</span></td>
        </tr>
    `).join("");
}

// ATTENDANCE
function loadAttendance() {
    const attendance = getData("campusAttendance");

    const relevantAttendance = attendance.filter(record =>
        isAssignedEvent(record.eventName || record.event)
    );

    document.getElementById("totalAttendance").textContent =
        relevantAttendance.length;

    renderAttendance();
}

// RENDER ATTENDANCE
function renderAttendance() {
    const eventName = document.getElementById("attendanceEventFilter").value;
    const registrations = getData("campusRegistrations");
    const attendance = getData("campusAttendance");

    const participants = registrations.filter(student => {
        const studentEvent = student.eventName ||
                             student.event ||
                             student.eventTitle || "";

        return isAssignedEvent(studentEvent) &&
               (!eventName || studentEvent === eventName);
    });

    const tbody = document.getElementById("attendanceTable");

    if (!eventName) {
        tbody.innerHTML = `
            <tr><td colspan="4" class="empty-message">
                Please select an assigned event first.
            </td></tr>`;
        return;
    }

    if (participants.length === 0) {
        tbody.innerHTML = `
            <tr><td colspan="4" class="empty-message">
                No registered participants found for this event.
            </td></tr>`;
        return;
    }

    tbody.innerHTML = participants.map(student => {
        const studentId = student.studentId ||
                          student.userId ||
                          student.email ||
                          student.collegeId ||
                          student.collegeID ||
                          student.studentName ||
                          student.name;

        const existing = attendance.find(record =>
            String(record.studentId) === String(studentId) &&
            (record.eventName || record.event) === eventName
        );

        return `
            <tr>
                <td>${escapeHTML(student.studentName || student.name || student.fullName || "-")}</td>
                <td>${escapeHTML(student.collegeId || student.collegeID || "-")}</td>
                <td>${escapeHTML(eventName)}</td>
                <td>
                    <select class="attendance-select"
                        data-student-id="${escapeHTML(studentId)}">
                        <option value="Present" ${existing?.status === "Present" ? "selected" : ""}>Present</option>
                        <option value="Absent" ${existing?.status === "Absent" ? "selected" : ""}>Absent</option>
                    </select>
                </td>
            </tr>
        `;
    }).join("");
}

document.getElementById("attendanceEventFilter")
    .addEventListener("change", renderAttendance);

// SAVE ATTENDANCE
document.getElementById("saveAttendanceBtn")
    .addEventListener("click", function() {

        const eventName = document.getElementById("attendanceEventFilter").value;

        if (!eventName) {
            alert("Please select an event first.");
            return;
        }

        const registrations = getData("campusRegistrations");
        let attendance = getData("campusAttendance");

        const selects = document.querySelectorAll(
            "#attendanceTable .attendance-select"
        );

        if (selects.length === 0) {
            alert("There are no participants to mark attendance for.");
            return;
        }

        selects.forEach(select => {
            const studentId = select.dataset.studentId;
            const student = registrations.find(item => {
                const id = item.studentId ||
                           item.userId ||
                           item.email ||
                           item.collegeId ||
                           item.collegeID ||
                           item.studentName ||
                           item.name;

                return String(id) === String(studentId);
            });

            const existingIndex = attendance.findIndex(record =>
                String(record.studentId) === String(studentId) &&
                (record.eventName || record.event) === eventName
            );

            const record = {
                studentId: studentId,
                studentName: student?.studentName ||
                             student?.name ||
                             student?.fullName || "",
                eventName: eventName,
                status: select.value,
                date: new Date().toISOString().split("T")[0]
            };

            if (existingIndex >= 0) {
                attendance[existingIndex] = record;
            } else {
                attendance.push(record);
            }
        });

        localStorage.setItem("campusAttendance", JSON.stringify(attendance));

        alert("Attendance saved successfully!");
        loadAttendance();
    });

// COMPETITIONS
function loadCompetitions() {
    const competitions = getData("campusCompetitions").filter(item =>
        isAssignedEvent(item.eventName || item.event)
    );

    const tbody = document.getElementById("competitionsTable");

    if (competitions.length === 0) {
        tbody.innerHTML = `
            <tr><td colspan="7" class="empty-message">
                No competitions found for your assigned events.
            </td></tr>`;
        return;
    }

    tbody.innerHTML = competitions.map(item => `
        <tr>
            <td>${escapeHTML(item.competitionName || item.name || "-")}</td>
            <td>${escapeHTML(item.eventName || item.event || "-")}</td>
            <td>${escapeHTML(item.date || "-")}</td>
            <td><span class="status">${escapeHTML(item.status || "-")}</span></td>
            <td>${escapeHTML(item.firstWinner || item.firstPosition || "-")}</td>
            <td>${escapeHTML(item.secondWinner || item.secondPosition || "-")}</td>
            <td>${escapeHTML(item.thirdWinner || item.thirdPosition || "-")}</td>
        </tr>
    `).join("");
}

// FEEDBACK
function loadFeedback() {
    const feedback = getData("campusFeedback").filter(item =>
        isAssignedEvent(item.eventName || item.event)
    );

    const tbody = document.getElementById("feedbackTable");

    if (feedback.length === 0) {
        tbody.innerHTML = `
            <tr><td colspan="5" class="empty-message">
                No feedback available for your assigned events.
            </td></tr>`;
        return;
    }

    tbody.innerHTML = feedback.map(item => `
        <tr>
            <td>${escapeHTML(item.studentName || item.name || "-")}</td>
            <td>${escapeHTML(item.eventName || item.event || "-")}</td>
            <td>${"⭐".repeat(Math.min(5, Math.max(0, Number(item.rating) || 0)))} </td>
            <td>${escapeHTML(item.comment || "-")}</td>
            <td>${escapeHTML(item.date || "-")}</td>
        </tr>
    `).join("");
}

// ANNOUNCEMENTS
function loadAnnouncements() {
    const announcements = getData("campusAnnouncements").filter(item => {
        const audience = item.audience || item.targetAudience || "";
        const status = item.status || "";

        return status.toLowerCase() === "published" &&
               ["all users", "organizers", "all"].includes(audience.toLowerCase());
    });

    const container = document.getElementById("announcementsList");

    if (announcements.length === 0) {
        container.innerHTML = `
            <div class="panel empty-message">
                No announcements available right now.
            </div>`;
        return;
    }

    container.innerHTML = announcements.map(item => `
        <div class="announcement-card">
            <h3>${escapeHTML(item.title || "Announcement")}</h3>
            <p>${escapeHTML(item.message || item.description || "")}</p>
            <p class="announcement-date">
                Published: ${escapeHTML(item.publishDate || item.date || "-")}
            </p>
        </div>
    `).join("");
}

// SIDEBAR NAVIGATION
menuLinks.forEach(link => {
    link.addEventListener("click", function(event) {
        event.preventDefault();

        menuLinks.forEach(item => item.classList.remove("active"));
        this.classList.add("active");

        sections.forEach(section =>
            section.classList.remove("active-section")
        );

        const targetId = this.getAttribute("href").substring(1);
        document.getElementById(targetId).classList.add("active-section");

        document.getElementById("sidebar").classList.remove("show-sidebar");
    });
});

// QUICK VIEW BUTTON
document.querySelectorAll(".view-btn").forEach(button => {
    button.addEventListener("click", function() {
        const targetId = this.dataset.target;

        menuLinks.forEach(link => {
            link.classList.toggle(
                "active",
                link.getAttribute("href") === "#" + targetId
            );
        });

        sections.forEach(section =>
            section.classList.remove("active-section")
        );

        document.getElementById(targetId).classList.add("active-section");
    });
});

// MOBILE SIDEBAR
document.getElementById("menuToggle")
    .addEventListener("click", function() {
        document.getElementById("sidebar")
            .classList.toggle("show-sidebar");
    });

// CURRENT DATE
document.getElementById("currentDate").textContent =
    new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });

// LOGOUT
document.getElementById("logoutBtn")
    .addEventListener("click", function() {

        if (confirm("Are you sure you want to logout?")) {
            window.location.href = "../login.html";
        }
    });

// LOAD ALL DASHBOARD DATA
function initializeDashboard() {
    loadOrganizer();
    loadAssignedEvents();
    loadParticipants();
    loadVolunteers();
    loadAttendance();
    loadCompetitions();
    loadFeedback();
    loadAnnouncements();
}

initializeDashboard();

window.addEventListener("campusdatachange", initializeDashboard);