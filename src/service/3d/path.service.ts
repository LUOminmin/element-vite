import smart3d from 'smart3d';
import * as Cesium from '@smart/cesium';
import api from 'src/App.api';
import start from '../../../assets/images/surround/start.png';
import end from '../../../assets/images/surround/end.png';
import { StoreService } from './store.service';
import { DataType } from 'src/store/types';
interface Degrees {
  longitude: number;
  latitude: number;
  height: number;
}
// 路径服务类型
enum MapServiceTypeEnum {
  AMap = 'amap',
  Baidu = 'baidu',
  Custom = 'custom'
}
interface SelectedMap {
  label?: string;
  value: string; // 路径服务地址
  type: MapServiceTypeEnum; // 路径服务类型(amap、baidu、custom)
  minType: string; // 具体路线方式(行走、驾车、骑行)
}
const IconWidth = 30;
const IconHeight = 37;
// 地图key值
const mapKeys: any[] = [
  {
    type: 'amap',
    key: 'ab3cf00f611927e7e6d027c50903031f'
  },
  {
    type: 'baidu',
    key: 'tABTaDcPt5C2lLbPsQic7ovGLd3GUE28'
  },
  {
    type: 'custom',
    key: ''
  }
];
// 路径分析默认配置
const defaultPathConfigOPtions: SelectedMap[] = [
  {
    label: '高德-行走路径服务',
    value: 'https://restapi.amap.com/v3/direction/walking',
    minType: 'amap-walking',
    type: MapServiceTypeEnum.AMap
  },
  {
    label: '高德-驾车路径服务',
    value: 'https://restapi.amap.com/v3/direction/driving',
    minType: 'amap-driving',
    type: MapServiceTypeEnum.AMap
  }
  // {
  //   label: '高德-骑行路径服务',
  //   value: 'https://restapi.amap.com/v4/direction/bicycling',
  //   minType: 'amap-bicycling',
  //   type: MapServiceTypeEnum.AMap
  // }
];
const coordTransformUrl =
  'https://restapi.amap.com/v3/assistant/coordinate/convert';
