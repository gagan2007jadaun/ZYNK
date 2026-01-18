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
        localStorage.setItem("zynkProfileUpdated", Date.now()); // Signal change

        // Also save avatar separately for easier access in feed
        if (currentImage) {
            localStorage.setItem("zynkAvatar", currentImage);
            localStorage.setItem("zynkAvatarUpdated", Date.now()); // Signal change for live updates
        }

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

    renderProfilePosts();

    // Listen for profile updates from other tabs
    window.addEventListener("storage", (event) => {
        if (event.key === "zynkProfileUpdated") {
            loadProfile();
        }
        if (event.key === "zynkAvatarUpdated") {
            // Also reload profile to get new avatar if saved in profile object (though we use separate key now)
            // But loadProfile uses zynkProfile object which includes image.
            // If zynkAvatarUpdated changed, zynkProfile might have too. 
            // Just strictly reloading on profile update is enough usually, but let's be safe.
            loadProfile();
        }
    });
});

// Helper to format time left string
function formatTimeLeft(diff) {
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (days > 0) return `${days}d ${hours}h left`;
    if (hours > 0) return `${hours}h ${minutes}m left`;
    // Show seconds if under an hour
    return `${minutes}m ${seconds}s left`;
}

// Helper to format time left (initial)
function getTimeLeft(expiry) {
    if (!expiry) return 'Forever ♾️';
    const now = Date.now();
    const diff = expiry - now;
    if (diff <= 0) return 'Expired';
    return formatTimeLeft(diff);
}

// Live Countdown Logic
setInterval(updateCountdowns, 1000);

function updateCountdowns() {
    const badges = document.querySelectorAll('.expiry-countdown');
    const now = Date.now();

    badges.forEach(badge => {
        const expiryStr = badge.getAttribute('data-expiry');

        // Handle Never/Null
        if (!expiryStr || expiryStr === 'null' || expiryStr === 'undefined') {
            badge.innerText = 'Forever ♾️';
            badge.classList.remove('animate-pulse', 'text-red-500', 'bg-red-500/10');
            badge.classList.add('text-orange-500', 'bg-orange-500/10');
            return;
        }

        const expiry = parseInt(expiryStr);
        if (isNaN(expiry)) { // Handle invalid parse
            badge.innerText = 'Forever ♾️';
            return;
        }

        const diff = expiry - now;

        if (diff <= 0) {
            badge.innerText = 'Expired';
            badge.classList.remove('animate-pulse', 'text-red-500', 'bg-red-500/10', 'text-orange-500', 'bg-orange-500/10');
            badge.classList.add('text-gray-500', 'bg-gray-500/10');
            return;
        }

        // URGENCY EFFECT (< 5 mins)
        if (diff < 5 * 60 * 1000) {
            badge.classList.add('animate-pulse', 'text-red-500', 'bg-red-500/10');
            badge.classList.remove('text-orange-500', 'bg-orange-500/10');
        } else {
            badge.classList.remove('animate-pulse', 'text-red-500', 'bg-red-500/10');
            badge.classList.add('text-orange-500', 'bg-orange-500/10');
        }

        badge.innerText = '🔥 ' + formatTimeLeft(diff);
    });
}

