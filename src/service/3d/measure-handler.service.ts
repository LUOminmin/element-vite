import smart3d from 'smart3d';
import * as Cesium from '@smart/cesium';
import {
  computeCZ,
  getDistance,
  minDistanceBetweenLine,
  cartesian2To3PointCloud
} from '../common/util';

export class MyMeasureHandler {
  private _mode?: any;
  get mode(): any {
    return this._mode;
  }
  private _viewer?: smart3d.Viewer;
  private _MeasureHandler?: smart3d.MeasureHandler;
  private _cutOrFill: any;
  private _options: any;
  private _drawHandler?: smart3d.DrawHandler; // 绘制类对象
  private _activeEvent?: Cesium.Event; // 测量激活事件
  private _measuredEvent?: Cesium.Event; // 测量结束事件
  public _billboards?: Cesium.BillboardCollection;
  public _label?: Cesium.LabelCollection;
  public isEnd = false;
  public linesPosition = [] as any; // 线间测距每次点击点位保存
  public footPoint: any; // 线间测距垂足点
  public minPoint: any; // 线间测距插值点
  public measureMode = {
    Area: smart3d.MeasureMode.Area, // 面积测量
    DVH: smart3d.MeasureMode.DVH, // 空间距离，水平距离，垂直距离模式
    Angle: smart3d.MeasureMode.Angle // 角度测量
  };

  /**
   * 获取drawHandler
   */
  get drawHandler(): any {
    let myDrawHandler: any;
    switch (this._mode as any) {
      case 'Angle':
      case 'Area':
      case 'DVH':
        myDrawHandler = (this._MeasureHandler as any).drawHandler;
        break;
      case 'Volume':
      case 'betweenLine':
      case 'pointLine':
      case 'onEarth':
        myDrawHandler = this._drawHandler;
        break;
      default:
        myDrawHandler = null;
        break;
    }
    return myDrawHandler;
  }

  /**
   * 获取measuredEvent
   */
  get measuredEvent(): any {
    let myMeasuredEvent;
    switch (this._mode as any) {
      case 'Angle':
      case 'Area':
      case 'DVH':
        myMeasuredEvent = (this._MeasureHandler as any).measuredEvent;
        break;
      case 'Volume':
      case 'betweenLine':
      case 'pointLine':
      case 'onEarth':
        myMeasuredEvent = this._measuredEvent;
        break;
      default:
        myMeasuredEvent = null;
        break;
    }
    return myMeasuredEvent;
  }

  /**
   * 获取activeEvent
   */
  get activeEvent(): any {
    let myActiveEvent;
    switch (this._mode) {
      case 'Angle':
      case 'Area':
      case 'DVH':
        myActiveEvent = (this._MeasureHandler as any).activeEvent;
        break;
      case 'Volume':
      case 'betweenLine':
      case 'pointLine':
      case 'onEarth':
        myActiveEvent = this._activeEvent;
        break;
      default:
        myActiveEvent = null;
        break;
    }
    return myActiveEvent;
  }

  // eslint-disable-next-line
  constructor(viewer: smart3d.Viewer, mode: any, options?: any) {
    this._mode = mode;
    this._viewer = viewer;
    this._options = options;
    switch (mode) {
      case 'Angle':
      case 'Area':
      case 'DVH':
        this._MeasureHandler = new smart3d.MeasureHandler(
          this._viewer as any,
          this.measureMode[this._mode] as any,
          {
            pickWidth: 20.0,
            pickHeight: 20.0
          }
        );
        break;
      case 'Volume':
        this._cutOrFill = new smart3d.CutOrFill(
          this._viewer as any,
          { showTin: true } as any
        );
        this._drawHandler = new smart3d.DrawHandler(
          this._viewer as any,
          smart3d.DrawMode.Polygon,
          { clampToGround: true }
        );
        this._activeEvent = new Cesium.Event();
        this._measuredEvent = new Cesium.Event();
        break;
      case 'betweenLine':
        this._drawHandler = new smart3d.DrawHandler(
          this._viewer,
          smart3d.DrawMode.Line,
          { clampToGround: false }
        );
        this._label = this._viewer.scene.primitives.add(
          new Cesium.LabelCollection()
        );
        this._measuredEvent = new Cesium.Event();
        break;
      case 'pointLine':
        this._drawHandler = new smart3d.DrawHandler(
          this._viewer,
          smart3d.DrawMode.Line,
          { clampToGround: false }
        );
        this._label = this._viewer.scene.primitives.add(
          new Cesium.LabelCollection()
        );
        this._measuredEvent = new Cesium.Event();
        break;
      case 'onEarth':
        this._drawHandler = new smart3d.DrawHandler(
          this._viewer,
          smart3d.DrawMode.Point,
          { clampToGround: false }
        );
        this._drawHandler.pointStyle.show = false;
        this._label = this._viewer.scene.primitives.add(
          new Cesium.LabelCollection()
        );
        this._measuredEvent = new Cesium.Event();
        break;
    }
  }

