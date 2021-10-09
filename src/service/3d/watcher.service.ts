import smart3d from 'smart3d';
import * as Cesium from '@smart/cesium';
import cesium from '../../../assets/img/entity.png';
export class WatcherService {
  private _handleEvent?: any; // 事件集合
  private _myentityCollection?: any; // 监控点集合
  private _labelEntity: any; // 鼠标经过展示的实体
  private _hasCreated = false;
  private _list: any[];
  constructor(private viewer: smart3d.Viewer) {
    this.viewer = viewer;
    this._list = [
      {
        lng: -75.59777,
        name: 'camera1',
        id: '1',
        lat: 40.03883,
        height: 500
      },
      {
        lng: -80.5,
        name: 'camera2',
        id: '2',
        lat: 35.14,
        height: 500
      },
      {
        lng: -80.12,
        name: 'camera3',
        id: '3',
        lat: 25.46,
        height: 500
      },
      {
        lng: 119.733157,
        name: 'camera4',
        id: '4',
        lat: 29,
        height: 500
      },
      {
        lng: 119,
        name: 'camera5',
        id: '5',
        lat: 38,
        height: 500
      },
      {
        lng: 119.7325,
        name: 'camera6',
        id: '6',
        lat: 26.836877,
        height: 500
      },
      {
        lng: 129.7325,
        name: 'camera7',
        id: '7',
        lat: 26.836877,
        height: 5000
      },
      {
        lng: 119.7325,
        name: 'camera8',
        id: '8',
        lat: 56.836877,
        height: 50000
      }
    ];
    // 鼠标经过显示的实体
    this._labelEntity = this.viewer.entities.add({
      label: {
        show: false,
        showBackground: true,
        font: '14px monospace',
        horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(15, 0)
      }
    });
    this._handleEvent = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    this.mousemoveEvent();
    this.clickLeftEvent();
  }
  // 创建实体集合
  initEntityCollection(isShow: boolean): void {
    if (!this._hasCreated && !isShow) return;
    if (this._hasCreated) {
      this.showOrHide(isShow);
      return;
    }
    this._myentityCollection = new Cesium.CustomDataSource('entityCollection');
    this._list.forEach((item) => {
      this._myentityCollection.entities.add({
        name: item.name,
        id: item.id,
        position: Cesium.Cartesian3.fromDegrees(
          item.lng,
          item.lat,
          item.height
        ),
        billboard: {
          image: cesium,
          // 处理图标被遮挡问题
          heightReference: Cesium.HeightReference.NONE,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM
        }
      });
      this.viewer.dataSources.add(this._myentityCollection);
    });
    this._hasCreated = true;
  }

  // 展示、隐藏实体集合
  showOrHide(isShow: boolean): void {
    this._myentityCollection.show = isShow;
  }

  // 点击事件
  clickLeftEvent(): void {
    // this._handleEvent.setInputAction((movement) => {
    //   this.flyToPoint(movement.position);
    // }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }

  // 鼠标经过事件
  mousemoveEvent(): void {
    this._handleEvent.setInputAction((movement) => {
      this.showMess(movement.endPosition);
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  }

  // 展示信息
  /* eslint-disable */
  showMess(position: any): void {
    const scene = this.viewer.scene;
    const pickedObject = scene.pick(position);
    // 支持pickposition方法 && 经过实体 && 实体有名称（区分是否为标签实体）
    if (
      scene.pickPositionSupported &&
      Cesium.defined(pickedObject) &&
      pickedObject.id &&
      pickedObject.id._name
    ) {
      this._labelEntity.label.show = false;
      const cartesian = scene.pickPosition(position);
      if (Cesium.defined(cartesian)) {
        const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        this._labelEntity.position = cartesian;
        this._labelEntity.label.show = true;
        (
          this._labelEntity as any
        ).label.text = `我的id是${pickedObject.id._id},名字是${pickedObject.id._name}`;
        this._labelEntity.label.eyeOffset = new Cesium.Cartesian3(
          0.0,
          0.0,
          -cartographic.height *
            (scene.mode === Cesium.SceneMode.SCENE2D ? 1.5 : 1.0)
        );

        this._labelEntity.label.show = true;
      }
    } else {
      this._labelEntity.label.show = false;
    }
  }

  // 飞实体
  /* eslint-disable */
  flyToPoint(position: any): void {
    const pickedObject = this.viewer.scene.pick(position);
    // 还要判断是否是监控点，区别其他实体
    if (Cesium.defined(pickedObject) && pickedObject.id) {
      const isWatcher =
        pickedObject.id._name && pickedObject.id._name.indexOf('camera') !== -1;
      if (!isWatcher) return;
      this.viewer.zoomTo(pickedObject.id);
    }
  }

  // 根据id或者name查询再定位
  searchBy(type: string, value: string): void {
    console.log(type, value, this._myentityCollection.entities);
    const entities = this._myentityCollection.entities.values || [];
    const target = entities.filter((item) => {
      return item['_' + type] === value;
    })[0];
    if (!target) return;
    this.viewer.zoomTo(target);
  }
}