function renderProfilePosts() {
    const postsContainer = document.getElementById("profilePosts");
    const noPostsMsg = document.getElementById("noPostsMsg");

    // Fetch posts from localStorage
    const posts = JSON.parse(localStorage.getItem('zynk_posts') || '[]');
    const now = Date.now();

    // Filter valid posts (not expired)
    // Since this is a local-only app, all posts in 'zynk_posts' are considered "My Posts"
    const validPosts = posts.filter(p => !p.expiry || p.expiry > now);

    if (validPosts.length === 0) {
        postsContainer.innerHTML = '';
        if (noPostsMsg) noPostsMsg.classList.remove('hidden');
        return;
    }

    if (noPostsMsg) noPostsMsg.classList.add('hidden');

    postsContainer.innerHTML = validPosts.map(post => {
        const timeLeft = getTimeLeft(post.expiry);
        // Identity Badge Logic
        let identityBadge = '';
        if (post.identity === 'semi') identityBadge = '🎭 Semi';
        else if (post.identity === 'anon') identityBadge = '👻 Anon';
        else identityBadge = '👤 Public';

        const expiryTitle = post.expiry ? `Exports at ${new Date(post.expiry).toLocaleString()}` : 'Never expires';

        // Intent styling
        const intent = post.intent || 'vent';
        const intents = {
            'vent': { label: '😤 Just Venting', class: 'bg-red-500/10 text-red-500' },
            'thoughts': { label: '💭 Thoughts', class: 'bg-blue-500/10 text-blue-500' },
            'question': { label: '❓ Question', class: 'bg-yellow-500/10 text-yellow-500' },
            'advice': { label: '🆘 Advice', class: 'bg-orange-500/10 text-orange-500' },
            'debate': { label: '⚔️ Debate', class: 'bg-purple-500/10 text-purple-500' },
            'teach': { label: '🎓 Teach', class: 'bg-green-500/10 text-green-500' },
            'showcase': { label: '🌟 Showcase', class: 'bg-pink-500/10 text-pink-500' }
        };
        const intentStyle = intents[intent] || intents['vent'];

        return `
        <div id="post-${post.id}" class="p-6 border-b border-gray-200 dark:border-gray-800 transition-all hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer" onclick="window.location.href='post.html?id=${post.id}'">
          <div class="flex gap-4">
             <!-- Avatar -->
             <img src="${post.avatar || 'https://via.placeholder.com/40'}" 
                  class="${(post.author === 'You' || post.handle === '@you' || post.identity === 'public') ? 'post-avatar' : ''} w-10 h-10 rounded-full object-cover bg-gray-700 flex-shrink-0" 
                  alt="${post.author}">

            <div class="flex-1">
              <div class="flex justify-between items-start">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="font-semibold">${post.author}</span>
                  <span class="text-sm text-gray-500">${post.handle}</span>
                  <span class="text-xs bg-gray-200 dark:bg-gray-800 px-1.5 py-0.5 rounded text-gray-500">${identityBadge}</span>
                   <span class="text-xs ${intentStyle.class} px-2 py-0.5 rounded-full">${intentStyle.label}</span>
                </div>
                <span class="expiry-countdown text-xs font-mono text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-full transition-colors duration-500" 
                      title="${expiryTitle}"
                      data-expiry="${post.expiry || ''}">
                  🔥 ${timeLeft}
                </span>
              </div>
              
              <div class="mt-2 text-gray-800 dark:text-gray-200">
                <p id="text-${post.id}" class="${post.text.length > 150 ? 'line-clamp-3' : ''} whitespace-pre-wrap transition-all">${post.text}</p>
                ${post.text.length > 150 ? `<button onclick="event.stopPropagation(); toggleExpand('${post.id}')" class="text-xs text-zynk hover:underline mt-1">Show more</button>` : ''}
              </div>

               <!-- Render Attached Images -->
              ${post.images && post.images.length > 0 ? `
                  <div class="mt-3 flex gap-2 overflow-x-auto pb-2">
                      ${post.images.map(img => `<img src="${img}" class="h-32 w-auto rounded-lg border border-gray-200 dark:border-gray-800 object-cover">`).join('')}
                  </div>
              ` : ''}

               <!-- Render Attached GIF -->
               ${post.gif ? `<img src="${post.gif}" class="mt-2 rounded-xl border border-gray-200 dark:border-gray-800 max-h-60 object-cover">` : ''}
              
              <div class="flex gap-6 mt-4 text-gray-500 text-sm">
                <span class="hover:text-zynk transition cursor-pointer" onclick="event.stopPropagation(); alert('Reply coming soon')">Reply</span>
                <span class="${post.allowReposts !== false ? 'hover:text-zynk transition cursor-pointer' : 'opacity-50 cursor-not-allowed'}" onclick="event.stopPropagation()" title="${post.allowReposts !== false ? 'Repost' : 'Reposts disabled'}">Repost</span>
                <div class="like-container relative">
                   <button class="like-btn flex items-center gap-1 hover:text-zynk transition cursor-pointer select-none" onclick="event.stopPropagation(); toggleLike(this)">
                     <span class="like-fill"></span>
                     <span class="like-icon">Like</span>
                   </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        `;
    }).join('');

    // Check for "Thought Streak"
    checkThoughtStreak(posts);
}

function checkThoughtStreak(posts) {
    const now = Date.now();
    const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
    const streakBadge = document.getElementById('streakBadge');
    if (!streakBadge) return;

    // Filter posts from last 7 days from ALL posts (history matters for streaks)
    const recentPosts = posts.filter(p => (now - p.timestamp) < oneWeekMs);

    // Meaningful: Length > 50 OR Intent is 'thoughts', 'teach', 'debate'
    const deepIntents = ['thoughts', 'teach', 'debate'];

    const meaningfulCount = recentPosts.reduce((count, post) => {
        const isLong = post.text.length > 50;
        const isDeep = deepIntents.includes(post.intent);
        return (isLong || isDeep) ? count + 1 : count;
    }, 0);

    if (meaningfulCount >= 3) {
        streakBadge.classList.remove('hidden');
    } else {
        streakBadge.classList.add('hidden');
    }
}

// Add toggleExpand global needed for the onclick
window.toggleExpand = function (id) {
    const p = document.getElementById(`text-${id}`);
    const btn = p.nextElementSibling;
    p.classList.remove('line-clamp-3');
    if (btn) btn.remove();
}

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
