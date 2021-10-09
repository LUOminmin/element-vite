/* eslint-disable new-cap */
import smart3d from 'smart3d';
import * as Cesium from '@smart/cesium';
import { generateUUID } from './util';

export enum LayerType {
  TERRAIN = 'TERRAIN',
  IMAGERY = 'IMAGERY',
  MODEL = 'MODEL',
  IMAGEMODEL = 'IMAGEMODEL',
  GLTF = 'GLTF',
  MARKER = 'MARKER',
  POINT = 'POINT',
  POLYLINE = 'POLYLINE',
  POLYGON = 'POLYGON'
}

interface LayerBaseOpt {
  url: string;
  baseUrl?: string;
  show?: boolean;
  isZoom?: boolean;
  id?: string;
  name?: string;
  props?: { [key: string]: unknown };
  point?: { [key: string]: number };
}

interface LayerInnerOpt extends LayerBaseOpt {
  show: boolean;
}

interface BaseLayer extends LayerInnerOpt {
  type: LayerType.IMAGERY | LayerType.TERRAIN;
}

interface TilesetLayer extends LayerInnerOpt {
  type: LayerType.MODEL | LayerType.IMAGEMODEL;
  target?: Cesium.PrimitiveCollection;
  offsetMatrix?: number[];
  matrix?: number[];
  luminance?: number;
  lighting?: number;
  skipLOD?: boolean;
  maxMemory?: number;
}

interface GltfLayer extends Omit<TilesetLayer, 'type'> {
  type: LayerType.GLTF;
  lng?: number;
  lat?: number;
  alt?: number;
  position?: Cesium.Cartesian3;
  origin?: Cesium.Cartesian3;
}

interface EntityLayer extends Omit<LayerBaseOpt, 'url'> {
  url?: string;
  isZoom?: boolean;
  target?: Cesium.DataSource;
  clampGround?: boolean;
  label?: boolean;
  text?: string | number;
  fontSize?: number;
}

interface POILayer extends EntityLayer {
  type: LayerType.MARKER;
  lng?: number;
  lat?: number;
  alt?: number;
  position?: Cesium.Cartesian3;
  width?: number;
  height?: number;
  size?: number;
  color?: Cesium.Color;
  clampGround?: boolean;
}

interface PointLayer extends Omit<POILayer, 'url' | 'type'> {
  type: LayerType.POINT;
  url?: string;
}

interface LineLayer extends EntityLayer {
  type: LayerType.POLYLINE;
  positions?: Cesium.Cartesian3[];
  width?: number;
  color?: Cesium.Color | Cesium.MaterialProperty;
  clampGround?: boolean;
}

interface AreaLayer extends EntityLayer {
  type: LayerType.POLYGON;
  position?: Cesium.Cartesian3;
  positions: Cesium.Cartesian3[];
  clampGround?: boolean;
  fill?: boolean;
  fillColor?: Cesium.Color;
  stroke?: boolean;
  strokeWidth?: number;
  strokeColor?: Cesium.Color;
}

export interface LayerObj {
  type: LayerType;
  obj?: any;
  id?: string;
}

export type LayerOptions =
  | BaseLayer
  | TilesetLayer
  | GltfLayer
  | POILayer
  | PointLayer
  | LineLayer
  | AreaLayer;

export default class LayerManager {
  private _baseUrl = '';
  get baseUrl(): string {
    return this._baseUrl;
  }

  constructor(private viewer: smart3d.Viewer, baseUrl?: string) {
    this._baseUrl = baseUrl || '';
  }

  destroy(): void {
    this.viewer.entities.removeAll();
    this.viewer.scene.primitives.destroy();
    this.viewer.scene.imageryLayers.destroy();
  }

