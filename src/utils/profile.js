// Profile Data Logic
const defaultProfile = {
    name: "You",
    username: "@you",
    bio: "Living in the moment. No stats, just vibes. 🌊"
};

function loadProfile() {
    const savedProfile = JSON.parse(localStorage.getItem("zynkProfile")) || defaultProfile;

    // Update UI
    document.getElementById("displayName").textContent = savedProfile.name;
    document.getElementById("displayUsername").textContent = savedProfile.username;
    document.getElementById("displayBio").textContent = savedProfile.bio;
}

function openEditModal() {
    const savedProfile = JSON.parse(localStorage.getItem("zynkProfile")) || defaultProfile;

    // Prefill inputs
    document.getElementById("editName").value = savedProfile.name;
    document.getElementById("editUsername").value = savedProfile.username;
    document.getElementById("editBio").value = savedProfile.bio;

    // Show Modal
    document.getElementById("editProfileModal").classList.remove("hidden");
}

function closeEditModal() {
    document.getElementById("editProfileModal").classList.add("hidden");
}

function saveProfile() {
    const newProfile = {
        name: document.getElementById("editName").value,
        username: document.getElementById("editUsername").value,
        bio: document.getElementById("editBio").value
    };

    localStorage.setItem("zynkProfile", JSON.stringify(newProfile));

    // Refresh UI
    loadProfile();
    closeEditModal();

    // Visual Feedback (optional but nice)
    // alert("Profile updated! 🌟"); 
}

// Initial Load
document.addEventListener("DOMContentLoaded", loadProfile);
