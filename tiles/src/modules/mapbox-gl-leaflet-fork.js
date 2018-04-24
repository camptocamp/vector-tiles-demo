/* eslint-disable */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['leaflet', 'mapbox-gl'], factory);
    } else if (typeof exports === 'object') {
        // Node, CommonJS-like
        module.exports = factory(require('leaflet'), require('mapbox-gl'));
    } else {
        // Browser globals (root is window)
        root.L.MapboxGL = factory(window.L, window.mapboxgl);
    }
}(this, function (L, mapboxgl) {
    var MapboxGL = L.Layer.extend({
        options: {
            updateInterval: 32
        },

        initialize: function (options) {
            L.setOptions(this, options);
            if (options.accessToken) {
                mapboxgl.accessToken = options.accessToken;
            } else {
                throw new Error('You should provide a Mapbox GL access token as a token option.');
            }
            this._toWebMercator = options.toWebMercator;

            /**
             * Create a version of `fn` that only fires once every `time` millseconds.
             *
             * @param {Function} fn the function to be throttled
             * @param {number} time millseconds required between function calls
             * @param {*} context the value of `this` with which the function is called
             * @returns {Function} debounced function
             * @private
             */
            var throttle = function (fn, time, context) {
                var lock, args, wrapperFn, later;

                later = function () {
                    // reset lock and call if queued
                    lock = false;
                    if (args) {
                        wrapperFn.apply(context, args);
                        args = false;
                    }
                };

                wrapperFn = function () {
                    if (lock) {
                        // called too soon, queue to call later
                        args = arguments;

                    } else {
                        // call and lock until later
                        fn.apply(context, arguments);
                        setTimeout(later, time);
                        lock = true;
                    }
                };

                return wrapperFn;
            };

            // setup throttling the update event when panning
            this._throttledUpdate = throttle(L.Util.bind(this._update, this), this.options.updateInterval);
        },

        onAdd: function (map) {
            if (!this._glContainer) {
                this._initContainer();
            }

            this.getPane().appendChild(this._glContainer);

            this._initGL();

            this._offset = this._map.containerPointToLayerPoint([0, 0]);

            // work around https://github.com/mapbox/mapbox-gl-leaflet/issues/47
            if (map.options.zoomAnimation) {
                L.DomEvent.on(map._proxy, L.DomUtil.TRANSITION_END, this._transitionEnd, this);
            }
        },

        onRemove: function (map) {
            if (this._map.options.zoomAnimation) {
                L.DomEvent.off(this._map._proxy, L.DomUtil.TRANSITION_END, this._transitionEnd, this);
            }

            this.getPane().removeChild(this._glContainer);
            this._glMap.remove();
            this._glMap = null;
        },

        getEvents: function () {
            return {
                move: this._throttledUpdate, // sensibly throttle updating while panning
                zoomanim: this._animateZoom, // applys the zoom animation to the <canvas>
                zoom: this._pinchZoom, // animate every zoom event for smoother pinch-zooming
                zoomstart: this._zoomStart, // flag starting a zoom to disable panning
                zoomend: this._zoomEnd
            };
        },

        _initContainer: function () {
            var container = this._glContainer = L.DomUtil.create('div', 'leaflet-gl-layer');

            var size = this._map.getSize();
            container.style.width = size.x + 'px';
            container.style.height = size.y + 'px';
        },

        _initGL: function () {
            const { center, zoom } = this._getGLCenterZoom();

            var options = L.extend({}, this.options, {
                container: this._glContainer,
                interactive: false,
                center: [center.lng, center.lat],
                zoom: zoom,
                attributionControl: false
            });

            this._glMap = new mapboxgl.Map(options);

            // allow GL base map to pan beyond min/max latitudes
            this._glMap.transform.latRange = null;

            if (this._glMap._canvas.canvas) {
                // older versions of mapbox-gl surfaced the canvas differently
                this._glMap._actualCanvas = this._glMap._canvas.canvas;
            } else {
                this._glMap._actualCanvas = this._glMap._canvas;
            }

            // treat child <canvas> element like L.ImageOverlay
            L.DomUtil.addClass(this._glMap._actualCanvas, 'leaflet-image-layer');
            L.DomUtil.addClass(this._glMap._actualCanvas, 'leaflet-zoom-animated');
        },

        _pixelToProjected: function(point) {
            var latLng = this._map.unproject(point);
            return this._map.options.crs.project(latLng);
        },

        _getProjectedBounds: function() {
            var pixelBounds = this._map.getPixelBounds();
            var minProjected = this._pixelToProjected(pixelBounds.min);
            var maxProjected = this._pixelToProjected(pixelBounds.max);
            return [minProjected, maxProjected];
        },

        _getGLBounds: function () {
            var projectedBounds = this._getProjectedBounds();
            return projectedBounds.map(this._toWebMercator);
        },

        _getGLCenterZoom() {
            var WGS_84_RADIUS_METERS = 6378137;
            var WGS_84_CIRCUMFERENCE_METERS = WGS_84_RADIUS_METERS * 2 * Math.PI;
            var TILE_SIZE_PIXELS = 256;

            var bounds = this._getGLBounds();

            // Center
            var centerWebMercator = bounds[0].add(bounds[1]).divideBy(2);
            var centerLatLng = L.CRS.EPSG3857.unproject(centerWebMercator);

            // Zoom
            var extentX = Math.abs(bounds[0].x - bounds[1].x);
            var pixelsSizeX = this._map.getSize().x;
            var scale = pixelsSizeX /extentX * WGS_84_CIRCUMFERENCE_METERS / TILE_SIZE_PIXELS;
            var zoom = Math.log(scale) / Math.LN2;

            return {
                center: centerLatLng,
                zoom: zoom
            }
        },

        _update: function (e) {
            // update the offset so we can correct for it later when we zoom
            this._offset = this._map.containerPointToLayerPoint([0, 0]);

            if (this._zooming) {
                return;
            }

            var size = this._map.getSize(),
                container = this._glContainer,
                gl = this._glMap,
                topLeft = this._map.containerPointToLayerPoint([0, 0]);

            L.DomUtil.setPosition(container, topLeft);

            const { center, zoom } = this._getGLCenterZoom();

            // gl.setView([center.lat, center.lng], this._map.getZoom() - 1, 0);
            // calling setView directly causes sync issues because it uses requestAnimFrame

            var tr = gl.transform;
            tr.center = mapboxgl.LngLat.convert([center.lng, center.lat]);
            tr.zoom = zoom - 1;

            if (gl.transform.width !== size.x || gl.transform.height !== size.y) {
                container.style.width = size.x + 'px';
                container.style.height = size.y + 'px';
                if (gl._resize !== null && gl._resize !== undefined) {
                    gl._resize();
                } else {
                    gl.resize();
                }
            } else {
                // older versions of mapbox-gl surfaced update publicly
                if (gl._update !== null && gl._update !== undefined) {
                    gl._update();
                } else {
                    gl.update();
                }
            }
        },

        // update the map constantly during a pinch zoom
        _pinchZoom: function (e) {
            this._glMap.jumpTo(this._getGLCenterZoom());
        },

        // borrowed from L.ImageOverlay https://github.com/Leaflet/Leaflet/blob/master/src/layer/ImageOverlay.js#L139-L144
        _animateZoom: function (e) {
            var northWest = this._map.unproject(this._map.getPixelBounds().getTopLeft());

            var scale = this._map.getZoomScale(e.zoom),
                offset = this._map._latLngToNewLayerPoint(northWest, e.zoom, e.center);

            L.DomUtil.setTransform(this._glMap._actualCanvas, offset.subtract(this._offset), scale);
        },

        _zoomStart: function (e) {
            this._zooming = true;
        },

        _zoomEnd: function () {
            var northWest = this._map.unproject(this._map.getPixelBounds().getTopLeft());

            var scale = this._map.getZoomScale(this._map.getZoom()),
                offset = this._map._latLngToNewLayerPoint(northWest, this._map.getZoom(), this._map.getCenter());

            L.DomUtil.setTransform(this._glMap._actualCanvas, offset.subtract(this._offset), scale);

            this._zooming = false;

            // TODO: Too early for update? (sometimes flickering)
            this._update();
        },

        _transitionEnd: function (e) {
            L.Util.requestAnimFrame(() => {
                var northWest = this._map.unproject(this._map.getPixelBounds().getTopLeft());
                offset = this._map.latLngToContainerPoint(northWest);

                // reset the scale and offset
                L.DomUtil.setTransform(this._glMap._actualCanvas, offset, 1);

                // enable panning once the gl map is ready again
                this._glMap.once('moveend', L.Util.bind(function () {
                    this._zoomEnd();
                }, this));

                // update the map position
                this._update();
            });
        }
    });

    L.mapboxGL = function (options) {
        return new MapboxGL(options);
    };

    return MapboxGL;
}));

