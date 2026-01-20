// Profile Data Logic
const defaultProfile = {
    name: "You",
    username: "@you",
    bio: "Living in the moment. No stats, just vibes. 🌊",
    image: "" // Base64 string
};

let currentImage = ""; // State to hold the new image data
let currentTab = "thoughts"; // Default tab

function loadProfile() {
    const savedProfile = JSON.parse(localStorage.getItem("zynkProfile")) || defaultProfile;

    // Update Text UI
    document.getElementById("displayName").textContent = savedProfile.name || defaultProfile.name;
    document.getElementById("displayUsername").textContent = savedProfile.username || defaultProfile.username;
    document.getElementById("displayBio").textContent = savedProfile.bio || defaultProfile.bio;

    // Update Extended Info
    const locEl = document.getElementById("displayLocation");
    if (savedProfile.location) {
        locEl.classList.remove("hidden");
        locEl.classList.add("flex");
        locEl.querySelector("span").textContent = savedProfile.location;
    } else {
        locEl.classList.add("hidden");
        locEl.classList.remove("flex");
    }

    const webEl = document.getElementById("displayWebsite");
    if (savedProfile.website) {
        webEl.classList.remove("hidden");
        webEl.classList.add("flex");
        webEl.querySelector("span").textContent = savedProfile.website.replace(/^https?:\/\//, '');
        webEl.href = savedProfile.website.startsWith('http') ? savedProfile.website : `https://${savedProfile.website}`;
    } else {
        webEl.classList.add("hidden");
        webEl.classList.remove("flex");
    }

    const dobEl = document.getElementById("displayDob");
    if (savedProfile.dob) {
        dobEl.classList.remove("hidden");
        dobEl.classList.add("flex");
        // Format DOB nicely
        const date = new Date(savedProfile.dob);
        dobEl.querySelector("span").textContent = date.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
    } else {
        dobEl.classList.add("hidden");
        dobEl.classList.remove("flex");
    }

    // Update Joined Date
    const joinedEl = document.getElementById("displayJoined");
    if (!savedProfile.joinedIn) {
        // If legacy user without joined date, set it to now and save silently
        savedProfile.joinedIn = Date.now();
        localStorage.setItem("zynkProfile", JSON.stringify(savedProfile));
    }

    if (savedProfile.joinedIn) {
        joinedEl.classList.remove("hidden");
        joinedEl.classList.add("flex");
        const joinedDate = new Date(savedProfile.joinedIn);
        joinedEl.querySelector("span").textContent = `Joined ${joinedDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}`;
    }

    // Update Image UI
    const avatarEl = document.getElementById("profileAvatar");
    if (savedProfile.image) {
        avatarEl.src = savedProfile.image;
    } else {
        avatarEl.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236b7280'%3E%3Cpath d='M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z' /%3E%3C/svg%3E";
    }
}

function openEditModal() {
    const savedProfile = JSON.parse(localStorage.getItem("zynkProfile")) || defaultProfile;

    // Prefill inputs
    document.getElementById("editName").value = savedProfile.name || defaultProfile.name;
    document.getElementById("editUsername").value = savedProfile.username || defaultProfile.username;
    document.getElementById("editBio").value = savedProfile.bio || defaultProfile.bio;
    document.getElementById("editLocation").value = savedProfile.location || "";
    document.getElementById("editWebsite").value = savedProfile.website || "";
    document.getElementById("editDob").value = savedProfile.dob || "";

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
        location: document.getElementById("editLocation").value,
        website: document.getElementById("editWebsite").value,
        dob: document.getElementById("editDob").value,
        joinedIn: (JSON.parse(localStorage.getItem("zynkProfile")) || {}).joinedIn || Date.now(),
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
    } catch (e) {
        if (e.name === 'QuotaExceededError') {
            alert("Image is too large! Please choose a smaller image.");
        } else {
            console.error(e);
            alert("Failed to save profile.");
        }
    }
}

function switchTab(tab) {
    currentTab = tab;

    // Update Tab UI
    const tabs = ['thoughts', 'highlights', 'insights', 'likes', 'replies', 'media'];
    tabs.forEach(t => {
        const el = document.getElementById(`tab-${t}`);
        if (t === tab) {
            el.classList.remove('text-gray-500', 'border-transparent');
            el.classList.add('border-zynk', 'text-gray-900', 'dark:text-white');
        } else {
            el.classList.add('text-gray-500', 'border-transparent');
            el.classList.remove('border-zynk', 'text-gray-900', 'dark:text-white');
        }
    });

    renderProfilePosts();
}

