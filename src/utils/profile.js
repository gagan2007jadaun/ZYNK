// Profile Data Logic
const defaultProfile = {
    name: "You",
    username: "@you",
    bio: "Living in the moment. No stats, just vibes. 🌊",
    image: "" // Base64 string
};

let currentImage = ""; // State to hold the new image data

function loadProfile() {
    const savedProfile = JSON.parse(localStorage.getItem("zynkProfile")) || defaultProfile;

    // Update Text UI
    document.getElementById("displayName").textContent = savedProfile.name || defaultProfile.name;
    document.getElementById("displayUsername").textContent = savedProfile.username || defaultProfile.username;
    document.getElementById("displayBio").textContent = savedProfile.bio || defaultProfile.bio;

    // Update Image UI
    const avatarEl = document.getElementById("profileAvatar");
    if (savedProfile.image) {
        avatarEl.src = savedProfile.image;
    } else {
        // Default placeholder (using a data URI or just a color div logic, but here we use a placeholder logic)
        // Since we changed the div to an img, we need a valid src or a fallback. 
        // Let's use a generated placeholder or a blank one.
        // Actually, the previous code had a div with bg-gray-700. Since we are using an img tag now, let's allow it to be empty/styled or use a transparent gif, 
        // BUT better is to check if src is empty and maybe show a default SVG or keep the bg-color visible if src is empty.
        avatarEl.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236b7280'%3E%3Cpath d='M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z' /%3E%3C/svg%3E";
    }
}

function openEditModal() {
    const savedProfile = JSON.parse(localStorage.getItem("zynkProfile")) || defaultProfile;

    // Prefill inputs
    document.getElementById("editName").value = savedProfile.name || defaultProfile.name;
    document.getElementById("editUsername").value = savedProfile.username || defaultProfile.username;
    document.getElementById("editBio").value = savedProfile.bio || defaultProfile.bio;

    // Prefill Image
    currentImage = savedProfile.image || "";
    const previewEl = document.getElementById("editAvatarPreview");
    previewEl.src = currentImage || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236b7280'%3E%3Cpath d='M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z' /%3E%3C/svg%3E";

    // Show Modal
    document.getElementById("editProfileModal").classList.remove("hidden");
}

function closeEditModal() {
    document.getElementById("editProfileModal").classList.add("hidden");
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
            // COMPRESSION LOGIC (Canvas)
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Resize to 150x150 max
            const maxWidth = 150;
            const maxHeight = 150;
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                }
            }

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            // Convert to Base64 (JPEG 0.7 quality)
            currentImage = canvas.toDataURL('image/jpeg', 0.7);

            // Update Preview
            document.getElementById("editAvatarPreview").src = currentImage;
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function removeImage() {
    currentImage = "";
    document.getElementById("editAvatarPreview").src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236b7280'%3E%3Cpath d='M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z' /%3E%3C/svg%3E";
    document.getElementById("imageUpload").value = ""; // Reset file input
}

function saveProfile() {
    const newProfile = {
        name: document.getElementById("editName").value,
        username: document.getElementById("editUsername").value,
        bio: document.getElementById("editBio").value,
        image: currentImage // Save the image string
    };

    try {
        localStorage.setItem("zynkProfile", JSON.stringify(newProfile));

        // Refresh UI
        loadProfile();
        closeEditModal();

        // Optional: Alert success? 
        // alert("Profile saved!");
    } catch (e) {
        if (e.name === 'QuotaExceededError') {
            alert("Image is too large! Please choose a smaller image.");
        } else {
            console.error(e);
            alert("Failed to save profile.");
        }
    }
}

// Initial Load
document.addEventListener("DOMContentLoaded", () => {
    loadProfile();

    // Load cover image
    const coverImage = localStorage.getItem("zynkCover");
    if (coverImage) {
        document.getElementById("coverBg").style.backgroundImage = `url(${coverImage})`;
    }
});

// Upload & save cover image
window.uploadCover = function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function () {
        const base64Image = reader.result;
        document.getElementById("coverBg").style.backgroundImage = `url(${base64Image})`;
        localStorage.setItem("zynkCover", base64Image);
    };
    reader.readAsDataURL(file);
}
