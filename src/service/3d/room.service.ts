import * as Cesium from '@smart/cesium';
import { PickedContent, PickHandler } from '../common/PickHandler';
import { StoreService } from './store.service';
import { ViewerService } from './viewer.service';
import { HighlightService } from './highlight.service';

export class RoomService extends StoreService {
  readonly handler: PickHandler;
  getInfo?: (
    selectedId: string | null,
    type: 'room' | 'floor' | 'building'
  ) => void;

  get enabled(): boolean {
    return this.handler.enabled;
  }

  readonly roomProp = 'Room';
  readonly floorProp = 'Floor';
  readonly highlightService: HighlightService;
  private selectedTarget?: Cesium.Cesium3DTileset;
  private moveDirty = false;

  constructor(
    private viewerService: ViewerService,
    options: {
      enable?: boolean;
      getInfo?: (
        selectedId: string | null,
        type: 'room' | 'floor' | 'building'
      ) => void;
    } = {}
  ) {
    super();
    const { viewer } = viewerService;
    this.highlightService = new HighlightService(viewerService);
    this.handler = new PickHandler(viewer.scene, {
      isHL: false,
      enable: options.enable ?? true,
      drillPick: true,
      rightClear: false,
      leftCallback: this.pickCallbackL.bind(this),
      rightCallback: this.pickCallbackR.bind(this),
      cannotSelect: this.cannotSelectCallback.bind(this)
    });
    this.mouseMove();
    this.getInfo = options.getInfo;
  }

  enable(isEnable: boolean): void {
    // const bool = isEnable !== false;
    this.handler.enable(isEnable);
  }

  setPart(ids: { building: string; campus: string }, isZoom = true): void {
    // if (!this.enabled) return;
    const target = this.viewerService.layerService.getBuilding(ids);
    if (!target) return;
    this.selectedTarget = target;
    this.highlightService.updatePartByMove(target);
    if (isZoom) {
      this.viewerService.layerService.zoomToFloor(
        ids,
        this.getState('curFloorIndex')
      );
    }
  }

  setBuilding(ids: { building: string; campus: string }): void {
    // if (!this.enabled) return;
    this.selectedTarget =
      this.viewerService.layerService.getBuilding(ids) ?? undefined;
    this.highlightService.hightlightBuiding(ids.building);
  }

  private mouseMove() {
    this.handler.handler.setInputAction(({ endPosition }) => {
      if (!this.enabled) return;
      if (!this.selectedTarget) return;
      const pickedObj = this.viewerService.viewer.scene.pick(endPosition);
      const building = this.getState('building');
      if (pickedObj instanceof Cesium.Cesium3DTileFeature) {
        const buildingId = pickedObj.primitive['props']?.id;
        if (building === buildingId) {
          const floor = this.getState('floor');
          const floorId = pickedObj.getProperty(this.floorProp);
          if (!floor) {
            this.highlightService.updatePartByMove(pickedObj.primitive, {
              floorId
            });
            this.moveDirty = true;
            return;
          }
          const roomId = pickedObj.getProperty(this.roomProp);
          if (floor === floorId) {
            this.highlightService.updatePartByMove(pickedObj.primitive, {
              floorId,
              roomId
            });
            this.moveDirty = true;
            return;
          }
        }
      }
      if (this.moveDirty) {
        this.highlightService.updatePartByMove(this.selectedTarget);
        this.moveDirty = false;
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  }

  private pickCallbackL(picked: PickedContent | null): void {
    const building = this.getState('building');
    const floor = this.getState('floor');
    // const room = this.getState('room');
    const pickedObject = picked?.obj;
    if (!(pickedObject instanceof Cesium.Cesium3DTileFeature)) return;
    const buildingId = pickedObject.primitive['props']?.id;
    if (!building) {
      this.selectedTarget = pickedObject.primitive;
      this.highlightService.hightlightBuiding(buildingId);
      if (this.getInfo) this.getInfo(buildingId, 'building');
      return;
    }
    if (building !== buildingId) return;
    const floorId = pickedObject.getProperty(this.floorProp);
    if (!floor) {
      this.highlightService.updatePartById(pickedObject.primitive, floorId);
      picked?.position &&
        this._zoomToFloor(pickedObject.primitive, picked.position);
      if (this.getInfo) this.getInfo(floorId, 'floor');
    }
    if (floorId !== floor) return;
    const roomId = pickedObject.getProperty(this.roomProp);
    this.highlightService.updatePartById(
      pickedObject.primitive,
      floorId,
      roomId
    );
    if (this.getInfo) this.getInfo(roomId, 'room');
  }

  private _zoomToFloor(
    target: Cesium.Cesium3DTileset,
    position: Cesium.Cartesian3
  ) {
    // 获取模型包围盒，并固定旋转中心点
    const cartograhphic = Cesium.Cartographic.fromCartesian(
      target.boundingSphere.center
    );
    // 获取当前鼠标点击的点高度
    cartograhphic.height = Cesium.Cartographic.fromCartesian(position).height;
    const center = Cesium.Cartographic.toCartesian(cartograhphic);
    //TODO: cannot get radius value (temp)
    const boundingSphere = new Cesium.BoundingSphere(center, 23);
    this.viewerService.layerService.zoomByBoundingSphere(boundingSphere);
  }

  private pickCallbackR(): void {
    if (!this.selectedTarget) return;
    const building = this.getState('building');
    if (!building) return;
    const floor = this.getState('floor');
    if (!floor) {
      this.selectedTarget = undefined;
      this.highlightService.hightlightBuiding();
      if (this.getInfo) this.getInfo('', 'building');
      return;
    }
    const room = this.getState('room');
    if (!room) {
      this.highlightService.updatePartById(this.selectedTarget);
      if (this.getInfo) this.getInfo('', 'floor');
      return;
    }
    this.highlightService.updatePartById(this.selectedTarget, floor);
    if (this.getInfo) this.getInfo('', 'room');
    return;
  }

  private cannotSelectCallback(obj: any): boolean {
    const pickedObject = obj;
    const floor = this.getState('floor');
    let roomId = null;
    if (floor && pickedObject instanceof Cesium.Cesium3DTileFeature) {
      roomId = pickedObject.getProperty(this.roomProp);
      const floorId = pickedObject.getProperty(this.floorProp);
      if (roomId && floor === floorId) {
        return false;
      } else {
        return true;
      }
    }
    return false;
  }

  destroy(): void {
    this.handler.destroy();
    this.highlightService.hightlightBuiding();
  }
}
