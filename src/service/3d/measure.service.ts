import smart3d from 'smart3d';
import { ToolTips } from '../common/toolTips';
import * as Cesium from '@smart/cesium';
import { MyMeasureHandler } from './measure-handler.service';

export class MeasureService {
  toolTips: ToolTips;
  points = new Cesium.PointPrimitiveCollection(); // 测量时左键单击的点集合
  polylinePrimitiveCollection = new Cesium.PrimitiveCollection(); // 面积测量时起点和终点的折线集合
  curMeasureInstance?: MyMeasureHandler;
  curMeasureId = 0;
  measureHandlerList: any = {};
  private doneCallback?: (type: string) => void;

  constructor(
    private viewer: smart3d.Viewer,
    doneCallback?: (type: string) => void
  ) {
    this.toolTips = new ToolTips(viewer, {
      fontSize: 14,
      fontColor: 'rgba(255, 255, 255,1)',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      size: new Cesium.Cartesian2(270, 30),
      fontOffset: new Cesium.Cartesian2(10, 20),
      positionOffset: new Cesium.Cartesian2(10, 0)
    });
    viewer.scene.primitives.add(this.points);
    viewer.scene.primitives.add(this.polylinePrimitiveCollection);
    this.doneCallback = doneCallback;
  }

  handleClick = (item: string): void => {
    // 结束上一次测量
    this.handleEndLastMeasure();
    switch (item) {
      case 'Angle':
        this.toolTips.setMsg('单击左键添加三个点，右键取消测量');
        this.handleStartMeasure(item);
        break;
      case 'Area':
        this.toolTips.setMsg('左键添加三个点以上，右键完成测量');
        this.handleStartMeasure(item);
        break;
      case 'Volume':
        this.toolTips.setMsg('左键添加点，右键取消/结束测量');
        this.handleStartMeasure(item);
        break;
      case 'DVH':
        this.toolTips.setMsg('左键添加两个点，右键取消测量');
        this.handleStartMeasure(item);
        break;
      case 'betweenLine':
        this.toolTips.setMsg('左键添加四个导线点，右键取消测量');
        this.handleStartMeasure(item);
        break;
      case 'pointLine':
        this.toolTips.setMsg('左键添加三个导线点，右键取消测量');
        this.handleStartMeasure(item);
        break;
      case 'onEarth':
        this.toolTips.setMsg('左键添加点，右键取消测量');
        this.handleStartMeasure(item);
        break;
      case 'clear':
        this.handleClear();
        break;
      default:
        this.toolTips.hideTips();
        break;
    }
  };

  // eslint-disable-next-line
  createPolylinePrimitive(positions: any, color: any): any {
    return new (Cesium as any).Primitive({
      geometryInstances: new Cesium.GeometryInstance({
        geometry: new Cesium.PolylineGeometry({
          positions,
          width: 3,
          vertexFormat: Cesium.VertexFormat.POSITION_ONLY
        }),
        attributes: {
          color: Cesium.ColorGeometryInstanceAttribute.fromColor(color),
          depthFailColor: Cesium.ColorGeometryInstanceAttribute.fromColor(color)
        }
      }),
      appearance: new Cesium.PolylineColorAppearance({
        translucent: false
      }),
      depthFailAppearance: new (Cesium as any).PolylineColorAppearance({
        translucent: false
      }),
      asynchronous: false
    });
  }

