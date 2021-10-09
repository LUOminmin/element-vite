/*
 * @Author: Marsy<mafy@southzn.com>
 * @Date: 2021-09-27 11:08:05
 * @LastEditors: Marsy<mafy@southzn.com>
 * @LastEditTime: 2021-09-29 01:27:23
 * @Description: 场景设置参数定义
 */

// 环境配置，基本配置，通用配置项目
export interface NormalConfigStateModel {
  sceneTime: number;
  showSunlight: boolean;
  showShadows: boolean;
  sunLightIntensity: number;
  enableFxaa: boolean;
  ssaaConfig: SsaaConfig;
  depthTestAgainstTerrain: boolean;
  frustumCull: boolean;
  tileReduceResolution: boolean;
  maximumTotalMemoryUsage: number;
  cachedTotalMemoryUsage: number;
}
export interface MemoryUsage {
  maximumTotalMemoryUsage: number;
  cachedTotalMemoryUsage: number;
}

export interface SsaaConfig {
  enable: boolean;
  sampleLevel: number;
}
export const initialSsaaConfig: SsaaConfig = {
  enable: false,
  sampleLevel: 2
};

// 初始化数值
export const initialNormalConfigState: NormalConfigStateModel = {
  // 光照设置
  sceneTime: 22,
  sunLightIntensity: 0.8,
  showSunlight: true,
  showShadows: false,
  // 环境变量
  enableFxaa: false, // FXAA抗锯齿
  ssaaConfig: initialSsaaConfig,
  depthTestAgainstTerrain: false,
  frustumCull: false, // 视锥内3dtiles削减
  tileReduceResolution: false, // 视锥内地形及影像瓦片削减
  // 内存参数
  maximumTotalMemoryUsage: 12288,
  cachedTotalMemoryUsage: 2048
};
