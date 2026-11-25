const signupForm = document.getElementById("signupForm");

function readData(key) {
    try {
        const value = JSON.parse(localStorage.getItem(key));
        return Array.isArray(value) ? value : [];
    } catch (error) {
        return [];
    }
}

async function hashPassword(password) {
    if (!window.crypto || !window.crypto.subtle) {
        throw new Error("Secure password hashing is not supported in this browser.");
    }

    const encoded = new TextEncoder().encode(password);
    const digest = await window.crypto.subtle.digest("SHA-256", encoded);
    return Array.from(new Uint8Array(digest))
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
}

signupForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const student = {
        id: "student-" + Date.now(),
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim().toLowerCase(),
        phone: document.getElementById("phone").value.trim(),
        collegeId: document.getElementById("collegeId").value.trim(),
        course: document.getElementById("course").value.trim(),
        year: document.getElementById("year").value,
        registeredAt: new Date().toISOString(),
        status: "Active"
    };
    const password = document.getElementById("password").value;

    if (!student.name || !student.email || !password ||
        !student.phone || !student.collegeId || !student.course || !student.year) {
        alert("Please fill all the fields.");
        return;
    }

    if (password.length < 8) {
        alert("Password must contain at least 8 characters.");
        return;
    }

    if (!/^[0-9]{10}$/.test(student.phone)) {
        alert("Please enter a valid 10-digit phone number.");
        return;
    }

    let passwordHash;
    try {
        passwordHash = await hashPassword(password);
    } catch (error) {
        alert(error.message);
        return;
    }

    student.passwordHash = passwordHash;

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