import * as Cesium from '@smart/cesium';
import { cartesianToDegrees, Degrees } from '../common/util';
import { LayerType } from '../common/layers';
import { ViewerService } from './viewer.service';
import { PickedContent, PickHandler } from '../common/PickHandler';

export class PickPositionService {
  readonly handler: PickHandler;
  private pointLayer: Cesium.DataSource;

  constructor(private viewerService: ViewerService) {
    this.pointLayer = new Cesium.CustomDataSource('campus');
    const { viewer } = viewerService;
    viewer.dataSources.add(this.pointLayer);
    this.handler = new PickHandler(viewer.scene, {
      isHL: false,
      enable: true,
      rightClear: false,
      leftCallback: this.pickCallbackL.bind(this)
    });
  }

  private pickCallbackL(picked: PickedContent | null): void {
    if (!picked?.position) return;
    const coord = cartesianToDegrees(picked.position);
    this.addPoint(picked.position, coord);
    console.log(coord);
  }

  private addPoint(position: Cesium.Cartesian3, coord: Degrees) {
    this.viewerService.layerService.layerMgt.add({
      target: this.pointLayer,
      type: LayerType.POINT,
      position,
      clampGround: false,
      label: true,
      text: `${coord.longitude}  ${coord.latitude}  ${coord.height}`,
      fontSize: 14
    });
  }

  destroy(): void {
    this.handler.destroy();
    this.pointLayer.entities.removeAll();
    this.viewerService.viewer.dataSources.remove(this.pointLayer);
  }
}
