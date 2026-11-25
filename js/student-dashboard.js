// STUDENT DASHBOARD

let currentStudent = null;
let allEvents = [];

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

// CURRENT DATE
function todayDate() {
    return new Date().toISOString().split("T")[0];
}

// STUDENT PROFILE
function loadStudent() {
    const students = getData("campusStudents");
    const currentEmail = localStorage.getItem("campusCurrentStudent");

    currentStudent = students.find(student =>
        (student.email || "").toLowerCase() === (currentEmail || "").toLowerCase()
    ) || null;

    if (!currentStudent) {
        window.location.href = "../login.html";
        return;
    }

    const name = currentStudent.fullName ||
                 currentStudent.name || "Student";

    document.getElementById("studentName").textContent = name;
    document.getElementById("profileName").textContent = name;

    document.getElementById("profileEmail").textContent =
        currentStudent.email || "-";

    document.getElementById("profilePhone").textContent =
        currentStudent.phone || currentStudent.phoneNumber || "-";

    document.getElementById("profileCollegeId").textContent =
        currentStudent.collegeId || currentStudent.collegeID || "-";

    document.getElementById("profileCourse").textContent =
        currentStudent.course || "-";

    document.getElementById("profileYear").textContent =
        currentStudent.year || "-";
}

// STUDENT IDENTIFIER
function getStudentId() {
    return currentStudent.email ||
           currentStudent.collegeId ||
           currentStudent.collegeID ||
           currentStudent.fullName ||
           currentStudent.name;
}

function getStudentName() {
    return currentStudent.fullName ||
           currentStudent.name ||
           "Student";
}

// EVENT NAME
function getEventName(event) {
    return event.eventName || event.name || "Unnamed Event";
}

// CHECK IF EVENT HAS A FACILITY
function hasFacility(value) {
    return value === true ||
           value === 1 ||
           value === "true" ||
           value === "yes" ||
           value === "on";
}

// LOAD EVENTS
function loadEvents() {
    allEvents = getData("campusEvents");

    renderEvents();
    fillEventDropdowns();

    document.getElementById("totalEvents").textContent =
        allEvents.length;
}

// CHECK REGISTRATION
function isRegistered(eventName) {
    const registrations = getData("campusRegistrations");

    return registrations.some(registration =>
        String(registration.studentId) === String(getStudentId()) &&
        (registration.eventName || registration.event ||
         registration.eventTitle) === eventName
    );
}

// RENDER EVENT CARDS
function renderEvents() {
    const search = document.getElementById("eventSearch")
        .value.toLowerCase();

    const category = document.getElementById("categoryFilter").value;

    const filteredEvents = allEvents.filter(event => {
        const name = getEventName(event).toLowerCase();
        const eventCategory = event.category || "";

        return name.includes(search) &&
               (!category || eventCategory === category);
    });

    const containers = [
        document.getElementById("allEvents"),
        document.getElementById("overviewEvents")
    ];

    const html = filteredEvents.length
        ? filteredEvents.map(event => {
            const name = getEventName(event);
            const registered = isRegistered(name);

            return `
                <div class="event-card">

                    <span class="event-category">
                        ${escapeHTML(event.category || "Event")}
                    </span>

                    <h3>${escapeHTML(name)}</h3>

                    <p>📅 Date: ${escapeHTML(event.date || "-")}</p>

                    <p>📍 Venue: ${escapeHTML(event.venue || "-")}</p>

                    <p>🕒 Time:
                        ${escapeHTML(event.startTime || "-")}
                        ${event.endTime ? " - " + escapeHTML(event.endTime) : ""}
                    </p>

                    <p>
                        ${escapeHTML(event.description || "No description available.")}
                    </p>

                    <button
                        class="register-btn"
                        data-event="${escapeHTML(name)}"
                        ${registered ? "disabled" : ""}>
                        ${registered ? "Already Registered" : "Register Now"}
                    </button>

                </div>
            `;
        }).join("")
        : `<p class="empty-message">No events available.</p>`;

    containers.forEach(container => {
        container.innerHTML = html;
    });

    document.querySelectorAll(".register-btn:not(:disabled)")
        .forEach(button => {
            button.addEventListener("click", function() {
                registerForEvent(this.dataset.event);
            });
        });
}

