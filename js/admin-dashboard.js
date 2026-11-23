// SIDEBAR NAVIGATION

const menuLinks = document.querySelectorAll(".menu-link");
const sections = document.querySelectorAll(".content-section");

menuLinks.forEach(link => {

    link.addEventListener("click", function(event) {

        // Allow separate pages to open normally
        if (!this.getAttribute("href").startsWith("#")) {
            return;
        }

        event.preventDefault();

        // Remove active class from all links
        menuLinks.forEach(item => {
            item.classList.remove("active");
        });

        // Add active class to clicked link
        this.classList.add("active");

        // Hide all sections
        sections.forEach(section => {
            section.classList.remove("active-section");
        });

        // Show selected section
        const targetId = this.getAttribute("href").substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
            targetSection.classList.add("active-section");
        }

        // Close sidebar on mobile
        document.getElementById("sidebar").classList.remove("show-sidebar");

    });

});


// MOBILE SIDEBAR

const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");

menuToggle.addEventListener("click", function() {

    sidebar.classList.toggle("show-sidebar");

});


// CURRENT DATE

const currentDate = document.getElementById("currentDate");

const today = new Date();

currentDate.textContent = today.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
});


// DEMO MESSAGE

function showMessage(message) {

    alert(message);

}


// LOGOUT

document.getElementById("logoutBtn").addEventListener("click", function() {

    const confirmLogout = confirm("Are you sure you want to logout?");

    if (confirmLogout) {

        window.location.href = "../login.html";

    }

});


// DEFAULT SECTION

document.getElementById("overview").classList.add("active-section");