# CampusEvents - Complete Technical Flow

## Frontend Technologies

1. HTML5 is used to create pages, forms, tables, and navigation.
2. CSS3 is used for layout, colors, responsive design, and page styling.
3. JavaScript is used for validation, CRUD operations, filtering, and UI updates.
4. Browser DOM APIs are used to read form values and update tables dynamically.
5. `localStorage` is used as frontend temporary and offline data storage.
6. Web Crypto SHA-256 is used to hash student passwords in the browser.
7. Custom JavaScript events synchronize module UI updates.
8. Responsive media queries make the application usable on mobile screens.

## Backend Technologies

9. Firebase Realtime Database is used as the backend database.
10. Firebase JavaScript Compat SDK connects the frontend to Firebase.
11. `/campusData` is the main database node.
12. Firebase real-time listeners synchronize data across tabs and devices.
13. Firebase Security Rules control database read and write permissions.
14. Firebase Hosting or a static HTTPS server can host the application.
15. Firebase Authentication is recommended for production login.
16. Role-based custom claims are recommended for Admin and Organizer access.

## Frontend Flow

17. `index.html` is the landing page.
18. `login.html` provides role-based login.
19. `signup.html` provides student registration.
20. `admin/` contains administrator pages.
21. `organizer/` contains organizer pages.
22. `student/` contains student pages.
23. `css/` contains page-specific styles.
24. `js/` contains page-specific JavaScript modules.
25. Login form collects email, password, and selected role.
26. Admin redirects to `admin/admin-dashboard.html`.
27. Organizer redirects to `organizer/organizer-dashboard.html`.
28. Student redirects to `student/student-dashboard.html`.
29. JavaScript prevents normal form submission with `event.preventDefault()`.
30. Required fields, passwords, phones, emails, and duplicates are validated.

## Firebase Synchronization Flow

31. Firebase-enabled pages load `js/firebase-bootstrap.js`.
32. The `data-app` attribute identifies the page JavaScript module.
33. Firebase App SDK is loaded from Google CDN.
34. Firebase Realtime Database SDK is loaded.
35. Firebase is initialized using project configuration.
36. The database reference reads `/campusData`.
37. Remote Firebase values are copied to localStorage.
38. Missing local keys are uploaded to Firebase.
39. Pending writes are tracked during offline or loading conditions.
40. Firebase real-time listeners broadcast database changes.
41. Open browser tabs receive synchronized data.
42. `campusdatachange` refreshes the affected module UI.

## Student Signup Flow

43. Student enters name, email, password, phone, College ID, course, and year.
44. Password must contain at least eight characters.
45. Phone number must contain exactly 10 digits.
46. Email and College ID are normalized.
47. Duplicate email is rejected.
48. Duplicate College ID is rejected.
49. Password is converted to a SHA-256 hash.
50. Unique student ID, registration date, and Active status are generated.
51. Student is added to `campusStudents`.
52. Student data is saved to localStorage.
53. Firebase synchronizes the student record.
54. Signup redirects to the login page.

## Login Flow

55. Student email is converted to lowercase.
56. Student account is found in `campusStudents`.
57. Account existence is checked.
58. Account status must be Active.
59. Entered password hash is compared with the stored hash.
60. Invalid or deleted accounts are rejected.
61. Student email is saved in `campusCurrentStudent`.
62. Admin and Organizer credentials are checked by role-specific frontend logic.
63. Role-specific dashboard is opened after successful login.

## Student Management Backend Flow

64. `campusStudents` stores the complete student dataset.
65. Admin student page loads records from localStorage.
66. Firebase remote updates replace or add local records.
67. Student table displays ID, name, email, phone, course, year, and registration date.
68. Search filters name, email, College ID, phone, course, and year.
69. Add Student validates duplicate email and College ID.
70. Edit Student preserves existing account ID and password data.
71. Delete Student displays a confirmation dialog.
72. Canceling delete keeps the student record.
73. Confirming delete removes the student from `campusStudents`.
74. Firebase receives the student deletion.
75. Deleted accounts cannot log in.

## Event Flow

76. Admin creates, edits, or deletes events.
77. Event details include name, category, date, venue, time, description, and facilities.
78. Events are stored in `campusEvents`.
79. Student dashboard loads and displays available events.
80. Student registration stores student, College ID, event, date, and status.
81. Registrations are stored in `campusRegistrations`.
82. Duplicate student/event registration is blocked.
83. Organizer dashboard reads participant registrations.

## Other Backend Modules

84. Competitions are stored in `campusCompetitions`.
85. Stall applications are stored in `campusStallApplications`.
86. Volunteer assignments are stored in `campusVolunteers`.
87. Feedback is stored in `campusFeedback`.
88. Announcements are stored in `campusAnnouncements`.
89. Student feedback includes event, rating, comment, date, and status.
90. Admin can review, change, or delete feedback.

## Admin Dashboard and Reports

91. Dashboard reads student, event, volunteer, and stall counts.
92. Recent events are rendered from `campusEvents`.
93. Reports calculate registrations, stalls, feedback, and ratings.
94. Dashboard updates when synchronized data changes.

## Cross-Page Real-Time Flow

95. One page updates localStorage.
96. `firebase-bootstrap.js` writes the value to Firebase.
97. Firebase broadcasts the new value.
98. Other tabs apply the value and refresh their modules.

## Offline and Production Flow

99. Firebase unavailable mode preserves data in localStorage.
100. Production should use Firebase Authentication, HTTPS, custom claims, Security Rules, and server-side validation.
