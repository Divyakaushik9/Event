// CAMPUS EVENTS - REPORTS MODULE

// Get data from localStorage
function getData(key) {
    try {
        const data = JSON.parse(localStorage.getItem(key)) || [];
        return Array.isArray(data) ? data : [];
    } catch (error) {
        return [];
    }
}

// All project records
let students = getData("campusStudents");
let organizers = getData("campusOrganizers");
let volunteers = getData("campusVolunteers");
let events = getData("campusEvents");
let registrations = getData("campusRegistrations");
let stalls = getData("campusStallApplications");
let competitions = getData("campusCompetitions");
let feedback = getData("campusFeedback");
let attendance = getData("campusAttendance");

// Helper: read different possible date property names
function getRecordDate(item) {
    return (
        item.date ||
        item.eventDate ||
        item.registrationDate ||
        item.createdAt ||
        item.publishDate ||
        item.dutyDate ||
        ""
    );
}

// Helper: date filter
function isWithinDateRange(item, fromDate, toDate) {
    const recordDate = getRecordDate(item);

    // Records without a date remain included.
    if (!recordDate) return true;

    if (fromDate && recordDate < fromDate) return false;
    if (toDate && recordDate > toDate) return false;

    return true;
}

// Get filtered records
function getFilteredRecords(data) {
    const fromDate = document.getElementById("fromDate").value;
    const toDate = document.getElementById("toDate").value;

    return data.filter(item =>
        isWithinDateRange(item, fromDate, toDate)
    );
}

// Update summary cards
function updateSummary() {
    document.getElementById("studentCount").textContent = students.length;
    document.getElementById("organizerCount").textContent = organizers.length;
    document.getElementById("volunteerCount").textContent = volunteers.length;
    document.getElementById("eventCount").textContent = events.length;
    document.getElementById("registrationCount").textContent = registrations.length;
    document.getElementById("stallCount").textContent = stalls.length;
    document.getElementById("competitionCount").textContent = competitions.length;
    document.getElementById("feedbackCount").textContent = feedback.length;
}

// Event-wise report
function displayEventReport() {
    const table = document.getElementById("eventReportTable");
    const emptyMessage = document.getElementById("eventEmpty");

    table.innerHTML = "";

    const filteredEvents = getFilteredRecords(events);

    if (filteredEvents.length === 0) {
        emptyMessage.style.display = "block";
        return;
    }

    emptyMessage.style.display = "none";

    filteredEvents.forEach(event => {
        const eventName = event.eventName || event.name || "Unnamed Event";
        const eventCategory = event.category || "—";
        const eventDate = event.date || event.eventDate || "—";

        const registrationTotal = registrations.filter(item =>
            (item.eventName || item.event) === eventName
        ).length;

        const stallTotal = stalls.filter(item =>
            (item.eventName || item.event) === eventName
        ).length;

        const competitionTotal = competitions.filter(item =>
            (item.eventName || item.event) === eventName
        ).length;

        const row = document.createElement("tr");

        [
            eventName,
            eventCategory,
            eventDate,
            registrationTotal,
            stallTotal,
            competitionTotal
        ].forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        table.appendChild(row);
    });
}

// Stall report
function updateStallReport() {
    const filtered = getFilteredRecords(stalls);

    document.getElementById("totalStalls").textContent = filtered.length;

    document.getElementById("approvedStalls").textContent =
        filtered.filter(item =>
            String(item.status || "").toLowerCase() === "approved"
        ).length;

    document.getElementById("pendingStalls").textContent =
        filtered.filter(item =>
            String(item.status || "").toLowerCase() === "pending"
        ).length;

    document.getElementById("rejectedStalls").textContent =
        filtered.filter(item =>
            String(item.status || "").toLowerCase() === "rejected"
        ).length;
}

// Competition report
function updateCompetitionReport() {
    const filtered = getFilteredRecords(competitions);

    document.getElementById("totalCompetitions").textContent = filtered.length;

    document.getElementById("upcomingCompetitions").textContent =
        filtered.filter(item =>
            String(item.status || "").toLowerCase() === "upcoming"
        ).length;

    document.getElementById("activeCompetitions").textContent =
        filtered.filter(item =>
            String(item.status || "").toLowerCase() === "active"
        ).length;

    document.getElementById("completedCompetitions").textContent =
        filtered.filter(item =>
            String(item.status || "").toLowerCase() === "completed"
        ).length;
}

