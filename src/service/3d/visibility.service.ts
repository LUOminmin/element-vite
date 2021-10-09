import smart3d from 'smart3d';
import * as Cesium from '@smart/cesium';
import { ToolTips } from '../common/toolTips';
import { AnalysisBaseService } from './analysis-base.service';

export class VisibilityService implements AnalysisBaseService {
  type = 'ViewCampus';
  toolTips: ToolTips;
  private visibility?: smart3d.ViewShed3D;

  constructor(private viewer: smart3d.Viewer) {
    this.toolTips = new ToolTips(viewer, {
      fontSize: 14,
      fontColor: 'rgba(255, 255, 255,1)',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      size: new Cesium.Cartesian2(270, 30),
      fontOffset: new Cesium.Cartesian2(10, 20),
      positionOffset: new Cesium.Cartesian2(10, 0)
    });
  }

  active(): void {
    this.visibility = new smart3d.ViewShed3D(this.viewer);
    this.visibility.start();
    this.visibility['_callback'] = this.stop.bind(this);
    this.toolTips.activate();
    this.toolTips.setMessage('单击左键添加观察点和分析终点');
  }

  private stop() {
    this.toolTips?.deactivate();
    return true;
  }

  deactive(): void {
    this.stop();
    this.visibility && this.visibility.destroy();
  }

  destroy(): void {
    this.deactive();
    this.toolTips.destroy();
  }
}
