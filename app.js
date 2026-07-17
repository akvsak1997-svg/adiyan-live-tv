/* ==========================================
   Adiyan Live TV
   app.js
   Chapter 1
========================================== */

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";

import {
    getDatabase,
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

/* Firebase Config */

import {
    firebaseConfig
} from "./firebase-config.js";

/* Initialize Firebase */

const app = initializeApp(firebaseConfig);

const db = getDatabase(app);

/* HTML Elements */

const videoPlayer =
document.getElementById("videoPlayer");

const channelList =
document.getElementById("channelList");

const searchInput =
document.getElementById("searchInput");

const channelTitle =
document.getElementById("channelTitle");

const channelDescription =
document.getElementById("channelDescription");

const channelLogo =
document.getElementById("channelLogo");

const channelName =
document.getElementById("channelName");

const channelCategory =
document.getElementById("channelCategory");

const channelCount =
document.getElementById("channelCount");

const loading =
document.getElementById("loading");

const errorBox =
document.getElementById("errorBox");

const toast =
document.getElementById("toast");

const offlineBanner =
document.getElementById("offlineBanner");

const playBtn =
document.getElementById("playBtn");

const stopBtn =
document.getElementById("stopBtn");

const fullscreenBtn =
document.getElementById("fullscreenBtn");

const favoriteBtn =
document.getElementById("favoriteBtn");

/* Variables */

let channels = [];
/* ==========================================
   Chapter 2
   Firebase Channel Loader
========================================== */

function showLoading() {

    loading.classList.remove("hidden");

}

function hideLoading() {

    loading.classList.add("hidden");

}

function showError(message) {

    errorBox.classList.remove("hidden");

    errorBox.innerHTML = `<p>${message}</p>`;

}

function hideError() {

    errorBox.classList.add("hidden");

}

showLoading();

const channelsRef = ref(db, "channels");

onValue(channelsRef, (snapshot) => {

    hideLoading();

    hideError();

    channels = [];

    if (!snapshot.exists()) {

        channelCount.textContent = "0";

        showError("No channels found.");

        return;

    }

    snapshot.forEach((item) => {

        channels.push({

            id: item.key,

            ...item.val()

        });

    });

    channelCount.textContent = channels.length;

    renderChannels(channels);

}, (error) => {

    hideLoading();

    showError("Failed to load channels.");

    console.error(error);

});
/* ==========================================
   Chapter 3
   Render Channel List & Search
========================================== */

function renderChannels(channelArray) {

    channelList.innerHTML = "";

    if (channelArray.length === 0) {

        channelList.innerHTML = `
        <div class="error-box">
            <p>No channels found.</p>
        </div>
        `;
        return;
    }

    channelArray.forEach((channel) => {

        const card = document.createElement("div");

        card.className = "channel-card";

        card.innerHTML = `
            <img src="${channel.logo}" alt="${channel.name}">
            
            <div class="channel-content">
            
                <h3>${channel.name}</h3>
                
                <p>${channel.category || "Live TV"}</p>
                
            </div>
        `;

        card.addEventListener("click", () => {

            playChannel(channel);

        });

        channelList.appendChild(card);

    });

}

/* ==========================
   Search Channel
========================== */

searchInput.addEventListener("input", () => {

    const keyword = searchInput.value
        .toLowerCase()
        .trim();

    const filtered = channels.filter((channel) => {

        const name = (channel.name || "")
            .toLowerCase();

        const category = (channel.category || "")
            .toLowerCase();

        return name.includes(keyword) ||
               category.includes(keyword);

    });

    renderChannels(filtered);

});

/* ==========================================
   Chapter 4
   Player, Controls & Utilities
========================================== */

let hls = null;

/* Play Channel */

function playChannel(channel) {

    currentChannel = channel;

    channelTitle.textContent = channel.name;
    channelDescription.textContent = channel.description || "";
    channelName.textContent = channel.name;
    channelCategory.textContent = channel.category || "Live TV";

    if (channel.logo) {
        channelLogo.src = channel.logo;
    }

    if (hls) {
        hls.destroy();
        hls = null;
    }

    if (Hls.isSupported()) {

        hls = new Hls();

        hls.loadSource(channel.url);

        hls.attachMedia(videoPlayer);

        hls.on(Hls.Events.MANIFEST_PARSED, function () {

            videoPlayer.play();

            showToast("Now Playing : " + channel.name);

        });

    } else if (videoPlayer.canPlayType("application/vnd.apple.mpegurl")) {

        videoPlayer.src = channel.url;

        videoPlayer.play();

        showToast("Now Playing : " + channel.name);

    } else {

        showError("HLS is not supported.");

    }

}

/* Play Button */

playBtn.addEventListener("click", () => {

    if (currentChannel) {

        videoPlayer.play();

    }

});

/* Stop Button */

stopBtn.addEventListener("click", () => {

    videoPlayer.pause();

});

/* Fullscreen Button */

fullscreenBtn.addEventListener("click", () => {

    if (videoPlayer.requestFullscreen) {

        videoPlayer.requestFullscreen();

    }

});

/* Favorite Button */

favoriteBtn.addEventListener("click", () => {

    if (!currentChannel) return;

    localStorage.setItem(
        "favoriteChannel",
        JSON.stringify(currentChannel)
    );

    showToast("Favorite Saved");

});

/* Toast */

function showToast(message) {

    toast.textContent = message;

    toast.classList.remove("hidden");

    setTimeout(() => {

        toast.classList.add("hidden");

    }, 2500);

}

/* Internet Status */

window.addEventListener("offline", () => {

    offlineBanner.classList.remove("hidden");

});

window.addEventListener("online", () => {

    offlineBanner.classList.add("hidden");

});

let currentChannel = null;
