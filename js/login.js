const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function(event) {

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

        const demoStudent =
            email === "rajbala82220@gmail.com" && password === "822280";

        if (!demoStudent && (!student || student.password !== password)) {
            alert("Invalid student email or password.");
            return;
        }

        if (demoStudent && !student) {
            students.push({
                name: "Raj Bala",
                email,
                password,
                phone: "8222800000",
                collegeId: "CE2026004",
                course: "BCA",
                year: "3rd Year"
            });
            localStorage.setItem("campusStudents", JSON.stringify(students));
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