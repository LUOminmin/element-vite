import smart3d from 'smart3d'
import * as Cesium from '@smart/cesium'
import LayerManager, { LayerOptions, LayerType } from '../../common/layers'
import api from 'src/App.api'
import { unprojPoint } from '../../common/util'
import { StoreService } from './store.service'
import { DataType } from 'src/store/types'
import { FlattingService } from './flatting.service'

type AddedCampus = {
  id: string;
  name: string;
  monomers?: boolean;
  buildings?: boolean;
};

export class LayerService extends StoreService {
  config: any;
  private heading: number;
  private pitch: number;
  readonly layerMgt: LayerManager;
  readonly flattingService: FlattingService;
  campusLayer: Cesium.DataSource;
  layerTextLayer: Cesium.DataSource;
  primitives: Cesium.PrimitiveCollection;
  readonly addedCampus: Record<string, AddedCampus> = {};
  private isCampusAdded = false;
  private lastCampus?: string;
  private originView?: {
    destination: Cesium.Cartesian3;
    orientation: {
      heading: number;
      pitch: number;
      roll: number;
    };
  };

  constructor(private viewer: smart3d.Viewer, baseUrl?: string) {
      super()
      this.primitives = viewer.scene.primitives
      this.layerMgt = new LayerManager(viewer, baseUrl)
      this.flattingService = new FlattingService(viewer)
      this.campusLayer = new Cesium.CustomDataSource('campus')
      viewer.dataSources.add(this.campusLayer)
      this.layerTextLayer = new Cesium.CustomDataSource('layerText')
      viewer.dataSources.add(this.layerTextLayer)
      this.layerTextLayer.show = false
      this.config = JSON.parse(JSON.stringify(window.$CONFIG.MAP_CONFIG))
      this.heading = Cesium.Math.toRadians(this.config.home.heading ?? 300)
      this.pitch = Cesium.Math.toRadians(this.config.home.pitch ?? -25)
  }

  init(): void {
      if (this.isCampusAdded) return
      this.addLayers(this.config.layers)
      this.addLayers(this.config.monomers)
      this.config.campus.forEach((t: any) => {
          const data: AddedCampus = { id: t.id, name: t.name }
          if (t.monomers?.length) {
              this.addLayers(
                  t.monomers.map((m: any) => {
                      m.props = {
                          type: 'monomers',
                          campus: t.id
                      }
                      return m
                  })
              )
              data.monomers = true
              // data.buildings = false;
          }
          if (t.buildings?.length) {
              this.addLayers(
                  t.buildings.map((m: any) => {
                      m.show = false
                      m.props = {
                          type: 'buildings',
                          campus: t.id
                      }
                      return m
                  })
              )
              data.buildings = true
          }
          this.addedCampus[t.id] = data
      })
      this.isCampusAdded = true
  }

  addLayers(layers: LayerOptions[]): void {
      layers?.forEach((t) => {
          if (t.point) {
              const position = Cesium.Cartesian3.fromDegrees(
                  t.point.lng,
                  t.point.lat,
                  t.point.alt
              )
              this.addTxtPoi(position, t.id, t.name)
          }
          const layer = this.layerMgt.add(t)
          /* eslint-disable */
          if (layer && 'index' in layer) t['index'] = layer.index
      })
  }

  /**
   * 添加注记
   * @param { Cesium.Cartesian3 } position 位置
   * @param { string } id 唯一标识
   * @param { string } name 注记名称
   */
  addTxtPoi(position: Cesium.Cartesian3, id?: string, name?: string): void {
      this.layerTextLayer.entities.add({
          id: id,
          name: name,
          position,
          label: {
              text: name,
              show: true,
              showBackground: true,
              font: '14px Microsoft YaHei',
              backgroundColor: Cesium.Color.BLACK.withAlpha(0.3),
              fillColor: Cesium.Color.WHITE,
              outlineColor: Cesium.Color.ORANGERED,
              outlineWidth: 2
          }
      })
  }

  /**
   * 控制楼栋注记显隐
   * @param { boolean } value
   */
  toggleTxtPoi(value: boolean): void {
      if (this.layerTextLayer) {
          this.layerTextLayer.show = value
      }
  }

  getBuildingConfig(campusId: string): any {
      const campus = this.config.campus.find((t: any) => t.id === campusId)
      return campus?.buildings
  }

  getBuilding(ids: {
    campus: string;
    building: string;
  }): Cesium.Cesium3DTileset | null {
      const campus = this.config.campus.find((t: any) => t.id === ids.campus)
      if (!campus) return null
      const building = campus.buildings.find((t: any) => t.id === ids.building)
      if (!building || !('index' in building)) return null
      const target = this.primitives.get(building.index)
      return target
  }

  zoomToFloor(ids: { campus: string; building: string }, index: number): void {
      if (index < 0) return
      const target = this.getBuilding(ids)
      if (!target) return
      target.readyPromise.then(() => {
          const sorted = target.root.children.sort((a, b) => {
              const x = Cesium.Cartographic.fromCartesian(a.boundingSphere.center)
              const y = Cesium.Cartographic.fromCartesian(b.boundingSphere.center)
              return x.height - y.height
          })
          const floor = sorted[index]
          this.zoomByBoundingSphere(floor.boundingSphere)
      })
  }

  zoomByBoundingSphere(boundingSphere: Cesium.BoundingSphere): void {
      this.viewer.camera.flyToBoundingSphere(
          new Cesium.BoundingSphere(boundingSphere.center, boundingSphere.radius),
          {
              duration: 2,
              offset: new Cesium.HeadingPitchRange(
                  Cesium.Math.toRadians(323),
                  Cesium.Math.toRadians(-45),
                  0
              )
          }
      )
  }

