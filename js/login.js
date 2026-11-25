const loginForm = document.getElementById("loginForm");

async function hashPassword(password) {
    if (!window.crypto || !window.crypto.subtle) {
        throw new Error("Secure password verification is not supported in this browser.");
    }
    const encoded = new TextEncoder().encode(password);
    const digest = await window.crypto.subtle.digest("SHA-256", encoded);
    return Array.from(new Uint8Array(digest))
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
}

loginForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    if (email === "" || password === "" || role === "") {
        alert("Please fill all the fields.");
        return;
    }

    if (role === "student") {
        let students = [];
        try {
            students = JSON.parse(localStorage.getItem("campusStudents")) || [];
        } catch (error) {
            students = [];
        }

        const student = students.find(item =>
            (item.email || "").toLowerCase() === email
        );

        if (!student) {
            alert("Invalid student email or password.");
            return;
        }

        if (student.status && student.status !== "Active") {
            alert("This student account is inactive.");
            return;
        }

        let passwordMatches = false;
        if (student.passwordHash) {
            try {
                passwordMatches = student.passwordHash === await hashPassword(password);
            } catch (error) {
                alert(error.message);
                return;
            }
        } else {
            passwordMatches = student.password === password;
        }

        if (!passwordMatches) {
            alert("Invalid student email or password.");
            return;
        }

        localStorage.setItem("campusCurrentStudent", email);
    }

    if (role === "admin") {
        if (email !== "dollysingh702714@gmail.com" || password !== "905088") {
            alert("Invalid admin email or password.");
            return;
        }
        window.location.href = "admin/admin-dashboard.html";

    } 
    else if (role === "organizer") {
        if (email !== "divyakaushik931@gmail.com" || password !== "922051") {
            alert("Invalid organizer email or password.");
            return;
        }
        window.location.href = "organizer/organizer-dashboard.html";

    } 
    else if (role === "student") {

        window.location.href = "student/student-dashboard.html";

    }

});