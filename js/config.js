// 自定义配置
if (!L.custom) {
    L.custom = {};
}

// 基础配置
L.custom.baseConfig = {
    // 初始中心点
    mapCenter: [30.5470, 114.2971],
    // 初始缩放级别
    mapZoom: 12,
    // 天地图服务密钥（请替换为你自己的密钥）
    TDT_TOKEN: "21bbbe234f9e41a4a8a4279afe53aa42",
}

// 图层配置
L.custom.layerConfig = {
    baseLayers: {
        '天地图矢量': L.layerGroup([
            L.tileLayer.chinaProvider('TianDiTu.Normal.Map', {
                key: L.custom.baseConfig.TDT_TOKEN,
                attribution: '天地图',
                minZoom: 1,
                maxZoom: 18,
            }),
            L.tileLayer.chinaProvider('TianDiTu.Normal.Annotion', {
                key: L.custom.baseConfig.TDT_TOKEN,
                attribution: '天地图',
                minZoom: 1,
                maxZoom: 18,
            })
        ]),
        '天地图影像': L.layerGroup([
            L.tileLayer.chinaProvider('TianDiTu.Satellite.Map', {
                key: L.custom.baseConfig.TDT_TOKEN,
                attribution: '天地图',
                minZoom: 1,
                maxZoom: 18,
            }),
            L.tileLayer.chinaProvider('TianDiTu.Satellite.Annotion', {
                key: L.custom.baseConfig.TDT_TOKEN,
                attribution: '天地图',
                minZoom: 1,
                maxZoom: 18,
            })
        ]),
        '高德矢量': L.layerGroup([
            L.tileLayer.chinaProvider('GaoDe.Normal.Map', {
                attribution: '高德地图',
                minZoom: 1,
                maxZoom: 18,
            }),
        ]),
        '高德矢量-高分屏': L.layerGroup([
            L.tileLayer.chinaProvider('GaoDe.Normal.Retina', {
                detectRetina: true,
                attribution: '高德地图',
                minZoom: 1,
                maxZoom: 19,
            }),
        ]),
        '腾讯矢量': L.layerGroup([
            L.tileLayer.chinaProvider('Tencent.Normal.Map', {
                attribution: '腾讯地图',
                minZoom: 1,
                maxZoom: 18,
            }),
        ]),
        'Google矢量': L.layerGroup([
            L.tileLayer.chinaProvider('Google.Normal.Map', {
                attribution: 'Google 地图',
                minZoom: 1,
                maxZoom: 22,
            }),
        ]),
        'Google矢量-高分屏': L.layerGroup([
            L.tileLayer.chinaProvider('Google.Normal.Retina', {
                attribution: 'Google 地图',
                minZoom: 1,
                maxZoom: 22,
            }),
        ]),
        'Google影像': L.layerGroup([
            L.tileLayer.chinaProvider('Google.Satellite.Map', {
                attribution: 'Google 地图',
                minZoom: 1,
                maxZoom: 20,
            }),
        ]),
        'Google影像-高分屏': L.layerGroup([
            L.tileLayer.chinaProvider('Google.Satellite.Retina', {
                attribution: 'Google 地图',
                minZoom: 1,
                maxZoom: 20,
            }),
        ]),
        'OpenStreetMap': L.layerGroup([
            L.tileLayer.chinaProvider('OSM.Normal.Map', {
                attribution: 'OpenStreetMap',
                minZoom: 1,
                maxZoom: 18,
            }),
        ]),
        'ArcGIS街道': L.layerGroup([
            L.tileLayer('https://server.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}.png', {
                attribution: 'ArcGIS 地图',
                minZoom: 1,
                maxZoom: 13,
            })
        ]),
        'ArcGIS影像': L.layerGroup([
            L.tileLayer('https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png', {
                attribution: 'ArcGIS 地图',
                minZoom: 1,
                maxZoom: 19,
            })
        ]),
    }
}

const CACHE_KEY = 'leaflet_map_type';

// 从本地缓存读取用户上次选择的地图类型
function getCachedMapType() {
    return localStorage.getItem(CACHE_KEY);
}

// 将用户选择的地图类型保存到本地缓存
function cacheMapType(layerName) {
    localStorage.setItem(CACHE_KEY, layerName);
}

if (getCachedMapType()) {
    L.custom.layerConfig.defaultLayer = L.custom.layerConfig.baseLayers[getCachedMapType()];
} else {
    // 默认图层
    if (isTouchDevice()) {
        L.custom.layerConfig.defaultLayer = L.custom.layerConfig.baseLayers['高德矢量-高分屏'];
    } else {
        L.custom.layerConfig.defaultLayer = L.custom.layerConfig.baseLayers['高德矢量'];
    }
}