// Feedback report
function updateFeedbackReport() {
    const filtered = getFilteredRecords(feedback);

    const ratings = filtered
        .map(item => Number(item.rating))
        .filter(rating => Number.isFinite(rating) && rating > 0);

    const average = ratings.length
        ? (ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1)
        : "0";

    document.getElementById("totalFeedback").textContent = filtered.length;
    document.getElementById("averageRating").textContent = average + " / 5";

    document.getElementById("pendingFeedback").textContent =
        filtered.filter(item =>
            String(item.status || "").toLowerCase() === "pending"
        ).length;

    document.getElementById("reviewedFeedback").textContent =
        filtered.filter(item =>
            String(item.status || "").toLowerCase() === "reviewed"
        ).length;
}

// Attendance report
function updateAttendanceReport() {
    const filtered = getFilteredRecords(attendance);

    let present = 0;
    let absent = 0;
    let other = 0;

    filtered.forEach(item => {
        const status = String(item.status || "").toLowerCase();

        if (status === "present") {
            present++;
        } else if (status === "absent") {
            absent++;
        } else {
            other++;
        }
    });

    document.getElementById("totalAttendance").textContent = filtered.length;
    document.getElementById("presentAttendance").textContent = present;
    document.getElementById("absentAttendance").textContent = absent;
    document.getElementById("otherAttendance").textContent = other;
}

// Refresh all report sections
function refreshReports() {
    // Reload latest records from browser storage
    students = getData("campusStudents");
    organizers = getData("campusOrganizers");
    volunteers = getData("campusVolunteers");
    events = getData("campusEvents");
    registrations = getData("campusRegistrations");
    stalls = getData("campusStallApplications");
    competitions = getData("campusCompetitions");
    feedback = getData("campusFeedback");
    attendance = getData("campusAttendance");

    updateSummary();
    displayEventReport();
    updateStallReport();
    updateCompetitionReport();
    updateFeedbackReport();
    updateAttendanceReport();
}

// Apply filters
document.getElementById("applyFilterBtn").addEventListener("click", function() {
    const fromDate = document.getElementById("fromDate").value;
    const toDate = document.getElementById("toDate").value;

    if (fromDate && toDate && fromDate > toDate) {
        alert("From Date cannot be later than To Date.");
        return;
    }

    const reportType = document.getElementById("reportType").value;

    refreshReports();

    const sections = {
        events: document.getElementById("eventReportTable").closest(".report-panel"),
        stalls: document.getElementById("totalStalls").closest(".report-panel"),
        competitions: document.getElementById("totalCompetitions").closest(".report-panel"),
        feedback: document.getElementById("totalFeedback").closest(".report-panel"),
        attendance: document.getElementById("totalAttendance").closest(".report-panel")
    };

    Object.values(sections).forEach(section => {
        section.style.display = "block";
    });

    if (reportType !== "all" && reportType !== "registrations") {
        Object.entries(sections).forEach(([key, section]) => {
            section.style.display = key === reportType ? "block" : "none";
        });
    }

    if (reportType === "registrations") {
        alert("Total registrations: " + getFilteredRecords(registrations).length);
    }
});

// Reset filters
document.getElementById("resetFilterBtn").addEventListener("click", function() {
    document.getElementById("fromDate").value = "";
    document.getElementById("toDate").value = "";
    document.getElementById("reportType").value = "all";

    const panels = document.querySelectorAll(".report-panel");
    panels.forEach(panel => panel.style.display = "block");

    refreshReports();
});

// Export report as CSV
document.getElementById("exportBtn").addEventListener("click", function() {
    const rows = [
        ["CampusEvents - College Event Management System"],
        ["Report Generated", new Date().toLocaleDateString("en-IN")],
        [],
        ["Summary"],
        ["Students", students.length],
        ["Organizers", organizers.length],
        ["Volunteers", volunteers.length],
        ["Events", events.length],
        ["Registrations", registrations.length],
        ["Stall Applications", stalls.length],
        ["Competitions", competitions.length],
        ["Feedback", feedback.length],
        [],
        ["Event Name", "Category", "Date", "Registrations", "Stall Applications", "Competitions"]
    ];

    events.forEach(event => {
        const name = event.eventName || event.name || "Unnamed Event";

        rows.push([
            name,
            event.category || "",
            event.date || event.eventDate || "",
            registrations.filter(item => (item.eventName || item.event) === name).length,
            stalls.filter(item => (item.eventName || item.event) === name).length,
            competitions.filter(item => (item.eventName || item.event) === name).length
        ]);
    });

    const csv = rows.map(row =>
        row.map(value =>
            '"' + String(value ?? "").replace(/"/g, '""') + '"'
        ).join(",")
    ).join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
        type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "CampusEvents_Report.csv";
    link.click();

    URL.revokeObjectURL(url);
});

// Initial load
refreshReports();