const coorTool = require('coordtransform');
const defaultPoi = {
  longitude: 0,
  latitude: 0,
  height: 0
};
export class PathService extends StoreService {
  startPoint: Degrees = defaultPoi;
  endPoint: Degrees = defaultPoi;
  serviceType: MapServiceTypeEnum = MapServiceTypeEnum.AMap;
  selectedMap: SelectedMap = defaultPathConfigOPtions[0];
  serviceKey: string = mapKeys[this.selectedMap.type]; // 服务权限标识
  drawLayer: any;
  constructor(private viewer: smart3d.Viewer) {
    super();
  }
  initPathHelper(): void {
    this.drawLayer = this.viewer.entities.add(new Cesium.EntityCollection());
    this.updatePathService();
  }
  /**
   * 更新路径服务
   * @param params {
   * type: 路径服务类型
   * value: 路径服务地址
   * }
   */
  updatePathService(): void {
    this.serviceKey = mapKeys.find(
      (item) => item.type === this.selectedMap.type
    ).key;
  }
  /**
   * 转换路径坐标
   * @param serviceType 服务类型
   * @param result 返回路径结果
   */
  _transformRoute(result: any[] | any): any {
    let distance = 0;
    let duration = 0;
    let pathList: Cesium.Cartesian3[] = [];
    const serviceType: MapServiceTypeEnum = this.selectedMap.type;
    switch (serviceType) {
      // 具体参数参考：https://lbs.amap.com/api/webservice/guide/api/direction#walk
      case MapServiceTypeEnum.AMap:
        distance = Number(result.paths[0].distance);
        duration = Number(result.paths[0].duration);
        result.paths[0].steps.forEach((step) => {
          pathList = pathList.concat(this._transformPath(step.polyline));
        });
        break;
      // 具体参数参考：http://lbsyun.baidu.com/index.php?title=webapi/directionlite-v1 需要后台转发
      case MapServiceTypeEnum.Baidu:
        distance = Number(result[0].distance);
        duration = Number(result[0].duration);
        result[0].steps.forEach((step) => {
          pathList = pathList.concat(this._transformPath(step.path));
        });
        break;
      default:
        // TODO
        break;
    }
    return {
      distance,
      duration,
      pathList
    };
  }
  /**
   * 将路径坐标转换为笛卡尔坐标集
   * @param path 路段坐标串 ‘lon,lat;lon,lat;’
   */
  _transformPath(path: string): Cesium.Cartesian3[] {
    const cartesianList: Cesium.Cartesian3[] = [];
    const pointStrList = path.split(';');
    let degrees: any[];
    let cartesian;
    pointStrList.forEach((pointStr) => {
      degrees = pointStr.split(',');
      degrees = coorTool.gcj02towgs84(Number(degrees[0]), Number(degrees[1]));
      cartesian = Cesium.Cartesian3.fromDegrees(degrees[0], degrees[1]);
      if (cartesian) {
        cartesianList.push(cartesian);
      }
    });
    return cartesianList;
  }
  /**
   *  分析
   */
  async pathAnalysis(type: number): Promise<void> {
    // 清除drawLayer路线
    this.clearPath();
    // 选中的路线行走、驾车
    this.selectedMap = defaultPathConfigOPtions[type] || this.selectedMap;
    let params = {};
    // 高德路径规划服务不提供原始坐标系的设置，所以需要两次服务调用
    if (this.selectedMap.type === MapServiceTypeEnum.AMap) {
      const data = await this._getMapData(coordTransformUrl, {
        key: this.serviceKey,
        coordsys: 'gps',
        locations:
          `${this.startPoint.longitude.toFixed(
            6
          )},${this.startPoint.latitude.toFixed(6)}|` +
          `${this.endPoint.longitude.toFixed(
            6
          )},${this.endPoint.latitude.toFixed(6)}`
      });
      if (data.status !== '1') {
        console.error('高度API坐标转换出现问题：' + data.info);
        return;
      }
      const locations = data.locations.split(';');
      params = {
        origin: locations[0],
        destination: locations[1],
        key: this.serviceKey
      };
      const response = await this._getMapData(this.selectedMap.value, params);
      // notes: 高德骑行服务返回的居然是data，高德其它服务返回都是route
      const result = response.route || response.data;
      if (!result) return;
      const pathInfo = this._transformRoute(result);
      this.setPoint(pathInfo.pathList);
      this._drawPath(pathInfo);
      // console.log(`地名服务不符要求：${err.message}`);
      // console.log(`高度API坐标转换请求出错：${err.message}`);
      return;
    }
    // 非高德处理 暂时没用到 todo
    switch (this.serviceType) {
      case MapServiceTypeEnum.Baidu:
        params = {
          origin: `${this.startPoint.longitude},${this.startPoint.latitude}`,
          destination: `${this.endPoint.longitude},${this.endPoint.latitude}`,
          key: this.serviceKey,
          coord_type: 'wgs84', // 输入的坐标系，默认bd09ll
          ret_coordtype: 'gcj02' // 返回的坐标系，默认bd09ll
        };
        break;
      default:
        this.selectedMap.value += `origin=${this.startPoint.longitude},${this.startPoint.latitude}&
          destination=${this.endPoint.longitude},${this.endPoint.latitude}`;
        break;
    }
    const response = await this._getMapData(this.selectedMap.value, params);
    // notes: 目前只写了百度的，自定义格式暂时采用百度的返回格式
    const result = response.routes;
    if (result) {
      const pathInfo = this._transformRoute(result);
      this._drawPath(pathInfo);
    } else {
      console.log(response.info || response.message || response.errdetail);
    }
  }
  async _getMapData(url: string, param: unknown): Promise<any> {
    let data;
    await api.viewer3d.getRouteData(url, param, { baseURL: '' }).then((res) => {
      data = res;
    });
    return data;
  }
  /**
   * 绘制路径分析结果
   * @param distance 距离/米
   * @param duration  时长/秒
   * @param pathList  路径笛卡尔点集
   */
  _drawPath(options: {
    distance: number;
    duration: number;
    pathList: Cesium.Cartesian3[];
  }): void {
    const { distance, duration, pathList } = options;
    let distanceInfo = '路线全长约：';
    distanceInfo +=
      distance > 1000
        ? (distance / 1000).toFixed(2) + '千米'
        : distance.toFixed(0) + '米';
    const durationInfo = '全程耗时约：' + this._getDurationInfo(duration);
    this.store.dispatch({
      type: DataType.ROUTEMESS,
      value: { distanceInfo, durationInfo }
    });
    this.drawLayer.entityCollection.add(
      new Cesium.Entity({
        id: 'route',
        position: pathList[Math.floor(pathList.length / 2)],
        polyline: {
          show: true,
          material: Cesium.Color.fromAlpha(Cesium.Color.AQUA, 0.7),
          // material: Cesium.Color.fromBytes(51, 187, 255, 1),
          clampToGround: true,
          classificationType: Cesium.ClassificationType.BOTH,
          positions: pathList,
          width: 4
          // scale: 1.0
        },
        label: {
          text: distanceInfo + '\n' + durationInfo,
          font: '14px Microsoft YaHei',
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
          pixelOffset: new Cesium.Cartesian2(20, 20),
          showBackground: true,
          heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
        }
      })
    );
    this.flyToPath();
  }
  flyToPath(): void {
    const entity = this.drawLayer.entityCollection.getById('route');
    // 查看路线
    this.viewer.flyTo(entity, {
      duration: 2,
      offset: new Cesium.HeadingPitchRange(
        Cesium.Math.toRadians(360),
        Cesium.Math.toRadians(-70),
        1700
      )
    });
  }
  setPoint(list: Cesium.Cartesian3[]): void {
    const create = (id, pos, image) => {
      this.drawLayer.entityCollection.add({
        id: id,
        position: pos,
        billboard: {
          image: image,
          width: IconWidth,
          height: IconHeight,
          show: true,
          heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM
        }
      });
    };
    if (!list[0] || !list[list.length - 1]) return;
    create('start', list[0], start);
    create('end', list[list.length - 1], end);
  }
  /**
   * 将秒数转换为天时分格式
   * @param second 秒数
   */
  _getDurationInfo(second: number): string {
    let durationStr = '';
    let minute = Math.round(Number(second) / 60);
    let hour = 0;
    let day = 0;
    if (minute > 60) {
      hour = Math.floor(minute / 60);
      minute = minute % 60;
    } else {
      durationStr = `${minute}分钟`;
    }

    if (hour > 24) {
      day = Math.floor(hour / 24);
      hour = Math.floor(hour % 24);
      durationStr = `${day}天${hour}小时${minute}分钟`;
    } else if (hour > 0) {
      durationStr = `${hour}小时${minute}分钟`;
    }
    return durationStr;
  }
  clearPath(): void {
    // 起点、终点、路线
    const startP = this.drawLayer.entityCollection.getById('start');
    const endP = this.drawLayer.entityCollection.getById('end');
    const lastPath = this.drawLayer.entityCollection.getById('route');
    startP && this.drawLayer.entityCollection.remove(startP);
    endP && this.drawLayer.entityCollection.remove(endP);
    lastPath && this.drawLayer.entityCollection.remove(lastPath);
  }
  /**
   * 清除路径分析的结果/释放内存
   */
  destroy(): void {
    this.startPoint = defaultPoi;
    this.endPoint = defaultPoi;
    this.drawLayer.entityCollection.removeAll();
    this.viewer.scene.primitives.remove(this.drawLayer);
  }
}