// EVENT SEARCH
document.getElementById("eventSearch")
    .addEventListener("input", renderEvents);

document.getElementById("categoryFilter")
    .addEventListener("change", renderEvents);

// REGISTER FOR EVENT
function registerForEvent(eventName) {
    if (isRegistered(eventName)) {
        alert("You are already registered for this event.");
        return;
    }

    const event = allEvents.find(item =>
        getEventName(item) === eventName
    );

    const registrations = getData("campusRegistrations");

    registrations.push({
        studentId: getStudentId(),
        studentName: getStudentName(),
        email: currentStudent.email || "",
        collegeId: currentStudent.collegeId ||
                   currentStudent.collegeID || "",
        eventName: eventName,
        category: event?.category || "",
        registrationDate: todayDate(),
        status: "Registered"
    });

    localStorage.setItem(
        "campusRegistrations",
        JSON.stringify(registrations)
    );

    alert("Event registration successful!");

    renderEvents();
    loadRegistrations();
    updateStatistics();
}

// LOAD REGISTRATIONS
function loadRegistrations() {
    const registrations = getData("campusRegistrations")
        .filter(item =>
            String(item.studentId) === String(getStudentId())
        );

    const tbody = document.getElementById("registrationsTable");

    document.getElementById("totalRegistrations").textContent =
        registrations.length;

    if (registrations.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="empty-message">
                    You have not registered for any events yet.
                </td>
            </tr>`;
        return;
    }

    tbody.innerHTML = registrations.map(item => `
        <tr>
            <td>${escapeHTML(item.eventName || item.event || "-")}</td>
            <td>${escapeHTML(item.category || "-")}</td>
            <td>${escapeHTML(item.registrationDate || item.date || "-")}</td>
            <td><span class="status">${escapeHTML(item.status || "Registered")}</span></td>
        </tr>
    `).join("");
}

// EVENT DROPDOWNS
function fillEventDropdowns() {
    const stallDropdown = document.getElementById("stallEvent");
    const feedbackDropdown = document.getElementById("feedbackEvent");

    stallDropdown.innerHTML = '<option value="">Select Event</option>';
    feedbackDropdown.innerHTML = '<option value="">Select Event</option>';

    allEvents.forEach(event => {
        const name = getEventName(event);

        if (hasFacility(event.stalls)) {
            const option = document.createElement("option");
            option.value = name;
            option.textContent = name;
            stallDropdown.appendChild(option);
        }

        const feedbackOption = document.createElement("option");
        feedbackOption.value = name;
        feedbackOption.textContent = name;
        feedbackDropdown.appendChild(feedbackOption);
    });
}

// COMPETITIONS
function loadCompetitions() {
    const competitions = getData("campusCompetitions");

    const studentRegistrations = getData("campusRegistrations")
        .filter(item =>
            String(item.studentId) === String(getStudentId())
        );

    const registeredEventNames = studentRegistrations.map(item =>
        item.eventName || item.event || item.eventTitle
    );

    const availableCompetitions = competitions.filter(item =>
        registeredEventNames.includes(item.eventName || item.event)
    );

    document.getElementById("totalCompetitions").textContent =
        availableCompetitions.length;

    const container = document.getElementById("competitionsList");

    if (availableCompetitions.length === 0) {
        container.innerHTML = `
            <p class="empty-message">
                No competitions available for your registered events.
            </p>`;
        return;
    }

    container.innerHTML = availableCompetitions.map(item => `
        <div class="event-card">
            <span class="event-category">Competition</span>
            <h3>${escapeHTML(item.competitionName || item.name || "-")}</h3>
            <p>📅 Date: ${escapeHTML(item.date || "-")}</p>
            <p>📍 Event: ${escapeHTML(item.eventName || item.event || "-")}</p>
            <p>Status: ${escapeHTML(item.status || "-")}</p>
            <p>🥇 First: ${escapeHTML(item.firstWinner || item.firstPosition || "-")}</p>
            <p>🥈 Second: ${escapeHTML(item.secondWinner || item.secondPosition || "-")}</p>
            <p>🥉 Third: ${escapeHTML(item.thirdWinner || item.thirdPosition || "-")}</p>
        </div>
    `).join("");
}

// STALL APPLICATIONS
function loadStallApplications() {
    const applications = getData("campusStallApplications")
        .filter(item =>
            String(item.studentId) === String(getStudentId())
        );

    const tbody = document.getElementById("stallApplicationsTable");

    if (applications.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="empty-message">
                    You have not submitted any stall applications.
                </td>
            </tr>`;
        return;
    }

    tbody.innerHTML = applications.map(item => `
        <tr>
            <td>${escapeHTML(item.eventName || item.event || "-")}</td>
            <td>${escapeHTML(item.category || "-")}</td>
            <td>${escapeHTML(item.description || "-")}</td>
            <td><span class="status">${escapeHTML(item.status || "Pending")}</span></td>
        </tr>
    `).join("");
}

