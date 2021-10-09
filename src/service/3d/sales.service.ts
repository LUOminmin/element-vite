import smart3d from 'smart3d';
import * as Cesium from '@smart/cesium';
import { Cesium3DTileset, Cesium3DTileStyle } from '@smart/cesium';
import { PickedContent, PickHandler } from '../common/PickHandler';
import { store } from 'src/index';
import { Action, StoreData } from 'src/store/types';
import { Store } from 'redux';
import { AnalysisBaseService } from './analysis-base.service';
import api from 'src/App.api';
import { ToolTips } from '../common/toolTips';
export class SalesService implements AnalysisBaseService {
  type = 'HouseSell';
  handler: any;
  roomList: any[] = [];
  campusId = '';
  buildingId = '';
  floorId = '';
  readonly saledColor = "'#D9001B'"; // 已售 yellow
  readonly unsaleColor = "'#389CFF'"; // 未售 #fff
  private toolTips: ToolTips;
  buildingsObj: any;
  store: Store<StoreData, Action>;
  constructor(private viewer: smart3d.Viewer) {
    this.store = store;
    this.viewer = viewer;
    this.toolTips = new ToolTips(this.viewer, {
      fontSize: 14,
      fontColor: '#fff',
      fontOffset: new Cesium.Cartesian2(10, 20)
    });
  }
  // 获取数据源
  async getData(): Promise<any> {
    let list;
    await api.viewer3d.getRoomList({}, this.campusId).then((res) => {
      list = res?.data || [];
    });
    return list;
  }
  // 开始激活操作
  async active(): Promise<void> {
    this.campusId = String(this.getState('campus'));
    // 有数据并且有小区id
    if (!this.campusId) return;
    if (!this.roomList.length) {
      this.roomList = await this.getData();
    }
    this.hightlightAll();
    this.handler = new PickHandler(this.viewer.scene, {
      isHL: false,
      enable: true,
      rightClear: false,
      leftCallback: this.clickEvent.bind(this)
    });
    this.mouseEvent();
  }
  // 按楼栋格式化数据{'栋号': [{户信息}, {户信息}]};
  formatData(id: 'buildIngId' | 'floorModelIdent', list: any[]): any {
    if (!id || !list?.length) return;
    const obj = {};
    list.forEach((el) => {
      obj[el[id]] = obj[el[id]] ? obj[el[id]].concat(el) : [el];
    });
    return obj;
  }
  // 高亮某一小区
  hightlightAll(): void {
    this.buildingsObj = this.formatData('buildIngId', this.roomList) || {};
    const primitives = this.viewer.scene.primitives['_primitives'];
    // 刚进入走的逻辑
    primitives.forEach((b) => {
      if (!(b instanceof Cesium3DTileset) || !b['props'].id) return;
      const buildId = b['props'].id;
      const list = this.buildingsObj[buildId] || [];
      this.highLightBuilding(list, b);
    });
  }
  // 高亮某一幢
  highLightBuilding(list: any[], target: Cesium3DTileset): void {
    const conditions: [string, string][] = [];
    list = list || [];
    list.forEach((el) => {
      // 1:在售 2：已售(在售的数据在模型上没有匹配到，所以是没有的)
      // const colors = el.xszt === 2 ? "color('#AD7BB5')" : "color('#4C4C4C')";
      const colors =
        el.xszt === 2
          ? 'color(' + this.saledColor + ')'
          : 'color(' + this.unsaleColor + ')';
      const floor = '${Floor} === "' + el.floorModelIdent + '"';
      const room = '${Room} === "' + el.modelIdent + '"';
      const condition = floor + ' && ' + room;
      conditions.unshift([condition, colors]);
    });
    conditions.push(['true', 'color("#fff")']);
    target.style = new Cesium3DTileStyle({
      color: { conditions }
    });
  }
  // 高亮某一层
  hightlightFloor(target: Cesium3DTileset, id: string): void {
    const conditions: [string, string][] = [];
    const list = this.buildingsObj[this.buildingId] || [];
    list.forEach((el) => {
      // 1:已售 2：已售(在售的数据在模型上没有匹配到，所以是没有的)
      const colors =
        el.xszt === 2
          ? 'color(' + this.saledColor + ')'
          : 'color(' + this.unsaleColor + ')';
      const floor = '${Floor} === "' + el.floorModelIdent + '"';
      const room = '${Room} === "' + el.modelIdent + '"';
      const theFloor = '${Floor} === "' + id + '"';
      const condition = floor + ' && ' + room + ' && ' + theFloor;
      conditions.unshift([condition, colors]);
    });
    conditions.push(['true', "color('#87CEFA',0.015)"]);
    target.style = new Cesium3DTileStyle({
      color: { conditions }
    });
  }
  // 销毁当前功能
  deactive(): void {
    this.handler?.destroy();
    this.clearHighLight();
  }
  getState(name: string): any {
    return this.store.getState()[name];
  }
  // 点击事件
  private clickEvent(picked: PickedContent | null): void {
    // 干扰问题
    if (this.getState('analysisTool') !== this.type) return;
    const pickedObject = picked?.obj;
    // 点击其他区域初始化
    if (!(pickedObject instanceof Cesium.Cesium3DTileFeature)) {
      this.hightlightAll();
      this.buildingId = this.floorId = '';
      return;
    }
    // 获取当前楼层id 和 楼幢id
    const floorId = pickedObject.getProperty('Floor');
    const buildId = pickedObject.primitive['props'].id;
    if (!buildId) return;
    // 切换幢展示
    if (this.buildingId !== buildId) {
      this.clearHightlightBuilding(buildId);
      // 高亮当前这一幢
      this.highLightBuilding(
        this.buildingsObj[buildId],
        pickedObject.primitive
      );
      this.buildingId = buildId;
    } else {
      if (!floorId) return;
      if (floorId !== this.floorId) {
        // 高亮某一层 透明化其他层
        this.hightlightFloor(pickedObject.primitive, floorId);
        this.floorId = floorId;
      } else {
        // 还原整栋楼
        this.highLightBuilding(
          this.buildingsObj[buildId],
          pickedObject.primitive
        );
        this.floorId = '';
      }
    }
  }
  // 透明化未选择楼栋/楼栋集
  clearHightlightBuilding(buildingId: string): void {
    const primitives = this.viewer.scene.primitives['_primitives'];
    primitives.forEach((p) => {
      if (!(p instanceof Cesium.Cesium3DTileset) || !p['props'].id) return;
      if (p['props'].campus !== this.campusId) return;
      if (p['props'].id === buildingId) return;
      p.style = new Cesium.Cesium3DTileStyle({
        color: {
          conditions: [['true', "color('#FFF',0.1)"]]
        }
      });
    });
  }

