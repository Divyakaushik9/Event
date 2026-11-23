// VOLUNTEER MANAGEMENT

let volunteers = JSON.parse(
    localStorage.getItem("campusVolunteers")
) || [];

let students = JSON.parse(
    localStorage.getItem("campusStudents")
) || [];

const volunteerForm = document.getElementById("volunteerForm");

const tableBody = document.getElementById("volunteerTableBody");

const studentSelect = document.getElementById("studentSelect");

const searchInput = document.getElementById("searchInput");

const editIndex = document.getElementById("editIndex");


// GET STUDENT DETAILS

function getStudentDetails(student) {

    return {
        name: student.name || student.fullName || "",
        email: student.email || "",
        phone: student.phone || student.phoneNumber || "",
        collegeId: student.collegeId || student.collegeID || "",
        course: student.course || "",
        year: student.year || ""
    };

}


// LOAD REGISTERED STUDENTS

function loadStudents() {

    studentSelect.innerHTML =
        '<option value="">Select Registered Student</option>';

    students.forEach((student, index) => {

        const details = getStudentDetails(student);

        const option = document.createElement("option");

        option.value = index;

        option.textContent =
            details.name + " (" + details.collegeId + ")";

        studentSelect.appendChild(option);

    });

}


// SAVE DATA

function saveData() {

    localStorage.setItem(
        "campusVolunteers",
        JSON.stringify(volunteers)
    );

}


// DISPLAY VOLUNTEERS

function displayVolunteers(data = volunteers) {

    tableBody.innerHTML = "";

    document.getElementById("totalVolunteers").textContent =
        volunteers.length;

    const assignedEvents = new Set(
        volunteers.map(volunteer => volunteer.event)
    );

    document.getElementById("assignedEvents").textContent =
        assignedEvents.size;

    document.getElementById("assignedDuties").textContent =
        volunteers.length;

    document.getElementById("emptyMessage").style.display =
        data.length === 0 ? "block" : "none";


    data.forEach(volunteer => {

        const index = volunteers.indexOf(volunteer);

        const row = document.createElement("tr");

        const values = [
            index + 1,
            volunteer.name,
            volunteer.email,
            volunteer.collegeId,
            volunteer.event,
            volunteer.duty,
            volunteer.date
        ];

        values.forEach(value => {

            const cell = document.createElement("td");

            cell.textContent = value;

            row.appendChild(cell);

        });


        // STATUS

        const statusCell = document.createElement("td");

        const statusSpan = document.createElement("span");

        statusSpan.textContent = volunteer.status;

        statusSpan.className =
            "status status-" + volunteer.status.toLowerCase();

        statusCell.appendChild(statusSpan);

        row.appendChild(statusCell);


        // ACTIONS

        const actionCell = document.createElement("td");

        const editButton = document.createElement("button");

        editButton.textContent = "Edit";

        editButton.className = "action-btn edit-btn";

        editButton.addEventListener("click", function() {

            editVolunteer(index);

        });


        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";

        deleteButton.className = "action-btn delete-btn";

        deleteButton.addEventListener("click", function() {

            deleteVolunteer(index);

        });


        actionCell.appendChild(editButton);

        actionCell.appendChild(deleteButton);

        row.appendChild(actionCell);

        tableBody.appendChild(row);

    });

}


// ADD / UPDATE VOLUNTEER

volunteerForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const studentIndex = studentSelect.value;

    if (studentIndex === "" || !students[studentIndex]) {

        alert("Please select a registered student.");

        return;

    }

    const student = getStudentDetails(students[studentIndex]);

    const assignedEvent = document.getElementById("event").value;

    const duty = document.getElementById("duty").value;

    const date = document.getElementById("dutyDate").value;

    const status = document.getElementById("status").value;


    if (!student.name || !student.email || !student.collegeId) {

        alert("Selected student has incomplete details. Please check Student Management.");

        return;

    }


    const currentIndex = editIndex.value;


    // Prevent duplicate volunteer assignment for the same student and event

    const duplicate = volunteers.some((volunteer, index) => {

        return volunteer.collegeId === student.collegeId &&
               volunteer.event === assignedEvent &&
               index !== Number(currentIndex);

    });


    if (duplicate) {

        alert("This student is already assigned as a volunteer for this event.");

        return;

    }


    const volunteer = {

        name: student.name,
        email: student.email,
        phone: student.phone,
        collegeId: student.collegeId,
        course: student.course,
        year: student.year,
        event: assignedEvent,
        duty: duty,
        date: date,
        status: status

    };


    if (currentIndex === "") {

        volunteers.push(volunteer);

        alert("Volunteer assigned successfully!");

    } else {

        volunteers[Number(currentIndex)] = volunteer;

        alert("Volunteer details updated successfully!");

    }


    saveData();

    displayVolunteers();

    resetForm();

});


// EDIT VOLUNTEER

function editVolunteer(index) {

    const volunteer = volunteers[index];

    const studentIndex = students.findIndex(student => {

        return getStudentDetails(student).collegeId === volunteer.collegeId;

    });

    if (studentIndex === -1) {

        alert("This student record is no longer available.");

        return;

    }


    studentSelect.value = studentIndex;

    document.getElementById("event").value = volunteer.event;

    document.getElementById("duty").value = volunteer.duty;

    document.getElementById("dutyDate").value = volunteer.date;

    document.getElementById("status").value = volunteer.status;


    editIndex.value = index;

    document.getElementById("formHeading").textContent =
        "Update Volunteer Details";

    document.getElementById("submitBtn").textContent =
        "Update Volunteer";


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// DELETE VOLUNTEER

function deleteVolunteer(index) {

    const confirmDelete = confirm(
        "Are you sure you want to remove this volunteer?"
    );

    if (confirmDelete) {

        volunteers.splice(index, 1);

        saveData();

        displayVolunteers();

        resetForm();

        alert("Volunteer removed successfully!");

    }

}


// RESET FORM

function resetForm() {

    volunteerForm.reset();

    editIndex.value = "";

    document.getElementById("formHeading").textContent =
        "Assign New Volunteer";

    document.getElementById("submitBtn").textContent =
        "+ Assign Volunteer";

}


// CLEAR FORM

document.getElementById("resetBtn").addEventListener("click", function() {

    resetForm();

});


// SEARCH VOLUNTEERS

searchInput.addEventListener("input", function() {

    const searchValue = this.value.toLowerCase();

    const filteredVolunteers = volunteers.filter(volunteer => {

        return volunteer.name.toLowerCase().includes(searchValue) ||
               volunteer.email.toLowerCase().includes(searchValue) ||
               volunteer.collegeId.toLowerCase().includes(searchValue) ||
               volunteer.event.toLowerCase().includes(searchValue) ||
               volunteer.duty.toLowerCase().includes(searchValue) ||
               volunteer.status.toLowerCase().includes(searchValue);

    });

    displayVolunteers(filteredVolunteers);

});


// INITIAL DISPLAY

loadStudents();

displayVolunteers();