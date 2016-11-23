var map;
require([
  "esri/map",
  "esri/layers/FeatureLayer",
  "esri/symbols/SimpleFillSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/renderers/SimpleRenderer",
  "esri/graphic", 
  "esri/Color",
  "esri/config",
  "dojo/domReady!"
], function(
  Map,
  FeatureLayer,
  SimpleFillSymbol,
  SimpleLineSymbol,
  SimpleRenderer,
  Graphic,
  Color,
  esriConfig
) {

  esriConfig.defaults.io.corsDetection = false;

  // initialise the map with a basemap, centroid and zoom level
  map = new Map("mapDiv", {
    basemap: "streets",
    center: [-80.94, 33.646],
    zoom: 8
  });

  // define a feature layer, with a definition query to keep it simple
  var countyLayer = new FeatureLayer("http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Demographics/ESRI_Census_USA/MapServer/3", {
    mode: FeatureLayer.MODE_SNAPSHOT,
    outFields: ["NAME", "POP2000"]
  });
  countyLayer.setDefinitionExpression("STATE_NAME = 'South Carolina'");
  
  // override the layer's symbology using a symbol and renderer
  var symbol = new SimpleFillSymbol(
    SimpleFillSymbol.STYLE_SOLID,
    new SimpleLineSymbol(
      SimpleLineSymbol.STYLE_SOLID,
      new Color([255,255,255,0.35]),
      1
    ),
    new Color([125,125,125,0.35])
  );
  countyLayer.setRenderer(new SimpleRenderer(symbol));

  // define a symbol to use when highlighting the features
  var highlightSymbol = new SimpleFillSymbol(
    SimpleFillSymbol.STYLE_SOLID,
    new SimpleLineSymbol(
      SimpleLineSymbol.STYLE_SOLID,
      new Color([255,0,0]), 3
    ),
    new Color([125,125,125,0.35])
  );

  map.on("load", function(){

    // add the layer to the map
    map.addLayer(countyLayer);

    // listen for the onMouseOver event on the counties layer
    // create a new graphic with the geometry from the event.graphic and add it to the maps graphics layer
    countyLayer.on("mouse-over", function(evt){
      var content = evt.graphic.attributes["NAME"] + ": " + evt.graphic.attributes["POP2000"];
      console.log(content);

      var highlightGraphic = new Graphic(evt.graphic.geometry,highlightSymbol);
      map.graphics.add(highlightGraphic);
    });

    // Remove the highlight when the mouse leaves the highlight graphic. This listener demonstrates
    // an event on the map's graphics layer
    map.graphics.on("mouse-out", removeHighlight);
  });


  function removeHighlight() {
    // this function fires when the mouse leaves a polygon, and removes the highlight from the map
    map.graphics.clear();
  }

});