  /**
   * 激活测量
   */
  activate(): any {
    switch (this._mode) {
      case 'Angle':
      case 'Area':
      case 'DVH':
        this._MeasureHandler?.activate();
        break;
      case 'Volume':
        // 激活体积测量
        this._drawHandler?.activate();
        // 触发测量激活事件
        this._drawHandler?.activeEvent.addEventListener((isActive: any) => {
          this._activeEvent?.raiseEvent(isActive);
        });
        this._drawHandler?.drewEvent.addEventListener((positions: any) => {
          const len = positions.length;
          if (len >= 3) {
            const cartographic = positions.map((position: any) => {
              return Cesium.Cartographic.fromCartesian(position);
            });
            Cesium.sampleTerrainMostDetailed(
              (this._viewer as any)?.scene.terrainProvider,
              cartographic
            ).then((terraincCartographics: Cesium.Cartographic[]) => {
              let datumHeight: number;
              if (
                this._options &&
                typeof this._options?.datumHeight === 'number'
              ) {
                datumHeight = this._options?.datumHeight;
              } else {
                const heights = terraincCartographics.map(
                  (value: Cesium.Cartographic) => value.height
                );
                datumHeight = Math.max(...heights);
              }
              const boundary = terraincCartographics.map(
                (value: Cesium.Cartographic) =>
                  Cesium.Cartographic.toCartesian(value)
              );
              this._cutOrFill.boundary = boundary;
              this._cutOrFill.datumHeight = datumHeight;
              this._cutOrFill.displayResult(boundary);
              this._measuredEvent?.raiseEvent(boundary);
            });
          }
        });
        break;
      case 'betweenLine':
        this._drawHandler?.activate();
        this._drawHandler?.anchorEvent.addEventListener((position) => {
          if (position) {
            const positionTo2 = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
              this._viewer?.scene as any,
              position
            );
            const cartesian3point = cartesian2To3PointCloud({
              viewer: this._viewer as any,
              cartesian2: positionTo2,
              screenPixels: 20,
              intervalAngle: 45,
              rerunOtherPoint: false
            });
            // 存储当前生成点
            this.linesPosition.push(cartesian3point);
            if (this.linesPosition.length === 4) {
              const data = minDistanceBetweenLine(
                this.linesPosition[0],
                this.linesPosition[1],
                this.linesPosition[2],
                this.linesPosition[3]
              );
              this.footPoint = data[2];
              this.minPoint = data[1];
              // 得到生成线的中心用于定位标签
              const centerPoint = Cesium.Cartesian3.midpoint(
                data[1],
                data[2],
                new Cesium.Cartesian3()
              );
              this._label?.add({
                position: centerPoint,
                text: `线间距离：${data[0].toFixed(2)}m`,
                font: '12px sans-serif',
                showBackground: true,
                disableDepthTestDistance: Number.POSITIVE_INFINITY
              });
              this._drawHandler?.clear();
              this._drawHandler?.deactivate();
            }
          }
        });
        break;
      case 'pointLine':
        this._drawHandler?.activate();
        this._drawHandler?.anchorEvent.addEventListener((position) => {
          if (position) {
            const positionTo2 = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
              this._viewer?.scene as any,
              position
            );
            const cartesian3point = cartesian2To3PointCloud({
              viewer: this._viewer as any,
              cartesian2: positionTo2,
              screenPixels: 20,
              intervalAngle: 45,
              rerunOtherPoint: false
            });
            // 存储当前生成点
            if (cartesian3point) {
              this.linesPosition.push(cartesian3point);
            }
            if (this.linesPosition.length === 3) {
              this.footPoint = computeCZ(
                this.linesPosition[1],
                this.linesPosition[2],
                this.linesPosition[0]
              );
              // 得到生成线的中心用于定位标签
              const centerPoint = Cesium.Cartesian3.midpoint(
                this.linesPosition[0],
                this.footPoint,
                new Cesium.Cartesian3()
              );
              const distance = getDistance(
                this.footPoint,
                this.linesPosition[0]
              );
              this._label?.add({
                position: centerPoint,
                text: `点线距离：${distance.toFixed(2)}m`,
                font: '12px sans-serif',
                showBackground: true,
                disableDepthTestDistance: Number.POSITIVE_INFINITY
              });
              this._drawHandler?.clear();
              this._drawHandler?.deactivate();
            }
          }
        });
        break;
      case 'onEarth':
        this._drawHandler?.activate();
        this._drawHandler?.drewEvent.addEventListener((position) => {
          if (position) {
            const positionTo2 = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
              this._viewer?.scene as any,
              position
            );
            const cartesian3point = cartesian2To3PointCloud({
              viewer: this._viewer as any,
              cartesian2: positionTo2,
              screenPixels: 20,
              intervalAngle: 45,
              rerunOtherPoint: false
            });
            const savePoint = Cesium.Cartographic.fromCartesian(
              cartesian3point as any
            );
            const earthPoint = Cesium.Cartographic.fromDegrees(
              Cesium.Math.toDegrees(savePoint.longitude),
              Cesium.Math.toDegrees(savePoint.latitude)
            );
            Cesium.sampleTerrainMostDetailed(
              this._viewer?.scene.terrainProvider as any,
              [earthPoint]
            ).then((terraincCartographics) => {
              const resultPosition = terraincCartographics[0];
              const distance = Math.abs(
                resultPosition.height - savePoint.height
              );
              this._label?.add({
                position: Cesium.Cartesian3.fromDegrees(
                  Cesium.Math.toDegrees(savePoint.longitude),
                  Cesium.Math.toDegrees(savePoint.latitude),
                  savePoint.height
                ),
                text: `对地距离：${distance.toFixed(2)}m`,
                font: '12px sans-serif',
                showBackground: true,
                disableDepthTestDistance: Number.POSITIVE_INFINITY
              });
              this._measuredEvent?.raiseEvent([
                cartesian3point,
                Cesium.Cartographic.toCartesian(resultPosition)
              ]);
            });
          }
        });
        break;
      default:
        break;
    }
  }

  /**
   * 清除图元
   */
  clear(): any {
    switch (this._mode) {
      case 'Angle':
      case 'Area':
      case 'DVH':
        this._MeasureHandler?.clear();
        break;
      case 'Volume':
        this._drawHandler && this._drawHandler.clear();
        this._cutOrFill && this._cutOrFill.clear();
        break;
      case 'betweenLine':
        this._drawHandler && this._drawHandler.clear();
        this._label && this._label.removeAll();
        break;
      case 'pointLine':
        this._drawHandler && this._drawHandler.clear();
        this._label && this._label.removeAll();
        break;
      case 'onEarth':
        this._drawHandler && this._drawHandler.clear();
        this._label && this._label.removeAll();
        break;
      default:
        break;
    }
  }

  /**
   * handler暂停工作，可激活
   */
  deactivate(): any {
    switch (this._mode) {
      case 'Angle':
      case 'Area':
      case 'DVH':
        this._MeasureHandler?.deactivate();
        break;
      case 'Volume':
        this._drawHandler && this._drawHandler.deactivate();
        break;
      case 'betweenLine':
        break;
      case 'pointLine':
        break;
      case 'onEarth':
        break;
      default:
        break;
    }
  }

  setEnd(end: boolean): any {
    this.isEnd = end;
  }

  /**
   * 销毁
   */
  destroy(): any {
    switch (this._mode) {
      case 'Angle':
      case 'Area':
      case 'DVH':
        (this._MeasureHandler as any).destroy();
        break;
      case 'Volume':
        this._drawHandler && this._drawHandler.destroy();
        this._cutOrFill && this._cutOrFill.destroy();
        break;
      case 'betweenLine':
        break;
      case 'pointLine':
        break;
      case 'onEarth':
        break;
      default:
        break;
    }
  }
}
