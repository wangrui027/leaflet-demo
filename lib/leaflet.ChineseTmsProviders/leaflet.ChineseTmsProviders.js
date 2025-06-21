// this L.CRS.Baidu from https://github.com/muyao1987/leaflet-tileLayer-baidugaode/blob/master/src/tileLayer.baidu.js

if (L.Proj) {
    L.CRS.Baidu = new L.Proj.CRS('EPSG:900913', '+proj=merc +a=6378206 +b=6356584.314245179 +lat_ts=0.0 +lon_0=0.0 +x_0=0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs', {
        resolutions: function () {
            var level = 19
            var res = [];
            res[0] = Math.pow(2, 18);
            for (var i = 1; i < level; i++) {
                res[i] = Math.pow(2, (18 - i))
            }
            return res;
        }(),
        origin: [0, 0],
        bounds: L.bounds([20037508.342789244, 0], [0, 20037508.342789244])
    });
}

L.TileLayer.ChinaProvider = L.TileLayer.extend({

    initialize: function(type, options) { // (type, Object)
        var providers = L.TileLayer.ChinaProvider.providers;

        options = options || {}

        var parts = type.split('.');

        var providerName = parts[0];
        var mapName = parts[1];
        var mapType = parts[2];

        var url = providers[providerName][mapName][mapType];
        options.subdomains = providers[providerName].Subdomains;
        options.key = options.key || providers[providerName].key;

        if ('tms' in providers[providerName]) {
            options.tms = providers[providerName]['tms']
        }

        L.TileLayer.prototype.initialize.call(this, url, options);
    },

    getTileUrl: function (coords) {
		var data = {
			s: this._getSubdomain(coords),
			x: coords.x,
			y: coords.y,
			z: this._getZoomForUrl(),
		};
		if (this._map && !this._map.options.crs.infinite) {
			var invertedY = this._globalTileRange.max.y - coords.y;
			if (this.options.tms) {
				data['y'] = invertedY;
			}
			data['-y'] = invertedY;
		}

        data.sx = data.x >> 4
        data.sy = (( 1 << data.z) - data.y) >> 4

		return L.Util.template(this._url, L.Util.extend(data, this.options));
	},
});

L.TileLayer.ChinaProvider.providers = {
    TianDiTu: {
        Normal: {
            Map: "https://t{s}.tianditu.gov.cn/DataServer?T=vec_w&X={x}&Y={y}&L={z}&tk={key}",
            Annotion: "https://t{s}.tianditu.gov.cn/DataServer?T=cva_w&X={x}&Y={y}&L={z}&tk={key}"
        },
        Satellite: {
            Map: "https://t{s}.tianditu.gov.cn/DataServer?T=img_w&X={x}&Y={y}&L={z}&tk={key}",
            Annotion: "https://t{s}.tianditu.gov.cn/DataServer?T=cia_w&X={x}&Y={y}&L={z}&tk={key}"
        },
        Terrain: {
            Map: "https://t{s}.tianditu.gov.cn/DataServer?T=ter_w&X={x}&Y={y}&L={z}&tk={key}",
            Annotion: "https://t{s}.tianditu.gov.cn/DataServer?T=cta_w&X={x}&Y={y}&L={z}&tk={key}"
        },
        Subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
        key: "174705aebfe31b79b3587279e211cb9a"
    },

    GaoDe: {
        Normal: {
            Map: 'https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&style=8&x={x}&y={y}&z={z}',
            Retina: 'https://wprd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}'
        },
        Satellite: {
            Map: 'https://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
            Annotion: 'https://webst0{s}.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}'
        },
        Subdomains: ["1", "2", "3", "4"],
    },

    Google: {
        /**
         * 参数解释：
         *   lyrs 图层类型: m 路线图，s 卫星图，y 带注记的卫星图，t 地形图，p 带注记的地形图，h 注记层
         *   hl 语言参数: zh-CN 简体中文，en-US 英语，ru 俄罗斯语
         *   scale 地图元素的大小比例，默认为1，取值范围1、2、3、4
         */
        Normal: {
            Map: "https://www.google.cn/maps/vt?lyrs=m&gl=cn&x={x}&y={y}&z={z}",
            Retina: "https://www.google.cn/maps/vt?lyrs=m&gl=cn&hl=zh-CN&x={x}&y={y}&z={z}&scale=2"
        },
        Satellite: {
            Map: "https://www.google.cn/maps/vt?lyrs=y&gl=cn&x={x}&y={y}&z={z}",
            Retina: "https://www.google.cn/maps/vt?lyrs=y&gl=cn&hl=zh-CN&x={x}&y={y}&z={z}&scale=2"
        },
        Terrain: {
            Map: "https://www.google.cn/maps/vt?lyrs=p&gl=cn&x={x}&y={y}&z={z}",
            Retina: "https://www.google.cn/maps/vt?lyrs=p&gl=cn&hl=zh-CN&x={x}&y={y}&z={z}&scale=2"
        },
        Subdomains: []
    },

    Geoq: {
        Normal: {
            Map: "https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer/tile/{z}/{y}/{x}",
            PurplishBlue: "https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}",
            Gray: "https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetGray/MapServer/tile/{z}/{y}/{x}",
            Warm: "https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetWarm/MapServer/tile/{z}/{y}/{x}",
        },
        Theme: {
            Hydro: "https://thematic.geoq.cn/arcgis/rest/services/ThematicMaps/WorldHydroMap/MapServer/tile/{z}/{y}/{x}"
        },
        Subdomains: []
    },

    OSM: {
        Normal: {
            Map: "https://{s}.tile.osm.org/{z}/{x}/{y}.png",
        },
        Subdomains: ['a', 'b', 'c']
    },

    Baidu: {
        Normal: {
            Map: 'https://online{s}.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&styles=pl&scaler=1&p=1'
        },
        Satellite: {
            Map: 'https://shangetu{s}.map.bdimg.com/it/u=x={x};y={y};z={z};v=009;type=sate&fm=46',
            Annotion: 'https://online{s}.map.bdimg.com/tile/?qt=tile&x={x}&y={y}&z={z}&styles=sl&v=020'
        },
        Subdomains: '0123456789',
        tms: true
    },

    Tencent: {
        Normal: {
            Map: "https://rt{s}.map.gtimg.com/tile?z={z}&x={x}&y={-y}&type=vector&styleid=3",
        },
        Satellite: {
            Map: "https://p{s}.map.gtimg.com/sateTiles/{z}/{sx}/{sy}/{x}_{-y}.jpg",
        },
        Terrain: {
            Map: "https://p{s}.map.gtimg.com/demTiles/{z}/{sx}/{sy}/{x}_{-y}.jpg"
        },
        Subdomains: '0123',
    }

};

L.tileLayer.chinaProvider = function(type, options) {
    return new L.TileLayer.ChinaProvider(type, options);
};
