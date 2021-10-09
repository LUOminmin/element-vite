import * as Cesium from '@smart/cesium';
import { StoreService } from './store.service';
import { message } from 'antd';
import { DataType, Legend } from 'src/store/types';

import { ViewerService } from './viewer.service';
import { PickedContent, PickHandler } from '../common/PickHandler';
import { MouseTipService } from './mouse-tip.service';
import { ToolTips } from '../common/toolTips';
import { RoomService } from './room.service';
import { HighlightService } from './highlight.service';
import { Viewer } from 'smart3d';

export class ParkinglotService extends StoreService {
  spotLayer?: Cesium.Cesium3DTileset;
  readonly handler: PickHandler;
  private _show = false;
  get isShow(): boolean {
    return this._show;
  }

  private curFloor = '-1';
  private viewer: Viewer;
  private originView?: {
    destination: Cesium.Cartesian3;
    orientation: {
      heading: number;
      pitch: number;
      roll: number;
    };
  };
  private originShow: number[] = [];
  private colors: Legend[];
  private toolTips: ToolTips;
  private hasConfig = true;
  private roomService: RoomService;
  private highlightService: HighlightService;
  private moveDirty = false;
  private roofCondition: [string, string] = [
    '${IfcEntity} === "IfcRoof"',
    "color('transparent')"
  ];

  constructor(
    private viewerService: ViewerService,
    private mousetipService: MouseTipService
  ) {
    super();
    this.viewer = viewerService.viewer;
    this.toolTips = new ToolTips(this.viewer, {
      fontSize: 14,
      fontColor: '#fff',
      fontOffset: new Cesium.Cartesian2(10, 20)
    });
    this.handler = new PickHandler(this.viewer.scene, {
      isHL: false,
      enable: false,
      drillPick: true,
      rightClear: false,
      leftCallback: this.pickCallbackL.bind(this),
      rightCallback: this.pickCallbackR.bind(this),
      cannotSelect: this.cannotSelectCallback.bind(this)
    });
    this.roomService = mousetipService.roomService;
    this.highlightService = this.roomService.highlightService;
    this.colors = this.getState('carportlegend');
  }

  add(): void {
    this.clear();
    const { layerService } = this.viewerService;
    const campus = this.getState('campus') + '';
    const spotConfig = layerService.config.parkinglot.find(
      (t) => t.id.split('-')[0] === campus
    );
    if (!spotConfig) {
      this.hasConfig = false;
      return;
    }
    spotConfig.show = false;
    this.spotLayer = layerService.layerMgt.add(spotConfig);
  }

  show(): void {
    if (!this.hasConfig) {
      message.warn('该小区没有地下车库');
      return;
    }
    if (!this.spotLayer) {
      message.error('地下车库加载失败');
      return;
    }
    const { camera } = this.viewer;
    this.originView = {
      destination: camera.position.clone(),
      orientation: {
        heading: camera.heading,
        pitch: camera.pitch,
        roll: camera.roll
      }
    };
    this.showGround(false);
    this.showStatus();
    const { boundingSphere } = this.spotLayer;
    camera.flyToBoundingSphere(
      new Cesium.BoundingSphere(
        boundingSphere.center,
        boundingSphere.radius * 0.7
      ),
      {
        duration: 2,
        offset: new Cesium.HeadingPitchRange(
          Cesium.Math.toRadians(323),
          Cesium.Math.toRadians(-35),
          0
        )
      }
    );
    this._show = true;
  }

  hide(): void {
    this.showGround();
    this.clear();
    if (this.originView) {
      this.viewer.camera.flyTo({
        ...this.originView,
        duration: 2
      });
      this.originView = undefined;
    }
    this._show = false;
  }

  private clear(): void {
    if (!this.spotLayer) {
      this.viewerService.layerService.primitives.remove(this.spotLayer);
      this.spotLayer = undefined;
    }
  }

