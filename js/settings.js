// CAMPUS EVENTS - ADMIN SETTINGS

function getSettings(key, defaults) {
    try {
        const saved = JSON.parse(localStorage.getItem(key));
        return saved && typeof saved === "object" ? saved : defaults;
    } catch (error) {
        return defaults;
    }
}

function saveSettings(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

const defaults = {
    profile: { name: "Administrator", email: "", phone: "" },
    system: { websiteName: "CampusEvents", collegeName: "", contactEmail: "", description: "" },
    event: { registrationStatus: "enabled", defaultCapacity: 100, approvalRequired: "yes" },
    notifications: { eventNotifications: true, registrationNotifications: true, stallNotifications: true, feedbackNotifications: true }
};

let profile = getSettings("campusAdminProfile", defaults.profile);
let system = getSettings("campusSystemSettings", defaults.system);
let eventSettings = getSettings("campusEventSettings", defaults.event);
let notificationSettings = getSettings("campusNotificationSettings", defaults.notifications);

document.querySelectorAll(".settings-tab").forEach(tab => {
    tab.addEventListener("click", function() {
        document.querySelectorAll(".settings-tab").forEach(item => item.classList.remove("active"));
        document.querySelectorAll(".settings-section").forEach(section => section.classList.remove("active"));
        this.classList.add("active");
        const target = document.getElementById(this.dataset.target);
        if (target) target.classList.add("active");
    });
});

function loadProfile() {
    document.getElementById("adminName").value = profile.name || "";
    document.getElementById("adminEmail").value = profile.email || "";
    document.getElementById("adminPhone").value = profile.phone || "";
}

document.getElementById("profileForm").addEventListener("submit", function(event) {
    event.preventDefault();
    profile = {
        name: document.getElementById("adminName").value.trim(),
        email: document.getElementById("adminEmail").value.trim(),
        phone: document.getElementById("adminPhone").value.trim()
    };
    saveSettings("campusAdminProfile", profile);
    alert("Admin profile saved successfully!");
});

document.getElementById("passwordForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    if (newPassword.length < 8) {
        alert("New password must contain at least 8 characters.");
        return;
    }
    if (newPassword !== confirmPassword) {
        alert("New password and confirm password do not match.");
        return;
    }
    alert("Password form validation successful!");
    this.reset();
});

function loadSystemSettings() {
    document.getElementById("websiteName").value = system.websiteName || "";
    document.getElementById("collegeName").value = system.collegeName || "";
    document.getElementById("contactEmail").value = system.contactEmail || "";
    document.getElementById("websiteDescription").value = system.description || "";
}

document.getElementById("systemForm").addEventListener("submit", function(event) {
    event.preventDefault();
    system = {
        websiteName: document.getElementById("websiteName").value.trim(),
        collegeName: document.getElementById("collegeName").value.trim(),
        contactEmail: document.getElementById("contactEmail").value.trim(),
        description: document.getElementById("websiteDescription").value.trim()
    };
    saveSettings("campusSystemSettings", system);
    alert("System settings saved successfully!");
});

function loadEventSettings() {
    document.getElementById("registrationStatus").value = eventSettings.registrationStatus;
    document.getElementById("defaultCapacity").value = eventSettings.defaultCapacity;
    document.getElementById("approvalRequired").value = eventSettings.approvalRequired;
}

document.getElementById("eventForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const capacity = Number(document.getElementById("defaultCapacity").value);
    if (!Number.isInteger(capacity) || capacity < 1) {
        alert("Please enter a valid event capacity.");
        return;
    }
    eventSettings = {
        registrationStatus: document.getElementById("registrationStatus").value,
        defaultCapacity: capacity,
        approvalRequired: document.getElementById("approvalRequired").value
    };
    saveSettings("campusEventSettings", eventSettings);
    alert("Event settings saved successfully!");
});

function loadNotificationSettings() {
    document.getElementById("eventNotifications").checked = notificationSettings.eventNotifications;
    document.getElementById("registrationNotifications").checked = notificationSettings.registrationNotifications;
    document.getElementById("stallNotifications").checked = notificationSettings.stallNotifications;
    document.getElementById("feedbackNotifications").checked = notificationSettings.feedbackNotifications;
}

document.getElementById("notificationForm").addEventListener("submit", function(event) {
    event.preventDefault();
    notificationSettings = {
        eventNotifications: document.getElementById("eventNotifications").checked,
        registrationNotifications: document.getElementById("registrationNotifications").checked,
        stallNotifications: document.getElementById("stallNotifications").checked,
        feedbackNotifications: document.getElementById("feedbackNotifications").checked
    };
    saveSettings("campusNotificationSettings", notificationSettings);
    alert("Notification preferences saved successfully!");
});

loadProfile();
loadSystemSettings();
loadEventSettings();
loadNotificationSettings();