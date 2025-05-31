// Connects the client to the Socket.IO server running in the backend.
// This enables real-time communication between client and server using WebSockets.
const socket = io();

// Create a new Leaflet map instance and associate it with the HTML element with the id "map".
const map = L.map("map").setView([0, 0], 2);

// Add a tile layer to the map. This uses OpenStreetMap (OSM) tiles.
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap", // Attribution for legal usage
}).addTo(map); // Adds the tile layer to the Leaflet map

// Declare a variable to hold the location marker (will be animated with a pulsing effect).
let marker = null;

// This array stores all location coordinates (latitude and longitude pairs) for the movement trail.
let path = [];

// Create a polyline (a series of connected lines) to visually trace the path the user takes on the map.
let polyline = L.polyline([], {
  color: "lime", // Color of the path
  weight: 5, // Thickness of the line
}).addTo(map); // Add this polyline to the map

// This function updates the information card on the top-right of the map with the user's current location data.
function updateUI(lat, lon, accuracy) {
  const info = document.getElementById("infoCard"); // Get the info card element by its ID
  info.innerHTML = `
    🌍 Latitude: ${lat.toFixed(2)}<br>
    🌐 Longitude: ${lon.toFixed(2)}<br>
    🎯 Accuracy: ±${accuracy}m<br>
    🕒 ${new Date().toLocaleTimeString()}
  `;
  // Explanation:
  // - lat.toFixed(5) ensures only 5 decimal places for readability.
  // - Date().toLocaleTimeString() shows the current time in a readable format.
}

// This function animates a pulsing red marker at the current location of the user.
// It also appends the new location to the path array and updates the trail on the map.
function animateMarker(lat, lon) {
  const location = [lat, lon]; // Construct a coordinate array from lat/lon
  path.push(location); // Add the new location to the trail path
  polyline.setLatLngs(path); // Update the polyline with the full updated path

  if (!marker) {
    // If the marker has not yet been created, create a new pulsing marker.
    const el = document.createElement("div"); // Create a new HTML div element
    el.className = "pulse"; // Assign it the 'pulse' class for CSS animation
    el.style.width = "20px"; // Set size
    el.style.height = "20px";
    el.style.background = "red"; // Red color for visibility
    el.style.borderRadius = "50%"; // Circular shape

    // Create a Leaflet marker using the animated div as its icon
    marker = L.marker(location, {
      icon: L.divIcon({ className: "", html: el }), // Use our custom animated div as the marker
    }).addTo(map); // Add this marker to the map
  } else {
    // If the marker already exists, just move it to the new location
    marker.setLatLng(location);
  }

  // Center the map on the new location with a zoom level of 18 for close-up detail
  map.setView(location, 18);
}

// This function is called by the browser's Geolocation API when the user's location is successfully obtained.
// It receives a Position object containing lat/lon and accuracy.
function updateLocation(position) {
  // Extract latitude, longitude, and accuracy from the position object
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  const accuracy = position.coords.accuracy;

  // Call the function to animate the marker and update the trail
  animateMarker(lat, lon);

  // Update the location info card on the UI
  updateUI(lat, lon, accuracy);

  // Emit a "location" event to the server with the user's current coordinates.
  // This enables broadcasting to other connected users (multi-user tracking).
  socket.emit("location", { lat, lon, accuracy });
}

// Listen for 'location' events from the server.
// This allows the app to receive real-time location data from other users (if multi-user).
socket.on("location", (data) => {
  if (!data || !data.username) return;

  // Optional: Only display if this is the logged-in user's session
  const currentUser = document
    .querySelector("h3")
    ?.innerText?.replace("👤 ", "");
  const isSelf = data.username === currentUser;

  // Show name above marker (optional)
  if (!window.userMarkers) window.userMarkers = {};

  const lat = data.lat;
  const lon = data.lon;

  if (!window.userMarkers[data.username]) {
    const el = document.createElement("div");
    el.className = "pulse";
    el.style.width = "20px";
    el.style.height = "20px";
    el.style.background = isSelf ? "red" : "blue";
    el.style.borderRadius = "50%";

    const marker = L.marker([lat, lon], {
      icon: L.divIcon({ className: "", html: el }),
    }).addTo(map);

    window.userMarkers[data.username] = marker;
  } else {
    window.userMarkers[data.username].setLatLng([lat, lon]);
  }

  if (isSelf) {
    map.setView([lat, lon], 18);
    animateMarker(lat, lon); // update trail
    updateUI(lat, lon, data.accuracy || 0);
  }
});

// This function is called if there is an error getting the user's location.
function handleLocationError(error) {
  // Display an alert message with the error
  alert("Location error: " + error.message);
}

// This block checks if the browser supports the Geolocation API.
// If supported, it starts tracking the user's location in real time using `watchPosition`.
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(updateLocation, handleLocationError, {
    enableHighAccuracy: true, // Requests the most precise location available
    maximumAge: 0, // Do not use cached location data
  });
}

function openDeleteModal() {
  document.getElementById("deleteModal").style.display = "flex";
}

function closeDeleteModal() {
  document.getElementById("deleteModal").style.display = "none";
}
