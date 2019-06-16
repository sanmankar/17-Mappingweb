function createMap(earthquakes) {
// Create the tile layer that will be the background of our map
   var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
     attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
     maxZoom: 18,
     id: "mapbox.light",
     accessToken: API_KEY
   });

   // Create a baseMaps object to hold the lightmap layer
   var baseMaps = {
     "Light Map": lightmap
   };

   // Create an overlayMaps object to hold the earthquakes layer
   var overlayMaps = {
     "Earthquakes": earthquakes
   };

   // Create the map object with options
   var map = L.map("map-id", {
     center: [39.8, -98.6],
     zoom: 4,
     layers: [lightmap, earthquakes]
   });
    
    // Assign colors for legend
    function getColor(d) {
        return     d < 2 ? 'white' :
                d < 3 ? 'cyan' :
                d < 4 ? 'lime' :
                d < 5 ? 'yellow' :
                d < 6 ? 'orange' :
                        'red';
    }
    // Create legend
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5],
        labels = [];

        
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }    

        return div;
    };

    legend.addTo(map);
   // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
   L.control.layers(baseMaps, overlayMaps, {
     collapsed: false
   }).addTo(map);
 }

 function createMarkers(response) {
   var events = response.features;

   // Initialize an array to hold earthquake markers
   var earthquakeMarkers = [];

   // Assign colors based on magnitude
   for (var index = 0; index < events.length; index++) {
        var event = events[index];
        var color = "";
        if (event.properties.mag < 1) {
            color = "white";
        }
        else if (event.properties.mag < 2) {
            color = "cyan";
        }
        else if (event.properties.mag < 3) {
            color = "lime";
        }
        else if (event.properties.mag < 4) {
            color = "yellow";
        }
        else if (event.properties.mag < 5) {
            color = "orange";
        }
        else {
            color = "red";
        }
     // For each event, create a marker and bind a popup with the place and time
           
        var earthquakeMarker = L.circle([event.geometry.coordinates[1], event.geometry.coordinates[0]], {
            fillOpacity: 0.75,
            color: color,
            fillColor: color,
            radius: event.properties.mag * 1000
            }).bindPopup("<h3>" + event.properties.place + "<h3><h3>" + Date(event.properties.time) + "<h3>");
        // Add the marker to the earthquakeMarkers array
        earthquakeMarkers.push(earthquakeMarker);
   }
    

   // Create a layer group made from the earthquake markers array, pass it into the createMap function
   createMap(L.layerGroup(earthquakeMarkers));
 }

 console.log("In map_earthquakes.js")

// Perform an API call to the USGS to get earthquake information. Call createMarkers when complete
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", createMarkers);