  add(options: LayerOptions): any | null {
    let layer: any = null;
    const opts: LayerOptions = {
      ...options,
      show: options.show ?? true,
      url: (options.baseUrl ?? this._baseUrl) + options.url
    };
    if (opts.id) {
      opts.props = opts.props
        ? { ...opts.props, id: opts.id }
        : { id: opts.id };
    }
    opts.id = generateUUID();
    switch (opts.type) {
      case LayerType.TERRAIN:
        layer = this._addTerrain(opts);
        break;
      case LayerType.IMAGERY:
        layer = this._addImagery(opts);
        break;
      case LayerType.MODEL:
      case LayerType.IMAGEMODEL:
        layer = this._add3DTiles(opts);
        break;
      case LayerType.GLTF:
        layer = this._addGltf(opts);
        break;
      case LayerType.MARKER:
        layer = this._addMarker(opts);
        break;
      case LayerType.POINT:
        layer = this._addPoint(opts);
        break;
      case LayerType.POLYLINE:
        layer = this._addPolyline(opts);
        break;
      case LayerType.POLYGON:
        layer = this._addPolygon(opts as any);
        break;
      default:
        break;
    }
    return layer;
  }

  remove(options: LayerObj): void {
    switch (options.type) {
      case LayerType.MODEL:
      case LayerType.GLTF:
        this._removePrimitive(options);
        break;
      case LayerType.MARKER:
      case LayerType.POINT:
      case LayerType.POLYLINE:
      case LayerType.POLYGON:
        this._removeEntity(options);
        break;
      default:
        break;
    }
  }

  private _addTerrain(options: BaseLayer): Cesium.TerrainProvider {
    const terrain = smart3d.TerrainManager.createCustomTerrain({
      options: { url: options.url }
    });
    this.viewer.terrainProvider = terrain;
    return terrain;
  }

  private _addImagery(options: BaseLayer): Cesium.ImageryProvider {
    const imagery = new smart3d.SmartImageryProvider({
      url: options.url
    }) as Cesium.ImageryProvider;
    const imageLayer =
      this.viewer.scene.imageryLayers.addImageryProvider(imagery);
    imageLayer.show = options.show || true;

    options.isZoom &&
      imagery.readyPromise &&
      imagery.readyPromise.then(() => {
        if (imageLayer.imageryProvider) {
          this.viewer.camera.flyTo({
            destination: imageLayer.imageryProvider.rectangle
          });
        } else {
          this.viewer.flyTo(imageLayer);
        }
      });
    return imagery;
  }

  private _add3DTiles(options: TilesetLayer): any {
    const opt = {
      url: options.url,
      show: options.show,
      maximumScreenSpaceError: 16,
      dynamicScreenSpaceError: true
    };
    if (options.matrix) {
      opt['modelMatrix'] = Cesium.Matrix4.fromArray(options.matrix);
    }
    const tileset = (options.target || this.viewer.scene.primitives).add(
      new Cesium.Cesium3DTileset(opt)
    );
    this.setMaterialOptions(tileset, options);
    this.setLOD(tileset, options);
    tileset.id = options.id;
    tileset.name = options.name || '';
    tileset.props = options.props || {};
    tileset.type = options.type;
    tileset.index = this.viewer.scene.primitives.length - 1;

    tileset.readyPromise.then(() => {
      if (!options.matrix && options.offsetMatrix) {
        const newMatrix = this.getModelMatrixByOffsetMatrix(
          Cesium.Matrix4.fromArray(options.offsetMatrix),
          tileset.root.transform
        );
        tileset.modelMatrix = newMatrix;
      }
      if (options.isZoom) {
        this.viewer.zoomTo(
          tileset,
          new Cesium.HeadingPitchRange(
            -1.2,
            -0.6,
            tileset.boundingSphere.radius * 2.0
          )
        );
      }
    });
    return tileset;
  }

  private getModelMatrixByOffsetMatrix(
    offsetMatrix,
    transform
  ): Cesium.Matrix4 {
    const inverseTransform = Cesium.Matrix4.inverse(
      transform,
      new Cesium.Matrix4()
    );
    const modelMatrix = Cesium.Matrix4.multiply(
      offsetMatrix,
      inverseTransform,
      new Cesium.Matrix4()
    );
    Cesium.Matrix4.multiply(transform, modelMatrix, modelMatrix);
    return modelMatrix;
  }

