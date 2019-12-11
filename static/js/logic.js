//Json Data from USGS
var geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
 
//Cordinates set to Sanfrancisco
var sanFranCoords = [37.77885586164994, -122.4213409423828]

//Capture data variable from provided url
d3.json(geoData, data => {
    createFeatures(data.features);
});

//define function to go through datavariables for popup information.
function createFeatures(earthquakeData) {

    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3 align='center'>" + feature.properties.place +
            "</h3><hr><p><u>Occurrence:</u> " + new Date(feature.properties.time) + "</p>" +
            "</h3><p><u>Magnitude:</u> " + feature.properties.mag + "</p>");
    }
    //Make variable to contain all information on markers for earthquakes
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer:  (feature, latlng) => {
            var geojsonMarkerOptions = {
            radius: 4*feature.properties.mag,
            fillColor: getColor(feature.properties.mag),
            color: "black",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.9
            };
            return L.circleMarker(latlng, geojsonMarkerOptions);
        }
    });
    //append markers to map.
    createMap(earthquakes);
}
//define colors to differentiate the magnitude of earthquakes
function getColor(d) {

    return d < 1 ? 'green' : 
           d < 2 ? 'green' :
           d < 3 ? 'lightgreen' :
           d < 4 ? 'orange' :
           d < 5 ? 'orange':
                   'red';
}

function createMap(earthquakes) {

    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
        maxZoom: 12,
        id: "mapbox.light",
        accessToken: API_KEY
    });
 
    var baseMaps = {
        "Light Map": lightmap 
    };
    
    var overlayMaps = {
        "Earthquakes": earthquakes
    };

    var map = L.map("map", {
        center: sanFranCoords,
        zoom: 4.5,
        layers: [lightmap, earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps, {collapsed: false})
             .addTo(map);

    var legend = L.control({position: 'bottomright'});
  
    legend.onAdd = map => {    
        var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5],
        labels = [];
  
        div.innerHTML+='Magnitude<br><hr>'
        grades.forEach( i => {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    })
    
    return div;
    };
    
    legend.addTo(map);
}