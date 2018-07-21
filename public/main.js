
var map = L.map('map');
  L.esri.basemapLayer('Topographic').addTo(map);
  var typeD = [];
  var locationD = []; 
  var affectedpeople = [];
  var requirement = [];
  var postedby = [];
  var postedtime = [];
    axios.get('/getdisaster')
        .then(function (response) {
            // handle success
            disasterDatas = response.data.disaster
            disasterDatas.forEach(function(disasterData) {
                typeD.push(disasterData.type.trim())
                locationD.push(disasterData.location.trim())
                affectedpeople.push(disasterData.affectedpeople)
                requirement.push(disasterData.requirement.trim())
                postedby.push(disasterData.postedby.trim())
                postedtime.push(disasterData.postedtime.slice(0,10))
            })
            //console.log(typeD, locationD, affectedpeople, requirement, postedby, postedtime)
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function () {
            // always executed
    });
        
  L.esri.get('https://www.arcgis.com/sharing/content/items/62914b2820c24d4e95710ebae77937cb/data', {}, function (error, response) {
    var features = response.operationalLayers[0].featureCollection.layers[0].featureSet.features;
    var idField = response.operationalLayers[0].featureCollection.layers[0].layerDefinition.objectIdField;

    for (var i = features.length - 1; i >= 0; i--) {
      // convert ArcGIS Feature to GeoJSON Feature
      var feature = L.esri.Util.arcgisToGeoJSON(features[i], idField);

      // unproject the web mercator coordinates to lat/lng
      var latlng = L.Projection.Mercator.unproject(L.point(feature.geometry.coordinates));
      feature.geometry.coordinates = [latlng.lng, latlng.lat];

      featureCollection.features.push(feature);
    }

    //document.getElementById('map').style.zIndex = "1";
    // Get the modal
    // var modal = document.getElementById('myModal');
    // Places names from database goes here

    var geojson = L.geoJSON(featureCollection, {
        style: function(feature) {
            if(locationD.includes(feature.properties.name)) {
                return {color: "#ff0000"}}
        }

    }).bindPopup(function (layer) {
        if(locationD.includes(layer.feature.properties.name)) {
            console.log('This is called')                                                                                  
            for(i=0;i<locationD.length;i++) {
                if(locationD[i] == layer.feature.properties.name) {
                    string = `
                    <span style="color: red;"> <b>${typeD[i]}</b></span><br>
                    <b style="font-size: 20px;  ">${layer.feature.properties.name}</b><br>
                   <b>No. of affected people: ${affectedpeople[i]}</b> <br> <b>Essential Requirements: ${requirement[i]}</b> <br><b>Posted by: ${postedby[i]}</b> <br><b>Posted at: ${postedtime[i]}</b> <button class="btn btn-success" value="donate">Donate</button>`.toString()
                    return string;
                }
            } 
        }
        return layer.feature.properties.name
    }).addTo(map);
    map.fitBounds(geojson.getBounds());
    map.setView([28.3, 84.924], 6.9);


    
 
    // $('span.close').off('click').on("click",function(event){
	// 	console.log("modal");
	// 	modal.style.display = "none";
		
	// });
    

        

  
  });