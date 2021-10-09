/* eslint-disable quotes */
import * as Cesium from '@smart/cesium';

export interface PickOptions {
  enable?: boolean;
  drillPick?: boolean; // 是否穿透拾取
  propName?: string;
  color?: Cesium.Color | string;
  isHL?: boolean;
  rightClear?: boolean;
  beforeHL?: (obj: PickedHistory) => boolean | void;
  leftCallback?: (obj: PickedContent | null) => void;
  rightCallback?: (obj: PickedContent | null) => void;
  cannotSelect?: (obj: any) => boolean;
}
export const initPickOptions: PickOptions = {
  enable: true,
  color: Cesium.Color.RED,
  isHL: true
};

export interface PickedObject {
  primitive: Cesium.Cesium3DTileset | Cesium.Billboard;
  id?: Cesium.Entity;
}

export interface PickedContent {
  name?: string;
  position?: Cesium.Cartesian3;
  screenPos?: Cesium.Cartesian2;
  obj?: Cesium.Cesium3DTileFeature | PickedObject;
  feature?: Cesium.Cesium3DTileFeature | Cesium.Entity;
}

export interface PickedHistory {
  last: PickedContent | null;
  current: PickedContent | null;
}

export class PickHandler {
  private _scene: Cesium.Scene;
  private _defaultPick: PickedContent = {};
  private _flag = false;
  private _flashTimer?: NodeJS.Timeout;

  readonly handler: Cesium.ScreenSpaceEventHandler;

  private _lastPick: PickedContent | null = {};
  get lastPick(): PickedContent | null {
    return this._lastPick;
  }

  private _curPick: PickedContent | null = {};
  get curPick(): PickedContent | null {
    return this._curPick;
  }

  private _enabled: boolean;
  get enabled(): boolean {
    return this._enabled;
  }

  private _isHL: boolean;
  get isHL(): boolean {
    return this._isHL;
  }
  set isHL(val: boolean) {
    if (val === false) this._stopFlash();
    this._isHL = val;
  }

  private _color: Cesium.Color;
  get color(): string {
    return this._color.toCssColorString();
  }
  set color(val: string) {
    this._color = Cesium.Color.fromCssColorString(val);
  }

  private _propName: string;
  set propName(val: string) {
    this._propName = val;
  }

  rightClear?: boolean;
  drillPick?: boolean;
  beforeHL?: ((obj: PickedHistory) => boolean | void) | null;
  leftCallback?: ((obj: PickedContent | null) => void) | null;
  rightCallback?: ((obj: PickedContent | null) => void) | null;
  cannotSelect?: ((obj: any) => boolean) | null;

  constructor(scene: Cesium.Scene, options: PickOptions = {}) {
    const opt = { ...initPickOptions, ...options };

    this._scene = scene;
    this.leftCallback = opt.leftCallback;
    this.rightCallback = opt.rightCallback;
    this.cannotSelect = opt.cannotSelect;
    this.beforeHL = opt.beforeHL;
    this.drillPick = opt.drillPick ?? false;
    this._enabled = opt.enable ?? true;
    this._isHL = opt.isHL ?? true;
    this.rightClear = opt.rightClear ?? true;
    this._propName = opt.propName ?? 'names';
    this._color =
      typeof opt.color === 'string'
        ? Cesium.Color.fromCssColorString(opt.color)
        : opt.color ?? Cesium.Color.RED;
    this.handler = new Cesium.ScreenSpaceEventHandler(this._scene.canvas);
    this._enable();
    this.enable(this._enabled);
  }

  enable(isEnable: boolean): void {
    const bool = isEnable !== false;
    this._enabled = bool;
    !bool && this._isHL && this.clear();
  }

  highLight(pickedObj: Cesium.Cesium3DTileFeature | PickedObject): void {
    this._startFlash(pickedObj);
  }

  clear(): void {
    this._curPick && Object.assign(this._lastPick, this._curPick);
    this._curPick && Object.assign(this._curPick, this._defaultPick);
    this._stopFlash();
  }

  destroy(): void {
    if (this.handler) {
      this.handler.destroy();
    }
    this.clear();
    this._lastPick = null;
    this._curPick = null;
    this.beforeHL = null;
    this.leftCallback = null;
    this.rightCallback = null;
  }

