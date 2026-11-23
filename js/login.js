const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const role = document.getElementById("role").value;

    if (email === "" || password === "" || role === "") {
        alert("Please fill all the fields.");
        return;
    }

    // Temporary frontend navigation

    if (role === "admin") {

        window.location.href = "admin/admin-dashboard.html";

    } 
    else if (role === "organizer") {

        window.location.href = "organizer/organizer-dashboard.html";

    } 
    else if (role === "student") {

        window.location.href = "student/student-dashboard.html";

    }

});