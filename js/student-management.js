function readStudents() {
    try {
        const saved = JSON.parse(localStorage.getItem("campusStudents"));
        return Array.isArray(saved) ? saved : [];
    } catch (error) {
        return [];
    }
}

function normalizeStudent(student, index) {
    return {
        ...student,
        id: student.id || student.studentId || `student-${index + 1}`,
        name: (student.name || student.fullName || "").trim(),
        email: (student.email || "").trim().toLowerCase(),
        phone: (student.phone || student.phoneNumber || "").trim(),
        collegeId: (student.collegeId || student.collegeID || "").trim(),
        course: (student.course || student.department || "").trim(),
        year: student.year || "",
        registeredAt: student.registeredAt || student.createdAt || "",
        status: student.status || "Active"
    };
}

let students = readStudents().map(normalizeStudent);
const tableBody = document.getElementById("studentTableBody");
const totalStudents = document.getElementById("totalStudents");
const searchInput = document.getElementById("searchInput");
const modal = document.getElementById("studentModal");
const studentForm = document.getElementById("studentForm");

function saveData() {
    localStorage.setItem("campusStudents", JSON.stringify(students));
}

function formatRegistrationDate(value) {
    if (!value) return "-";
    const date = new Date(value);
    return Number.isNaN(date.getTime())
        ? value
        : date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
}

function displayStudents(data = students) {
    tableBody.replaceChildren();
    totalStudents.textContent = students.length;
    document.getElementById("emptyMessage").style.display =
        data.length === 0 ? "block" : "none";

    data.forEach(student => {
        const originalIndex = students.findIndex(item =>
            String(item.id) === String(student.id)
        );
        const row = document.createElement("tr");
        const values = [
            student.collegeId || "-",
            student.name || "-",
            student.email || "-",
            student.phone || "-",
            student.course || "-",
            student.year || "-",
            formatRegistrationDate(student.registeredAt)
        ];

        values.forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        const actionCell = document.createElement("td");
        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.textContent = "Edit";
        editButton.className = "action-btn edit-btn";
        editButton.addEventListener("click", () => editStudent(originalIndex));

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";
        deleteButton.className = "action-btn delete-btn";
        deleteButton.addEventListener("click", () => deleteStudent(originalIndex));

        actionCell.append(editButton, deleteButton);
        row.appendChild(actionCell);
        tableBody.appendChild(row);
    });
}

function closeModal() {
    modal.classList.remove("show");
}

document.getElementById("addStudentBtn").addEventListener("click", () => {
    studentForm.reset();
    document.getElementById("editIndex").value = "";
    document.getElementById("modalTitle").textContent = "Add New Student";
    modal.classList.add("show");
});

document.getElementById("closeModal").addEventListener("click", closeModal);
document.getElementById("cancelBtn").addEventListener("click", closeModal);

studentForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const student = {
        name: document.getElementById("studentName").value.trim(),
        email: document.getElementById("studentEmail").value.trim().toLowerCase(),
        phone: document.getElementById("studentPhone").value.trim(),
        collegeId: document.getElementById("collegeId").value.trim(),
        course: document.getElementById("studentCourse").value.trim(),
        year: document.getElementById("studentYear").value,
        status: "Active"
    };

    if (!/^[0-9]{10}$/.test(student.phone)) {
        alert("Please enter a valid 10-digit phone number.");
        return;
    }

    const editIndexValue = document.getElementById("editIndex").value;
    const editIndex = editIndexValue === "" ? -1 : Number(editIndexValue);

    const duplicate = students.some((item, index) =>
        index !== editIndex &&
        (item.email.toLowerCase() === student.email ||
         item.collegeId.toLowerCase() === student.collegeId.toLowerCase())
    );

    if (duplicate) {
        alert("Email or College ID already exists.");
        return;
    }

    if (editIndex >= 0) {
        const existing = students[editIndex];
        students[editIndex] = {
            ...existing,
            ...student
        };
        alert("Student details updated successfully.");
    } else {
        student.id = "student-" + Date.now();
        student.registeredAt = new Date().toISOString();
        students.push(student);
        alert("Student added successfully.");
    }

    saveData();
    displayStudents();
    closeModal();
    studentForm.reset();
});

function editStudent(index) {
    if (index < 0) return;
    const student = students[index];
    document.getElementById("editIndex").value = String(index);
    document.getElementById("studentName").value = student.name || "";
    document.getElementById("studentEmail").value = student.email || "";
    document.getElementById("studentPhone").value = student.phone || "";
    document.getElementById("collegeId").value = student.collegeId || "";
    document.getElementById("studentCourse").value = student.course || "";
    document.getElementById("studentYear").value = student.year || "";
    document.getElementById("modalTitle").textContent = "Edit Student";
    modal.classList.add("show");
}

function deleteStudent(index) {
    if (index < 0) return;
    const student = students[index];
    const confirmed = confirm(
        `Delete ${student.name || "this student"} (${student.email || "no email"}) permanently?`
    );
    if (!confirmed) return;

    students.splice(index, 1);
    saveData();
    displayStudents();
    alert("Student deleted successfully.");
}

searchInput.addEventListener("input", function() {
    const searchText = this.value.trim().toLowerCase();
    const filtered = students.filter(student =>
        String(student.name || "").toLowerCase().includes(searchText) ||
        String(student.email || "").toLowerCase().includes(searchText) ||
        String(student.collegeId || "").toLowerCase().includes(searchText) ||
        String(student.phone || "").toLowerCase().includes(searchText) ||
        String(student.course || "").toLowerCase().includes(searchText) ||
        String(student.year || "").toLowerCase().includes(searchText)
    );
    displayStudents(filtered);
});

displayStudents();

window.addEventListener("campusdatachange", function(event) {
    if (event.detail.key !== "campusStudents") return;
    students = readStudents().map(normalizeStudent);
    displayStudents();
});
