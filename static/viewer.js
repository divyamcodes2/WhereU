// Establish a real-time WebSocket connection to the Flask server using Socket.IO
const socket = io();

// Create a Leaflet map instance, render it inside the element with ID "map"
// Set the initial view to the center of India with a zoom level of 5
const map = L.map("map").setView([20, 78], 5);

// Add OpenStreetMap tiles as the map's background layer
// {s}, {z}, {x}, {y} are placeholders automatically filled in by Leaflet
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors", // Show legal attribution
}).addTo(map); // Add this tile layer to the map

// Get the username of the user whose location is being shared
// It's extracted from a hidden <div> in the HTML, placed by Flask server
const sharedUser = document.getElementById("shared-user").textContent.trim();

// Get the last known latitude from a hidden <div> element
// Flask injects this value on page load based on the database
const initialLat = parseFloat(
  document.getElementById("initial-lat").textContent
);

// Get the last known longitude from a hidden <div> element
const initialLon = parseFloat(
  document.getElementById("initial-lon").textContent
);

// Initialize a variable to hold the location marker on the map
// It will be created later when we have coordinates to show
let viewerMarker = null;

// Check if valid coordinates are available for the initial view
// If yes, update the map view and create a red pulsing marker
if (!isNaN(initialLat) && !isNaN(initialLon)) {
  // Center the map to the last known location with a closer zoom level
  map.setView([initialLat, initialLon], 17);

  // Create a custom HTML <div> element styled to look like a red pulsing dot
  const el = document.createElement("div");
  el.className = "pulse"; // Assign a CSS class for pulsing animation
  el.style.width = "20px"; // Set width of the marker
  el.style.height = "20px"; // Set height of the marker
  el.style.background = "red"; // Set the fill color to red
  el.style.borderRadius = "50%"; // Make the div circular

  // Create a Leaflet marker using the custom pulsing div as its icon
  viewerMarker = L.marker([initialLat, initialLon], {
    icon: L.divIcon({ className: "", html: el }), // Use divIcon to embed custom HTML
  }).addTo(map); // Add this marker to the map
}

// Listen for 'location' events sent from the server via Socket.IO
// These events are emitted whenever the tracked user updates their location
socket.on("location", (data) => {
  // Skip the update if there's no data or if it's not for the correct shared user
  if (!data || data.username !== sharedUser) return;

  // Extract the latest latitude and longitude from the event data
  const lat = data.lat;
  const lon = data.lon;

  // If a marker hasn’t been created yet, create one now with pulsing style
  if (!viewerMarker) {
    const el = document.createElement("div");
    el.className = "pulse"; // CSS animation class
    el.style.width = "20px";
    el.style.height = "20px";
    el.style.background = "red"; // Red marker
    el.style.borderRadius = "50%"; // Circle shape

    // Create and add the new marker at the live location
    viewerMarker = L.marker([lat, lon], {
      icon: L.divIcon({ className: "", html: el }),
    }).addTo(map);
  } else {
    // If marker already exists, just move it to the new coordinates
    viewerMarker.setLatLng([lat, lon]);
  }

  // Recenter the map to the user's new location with zoom level 17
  map.setView([lat, lon], 17);
});
