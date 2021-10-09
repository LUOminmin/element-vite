import * as Cesium from '@smart/cesium';
import { Viewer } from 'smart3d';

export interface UndergroundOptions {
  enable?: boolean;
  alpha?: number;
  far?: number;
  near?: number;
  isByDistance?: boolean;
  hideLayer?: unknown[];
  callback?: ((enable: boolean) => void) | undefined;
}
export const initUndergroundOptions: UndergroundOptions = {
  enable: true,
  alpha: 0.0,
  far: 400,
  near: 0,
  isByDistance: true,
  hideLayer: [],
  callback: undefined
};

export interface SceneOptions {
  backgroundColor: Cesium.Color;
  undergroundColor: Cesium.Color;
  inertiaZoom: number;
  skyBox: boolean;
  skyAtmosphere: boolean;
  highDynamicRange: boolean;
  fog: boolean;
  collisionDetection: boolean;
  translucency: boolean;
}
export const initSceneOptions: SceneOptions = {
  backgroundColor: Cesium.Color.TRANSPARENT,
  undergroundColor: Cesium.Color.BLACK,
  inertiaZoom: 0.5,
  skyBox: false,
  skyAtmosphere: false,
  highDynamicRange: false,
  fog: false,
  collisionDetection: false,
  translucency: true
};

export class Underground {
  private _viewer: Viewer;
  private _defaultOpts: SceneOptions = initSceneOptions;
  private _originalOpts: SceneOptions = initSceneOptions;

  private _lastRange = Infinity;
  get range(): number {
    return this._lastRange;
  }

  private _enabled = true;
  get enabled(): boolean {
    return this._enabled;
  }
  private _near = 0;
  get near(): number {
    return this._near;
  }
  set near(val: number) {
    this._near = val;
    this._update();
  }

  private _far = 400;
  get far(): number {
    return this._far;
  }
  set far(val: number) {
    this._far = val;
    this._update();
  }

  private _alpha = 0.2;
  get alpha(): number {
    return this._alpha;
  }
  set alpha(val: number) {
    this._alpha = val;
    this._update();
  }

  private _isByDistance = true;
  get isByDistance(): boolean {
    return this._isByDistance;
  }
  set isByDistance(val: boolean) {
    this._isByDistance = val;
    this._update();
  }

  private _hideLayer: unknown[] = [];
  get hideLayer(): unknown[] {
    return this._hideLayer;
  }
  set hideLayer(val: unknown[]) {
    this._hideLayer = val;
    this._setScene();
  }

  callback?: (enable: boolean) => void;

  constructor(viewer: Viewer, options: UndergroundOptions = {}) {
    if (!Cesium.defined(viewer)) {
      throw new Cesium.DeveloperError('viewer is required.');
    }
    this._viewer = viewer;
    const opt = { ...initUndergroundOptions, ...options };

    this._enabled = opt.enable ?? this._enabled;
    this._alpha = opt.alpha ?? this._alpha;
    this._isByDistance = opt.isByDistance ?? this._isByDistance;
    this._far = !this._isByDistance ? Infinity : opt.far ?? this._far;
    this._near = opt.near ?? this._near;
    this._hideLayer = opt.hideLayer ?? this._hideLayer;
    this.callback = opt.callback;

    const { scene } = this._viewer;
    this._originalOpts = {
      backgroundColor: scene.backgroundColor,
      undergroundColor: scene.globe.undergroundColor,
      inertiaZoom: scene.screenSpaceCameraController.inertiaZoom,
      skyBox: scene.skyBox.show,
      skyAtmosphere: scene.skyAtmosphere.show,
      highDynamicRange: scene.highDynamicRange,
      fog: scene.fog.enabled,
      collisionDetection:
        scene.screenSpaceCameraController.enableCollisionDetection,
      translucency: scene.globe.translucency.enabled
    } as SceneOptions;

    const { translucency } = scene.globe;
    translucency.frontFaceAlphaByDistance = new Cesium.NearFarScalar(
      this._near,
      this._alpha,
      this._far,
      1.0
    );

    this.enable(this._enabled);
  }

  enable(isEnable: boolean): void {
    const bool = (this._enabled = isEnable !== false);
    if (bool) {
      this._viewer.clock.onTick.addEventListener(this._setScene, this);
    } else {
      this._viewer.clock.onTick.removeEventListener(this._setScene, this);
      this._setScene();
    }
    bool && this._update();
  }

  private _setScene(): void {
    const { scene } = this._viewer;
    const range = this._getRange();
    const enable = this._enabled && range < this._far;
    this._controlLayer(range > this.far / 2);
    !this._isByDistance && this._update();
    if (typeof this.callback === 'function') {
      this.callback(enable);
    }

    const type = enable ? '_defaultOpts' : '_originalOpts';
    scene.screenSpaceCameraController.enableCollisionDetection =
      this[type].collisionDetection;
    scene.globe.translucency.enabled = this[type].translucency;
    scene.backgroundColor = this[type].backgroundColor;
    scene.globe.undergroundColor = this[type].undergroundColor;
    scene.screenSpaceCameraController.inertiaZoom = this[type].inertiaZoom;
    scene.skyBox.show = this[type].skyBox;
    scene.skyAtmosphere.show = this[type].skyAtmosphere;
    scene.highDynamicRange = this[type].highDynamicRange;
    scene.fog.enabled = this[type].fog;
  }

  private _getRange(): number {
    const { camera, scene } = this._viewer;
    const { canvas } = scene;
    const ray = camera.getPickRay(
      new Cesium.Cartesian2(
        Math.round(canvas.clientWidth / 2),
        Math.round(canvas.clientHeight)
      )
    );
    const center = scene.globe.pick(ray, scene);
    const range = center
      ? Cesium.Cartesian3.distance(center, camera.position)
      : this._lastRange;
    this._lastRange = range;
    return range;
  }

  private _controlLayer(isShow: boolean): void {
    if (!this._hideLayer || this._hideLayer.length === 0) return;
    this._hideLayer.forEach((t: any) => {
      t['show'] = isShow;
    });
  }

  private _update(): void {
    let alpha = Number(this._alpha);
    alpha = !isNaN(alpha) ? alpha : 1.0;
    alpha = Cesium.Math.clamp(alpha, 0.0, 1.0);

    const { frontFaceAlphaByDistance } = this._viewer.scene.globe.translucency;
    frontFaceAlphaByDistance.farValue =
      !this._isByDistance && this._lastRange < this.far ? alpha : 1.0;
    frontFaceAlphaByDistance.nearValue = alpha;
    frontFaceAlphaByDistance.near = this._near;
    frontFaceAlphaByDistance.far = this._far;
  }
}