  clearHighLight(): void {
    // 清除上色
    const primitives = this.viewer.scene.primitives['_primitives'] || [];
    primitives.forEach((el) => {
      if (!(el instanceof Cesium3DTileset) || !el['props'].id) return;
      el.style = new Cesium3DTileStyle();
    });
  }
  mouseEvent(): void {
    this.handler?.handler?.setInputAction(({ endPosition }) => {
      const floor = this.floorId;
      const building = this.buildingId;
      const campus = this.campusId;
      if (!campus && !building && !floor) {
        this.toolTips.hideTips();
        return;
      }

      const pickedObj = this.viewer.scene.pick(endPosition);
      if (!(pickedObj instanceof Cesium.Cesium3DTileFeature)) {
        this.toolTips.hideTips();
        return;
      }

      if (campus && !building && !floor) {
        this.toolTips.setMsg(pickedObj.primitive['name']);
        return;
      }

      const floorId = pickedObj.getProperty('Floor');
      if (!floorId) {
        this.toolTips.hideTips();
        return;
      }
      if (building === pickedObj.primitive['props'].id) {
        if (floor) {
          if (floor === floorId) {
            const roomId = pickedObj.getProperty('Room');
            this.toolTips.setMsg(roomId);
            return;
          } else {
            this.toolTips.hideTips();
            return;
          }
        }
        this.toolTips.setMsg(floorId);
        return;
      }
      this.toolTips.hideTips();
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  }
}