  private _addGltf(options: GltfLayer): Cesium.Model {
    const { scene } = this.viewer;
    const opts = {
      scale: 100,
      luminance: 0.8,
      props: {},
      heading: 10.0,
      pitch: -15,
      radiusRatio: 2.0,
      forwardAxis: Cesium.Axis.Z,
      ...options,
      origin:
        options.lng && options.lat
          ? Cesium.Cartesian3.fromDegrees(
              options.lng,
              options.lat,
              options.alt ?? 0
            )
          : options.position
    };
    const modelMatrix = opts.origin
      ? Cesium.Transforms.eastNorthUpToFixedFrame(opts.origin)
      : undefined;
    const params = {
      url: opts.url,
      id: opts.id,
      show: opts.show,
      scale: opts.scale,
      modelMatrix: modelMatrix,
      forwardAxis: opts.forwardAxis,
      minimumPixelSize: 128,
      luminanceAtZenith: opts.luminance
    };
    const model = (options.target || scene.primitives).add(
      Cesium.Model.fromGltf(params)
    );
    model.name = opts.name;
    model.props = opts.props;

    opts.isZoom &&
      model.readyPromise
        .then(function () {
          const center = Cesium.Matrix4.multiplyByPoint(
            model.modelMatrix,
            model.boundingSphere.center,
            new Cesium.Cartesian3()
          );
          const r = model.boundingSphere.radius;
          scene.camera.lookAt(
            center,
            new Cesium.HeadingPitchRange(
              Cesium.Math.toRadians(opts.heading),
              Cesium.Math.toRadians(opts.pitch),
              r * opts.radiusRatio
            )
          );
        })
        .otherwise(function (e) {
          console.log(e);
        });
    return model;
  }

