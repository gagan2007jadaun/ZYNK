// Social Graph Utils
const SOCIAL_KEYS = {
    IN_ORBIT: 'zynk_in_orbit', // Users I am tracking ("Following")
    ORBIT: 'zynk_orbit'        // Users tracking me ("Followers")
};

// Get list of handles I am tracking (In Orbit)
function getInOrbit() {
    return JSON.parse(localStorage.getItem(SOCIAL_KEYS.IN_ORBIT) || '[]');
}

// Get list of handles tracking me (Orbit)
function getOrbit() {
    return JSON.parse(localStorage.getItem(SOCIAL_KEYS.ORBIT) || '[]');
}

// Check if I am tracking a user (Is in my Orbit?)
function isInOrbit(handle) {
    const inOrbit = getInOrbit();
    return inOrbit.includes(handle);
}

// Add user to Orbit (Follow)
function addToOrbit(handle) {
    if (!handle || handle === '@you') return; // Can't orbit self (yet)

    const inOrbit = getInOrbit();
    if (!inOrbit.includes(handle)) {
        inOrbit.push(handle);
        localStorage.setItem(SOCIAL_KEYS.IN_ORBIT, JSON.stringify(inOrbit));

        // Dispatch event for UI updates
        window.dispatchEvent(new CustomEvent('zynkSocialUpdate', { detail: { type: 'orbit', handle } }));
        return true;
    }
    return false;
}

// Remove user from Orbit (Unfollow)
function removeFromOrbit(handle) {
    let inOrbit = getInOrbit();
    if (inOrbit.includes(handle)) {
        inOrbit = inOrbit.filter(h => h !== handle);
        localStorage.setItem(SOCIAL_KEYS.IN_ORBIT, JSON.stringify(inOrbit));

        // Dispatch event for UI updates
        window.dispatchEvent(new CustomEvent('zynkSocialUpdate', { detail: { type: 'unorbit', handle } }));
        return true;
    }
    return false;
}

// Toggle Orbit
function toggleOrbit(handle) {
    if (isInOrbit(handle)) {
        removeFromOrbit(handle);
        return false; // Now not in orbit
    } else {
        addToOrbit(handle);
        return true; // Now in orbit
    }
}

// Remove someone from MY Orbit (Remove Follower)
function removeOrbiter(handle) {
    let orbit = getOrbit();
    if (orbit.includes(handle)) {
        orbit = orbit.filter(h => h !== handle);
        localStorage.setItem(SOCIAL_KEYS.ORBIT, JSON.stringify(orbit));
        // Dispatch event
        window.dispatchEvent(new CustomEvent('zynkSocialUpdate', { detail: { type: 'removeOrbit', handle } }));
        return true;
    }
    return false;
}

// Initialize with some dummy data if empty (for demo)
function initSocial() {
    if (!localStorage.getItem(SOCIAL_KEYS.IN_ORBIT)) {
        // Maybe orbit the 'admin' or 'zynk' bot by default?
        localStorage.setItem(SOCIAL_KEYS.IN_ORBIT, JSON.stringify(['@zynk', '@gagan2020jadon']));
    }
    if (!localStorage.getItem(SOCIAL_KEYS.ORBIT)) {
        // Dummy orbiters
        localStorage.setItem(SOCIAL_KEYS.ORBIT, JSON.stringify(['@fan1', '@fan2', '@stranger']));
    }
}

// Run init
initSocial();
