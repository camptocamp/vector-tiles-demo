import { Control, Layer, setOptions } from 'leaflet';

const ToggleCallbackLayer = Layer.extend({
  initialize(options) {
    // default options
    this.options = {
      toggle: () => {},
    };

    setOptions(this, options);
  },

  onAdd() {
    this.options.toggle();
  },

  onRemove() {
    this.options.toggle();
  },
});

function addLayerControl(map, baseMaps, toggleControls) {
  const overlayMaps = {};
  toggleControls.forEach((toggleControl) => {
    const toggleLayer = new ToggleCallbackLayer();
    if (toggleControl.enabled) {
      map.addLayer(toggleLayer);
    }
    toggleLayer.options.toggle = toggleControl.toggle;
    overlayMaps[toggleControl.name] = toggleLayer;
  });

  new Control.Layers(baseMaps, overlayMaps).addTo(map);
}

function toggleLayers(glMap, layers) {
  layers.forEach((layer) => {
    const visibility = glMap.getLayoutProperty(layer, 'visibility');
    if (visibility === 'visible') {
      glMap.setLayoutProperty(layer, 'visibility', 'none');
    } else {
      glMap.setLayoutProperty(layer, 'visibility', 'visible');
    }
  });
}

export { addLayerControl, toggleLayers };
