// Plot the world's endangered languages on a map // Requires d3js v4 and MapboxGL
let szMcfg=[];szMcfg['orig']=[];szMcfg['orig']['token']=[];szMcfg['sz']=[];
szMcfg['orig']['token']='pk.eyJ1IjoicmFkaW9lZGl0IiwiYSI6ImNpZ2F4NGw1MzFhaDd0Zmx5NGtoaXBnZTgifQ.LKXJIMW7qqWDRD8QCnMqaw';
szMcfg['orig']['style']='mapbox://styles/radioedit/cjf9wt0wf6ddu2ro9utbuxjj5';
szMcfg['sz']['token']='pk.eyJ1IjoiemF3cyIsImEiOiJlaTNsUkZzIn0.bd_V0kPfj211OARXqIgOpA';
szMcfg['sz']['style']='mapbox://styles/zaws/cjiha5or007qm2so5ww8n0mw5';
const szCurrCfg='orig'; //'sz';//
mapboxgl.accessToken = szMcfg[szCurrCfg]['token'];//szorigtok;
// Set up a map
var map = new mapboxgl.Map({container: 'earth_div',  style: szMcfg[szCurrCfg]['style'],  center: [0, 20], // lon/lat
    zoom: 0.6 // See most of the map
});
console.log(szMcfg['sz']['token']+' '+szMcfg['sz']['style']);
map.scrollZoom.disable();map.addControl(new mapboxgl.NavigationControl());

// When you click
map.on('click', function (e) {
    var features = map.queryRenderedFeatures(e.point, { layers: ['Vulnerable', 'Critically Endangered', 'Severely Endangered', 'Definitely Endangered']  });

    if (!features.length) { return; } // If you don't click on anything, do nothing

    var feature = features[0];// If you do, grab the top thing you clicked on
    
    let spkrs = (spkrs) => { if (isNaN(spkrs)) return spkrs; else return format(spkrs); };// Formatting function for speaker number/"unknown"

    // Then display a popup at the location with info
    var popup = new mapboxgl.Popup({offset: [0, -15] })   .setLngLat(feature.geometry.coordinates)
        .setHTML(`<b>${feature.properties.name}</b> - ${feature.properties.danger}<br>Speakers: ${spkrs(feature.properties.speakers)}<br><em>${feature.properties.blurb}</em>`)
        .setLngLat(feature.geometry.coordinates)  .addTo(map);
});