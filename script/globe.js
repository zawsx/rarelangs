// Plot the world's endangered languages on a globe// Requires d3js v4 and webGLearth v2
let initialize = () => { earth = new WE.map('earth_div', { zoom: 5,  position: [7.5, 0], // Plot the Earth // Default start position
    });

    let tiles = WE.tileLayer('https://stamen-tiles.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png', { bounds: [[-84, -179], [84, 179]], minZoom: 2,  maxZoom: 15 });  tiles.addTo(earth);// Load the tiles
    let tooltip = (language) => `<b>${language.name}</b> - ${language.danger}<br>Speakers: ${language.speakers}<br><em>${language.blurb}</em>`;// Define the tooltip content code

    // Define the language plotting functions
    let langPlot = (languages, category, markerImg) => {
        for (let language of languages.filter(lang => lang.danger == category)) {
            // Create the point
            let point = WE.marker([language.lat, language.lon], markerImg, 20, 20);
            // Add it to the globe
            point.addTo(earth);
            // Give it a tooltip
            point.bindPopup(tooltip(language));
        }
    };

    // Add the points
    d3.csv("data/languages_number.csv",  d => {d.speakers = +d.speakers; // Ensure speakers is a number
            if (d.speakers) return d; // Exclude languages without a speaker number
        },
        (error, languages) => {if (error) throw error;
            // Make markers for each category of languages
            langPlot(languages, "Vulnerable", "images/vul_marker.svg"); langPlot(languages, "Definitely endangered", "images/def_marker.svg");
            langPlot(languages, "Severely endangered", "images/sev_marker.svg"); langPlot(languages, "Critically endangered", "images/cri_marker.svg");
        });
};

// Update function for resizing
let update = () => {}; initialize();
