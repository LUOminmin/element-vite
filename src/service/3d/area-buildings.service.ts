import smart3d from 'smart3d'
import * as Cesium from '@smart/cesium'
import { message } from 'antd'
import {
    cartesianToDegrees,
    getPolygonClockwise,
    projPoint
} from '../common/util'
import { ToolTips } from '../common/toolTips'
import { ViewerService } from './viewer.service'
import { StoreService } from './store.service'
import { DataType } from 'src/store/types'

export class AreaBuildingService extends StoreService {
  private toolTips: ToolTips;
  private _drawHandler?: smart3d.DrawHandler;
  constructor(private viewerService: ViewerService) {
      super()
      this.toolTips = new ToolTips(viewerService.viewer, {
          fontSize: 14,
          fontColor: 'rgba(255, 255, 255,1)',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          size: new Cesium.Cartesian2(270, 30),
          fontOffset: new Cesium.Cartesian2(10, 20),
          positionOffset: new Cesium.Cartesian2(10, 0)
      })
  }

  active(): void {
      const campus = this.getState('campus')
      if (!campus) {
          message.warn('请先选择小区')
          this.store.dispatch({
              type: DataType.ANALYSISTOOL,
              value: ''
          })
          return
      }
      if (!this._drawHandler) {
          this._drawHandler = new smart3d.DrawHandler(
              this.viewerService.viewer,
              smart3d.DrawMode.Polygon,
              { clampToGround: true }
          )
      }
      this.toolTips.setMessage('左键添加三个点以上，右键完成绘制')
      this.toolTips.activate()
      this._drawHandler.activate()
      this._drawHandler.enableAssist = true
      this._drawHandler?.drewEvent.addEventListener(
          (positions: Cesium.Cartesian3[]) => {
              this.toolTips.deactivate()
              const len = positions.length
              if (len < 3) {
                  message.warn('请绘制至少3个点')
                  return
              }
              const clockwise = getPolygonClockwise(positions, false)
              const coords = clockwise.map((position) => {
                  const degrees = cartesianToDegrees(position)
                  return projPoint(degrees.longitude, degrees.latitude, '2000p')
              })
              this.store.dispatch({
                  type: DataType.DRAWPOLYGON,
                  value: coords
              })
          }
      )
  }

  highlight(buildingIds: string): void {
      const ids = buildingIds.split(',')
      const campus = this.getState('campus')
      ids.forEach((id) => {
          const target = this.viewerService.layerService.getBuilding({
              campus,
              building: id
          })
          if (!target) return
      })
  }

  clear(): void {
      this._drawHandler?.clear()
      this.active()
  }

  deactive(): void {
      this.toolTips.deactivate()
      this._drawHandler?.destroy()
      this._drawHandler = undefined
  }
}
