// CAMPUS EVENTS - ADMIN SETTINGS

// LocalStorage helper
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

// DEFAULT SETTINGS
const defaultProfile = {
    name: "Administrator",
    email: "",
    phone: ""
};

const defaultSystem = {
    websiteName: "CampusEvents",
    collegeName: "",
    contactEmail: "",
    description: ""
};

const defaultEvent = {
    registrationStatus: "enabled",
    defaultCapacity: 100,
    approvalRequired: "yes"
};

const defaultNotifications = {
    eventNotifications: true,
    registrationNotifications: true,
    stallNotifications: true,
    feedbackNotifications: true
};

// Load settings
let profile = getSettings("campusAdminProfile", defaultProfile);
let system = getSettings("campusSystemSettings", defaultSystem);
let eventSettings = getSettings("campusEventSettings", defaultEvent);
let notificationSettings = getSettings(
    "campusNotificationSettings",
    defaultNotifications
);

// SIDEBAR TABS
const tabs = document.querySelectorAll(".settings-tab");
const sections = document.querySelectorAll(".settings-section");

tabs.forEach(tab => {
    tab.addEventListener("click", function() {
        tabs.forEach(item => item.classList.remove("active"));
        sections.forEach(section => section.classList.remove("active"));

        this.classList.add("active");

        const target = document.getElementById(this.dataset.target);

        if (target) {
            target.classList.add("active");
        }
    });
});

// LOAD PROFILE
function loadProfile() {
    document.getElementById("adminName").value = profile.name || "";
    document.getElementById("adminEmail").value = profile.email || "";
    document.getElementById("adminPhone").value = profile.phone || "";
}

// SAVE PROFILE
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

// PASSWORD FORM
document.getElementById("passwordForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const currentPassword = document.getElementById("currentPassword").value;
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

    alert(
        "Password form validation successful!\n\n" +
        "Actual password update will be available after Java backend integration."
    );

    this.reset();
});

// LOAD SYSTEM SETTINGS
function loadSystemSettings() {
    document.getElementById("websiteName").value = system.websiteName || "";
    document.getElementById("collegeName").value = system.collegeName || "";
    document.getElementById("contactEmail").value = system.contactEmail || "";
    document.getElementById("websiteDescription").value = system.description || "";
}

// SAVE SYSTEM SETTINGS
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

// LOAD EVENT SETTINGS
function loadEventSettings() {
    document.getElementById("registrationStatus").value =
        eventSettings.registrationStatus;

    document.getElementById("defaultCapacity").value =
        eventSettings.defaultCapacity;

    document.getElementById("approvalRequired").value =
        eventSettings.approvalRequired;
}

// SAVE EVENT SETTINGS
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

// LOAD NOTIFICATION SETTINGS
function loadNotificationSettings() {
    document.getElementById("eventNotifications").checked =
        notificationSettings.eventNotifications;

    document.getElementById("registrationNotifications").checked =
        notificationSettings.registrationNotifications;

    document.getElementById("stallNotifications").checked =
        notificationSettings.stallNotifications;

    document.getElementById("feedbackNotifications").checked =
        notificationSettings.feedbackNotifications;
}

// SAVE NOTIFICATION SETTINGS
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

// INITIAL LOAD
loadProfile();
loadSystemSettings();
loadEventSettings();
loadNotificationSettings();

window.addEventListener("campusdatachange", function(event) {
    const settingsLoaders = {
        campusAdminProfile: function() {
            profile = getSettings("campusAdminProfile", defaultProfile);
            loadProfile();
        },
        campusSystemSettings: function() {
            system = getSettings("campusSystemSettings", defaultSystem);
            loadSystemSettings();
        },
        campusEventSettings: function() {
            eventSettings = getSettings("campusEventSettings", defaultEvent);
            loadEventSettings();
        },
        campusNotificationSettings: function() {
            notificationSettings = getSettings(
                "campusNotificationSettings",
                defaultNotifications
            );
            loadNotificationSettings();
        }
    };

    if (settingsLoaders[event.detail.key]) {
        settingsLoaders[event.detail.key]();
    }
});