function renderProfilePosts() {
    const posts = JSON.parse(localStorage.getItem('zynk_posts') || '[]');
    const likedIds = JSON.parse(localStorage.getItem('zynkLikedIds') || '[]');
    const now = Date.now();

    // Show scheduled posts in profile (scheduledFor > now) if it's ME
    const validPosts = posts.filter(p => !p.expiry || p.expiry > now);

    let displayPosts = [];

    if (currentTab === 'thoughts') {
        // My posts
        const savedProfile = JSON.parse(localStorage.getItem("zynkProfile")) || defaultProfile;
        const myHandle = savedProfile.username || '@you';
        const myName = savedProfile.name || 'You';

        // Match current handle/name OR default 'You' (for old posts or before profile update)
        // Note: Anon/Semi posts created by me result in different handles/authors so they won't show here unless we stored 'ownerId' or similar. 
        // For now, this fixes the issue for Public posts after profile update.
        displayPosts = validPosts.filter(p =>
            p.handle === myHandle ||
            p.author === myName ||
            p.handle === '@you' ||
            p.author === 'You'
        );
    } else if (currentTab === 'likes') {
        // Liked posts
        displayPosts = validPosts.filter(p => likedIds.includes(p.id));
    } else if (currentTab === 'highlights') {
        // Placeholder
        displayPosts = [];
    } else if (currentTab === 'insights') {
        // Placeholder
        displayPosts = [];
    } else if (currentTab === 'media') {
        // My posts with media matches
        displayPosts = validPosts.filter(p => (p.handle === '@you' || p.author === 'You') && (p.images?.length > 0 || p.gif));
    } else if (currentTab === 'replies') {
        // Placeholder for now
        displayPosts = [];
    }

    const profilePosts = document.getElementById('profilePosts');
    const noPostsMsg = document.getElementById('noPostsMsg');

    if (displayPosts.length === 0) {
        profilePosts.innerHTML = '';
        noPostsMsg.innerHTML = currentTab === 'likes' ? "No liked thoughts yet. ❤️" :
            currentTab === 'highlights' ? "Highlights coming soon! ✨" :
                currentTab === 'insights' ? "Insights coming soon! 📊" :
                    'No thoughts yet. <a href="feed.html" class="text-zynk hover:underline">Start thinking.</a>';
        noPostsMsg.classList.remove('hidden');
        return;
    } else {
        noPostsMsg.classList.add('hidden');
    }

    profilePosts.innerHTML = displayPosts.map(post => {
        const timeLeft = getTimeLeft(post.expiry);
        const isLiked = likedIds.includes(post.id);

        let scheduledBadge = '';
        if (post.scheduledFor && post.scheduledFor > now) {
            const date = new Date(post.scheduledFor);
            const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            scheduledBadge = `<span class="ml-2 text-xs bg-purple-500/10 text-purple-500 px-2 py-0.5 rounded-full border border-purple-500/20">⏰ ${timeStr}</span>`;
        }

        let identityBadge = '';
        if (post.identity === 'semi') identityBadge = '🎭 Semi';
        else if (post.identity === 'anon') identityBadge = '👻 Anon';
        else identityBadge = '👤 Public';

        return `
    <div id="post-${post.id}"
        class="p-6 border-b border-gray-200 dark:border-gray-800 transition-all hover:bg-gray-50 dark:hover:bg-white/5"
        onclick="window.location.href='post.html?id=${post.id}'">
        <div class="flex gap-4">
            <div class="w-10 h-10 rounded-full bg-gray-700 overflow-hidden shrink-0">
                 <img src="${post.avatar || (post.handle === '@you' ? (currentImage || 'https://via.placeholder.com/40') : 'https://via.placeholder.com/40')}" class="w-full h-full object-cover">
            </div>
            <div class="flex-1 min-w-0">
                <div class="flex justify-between items-start">
                    <div class="flex items-center gap-2 flex-wrap">
                        <span class="font-semibold text-gray-900 dark:text-white truncate">${post.author}</span>
                        <span class="text-sm text-gray-500 truncate">${post.handle}</span>
                        <span class="text-xs bg-gray-200 dark:bg-gray-800 px-1.5 py-0.5 rounded text-gray-500 whitespace-nowrap">${identityBadge}</span>
                        ${scheduledBadge}
                    </div>
                    <span class="text-xs font-mono text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-full whitespace-nowrap shrink-0">
                        🔥 ${timeLeft}
                    </span>
                </div>

                <div class="mt-2 text-gray-800 dark:text-gray-200 break-words">
                    <p id="text-${post.id}"
                        class="${post.text.length > 150 ? 'line-clamp-3' : ''} whitespace-pre-wrap transition-all">
                        ${post.text}</p>
                    ${post.text.length > 150 ? `<button onclick="event.stopPropagation(); toggleExpand('${post.id}')"
                        class="text-xs text-zynk hover:underline mt-1">Show more</button>` : ''}
                </div>

                <!-- Render Attached Images -->
                ${post.images && post.images.length > 0 ? `
                    <div class="mt-3 flex gap-2 overflow-x-auto pb-2">
                        ${post.images.map(img => `<img src="${img}" class="h-32 w-auto rounded-lg border border-gray-200 dark:border-gray-800 object-cover shrink-0">`).join('')}
                    </div>
                ` : ''}

                <!-- Render Poll -->
                 ${post.poll ? (() => {
                const totalVotes = post.poll.options.reduce((acc, opt) => acc + opt.votes, 0);
                const userVoted = post.poll.voters && post.poll.voters.includes(JSON.parse(localStorage.getItem("zynkProfile"))?.username || 'user');
                return `
                      <div class="poll-card mt-3" data-voted="${userVoted}">
                          <div class="poll-question">${post.poll.question}</div>
                          <div class="poll-options">
                            ${post.poll.options.map((opt, i) => {
                    const percent = totalVotes === 0 ? 0 : Math.round((opt.votes / totalVotes) * 100);
                    return `<div class="poll-option" onclick="event.stopPropagation(); voteProfilePoll('${post.id}', ${i})">
                                    <div class="bar" style="width: ${percent}%"></div>
                                    <span class="label">${opt.text}</span>
                                    <span class="percent">${percent}%</span>
                                 </div>`;
                }).join('')}
                          </div>
                           <div class="poll-footer">
                            <span class="poll-meta">⏳ ${getTimeLeft(post.expiry)} · ${totalVotes} votes</span>
                          </div>
                      </div>
                      `;
            })() : ''}

               <!-- Render Attached GIF -->
               ${post.gif ? `<img src="${post.gif}" class="mt-2 rounded-xl border border-gray-200 dark:border-gray-800 max-h-60 object-cover">` : ''}
              
              <div class="flex gap-6 mt-4 text-gray-500 text-sm items-center">
                <span class="hover:text-zynk transition cursor-pointer flex items-center gap-1" onclick="event.stopPropagation(); alert('Reply coming soon')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                    Reply
                </span>
                <span class="${post.allowReposts !== false ? 'hover:text-zynk transition cursor-pointer flex items-center gap-1' : 'opacity-50 cursor-not-allowed flex items-center gap-1'}" onclick="event.stopPropagation()" title="${post.allowReposts !== false ? 'Repost' : 'Reposts disabled'}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 1l4 4-4 4"></path><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><path d="M7 23l-4-4 4-4"></path><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>
                    Repost
                </span>
                <div class="like-container relative">
                   <button class="like-btn flex items-center gap-1 transition cursor-pointer select-none ${isLiked ? 'liked' : ''} hover:text-zynk" 
                        onclick="event.stopPropagation(); toggleLike(this, '${post.id}')">
                     <span class="like-fill"></span>
                     <span class="like-icon flex items-center gap-1">
                       <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                       Like
                     </span>
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

// Global Toggle Like with Persistence
window.toggleLike = function (btn, postId) {
    let likedIds = JSON.parse(localStorage.getItem('zynkLikedIds') || '[]');

    if (likedIds.includes(postId)) {
        // Unlike
        likedIds = likedIds.filter(id => id !== postId);
        btn.classList.remove('liked');
    } else {
        // Like
        likedIds.push(postId);
        btn.classList.add('liked');
        btn.classList.add('like-pop');
        setTimeout(() => btn.classList.remove('like-pop'), 300);
    }

    localStorage.setItem('zynkLikedIds', JSON.stringify(likedIds));

    // If we are in 'Likes' tab, re-render to remove unliked item immediately? 
    // Or just let it disappear on next reload? Better to re-render if un-liking in Likes tab.
    if (currentTab === 'likes' && !likedIds.includes(postId)) {
        renderProfilePosts();
    }
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

/** 
 * POLL VOTING FOR PROFILE 
 */
window.voteProfilePoll = function (postId, optionIndex) {
    const posts = JSON.parse(localStorage.getItem('zynk_posts') || '[]');
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex === -1) return;

    const post = posts[postIndex];
    const user = JSON.parse(localStorage.getItem("zynkProfile"))?.username || 'user';

    if (!post.poll) return;
    if (!post.poll.voters) post.poll.voters = [];

    if (post.poll.voters.includes(user)) {
        alert("You already voted!");
        return;
    }

    // Register Vote
    post.poll.options[optionIndex].votes++;
    post.poll.voters.push(user);

    // Save
    posts[postIndex] = post;
    localStorage.setItem('zynk_posts', JSON.stringify(posts));

    // Re-render UI
    const card = document.querySelector(`#post-${postId} .poll-card`);
    if (card) {
        card.dataset.voted = "true";
        const totalVotes = post.poll.options.reduce((acc, opt) => acc + opt.votes, 0);

        const options = card.querySelectorAll('.poll-option');
        options.forEach((opt, i) => {
            const votes = post.poll.options[i].votes;
            const percent = Math.round((votes / totalVotes) * 100);

            opt.querySelector('.bar').style.width = percent + '%';
            opt.querySelector('.percent').innerText = percent + '%';
        });

        card.querySelector('.poll-meta').innerText = `⏳ ${getTimeLeft(post.expiry)} · ${totalVotes} votes`;
    }
}

// Reuse helper or ensure it exists
function getTimeLeft(expiry) {
    if (!expiry) return 'Forever ♾️';
    const now = Date.now();
    const diff = expiry - now;
    if (diff <= 0) return 'Expired';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? `${days}d left` : `${Math.floor(diff / 60000)}m left`;
}

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
            loadProfile();
        }
    });
});
