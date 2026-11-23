// ORGANIZER MANAGEMENT

let organizers = JSON.parse(
    localStorage.getItem("campusOrganizers")
) || [];

const organizerForm = document.getElementById("organizerForm");

const tableBody = document.getElementById("organizerTableBody");

const searchInput = document.getElementById("searchInput");

const editIndex = document.getElementById("editIndex");


// SAVE DATA

function saveData() {

    localStorage.setItem(
        "campusOrganizers",
        JSON.stringify(organizers)
    );

}


// DISPLAY ORGANIZERS

function displayOrganizers(data = organizers) {

    tableBody.innerHTML = "";

    document.getElementById("totalOrganizers").textContent =
        organizers.length;

    const assigned = organizers.filter(
        organizer => organizer.event !== "Not Assigned"
    ).length;

    document.getElementById("assignedEvents").textContent = assigned;

    document.getElementById("emptyMessage").style.display =
        data.length === 0 ? "block" : "none";


    data.forEach((organizer) => {

        const index = organizers.indexOf(organizer);

        const row = document.createElement("tr");

        const values = [
            index + 1,
            organizer.name,
            organizer.email,
            organizer.phone,
            organizer.department,
            organizer.designation,
            organizer.event
        ];

        values.forEach(value => {

            const cell = document.createElement("td");

            cell.textContent = value;

            row.appendChild(cell);

        });


        const actionCell = document.createElement("td");

        const editButton = document.createElement("button");

        editButton.textContent = "Edit";
        editButton.className = "action-btn edit-btn";

        editButton.addEventListener("click", function() {
            editOrganizer(index);
        });


        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";
        deleteButton.className = "action-btn delete-btn";

        deleteButton.addEventListener("click", function() {
            deleteOrganizer(index);
        });


        actionCell.appendChild(editButton);
        actionCell.appendChild(deleteButton);

        row.appendChild(actionCell);

        tableBody.appendChild(row);

    });

}


// ADD / UPDATE ORGANIZER

organizerForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const name = document.getElementById("fullName").value.trim();

    const email = document.getElementById("email").value.trim().toLowerCase();

    const password = document.getElementById("password").value;

    const phone = document.getElementById("phone").value.trim();

    const department = document.getElementById("department").value.trim();

    const designation = document.getElementById("designation").value.trim();

    const assignedEvent = document.getElementById("event").value;


    if (!name || !email || !password || !phone ||
        !department || !designation || !assignedEvent) {

        alert("Please fill all the fields.");

        return;

    }


    if (!/^[0-9]{10}$/.test(phone)) {

        alert("Please enter a valid 10 digit phone number.");

        return;

    }


    if (password.length < 8) {

        alert("Password must contain at least 8 characters.");

        return;

    }


    const currentIndex = editIndex.value;

    const duplicateEmail = organizers.some((organizer, index) => {

        return organizer.email === email &&
               index !== Number(currentIndex);

    });


    if (duplicateEmail) {

        alert("This email is already registered.");

        return;

    }


    const organizer = {

        name: name,
        email: email,
        password: password,
        phone: phone,
        department: department,
        designation: designation,
        event: assignedEvent

    };


    if (currentIndex === "") {

        organizers.push(organizer);

        alert("Organizer added successfully!");

    } else {

        organizers[Number(currentIndex)] = organizer;

        alert("Organizer details updated successfully!");

    }


    saveData();

    displayOrganizers();

    resetForm();

});


// EDIT ORGANIZER

function editOrganizer(index) {

    const organizer = organizers[index];

    document.getElementById("fullName").value = organizer.name;

    document.getElementById("email").value = organizer.email;

    document.getElementById("password").value = organizer.password;

    document.getElementById("phone").value = organizer.phone;

    document.getElementById("department").value = organizer.department;

    document.getElementById("designation").value = organizer.designation;

    document.getElementById("event").value = organizer.event;


    editIndex.value = index;

    document.getElementById("formHeading").textContent =
        "Update Organizer Details";

    document.getElementById("submitBtn").textContent =
        "Update Organizer";

    document.getElementById("password").required = false;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// DELETE ORGANIZER

function deleteOrganizer(index) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this organizer?"
    );

    if (confirmDelete) {

        organizers.splice(index, 1);

        saveData();

        displayOrganizers();

        resetForm();

        alert("Organizer deleted successfully!");

    }

}


// RESET FORM

function resetForm() {

    organizerForm.reset();

    editIndex.value = "";

    document.getElementById("formHeading").textContent =
        "Add New Organizer";

    document.getElementById("submitBtn").textContent =
        "+ Add Organizer";

    document.getElementById("password").required = true;

}


// CLEAR FORM BUTTON

document.getElementById("resetBtn").addEventListener("click", function() {

    resetForm();

});


// SEARCH ORGANIZER

searchInput.addEventListener("input", function() {

    const searchValue = this.value.toLowerCase();

    const filteredOrganizers = organizers.filter(organizer => {

        return organizer.name.toLowerCase().includes(searchValue) ||
               organizer.email.toLowerCase().includes(searchValue) ||
               organizer.department.toLowerCase().includes(searchValue) ||
               organizer.designation.toLowerCase().includes(searchValue) ||
               organizer.event.toLowerCase().includes(searchValue);

    });

    displayOrganizers(filteredOrganizers);

});


// INITIAL DISPLAY

displayOrganizers();

window.addEventListener("campusdatachange", function(event) {
    if (event.detail.key !== "campusOrganizers") {
        return;
    }

    organizers = JSON.parse(localStorage.getItem("campusOrganizers") || "[]");
    displayOrganizers();
});