  private _enable(): void {
    this.handler.setInputAction(({ position }) => {
      this.getTarget(position);
      const pickedObj = this._curPick?.obj;

      if (this._enabled && this._isHL) {
        this._stopFlash();
        if (
          typeof this.beforeHL === 'function' &&
          this.beforeHL({ current: this._curPick, last: this._lastPick }) ===
            false
        ) {
          return;
        }
        pickedObj && this._startFlash(pickedObj);
      }

      if (this._enabled && typeof this.leftCallback === 'function') {
        this.leftCallback(this._curPick);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    this.handler.setInputAction(({ position }) => {
      if (this.rightClear) this.clear();
      if (this._enabled && typeof this.rightCallback === 'function') {
        this.getTarget(position);
        this.rightCallback(this._curPick ?? {});
      }
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  }

  getTarget(position: Cesium.Cartesian2): PickedContent {
    if (!this._lastPick) this._lastPick = {};
    if (!this._curPick) this._curPick = {};

    Object.assign(this._lastPick, this._curPick);
    Object.assign(this._curPick, this._defaultPick);

    this._curPick.screenPos = position;
    let pickedObj: any = null;

    if (this.drillPick && this.cannotSelect) {
      const pickedObjs = this._scene.drillPick(position, 60, 1, 1);
      if (pickedObjs.length) {
        //TODO:这里需要优化，最好改成回调调用
        for (let i = 0, len = pickedObjs.length; i < len; i++) {
          const f = pickedObjs[i];
          if (f['tileset'] && this.cannotSelect && !this.cannotSelect(f)) {
            pickedObj = f;
            break;
          }
        }
      }
    }
    if (!pickedObj) {
      pickedObj = this._scene.pick(position);
    }

    if (
      Cesium.defined(pickedObj) &&
      pickedObj instanceof Cesium.Cesium3DTileFeature
    ) {
      this._scene.render();
      this._curPick.position = this._scene.pickPosition(position);
    } else {
      const ray = this._scene.camera.getPickRay(position);
      this._curPick.position = this._scene.globe.pick(ray, this._scene);
    }
    // if (!this._curPick.position) console.log('none');
    this._curPick.obj = pickedObj;
    const feature = (this._curPick.feature =
      pickedObj?.id ?? pickedObj ?? null);

    this._curPick.name = feature?.getProperty
      ? feature?.getProperty(this._propName)
      : feature?.name ?? null;
    return this._curPick;
  }

  private _startFlash(
    pickedObj: Cesium.Cesium3DTileFeature | PickedObject
  ): void {
    this._flag = true;
    this._highLight(pickedObj);
    this._flashTimer = setInterval(() => {
      this._flag = !this._flag;
      this._highLight(pickedObj);
    }, 300);
  }

  private _stopFlash(): void {
    clearInterval(Number(this._flashTimer));
    this._flashTimer = undefined;
    this._flag = false;
    this._clearHLTileFeature();
    this._clearHLBillboard();
  }

  private _highLight(
    pickedObj: Cesium.Cesium3DTileFeature | PickedObject
  ): void {
    if (pickedObj.primitive instanceof Cesium.Billboard) {
      this._hlBillboard(pickedObj);
    } else if (pickedObj.primitive instanceof Cesium.Cesium3DTileset) {
      this._hlTileFeature(
        pickedObj as Cesium.Cesium3DTileFeature,
        (pickedObj as Cesium.Cesium3DTileFeature).getProperty(this._propName)
      );
    }
  }

  private _setHLTileStyle(tileset: Cesium.Cesium3DTileset, name: string): void {
    const selectcontent = '${' + this._propName + '} === "' + name + '"';
    tileset['style'] = new Cesium.Cesium3DTileStyle({
      color: {
        conditions: [
          [selectcontent, `color('${this._color.toCssColorString()}')`],
          ['true', "color('#ffffff')"]
        ]
      }
    });
  }

  private _hlTileFeature(
    pickedObj: Cesium.Cesium3DTileFeature,
    name: string
  ): void {
    if (pickedObj.getProperty(this._propName) !== name) return;
    this._flag
      ? this._setHLTileStyle(pickedObj.primitive, name)
      : this._clearHLTileFeature(pickedObj);
  }

  private _clearHLTileFeature(feature?: Cesium.Cesium3DTileFeature): void {
    const obj =
      feature ?? (this._lastPick?.feature as Cesium.Cesium3DTileFeature);
    if (!obj?.primitive) return;
    obj.primitive['style'] = new Cesium.Cesium3DTileStyle();
  }

  private _hlBillboard(pickedObj: PickedObject): void {
    const billboard = pickedObj?.id?.billboard;
    if (!billboard) return;
    billboard.color = new Cesium.ConstantProperty(
      this._flag ? Cesium.Color.WHITE.withAlpha(0.5) : Cesium.Color.WHITE
    );
  }

  private _clearHLBillboard(): void {
    const feature = this._lastPick?.feature as Cesium.Entity;
    if (!feature?.billboard) return;
    feature.billboard.color = new Cesium.ConstantProperty(Cesium.Color.WHITE);
  }
}
