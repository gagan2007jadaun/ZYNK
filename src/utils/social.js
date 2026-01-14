// Social Graph Utils
const SOCIAL_KEYS = {
    FOLLOWING: 'zynk_following', // Users I follow
    FOLLOWERS: 'zynk_followers'  // Users following me (Mock/Local)
};

// Get list of handles I follow
function getFollowing() {
    return JSON.parse(localStorage.getItem(SOCIAL_KEYS.FOLLOWING) || '[]');
}

// Get list of handles following me (Mock logic since we don't have a real backend)
// For a local-only app, we can just store a number or a dummy list.
// Let's store a list to be future-proof.
function getFollowers() {
    return JSON.parse(localStorage.getItem(SOCIAL_KEYS.FOLLOWERS) || '[]');
}

// Check if I follow a user
function isFollowing(handle) {
    const following = getFollowing();
    return following.includes(handle);
}

// Follow a user
function followUser(handle) {
    if (!handle || handle === '@you') return; // Can't follow self (yet)

    const following = getFollowing();
    if (!following.includes(handle)) {
        following.push(handle);
        localStorage.setItem(SOCIAL_KEYS.FOLLOWING, JSON.stringify(following));

        // Dispatch event for UI updates
        window.dispatchEvent(new CustomEvent('zynkSocialUpdate', { detail: { type: 'follow', handle } }));
        return true;
    }
    return false;
}

// Unfollow a user
function unfollowUser(handle) {
    let following = getFollowing();
    if (following.includes(handle)) {
        following = following.filter(h => h !== handle);
        localStorage.setItem(SOCIAL_KEYS.FOLLOWING, JSON.stringify(following));

        // Dispatch event for UI updates
        window.dispatchEvent(new CustomEvent('zynkSocialUpdate', { detail: { type: 'unfollow', handle } }));
        return true;
    }
    return false;
}

// Toggle Follow
function toggleFollow(handle) {
    if (isFollowing(handle)) {
        unfollowUser(handle);
        return false; // Now not following
    } else {
        followUser(handle);
        return true; // Now following
    }
}

// Initialize with some dummy data if empty (for demo)
function initSocial() {
    if (!localStorage.getItem(SOCIAL_KEYS.FOLLOWING)) {
        // Maybe follow the 'admin' or 'zynk' bot by default?
        localStorage.setItem(SOCIAL_KEYS.FOLLOWING, JSON.stringify(['@zynk', '@gagan2020jadon']));
    }
    if (!localStorage.getItem(SOCIAL_KEYS.FOLLOWERS)) {
        // Dummy followers
        localStorage.setItem(SOCIAL_KEYS.FOLLOWERS, JSON.stringify(['@fan1', '@fan2', '@stranger']));
    }
}

// Run init
initSocial();
