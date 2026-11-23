const signupForm = document.getElementById("signupForm");

signupForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const phone = document.getElementById("phone").value.trim();
    const collegeId = document.getElementById("collegeId").value.trim();
    const course = document.getElementById("course").value.trim();
    const year = document.getElementById("year").value;

    if (!name || !email || !password || !phone ||
        !collegeId || !course || !year) {

        alert("Please fill all the fields.");
        return;
    }

    if (password.length < 8) {
        alert("Password must contain at least 8 characters.");
        return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
        alert("Please enter a valid 10-digit phone number.");
        return;
    }

    alert("Registration form submitted successfully! Database connection will be added later.");

    signupForm.reset();

});