import * as Cesium from '@smart/cesium'
import { LayerService } from './layers.service'
import { StoreService } from './store.service'
import { ViewerService } from './viewer.service'

export class HighlightService extends StoreService {
  private layerService: LayerService;
  readonly roomProp = 'Room';
  readonly floorProp = 'Floor';

  constructor(private viewerService: ViewerService) {
      super()
      // const { viewer } = viewerService;
      this.layerService = this.viewerService.layerService
  }

  hightlightBuiding(buildingId?: string): void {
      const campus = `${this.getState('campus')}`
      const { primitives } = this.layerService
      const config = this.layerService.config.campus.find((t) => t.id === campus)
      config?.buildings.forEach((t) => {
          if (!('index' in t)) return
          const target = primitives.get(t.index)
          if (!target) return
          if (!buildingId || target.props.id === buildingId) {
              target.style = new Cesium.Cesium3DTileStyle()
          } else {
              target.style = new Cesium.Cesium3DTileStyle({
                  color: {
                      conditions: [['true', 'color(\'#e2f4ff\',0.04)']]
                  }
              })
          }
      })
  }

  private updateBuidingPart(
      target: Cesium.Cesium3DTileset,
      options: {
      floor?: string;
      room?: string;
      moveFloorId?: string;
      moveRoomId?: string;
      otherConditions?: [string, string][];
    } = {}
  ): void {
      const { floor, room, moveFloorId, moveRoomId, otherConditions } = options
      const conditions: [string, string][] = []
      if (otherConditions) {
          conditions.push(...otherConditions)
      }
      if (!floor) {
          conditions.push(['true', 'color(\'#FFF\')'])
          if (moveFloorId) {
              conditions.unshift([
                  `\${${this.floorProp}} === "${moveFloorId}"`,
                  'color(\'#87CEFA\')'
              ])
          }
      } else {
          conditions.push(['true', 'color(\'#87CEFA\',0.015)'])
          const selectFloor = `\${${this.floorProp}} === "${floor}"`
          if (!room) {
              conditions.unshift([selectFloor, 'color(\'#ffffff\')'])
          } else {
              const selectRoom =
          `${selectFloor} && \${${this.roomProp}} === "${room}"`
              conditions.unshift([selectFloor, 'color(\'#fff\')'])
              conditions.unshift([selectRoom, 'color(\'#FFA500\')'])
          }
          if (moveRoomId) {
              const selectRoom =
          `${selectFloor} && \${${this.roomProp}} === "${moveRoomId}"`
              conditions.unshift([selectRoom, 'color(\'#F9F871\')'])
          }
      }
      target.style = new Cesium.Cesium3DTileStyle({
          color: { conditions }
      })
  }

  updatePartByMove(
      target: Cesium.Cesium3DTileset,
      move: {
      floorId?: string;
      roomId?: string;
    } = {},
      selected: {
      floorId?: string;
      roomId?: string;
    } = {},
      otherConditions?: [string, string][]
  ): void {
      const floor = selected.floorId ?? this.getState('floor')
      const room = selected.roomId ?? this.getState('room')
      this.updateBuidingPart(target, {
          floor,
          room,
          moveFloorId: move.floorId,
          moveRoomId: move.roomId,
          otherConditions
      })
  }

  updatePartById(
      target: Cesium.Cesium3DTileset,
      floor?: string,
      room?: string
  ): void {
      this.updateBuidingPart(target, { floor, room })
  }

  resetHighlight(): void {
      const building = this.getState('building')
      if (!building) {
          this.hightlightBuiding()
      } else {
          const campus = this.getState('campus')
          const target = this.viewerService.layerService.getBuilding({
              campus,
              building
          })
          if (!target) return
          this.updatePartByMove(target)
      }
  }
}
