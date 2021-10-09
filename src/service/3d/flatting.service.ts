import * as Cesium from '@smart/cesium'
import smart3d from 'smart3d'
import { getPolygonClockwise } from '../common/util'

export class FlattingService {
  private lastTarget?: Cesium.Cesium3DTileset;
  private initHeight = 85.35; // 压平起始高程

  constructor(private viewer: smart3d.Viewer) {}

  startFlatting(
      target: Cesium.Cesium3DTileset,
      polygons: Cesium.Cartesian3[][]
  ): void {
      this.clearFlatting()
      const flattingPlanes: Cesium.FlattingRegion[] = []
      const clippingPlanes: Cesium.ClippingPlane[][] = []
      polygons.forEach((t) => {
          t = getPolygonClockwise(t)
          flattingPlanes.push(this.getFlattingRegion(t))
          clippingPlanes.push(this.getClippingPlanes(t))
      })
      this.flattingByRegion(target, flattingPlanes)
      this.clippingGlobeByPlanes(clippingPlanes.flat())
      this.lastTarget = target
  }

  private flattingByRegion(
      target: Cesium.Cesium3DTileset,
      flattingRegion: Cesium.FlattingRegion[]
  ) {
      target.flattingRegions = new Cesium.FlattingRegionCollection({
          enabled: true,
          regions: flattingRegion
      })
      // target.flattingRegions.add(flattingRegion);
  }

  private clippingGlobeByPlanes(clippingPlanes: Cesium.ClippingPlane[]) {
      this.viewer.scene.globe.depthTestAgainstTerrain = true
      const clipPlanes = new Cesium.ClippingPlaneCollection({
          planes: clippingPlanes,
          edgeWidth: 0.0,
          edgeColor: Cesium.Color.WHITE,
          enabled: true
      })
      this.viewer.scene.globe.clippingPlanes = clipPlanes
  }

  /**
   * 通过顶点范围压平倾斜
   * @param positions 压平范围顶点笛卡尔集
   * @param tileLayerIds 倾斜图层id
   */
  private getFlattingRegion(positions) {
      // 开挖地形
      // const flattingPlanes: Cesium.ClippingPlane[] = [];
      const pointsLength = positions.length
      const normalLineList: Cesium.Cartesian3[] = []
      const cartPoints: Cesium.Cartographic[] = []
      let cartPoint
      for (let i = 0; i < pointsLength; ++i) {
          const nextIndex = (i + 1) % pointsLength
          let midpoint = Cesium.Cartesian3.add(
              positions[i],
              positions[nextIndex],
              new Cesium.Cartesian3()
          )
          midpoint = Cesium.Cartesian3.multiplyByScalar(midpoint, 0.5, midpoint)

          cartPoint = Cesium.Cartographic.fromCartesian(positions[i])
          if (cartPoint instanceof Cesium.Cartographic) {
              cartPoints.push(cartPoint)
          }
          // 两点重叠不需裁切
          if (midpoint.equals(positions[nextIndex])) {
              continue
          }
          const up = Cesium.Cartesian3.normalize(midpoint, new Cesium.Cartesian3())
          let right = Cesium.Cartesian3.subtract(
              positions[nextIndex],
              midpoint,
              new Cesium.Cartesian3()
          )
          right = Cesium.Cartesian3.normalize(right, right)

          let normal = Cesium.Cartesian3.cross(right, up, new Cesium.Cartesian3())
          normal = Cesium.Cartesian3.normalize(normal, normal)

          // Compute distance by pretending the plane is at the origin
          // const originCenteredPlane = new Cesium.Plane(normal, 0.0);
          // const distance = Cesium.Plane.getPointDistance(
          //   originCenteredPlane,
          //   midpoint
          // );

          // flattingPlanes.push(new Cesium.ClippingPlane(normal, distance));

          // 计算倾斜的法向量
          let clipNormal = Cesium.Cartesian3.cross(
              right,
              up,
              new Cesium.Cartesian3()
          )
          clipNormal = Cesium.Cartesian3.normalize(clipNormal, clipNormal)
          const normalLineEnd = Cesium.Cartesian3.add(
              midpoint,
              Cesium.Cartesian3.multiplyByScalar(
                  clipNormal,
                  100,
                  new Cesium.Cartesian3()
              ),
              new Cesium.Cartesian3()
          )
          normalLineList.push(midpoint)
          normalLineList.push(normalLineEnd)
      }

      // 设置倾斜
      const flattingRegion = new Cesium.FlattingRegion({
          enabled: true,
          height: this.initHeight,
          positions: cartPoints,
          id: 'ff'
      })
      return flattingRegion
  }

  /**
   * 通过压平范围裁切地形
   * @param positions 压平范围顶点笛卡尔集
   */
  private getClippingPlanes(positions) {
      const clippingPlanes: Cesium.ClippingPlane[] = []
      const pointsLength = positions.length
      for (let i = 0; i < pointsLength; ++i) {
          const nextIndex = (i + 1) % pointsLength
          let midpoint = Cesium.Cartesian3.add(
              positions[i],
              positions[nextIndex],
              new Cesium.Cartesian3()
          )
          midpoint = Cesium.Cartesian3.multiplyByScalar(midpoint, 0.5, midpoint)
          // 两点重叠不需裁切
          if (midpoint.equals(positions[nextIndex])) {
              continue
          }
          const up = Cesium.Cartesian3.normalize(midpoint, new Cesium.Cartesian3())
          let right = Cesium.Cartesian3.subtract(
              positions[nextIndex],
              midpoint,
              new Cesium.Cartesian3()
          )
          right = Cesium.Cartesian3.normalize(right, right)

          let normal = Cesium.Cartesian3.cross(right, up, new Cesium.Cartesian3())
          normal = Cesium.Cartesian3.normalize(normal, normal)

          // Compute distance by pretending the plane is at the origin
          const originCenteredPlane = new Cesium.Plane(normal, 0.0)
          const distance = Cesium.Plane.getPointDistance(
              originCenteredPlane,
              midpoint
          )

          clippingPlanes.push(new Cesium.ClippingPlane(normal, distance))
      }
      return clippingPlanes
  }

  /**
   * 清除倾斜压平
   */
  clearFlatting(): boolean {
      if (!this.lastTarget) return false

      this.lastTarget.flattingRegions = new Cesium.FlattingRegionCollection({
          enabled: false,
          regions: []
      })
      // 倾斜地形开挖
      this.viewer.scene.globe.clippingPlanes =
      new Cesium.ClippingPlaneCollection()
      return true
  }

  /**
   * 销毁
   */
  destroy(): void {
      this.clearFlatting()
  }
}
