/* eslint-disable quotes */
import * as Cesium from '@smart/cesium';
import smart3d from 'smart3d';

export interface SelectedObj {
  id: string;
  feature: any;
  originColor: any;
  features: any[];
}

export class Hightlight {
  _viewer: smart3d.Viewer;
  constructor(viewer: smart3d.Viewer) {
    this._viewer = viewer;
  }
  getInfo?: (
    selectedId: string | null,
    type: 'room' | 'floor' | 'building'
  ) => void;

  readonly roomProp = 'Room';
  readonly floorProp = 'Floor';
  private config = window.$CONFIG.MAP_CONFIG;

  /**
   * 保留当前选中的楼栋/层，弱化其他模块
   * @param { string } key 字段名称
   * @param { string } val 当前选中结果
   * @param { string } floorId 楼层id
   */
  setHighlightById(
    key: string,
    val: string,
    options?: {
      floorKey?: string;
      floorId?: string;
    }
  ): void {
    const primitives = this._viewer.scene.primitives;

    const config = this.config.buildings.find((v) => v.id === val);
    if (!config) return;

    this.config.buildings.forEach((t) => {
      const target = primitives.get(t.index);
      if (config.index === t.index) {
        if (options) {
          target.style = new Cesium.Cesium3DTileStyle({
            color: {
              evaluateColor: (feature, result) => {
                const featureId = feature.getProperty(options.floorKey);
                return featureId === options.floorId
                  ? Cesium.Color.clone(Cesium.Color.WHITE, result)
                  : Cesium.Color.clone(
                      Cesium.Color.WHITE.withAlpha(0.01),
                      result
                    );
              }
            }
          });
        } else {
          target.style = new Cesium.Cesium3DTileStyle();
        }
      } else {
        target.style = new Cesium.Cesium3DTileStyle({
          color: {
            conditions: [['true', "color('#FFF', 0.01)"]]
          }
        });
      }
    });
  }

  /**
   * 根据feature条件直接高亮
   * @param { boolean } isHightLight 高亮的条件
   * @param { Cesium.Color } colorVal 高亮的颜色
   *
   */
  setHighlightByFeature(
    isHightLight: (feature) => boolean,
    colorVal?: (feature) => Cesium.Color | void
  ): void {
    const primitives = this._viewer.scene.primitives;
    this.config.buildings.forEach((t) => {
      const target = primitives.get(t.index);
      target.style = new Cesium.Cesium3DTileStyle({
        color: {
          evaluateColor: (feature, result) => {
            return isHightLight(feature)
              ? Cesium.Color.clone(
                  (colorVal && colorVal(feature)) || Cesium.Color.RED,
                  result
                )
              : Cesium.Color.clone(Cesium.Color.WHITE, result);
          }
        }
      });
      target.colorBlendMode = Cesium.Cesium3DTileColorBlendMode.REPLACE;
    });
  }

  /**
   * 清除高亮显示
   */
  clearHightlight(): void {
    const primitives = this._viewer.scene.primitives;

    this.config.buildings.forEach((t) => {
      const target = primitives.get(t.index);
      target.style = new Cesium.Cesium3DTileStyle();
    });
  }
}