  zoomToBuilding(ids: { campus: string; building: string }): Promise<boolean> {
      if (!ids.campus || !ids.building) return Promise.resolve(false)
      const target = this.getBuilding(ids)
      if (!target) return Promise.resolve(false)
      return target.readyPromise.then(() => {
          return this.viewer.flyTo(target, {
              offset: new Cesium.HeadingPitchRange(
                  this.heading,
                  this.pitch,
                  target.boundingSphere.radius * 6.0
              ),
              duration: 2
          })
      })
  }

  async showCampus(campusId: string, isZoom = true): Promise<void> {
      this.clearCampus()
      const res = await api.viewer3d.getCampusGeo(campusId)
      const { geomDatas, lat, lng, name, address, id } = res.data
      if (lat && lng && name) {
          this.store.dispatch({
              type: DataType.CAMPUSPOINT,
              value: { lat, lng, name, id, address }
          })
      }
      if (geomDatas?.length > 0) {
          this.lastCampus = campusId
          const points = this.addCampus(
              geomDatas.map((geo: any) => {
                  const data = JSON.parse(geo)
                  const coords = data.coordinates[0].map((p: any) =>
                      unprojPoint(p[0], p[1])
                  )
                  return coords
              })
          )
          this.setCampus(campusId, false, points)
          isZoom && this._zoomToCampusByPoints(points)
          this.toggleTxtPoi(true)
      }
  }

  private addCampus(coords: any[]): Cesium.Cartesian3[][] {
      const points: Cesium.Cartesian3[][] = []
      coords.forEach((polygon) => {
          const positions = Cesium.Cartesian3.fromDegreesArray(polygon.flat())
          points.push(positions)
          this.layerMgt.add({
              target: this.campusLayer,
              type: LayerType.POLYLINE,
              positions,
              width: 5,
              color: new Cesium.PolylineDashMaterialProperty({
                  color: Cesium.Color.fromCssColorString('#5b9ee2'),
                  dashLength: 24
              })
          })
      })
      return points
  }

  private _zoomToCampusByPoints(points: any) {
      const boundingSphere = Cesium.BoundingSphere.fromPoints(points.flat())
      const cartograhphic = Cesium.Cartographic.fromCartesian(
          boundingSphere.center
      )
      const lat = Cesium.Math.toDegrees(cartograhphic.latitude)
      const lng = Cesium.Math.toDegrees(cartograhphic.longitude)

      const boundingEntity = this.viewer.entities.getById('boundingPoint')
      if (boundingEntity) {
          this.viewer.entities.remove(boundingEntity)
      }
      const entity = new Cesium.Entity({
          id: 'boundingPoint',
          position: Cesium.Cartesian3.fromDegrees(lng, lat, 110),
          point: new Cesium.PointGraphics({
              color: Cesium.Color.TRANSPARENT
          })
      })
      this.viewer.entities.add(entity)
      this.viewer
          .flyTo(entity, {
              duration: 2,
              offset: new Cesium.HeadingPitchRange(
                  this.heading,
                  this.pitch,
                  boundingSphere.radius * 3.5
              )
          })
          .then(() => this.rememberPos())
  }

  setCampus(
      campusId: string,
      show: boolean,
      flattingPoints?: Cesium.Cartesian3[][]
  ): void {
      this.setMonomers(campusId, show)
      if (this.addedCampus[campusId].monomers) return
      if (!show && flattingPoints) {
          this.flattingImageModel(flattingPoints)
      } else {
          this.flattingService.clearFlatting()
      }
  }

  setMonomers(campusId: string, show: boolean): void {
      const campus = this.addedCampus[campusId]
      if (!campus) return
      const config = this.config.campus.find((t: any) => t.id === `${campusId}`)
      if (!config) return
      if (campus.monomers) {
          config.monomers.forEach((t: any) => {
              if (!('index' in t)) return
              this.primitives.get(t.index).show = show
          })
      }
      if (campus.buildings) {
          config.buildings.forEach((t: any) => {
              if (!('index' in t)) return
              this.primitives.get(t.index).show = !show
          })
      }
  }

  // 倾斜压平
  private flattingImageModel(polygons: Cesium.Cartesian3[][]) {
      const config = this.config.layers.find((t: any) => t.type === 'IMAGEMODEL')
      if (!config) return
      const target = this.primitives.get(config.index)
      const rectangle = Cesium.Rectangle.fromCartesianArray(polygons.flat())
      Cesium.Rectangle.northeast(rectangle)
      this.flattingService.startFlatting(target, [
          [
              Cesium.Cartographic.toCartesian(Cesium.Rectangle.northeast(rectangle)),
              Cesium.Cartographic.toCartesian(Cesium.Rectangle.northwest(rectangle)),
              Cesium.Cartographic.toCartesian(Cesium.Rectangle.southwest(rectangle)),
              Cesium.Cartographic.toCartesian(Cesium.Rectangle.southeast(rectangle))
          ]
      ])
  }

  clearCampus(): void {
      if (!this.campusLayer) return
      this.campusLayer.entities.removeAll()
      if (this.lastCampus) {
          this.setCampus(this.lastCampus, true)
          this.lastCampus = undefined
      }
  }
  rememberPos(): void {
      const { camera } = this.viewer
      const originView = {
          destination: camera.position.clone(),
          orientation: {
              heading: camera.heading,
              pitch: camera.pitch,
              roll: camera.roll
          }
      }
      this.originView = Object.assign({}, originView)
  }
  getCampusPos(): void {
      if (!this.originView) return
      this.viewer.camera.flyTo({ ...this.originView, duration: 2 })
  }
}
