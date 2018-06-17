// This script calculates the nearest language to the user.// Create a global variable for adjusting the globe based on user position
var map;let userLat = 0,  userLon = 0;// Set some defaults
let mapWidth = parseInt(d3.select('.nearest').style('width'), 10);// Get the size of the container div and set that as the width and height of the map
let nearFormat = d3.format(",d");// Define a formatting function for putting commas into numbers
let projection = d3.geoStereographic() .scale(mapWidth * 3) .translate([mapWidth / 2, mapWidth / 2]); let path = d3.geoPath().projection(projection);// Define the map projection and pathing function
let nearColour = (d) => {switch (d.danger) {case "Vulnerable": return "#619d94"; case "Definitely endangered": return "#ff8f78"; case "Severely endangered": return "#fc4952";
        case "Critically endangered": return "#983d52"; default: return "blue";}};// Define the colour logic
let nearLang = (userLat, userLon, languages) => {let nearestLanguage = {name: null, distance: 999999999};// calc nearest language  // Start with a null language that's impossibly far away
    // Loop through all the languages
    for (let language of languages) {// Figure out how far the language is from the user
        let a = Math.abs(userLat - language.lat),  b = Math.abs(userLon - language.lon); language.distance = Math.sqrt(a * a + b * b);
        if (language.distance < nearestLanguage.distance) nearestLanguage = language; }// If that's closer than the current-closest language, replace it
    return nearestLanguage;};// Return the nearest language

// Create a function to load the languages and analyse the data
let letsGo = () => d3.csv("data/languages_number.csv",  function (d) { d.speakers = +d.speakers; // Ensure speakers is a number
        if (d.speakers) return d; },// Exclude languages without a speaker number
    function (error, languages) {if (error) throw error;   let closest = nearLang(userLat, userLon, languages); // Return the nearest language as an alert. // Replace this with drawing a map etc.
        let nearSVG = d3.select(".nearest") .append("svg") .attr("width", mapWidth) .attr("height", mapWidth) .classed("border", true); // Append an SVG, set the width and height
        projection.rotate([-userLon, -userLat]);
        d3.json("data/world-50m.json", function (error, world) {if (error) throw error;// Draw the map
            var countries = topojson.feature(world, world.objects.countries).features;// Load the map data
            nearSVG.selectAll(".country").data(countries) .enter().insert("path", ".graticule") .attr("class", "country") .attr("d", path) .style("fill", "#f4eedf");// Add the map with a normal D3 data join
            let coords = projection([closest.lon, closest.lat]);// Calculate where the marker goes
            // Add a PNG to mark the language
            let nearImg = nearSVG.append("image") .attr("xlink:href", () => { switch (closest.danger) {case "Vulnerable": return "images/vul_marker.svg";
      			case "Definitely endangered": return "images/def_marker.svg"; case "Severely endangered": return "images/sev_marker.svg";
				case "Critically endangered": return "images/cri_marker.svg";}  }) .attr('height', '20').attr('width', '20').attr("x", coords[0] - 10).attr("y", coords[1] - 20);  });
        d3.select("#nearest-head") .text(`Your nearest endangered language is ${closest.name}`);// Change the text on the page
        d3.select("#nearest-body") .html(`Spoken by ${nearFormat(closest.speakers)} speakers, UNESCO classifies it as <span id="unesco">${closest.danger.toLowerCase()}</span>.`);
        d3.select("#unesco").style("color", `${nearColour(closest)}`);// Change the colour of the UNESCO text
        d3.select("#nearest-rect").style("fill", `${nearColour(closest)}`);  });// Change the colour of the little rect
let locApprove = () => {// Create a function that executes when the button is clicked // Replace the placeholder with a loading gif, and vanish the button
    document.getElementById("nearest-button").style.display = 'none';  document.getElementById("nearest-loading").style.display = 'inline';  document.getElementById("placeholder").style.display = 'none';
    navigator.geolocation.getCurrentPosition(function (position, html5Error) {userLat = position.coords.latitude; userLon = position.coords.longitude;  letsGo();// Get the user's actual latitude and longitude
        document.getElementById("nearest-loading").style.display = 'none';// Hide the loading gif
        map.flyTo({center: [userLon, userLat], zoom: 4});// Move the world map to your location
    });
};