L.Control.custom = {
    // 级别显示控件
    ZoomDisplay: L.Control.extend({
        options: {
            prefix: '级别: ',
        },
        map: null,
        container: null,
        onAdd: function (map) {
            this.map = map;
            this.container = L.DomUtil.create('div', 'leaflet-control-zoom-display');
            this.container.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
            this.container.style.margin = '0';
            this.container.style.padding = '0 5px';
            this.refreshControl();
            this.onMapEvent();
            return this.container;
        },
        onRemove: function (map) {
        },
        refreshControl: function () {
            this.container.innerHTML = this.options.prefix + this.map.getZoom();
        },
        onMapEvent: function () {
            const that = this;
            this.map.on('zoomend', function () {
                that.refreshControl();
            });
        }
    })
}