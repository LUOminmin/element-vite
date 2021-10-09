import smart3d from 'smart3d';
import { Store } from 'redux';
import { store } from 'src/index';
import { DataType } from 'src/store/types';
import { Action, StoreData } from 'src/store/types';
import * as Cesium from '@smart/cesium';
import center from '../../../assets/images/surround/center.png';
import icon5 from '../../../assets/images/surround/5.png';
import icon6 from '../../../assets/images/surround/6.png';
import icon7 from '../../../assets/images/surround/7.png';
import icon8 from '../../../assets/images/surround/8.png';
import icon9 from '../../../assets/images/surround/9.png';
import icon10 from '../../../assets/images/surround/10.png';
import icon11 from '../../../assets/images/surround/11.png';
import icon12 from '../../../assets/images/surround/12.png';
import icon13 from '../../../assets/images/surround/13.png';
import icon14 from '../../../assets/images/surround/14.png';
import icon15 from '../../../assets/images/surround/15.png';
import icon16 from '../../../assets/images/surround/16.png';
import icona5 from '../../../assets/images/surround/5a.png';
import icona6 from '../../../assets/images/surround/6a.png';
import icona7 from '../../../assets/images/surround/7a.png';
import icona8 from '../../../assets/images/surround/8a.png';
import icona9 from '../../../assets/images/surround/9a.png';
import icona10 from '../../../assets/images/surround/10a.png';
import icona11 from '../../../assets/images/surround/11a.png';
import icona12 from '../../../assets/images/surround/12a.png';
import icona13 from '../../../assets/images/surround/13a.png';
import icona14 from '../../../assets/images/surround/14a.png';
import icona15 from '../../../assets/images/surround/15a.png';
import icona16 from '../../../assets/images/surround/16a.png';
import api from '../../../api/home.api';
import { AnalysisBaseService } from './analysis-base.service';
import { PathService } from './path.service';
import { ViewerService } from './viewer.service';
interface Degrees {
  longitude: number;
  latitude: number;
  height: number;
}
interface CampusMess {
  lng: number;
  lat: number;
  id: number;
  name: string;
}
interface SearchParams {
  radius?: string;
  type?: string;
}
const iconList = [
  icon5,
  icon6,
  icon7,
  icon8,
  icon9,
  icon10,
  icon11,
  icon12,
  icon13,
  icon14,
  icon15,
  icon16
];
const iconAList = [
  icona5,
  icona6,
  icona7,
  icona8,
  icona9,
  icona10,
  icona11,
  icona12,
  icona13,
  icona14,
  icona15,
  icona16
];
const IconWidth = 30;
const IconHeight = 37;
export class SurroundService implements AnalysisBaseService {
  type = 'Around';
  private _surroundLayer: any; // 单个小区图层分析集合
  private handler?: any; // 事件集合
  private _activeEntity: any; // 点击展示的实体
  private searchParams: SearchParams = {}; // 查询参数
  private _list: any[]; // 类型实体
  private store: Store<StoreData, Action>;
  private _lastActiveId: any;
  private pathService: any;
  private viewer: smart3d.Viewer;
  // 路线分析
  startPoint: Degrees | null = null;
  endPoint: Degrees | null = null;
  campusMess: CampusMess = {
    lng: 0,
    lat: 0,
    id: 0,
    name: ''
  };
  constructor(private viewerService: ViewerService) {
    this.viewer = viewerService.viewer;
    this._list = [];
    this.pathService = new PathService(viewerService.viewer);
    // 实体图层
    this._surroundLayer = this.viewer.entities.add(
      new Cesium.EntityCollection()
    );
    this.store = store;
  }
  // 激活工具
  active(): void {
    const mess = this.getState('campusPoint');
    this.campusMess = {
      lng: Number(mess.lng),
      lat: Number(mess.lat),
      id: mess.id,
      name: mess.name
    };
    // this.setCamerePos();
    this.createCollection();
    this.pathService.initPathHelper();
    this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    this.handler.setInputAction((movement) => {
      this.clickEvent(movement.position);
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }

  deactive(): void {
    this._surroundLayer?.entityCollection?.removeAll();
    this.handler?.destroy();
    this.resetCampus();
    // this.restoreView();
    this.viewerService.layerService.getCampusPos();
  }
  // 初始化
  async createCollection(radius?: string, type?: string): Promise<void> {
    // 没有小区信息不处理
    if (!this.campusMess?.lng || !this.campusMess.lat || !this.campusMess.id)
      return;
    // 没有查询条件不处理
    if (!radius || !type) return;
    this.searchParams.type = type;
    this.searchParams.radius = radius;
    this._list = await this.getData(this.campusMess.id);
    this.initEntities();
  }
  // 获取数据
  async getData(id: number): Promise<any> {
    let list;
    const param = {
      residentialQuarterId: id,
      distance: this.searchParams.radius,
      type: this.searchParams.type
    };
    await api.apis.getPeripheryList(param).then((res) => {
      list = res?.data || [];
    });
    return list;
  }
  // 初始化已知所有实体
  initEntities(): void {
    this._surroundLayer?.entityCollection?.removeAll();
    // 先建的实体在上层，后建的实体在底层（还和其他因素有关系）
    this.createActiveEntity(); // 活动标签
    this.createCircleEntity(); // 画圈圈实体
    this.createEntities(); // 类型实体
    this.radiusEntity(); // 显示半径
  }
  radiusEntity(): void {
    const radius = Number(this.searchParams.radius);
    const pos = this.calculatePoint(
      Cesium.Cartesian3.fromDegrees(this.campusMess.lng, this.campusMess.lat),
      radius
    );
    this._surroundLayer.entityCollection.add({
      id: 'radiusText',
      position: pos,
      label: {
        text: radius / 1000 + 'km',
        font: 'bold 24px Roboto',
        fillColor: Cesium.Color.WHITE,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 2,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        pixelOffset: new Cesium.Cartesian2(0, -40),
        horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
      }
    });
  }
  // 画圈圈实体
  createCircleEntity(): any {
    const entity = this._surroundLayer.entityCollection.add({
      id: 'circle',
      name: this.campusMess.name,
      position: Cesium.Cartesian3.fromDegrees(
        this.campusMess.lng,
        this.campusMess.lat
      ),
      ellipse: {
        semiMinorAxis: this.searchParams.radius,
        semiMajorAxis: this.searchParams.radius,
        // material: Cesium.Color.YELLOW.withAlpha(0.2),
        height: 200.0, // 100.0
        material: Cesium.Color.YELLOW.withAlpha(0),
        outline: true, // height must be set for outline to display
        outlineWidth: 0.1,
        outlineColor: Cesium.Color.fromCssColorString('#FCC865')
      },
      billboard: {
        image: center,
        width: 17,
        height: 14,
        heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, -10)
      }
      // label: {
      //   text: Number(this.searchParams.radius) / 1000 + 'km',
      //   font: 'bold 28px Roboto',
      //   pixelOffset: new Cesium.Cartesian2(0, -70),
      //   horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
      //   verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      //   heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
      // }
    });
    // this.viewer?.zoomTo(entity);
    this.viewer.flyTo(entity, {
      duration: 2,
      offset: new Cesium.HeadingPitchRange(
        Cesium.Math.toRadians(360),
        Cesium.Math.toRadians(-45),
        8000 + Number(this.searchParams.radius) * 2.5
      )
    });
  }
  // 创建标签实体
  createActiveEntity(): void {
    this._activeEntity = this._surroundLayer.entityCollection.add({
      id: 'active',
      name: 'active',
      position: Cesium.Cartesian3.fromDegrees(
        this.campusMess.lng,
        this.campusMess.lat
      ),
      label: {
        text: '',
        showBackground: true,
        font: 'bold 16px Roboto',
        backgroundColor: Cesium.Color.BLACK.withAlpha(0.7),
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, -50),
        heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
      },
      // 方式2时注释掉
      // billboard: {
      //   image: center, // 不展示，作用于调整实体z-index
      //   scale: 0,
      //   width: IconWidth,
      //   height: IconHeight,
      //   // 处理图标被遮挡问题
      //   heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
      //   horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      //   verticalOrigin: Cesium.VerticalOrigin.BOTTOM
      // },
      show: true // 处理遮盖问题
    });
  }
  // 创建所有类型实体
  createEntities(): void {
    this._list.forEach((item) => {
      if (!item.lng || !item.lat) return;
      this._surroundLayer.entityCollection.add({
        id: item.id,
        name: item.name + '/' + item.distance + '米',
        description: item.childTypeId,
        position: Cesium.Cartesian3.fromDegrees(
          Number(item.lng),
          Number(item.lat)
        ),
        billboard: {
          image: iconList[item.childTypeId - 5],
          width: IconWidth,
          height: IconHeight,
          // 处理图标被遮挡问题
          heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          scale: 1.0
        }
      });
    });
  }
  // 计算点位置
  calculatePoint(position: any | null, len: number): any {
    const matrix = Cesium.Transforms.eastNorthUpToFixedFrame(position);
    const mz = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(90));
    const rotationZ = Cesium.Matrix4.fromRotationTranslation(mz);
    Cesium.Matrix4.multiply(matrix, rotationZ, matrix);
    const result = Cesium.Matrix4.multiplyByPoint(
      matrix,
      new Cesium.Cartesian3(0, len * 1.2, 0),
      new Cesium.Cartesian3()
    );
    return result;
  }
  /* eslint-disable */
  // 点击显示活动标签
  clickEvent(position: any): void {
    if (!this._activeEntity) return;
    const scene = this.viewer.scene;
    const pickedObject = scene.pick(position);
    if (
      !scene.pickPositionSupported ||
      !Cesium.defined(pickedObject) ||
      !pickedObject?.id ||
      pickedObject.id._name === 'active'
    ) {
      this._activeEntity.show = false;
      return;
    }
    const entity = pickedObject.id;
    if (entity._name === 'active') return;
    this.pathService.clearPath();
    // 需要处理点击事件的
    this.flyToEntity(entity);
    this.showActive(entity);
  }
  // 展示选中标签
  /**
   * 1、以图片遮盖的方式，点击列表可以展示选中，但是部分icon需要旋转才会展示选中图标；（需手动延迟）
   * 2、以记录上一个图标的实现方式，选中不能高亮图标....
   */
  showActive(entity?): void {
    // 方式1：
    // const icon = iconAList[entity._description - 5];
    // this._activeEntity.position = entity._position;
    // this._activeEntity.billboard.image = icon;
    // this._activeEntity.billboard.scale = 1.0;
    // const proList = entity._name && entity._name.split('/');
    // this._activeEntity.label.text = !proList
    //   ? this.campusMess.name
    //   : proList[1]
    //   ? proList[0] + '\n' + proList[1]
    //   : proList[0];
    // this._activeEntity.show = true;
    // 方式2：
    if (this._lastActiveId && this._lastActiveId._description) {
      this._lastActiveId.billboard.image =
        iconList[this._lastActiveId._description - 5];
    }
    entity.billboard.image = iconAList[entity._description - 5];
    entity.billboard.scale = 1.0;
    entity.billboard.width = IconWidth;
    entity.billboard.height = IconHeight;
    this._activeEntity.position = entity._position;
    const proList = entity._name && entity._name.split('/');
    this._activeEntity.label.text = !proList
      ? this.campusMess.name
      : proList[1]
      ? proList[0] + '\n' + proList[1]
      : proList[0];
    this._activeEntity.show = true;
    this._lastActiveId = entity;
  }
  // 根据id查询实体并定位
  searchById(curId: number, toFly?: boolean): void {
    // 清除已有的路线
    this.pathService.clearPath();
    const curEntity = this._surroundLayer.entityCollection.getById(curId);
    if (!curEntity) return;
    !toFly && this.flyToEntity(curEntity);
    setTimeout(() => {
      this.showActive(curEntity);
    }, 800);
    // this.viewer.zoomTo(curEntity);
  }
  flyToEntity(entity): void {
    if (entity._id === 'circle') return;
    this.viewer.flyTo(entity, {
      duration: 1,
      offset: new Cesium.HeadingPitchRange(
        Cesium.Math.toRadians(360),
        Cesium.Math.toRadians(-25),
        1000
      )
    });
  }
  // 定位的方法2
  locate(entity): void {
    this.viewer.flyTo(entity, {
      duration: 0,
      offset: new Cesium.HeadingPitchRange(
        Cesium.Math.toRadians(360),
        Cesium.Math.toRadians(-25),
        1000
      )
    });
  }
  // todo ...是否缓存
  filterPoints(list: any[], searchObj: SearchParams): void {
    // 处理小区实体
    const areaId = this.campusMess.id;
    const areaEntity = this._surroundLayer.entityCollection.getById(areaId);
    if (!areaEntity) return;
    // 处理类型实体
    if (!Array.isArray(list)) return;
    const ids = list.map((item) => {
      return item.id;
    });
    this._surroundLayer?.entityCollection.values.forEach((item) => {
      if (
        ids.indexOf(item._id) !== -1 ||
        item._name === 'active' ||
        item._name === 'area'
      ) {
        item.show = true;
      } else {
        item.show = false;
      }
    });
    const ellipse = {
      semiMinorAxis: searchObj.radius,
      semiMajorAxis: searchObj.radius,
      material: Cesium.Color.YELLOW.withAlpha(0.2)
    };
    areaEntity.ellipse = ellipse;
    areaEntity.show = true;
  }
  private getState(name: string) {
    return this.store.getState()[name];
  }
  // 画路线
  goto(type: string, item: any): void {
    if (!item) return;
    this.searchById(item.id, true);
    this._surroundLayer.entityCollection.getById(item.id);
    this.setMarker(item.lng, item.lat);
    this.pathService.pathAnalysis(type);
  }
  // 打标志
  setMarker(lng, lat): void {
    const position = {
      longitude: Number(lng),
      latitude: Number(lat),
      height: 0
    };
    this.pathService.startPoint = {
      longitude: this.campusMess.lng,
      latitude: this.campusMess.lat,
      height: 0
    };
    this.pathService.endPoint = position;
  }
  // 经纬度转世界坐标
  degreesToCartesian(degree: Degrees): Cesium.Cartesian3 {
    const ellipsoid = this.viewer.scene.globe.ellipsoid;
    return Cesium.Cartesian3.fromDegrees(
      degree.longitude,
      degree.latitude,
      degree.height,
      ellipsoid
    );
  }
  // private setCamerePos() {
  //   const { camera } = this.viewer;
  //   this.originView = {
  //     destination: camera.position.clone(),
  //     orientation: {
  //       heading: camera.heading,
  //       pitch: camera.pitch,
  //       roll: camera.roll
  //     }
  //   };
  // }
  // private restoreCamerePos() {
  //   if (!this.originView) return;
  //   this.viewer.camera.flyTo({ ...this.originView, duration: 2 });
  //   this.originView = undefined;
  // }
  // restoreView(): void {
  //   this.handler && this.handler.destroy();
  //   this.restoreCamerePos();
  // }
  resetCampus(): void {
    const fn = (type) => {
      this.store.dispatch({
        type: DataType[type],
        value: ''
      });
    };
    fn('BUILDING');
    fn('FLOOR');
    fn('ROOM');
  }
}
