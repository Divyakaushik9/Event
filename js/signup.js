const signupForm = document.getElementById("signupForm");

function readData(key) {
    try {
        return JSON.parse(localStorage.getItem(key)) || [];
    } catch (error) {
        return [];
    }
}

signupForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const student = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim().toLowerCase(),
        password: document.getElementById("password").value,
        phone: document.getElementById("phone").value.trim(),
        collegeId: document.getElementById("collegeId").value.trim(),
        course: document.getElementById("course").value.trim(),
        year: document.getElementById("year").value
    };

    if (!student.name || !student.email || !student.password ||
        !student.phone || !student.collegeId || !student.course || !student.year) {
        alert("Please fill all the fields.");
        return;
    }

    if (student.password.length < 8) {
        alert("Password must contain at least 8 characters.");
        return;
    }

    if (!/^[0-9]{10}$/.test(student.phone)) {
        alert("Please enter a valid 10-digit phone number.");
        return;
    }

    const students = readData("campusStudents");
    const duplicate = students.some(item =>
        item.email?.toLowerCase() === student.email ||
        (item.collegeId || item.collegeID)?.toLowerCase() === student.collegeId.toLowerCase()
    );

    if (duplicate) {
        alert("Email or College ID is already registered.");
        return;
    }

    students.push(student);
    localStorage.setItem("campusStudents", JSON.stringify(students));
    localStorage.setItem("campusCurrentStudent", student.email);

    alert("Account created successfully!");
    signupForm.reset();
    window.location.href = "login.html";
});