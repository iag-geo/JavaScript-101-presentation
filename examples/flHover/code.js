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

  map = new Map("mapDiv", {
    basemap: "streets",
    center: [-80.94, 33.646],
    zoom: 8,
    slider: false
  });

  var countyLayer = new FeatureLayer("http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Demographics/ESRI_Census_USA/MapServer/3", {
    mode: FeatureLayer.MODE_SNAPSHOT,
    outFields: ["NAME", "POP2000"]
  });
  countyLayer.setDefinitionExpression("STATE_NAME = 'South Carolina'");
  
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
  map.addLayer(countyLayer);

  var highlightSymbol = new SimpleFillSymbol(
    SimpleFillSymbol.STYLE_SOLID,
    new SimpleLineSymbol(
      SimpleLineSymbol.STYLE_SOLID,
      new Color([255,0,0]), 3
    ),
    new Color([125,125,125,0.35])
  );

  //close the dialog when the mouse leaves the highlight graphic
  map.on("load", function(){
    map.graphics.on("mouse-out", removeHighlight);
  });

  //listen for when the onMouseOver event fires on the countiesGraphicsLayer
  //when fired, create a new graphic with the geometry from the event.graphic and add it to the maps graphics layer
  countyLayer.on("mouse-over", function(evt){
    var content = evt.graphic.attributes["NAME"] + ": " + evt.graphic.attributes["POP2000"];
    console.log(content);

    var highlightGraphic = new Graphic(evt.graphic.geometry,highlightSymbol);
    map.graphics.add(highlightGraphic);
  });

  function removeHighlight() {
    map.graphics.clear();
  }

});