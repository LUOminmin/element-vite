/*
 * @Author: Marsy<mafy@southzn.com>
 * @Date: 2021-09-23 20:10:57
 * @LastEditors: Marsy<mafy@southzn.com>
 * @LastEditTime: 2021-10-07 17:40:24
 * @Description: 日照分析服务
 */
import smart3d from 'smart3d';
import * as Cesium from '@smart/cesium';
import { AnalysisBaseService } from './analysis-base.service';
import { StoreService } from './store.service';
import { DataType } from 'src/store/types';
import api from 'src/App.api';
import { message } from 'antd';
import { ViewerService } from './viewer.service';
import { HighlightService } from './highlight.service';

interface options {
  startTime?: any; //（日照分析）开始时刻
  stopTime?: any; //（日照分析）终止时刻 格式为标准时间格式 例如：Thu May 12 2016 08:00:00 GMT+0800 (中国标准时间)
  multiplier?: number; // 时间流逝倍数
  clockRange?: number; // 循环模式
  softShadows?: boolean; // 是否使用软阴影
}

export class SunShineAnalysisService
  extends StoreService
  implements AnalysisBaseService
{
  type = 'ViewRoom';
  private sunShineAnalysis?: smart3d.SunShineAnalysis;
  private params: options = {}; // 配置参数
  private removeCallback: any; // 实时监听删除对象
  private sunshineData: options = {}; // 日照分析时长分析结果
  readonly floorProp = 'Floor';

  campusId = '';
  private viewer: smart3d.Viewer;
  readonly highlightService: HighlightService;
  private colors: { color: string; value: string; min: number; max: number }[];

  constructor(private viewerService: ViewerService, options: options = {}) {
    super();
    this.viewer = viewerService.viewer;
    this.highlightService = new HighlightService(viewerService);
    // 初始化数据
    let dateNowStr = JSON.stringify(new Date()).split('T')[0];
    dateNowStr = dateNowStr.slice(1, dateNowStr.length);
    this.params.startTime = options.startTime
      ? Cesium.JulianDate.fromDate(options.startTime)
      : Cesium.JulianDate.fromIso8601(dateNowStr + 'T06:00:00');
    this.params.stopTime = options.stopTime
      ? Cesium.JulianDate.fromDate(options.stopTime)
      : Cesium.JulianDate.fromIso8601(dateNowStr + 'T20:00:00');
    this.params.multiplier = Math.max(
      0,
      Cesium.defaultValue(options.multiplier, 3600)
    );
    this.params.clockRange = Cesium.defaultValue(
      options.clockRange,
      Cesium.ClockRange.LOOP_STOP
    );
    /**
     * 是否开启软阴影
     * @type {Boolean}
     * @default false
     */
    this.params.softShadows = Cesium.defaultValue(options.softShadows, true);
    this.colors = this.getState('sunlightlegend').map((t) => {
      const range = t.value.match(/[0-9]/g);
      return { ...t, min: range[0], max: range[1] };
    });
  }

  // 开始激活操作
  async active(): Promise<void> {
    const campus = String(this.getState('campus'));
    if (!campus) {
      message.warn('请先选择小区');
      return;
    }

    const viewer = this.viewer;
    this.sunShineAnalysis = new smart3d.SunShineAnalysis(viewer, {
      startTime: this.params.startTime,
      stopTime: this.params.stopTime,
      multiplier: this.params.multiplier,
      softShadows: this.params.softShadows,
      throughTransparentMaterial: true,
      transparencyMinTolerance: 0.2,
      transparencyTolerance: 0.8
    });

    if (
      this.campusId !== campus ||
      JSON.stringify(this.sunshineData) === '{}'
    ) {
      this.campusId = campus;
      const res = await api.viewer3d.getSunLightList();
      this.sunshineData = res?.data ?? {};
    }
    this.hightlightAll();
  }

  private hightlightAll(): void {
    if (!this.campusId || JSON.stringify(this.sunshineData) === '{}') return;
    const building = this.getState('building');
    const { layerService } = this.viewerService;
    if (!building) {
      const { primitives } = layerService;
      const config = layerService.getBuildingConfig(this.campusId);
      config?.forEach((t) => {
        if (!('index' in t)) return;
        const target = primitives.get(t.index);
        if (!target) return;
        this.highLightBuilding(target);
      });
      return;
    }
    const room = this.getState('room');
    if (room) return;
    const target = layerService.getBuilding({
      campus: this.campusId,
      building
    });
    if (!target) return;
    this.highLightBuilding(target);
  }

  private highLightBuilding(target: Cesium.Cesium3DTileset): void {
    const floor = this.getState('floor');
    const evaluateColor = (
      feature: Cesium.Cesium3DTileFeature,
      result: Cesium.Color
    ): Cesium.Color => {
      const floorId = feature.getProperty('Floor');
      const guid = feature.getProperty('Guid');
      if ((!floor || floor === floorId) && this.sunshineData[guid]) {
        const status = Number(this.sunshineData[guid]);
        const item = this.colors.find(
          (c) => status >= c.min && (status < c.max || status === 8)
        );
        if (item) {
          return Cesium.Color.clone(
            Cesium.Color.fromCssColorString(item.color),
            result
          );
        }
      }
      return Cesium.Color.clone(feature.color, result);
    };
    target.style = new Cesium.Cesium3DTileStyle({
      color: { evaluateColor }
    });
  }

  /**
   * 修改日期
   * @param { Date } startTimeVal 开始时间，格式为标准时间格式 例如：Thu May 12 2016 08:00:00 GMT+0800 (中国标准时间)
   * @param { Date } stopTimeVal 结束时间，格式为标准时间格式 例如：Thu May 12 2016 08:00:00 GMT+0800 (中国标准时间)
   */
  changeDate(startTimeVal: Date, stopTimeVal: Date): void {
    if (this.sunShineAnalysis) {
      this.sunShineAnalysis.updateStartTime(
        Cesium.JulianDate.fromDate(startTimeVal)
      );
      this.sunShineAnalysis.updateStopTime(
        Cesium.JulianDate.fromDate(stopTimeVal)
      );
    }
  }
  /**
   * 修改开始时间
   * @param { Date } startTimeVal 开始时间，格式为标准时间格式 例如：Thu May 12 2016 08:00:00 GMT+0800 (中国标准时间)
   */
  changeStartTime(startTimeVal: Date): void {
    if (this.sunShineAnalysis) {
      this.sunShineAnalysis.updateStartTime(
        Cesium.JulianDate.fromDate(startTimeVal)
      );
    }
  }

  /**
   * 修改结束时间
   * @param { Date } stopTimeVal 结束时间，格式为标准时间格式 例如：Thu May 12 2016 08:00:00 GMT+0800 (中国标准时间)
   */
  changeStopTime(stopTimeVal: Date): void {
    if (this.sunShineAnalysis) {
      this.sunShineAnalysis.updateStopTime(
        Cesium.JulianDate.fromDate(stopTimeVal)
      );
    }
  }

  /**
   * 修改当前的时间
   * @param { Date } curTimeVal 结束时间，格式为标准时间格式 例如：Thu May 12 2016 08:00:00 GMT+0800 (中国标准时间)
   */
  changeCurTime(curTimeVal: Date): void {
    if (this.sunShineAnalysis) {
      this.viewer.clock.currentTime = Cesium.JulianDate.fromDate(curTimeVal);
    }
  }

  /**
   * 开始播放，带参数播放
   * @param { Date } startTimeVal 当前时间，格式为标准时间格式 例如：Thu May 12 2016 08:00:00 GMT+0800 (中国标准时间)
   * @param { Date } stopTimeVal 结束时间，格式为标准时间格式 例如：Thu May 12 2016 08:00:00 GMT+0800 (中国标准时间)
   * @param { Date } curTimeVal 当前时间，格式为标准时间格式 例如：Thu May 12 2016 08:00:00 GMT+0800 (中国标准时间)
   */
  onStart(startTimeVal: Date, stopTimeVal: Date, curTimeVal?: Date): void {
    if (this.sunShineAnalysis) {
      this.sunShineAnalysis.updateStartTime(
        Cesium.JulianDate.fromDate(startTimeVal)
      );
      this.sunShineAnalysis.updateStopTime(
        Cesium.JulianDate.fromDate(stopTimeVal)
      );

      if (curTimeVal) {
        this.viewer.clock.currentTime = Cesium.JulianDate.fromDate(curTimeVal);
      }
    } else {
      this.sunShineAnalysis = new smart3d.SunShineAnalysis(this.viewer, {
        startTime: Cesium.JulianDate.fromDate(startTimeVal),
        stopTime: Cesium.JulianDate.fromDate(stopTimeVal),
        multiplier: this.params.multiplier,
        softShadows: true,
        throughTransparentMaterial: true,
        transparencyMinTolerance: 0.2,
        transparencyTolerance: 0.8
      });
    }

    this.viewer.shadows = true;
    this.sunShineAnalysis.start();

    this._getTime();
  }

  // 暂停播放/继续播放
  onPauseOrContinue(): void {
    if (this.sunShineAnalysis) {
      this.sunShineAnalysis.pauseOrContinue();
      if (this.viewer.clock.shouldAnimate) {
        // 继续
        this._getTime();
      } else {
        // 暂停
        this.removeCallback && this.removeCallback();
      }
    }
  }

  // 实时返回当前时间节点
  private _getTime(): void {
    this.removeCallback && this.removeCallback();
    this.removeCallback = this.viewer.clock.onTick.addEventListener(() => {
      const curTime = this.viewer.clock.currentTime;
      const date = new Date(curTime.toString());

      if (date.toString() !== 'Invalid Date') {
        this.store.dispatch({
          type: DataType.SUNSHINETIME,
          value: date
        });
      }
    }, this);
  }

  /**
   * 修改时间流逝速度
   * @param { Number } value 倍数 例如：3600
   */
  peedChanged(value: number): void {
    if (this.sunShineAnalysis) {
      this.sunShineAnalysis.updateMultiplier(value);
    }
  }
  deactive(): void {
    if (this.sunShineAnalysis) {
      this.removeCallback && this.removeCallback();
      this.sunShineAnalysis.destroy();
      this.viewer.shadows = false;
    }
    if (JSON.stringify(this.sunshineData) !== '{}') {
      this.highlightService.resetHighlight();
    }
  }
  destroy(): void {
    this.deactive();
  }
}
