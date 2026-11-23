// DEMO STUDENT DATA

let students = JSON.parse(localStorage.getItem("campusStudents")) || [
    {
        name: "Rahul Sharma",
        email: "rahul@example.com",
        phone: "9876543210",
        collegeId: "CE2026001",
        course: "BCA",
        year: "3rd Year"
    },
    {
        name: "Priya Verma",
        email: "priya@example.com",
        phone: "9876543211",
        collegeId: "CE2026002",
        course: "B.Tech",
        year: "2nd Year"
    },
    {
        name: "Aman Kumar",
        email: "aman@example.com",
        phone: "9876543212",
        collegeId: "CE2026003",
        course: "BCA",
        year: "1st Year"
    }
];

const tableBody = document.getElementById("studentTableBody");
const totalStudents = document.getElementById("totalStudents");
const searchInput = document.getElementById("searchInput");

const modal = document.getElementById("studentModal");
const studentForm = document.getElementById("studentForm");


// SAVE DATA IN BROWSER

function saveData() {
    localStorage.setItem("campusStudents", JSON.stringify(students));
}


// DISPLAY STUDENTS

function displayStudents(data = students) {

    tableBody.innerHTML = "";

    totalStudents.textContent = students.length;

    document.getElementById("emptyMessage").style.display =
        data.length === 0 ? "block" : "none";

    data.forEach(student => {

        const originalIndex = students.indexOf(student);

        const row = document.createElement("tr");

        const values = [
            student.collegeId,
            student.name,
            student.email,
            student.phone,
            student.course,
            student.year
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
        editButton.addEventListener("click", () => editStudent(originalIndex));

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "action-btn delete-btn";
        deleteButton.addEventListener("click", () => deleteStudent(originalIndex));

        actionCell.append(editButton, deleteButton);
        row.appendChild(actionCell);

        tableBody.appendChild(row);

    });
}


// OPEN ADD STUDENT MODAL

document.getElementById("addStudentBtn").addEventListener("click", () => {

    studentForm.reset();

    document.getElementById("editIndex").value = "";
    document.getElementById("modalTitle").textContent = "Add New Student";

    modal.classList.add("show");

});


// CLOSE MODAL

function closeModal() {
    modal.classList.remove("show");
}

document.getElementById("closeModal").addEventListener("click", closeModal);
document.getElementById("cancelBtn").addEventListener("click", closeModal);


// ADD OR UPDATE STUDENT

studentForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const student = {

        name: document.getElementById("studentName").value.trim(),
        email: document.getElementById("studentEmail").value.trim(),
        phone: document.getElementById("studentPhone").value.trim(),
        collegeId: document.getElementById("collegeId").value.trim(),
        course: document.getElementById("studentCourse").value.trim(),
        year: document.getElementById("studentYear").value

    };

    const editIndex = document.getElementById("editIndex").value;

    // CHECK DUPLICATE EMAIL AND COLLEGE ID

    const duplicate = students.some((item, index) => {

        if (index === Number(editIndex)) {
            return false;
        }

        return item.email.toLowerCase() === student.email.toLowerCase()
            || item.collegeId.toLowerCase() === student.collegeId.toLowerCase();

    });

    if (duplicate) {
        alert("Email or College ID already exists!");
        return;
    }

    if (editIndex === "") {

        students.push(student);
        alert("Student added successfully!");

    } else {

        students[Number(editIndex)] = student;
        alert("Student updated successfully!");

    }

    saveData();
    displayStudents();
    closeModal();
    studentForm.reset();

});


// EDIT STUDENT

function editStudent(index) {

    const student = students[index];

    document.getElementById("editIndex").value = index;
    document.getElementById("studentName").value = student.name;
    document.getElementById("studentEmail").value = student.email;
    document.getElementById("studentPhone").value = student.phone;
    document.getElementById("collegeId").value = student.collegeId;
    document.getElementById("studentCourse").value = student.course;
    document.getElementById("studentYear").value = student.year;

    document.getElementById("modalTitle").textContent = "Edit Student";

    modal.classList.add("show");

}


// DELETE STUDENT

function deleteStudent(index) {

    const confirmDelete = confirm("Are you sure you want to delete this student?");

    if (confirmDelete) {

        students.splice(index, 1);

        saveData();
        displayStudents();

        alert("Student deleted successfully!");

    }

}


// SEARCH STUDENT

searchInput.addEventListener("input", function() {

    const searchText = this.value.toLowerCase();

    const filteredStudents = students.filter(student => {

        return student.name.toLowerCase().includes(searchText)
            || student.email.toLowerCase().includes(searchText)
            || student.collegeId.toLowerCase().includes(searchText);

    });

    displayStudents(filteredStudents);

});


// INITIAL DISPLAY

displayStudents();