  private handleStartMeasure = (item: any) => {
    this.toolTips.activate();
    const instances = new MyMeasureHandler(this.viewer, item);
    this.curMeasureInstance = instances as any;
    this.curMeasureId++;
    instances.activate();
    this.setLineAppearance(instances);
    if (item === 'betweenLine') {
      instances.drawHandler.lineStyle.geometry.width = 0;
      instances.drawHandler.anchorEvent.addEventListener(() => {
        this.addPointPrimitive(
          instances.linesPosition[instances.linesPosition.length - 1]
        );
        if (instances.linesPosition.length === 2) {
          this.addPolyLinePrimitive(Cesium.Color.CYAN, instances.linesPosition);
        } else if (instances.linesPosition.length === 4) {
          const sencondLine = [
            instances.linesPosition[2],
            instances.linesPosition[3]
          ];
          this.addPolyLinePrimitive(Cesium.Color.CYAN, sencondLine);
          const thirdLine = [instances.minPoint, instances.footPoint];
          this.addPolyLinePrimitive(Cesium.Color.RED, thirdLine);
          this.toolTips.deactivate();
          this.measureHandlerList[this.curMeasureId] = instances;
          instances.setEnd(true);
        }
      });
    } else if (item === 'pointLine') {
      instances.drawHandler.lineStyle.geometry.width = 0;
      instances.drawHandler.anchorEvent.addEventListener(() => {
        this.addPointPrimitive(
          instances.linesPosition[instances.linesPosition.length - 1]
        );
        if (instances.linesPosition.length === 3) {
          const line = [instances.linesPosition[1], instances.linesPosition[2]];
          this.addPolyLinePrimitive(Cesium.Color.CYAN, line);
          const sencondLine = [instances.linesPosition[0], instances.footPoint];
          this.addPolyLinePrimitive(Cesium.Color.RED, sencondLine);
          this.toolTips.deactivate();
          this.measureHandlerList[this.curMeasureId] = instances;
          instances.setEnd(true);
        }
      });
    } else {
      instances.drawHandler.enableAssist = true;
      instances.drawHandler.anchorEvent.addEventListener((position) => {
        this.addPointPrimitive(position);
      });
    }
    // 绘制类结束事件
    instances.drawHandler.drewEvent.addEventListener((positions) => {
      // 面积测量做特殊判断
      if ((item === 'Area' || item === 'Volume') && positions.length >= 3) {
        instances.setEnd(true);
        this.toolTips.deactivate();
        return;
      }
      // 对地测距特殊判断 绘制类因为是一个点 会同时触发右键结束事件
      if (item === 'onEarth') {
        this.toolTips.deactivate();
        return;
      }
      instances.clear();
      this.toolTips.deactivate();
      this.removePrimitive(this.curMeasureId);
    });
    // 测量类结束事件
    instances.measuredEvent.addEventListener((result) => {
      if (item === 'onEarth') {
        this.addPolyLinePrimitive(Cesium.Color.CYAN, result);
        this.addPointPrimitive(result[0]);
        this.measureHandlerList[this.curMeasureId] = instances;
        instances.setEnd(true);
        this.handleCallback(instances.mode);
      } else {
        if (
          item === 'DVH' &&
          ~~result.horizontal === ~~result.distance &&
          instances['_MeasureHandler']
        ) {
          instances['_MeasureHandler']['_billboards']._billboards[0].show =
            false;
        }
        this.measureEndFn(instances);
      }
    });
  };

  private handleClear = () => {
    this.toolTips.hideTips();
    this.points.removeAll();
    this.polylinePrimitiveCollection.removeAll();
    Object.keys(this.measureHandlerList).forEach((v) => {
      this.measureHandlerList[v].clear();
      this.measureHandlerList[v].drawHandler &&
        this.measureHandlerList[v].drawHandler.clear();
    });
    this.handleCallback('clear');
  };

  private handleCallback = (type: string) => {
    if (typeof this.doneCallback === 'function') {
      this.doneCallback(type);
    }
  };

  private handleEndLastMeasure() {
    if (this.curMeasureInstance && !this.curMeasureInstance.isEnd) {
      this.curMeasureInstance.clear();
      this.removePrimitive(this.curMeasureId);
    }
  }

  private removePrimitive = (measureId: any) => {
    this.points['_pointPrimitives'].forEach((v) => {
      if (v.id == measureId) {
        this.points.remove(v);
      }
    });
  };

  private setLineAppearance = (instance: any) => {
    instance.drawHandler.lineStyle.geometry.width = 3;
    instance.drawHandler.lineStyle.depthFailAppearance =
      new Cesium.PolylineMaterialAppearance({
        translucent: true,
        material: Cesium.Material.fromType('Color', {
          color: Cesium.Color.CYAN
        })
      });
    instance.drawHandler.polygonStyle.appearance =
      new Cesium.MaterialAppearance({
        translucent: true,
        material: Cesium.Material.fromType('Color', {
          color: Cesium.Color.CYAN.withAlpha(0.6)
        })
      });
  };

  private addPointPrimitive = (position?: any) => {
    const point = this.points.add({
      id: `${this.curMeasureId}`,
      position,
      pixelSize: 10,
      color: Cesium.Color.YELLOW.withAlpha(0.9)
    });
    // 不被地形遮挡
    point.disableDepthTestDistance = Number.POSITIVE_INFINITY;
    return point;
  };

  private addPolyLinePrimitive = (color: any, position?: any) => {
    const line = this.createPolylinePrimitive(
      [position[0], position[1]],
      color
    );
    this.polylinePrimitiveCollection.add(line);
  };

  private measureEndFn = (instance: MyMeasureHandler) => {
    this.toolTips.deactivate();
    instance.setEnd(true);
    // 把结果实例保存起来
    this.measureHandlerList[this.curMeasureId] = instance;
    const billBoardsLength = instance._billboards?.length ?? 0;
    for (let i = 0; i < billBoardsLength; ++i) {
      const billboard = (instance as any)._billboards.get(i);
      billboard.disableDepthTestDistance = Number.POSITIVE_INFINITY;
    }
    this.handleCallback(instance.mode);
  };
}
