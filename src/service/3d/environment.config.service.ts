/*
 * @Author: Marsy<mafy@southzn.com>
 * @Date: 2021-09-27 10:49:59
 * @LastEditors: Marsy<mafy@southzn.com>
 * @LastEditTime: 2021-09-29 01:25:49
 * @Description: 场景设置
 */
import smart3d from 'smart3d'
import * as Cesium from '@smart/cesium'
import { StoreService } from './store.service'
import { message } from 'antd'
import {
    NormalConfigStateModel,
    SsaaConfig,
    initialNormalConfigState,
    MemoryUsage
} from '../common/enviroment'

export class EnviromentConfigService extends StoreService {
  private isListenerScene = false;
  private showMemoryTip = false;
  constructor(private viewer: smart3d.Viewer) {
      super()
  }

  setConfig(normalConfig?: NormalConfigStateModel): void {
      const date = new Date()
      const curdate = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDay(),
          normalConfig?.sceneTime ?? initialNormalConfigState.sceneTime
      )
      this.setTime(curdate)

      this.setSunlight(
          normalConfig?.showSunlight ?? initialNormalConfigState.showSunlight
      )
      this.setShadows(
          normalConfig?.showShadows ?? initialNormalConfigState.showShadows
      )
      this.setLight(
          normalConfig?.sunLightIntensity ??
        initialNormalConfigState.sunLightIntensity
      )

      this.setFxaa(
          normalConfig?.enableFxaa ?? initialNormalConfigState.enableFxaa
      )
      this.setSSAA(
          normalConfig?.ssaaConfig ?? initialNormalConfigState.ssaaConfig
      )
      this.setDepthTestAgainstTerrain(
          normalConfig?.depthTestAgainstTerrain ??
        initialNormalConfigState.depthTestAgainstTerrain
      )
      this.setFrustumCull(
          normalConfig?.frustumCull ?? initialNormalConfigState.frustumCull
      )
      this.setTileReduceResolution(
          normalConfig?.tileReduceResolution ??
        initialNormalConfigState.tileReduceResolution
      )

      const memoryUsage = {
          maximumTotalMemoryUsage:
        normalConfig?.maximumTotalMemoryUsage ??
        initialNormalConfigState.maximumTotalMemoryUsage,
          cachedTotalMemoryUsage:
        normalConfig?.cachedTotalMemoryUsage ??
        initialNormalConfigState.cachedTotalMemoryUsage
      }
      this.setMemoryUsage(memoryUsage)
  }
  /** -------- 光照设置 -------- */
  // 光照时间
  setTime(data: Date): void {
      this.viewer.clock.currentTime = Cesium.JulianDate.fromDate(data)
  }
  // 光照显影
  setSunlight(value: boolean): void {
      this.viewer.scene.globe.enableLighting = value
  }
  // 光照颜色和强度设置
  setLight(value: number): void {
      // this.viewer.scene.light.color = Cesium.Color.fromCssColorString(
      //   value.color
      // );
      this.viewer.scene.light.intensity = value
  }
  // 阴影显隐
  setShadows(value: boolean): void {
      this.viewer.shadows = value
  }
  /** -------- 光照设置 END -------- */

  /** -------- 环境变量 -------- */
  // FXAA抗锯齿
  setFxaa(value: boolean): void {
      this.viewer.scene.postProcessStages.fxaa.enabled = value
  }
  // SSAA抗锯齿
  setSSAA(ssaaConfig: SsaaConfig): void {
      this.viewer.scene.ssaaRenderer.enable = ssaaConfig.enable
      this.viewer.scene.ssaaRenderer.sampleLevel = ssaaConfig.sampleLevel
  }
  // 地形遮挡
  setDepthTestAgainstTerrain(value: boolean): void {
      this.viewer.scene.globe.depthTestAgainstTerrain = value
  }
  // 视锥内3dtiles削减
  setFrustumCull(value: boolean): void {
      this.viewer.scene.useFrustumClipping = value
  }
  // 视锥内地形及影像瓦片削减
  setTileReduceResolution(value: boolean): void {
      this.viewer.scene.tileReduceResolution = value
  }
  /** -------- 环境变量 END -------- */

  // 内存管理:最大使用内存(MB)、最大缓存内存(MB)
  setMemoryUsage(normalConfig: MemoryUsage): void {
      if (normalConfig?.maximumTotalMemoryUsage !== undefined) {
          Cesium.Cesium3DTileset.maximumTotalMemoryUsage =
        normalConfig?.maximumTotalMemoryUsage
      }
      if (normalConfig?.cachedTotalMemoryUsage !== undefined) {
          Cesium.Cesium3DTileset.cachedTotalMemoryUsage =
        normalConfig?.cachedTotalMemoryUsage
      }
      if (!this.isListenerScene) {
          this.isListenerScene = true
          const { scene } = this.viewer
          scene.postUpdate.addEventListener((_) => {
              const { maximumTotalMemoryUsage } = Cesium.Cesium3DTileset
              const { currentTotalMemoryUsage } = Cesium.Cesium3DTileset
              if (currentTotalMemoryUsage > maximumTotalMemoryUsage) {
                  if (!this.showMemoryTip) {
                      this.showMemoryTip = true
                      message.warn(
                          '当前数据使用内存已超出场景最大使用内存，可能会影响了数据加载刷新，请调整数据内存或场景内存来恢复效果。'
                      )
                  }
              } else {
                  this.showMemoryTip = false
              }
          })
      }
  }
}
