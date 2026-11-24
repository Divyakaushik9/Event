(function() {
    const bootstrapScript = document.currentScript;
    const applicationPath = bootstrapScript.dataset.app;
    const firebaseVersion = "10.14.1";
    const dataPath = "campusData";
    const firebaseConfig = {
        apiKey: "AIzaSyCkL1D6bUwSm2xpvrv5proX7-ZQGh88c7M",
        authDomain: "event-9e824.firebaseapp.com",
        databaseURL: "https://event-9e824-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "event-9e824",
        storageBucket: "event-9e824.firebasestorage.app",
        messagingSenderId: "491278562966",
        appId: "1:491278562966:web:0f1e075b87dc25f17a34b7",
        measurementId: "G-BTWTCDZFMD"
    };

    const localStorageSetItem = Storage.prototype.setItem;
    const localStorageRemoveItem = Storage.prototype.removeItem;
    const localStorageGetItem = Storage.prototype.getItem;
    let database = null;
    let syncReady = false;
    let applyingRemoteData = false;
    let applicationLoaded = false;
    const pendingWrites = new Map();
    const status = document.createElement("div");

    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    status.style.cssText =
        "position:fixed;right:16px;bottom:16px;z-index:9999;padding:9px 13px;" +
        "border-radius:8px;background:#172554;color:#fff;font:12px Arial,sans-serif;" +
        "box-shadow:0 3px 12px rgba(15,23,42,.2);";
    status.textContent = "Connecting to Firebase...";
    document.body.appendChild(status);

    function showStatus(message, error) {
        status.textContent = message;
        status.style.background = error ? "#991b1b" : "#172554";

        if (error) {
            console.error("Firebase data sync:", error);
            status.title = error.message || String(error);
        }
    }

    function isSyncKey(key) {
        return typeof key === "string" &&
            /^campus[A-Za-z0-9_-]*$/.test(key);
    }

    function localDataKeys() {
        const keys = [];

        for (let index = 0; index < localStorage.length; index += 1) {
            const key = localStorage.key(index);
            if (isSyncKey(key)) {
                keys.push(key);
            }
        }

        return keys;
    }

    function toStorageValue(value) {
        return typeof value === "string" ? value : JSON.stringify(value);
    }

    function toDatabaseValue(value) {
        try {
            return JSON.parse(value);
        } catch (error) {
            return String(value);
        }
    }

    function dispatchDataChange(key) {
        window.dispatchEvent(new CustomEvent("campusdatachange", {
            detail: { key: key }
        }));
    }

    function applyRemoteValue(key, value) {
        if (!isSyncKey(key) || value === null || value === undefined) {
            return;
        }

        const storageValue = toStorageValue(value);
        const previousValue = localStorageGetItem.call(localStorage, key);

        if (previousValue !== storageValue) {
            applyingRemoteData = true;
            localStorageSetItem.call(localStorage, key, storageValue);
            applyingRemoteData = false;
            dispatchDataChange(key);
        }
    }

    function publishValue(key, value) {
        if (!database || !syncReady) {
            pendingWrites.set(key, value);
            return;
        }

        database.ref(dataPath).child(key).set(toDatabaseValue(value)).catch(error => {
            showStatus("Firebase write failed. Local data is preserved.", error);
        });
    }

    Storage.prototype.setItem = function(key, value) {
        localStorageSetItem.call(this, key, value);

        if (this === localStorage && isSyncKey(key) && !applyingRemoteData) {
            const storageValue = String(value);
            pendingWrites.set(key, storageValue);
            publishValue(key, storageValue);
        }
    };

    Storage.prototype.removeItem = function(key) {
        localStorageRemoveItem.call(this, key);

        if (this === localStorage && isSyncKey(key) && !applyingRemoteData) {
            pendingWrites.delete(key);
            if (database && syncReady) {
                database.ref(dataPath).child(key).remove().catch(error => {
                    showStatus("Firebase delete failed. Local data is preserved.", error);
                });
            }
        }
    };

    function loadApplication() {
        if (applicationLoaded) {
            return;
        }
        applicationLoaded = true;

        if (!applicationPath) {
            showStatus("Firebase loaded, but this page has no app script.");
            return;
        }

        const applicationScript = document.createElement("script");
        applicationScript.src = new URL(applicationPath, bootstrapScript.src).href;
        applicationScript.onerror = function() {
            showStatus("The page application script could not be loaded.");
        };
        document.body.appendChild(applicationScript);
    }

    function loadFirebaseScript(filename) {
        return new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src =
                "https://www.gstatic.com/firebasejs/" +
                firebaseVersion + "/" + filename;
            script.onload = resolve;
            script.onerror = function() {
                reject(new Error("Could not load " + filename));
            };
            document.head.appendChild(script);
        });
    }

    function synchronizeInitialData() {
        const dataReference = database.ref(dataPath);

        return dataReference.once("value").then(snapshot => {
            const remoteData = snapshot.val() || {};
            const uploads = [];

            if (typeof remoteData !== "object" || Array.isArray(remoteData)) {
                throw new TypeError("Firebase campusData must be an object.");
            }

            Object.keys(remoteData).forEach(key => {
                if (isSyncKey(key)) {
                    applyRemoteValue(key, remoteData[key]);
                }
            });

            localDataKeys().forEach(key => {
                if (!Object.prototype.hasOwnProperty.call(remoteData, key)) {
                    const localValue = localStorageGetItem.call(localStorage, key);
                    uploads.push(
                        dataReference.child(key).set(toDatabaseValue(localValue))
                    );
                }
            });

            return Promise.all(uploads);
        }).then(() => {
            syncReady = true;

            pendingWrites.forEach((value, key) => {
                publishValue(key, value);
            });
            pendingWrites.clear();

            dataReference.on("value", snapshot => {
                const remoteData = snapshot.val() || {};

                Object.keys(remoteData).forEach(key => {
                    if (isSyncKey(key)) {
                        applyRemoteValue(key, remoteData[key]);
                    }
                });

                localDataKeys().forEach(key => {
                    if (!Object.prototype.hasOwnProperty.call(remoteData, key)) {
                        applyingRemoteData = true;
                        localStorageRemoveItem.call(localStorage, key);
                        applyingRemoteData = false;
                        dispatchDataChange(key);
                    }
                });
            }, error => {
                showStatus("Firebase listener failed. Local data is preserved.", error);
            });

            showStatus("Connected to Firebase. Data sync is active.");
        });
    }

    loadFirebaseScript("firebase-app-compat.js")
        .then(() => loadFirebaseScript("firebase-database-compat.js"))
        .then(() => {
            if (!window.firebase || !window.firebase.database) {
                throw new Error("Firebase Realtime Database SDK did not initialize.");
            }

            if (!window.firebase.apps.length) {
                window.firebase.initializeApp(firebaseConfig);
            }

            database = window.firebase.database();
            return synchronizeInitialData();
        })
        .then(loadApplication)
        .catch(error => {
            showStatus("Firebase unavailable. Using local browser data.", error);
            loadApplication();
        });
})();