  private showGround(show = true) {
    this.curFloor = '-1';
    this.store.dispatch({
      type: DataType.UNDERGROUND,
      value: !show
    });
    this.mousetipService.enable(show);
    this.handler.enable(!show);
    this.viewerService.layerService.campusLayer.show = show;
    const { primitives } = this.viewerService.layerService;
    if (show) {
      this.handler.handler.removeInputAction(
        Cesium.ScreenSpaceEventType.MOUSE_MOVE
      );
      this.originShow.forEach((i) => {
        const target = primitives.get(i);
        target.show = true;
      });
      this.originShow = [];
      this.toolTips.hideTips();
    } else {
      this.mouseMove();
      primitives['_primitives'].forEach((t, i) => {
        if (t === this.spotLayer) return;
        if (!t.show) return;
        t.show = false;
        this.originShow.push(i);
      });
    }
    if (this.spotLayer) {
      this.spotLayer.show = !show;
    }
  }

  private mouseMove() {
    this.handler.handler.setInputAction(({ endPosition }) => {
      // this.mousetipService.enable(false);
      const pickedObj = this.viewer.scene.pick(endPosition);
      if (pickedObj instanceof Cesium.Cesium3DTileFeature) {
        const floorId = pickedObj.getProperty(this.roomService.floorProp);
        if (!this.curFloor) {
          this.toolTips.setMsg(floorId);
          this.highlightService.updatePartByMove(
            pickedObj.primitive,
            { floorId },
            { floorId: '' },
            [this.roofCondition]
          );
          this.moveDirty = true;
          return;
        } else {
          this.moveDirty = false;
        }
      }

      if (this.toolTips.show) {
        this.toolTips.hideTips();
      }
      if (this.moveDirty && this.spotLayer) {
        this.highlightService.updatePartByMove(this.spotLayer, {}, {}, [
          this.roofCondition
        ]);
        this.moveDirty = false;
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  }

  private pickCallbackL(picked: PickedContent | null): void {
    if (!this.spotLayer) return;
    const pickedObject = picked?.obj;
    if (!(pickedObject instanceof Cesium.Cesium3DTileFeature)) return;
    this.curFloor = pickedObject.getProperty('Floor');
    this.showStatus();
  }

  private pickCallbackR(): void {
    if (!this.spotLayer) return;
    if (!this.curFloor) return;
    this.curFloor = '';
    this.highlightService.updatePartByMove(this.spotLayer, {}, {}, [
      this.roofCondition
    ]);
  }

  private cannotSelectCallback(pickedObject: any): boolean {
    if (pickedObject instanceof Cesium.Cesium3DTileFeature) {
      const isRoof = pickedObject.getProperty('IfcEntity') === 'IfcRoof';
      return isRoof;
    }
    return false;
  }

  private showStatus() {
    if (!this.spotLayer) return;
    if (!this.curFloor) {
      this.spotLayer.style = new Cesium.Cesium3DTileStyle({
        color: {
          conditions: [this.roofCondition, ['true', "color('#fff')"]]
        }
      });
      return;
    }
    const max = this.curFloor === '-3' ? 20 : 80;
    let count = 0;
    const evaluateColor = (
      feature: Cesium.Cesium3DTileFeature,
      result: Cesium.Color
    ): Cesium.Color => {
      const isRoof = feature.getProperty('IfcEntity') === 'IfcRoof';
      if (isRoof) {
        return Cesium.Color.clone(Cesium.Color.TRANSPARENT, result);
      }
      const floorId = feature.getProperty('Floor');
      if (this.curFloor !== floorId) {
        return Cesium.Color.clone(
          Cesium.Color.fromCssColorString('#87CEFA').withAlpha(0.05),
          result
        );
      }
      const room = feature.getProperty('Room');
      if (room === '车位') {
        count += 1;
        return Cesium.Color.clone(
          Cesium.Color.fromCssColorString(
            this.colors[count < max ? 0 : 1].color
          ),
          result
        );
      }
      return Cesium.Color.clone(Cesium.Color.WHITE, result);
    };
    this.spotLayer.style = new Cesium.Cesium3DTileStyle({
      color: { evaluateColor }
    });
  }
}
