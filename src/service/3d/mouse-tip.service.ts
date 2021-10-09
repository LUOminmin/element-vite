import smart3d from 'smart3d';
import * as Cesium from '@smart/cesium';
import { ToolTips } from '../common/toolTips';
import { RoomService } from './room.service';
import { StoreService } from './store.service';

export class MouseTipService extends StoreService {
  private toolTips: ToolTips;
  private _handler: Cesium.ScreenSpaceEventHandler;

  private _enabled = true;
  get enabled(): boolean {
    return this._enabled;
  }

  constructor(
    private viewer: smart3d.Viewer,
    readonly roomService: RoomService
  ) {
    super();
    this.toolTips = new ToolTips(this.viewer, {
      fontSize: 14,
      fontColor: '#fff',
      fontOffset: new Cesium.Cartesian2(10, 20)
    });
    this._handler = new Cesium.ScreenSpaceEventHandler(
      this.viewer.scene.canvas
    );
    this.mouseMove();
  }

  enable(isEnable: boolean): void {
    const bool = isEnable !== false;
    this._enabled = bool;
    this.roomService.enable(bool);
    if (!bool) {
      this.toolTips.hideTips();
    }
  }

  private mouseMove() {
    this._handler.setInputAction(({ endPosition }) => {
      if (!this._enabled) return;

      const campus = this.getState('campus');
      const building = this.getState('building');
      if (campus) {
        const pickedObj = this.viewer.scene.pick(endPosition);
        if (
          pickedObj instanceof Cesium.Cesium3DTileFeature &&
          campus === pickedObj.primitive['props']?.campus
        ) {
          if (!building) {
            this.toolTips.setMsg(pickedObj.primitive['name']);
            return;
          }
          if (building === pickedObj.primitive['props']?.id) {
            const floor = this.getState('floor');
            const floorId = pickedObj.getProperty(this.roomService.floorProp);
            if (!floor) {
              this.toolTips.setMsg(floorId);
              return;
            }
            if (floor === floorId) {
              const roomId = pickedObj.getProperty(this.roomService.roomProp);
              this.toolTips.setMsg(roomId);
              return;
            }
          }
        }
      }
      if (this.toolTips.show) {
        this.toolTips.hideTips();
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  }

  destroy(): void {
    this.toolTips.destroy();
    this._handler.destroy();
  }
}