  private _addMarker(options: POILayer): Cesium.Entity {
    const size = options.size ?? 20;
    const pos =
      options.lng && options.lat
        ? Cesium.Cartesian3.fromDegrees(options.lng, options.lat)
        : options.position;
    const opts = {
      position: pos,
      name: options.name,
      id: options.id,
      show: options.show,
      billboard: {
        width: options.width || size,
        height: options.height || size,
        image: options.url,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BASELINE,
        scaleByDistance: new Cesium.NearFarScalar(1.5e1, 2.0, 1.5e4, 0.5),
        heightReference:
          options.clampGround !== false
            ? Cesium.HeightReference.CLAMP_TO_GROUND
            : Cesium.HeightReference.NONE, // 偶尔还是会出现嵌入地下的情况
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
          0.0,
          Number.MAX_VALUE
        )
      }
    };
    if (options.label && options.text) {
      opts['label'] = this.getLabelOptions(options.text, options);
    }
    const entity = (options.target || this.viewer).entities.add(opts);
    entity['props'] = options.props || {};
    return entity;
  }

  private _addPoint(options: PointLayer): Cesium.Entity {
    const size = options.size ?? 10;
    const pos =
      options.lng && options.lat
        ? Cesium.Cartesian3.fromDegrees(options.lng, options.lat)
        : options.position;
    const opts = {
      position: pos,
      name: options.name,
      id: options.id,
      show: options.show,
      point: {
        pixelSize: size,
        color: options.color || Cesium.Color.RED,
        heightReference:
          options.clampGround !== false
            ? Cesium.HeightReference.CLAMP_TO_GROUND
            : Cesium.HeightReference.NONE, // 偶尔还是会出现嵌入地下的情况
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
          0.0,
          Number.MAX_VALUE
        )
      }
    };
    if (options.label && options.text) {
      opts['label'] = this.getLabelOptions(options.text, options);
    }
    const entity = (options.target || this.viewer).entities.add(opts);
    entity['props'] = options.props || {};
    return entity;
  }

  private _addPolyline(options: LineLayer): Cesium.Entity {
    const width = 2;
    const opts = {
      name: options.name,
      id: options.id,
      show: options.show,
      polyline: {
        positions: options.positions,
        width: options.width || width,
        material: options.color || Cesium.Color.CYAN,
        clampToGround: options.clampGround ?? true,
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
          0.0,
          Number.MAX_VALUE
        )
      }
    };
    if (options.label && options.text) {
      opts['label'] = this.getLabelOptions(options.text, options);
    }
    const entity = (options.target || this.viewer).entities.add(opts);
    entity['props'] = options.props || {};
    return entity;
  }

  private _addPolygon(options: AreaLayer): Cesium.Entity {
    const opts = {
      position: options.position,
      name: options.name,
      id: options.id,
      show: options.show,
      polygon: {
        hierarchy: new Cesium.PolygonHierarchy(options.positions),
        fill: options.fill ?? true,
        material: options.fillColor || Cesium.Color.CYAN,
        // height: options.stroke === true ? 0 : undefined,
        // outline: options.stroke ?? true,
        // outlineColor: options.strokeColor || Cesium.Color.GOLD,
        // outlineWidth: options.strokeWidth || 2,
        heightReference: options.clampGround
          ? Cesium.HeightReference.CLAMP_TO_GROUND
          : Cesium.HeightReference.NONE,
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
          0.0,
          Number.MAX_VALUE
        )
      }
    };
    if (options.stroke) {
      opts['polyline'] = {
        positions: options.positions,
        width: options.strokeWidth || 2,
        material: options.strokeColor || Cesium.Color.GOLD,
        clampToGround: options.clampGround ?? true,
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
          0.0,
          Number.MAX_VALUE
        )
      };
    }
    if (options.label && options.text) {
      opts['label'] = this.getLabelOptions(options.text, options);
    }
    const entity = (options.target || this.viewer).entities.add(opts);
    entity['props'] = options.props || {};
    return entity;
  }

  private getLabelOptions(
    text: string | number,
    options: {
      fontSize?: number;
      pixelOffset?: Cesium.Cartesian2;
    }
  ) {
    return {
      text: String(text),
      show: true,
      font: `bold ${options.fontSize ?? 20}px Microsoft YaHei`,
      showBackground: false,
      fillColor: Cesium.Color.fromCssColorString('#FFFFFF'),
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      pixelOffset: options.pixelOffset ?? new Cesium.Cartesian2(0, -50),
      scaleByDistance: new Cesium.NearFarScalar(1.5e1, 2.0, 1.5e4, 0.5),
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
        0,
        Number.MAX_VALUE
      )
    };
  }

  private _removePrimitive(
    options: LayerObj,
    target?: Cesium.PrimitiveCollection
  ): void {
    options.obj && (target || this.viewer.scene.primitives).remove(options.obj);
  }

  private _removeEntity(options: LayerObj, target?: Cesium.DataSource): void {
    const entities = (target || this.viewer).entities;
    if (options.id) {
      entities.removeById(options.id);
      return;
    }
    options.obj && entities.remove(options.obj);
  }

  /**
   * 设置MODEL材质参数
   * @param id 图层id
   * @param options 配置参数
   */
  setMaterialOptions(
    tileset: Cesium.Cesium3DTileset,
    options: {
      luminance?: number;
      lighting?: number;
    }
  ): void {
    if (!tileset) return;
    // 设置模型倾斜材质光照
    tileset.luminanceAtZenith = options.luminance ?? 1;
    tileset.imageBasedLightingFactor = new Cesium.Cartesian2(
      options.lighting ?? 1,
      options.lighting ?? 1
    );
  }

  /**
   * 设置MODEL材质参数
   * @param id 图层id
   * @param options 配置参数
   */
  setLOD(
    tileset: Cesium.Cesium3DTileset,
    options: {
      skipLOD?: boolean;
      maxMemory?: number;
    }
  ): void {
    if (!tileset) return;
    tileset.skipLevelOfDetail = options.skipLOD ?? false;
    tileset.maximumMemoryUsage =
      tileset.maximumMemoryUsage ?? tileset.skipLevelOfDetail ? 2048 : 1024;
  }
}