// SUBMIT STALL APPLICATION
document.getElementById("stallForm")
    .addEventListener("submit", function(event) {
        event.preventDefault();

        const eventName = document.getElementById("stallEvent").value;
        const category = document.getElementById("stallCategory").value;
        const description = document.getElementById("stallDescription").value.trim();

        if (!eventName || !category || !description) {
            alert("Please fill all the fields.");
            return;
        }

        const applications = getData("campusStallApplications");

        const duplicate = applications.some(item =>
            String(item.studentId) === String(getStudentId()) &&
            item.eventName === eventName
        );

        if (duplicate) {
            alert("You have already applied for a stall in this event.");
            return;
        }

        applications.push({
            studentId: getStudentId(),
            studentName: getStudentName(),
            email: currentStudent.email || "",
            eventName: eventName,
            category: category,
            description: description,
            applicationDate: todayDate(),
            status: "Pending"
        });

        localStorage.setItem(
            "campusStallApplications",
            JSON.stringify(applications)
        );

        alert("Stall application submitted successfully!");

        this.reset();
        loadStallApplications();
    });

// FEEDBACK
function loadFeedback() {
    const feedback = getData("campusFeedback")
        .filter(item =>
            String(item.studentId) === String(getStudentId())
        );

    const tbody = document.getElementById("myFeedbackTable");

    if (feedback.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="empty-message">
                    You have not submitted any feedback yet.
                </td>
            </tr>`;
        return;
    }

    tbody.innerHTML = feedback.map(item => `
        <tr>
            <td>${escapeHTML(item.eventName || item.event || "-")}</td>
            <td>${"⭐".repeat(Math.min(5, Math.max(0, Number(item.rating) || 0)))} </td>
            <td>${escapeHTML(item.comment || "-")}</td>
            <td>${escapeHTML(item.date || "-")}</td>
        </tr>
    `).join("");
}

// SUBMIT FEEDBACK
document.getElementById("feedbackForm")
    .addEventListener("submit", function(event) {
        event.preventDefault();

        const eventName = document.getElementById("feedbackEvent").value;
        const rating = document.getElementById("feedbackRating").value;
        const comment = document.getElementById("feedbackComment").value.trim();

        if (!eventName || !rating || !comment) {
            alert("Please fill all the fields.");
            return;
        }

        const feedback = getData("campusFeedback");
        const studentId = getStudentId();

        const alreadySubmitted = feedback.some(item =>
            String(item.studentId || "") === String(studentId) &&
            (item.eventName || item.event) === eventName
        );

        if (alreadySubmitted) {
            alert("You have already submitted feedback for this event.");
            return;
        }

        feedback.push({
            id: "feedback-" + Date.now(),
            studentId: studentId,
            studentName: getStudentName(),
            eventName: eventName,
            rating: Number(rating),
            comment: comment,
            date: todayDate(),
            status: "Pending"
        });

        localStorage.setItem("campusFeedback", JSON.stringify(feedback));

        alert("Thank you! Your feedback has been submitted.");

        this.reset();
        loadFeedback();
    });

// NOTIFICATIONS
function loadNotifications() {
    const announcements = getData("campusAnnouncements");

    const notifications = announcements.filter(item => {
        const audience = (
            item.audience || item.targetAudience || ""
        ).toLowerCase();

        return (item.status || "").toLowerCase() === "published" &&
            ["all users", "students", "all"].includes(audience);
    });

    document.getElementById("totalNotifications").textContent =
        notifications.length;

    const container = document.getElementById("notificationsList");

    if (notifications.length === 0) {
        container.innerHTML = `
            <div class="panel empty-message">
                No new announcements available.
            </div>`;
        return;
    }

    container.innerHTML = notifications.map(item => `
        <div class="announcement-card">
            <h3>${escapeHTML(item.title || "Announcement")}</h3>
            <p>${escapeHTML(item.message || item.description || "")}</p>
            <p class="announcement-date">
                Published: ${escapeHTML(item.publishDate || item.date || "-")}
            </p>
        </div>
    `).join("");
}

// ========================================
// MY VOLUNTEER DUTIES
// ========================================

function loadVolunteerDuties() {

    const volunteers = getData("campusVolunteers");

    const tbody = document.getElementById("volunteerDutiesTable");

    // Match assignments using student's email or College ID
    const studentEmail = String(currentStudent.email || "")
        .trim()
        .toLowerCase();

    const studentCollegeId = String(
        currentStudent.collegeId || currentStudent.collegeID || ""
    ).trim().toLowerCase();

    const myDuties = volunteers.filter(volunteer => {

        const volunteerEmail = String(volunteer.email || "")
            .trim()
            .toLowerCase();

        const volunteerCollegeId = String(volunteer.collegeId || "")
            .trim()
            .toLowerCase();

        return (
            (studentEmail !== "" && volunteerEmail === studentEmail) ||
            (studentCollegeId !== "" && volunteerCollegeId === studentCollegeId)
        );

    });

    if (myDuties.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="empty-message">
                    No volunteer duties have been assigned to you yet.
                </td>
            </tr>`;

        return;
    }

    tbody.innerHTML = myDuties.map(volunteer => {

        const status = volunteer.status || "Assigned";

        return `
            <tr>
                <td>${escapeHTML(volunteer.event || "-")}</td>

                <td>${escapeHTML(volunteer.duty || "-")}</td>

                <td>${escapeHTML(volunteer.date || "-")}</td>

                <td>
                    <span class="status">
                        ${escapeHTML(status)}
                    </span>
                </td>
            </tr>
        `;

    }).join("");

}

// STATISTICS
function updateStatistics() {
    document.getElementById("totalEvents").textContent =
        allEvents.length;

    const registrations = getData("campusRegistrations").filter(item =>
        String(item.studentId) === String(getStudentId())
    );

    document.getElementById("totalRegistrations").textContent =
        registrations.length;
}

// SIDEBAR NAVIGATION
const menuLinks = document.querySelectorAll(".menu-link");
const sections = document.querySelectorAll(".content-section");

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

        document.getElementById("sidebar")
            .classList.remove("show-sidebar");
    });
});

// QUICK VIEW
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

// INITIALIZE DASHBOARD
function initializeDashboard() {
    loadStudent();
    loadEvents();
    loadRegistrations();
    loadCompetitions();
    loadStallApplications();
    loadFeedback();
    loadNotifications();
    loadVolunteerDuties();
    updateStatistics();
}

initializeDashboard();

window.addEventListener("campusdatachange", initializeDashboard);