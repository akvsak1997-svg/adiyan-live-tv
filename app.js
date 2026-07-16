// Firebase Import
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDZHoWfFFbEJ5lbCxNuepS84MMdrP7X3Ck",
  authDomain: "adiyan-live-tv.firebaseapp.com",
  databaseURL: "https://adiyan-live-tv-default-rtdb.firebaseio.com",
  projectId: "adiyan-live-tv",
  storageBucket: "adiyan-live-tv.firebasestorage.app",
  messagingSenderId: "374397306957",
  appId: "1:374397306957:web:ab130d93cf02d4dad2f404"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Channel List
const channelList = document.getElementById("channelList");


// Load Channels
const channelRef = ref(db, "channels");

onValue(channelRef, (snapshot) => {

    channelList.innerHTML = "";

    snapshot.forEach((childSnapshot)=>{

        let channel = childSnapshot.val();

        let card = document.createElement("div");

        card.className = "channel-card";


        card.innerHTML = `
            <img src="${channel.logo || 'https://via.placeholder.com/80'}">
            <h3>${channel.name}</h3>
        `;


        card.onclick = ()=>{

            let player = document.getElementById("player");

            player.src = channel.url;

            player.play();

        };


        channelList.appendChild(card);

    });

});
