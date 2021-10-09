import * as Cesium from '@smart/cesium'
import { AnalysisBaseService } from './analysis-base.service'
import api from 'src/App.api'
import { StoreService } from './store.service'
import { ViewerService } from './viewer.service'
import { message } from 'antd'
import { HighlightService } from './highlight.service'
import { Legend } from 'src/store/types'

export class HighlightAnalysisService
    extends StoreService
    implements AnalysisBaseService
{
  type = 'HighlightAnalysis';
  private campusId = '';
  highlightType = 'HouseSell';
  private buildingsObj: Record<string, Record<string, any>> = {};
  readonly highlightService: HighlightService;
  private colors: Map<string, { field: string; items: Legend[] }>;
  private buildingField = 'buildIngModelIdent';
  private floorField = 'floorModelIdent';
  private roomField = 'modelIdent';

  constructor(private viewerService: ViewerService) {
      super()
      this.highlightService = new HighlightService(viewerService)
      this.colors = new Map()
      this.colors.set('HouseSell', {
          field: 'xzztName',
          items: this.getState('registerlegend')
      })
      this.colors.set('School', {
          field: 'xsztName',
          items: this.getState('carportlegend')
      })
  }

  // 开始激活操作
  async active(type: string): Promise<boolean> {
      const campus = String(this.getState('campus'))
      if (!campus) {
          message.warn('请先选择小区')
          return false
      }
      if (!type) return false
      this.highlightType = type
      if (
          this.campusId !== campus ||
      JSON.stringify(this.buildingsObj) === '{}'
      ) {
          this.campusId = campus
          const res = await api.viewer3d.getRoomList(this.campusId)
          this.buildingsObj = this.formatData(res?.data || []) ?? {}
      }
      return this.hightlightAll()
  }

  // group list by building
  private formatData(list: any[]): any {
      if (!list?.length) return
      const obj = {}
      list.forEach((t) => {
          const buildingId = t[this.buildingField]
          if (!obj[buildingId]) {
              obj[buildingId] = {}
          }
          obj[buildingId][`${t[this.floorField]}-${t[this.roomField]}`] = t
      })
      return obj
  }

  // 高亮某一小区
  private hightlightAll(): boolean {
      if (!this.campusId) return false
      const building = this.getState('building')
      const { layerService } = this.viewerService
      if (!building) {
          const { primitives } = layerService
          const config = layerService.getBuildingConfig(this.campusId)
          config?.forEach((t) => {
              if (!('index' in t)) return
              const target = primitives.get(t.index)
              if (!target) return
              this.highLightBuilding(target, this.buildingsObj[t.id])
          })
          return true
      }
      const room = this.getState('room')
      if (room) {
          message.warn('请先取消选中的户')
          return false
      }
      const target = layerService.getBuilding({
          campus: this.campusId,
          building
      })
      if (!target) {
          message.error('查找不到楼幢')
          return false
      }
      this.highLightBuilding(target, this.buildingsObj[building])
      return true
  }

  private highLightBuilding(
      target: Cesium.Cesium3DTileset,
      obj: Record<string, any> = {}
  ): void {
      const colors = this.colors.get(this.highlightType)
      if (!colors) return
      const floor = this.getState('floor')
      const evaluateColor = (
          feature: Cesium.Cesium3DTileFeature,
          result: Cesium.Color
      ): Cesium.Color => {
          const floorId = feature.getProperty('Floor')
          const roomId = feature.getProperty('Room')
          const data = obj[`${floorId}-${roomId}`]
          if ((!floor || floor === floorId) && data) {
              const status = data[colors.field]
              const item = colors.items.find((c) => c.value === status)
              if (item) {
                  return Cesium.Color.clone(
                      Cesium.Color.fromCssColorString(item.color),
                      result
                  )
              }
          }
          return Cesium.Color.clone(feature.color, result)
      }
      target.style = new Cesium.Cesium3DTileStyle({
          color: { evaluateColor }
      })
  }

  deactive(): void {
      this.highlightService.resetHighlight()
  }
}
