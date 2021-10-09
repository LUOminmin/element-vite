declare module 'smart3d' {
  import * as Cesium from '@smart/cesium'
  /**
 * 缓冲分析
<p>该依赖了turf类库，请在使用时正确引入turf类库，才能正确使用</p>
 * @param viewer - 视图实例
 * @param [options.radius = 10] - 缓冲半径，单位米（m）
 * @param [options.color = Color.fromAlpha(Color.AQUA, 0.4)] - 缓冲区填充颜色
 * @param [options.clampToGround = true] - 是否贴地分析
 */
  export class BufferAnalysis {
      constructor(
      viewer: Viewer,
      options: {
        radius?: number;
        color?: Cesium.Color;
        clampToGround?: boolean;
      }
    );
    /**
     * 绘制图元集合
     */
    bufferLayer: Cesium.PrimitiveCollection;
    /**
     * 缓冲区实体集合
     */
    bufferResult: Cesium.DataSource[];
    /**
     * 点绘制处理对象类
     */
    readonly pointHandler: DrawHandler;
    /**
     * 线绘制处理对象类
     */
    readonly lineHandler: DrawHandler;
    /**
     * 面绘制处理对象类
     */
    readonly polygonHandler: DrawHandler;
    /**
     * 缓冲半径
     */
    radius: number;
    /**
     * 点缓冲分析
     * @param radius - 缓冲半径,单位米
     */
    pointBuffer(radius: number): void;
    /**
     * 线缓冲分析
     * @param radius - 缓冲半径,单位米
     */
    lineBuffer(radius: number): void;
    /**
     * 面缓冲分析
     * @param radius - 缓冲半径,单位米
     */
    polygonBuffer(radius: number): void;
    /**
     * 清除
     */
    clear(): void;
    /**
     * 销毁
     */
    destroy(): void;
  }

  /**
   * 贴地淹没分析类
   * @param viewer - 视图对象
   */
  export class ClampFlood {
      constructor(viewer: Viewer);
    /**
     * 淹没变化监听事件
     */
    readonly onChange: Cesium.Event;
    /**
     * 淹没完成监听事件
     */
    readonly onFinish: Cesium.Event;
    /**
     * 是否暂停状态
     */
    readonly isPause: boolean;
    /**
     * 当前的淹没高度
     */
    readonly height: number;
    /**
     * 通过点集合添加淹没效果
     * @param positions - 水淹边界点
     * @param [options.height] - 起始高程（米），如果未定义，则使用水淹边界范围内的地形最低点
     * @param [options.color = #41abfc94] - 水面颜色
     * @param [options.classificationType = Cesium.ClassificationType.BOTH] - 水面的贴地类型
     */
    addPoistionToFlood(
      positions: Cesium.Cartesian3[],
      options?: {
        height?: number;
        color?: string;
        classificationType?: Cesium.ClassificationType;
      }
    ): void;
    /**
     * 通过速度淹没，开始 / 重新开始
     * @param [speed = 10] - 速度（米/秒）
     * @param [options.height] - 初始高度（米），如果未定义，则使用创建水淹分析时定义的高度
     * @param [options.maxHeight = 100] - 水面最大抬升高度（米）
     * @param [options.frequency = 20] - 频率（次/秒），频率调整可以让淹没效果更加柔和，但设置频率不能太高会影响刷新率
     */
    start(
      speed?: number,
      options?: {
        height?: number;
        maxHeight?: number;
        frequency?: number;
      }
    ): void;
    /**
     * 通过步长淹没，开始 / 重新开始
     * @param [step = 2] - 上升的步长（米/次），频率的每次上升的步长（高度）
     * @param [options.height] - 初始高度（米），如果未定义，则使用创建水淹分析时定义的高度
     * @param [options.maxHeight = 100] - 水面最大抬升高度（米）
     * @param [options.frequency = 20] - 频率（次/秒），频率调整可以让淹没效果更加柔和，但设置频率不能太高会影响刷新率
     */
    startByStep(
      step?: number,
      options?: {
        height?: number;
        maxHeight?: number;
        frequency?: number;
      }
    ): void;
    /**
     * 水面高度更新
     * @param raiseHeight - 水面抬升高度（米）
     */
    updated(raiseHeight: number): void;
    /**
     * 清除淹没分析结果
     */
    clear(): void;
    /**
     * 暂停
     */
    pause(): void;
    /**
     * 继续
     */
    continue(): void;
    /**
     * 停止
     * @param [reset = false] - 是否回到初始
     */
    stop(reset?: boolean): void;
    /**
     * 销毁
     */
    destroy(): void;
  }

  /**
 * 填挖方量分析
 * @example
 * var cutOrFill = new smart3d.CutOrFill(viewer,{
  showTin : true,
  datumHeight : 15
})
 * @param viewer - 场景实例
 * @param [options.datumHeight = 0] - 基准面高度
 * @param [options.boundary = []] - 指定填挖方分析的边界范围
 * @param [options.showTin = false] - 是否显示在边界范围内的三角网
 * @param [options.showLabel = true] - 是否以label对象在场景中显示计算结果
 * @param [options.realTimeRefresh = false] - 是否开启填挖方结果根据地形瓦片的刷新状态实时更新显示结果
 * @param [options.resultPanelStyle] - 设置分析结果面板的显示样式
 * @param [options.resultPanelStyle.font] - 分析结果面板的字体
 * @param [options.resultPanelStyle.showBackground] - 分析结果面板是否显示背景
 * @param [options.resultPanelStyle.backgroundColor] - 分析结果面板的背景色
 * @param [options.resultPanelStyle.verticalOrigin] - 分析结果面板字体的垂直对齐
 * @param [options.resultPanelStyle.horizontalOrigin] - 分析结果面板字体的水平对齐
 * @param [options.tinStyle] - 设置分析结果中TIN的显示样式
 * @param [options.tinStyle.attributes] - TIN的{@link GeometryInstance#attributes}属性
 * @param [options.tinStyle.appearance] - TIN的几何外观{@link Primitive#appearance}属性
 * @param [options.tinStyle.depthFailAppearance] - TIN的深度几何外观{@link Primitive#depthFailAppearance}属性
 * @param [options.wallStyle] - 设置分析结果中边界墙体的显示样式
 * @param [options.wallStyle.attributes] - 边界墙体的{@link GeometryInstance#attributes}属性
 * @param [options.wallStyle.appearance] - 边界墙体的几何外观{@link Primitive#appearance}属性
 * @param [options.wallStyle.depthFailAppearance] - 边界墙体的深度几何外观{@link Primitive#depthFailAppearance}属性
 * @param [options.wallLineStyle] - 设置分析结果中边界墙轮廓的显示样式
 * @param [options.wallLineStyle.attributes] - 边界墙轮廓的{@link GeometryInstance#attributes}属性
 * @param [options.wallLineStyle.appearance] - 边界墙轮廓的几何外观{@link Primitive#appearance}属性
 * @param [options.wallLineStyle.depthFailAppearance] - 边界墙轮廓的深度几何外观{@link Primitive#depthFailAppearance}属性
 * @param [options.datumPlaneStyle] - 设置分析结果中基准面的显示样式
 * @param [options.datumPlaneStyle.attributes] - 基准面的{@link GeometryInstance#attributes}属性
 * @param [options.datumPlaneStyle.appearance] - 基准面的几何外观{@link Primitive#appearance}属性
 * @param [options.datumPlaneStyle.depthFailAppearance] - 基准面的深度几何外观{@link Primitive#depthFailAppearance}属性
 */
  export class CutOrFill {
      constructor(
      viewer: Viewer,
      options?: {
        datumHeight?: number;
        boundary?: number;
        showTin?: number;
        showLabel?: number;
        realTimeRefresh?: number;
        resultPanelStyle?: {
          font?: string;
          showBackground?: boolean;
          backgroundColor?: Cesium.Color;
          verticalOrigin?: Cesium.VerticalOrigin;
          horizontalOrigin?: Cesium.HorizontalOrigin;
        };
        tinStyle?: {
          attributes?: any;
          appearance?: Cesium.Appearance;
          depthFailAppearance?: Cesium.Appearance;
        };
        wallStyle?: {
          attributes?: any;
          appearance?: Cesium.Appearance;
          depthFailAppearance?: Cesium.Appearance;
        };
        wallLineStyle?: {
          attributes?: any;
          appearance?: Cesium.Appearance;
          depthFailAppearance?: Cesium.Appearance;
        };
        datumPlaneStyle?: {
          attributes?: any;
          appearance?: Cesium.Appearance;
          depthFailAppearance?: Cesium.Appearance;
        };
      }
    );
    /**
     * 绘制控件,用于绘制填挖方分析的边界范围
     */
    readonly drawHandler: DrawHandler;
    /**
     * 获取或设置分析结果中边界墙轮廓的显示样式,包含<br>
    attributes 边界墙轮廓的{@link GeometryInstance#attributes}属性<br>
    appearance 边界墙轮廓的几何外观{@link Primitive#appearance}属性<br>
    depthFailAppearance 边界墙轮廓的深度几何外观{@link Primitive#depthFailAppearance}属性
     */
    wallLineStyle: any;
    /**
     * 获取或设置分析结果中边界墙的显示样式,包含<br>
    attributes 边界墙体的{@link GeometryInstance#attributes}属性<br>
    appearance 边界墙体的几何外观{@link Primitive#appearance}属性<br>
    depthFailAppearance 边界墙体的深度几何外观{@link Primitive#depthFailAppearance}属性
     */
    wallStyle: any;
    /**
     * 获取或设置分析结果中TIN的显示样式,包含<br>
    attributes TIN的{@link GeometryInstance#attributes}属性<br>
    appearance TIN的几何外观{@link Primitive#appearance}属性<br>
    depthFailAppearance TIN的深度几何外观{@link Primitive#depthFailAppearance}属性
     */
    tinStyle: any;
    /**
     * 获取或设置分析结果中基准平面的显示样式,包含<br>
    attributes TIN的{@link GeometryInstance#attributes}属性<br>
    appearance TIN的几何外观{@link Primitive#appearance}属性<br>
    depthFailAppearance TIN的深度几何外观{@link Primitive#depthFailAppearance}属性
     */
    datumPlaneStyle: any;
    /**
     * 获取或设置分析结果中基准平面的显示样式,包含<br>
    attributes TIN的{@link GeometryInstance#attributes}属性<br>
    appearance TIN的几何外观{@link Primitive#appearance}属性<br>
    depthFailAppearance TIN的深度几何外观{@link Primitive#depthFailAppearance}属性
     */
    resultPanelStyle: any;
    /**
     * 该控件的计算结果更新后触发的事件,传递给监听器对象包含三个属性：
    <p>result：此次填挖方更新的计算结果</p>
    <p>datumHeight：此次计算的基准面高度</p>
    <p>center: 此次计算的label中心点位置</p>
     * @example
     * cutOrFill.updated.addEventListener(function({ result, datumHeight, center}) {
      console.log({ result, datumHeight, center});
    });
     */
    readonly updated: Cesium.Event;
    /**
     * 获取或设置填挖方分析的边界范围
     */
    boundary: Cesium.Cartesian3[];
    /**
     * 获取或更新填挖方分析的基准高度
     */
    datumHeight: number;
    /**
     * 获取或设置三角网的显示状态
     */
    showTin: boolean;
    /**
     * 开启或者关闭填挖方结果根据地形瓦片的刷新状态实时更新显示结果
     */
    realTimeRefresh: boolean;
    /**
     * 开启或关闭以label对象在场景中显示计算结果
     */
    showLabel: boolean;
    /**
     * 绘制填挖方分析边界,并在三维场景中显示分析结果
     */
    drawBoundary(): void;
    /**
     * 根据基准高度和传入的边界范围计算范围内的填方体积,依赖{@link GeometryCalculation.getTilesTinByBoundary}
     * @param [boundary] - 传入指定的边界范围,如果为空则使用默认边界值,反之则使用传入值
     * @returns 以立方米为单位的填方体积
     */
    getAmountOfFill(boundary?: Cesium.Cartesian3[]): number;
    /**
     * 根据基准高度和传入的边界范围计算范围内的挖方体积,依赖{@link GeometryCalculation.getTilesTinByBoundary}
     * @param [boundary] - 传入指定的边界范围,如果为空则使用默认边界值,反之则使用传入值
     * @returns 以立方米为单位的挖方体积
     */
    getAmountOfExcavation(boundary?: Cesium.Cartesian3[]): number;
    /**
     * 根据基准高度和传入的边界范围计算范围内的被横截面截取的三角网的横截面积,依赖{@link GeometryCalculation.getTilesTinByBoundary}
     * @param [boundary] - 传入指定的边界范围,如果为空则使用默认边界值,反之则使用传入值
     * @returns 以平方米为单位的三角网与基准面相交的横截面积
     */
    getCrossSectionalArea(boundary?: Cesium.Cartesian3[]): number;
    /**
     * 根据传入的边界范围计算该范围所有三角网的表面积,依赖{@link GeometryCalculation.getTilesTinByBoundary}
     * @param [boundary] - 传入指定的边界范围,如果为空则使用默认边界值,反之则使用传入值
     * @returns 以平方米为单位的三角网的表面积
     */
    getTilesTinArea(boundary?: Cesium.Cartesian3[]): number;
    /**
     * 根据基准高度和传入的边界范围计算范围内的被基准面截取的三角网的填挖方量,表面积和横截面积,其中的挖方体积\填方体积均为单独对该区域进行挖\填方的体积,不是两者相加的结果
     * @param [boundary] - 传入指定的边界范围,如果为空则使用默认边界值,反之则使用传入值
     * @returns 返回格式为{ tinsArea: Number, amountOfFill: Number, amountOfExcavation: Number, crossSectionalArea: Number}的填挖方分析结果
     */
    getResult(boundary?: Cesium.Cartesian3[]): any;
    /**
     * 以三角网的形式显示边界范围所有的TIN数据,依赖{@link GeometryCalculation.getTilesTinByBoundary}
     * @param [boundary] - 传入指定的边界范围,如果为空则使用默认边界值,反之则使用传入值
     */
    displayTinByBoundary(boundary?: Cesium.Cartesian3[]): void;
    /**
     * 显示分析结果,根据{@link CutOrFill#getResult}返回的结果显示在三维场景中,默认保留两位小数,并根据数值大小自适应单位,依赖{@link GeometryCalculation.getTilesTinByBoundary}
     * @param [boundary] - 传入指定的边界范围,如果为空则使用默认边界值,反之则使用传入值
     */
    displayResult(boundary?: Cesium.Cartesian3[]): void;
    /**
     * 清除绘制结果
     */
    clear(): void;
    /**
     * 销毁该对象
     */
    destroy(): void;
  }

  /**
 * 倾斜压平: 对Cesium3DTileset类型图层的b3dm数据进行单个闭合区域进行高程压平
 * @example
 * var tileset1 = viewer.scene.primitives.add(new Cesium.3DTileset({url: './tileset1.json'}));
var tileset2 = viewer.scene.primitives.add(new Cesium.3DTileset({url: './tileset2.json'}));
var flatting = new smart3d.Flatting(viewer, {layers: [tileset1, tileset2]});
 * @param viewer - 场景实例
 * @param [options.layers] - 待压平的图层集
 * @param [options.mappingLevel = 3] - 压平高度映射阶数（[0, 10^mappingLevel]）,为0时比较容易出现闪面的问题
 */
  export class Flatting {
      constructor(
      viewer: Viewer,
      options?: {
        layers?: Cesium.Cesium3DTileset[];
        mappingLevel?: number;
      }
    );
    /**
     * 待压平的图层集
     */
    layers: Cesium.Cesium3DTileset[];
    /**
     * 绘制对象
     */
    drawHandler: DrawHandler | undefined;
    /**
     * 开始倾斜压平
     * @example
     * flatting.start(height);
     * @param height - 压平面的相对地面（压平范围轮廓顶点中最低点所在水平面）高度
     */
    start(height: number): void;
    /**
     * 更新压平面的相对地面（压平范围轮廓顶点中最低点所在水平面）高度
     * @param height - 压平面（相对地面）高度
     */
    updateHeight(height: number): void;
    /**
     * 设置压平效果的可见性
     * @param visible - 是否开启压平效果
     */
    setVisibility(visible: boolean): void;
    /**
     * 清除压平效果
     */
    clear(): void;
    /**
     * 销毁压平类
     */
    destroy(): undefined;
  }

  /**
   * 淹没分析类
   * @param viewer - 视图对象
   */
  export class Flood {
      constructor(viewer: Viewer);
    /**
     * 淹没变化监听事件
     */
    readonly onChange: Cesium.Event;
    /**
     * 淹没完成监听事件
     */
    readonly onFinish: Cesium.Event;
    /**
     * 是否暂停状态
     */
    readonly isPause: boolean;
    /**
     * 添加对 entity 淹没分析
     * @param entity - 实体
     * @param [options.height = 0] - 初始淹没高程
     */
    addEntity(
      entity: Cesium.Entity,
      options?: {
        height?: number;
      }
    ): void;
    /**
     * 通过点集合添加 Primitive 绘制图元的淹没效果
     * @param positions - 画图的位置
     * @param [options.maxheight] - 最大高度值
     * @param [options.primitive] - 图元基元Primitive的options属性，默认使用cesium水面图元
     */
    addPoistionToPrimitive(
      positions: Cesium.Cartesian3[],
      options?: {
        maxheight?: number;
        primitive?: any;
      }
    ): void;
    /**
     * 通过速度淹没，开始 / 重新开始
     * @param [speed = 10] - 速度（米/秒）
     * @param [options.height] - 初始高度（米）
     * @param [options.maxHeight = 100] - 最大高度（米），只有在entity下作用
     * @param [options.frequency = 20] - 频率（次/秒），频率调整可以让淹没效果更加柔和，但设置频率不能太高会影响刷新率
     * @param [waterwaveOptions.normalMap] - 水正常扰动的法线图
     * @param [waterwaveOptions.frequency = 8000.0] - 水波数的数值
     * @param [waterwaveOptions.animationSpeed = 0.03] - 水的动画速度的数值
     * @param [waterwaveOptions.amplitude = 5.0] - 水波振幅的数值
     * @param [waterwaveOptions.specularIntensity = 0.8] - 镜面反射强度的数值
     * @param [waterwaveOptions.baseWaterColor = #123e59ff] - 水的颜色对象基础颜色
     * @param [waterwaveOptions.blendColor = #123e59ff] - 混合到非水域时使用的rgba颜色对象
     */
    start(
      speed?: number,
      options?: {
        height?: number;
        maxHeight?: number;
        frequency?: number;
      },
      waterwaveOptions?: {
        normalMap?: string;
        frequency?: number;
        animationSpeed?: number;
        amplitude?: number;
        specularIntensity?: number;
        baseWaterColor?: string;
        blendColor?: string;
      }
    ): void;
    /**
     * 通过步长淹没，开始 / 重新开始
     * @param [step = 2] - 上升的步长（米/次），频率的每次上升的步长（高度）
     * @param [options.height] - 初始高度（米）
     * @param [options.maxHeight = 100] - 最大高度（米），只有在entity下作用
     * @param [options.frequency = 20] - 频率（次/秒），频率调整可以让淹没效果更加柔和，但设置频率不能太高会影响刷新率
     * @param [waterwaveOptions.normalMap] - 水正常扰动的法线图
     * @param [waterwaveOptions.frequency = 8000.0] - 水波数的数值
     * @param [waterwaveOptions.animationSpeed = 0.03] - 水的动画速度的数值
     * @param [waterwaveOptions.amplitude = 5.0] - 水波振幅的数值
     * @param [waterwaveOptions.specularIntensity = 0.8] - 镜面反射强度的数值
     * @param [waterwaveOptions.baseWaterColor = #123e59ff] - 水的颜色对象基础颜色
     * @param [waterwaveOptions.blendColor = #123e59ff] - 混合到非水域时使用的rgba颜色对象
     */
    startByStep(
      step?: number,
      options?: {
        height?: number;
        maxHeight?: number;
        frequency?: number;
      },
      waterwaveOptions?: {
        normalMap?: string;
        frequency?: number;
        animationSpeed?: number;
        amplitude?: number;
        specularIntensity?: number;
        baseWaterColor?: string;
        blendColor?: string;
      }
    ): void;
    /**
     * 水面高度更新
     * @param raiseHeight - 当前水位上升的高度
     */
    updated(raiseHeight: number): void;
    /**
     * 暂停
     */
    pause(): void;
    /**
     * 继续
     */
    continue(): void;
    /**
     * 停止
     * @param reset - 是否回到初始
     */
    stop(reset: boolean): void;
    /**
     * 清除淹没分析结果
     */
    clear(): void;
    /**
     * 销毁
     */
    destroy(): void;
  }

  /**
 * 热力图实例对象
 * @example
 * var heatmapInstance = new smart3d.GroundHeatmapInstance({
  scene,
  h337,
});
heatmapInstance.setDataInWGS84Degrees([{x: 113.41698220810316, y: 23.18151025848034, value: 2}, {x: 113.41686757094382, y: 23.181559969508296, value: 4},{x: 113.41680404703881, y: 23.181607843006617, value: 5}])
 * @param options.scene - 场景实例
 * @param options.h337 - 热力图绘制类如:  {@link https://github.com/pa7/heatmap.js}
 * @param [options.range] - 热力图经纬度范围,未设置则从热力数据中计算获取
 * @param [options.classificationType = Cesium.ClassificationType.BOTH] - 热力图图元贴地类型
 * @param [options.heatmapConfigure] - 热力图对象参数
 * @param [options.heatmapConfigure.gradient = { 0: 'rgba(0, 0, 255, 0)', 0.1: 'royalblue', 0.3: 'cyan', 0.5: 'lime',  0.7: 'yellow', 1.0: 'red'}] - 颜色渐变对象，{number string[0, 1]: color string}, 详情参考<a href="../examples/assets/heatmapData.json" target="_blank">heatmapData.json</a>文件中的colorTables
 * @param [options.heatmapConfigure.blur = 0.85] - 热力点模糊度
 * @param [options.heatmapConfigure.minOpacity = 0] - 最小不透明度
 * @param [options.heatmapConfigure.maxOpacity = 0.8] - 最大不透明度
 * @param [options.heatmapConfigure.minCanvasSize = 700] - 最小画布大小/像素
 * @param [options.heatmapConfigure.maxCanvasSize = 2000] - 最大画布大小/像素
 * @param [options.heatmapConfigure.minLevel] - 最小热力层级，未设置则默认为热力点数据中最小的value
 * @param [options.heatmapConfigure.maxLevel] - 最大热力层级，未设置则默认为热力点数据中最大的value
 * @param [options.heatmapConfigure.radius] - 热力点半径/像素
 * @param [options.heatmapConfigure.radiusFactor = 60] - 半径因子； radius未设置时，radius =  max(width / radiusFactor, height / radiusFactor)
 * @param [options.heatmapConfigure.spacingFactor = 1.5] - 边界周边的空隙 = radius * spacingFactor
 */
  export class GroundHeatmapInstance {
      constructor(options: {
      scene: any;
      h337: any;
      range?: Cesium.Rectangle;
      classificationType?: Cesium.ClassificationType;
      heatmapConfigure?: {
        gradient?: any;
        blur?: number;
        minOpacity?: number;
        maxOpacity?: number;
        minCanvasSize?: number;
        maxCanvasSize?: number;
        minLevel?: number;
        maxLevel?: number;
        radius?: number;
        radiusFactor?: number;
        spacingFactor?: number;
      };
    });
    /**
     * 更新热力图图元
     * @param canvas - 热力图画布
     * @param [rectangle] - 热力图经纬度范围
     */
      update(canvas: HTMLCanvasElement, rectangle?: Cesium.Rectangle): void;
      /**
     * 重新设置热力数据（WGS84坐标/度）
     * @param data - 热力坐标集 {x: DegreesNumber, y: DegreesNumber, value: Number} [] （x、y分别为WGS84下的经度和纬度坐标/度，value为热力层级）参考<a href="../examples/assets/heatmapData.json" target="_blank">heatmapData.json</a>文件
     * @param [minLevel] - 热力最小层级
     * @param [maxLevel] - 热力最大层级
     * @returns true when the operation is successful, otherwaise be failure!
     */
      setDataInWGS84Degrees(
      data: object[],
      minLevel?: number,
      maxLevel?: number
    ): boolean;
    /**
     * 追加新的热力数据（WGS84坐标/度）
     * @param data - 热力坐标集 {x: DegreesNumber, y: DegreesNumber, value: Number} [] （x、y分别为WGS84下的经度和纬度坐标/度，value为热力层级）参考<a href="../examples/assets/heatmapData.json" target="_blank">heatmapData.json</a>文件
     * @returns true when the operation is successful, otherwaise be failure!
     */
      addDataInWGS84Degrees(data: object[]): boolean;
      /**
     * 重新设置热力数据（WGS84坐标/弧度）
     * @param data - 热力坐标集 {x: RadiansNumber, y: RadiansNumber, value: Number} []（x、y分别为WGS84下的经度和纬度坐标/弧度，value为热力层级）参考<a href="../examples/assets/heatmapData.json" target="_blank">heatmapData.json</a>文件
     * @param [minLevel] - 热力最小层级
     * @param [maxLevel] - 热力最大层级
     * @returns true when the operation is successful,otherwaise be failure!
     */
      setDataInWGS84Radians(
      data: object[],
      minLevel?: number,
      maxLevel?: number
    ): boolean;
    /**
     * 追加新的热力数据(WGS84坐标/弧度)
     * @param data - 热力坐标集 {x: RadiansNumber, y: RadiansNumber, value: Number} [] （x、y分别为WGS84下的经度和纬度坐标/弧度，value为热力层级）参考<a href="../examples/assets/heatmapData.json" target="_blank">heatmapData.json</a>文件
     * @returns true when the operation is successful, otherwaise be failure!
     */
      addDataInWGS84Radians(data: object[]): boolean;
    /**
     * 热力图绘制类对象，可调用其本身方法更新热力图如 {@link https://www.patrick-wied.at/static/heatmapjs/docs.html}中API
     */
    readonly heatmap: any;
    /**
     * 热力图贴地类型
     */
    classificationType: Cesium.ClassificationType;
    /**
     * 热力模糊度, 取值范围：[0, 1]
     */
    blur: number;
    /**
     * 最大透明度, 取值范围：[0, 1]
     */
    maxOpacity: number;
    /**
     * 最小透明度, 取值范围：[0, 1]
     */
    minOpacity: number;
    /**
     * 热力点半径,单位为像素
     */
    radius: number;
    /**
     * 半径因子, radius未undefined时，radius=  max(width / radiusFactor, height / radiusFactor)
     */
    readonly radiusFactor: number;
    /**
     * 边界周边的空隙, 四角扩充宽度 = radius * spacingFactor
     */
    spacingFactor: number;
    /**
     * 更新热力图地理范围
     */
    updateRange(range: Cesium.Rectangle): void;
    /**
     * 销毁热力图实例对象
     */
    destroy(): undefined;
  }

  /**
 * 控高分析:根据输入的绝对高度值
 * @example
 * const heightLimite = new smart3d.HeightLimite(viewer);
heightLimite.drawBoundary();

const heightLimite = new smart3d.HeightLimite(viewer, {
 height: 50,
 limiteType: smart3d.HeightLimiteType.BOTH,
 mode: smart3d.HeightLimiteMode.BOTH,
 boundary: [
   new Cesium.Cartesian3(-2331269.2883736785, 5383101.423528141, 2495284.79014397),
   new Cesium.Cartesian3(-2331394.0187320034, 5383018.6632530615, 2495329.1844820864),
   new Cesium.Cartesian3(-2331476.6058333945, 5383025.579487798, 2495234.8478120524),
   new Cesium.Cartesian3(-2331476.1109130206, 5383080.101884065, 2495137.0693991454),
   new Cesium.Cartesian3(-2331355.2583124335, 5383163.3249380905, 2495033.832360025),
   new Cesium.Cartesian3(-2331270.4245569664, 5383207.617027416, 2495060.500761639),
   new Cesium.Cartesian3(-2331194.407152505, 5383185.580435197, 2495152.735084137),
   new Cesium.Cartesian3(-2331272.0328534953, 5383125.184354249, 2495224.5451847212),
   new Cesium.Cartesian3(-2331269.2883736785, 5383101.423528141, 2495284.79014397)]
});
 * @param viewer - 场景实例
 * @param [options.boundary = []] - 控高分析的边界值，如果不传则需要调用{@link HeightLimite#drawBoundary}进行绘制
 * @param [options.limiteType = smart3d.HeightLimiteType.MODELS] - 控高分析计算类型，支持分析地形、模型或两者同时分析
 * @param [options.mode = smart3d.HeightLimiteMode.OUTSIDE] - 控高分析结果显示的样式
 * @param [options.height = 30] - 控高分析的高度值，该值为相对于海平面的绝对高程
 * @param [options.boundaryOutlineColor = Cesium.Color.BLACK] - 控高分析结果的平面的边界线颜色
 * @param [options.boundaryPolygonColor = Cesium.Color.ORANGE.withAlpha(0.5)] - 控高分析结果的平面填充颜色
 * @param [options.outSideColor = Cesium.Color.RED.withAlpha(0.5)] - 3dtiles在控高高度上方的模型显示的颜色，该值同时受limiteType、mode的影响
 * @param [options.inSideColor = Cesium.Color.GREEN.withAlpha(0.5)] - 3dtiles在控高高度下方的模型显示的颜色，该值同时受limiteType、mode的影响
 */
  export class HeightLimite {
      constructor(
      viewer: Viewer,
      options?: {
        boundary?: Cesium.Cartesian3[];
        limiteType?: HeightLimiteType;
        mode?: HeightLimiteMode;
        height?: number;
        boundaryOutlineColor?: Cesium.Color;
        boundaryPolygonColor?: Cesium.Color;
        outSideColor?: Cesium.Color;
        inSideColor?: Cesium.Color;
      }
    );
    /**
     * 绘制对象
     */
    drawHandler: DrawHandler;
    /**
     * 控高分析的边界值
     */
    boundary: Cesium.Cartesian3[];
    /**
     * 获取或者设置控高分析结果显示的样式
     */
    mode: HeightLimiteMode;
    /**
     * 获取或者设置控高分析计算类型
     */
    limiteType: HeightLimiteType;
    /**
     * 获取或者设置3dtiles在控高高度上方的模型显示的颜色，该值同时受limiteType、mode的影响
     */
    outSideColor: Cesium.Color;
    /**
     * 获取或者设置3dtiles在控高高度下方的模型显示的颜色，该值同时受limiteType、mode的影响
     */
    inSideColor: Cesium.Color;
    /**
     * 获取或者控高分析的高度值，该值为相对于海平面的绝对高程
     */
    height: number;
    /**
     * 获取或者设置控高分析结果的平面填充颜色
     */
    boundaryPolygonColor: Cesium.Color;
    /**
     * 获取或者设置控高分析结果的平面的边界线颜色
     */
    boundaryOutlineColor: Cesium.Color;
    /**
     * 绘制控高平面，并生成分析结果
     */
    drawBoundary(): void;
    /**
     * 清除绘制的控高平面和控高分析结果
     */
    clear(): void;
    /**
     * 销毁控高分析类
     */
    destroy(): void;
  }

  /**
   * 3dtiles模型控高分析结果的渲染的模式
   */
  const enum HeightLimiteMode {
    /**
     * 将模型高于标准值的部分使用outside的样式进行渲染.
     */
    OUTSIDE = 0,
    /**
     * 将模型低于标准值的部分使用outside的样式进行渲染.
     */
    INSIDE = 1,
    /**
     * 模型低于标准值的部分使用inside的样式,高于标准值的部分使用outside的样式进行渲染.
     */
    BOTH = 2
  }

  /**
   * 3dtiles模型控高分析计算类型
   */
  const enum HeightLimiteType {
    /**
     * 只计算地形高度.
     */
    TERRAIN = 0,
    /**
     * 只计算模型高度.
     */
    MODELS = 1,
    /**
     * 同时计算地形和模型高度.
     */
    BOTH = 2
  }

  /**
 * <p>剖面分析，轮廓分析</p>
<em>需要开启深度拾取，计算才正确 viewer.scene.globe.depthTestAgainstTerrain = true;</em>
 * @example
 * var profile = new smart3d.Profile(viewer);
profile.start();
 * @param viewer - 场景实例
 */
  export class Profile {
      constructor(viewer: Viewer);
    /**
     * 计算剖面点结果监听事件
     * @example
     * profile.computedEvent.addEventListener(function(result) {
     // 返回结果数组
    });
     */
    readonly computedEvent: Cesium.Event;
    /**
     * 绘制结束的事件
     * @example
     * profile.drawEndEvent.addEventListener(function() {
    });
     */
    readonly drawEndEvent: Cesium.Event;
    /**
     * 开始
     * @param [step = 1] - 计算间隔长度，单位米
     */
    start(step?: number): void;
    /**
     * 改变间隔长度
     * @param [step] - 计算间隔长度，单位米
     */
    setStep(step?: number): void;
    /**
     * 清除
     */
    clear(): void;
    /**
     * 销毁
     */
    destroy(): void;
  }

  /**
   * 卷帘对比
   * @example
   * var terrainClip = new smart3d.TerrainClip(viewer);
   * @param viewer - 场景实例
   * @param [options.leftLayers] - 左边显示的图层数据
   * @param [options.rightLayers] - 右边显示的图层数据
   * @param [options.sliderName] - 分割线id名
   */
  export class Rollblind {
      constructor(
      viewer: Viewer,
      options?: {
        leftLayers?: Cesium.Cesium3DTileset[];
        rightLayers?: Cesium.Cesium3DTileset[];
        sliderName?: string;
      }
    );
    /**
     * 销毁
     */
      destroy(): void;
  }

  /**
 * 通视分析
 * @example
 * var sightLine = new smart3d.SightLine(scene, startPoint, endPoint);
sightLine.build();
 * @param scene - 场景实例
 * @param startPoint - 开始点
 * @param endPoint - 结束点
 */
  export class SightLine {
      constructor(
      scene: Cesium.Scene,
      startPoint: Cesium.Cartesian3,
      endPoint: Cesium.Cartesian3
    );
    /**
     * 线条宽度
     */
    lineWidth: number;
    /**
     * 可见部分颜色
     */
    visibleColor: Cesium.Color;
    /**
     * 不可见部分颜色
     */
    invisibleColor: Cesium.Color;
    /**
     * 绘制的图元集合
     */
    readonly primitives: Cesium.PrimitiveCollection;
    /**
     * 构建通视分析
     */
    build(): void;
    /**
     * 获取交点
     * @returns 返回交点cartesian3坐标或者null，null就是代表可视
     */
    getIntersection(): Cesium.Cartesian3;
    /**
     * 清除绘制结果
     */
    clear(): void;
    /**
     * 销毁
     */
    destroy(): void;
  }

  /**
   * 天际线分析类
   * @example
   * var skyLine = new smart3d.Skyline(viewer);
   * @param viewer - 视图
   * @param [options.width = 2] - 天际线宽度
   * @param [options.lineColor = Color.RED] - 边际线颜色
   * @param [options.strokeType = Cartesian3(1, 0, 0)] - 物体描边类型
   * @param [options.strokeColor = Color(0.0, 0.0, 1.0)] - 物体描边颜色
   * @param [options.strokeDis = 50] - 物体描边距离，单位米
   */
  export class Skyline {
      constructor(
      viewer: Viewer,
      options?: {
        width?: number;
        lineColor?: Cesium.Color;
        strokeType?: Cesium.Cartesian3;
        strokeColor?: Cesium.Color;
        strokeDis?: number;
      }
    );
    /**
     * 销毁
     */
      destroy(): void;
  }

  /**
 * 坡度坡向分析
 * @example
 * // 1. 直接创建SlopeAspect对象
var slopeAspect = new smart3d.SlopeAspect(viewer);

// 2. 根据需要传入可选参数
var slopeAspect = new smart3d.SlopeAspect(viewer,{
    mode: smart3d.SlopeAspectDisplayMode.ASPECT
});
 * @param viewer - 场景实例
 * @param [options.mode = smart3d.SlopeAspectDisplayMode.ASPECT] - 指定坡度坡向分析结果的显示模式
 * @param [options.boundary = []] - 指定坡度坡向分析的边界范围
 * @param [options.transparency = 1.0] - 指定坡度坡向图的透明度
 * @param [options.arrowSize = 10] - 指定显示的坡向的箭头的大小
 * @param [options.lineWidth = 20] - 指定显示的坡向的箭头的线宽
 * @param [options.gradient] - 指定坡度坡向分析色带的参数,其类型为{value: Number in [0, 1], color: CssColorString}[]
 */
  export class SlopeAspect {
      constructor(
      viewer: Viewer,
      options?: {
        mode?: SlopeAspectDisplayMode;
        boundary?: Cesium.Cartesian3[];
        transparency?: number;
        arrowSize?: number;
        lineWidth?: number;
        gradient?: object[];
      }
    );
    /**
     * 绘制控件,用于绘制坡度坡向分析的边界范围
     */
    readonly drawHandler: DrawHandler;
    /**
     * 用于显示的坡向的箭头的大小
     */
    arrowSize: number;
    /**
     * 用于显示的坡向的箭头的线宽
     */
    lineWidth: number;
    /**
     * 返回用于显示的坡度图的canvas色带
     */
    readonly ramp: any;
    /**
     * 用于绘制范围内坡度坡向分析结果的显示模式
     */
    mode: SlopeAspectDisplayMode;
    /**
     * 获取或设置坡度坡向分析的边界范围
     */
    boundary: Cesium.Cartesian3[];
    /**
     * 开启或者关闭坡度坡向分析结果根据地形瓦片的刷新状态实时更新显示结果
     */
    realTimeRefresh: boolean;
    /**
     * 获取或设置坡度坡向分析色带的参数,其类型为{value: Number in [0, 1], color: CssColorString}[]
     */
    gradient: object[];
    /**
     * 获取或设置坡度坡向图的透明度
     */
    transparency: number;
    /**
     * 获取当前控件是否加载完成
     */
    readonly ready: boolean;
    /**
     * 根据传入的色带参数
     * @param [gradient] - 坡度坡向分析色带的参数,其类型为{value: Number in [0, 1], color: CssColorString}[]
     * @param [transparency] - 坡度坡向分析结果中的坡度坡向图的透明度
     * @returns 创建的canvas色带对象
     */
    createLinearGradient(gradient?: any, transparency?: any): any;
    /**
     * 绘制坡度坡向分析边界,并在三维场景中显示分析结果
     */
    drawBoundary(): void;
    /**
     * 根据传入的边界范围,计算该范围内每个三角网的坡向,并根据坡向生成代表方向的箭头
     * @param [boundary] - 传入首尾闭合边界范围,如果为空则使用默认边界值,反之则使用传入值
     */
    displaySlopeArrows(boundary?: Cesium.Cartesian3[]): void;
    /**
     * 在传入的边界范围根据设置的显示模式显示分析结果
     * @param [mode] - 分析结果显示模式,如果未传入则使用默认值,反之则使用传入值
     */
    displaySlopeRamp(mode?: SlopeAspectDisplayMode): void;
    /**
     * 清除绘制结果
     */
    clear(): void;
    /**
     * 销毁该对象
     */
    destroy(): void;
  }

  /**
   * 坡度坡向分析计算结果的显示模式
   */
  const enum SlopeAspectDisplayMode {
    /**
     * 不显示结果.
     */
    NONE = 0,
    /**
     * 只显示坡度图.
     */
    SLOPE = 1,
    /**
     * 只显示坡向图.
     */
    ASPECT = 2,
    /**
     * 只显示坡向箭头.
     */
    ARROW = 3,
    /**
     * 显示坡向图和坡向箭头.
     */
    ASPECTANDARROW = 4,
    /**
     * 显示坡度图和坡向箭头.
     */
    SLOPEANDARROW = 5
  }

  /**
 * 日照分析: 对Cesium3DTileset类型图层开启阴影效果
 * @example
 * var sunShineAnalysis = new smart3d.SunShineAnalysis(viewer, {
   startTime: Cesium.JulianDate.fromIso8601('2021-01-05T08:30:00'),
   stopTime: Cesium.JulianDate.fromIso8601('2021-01-05T17:30:00'),
});
sunShineAnalysis.start();
 * @param viewer - 场景实例
 * @param [options.startTime = JulianDate.fromIso8601('2021-01-05T08:30:00')] - （日照分析）开始时刻
 * @param [options.stopTime = JulianDate.fromIso8601('2021-01-05T17:30:00')] - （日照分析）终止时刻
 * @param [options.multiplier = 3600] - 时间流逝倍数
 * @param [options.clockRange = ClockRange.LOOP_STOP] - 循环模式
 * @param [options.softShadows = false] - 是否使用软阴影
 * @param [options.throughTransparentMaterial = false] - 阴影是否穿过透明材质
 * @param [options.transparencyTolerance = 0.8] - 阴影透明度阈值（透明度小于多少才会被阴影理解为“透明”）
 * @param [options.transparencyMinTolerance = 0.75] - 阴影透明度阈值（透明度小于多少才会被阴影理解为“透明”）
 */
  export class SunShineAnalysis {
      constructor(
      viewer: Viewer,
      options?: {
        startTime?: Cesium.JulianDate;
        stopTime?: Cesium.JulianDate;
        multiplier?: number;
        clockRange?: Cesium.ClockRange;
        softShadows?: boolean;
        throughTransparentMaterial?: boolean;
        transparencyTolerance?: number;
        transparencyMinTolerance?: number;
      }
    );
    /**
     * （日照分析）开始时刻
     */
    startTime: Cesium.JulianDate;
    /**
     * （日照分析）终止时刻
     */
    stopTime: Cesium.JulianDate;
    /**
     * 是否开启软阴影
     */
    softShadows: boolean;
    /**
     * 阴影是否能穿过透明材质
     */
    throughTransparentMaterial: boolean;
    /**
     * 阴影透明度阈值（透明度小于多少才会被阴影理解为“透明”）
     */
    transparencyTolerance: number;
    /**
     * 阴影透明度阈值（透明度小于多少才会被阴影理解为“透明”）
     */
    transparencyMinTolerance: number;
    /**
     * 更新日照分析的开始时刻
     * @param startTime - 开始时刻
     * @returns true if opertion is successful; otherwise, false.
     */
    updateStartTime(startTime: Cesium.JulianDate): boolean;
    /**
     * 更新日照分析的终止时刻
     * @param stopTime - 终止时刻
     * @returns true if opertion is successful; otherwise, false.
     */
    updateStopTime(stopTime: Cesium.JulianDate): boolean;
    /**
     * 更新日照分析的循环模式
     * @param clockRange - 循环模式
     */
    updateClockRange(clockRange: Cesium.ClockRange): void;
    /**
     * 更新日照分析的时间流逝倍数
     * @param multiplier - 倍数
     */
    updateMultiplier(multiplier: number): void;
    /**
     * 播放: 从头开始播放
     */
    start(): void;
    /**
     * 暂停或继续播放
     */
    pauseOrContinue(): void;
    /**
     * 销毁
     */
    destroy(): undefined;
  }

  /**
   * 地形开挖
   * @example
   * var terrainClip = new smart3d.TerrainClip(viewer);
   * @param viewer - 场景实例
   * @param [options.filterTileset] - 过滤不裁切tileset数据
   * @param [options.materialImage = assets/images/land.png] - 材质贴图，传入图片路径
   */
  export class TerrainClip {
      constructor(
      viewer: Viewer,
      options?: {
        filterTileset?: Cesium.Cesium3DTileset[];
        materialImage?: string;
      }
    );
    /**
     * 过滤不裁切tileset数据
     */
    filterTileset: Cesium.Cesium3DTileset[];
    /**
     * 开始地形开挖
     * @example
     * terrainClip.start(depth)
     * @param depth - 开挖深度
     */
    start(depth: number): void;
    /**
     * 更新开挖深度
     * @param depth - 开挖深度
     */
    updateDepth(depth: number): void;
    /**
     * 清除开挖
     */
    clear(): void;
    /**
     * 销毁开挖
     */
    destroy(): void;
  }

  /**
 * b3dm类型的建筑多种色渐变效果(暂不支持透明度)
 * @example
 * var tileset = viewer.scene.primitives.add(new Cesium.3DTileset({url: './tileset.json'}));
var tilesetColorGradient = new smart3d.TilesetColorGradient(tileset, {});
 * @param tileset - b3dm类型的Cesium3DTileset对象
 * @param options - 双色渐变相关属性
 * @param [options.show = true] - 是否开启渐变效果
 * @param [options.gradient = [{label: 0, value: '#007adf'}, {label: 1, value: '#00ecbc'}]] - 楼层渐变梯度  {label: Number in [0, 1], value: CssColorString}[]
 * @param [options.buildingHeight = 960] - 楼层高度
 * @param [options.breathRate = 0.1] - 渐变呼吸频率
 * @param [options.showRawLightEffct = false] - 是否显示建筑本身光照效果
 * @param [options.upAxis = Cesium.Axis.Z] - 建筑数据在模型空间中的高度轴向
 */
  export class TilesetColorGradient extends TilesetShaderUpdater {
      constructor(
      tileset: Cesium.Cesium3DTileset,
      options: {
        show?: boolean;
        gradient?: object[];
        buildingHeight?: number;
        breathRate?: number;
        showRawLightEffct?: boolean;
        upAxis?: boolean;
      }
    );
    /**
     * 楼层渐变颜色梯度 {label: Number in [0, 1], value: CssColorString}[]
     */
    gradient: object[];
    /**
     * 楼层高度
     */
    buildingHeight: number;
    /**
     * 渐变呼吸频率
     */
    breathRate: number;
    /**
     * 是否显示建筑本身光照效果
     */
    showRawLightEffct: boolean;
    /**
     * 建筑数据在模型空间中的高度轴向
     */
    upAxis: Cesium.Axis;
    /**
     * 销毁
     */
    destroy(): undefined;
    /**
     * 完整的自定义顶点着色器
     */
    customVertexShader: string;
    /**
     * 完整的自定义片源着色器
     */
    customFragmentShader: string;
  }

  /**
   * 可视域分析
   * @param viewer - 视图
   * @param [options.cameraPosition] - 相机位置
   * @param [options.viewPosition] - 视点位置
   * @param [options.horizontalAngle = 120] - 水平张角
   * @param [options.verticalAngle = 90] - 垂直张角
   * @param [options.distance = 100] - 可视距离
   * @param [options.frustum = true] - 视椎体是否显示
   * @param [options.show = true] - 可视域是否显示
   * @param [options.visibleAreaColor = Color(0, 1, 0)] - 可视颜色
   * @param [options.hiddenAreaColor = Color(1, 0, 0)] - 不可视颜色
   * @param [options.alpha = 0.5] - 透明度，[0-1]区间值
   * @param [options.callback] - 回调函数，在开始和绘制结束时回调
   */
  export class ViewShed3D {
      constructor(
      viewer: Viewer,
      options?: {
        cameraPosition?: Cesium.Cartesian3;
        viewPosition?: Cesium.Cartesian3;
        horizontalAngle?: number;
        verticalAngle?: number;
        distance?: number;
        frustum?: boolean;
        show?: boolean;
        visibleAreaColor?: Cesium.Color;
        hiddenAreaColor?: Cesium.Color;
        alpha?: number;
        callback?: (...params: any[]) => any;
      }
    );
    /**
     * 视点位置
     */
    viewPosition: Cesium.Cartesian3;
    /**
     * 相机位置
     */
    cameraPosition: Cesium.Cartesian3;
    /**
     * 水平张角
     */
    horizontalAngle: number;
    /**
     * 垂直张角
     */
    verticalAngle: number;
    /**
     * 可视距离
     */
    distance: number;
    /**
     * 可视区域颜色
     */
    visibleAreaColor: Cesium.Color;
    /**
     * 不可视区域颜色
     */
    hiddenAreaColor: Cesium.Color;
    /**
     * 透明度 [0-1]
     */
    alpha: number;
    /**
     * 显示/隐藏
     */
    show: boolean;
    /**
     * 开始分析
     */
    start(): void;
    /**
     * 销毁
     */
    destroy(): void;
  }

  /**
   * 在线底图管理
   */
  export class BaseMapLayer {
      /**
     * 创建底图
     * @example
     * // 创建esri影像底图
    var imagerylayer = smart3d.BaseMapLayer.createImageryProvider({
      mode: smart3d.BaseMapMode.ESRI
    });
    scene.imageryLayers.addImageryProvider(imagerylayer);
    // 创建Google影像底图
    var imagerylayer = smart3d.BaseMapLayer.createImageryProvider({
      mode: smart3d.BaseMapMode.GOOGLE
    });
    scene.imageryLayers.addImageryProvider(imagerylayer);
    // 创建天地图影像底图
    var imagerylayer = smart3d.BaseMapLayer.createImageryProvider({
      mode: smart3d.BaseMapMode.TIANDITU
    });
    // 创建无底图
    var imagerylayer = smart3d.BaseMapLayer.createImageryProvider({
      mode: smart3d.BaseMapMode.NONE
    });
    ...
    scene.imageryLayers.addImageryProvider(imagerylayer);
     * @param options.mode - 底图类型
     * @param [options.rectangle = Rectangle.MAX_VALU] - 底图请求限制范围
     * @param [options.maximumLevel = 18] - 底图请求最大级别
     * @param [options.token] - 底图的token或者key，比如天地图token，百度地图ak，可以使用SMART3D_GLOBAL_CONFIG全局配置
     * @param [options.subdomains = ['t0','t1']] - 用于{s}URL模板中的占位符的子域。
                                     如果此参数是单个字符串，则字符串中的每个字符都是一个子域。如果是数组，则数组中的每个元素都是一个子域
     * @param [options.hasAlphaChannel = false] - 如果此图像提供者提供的图像包括Alpha通道，
                     则为true；可选；否则为true。否则为假。如果此属性为false，则将忽略Alpha通道（如果存在）。
                     如果此属性为true，则任何不具有alpha通道的图像都将被视为在所有位置处其alpha都是1.0。
                     如果此属性为false，则可能减少内存使用量和纹理上载时间
     * @returns 返回新创建的底图图层
     */
      static createImageryProvider(options: {
      mode: BaseMapMode;
      rectangle?: Cesium.Rectangle;
      maximumLevel?: number;
      token?: string;
      subdomains?: string | string[];
      hasAlphaChannel?: boolean;
    }): Cesium.ImageryProvider;
    /**
     * 移除底图影像
     * @example
     * var imagerylayer = smart3d.BaseMapLayer.createImageryProvider({
      scene:scene,
      mode: smart3d.BaseMapMode.TIANDITU,
    });
    smart3d.BaseMapLayer.removeImageryProvider(imagerylayer);
     * @param scene - 场景视图对象
     * @param imageryLayer - 底图影像
     */
      static removeImageryProvider(
      scene: Cesium.Scene,
      imageryLayer: Cesium.ImageryLayer
    ): void;
  }

  /**
   * 在线底图模式
   */
  const enum BaseMapMode {
    /**
     * esri影像底图
     */
    ESRI = 0,
    /**
     * Google影像底图
     */
    GOOGLE = 1,
    /**
     * 天地图影像底图
     */
    TIANDITU = 2,
    /**
     * 天地图注记
     */
    TIANDITUZJ = 3,
    /**
     * 百度影像底图
     */
    BAIDU = 4,
    /**
     * 天地图矢量底图
     */
    TIANDITUVEC = 5,
    /**
     * 高德影像底图
     */
    GAODE = 7,
    /**
     * 百度影像底图
     */
    BAIDUIMAGE = 8,
    /**
     * 百度标注底图
     */
    BAIDUVCA = 9,
    /**
     * 无底图
     */
    NONE = 6
  }

  /**
 * 生成一个贴地的环形扫描 Primitive。
 * @example
 * const circleScan = new smart3d.CircleScanGroundPrimitive({
  scene: viewer.scene,
  center: Cesium.Cartesian3.fromDegrees(-95.0, 43.0),
  radius: 200000.0,
});
viewer.scene.primitives.add( circleScan );
 * @param options - 一个具有以下属性的对象：
 * @param options.center - 圆心
 * @param options.radius - 半径
 * @param [options.isClockwise = true] - 是否顺时针扫描
 * @param [options.outLineWidth = 2] - 扫描外边框线宽度m
 * @param [options.duration = 1e3] - 扫描一次完成的时间ms
 * @param [options.color = '#FF0000'] - 环形扫描的颜色
 * @param [options.classificationType = Cesium.ClassificationType.BOTH] - 环形扫描的贴地类型
 */
  export class CircleScanGroundPrimitive {
      constructor(options: {
      scene: Cesium.Scene;
      center: Cesium.Cartesian3;
      radius: number;
      isClockwise?: boolean;
      outLineWidth?: number;
      duration?: number;
      color?: string;
      classificationType?: Cesium.ClassificationType;
    });
    /**
     * 设置扫描方向
     * @param isClockwise - 是否顺时针扫描
     */
      setIsClockwise(isClockwise: boolean): void;
      /**
     * 设置环形扫描的颜色
     * @param color - 环形扫描的颜色
     */
      setColor(color: string): void;
      /**
     * 设置环形扫描外边框线宽度
     * @param outLineWidth - 环形扫描外边框线宽度
     */
      setOutLineWidth(outLineWidth: number): void;
      /**
     * 设置扫描一次完成的时间ms
     * @param count - 扫描一次完成的时间ms
     */
      setDuration(count: number): void;
      /**
     * Destroys the WebGL resources held by this object.  Destroying an object allows for deterministic
    release of WebGL resources, instead of relying on the garbage collector to destroy this object.
    <p>
    Once an object is destroyed, it should not be used; calling any function other than
    <code>isDestroyed</code> will result in a {@link DeveloperError} exception.  Therefore,
    assign the return value (<code>undefined</code>) to the object as done in the example.
    </p>
     * @example
     * e = e && e.destroy();
     */
      destroy(): void;
  }

  /**
 * 生成一个环形扫描 Primitive。
 * @example
 * const circleScan = new smart3d.CircleScanPrimitive({
  scene: viewer.scene,
  center: Cesium.Cartesian3.fromDegrees(-95.0, 43.0),
  radius: 200000.0,
});
viewer.scene.primitives.add( circleScan );
 * @param options - 一个具有以下属性的对象：
 * @param options.center - 圆心
 * @param options.radius - 半径
 * @param [options.outLineWidth = 2] - 扫描外边框线宽度m
 * @param [options.duration = 1e3] - 扫描一次完成的时间ms
 * @param [options.color = '#FF0000'] - 环形扫描的颜色
 */
  export class CircleScanPrimitive {
      constructor(options: {
      scene: Cesium.Scene;
      center: Cesium.Cartesian3;
      radius: number;
      outLineWidth?: number;
      duration?: number;
      color?: string;
    });
    /**
     * 设置扫描方向
     * @param isClockwise - 是否顺时针扫描
     */
      setIsClockwise(isClockwise: boolean): void;
      /**
     * 设置环形扫描的颜色
     * @param color - 环形扫描的颜色
     */
      setColor(color: string): void;
      /**
     * 设置环形扫描外边框线宽度
     * @param outLineWidth - 环形扫描外边框线宽度
     */
      setOutLineWidth(outLineWidth: number): void;
      /**
     * 设置扫描一次完成的时间ms
     * @param count - 扫描一次完成的时间ms
     */
      setDuration(count: number): void;
      /**
     * Destroys the WebGL resources held by this object.  Destroying an object allows for deterministic
    release of WebGL resources, instead of relying on the garbage collector to destroy this object.
    <p>
    Once an object is destroyed, it should not be used; calling any function other than
    <code>isDestroyed</code> will result in a {@link DeveloperError} exception.  Therefore,
    assign the return value (<code>undefined</code>) to the object as done in the example.
    </p>
     * @example
     * e = e && e.destroy();
     */
      destroy(): void;
  }

  /**
 * 生成一个贴地的环形波纹 Primitive。
 * @example
 * const circleWave = new smart3d.CircleWaveGroundPrimitive({
  scene: viewer.scene,
  center: Cesium.Cartesian3.fromDegrees(-95.0, 43.0),
  radius: 200000.0,
});
viewer.scene.primitives.add( circleWave );
 * @param options - 一个具有以下属性的对象：
 * @param options.center - 圆心
 * @param options.radius - 半径
 * @param [options.count = 2] - 波纹的总数
 * @param [options.gradient = 0.2] - 波纹的渐变值, 取值范围：[0, 1]
 * @param [options.duration = 1e3] - 波纹传递一次完成的时间ms
 * @param [options.color = '#FF0000'] - 波纹的颜色
 * @param [options.classificationType = Cesium.ClassificationType.BOTH] - 波纹的贴地类型
 */
  export class CircleWaveGroundPrimitive {
      constructor(options: {
      scene: Cesium.Scene;
      center: Cesium.Cartesian3;
      radius: number;
      count?: number;
      gradient?: number;
      duration?: number;
      color?: string;
      classificationType?: Cesium.ClassificationType;
    });
    /**
     * 设置波纹的颜色
     * @param color - 波纹的颜色
     */
      setColor(color: string): void;
      /**
     * 设置波纹的总数
     * @param count - 波纹的总数
     */
      setCount(count: number): void;
      /**
     * 设置波纹传递一次完成的时间ms
     * @param count - 波纹传递一次完成的时间ms
     */
      setDuration(count: number): void;
      /**
     * 设置波纹的渐变值, 取值范围：[0, 1]
     * @param gradient - 波纹的渐变值, 取值范围：[0, 1]
     */
      setGradient(gradient: number): void;
      /**
     * Destroys the WebGL resources held by this object.  Destroying an object allows for deterministic
    release of WebGL resources, instead of relying on the garbage collector to destroy this object.
    <p>
    Once an object is destroyed, it should not be used; calling any function other than
    <code>isDestroyed</code> will result in a {@link DeveloperError} exception.  Therefore,
    assign the return value (<code>undefined</code>) to the object as done in the example.
    </p>
     * @example
     * e = e && e.destroy();
     */
      destroy(): void;
  }

  /**
 * 生成一个环形波纹 Primitive。
 * @example
 * const circleWave = new smart3d.CircleWavePrimitive({
  scene: viewer.scene,
  center: Cesium.Cartesian3.fromDegrees(-95.0, 43.0),
  radius: 200000.0,
});
viewer.scene.primitives.add( circleWave );
 * @param options - 一个具有以下属性的对象：
 * @param options.center - 圆心
 * @param options.radius - 半径
 * @param [options.count = 2] - 波纹的总数
 * @param [options.gradient = 0.2] - 波纹的渐变值, 取值范围：[0, 1]
 * @param [options.duration = 1e3] - 波纹传递一次完成的时间ms
 * @param [options.color = '#FF0000'] - 波纹的颜色
 */
  export class CircleWavePrimitive {
      constructor(options: {
      scene: Cesium.Scene;
      center: Cesium.Cartesian3;
      radius: number;
      count?: number;
      gradient?: number;
      duration?: number;
      color?: string;
    });
    /**
     * 设置波纹的颜色
     * @param color - 波纹的颜色
     */
      setColor(color: string): void;
      /**
     * 设置波纹的总数
     * @param count - 波纹的总数
     */
      setCount(count: number): void;
      /**
     * 设置波纹传递一次完成的时间ms
     * @param count - 波纹传递一次完成的时间ms
     */
      setDuration(count: number): void;
      /**
     * 设置波纹的渐变值, 取值范围：[0, 1]
     * @param gradient - 波纹的渐变值, 取值范围：[0, 1]
     */
      setGradient(gradient: number): void;
      /**
     * Destroys the WebGL resources held by this object.  Destroying an object allows for deterministic
    release of WebGL resources, instead of relying on the garbage collector to destroy this object.
    <p>
    Once an object is destroyed, it should not be used; calling any function other than
    <code>isDestroyed</code> will result in a {@link DeveloperError} exception.  Therefore,
    assign the return value (<code>undefined</code>) to the object as done in the example.
    </p>
     * @example
     * e = e && e.destroy();
     */
      destroy(): void;
  }

  /**
 * smart3d global config scheme
<p>please use smart3d.SMART3D_GLOBAL_CONFIG = { TIANDITU_TOKEN: 'token' }</p>
 * @property [TIANDITU_TOKEN] - 天地图token
 * @property [BAIDU_AK] - 百度地图的ak
 * @property [SMART3D_BASE_URL] - smart3d库静态资源文件路径，指向smart3d文件夹
 */
  type SMART3D_GLOBAL_CONFIG = {
    TIANDITU_TOKEN?: string;
    BAIDU_AK?: string;
    SMART3D_BASE_URL?: string;
  };

  /**
 * 绘制处理对象类，支持画点、线、面、标记，基于{@link Primitive}绘制
<p>所有的绘制都以右键结束</p>
 * @example
 * var drawHandler = new smart3d.DrawHandler(viewer, mode);
 * @param viewer - 视图对象
 * @param mode - 绘制模式，包含点、线、面
 * @param [options.clampToGround = false] - 是否贴地，默认：false
 * @param [options.pickWidth = 1] - 拾取宽度，需要拾取点云时，可调大该值
 * @param [options.pickHeight = 1] - 拾取高度，需要拾取点云时，可调大该值
 */
  export class DrawHandler {
      constructor(
      viewer: Viewer,
      mode: DrawMode,
      options?: {
        clampToGround?: boolean;
        pickWidth?: number;
        pickHeight?: number;
      }
    );
    /**
     * 绘制点的样式 <br>
     */
    pointStyle: Cesium.PointPrimitive;
    /**
     * 绘制线样式，包含<br>
    geometry 几何图形，是除去 <code>positions</code> 的 {@link GroundPolylineGeometry} 或者 {@link PolylineGeometry}<br>
    attributes 属性是{@link GeometryInstance#attributes},<br>
    appearance 外观 <br>
    depthFailAppearance 深度测试失败时对该基本体进行着色的外观
     */
    lineStyle: any;
    /**
     * 绘制面样式，包含<br>
    geometry 几何图形，是除去<code>polygonHierarchy</code>的{@link PolygonGeometry} 或者 {@link CoplanarPolygonGeometry}<br>
    attributes 属性是{@link GeometryInstance#attributes}<br>
    appearance 外观 <br>
    depthFailAppearance 深度测试失败时对该基本体进行着色的外观
     */
    polygonStyle: any;
    /**
     * 标记的样式，和{@link Billboard}的属性一样，但除去<code>positions</code>
     * @example
     * { image: './images/logo-white.png' }
     */
    markerStyle: any;
    /**
     * 激活绘制事件，当 {@link DrawHandler#activate} 激活handler事件
     * @example
     * drawHandler.activeEvent.addEventListener(function(isActive) {

    });
     */
    readonly activeEvent: Cesium.Event;
    /**
     * 锚点事件监听，当在绘制线、面时候才起作用
     * @example
     * drawHandler.anchorEvent.addEventListener(function(cartesian) {
     // 返回位置点信息
    });
     */
    readonly anchorEvent: Cesium.Event;
    /**
     * 鼠标滑动事件监听，当在绘制线、面时候才起作用
     * @example
     * drawHandler.movingEvent.addEventListener(function(windowPosition) {
     // 返回屏幕位置点信息
    });
     */
    readonly movingEvent: Cesium.Event;
    /**
     * <p>绘制结束事件</p>

    <p>当绘制模式是 DrawMode.Point 时，返回绘制点和点图元 ({@link Cartesian3}, {@link PointPrimitive}) <br>
    当绘制模式是 DrawMode.Line 时，返回绘制点集合和线图元 ([{@link Cartesian3}, ...], {@link Primitive} || {@link GroundPolylinePrimitive}) <br>
    当绘制模式是 DrawMode.Polygon 时，返回绘制点集合和面图元 ([{@link Cartesian3}, ...], {@link Primitive} || {@link GroundPrimitive}) <br>
    当绘制模式是 DrawMode.Point 时，返回绘制点和Billboard ({@link Cartesian3}, {@link Billboard}) </p>
     * @example
     * drawHandler.drewEvent.addEventListener(function(result) {

    });
     */
    readonly drewEvent: Cesium.Event;
    /**
     * 绘制图元集合
     */
    readonly drawlayer: Cesium.PrimitiveCollection;
    /**
     * 绘制点的集合，只当绘制线、面时有值
     */
    readonly positions: Cesium.Cartesian3[];
    /**
     * 是否启用辅助功能，开启后会在画线/面时，同时绘制点/线的辅助作用
     */
    enableAssist: boolean;
    /**
     * 是否关闭绘制时的提示，为true时会在画线/面同时关闭绘制线/面的辅助提示作用
     */
    closePrompt: boolean;
    /**
     * 绘制类激活handler
     * @param [isShowLine] - 绘制面是否加辅助线，非必填，默认不添加辅助线，弃用： will be 1.5 deprecate, use the enableAssist memeber.
     */
    activate(isShowLine?: boolean): void;
    /**
     * handler停止工作，可激活
     */
    deactivate(): void;
    /**
     * 清除所绘制的图元
     */
    clear(): void;
    /**
     * 销毁，但不清除数据和图元
     * @param [isClear = true] - 是否要销毁移除图层
     */
    destroy(isClear?: boolean): void;
  }

  /**
   * 绘制类模式
   */
  const enum DrawMode {
    /**
     * 绘制点模式
     */
    Point = 0,
    /**
     * 绘制线模式
     */
    Line = 1,
    /**
     * 绘制面模式
     */
    Polygon = 2,
    /**
     * 绘制标记模式
     */
    Marker = 3
  }

  /**
 * <p>一个 ESRI 的 <a href="https://github.com/Esri/i3s-spec">Indexed 3D Scene Layer</a>。</p>
<p>目前仅支持 <strong>1.7</strong> 版本的 IntegratedMesh 和 3DObject 的图层类型，<strong>不支持 Point、PointCloud 和 Building 的图层类型</strong>。</p>
<p>目前仅支持 3D 场景模式，<strong>不支持 2.5D 和 2D 的场景模式</strong>。</p>
<p><strong>该类目前仅是实验性的，还处于草稿阶段，请不要在生产环境中使用。</strong></p>
 * @example
 * const sceneLayer = new smart3d.ESRIIndexed3DSceneLayer({
  // 默认取第一个图层
  url: 'https://tiles.arcgis.com/tiles/pF6IF6uuRJJtwEi9/arcgis/rest/services/IglesiaSanta_Maria_Lebena__v17/SceneServer',
  // 或指定取第一个图层
  // url: 'https://tiles.arcgis.com/tiles/pF6IF6uuRJJtwEi9/arcgis/rest/services/IglesiaSanta_Maria_Lebena__v17/SceneServer/0',
  debugShowBoundingBox: true
});
sceneLayer.maximumMemoryUsage = 2048;
viewer.scene.primitives.add(sceneLayer);
sceneLayer.readyPromise
  .then(() => {
    viewer.camera.flyToBoundingSphere(sceneLayer.boundingSphere);
  });
 * @param options.url - I3S 服务的 URL。
 * @param [options.show = true] - 是否显示该图层。
 * @param [options.maximumMemoryUsage = 512] - 该图层的最大显存缓存数，单位为 MB。
 * @param [options.debugShowPickColor = false] - 仅用于调试。为 <code>true</code> 时，会渲染每个 Feature 的 pick color。
 * @param [options.debugColorizeNodes = false] - 仅用于调试。为 <code>true</code> 时，会为每个节点渲染一个随机的颜色。
 * @param [options.debugShowBoundingBox = false] - 仅用于调试。为 <code>true</code> 时，会为每个节点渲染它的包围盒。
 * @param [options.debugShowBoundingBoxCenterPoint = false] - 仅用于调试。为 <code>true</code> 时，会为每个节点渲染它的包围盒中心点。
 * @param [options.debugShowNodeIndex = false] - 仅用于调试。为 <code>true</code> 时，会为每个节点渲染它的包围盒中心点。
 */
  export class ESRIIndexed3DSceneLayer {
      constructor(options: {
      url: string;
      show?: boolean;
      maximumMemoryUsage?: number;
      debugShowPickColor?: boolean;
      debugColorizeNodes?: boolean;
      debugShowBoundingBox?: boolean;
      debugShowBoundingBoxCenterPoint?: boolean;
      debugShowNodeIndex?: boolean;
    });
    /**
     * 是否显示该图层。
     */
    show: boolean;
    /**
     * 是否仅使用最后一帧中的节点进行渲染。这可以有效地将图层“冻结”到上一帧，然后可以进行缩放，查看到底渲染了哪些节点。
     */
    debugFreezeFrame: boolean;
    /**
     * 在一帧内，每个可见的节点都会触发该事件。
    可见的 {@link ESRIIndexed3DSceneLayerNode} 会传给事件监听器。
    渲染帧时，该事件会在遍历节点树期间触发，因此在事件监听器内对节点的更新会在同一帧中生效。
    在事件监听器内，请勿创建或修改 Cesium Entity 或 Primitive。
     * @example
     * i3sLayer.nodeVisible.addEventListener(function(layerNode) {
      if (layerNode instanceof smart3d.ESRIIndexed3DSceneLayerNode) {
        console.log('A Node is visible.');
      }
    });
     */
    nodeVisible: Cesium.Event;
    /**
     * 当节点的网格被卸载时，该事件会被触发。
    准备卸载的 {@link ESRIIndexed3DSceneLayerNode} 会传给事件监听器。
    该事件会在节点的网格被卸载之前立即触发，因此可以在事件监听器内对访问到节点的网格。
    在事件监听器内，请勿创建或修改 Cesium Entity 或 Primitive。
     */
    nodeUnload: Cesium.Event;
    /**
     * 节点网格加载失败时触发的事件。
     */
    nodeFailed: Cesium.Event;
    /**
     * 获取该图层的根节点。
     */
    readonly root: ESRIIndexed3DSceneLayerNode | undefined;
    /**
     * 当为 <code>true</code> 时，表示已经获取到了根节点的 {@link https://github.com/Esri/i3s-spec/blob/master/docs/1.7/node.cmn.md#properties|node}。
     */
    readonly ready: boolean;
    /**
     * 当获取到根节点的包围盒后，该 Promsie 即会被 resolved。
     */
    readyPromise: Promise<ESRIIndexed3DSceneLayer>;
    /**
     * 该图层的最大显存缓存数，单位为 MB。
     */
    maximumMemoryUsage: number;
    /**
     * 该图层总的显存使用量。
     */
    readonly totalMemoryUsageInBytes: number;
    /**
     * 根节点的包围球。
     */
    readonly boundingSphere: Cesium.BoundingSphere | undefined;
    /**
     * 仅用于调试。为 <code>true</code> 时，会渲染每个 Feature 的 pick color。
     */
    debugShowPickColor: boolean;
    /**
     * 仅用于调试。为 <code>true</code> 时，会为每个节点渲染一个随机的颜色。
     */
    debugColorizeNodes: boolean;
    /**
     * 仅用于调试。为 <code>true</code> 时，会为每个节点渲染它的包围盒。
     */
    debugShowBoundingBox: boolean;
    /**
     * 仅用于调试。为 <code>true</code> 时，会为每个节点渲染它的包围盒中心点。
     */
    debugShowBoundingBoxCenterPoint: boolean;
    /**
     * 仅用于调试。为 <code>true</code> 时，会为每个节点渲染它的节点索引。
     */
    debugShowNodeIndex: boolean;
  }

  /**
 * {@link ESRIIndexed3DSceneLayer} 中的一个节点。
<p>不要直接构造它，可以通过 {@link ESRIIndexed3DSceneLayer#nodeVisible} 访问节点。</p>
 * @param i3sLayer - 包含该节点的图层。
 * @param nodeIndex - 节点的索引。
 * @param parentLayerNode - 该节点的父节点。
 */
  export class ESRIIndexed3DSceneLayerNode {
      constructor(
      i3sLayer: ESRIIndexed3DSceneLayer,
      nodeIndex: number,
      parentLayerNode: ESRIIndexed3DSceneLayerNode
    );
    /**
     * 获取从该节点包围体派生的包围球。
     */
    readonly boundingSphere: Cesium.BoundingSphere | undefined;
    /**
     * 获取该节点的父节点。
     */
    readonly parent: ESRIIndexed3DSceneLayerNode | undefined;
    /**
     * 获取该节点的子节点。
     */
    readonly children: ESRIIndexed3DSceneLayerNode[];
    /**
     * 获取该节点的网格。
     */
    readonly mesh: ESRIIndexed3DSceneLayerNodeMesh;
  }

  /**
 * 一个 {@link ESRIIndexed3DSceneLayerNode}内的网格。
<p>不要直接构造它，可以通过 {@link ESRIIndexed3DSceneLayerNode#mesh} 访问节点网格。</p>
 * @param i3sLayer - 包含该网格的图层。
 * @param layerNode - 包含该网格的节点。
 * @param arrayBuffer - 该网格的几何数据。
 */
  export class ESRIIndexed3DSceneLayerNodeMesh {
      constructor(
      i3sLayer: ESRIIndexed3DSceneLayer,
      layerNode: ESRIIndexed3DSceneLayerNode,
      arrayBuffer: ArrayBuffer
    );
    /**
     * 设置 feature 的混合颜色。
     * @example
     * let oldPicked;
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
    handler.setInputAction(movement => {
      const windowPosition = movement.position;
      const picked = viewer.scene.pick(windowPosition);
      if (picked) {
        const mesh = picked.primitive;
        if (mesh && mesh.node) { // 判断是否是 ESRIIndexed3DSceneLayerNodeMesh
          if (oldPicked) {
            oldPicked.primitive.setFeatureBlendColor(oldPicked.featureId, Cesium.Color.WHITE);
          }

          if (!mesh.setFeatureBlendColor(picked.featureId, Cesium.Color.RED)) {
            console.warn('set feature ' + picked.featureId + ' blend color failed');
          }

          oldPicked = picked;
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
     * @param featureId - feature ID
     * @param color - 该 feature 的混合颜色
     * @returns 是否设置成功。
     */
      setFeatureBlendColor(featureId: number, color: Cesium.Color): boolean;
    /**
     * 获取该网格的节点。
     */
    readonly node: ESRIIndexed3DSceneLayerNode;
    /**
     * 获取包含该网格的图层。
     */
    readonly i3sLayer: ESRIIndexed3DSceneLayer;
  }

  /**
   * .object 模型加载器，无需实例化该类，请使用静态方法。
   */
  export class OBJLoader {
      constructor();
      /**
     * 使用批绘制渲染 .object 模型，减少 draw call，可提高渲染性能。<br>
    仅渲染三角面（<code>f</code>），仅使用材质文件中和漫反射有关的关键字（<code>Kd</code> 或 <code>map_Kd</code>）进行渲染，若无关键字，则使用红色。<br>
    纹理图片格式额外支持 .tga 格式。<br>
     * @example
     * const position = Cesium.Cartesian3.fromDegrees(115.8198195, 38.4373388, 0);
    const m = Cesium.Transforms.eastNorthUpToFixedFrame(position);
    const paths = [ 'object/model-1.object', 'object/model-2.object', 'object/model-3.object' ];

    smart3d.OBJLoader.batchLoadOBJModels(paths, {
      viewer: viewer,
      backFaceCulling: false,
      generateMipmap: true,
      positionCallback: function(x, y, z) {
        const [ longitude, latitude ] = proj4('EPSG:32650', 'WGS84', [ x, y ]);
        const c3 = Cesium.Cartesian3.fromDegrees(longitude, latitude, z);
        return [ c3.x, c3.y, c3.z ];
      }
    }).then(primitive => {

      // 如果不修改顶点坐标，则可能需要设置模型矩阵
      // primitive.modelMatrix = m;

      viewer.scene.primitives.add(primitive);

    });
     * @param uri - .object 模型 URI。
     * @param options - 选项
     * @param options.viewer - Cesium.Viewer 类的实例。
     * @param [options.backFaceCulling = true] - 是否开启背面剔除。对于封闭的物体开启可以提升性能，对于非封闭的物体则不可以开启。
     * @param [options.generateMipmap = false] - 是否生成 mipmap。
     * @param [options.positionCallback] - 对顶点坐标使用的回调函数，可用于修改顶点坐标。例如，如果模型的顶点坐标是投影坐标，则可以转换为世界坐标。
     */
      static batchLoadOBJModels(
      uri: string[] | string,
      options: {
        viewer: Viewer;
        backFaceCulling?: boolean;
        generateMipmap?: boolean;
        positionCallback?: OBJLoader.PositionCallback;
      }
    ): Promise<Cesium.Primitive> | Promise<undefined>;
    /**
     * 加载 .object 模型。仅使用材质文件中和漫反射有关的关键字（<code>Kd</code> 或 <code>map_Kd</code>）进行渲染，<br>
    如果顶点包含颜色信息，则使用顶点颜色。<br>
    纹理图片格式支持 .tga、.jpg、.jpeg、.png 格式。<br>
     * @example
     * const position = Cesium.Cartesian3.fromDegrees(113, 23, 10);
    const m = Cesium.Transforms.eastNorthUpToFixedFrame(position);

    smart3d.OBJLoader.loadOBJModel('path/to/model.object', viewer)
      .then(result => {

        for (let i = 0, len = result.length; i < len; ++i) {
          result.get(i).modelMatrix = m;
        }
        viewer.scene.primitives.add(result);

      });
     * @param uri - .object 模型 URI。
     * @param viewer - Cesium.Viewer 类实例。
     */
      static loadOBJModel(
      uri: string,
      viewer: Viewer
    ): Promise<Cesium.PrimitiveCollection>;
    /**
     * 获取 .object 文件 和引用的 .mtl 文件并解析它们。如果你对 .object 格式和 .mtl 格式有所了解，也可以自定义渲染方式。<br/>
    单独解析 .object 文件见 {@link OBJLoader.parseOBJ}，单独解析 .mtl 文件见 {@link OBJLoader.parseMTL}，解析并渲染见 {@link OBJLoader.loadOBJModel}。
     * @example
     * smart3d.OBJLoader.fetchOBJAndMTL('path/to/model.object')
      .then(parsedResult => {
        // parsedResult 对象有 positions、colors、texcoords、normals、objects、materials 属性（如果有的话）
        const { positions, colors, texcoords, normals, objects, materials } = parsedResult;
      });
     * @param uri - .object 模型 URI。
     */
      static fetchOBJAndMTL(uri: string): Promise<object>;
      /**
     * 解析 .object 文件，可用于自定义渲染。仅支持以下关键字：
    <ol>
      <li>v：顶点坐标格式支持 <code>v x y z</code> 格式和 <code>v x y z r g b</code> 格式。</li>
      <li>vt</li>
      <li>vn</li>
      <li>f</li>
      <li>l</li>
      <li>mtllib</li>
      <li>usemtl</li>
      <li>o</li>
      <li>g</li>
    </ol>
     * @example
     * fetch('path/to/model.object')
      .then(res => res.text())
      .then(OBJText => {
        // 解析后的结果
        const { positions, colors, texcoords, normals, objects, mtllib } = smart3d.OBJLoader.parseOBJ(OBJText);
      });
     * @param text - .object 文件文本。
     * @returns 一个包含顶点坐标、顶点颜色、纹理坐标、法线、物体和材质路径的对象。
     */
      static parseOBJ(text: string): any;
      /**
     * 解析 .mtl 文件文本。仅支持以下关键字：
    <ol>
      <li>newmtl</li>
      <li>Ka</li>
      <li>Kd</li>
      <li>Ks</li>
      <li>Ns</li>
      <li>Ke</li>
      <li>map_Ka</li>
      <li>map_Kd</li>
      <li>map_Ks</li>
      <li>map_Ke</li>
      <li>d</li>
      <li>Tr</li>
      <li>map_d</li>
      <li>Tf</li>
      <li>Ni</li>
      <li>illum</li>
    </ol>
     * @example
     * fetch('path/to/materials.mtl')
      .then(res => res.text())
      .then(MTLText => {
        // 解析后的结果，属性名为材质名。
        const materials = smart3d.OBJLoader.parseMTL(MTLText);
      });
     * @param text - .mtl 文件文本。
     * @returns 一个属性名为材质名的对象，属性值为对应材质的上述参数。
     */
      static parseMTL(text: string): any;
  }

  namespace OBJLoader {
    /**
     * 一个用于修改顶点坐标的函数。
     * @param x - 顶点坐标的 X 分量
     * @param y - 顶点坐标的 Y 分量
     * @param z - 顶点坐标的 Z 分量
     */
    type PositionCallback = (x: number, y: number, z: number) => number[];
  }

  /**
 * 拾取类
 * @example
 * const pickObject = new smart3d.Pick(viewer, smart3d.PickMode.HIGHLIGHT);
pickObject.start();
 * @param viewer - 场景实例
 * @param [mode = PickMode.HIGHLIGHT] - 拾取显示效果模式
 */
  export class Pick {
      constructor(viewer: Viewer, mode?: PickMode);
    /**
     * 是否开启拾取
     */
    enabled: boolean;
    /**
     * 选中颜色
     */
    pickColor: Cesium.Color;
    /**
     * 当前选择对象（拾取3dties时才可用）
     */
    readonly curPicFeature: Cesium.Cesium3DTileFeature;
    /**
     * 当前选择对象id
     */
    readonly curId: string;
    /**
     * 选中对象 ,具有以下属性：
    feature:当前拾取到的feature或entity;
    originalColor:记录拾取对象高亮前的颜色;
    featureType:拾取到对象类型（Cesium3DTileFeature|Entity）；
     */
    readonly selected: any;
    /**
     * 当前鼠标点击位置
     */
    readonly position: Cesium.Cartesian3;
    /**
     * 拾取点击事件，可以用于在拾取后的后续操作，如进行属性查询等
     * @example
     * pickObject.clickEvent.addEventListener(function(pickedObject, position) {
     // 返回选择的对象及鼠标点击位置
    });
     */
    readonly clickEvent: Cesium.Event;
    /**
     * 模型实体拾取
     * @param [mode] - 拾取显示效果模式
     * @param [classPropertyName = names] - 分类名，如果定义了分类名则会根据数据属性名去查询相同的进行分类高亮/偏移/透明显示，
                                              如果设定为空值，则显示最小部件，默认使用names来判断。
     */
    start(mode?: PickMode, classPropertyName?: string): void;
    /**
     * 获取Feature对应id
     */
    getFeatureID(pickedObject: Cesium.Cesium3DTileFeature): void;
    /**
     * 清除拾取效果
     */
    clear(): void;
    /**
     * 销毁拾取类
     */
    destroy(): void;
  }

  /**
   * 拾取显示效果模式
   */
  const enum PickMode {
    /**
     * 高亮模式
     */
    HIGHLIGHT = 0,
    /**
     * 透明模式
     */
    TRANSPARENT = 1,
    /**
     * 抽屉偏移模式
     */
    OFFSET = 2
  }

  /**
   * 一个自定义更新的面图元
   * @param [clampToGround = false] - 是否贴地
   */
  export class SimplePolygon {
      constructor(options?: any, clampToGround?: boolean);
    /**
     * 线默认样式
     */
    readonly defaultStyle: any;
    /**
     * 设置坐标
     * @param positions - 位置点集合
     */
    setPosition(positions: Cesium.Cartesian3[]): void;
    /**
     * 获取位置点
     */
    getPosition(): Cesium.Cartesian3[];
    /**
     * 设置更新开关
     * @param isUpdate - 是否更新图元
     */
    setUpdate(isUpdate: boolean): void;
  }

  /**
   * 一个自定义更新的线图元
   * @param [clampToGround = false] - 是否贴地
   */
  export class SimplePolyline {
      constructor(options?: any, clampToGround?: boolean);
    /**
     * 线默认样式
     */
    readonly defaultStyle: any;
    /**
     * 设置坐标
     * @param positions - 位置点集合
     */
    setPosition(positions: Cesium.Cartesian3[]): void;
    /**
     * 获取位置点
     */
    getPosition(): Cesium.Cartesian3[];
    /**
     * 设置更新开关
     * @param isUpdate - 是否更新图元
     */
    setUpdate(isUpdate: boolean): void;
  }

  export class SimplePrimitive {
      /**
     * 获取图形
     */
      getGeometry(): void;
      /**
     * 创建图元
     */
      createPrimitive(): void;
      /**
     * 更新图形
     */
      update(): void;
  }

  namespace TerrainManager {
    /**
     * 统一地形管理类或方法的配置项
     * @property options - 配置项
     * @property options.url - 数据服务的url，指向layer.json的目录路径地址
     * @property [options.id] - terrainProvider的layerInfo的唯一标识，多地形管理判断标准
     * @property [options.index] - 指定terrainProvider的layer的索引，如果为空，则在追加
     * @property [options.requestVertexNormals = false] - 指示客户端是否应从服务器请求附加照明信息的标志，如果可用，以每顶点法线的形式。
     * @property [options.requestWaterMask = false] - 指示客户端是否应从服务器请求每个图块的水掩码的标志（如果可用）
     * @property [options.requestMetadata = true] - 指示客户端是否应从服务器请求每个图块元数据的标志（如果可用）
     * @property [options.ellipsoid] - 椭球体。如果未指定，则使用 WGS84 椭球。
     * @property [options.credit] - 数据源的信用，显示在画布上。
     */
    type Options = {
      options: {
        url: string;
        id?: string;
        index?: number;
        requestVertexNormals?: boolean;
        requestWaterMask?: boolean;
        requestMetadata?: boolean;
        ellipsoid?: Cesium.Ellipsoid;
        credit?: Cesium.Credit | string;
      };
    };
  }

  /**
 * 地形管理类，可以添加多个自定义地形，达到地形融合显示
 * @example
 * viewer.terrainProvider = smart3d.TerrainManager.createWorldTerrain();
// 或者添加多个地形
var terrainManager = new smart3d.TerrainManager(viewer);
terrainManager.addMultiTerrain(opitons).then(function(terrainProvider){ })
 * @param viewer - 视图对象
 */
  export class TerrainManager {
      constructor(viewer: Viewer);
      /**
     * 创建公网地形
     * @example
     * viewer.terrainProvider = smart3d.TerrainManager.createWorldTerrain();
     * @returns 返回地形Provider
     */
      static createWorldTerrain(): Cesium.CesiumTerrainProvider;
      /**
     * 创建自定义地形，多地形使用 {@link addMultiTerrain}
     * @example
     * viewer.terrainProvider = smart3d.TerrainManager.createCustomTerrain({
      viewer: viewer,
      url: 'http://custom.com/terrain/',
    });
     * @param options - 配置项
     * @returns 返回地形Provider
      *
     */
      static createCustomTerrain(
      options: TerrainManager.Options
    ): Cesium.CesiumTerrainProvider;
    /**
     * 创建ArcGIS地形，但不支持多地形
     * @example
     * viewer.terrainProvider = smart3d.TerrainManager.createArcGISTerrain({
      url: 'https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer',
      token: ''
    });
     * @param options - 具有以下属性的对象:
     * @param options.url - 地形url
     * @param [options.token] - 用于连接到服务的授权令牌
     * @param [options.ellipsoid] - 椭球体。如果指定了 tilingScheme，则忽略此参数并使用切片方案的椭球体。如果没有指定任何参数，则使用 WGS84 椭球
     * @returns 返回地形Provider
     */
      static createArcGISTerrain(options: {
      url:
        | Cesium.Resource
        | string
        | Promise<Cesium.Resource>
        | Promise<string>;
      token?: string;
      ellipsoid?: Cesium.Ellipsoid;
    }): Cesium.CesiumTerrainProvider;
    /**
     * 创建STK地形
     * @example
     * viewer.terrainProvider = smart3d.TerrainManager.createSTKTerrain();
     * @param [options.requestWaterMask = false] - 指示客户端是否应从服务器请求每个图块的水掩码的标志（如果可用）
     * @param [options.requestVertexNormals = false] - 指示客户端是否应从服务器请求附加照明信息的标志，如果可用，以每顶点法线的形式。
     * @param [options.requestMetadata = true] - 指示客户端是否应从服务器请求每个图块元数据的标志（如果可用）
     * @param [options.ellipsoid] - 椭球体。如果未指定，则使用 WGS84 椭球。
     * @param [options.credit] - 数据源的信用，显示在画布上。
     * @returns 返回地形Provider
     */
      static createSTKTerrain(options?: {
      requestWaterMask?: boolean;
      requestVertexNormals?: boolean;
      requestMetadata?: boolean;
      ellipsoid?: Cesium.Ellipsoid;
      credit?: Cesium.Credit | string;
    }): Cesium.CesiumTerrainProvider;
    /**
     * 不创建地形
     * @example
     * viewer.terrainProvider = smart3d.TerrainManager.createNoTerrain()
     * @returns 返回无地形
     */
      static createNoTerrain(): Cesium.EllipsoidTerrainProvider;
      /**
     * 根据ID获取地形图层索引
     * @param id - 图层唯一标识
     */
      getTerrainIndex(id: string): void;
      /**
     * 添加多个地形，在当前的viewer.terrainProvider中注入新地形的layerinfo
    <p>多地形加载不支持arcgis地形，Cesium.ArcGISTiledElevationTerrainProvider 对象</p>
     * @param options - 配置项
     * @returns 返回当前地形的cesium的TerrainProvider
     */
      addMultiTerrain(
      options: TerrainManager.Options
    ): Promise<Cesium.CesiumTerrainProvider> | undefined;
    /**
     * 移除地形，通过ID来移除，只适配自定义多地形移除
     * @param id - terrainProvider中的layerInfo的唯一标识
     * @returns 移除成功返回true，否则返回false
     */
      remove(id: string): boolean;
      /**
     * 清空所有地形，包含自定义和全球地形
     */
      removeAll(): void;
      /**
     * 销毁
     * @returns undefined
     */
      destroy(): any;
  }

  /**
   * b3dm类型的Cesium3DTileset自定义着色器更新
   * @param options - 自定着色器相关参数
   * @param [options.show = true] - 是否应用自定义着色器
   */
  export class TilesetShaderUpdater {
      constructor(
      tileset: Cesium.Cesium3DTileset,
      options: {
        show?: boolean;
      }
    );
    /**
     * 决定是否应用自定义着色器
     */
    show: boolean;
    /**
     * 完整的自定义顶点着色器
     */
    customVertexShader: string;
    /**
     * 完整的自定义片源着色器
     */
    customFragmentShader: string;
    /**
     * 销毁
     */
    destroy(): undefined;
  }

  /**
   * 二维矢量瓦片图元
   */
  export class Vector2DTilePrimitive {
      /**
     * 添加图层
     * @example
     * var layer = smart3d.Vector2DTilePrimitive.add(viewer.scene, {
      url: 'http://172.16.11.21:8091/geoserver/gwc/service/wmts?layer=gslt:gansuxzq',
      rectangle: Cesium.Rectangle.fromRadians(1.7772431611503339, 0.6414638333596558, 1.8186312846629529, 0.6887203497761097),
      maximumLevel: 20,
    });
     * @param scene - 场景对象
     * @param options - 配置项
     * @param options.url - wmts服务地址，如：http://xxx/geoserver/gwc/service/wmts?layer=xxxx; wms服务地址，如：http://xx/geoserver/xxx/wms?layers=xxxx
     * @param [options.visible = true] - 图层是否显示
     * @param [options.rectangle = Cesium.Rectangle.MAX_VALUE] - 瓦片数据的范围（最好设置为真实数据的有效范围，否则会降低一些性能）
     * @param [options.format = 'image/png'] - 瓦片MIME类型
     * @param [options.maximumLevel = 18] - 最大加载级别
     * @param [options.tileMatrixSetID = 'EPSG:4326'] - 坐标系编号
     * @param [options.tilingScheme = new Cesium.GeographicTilingScheme()] - 瓦片切分方案
     * @param [options.classificationType = Cesium.ClassificationType.BOTH] - 贴合类型，默认贴地及贴3dtiles
     */
      static add(
      scene: Cesium.Scene,
      options: {
        url: string;
        visible?: string;
        rectangle?: Cesium.Rectangle;
        format?: string;
        maximumLevel?: number;
        tileMatrixSetID?: string;
        tilingScheme?: Cesium.TilingScheme;
        classificationType?: Cesium.ClassificationType;
      }
    ): Cesium.PrimitiveCollection;
    /**
     * 更新二维矢量瓦片图层的样式
     * @param scene - 场景对象
     * @param layer - 二维矢量瓦片图层对象
     * @param style - 二维矢量瓦片图层样式
     * @param style.classificationType - 贴地类型
     * @param style.maximumLevel - 最大层级
     * @returns 更新是否成功
     */
      static updateStyle(
      scene: Cesium.Scene,
      layer: Cesium.PrimitiveCollection,
      style: {
        classificationType: Cesium.ClassificationType;
        maximumLevel: number;
      }
    ): boolean;
  }

  /**
   * 矢量瓦片图层
   * @param options - 具体内容如下
   * @param options.url - wmts服务地址，如：http://xxx/geoserver/gwc/service/wmts
   * @param [options.rectangle = Rectangle.MAX_VALUE] - 图层范围，相机视角变化时切换瓦片层级时用到
   * @param [options.format = 'image/png'] - 请求切片的MIME类型
   * @param [options.tileMatrixLabels = []] - 瓦片分层的名称集合 （tileMatrixSetID:level）
   * @param [options.tileMatrixSetID = ''] - 瓦片切片名称
   * @param [options.layer = ''] - 图层名称
   * @param [options.style = ''] - wmts请求样式
   * @param [options.serviceType = ServiceType.WMTS] - 服务类型(WMTS/WMS)
   * @param [options.tilingScheme = new Cesium.GeographicTilingScheme()] - 切片方案
   * @param [options.maximumLevel] - 最大加载层级
   */
  export class VectorTilesLayer {
      constructor(options: {
      url: string;
      rectangle?: Cesium.Rectangle;
      format?: string;
      tileMatrixLabels?: string[];
      tileMatrixSetID?: string;
      layer?: string;
      style?: string;
      serviceType?: string;
      tilingScheme?: string;
      maximumLevel?: number;
    });
    /**
     * 更新图层的瓦片缓存
     * @param _tileCache - 瓦片缓存
     */
      updateTileCache(_tileCache: object[]): void;
      /**
     * 获取瓦片缓存
     */
      getTileCache(): object[];
      /**
     * 添加瓦片
     * @param level - 瓦片层级
     * @param x - 瓦片横坐标
     * @param y - 瓦片纵坐标
     */
      addTileCache(level: number, x: number, y: number): boolean;
      /**
     * 添加瓦片
     * @param tileId - 瓦片id: level_x_y
     */
      addTileCacheById(tileId: string): boolean;
      /**
     * 获取瓦片地址
     * @param level - 瓦片层级， 必要
     * @param x - 瓦片横坐标，必要
     * @param y - 瓦片纵坐标，必要
     * @param [format = this.format] - 瓦片MIME类型
     * @returns （''：表示失败）
     */
      getTileImageUrl(
      level: number,
      x: number,
      y: number,
      format?: string
    ): string;
    /**
     * 获取瓦片地址
     * @param tileId - 瓦片id: level_x_y
     * @param [format = this.format] - 瓦片MIME类型
     */
      getTileImageUrlById(tileId: string, format?: string): string;
  }

  /**
   * 播放视频的格式
   */
  const enum VideoFormat {
    /**
     * MP4格式
     */
    MP4 = 'mp4',
    /**
     * FLV格式
     */
    FLV = 'flv'
  }

  /**
 * 视频投放对象，基于flvjs的视频播放，兼容flv和mp4格式视频
 * @example
 * var videoPutIn = new smart3d.VideoPutIn(viewer, {
   url: 'http://172.16.11.31:8091/web3dProjects/3Ddata/nfch/video/right_new.mp4',
   id: 'videoPutIn',
   format: smart3d.VideoFormat.mp4,
   position: new Cesium.Cartesian3.fromDegreesArrayHeights(rect.split(',').map(Number))
});
 * @param viewer - 视图对象.
 * @param options - 具有以下属性的对象:
 * @param options.url - 视频的地址.
 * @param options.position - 视频投放的顶点数组,建议只使用4个顶点.
 * @param options.format - 视频标签中的视频格式,详情请参考{@link VideoFormat}.
 * @param [options.flvjs] - flvjs接口类，如果为空则直接获取window.flvjs.
 * @param [options.id] - 视频对象的ID.
 * @param [options.container] - 视频标签所在的父容器,格式为DOM或者ID,如果不传，则取{@linkViewer#container}
 * @param [options.visiable = true] - 是否视频可见，默认true.
 * @param [options.clearBlack = true] - 是否去掉视频中存在的黑色干扰.
 * @param [options.show = true] - 是否显示该视频对象.
 * @param [options.currentTime] - 指定视频跳转播放的时间.
 * @param [options.uvPosition = [0, 1, 1, 1, 1, 0, 0, 0]] - 视频投放的顶点所对应的材质的UV坐标.
 */
  export class VideoPutIn extends VideoTag {
      constructor(
      viewer: Viewer,
      options: {
        url: string;
        position: Cesium.Cartesian3[];
        format: VideoFormat;
        flvjs?: string;
        id?: string;
        container?: Element | string;
        visiable?: string;
        clearBlack?: string;
        show?: boolean;
        currentTime?: number;
        uvPosition?: number[];
      }
    );
    /**
     * 获取或者设置投放对象的显隐
     */
    visiable: boolean;
    /**
     * 获取投放对象的顶点坐标
     */
    positions: Cesium.Cartesian3[];
    /**
     * 定位到视频投放对象
     */
    locate(): void;
    /**
     * 是否已销毁
     * @returns 是否已销毁
     */
    isDestroy(): boolean;
    /**
     * 销毁该对象
     */
    destroy(): void;
  }

  /**
 * 视频投影对象，基于flvjs的视频播放，兼容flv和mp4格式视频
 * @example
 * var videoShadow = new smart3d.VideoShadow(viewer, {
   url: 'http://172.16.11.31:8091/web3dProjects/3Ddata/nfch/video/right_old.mp4',
   format: smart3d.VideoFormat.mp4,
   far: 60,
   fov: 45.7,
   near: 1,
   alpha: 1,
   aspectRatio: 1.7,
   viewCenter: new Cesium.Cartesian3(-2331383.766963718, 5383103.729413851, 2495178.863984553),
   cameraPosition: new Cesium.Cartesian3(-2331377.339650116, 5383128.592208995, 2495202.004821478)
});
 * @param viewer - 视图对象.
 * @param options - 具有以下属性的对象:
 * @param options.url - 是否隐藏该视频标签.
 * @param options.far - 视频参数中的far.
 * @param options.fov - 视频参数中的fov.
 * @param options.near - 视频参数中的near.
 * @param options.aspectRatio - 视频参数中的aspectRatio.
 * @param options.format - 视频标签中的视频格式,详情请参考{@link VideoFormat}.
 * @param options.viewCenter - 视频标签中的视频的中心点位置.
 * @param options.cameraPosition - 视频标签中的视频的相机位置.
 * @param [options.flvjs] - flvjs接口类，如果为空则直接获取window.flvjs.
 * @param [options.id] - 视频对象的ID.
 * @param [options.visiable = true] - 是否视频可见，默认为true.
 * @param [options.container] - 视频标签所在的父容器,格式为DOM或者ID,如果不传，则取{@linkViewer#container}
 * @param [options.alpha] - 视频对象的透明度.
 * @param [options.clearBlack = true] - 是否去掉视频中存在的黑色干扰.
 * @param [options.currentTime] - 指定视频跳转播放的时间.
 * @param [options.ROI] - 画面裁剪区域，要求传入4维平面笛卡尔坐标，其中w=1，坐标个数大于或等于3,传入该参数会使得useROI为true，不传则为false.
 * @param [options.useOccluder = false] - 地物遮挡效果开关.
 */
  export class VideoShadow extends VideoTag {
      constructor(
      viewer: Viewer,
      options: {
        url: string;
        far: number;
        fov: number;
        near: number;
        aspectRatio: number;
        format: VideoFormat;
        viewCenter: Cesium.Cartesian3;
        cameraPosition: Cesium.Cartesian3;
        flvjs?: string;
        id?: string;
        visiable?: boolean;
        container?: Element | string;
        alpha?: number;
        clearBlack?: string;
        currentTime?: number;
        ROI?: Cesium.Cartesian4[];
        useOccluder?: boolean;
      }
    );
    /**
     * 定位到视频投影对象
     */
      locate(): void;
      /**
     * @returns 是否已销毁
     */
      isDestroyed(): boolean;
      /**
     * 销毁该对象
     */
      destroy(): void;
  }

  /**
   * 视频的播放状态
   */
  const enum VideoState {
    /**
     * 播放
     */
    play = 'play',
    /**
     * 暂停
     */
    pause = 'pause',
    /**
     * 停止
     */
    stop = 'stop',
    /**
     * 错误
     */
    error = 'error',
    /**
     * 未创建该对象
     */
    needToCreate = 'needToCreate'
  }

  /**
   * 一个包含有视频的dom元素,主要使用于视频相关的功能
   * @param viewer - 视图对象.
   * @param options - 具有以下属性的对象:
   * @param options.url - 是否隐藏该视频标签.
   * @param options.format - 视频标签中的视频格式,详情请参考{@link VideoFormat}.
   * @param [options.flvjs] - flvjs接口类，如果为空则直接获取window.flvjs.
   * @param [options.id] - 视频对象的ID.
   * @param [options.container] - 视频标签所在的父容器,格式为DOM或者ID,如果不传，则取{@linkViewer#container}
   * @param [options.visiable = true] - 是否隐藏该视频标签.
   * @param [options.currentTime] - 指定视频跳转播放的时间.
   */
  export class VideoTag {
      constructor(
      viewer: Viewer,
      options: {
        url: string;
        format: VideoFormat;
        flvjs?: string;
        id?: string;
        container?: Element | string;
        visiable?: boolean;
        currentTime?: number;
      }
    );
    /**
     * 获取或者设置视频标签的显隐
     */
    visiable: boolean;
    /**
     * 返回当前视频的播放状态
     */
    readonly state: VideoState;
    /**
     * 视频异步加载错误时触发的事件
     */
    readonly errorEvent: Cesium.Event;
    /**
     * 视频标签所在的父容器
     */
    readonly container: Element;
    /**
     * 创建的video标签
     */
    readonly videoElement: HTMLVideoElement;
    /**
     * 返回flvjs创建的Player对象，有NativePlayer, FlvPlayer
     */
    readonly video: any;
    /**
     * 加载视频
     */
    load(): void;
    /**
     * 跳转视频到指定时间
     * @param time - 需要跳转到的时间
     */
    locateToTime(time: number): void;
    /**
     * 切换视频
     * @param url - 视频地址
     * @param format - 视频格式
     */
    changeVideo(url: string, format: VideoFormat): void;
    /**
     * 刷新视频
     */
    refresh(): void;
    /**
     * 暂停视频
     */
    pause(): void;
    /**
     * 播放视频
     */
    play(): void;
    /**
     * 停止视频
     */
    stop(): void;
    /**
     * 是否销毁
     * @returns 是否已经销毁
     */
    isDestroy(): boolean;
    /**
     * 销毁
     */
    destroy(): void;
  }

  /**
 * 场景视图，继承于cesiumjs的<a href="http://southsmart.com/smartmap/smart3d/cesiumdoc/Viewer.html">Viewer</a>类，保留下viewer一些属性和方法<br>
默认鼠标操作为左键平移，滚轮缩放，右键旋转，ctrl+左键旋转，ctrl+右键微缩放。
 * @example
 * // 创建默认场景
var viewer = new smart3d.Viewer('container');

// 设置引导控件的显示时间
var viewer = new smart3d.Viewer('container', {
  helper: {
    duration: 1
  },
});

// 隐藏场景中的控件
var viewer = new smart3d.Viewer('container', {
  helper: false,
  location: false,
  baseLayerPicker: false,
  navigation: false,
});

// 设置场景默认底图
var viewer = new smart3d.Viewer('container', {
  baseMapMode: smart3d.BaseMapMode.GOOGLE
});

// 设置导航控件的模式
var viewer = new smart3d.Viewer('container', {
  navigation: {
    navigationMode: smart3d.NavigationMode.Both
  },
});
 * @param container - DOM元素或者元素ID。
 * @param [options.shadows = false] - 是否开启由太阳照射的阴影.
 * @param [options.terrainProvider = TerrainManager.createNoTerrain()] - 配置加载的地形数据.
 * @param [options.baseMapMode = BaseMapMode.TIANDITU] - 底图模式, 默认为天地图影像底图.
 * @param [options.location = true] - 是否开启场景底部位置信息控件.
 * @param [options.baseLayerPicker = true] - 是否开启场景底图选择控件.
 * @param [options.sceneMode = SceneMode.SCENE3D] - 视图模式, 默认3D模式.
 * @param [options.copyrightLogo = true] - 公司版权标识, 默认显示.
 * @param [options.navigation = true] - 三维导航控件{@link Navigation}, 默认开启.
 * @param [options.navigation.navigationMode = NavigationMode.Both] - 导航控件显示模式.
 * @param [options.navigation.controls] - 展示的导航控件集合{@link ControlCollection}的options.
 * @param [options.helper = true] - 是否开启初始加载帮助控件{@link Helper}.
 * @param [options.helper.duration = 2] - 初始加载帮助控件持续时间，单位秒.
 */
  export class Viewer extends Cesium.Viewer {
      constructor(
      container: Element | string,
      options?: {
        shadows?: boolean;
        terrainProvider?: Cesium.TerrainProvider;
        baseMapMode?: BaseMapMode;
        location?: boolean;
        baseLayerPicker?: boolean;
        sceneMode?: boolean;
        copyrightLogo?: boolean;
        navigation?: {
          navigationMode?: NavigationMode;
          controls?: any;
        };
        helper?: {
          duration?: number;
        };
      }
    );
    /**
     * 场景相机(camera)对象
     */
    readonly camera: Cesium.Camera;
    /**
     * 获取或设置将要被可视化的数据源DataSource实例集合
     */
    readonly dataSources: Cesium.DataSourceCollection;
    /**
     * 获取场景(scene)对象
     */
    readonly scene: Cesium.Scene;
    /**
     * 获取场景(shadows)对象
     */
    shadows: boolean;
    /**
     * 获取场景(shadowMap)对象
     */
    readonly shadowMap: Cesium.ShadowMap;
    /**
     * 获取场景(terrainProvider)对象
     */
    terrainProvider: Cesium.TerrainProvider;
    /**
     * 获取场景(ImageryLayerCollection)地图瓦片的集合
     */
    readonly imageryLayers: Cesium.ImageryLayerCollection;
    /**
     * 三维平台的copyright信息
     */
    copyright: any;
    /**
     * 三维导航控件
     */
    readonly navigation: Navigation;
    /**
     * 底部场景状态控件
     */
    readonly location: Location;
    /**
     * 场景底图选择控件
     */
    readonly baseLayerPicker: Cesium.BaseLayerPicker;
    /**
     * 场景帮助控件
     */
    readonly helper: Helper;
    /**
     * 场景初始化时默认朝向
     */
    readonly homeOrientation: Cesium.HeadingPitchRoll;
    /**
     * 场景初始化时默认位置
     */
    readonly homeDestination: Cesium.Cartesian3;
    /**
     * 获取或设置场景瓦片底图模式
     */
    baseMapMode: BaseMapMode;
    /**
     * 飞行到场景home点的位置
     */
    flyToHome(): void;
    /**
     * 场景放大
     */
    zoomIn(): void;
    /**
     * 场景缩小
     */
    zoomOut(): void;
    /**
     * 场景全屏
     */
    fullScreen(): void;
    /**
     * 退出全屏
     */
    exitFullscreen(): void;
    /**
     * 设置初始位置和视角
     * @param destination - home位置
     * @param orientation - home视角
     */
    setHome(
      destination: Cesium.Cartesian3,
      orientation: Cesium.HeadingPitchRoll
    ): void;
    /**
     * 快速指北
     */
    setNorth(): void;
    /**
     * 屏幕截图
     * @param [width] - 图片宽度，默认场景宽度
     * @param [height] - 图片高度，默认场景高度
     * @param [type = 'image/png'] - 图片格式，默认使用PNG格式
     * @param [quality] - 图片质量，默认不传值，在指定图片格式为 image/jpeg 或 image/webp的情况下，可以从 0 到 1 的区间内选择图片的质量。如果超出取值范围，将会使用默认值 0.92。其他参数会被忽略。
     * @returns 截取当前屏幕的base64图片
     */
    saveSceneAsIMG(
      width?: number,
      height?: number,
      type?: string,
      quality?: number
    ): string;
    /**
     * 切换为二维模式
     * @param [options.duration = 2] - 模式切换飞行持续时间，秒为单位
     */
    modeSwitchTo2DSVG(): void;
    /**
     * 切换为三维模式
     * @param [options.duration = 2] - 模式切换飞行持续时间，秒为单位
     */
    modeSwitchTo3DSVG(): void;
    /**
     * 获取当前Viewer的相机焦点
     * @param [inWorldCoordinates] - 若要在世界坐标系中获取焦点，则为true；否则，在投影特定的地图坐标系中获取焦点，单位为米。主要是区别三维地球模式和其他模式
     * @param [result] - 返回的结果对象。
     * @returns 修改后的结果参数，如果没有提供新实例，则为新实例；如果没有焦点，则为undefined。
     */
    getCameraFocus(
      inWorldCoordinates?: boolean,
      result?: Cesium.Cartesian3
    ): Cesium.Cartesian3;
    /**
     * 重绘当前屏幕
     */
    resize(): void;
    /**
     * 设置滚轮缩放和右键拖拽旋转时的圆圈指示
     */
    createCameraControllerIndicator(): void;
    /**
     * 初始化和相机控制器有关的参数
     */
    initializeCameraControllerParameters(): void;
    /**
     * @returns 返回 true 表示已被销毁，否则 false
     */
    isDestroyed(): boolean;
    /**
     * 销毁并释放该对象
     * @returns 默认返回值为true，表示销毁成功
     */
    destroy(): boolean;
  }

  /**
   * 水面抽象类
   */
  export class Water {
      /**
     * 创建水面Primitive
     * @param polygon - 面的geometry对象
     * @param [options.normalMap] - 水正常扰动的法线图
     * @param [options.frequency = 8000.0] - 水波数的数值
     * @param [options.animationSpeed = 0.03] - 水的动画速度的数值
     * @param [options.amplitude = 5.0] - 水波振幅的数值
     * @param [options.specularIntensity = 0.8] - 镜面反射强度的数值
     * @param [options.baseWaterColor = #123e59ff] - 水的颜色对象基础颜色
     * @param [options.blendColor = #123e59ff] - 混合到非水域时使用的rgba颜色对象
     * @returns 返回 Primitive 图元信息
     */
      static createWaterPrimitive(
      polygon: Cesium.PolygonGeometry,
      options?: {
        normalMap?: string;
        frequency?: number;
        animationSpeed?: number;
        amplitude?: number;
        specularIntensity?: number;
        baseWaterColor?: string;
        blendColor?: string;
      }
    ): Cesium.Primitive;
  }

  /**
 * 生成一个包含倒影、水波的水面 Primitive。
 * @example
 * // 1. √ 添加一个 initUniforms 为默认值的水面
const positions = [
  [ 115.05803211572922, 30.28316871042846, ],
  [ 115.05546473073969, 30.248825013772553, ],
  [ 115.09136257012089, 30.245732417210274, ],
  [ 115.09276301162032, 30.27941133364575, ],
];
const water = new WaterPrimitive({
  scene : viewer.scene,
  positions : positions,
  height : 15
});
viewer.scene.primitives.add( water );

// 2. × 不要把 WaterPrimitive 实例添加到新的 PrimitiveCollection 实例中，
//      否则 primitiveCollection.show 设为 false 时会报错。
//      目前只能添加到 scene.primitives 中。
const primitiveCollection = new Cesium.PrimitiveCollection();
const water = new WaterPrimitive({
  scene : viewer.scene,
  positions : positions,
  height : 15
});
primitiveCollection.add(water);
 * @param options - 一个具有以下属性的对象：
 * @param options.positions - 水面经纬度，格式为 [ [ longitude, latitude ], [ longitude, latitude ], ...]，单位为角度。
 * @param options.height - 水面的高度，单位为米。
 * @param [options.show = true] - 是否显示该水面。
 * @param [options.flowDegrees = 0] - 顺时针角度改变水流方向，使用默认的法线贴图时，水流方向默认为西南方，正值为顺时针方向，例如 45 为西方，-135 为东方。具体方向取决于法线贴图。
 * @param [options.initUniforms = {}] - 一个具有以下属性的对象：
 * @param [options.initUniforms.normalMapUrl] - 法线贴图的URL，不同的法线贴图会有不同的流向、流速、波纹效果。
 * @param [options.initUniforms.size = 50.0] - 水面波纹的尺寸，值越大，波纹越密集。
 * @param [options.initUniforms.waterColor = Color.fromCssColorString( '#001e0f' )] - 水的颜色
 * @param [options.initUniforms.rf0 = 0.3] - 水的反射系数基数，数值越小，反射率越小，倒影越少，可用于浑浊的水面；数值越大，反射率越大，倒影越多，可用于清澈的水面。
 * @param [options.initUniforms.lightDirection = new Cartesian3( 0, 0, 1 )] - 光照方向，单位向量。原点为水面中心点，水面中心点由 options.positions 决定，X、Y、Z轴对应水面中心点的东、北、上方向。
 * @param [options.initUniforms.sunShiny = 100.0] - 光照强度，数值越小，水面越亮。
 * @param [options.initUniforms.distortionScale = 3.7] - 水面倒影的扭曲程度，数值越大，倒影越扭曲。
 * @param [options.initUniforms.sigma = 7.0] - 水面倒影的模糊程度，数值越大，倒影越模糊。
 * @param [options.asynchronous = true] - 确定该 Primitive 是异步创建还是阻塞直到 ready 状态。
 * @param [options.debugShowBoundingVolume = false] - 仅用于调试。是否显示此水面 Primitive 的绘制命令的包围球。
 * @param [options.debugOutputReflectionTexture = false] - 仅用于调试。是否输出反射纹理的像素值。
 */
  export class WaterPrimitive {
      constructor(options: {
      scene: Cesium.Scene;
      positions: number[][];
      height: number;
      show?: boolean;
      flowDegrees?: number;
      initUniforms?: {
        normalMapUrl?: string;
        size?: number;
        waterColor?: Cesium.Color;
        rf0?: number;
        lightDirection?: Cesium.Cartesian3;
        sunShiny?: number;
        distortionScale?: number;
        sigma?: number;
      };
      asynchronous?: boolean;
      debugShowBoundingVolume?: boolean;
      debugOutputReflectionTexture?: boolean;
    });
    /**
     * 是否输出反射纹理的像素值。
     */
    debugOutputReflectionTexture: boolean;
    /**
     * 是否显示该水面。
     */
    show: boolean;
    /**
     * 销毁此对象拥有的WebGL资源。销毁对象允许确定性地释放WebGL资源，而不是依靠垃圾回收器销毁此对象。
     */
    destroy(): void;
    /**
     * 设置水面位置的偏移。
     * @example
     * // 1. 把水面抬高 10 米。
    const offset = new Cesium.Cartesian3( 0.0, 0.0, 10.0 );
    water.updateTranslation( offset );

    // 2. 把水面往东挪 100 米、往北挪 200 米、往上挪 300 米。
    const offset = new Cesium.Cartesian3( 100.0, 200.0, 300.0 );
    water.updateTranslation( offset );
     * @param eastNorthUp - 以水面中心为原点的东、北、上坐标系。
     */
    updateTranslation(eastNorthUp: Cesium.Cartesian3): void;
    /**
     * 修改水面的颜色。
     * @param color - 水面的颜色
     */
    updateWaterColor(color: Cesium.Color): void;
    /**
     * 修改水面波纹的尺寸。
     * @param size - 水面波纹尺寸
     */
    updateWaterSize(size: number): void;
    /**
     * 修改水的反射系数基数。数值越小，反射率越小，倒影越少，可用于浑浊的水面；数值越大，反射率越大，倒影越多，可用于清澈的水面。
     * @param rf0 - 反射系数基数
     */
    updateRf0(rf0: number): void;
    /**
     * 修改光照亮度参数，数值越小，水面高亮越高。
     * @param shiny - 光照亮度参数
     */
    updateShiny(shiny: number): void;
    /**
     * 修改水面倒影的扭曲程度。
     * @param scale - 倒影的扭曲程度
     */
    updateDistortionScale(scale: number): void;
    /**
     * 修改水面倒影的模糊程度，数值越大，越模糊。
     * @param sigma - 倒影的模糊程度
     */
    updateSigma(sigma: number): void;
    /**
     * 修改光照方向
     * @param direction - 光照方向
     */
    updateLightDirection(direction: Cesium.Cartesian3): void;
    /**
     * 获取水面在局部空间的中心点，由实例化时传进来的 positions 决定。
     */
    readonly positionMC: Cesium.Cartesian3;
    /**
     * 实例化时传进来的 {@link Scene}。
     */
    readonly scene: Cesium.Scene;
    /**
     * 是否将在 Web Worker 上创建且分批处理几何实例。
     */
    readonly asynchronous: boolean;
    /**
     * 该属性仅用于调试，不能用于生产用途，也未经过优化。
    <p>
    为水面 Primitive 中的每个绘制命令绘制包围球。
    </p>
     */
    debugShowBoundingVolume: boolean;
    /**
     * 反射纹理的像素值，当 {@link WaterPrimitive#debugOutputReflectionTexture} 为 <code>true</code> 时可用。
     * @example
     * // 1. 输出反射纹理到另一个 canvas，仅用于调试
    const water = new WaterPrimitive({
      scene : viewer.scene,
      positions : positions,
      height : 15,
      debugOutputReflectionTexture : true,
    });
    viewer.scene.primitives.add( water );

    const ctx = document.getElementById( 'canvas' ).getContext( '2d' );

    viewer.scene.postRender.addEventListener(() => {
      const imageData = water.reflectionImageData;
      if ( imageData instanceof ImageData ) {
        ctx.canvas.width = water.reflectionTextureWidth;
        ctx.canvas.height = water.reflectionTextureHeight;
        ctx.putImageData( imageData, 0, 0 );
      }
    });
     */
    readonly reflectionImageData: ImageData | undefined;
    /**
     * 反射纹理的宽度，当 {@link WaterPrimitive#debugOutputReflectionTexture} 为 <code>true</code> 时可用。
     */
    readonly reflectionTextureWidth: number;
    /**
     * 反射纹理的高度，当 {@link WaterPrimitive#debugOutputReflectionTexture} 为 <code>true</code> 时可用。
     */
    readonly reflectionTextureHeight: number;
  }

  /**
 * WMS 服务的单图加载渲染，这样可以去掉瓦片切片方式 {@link WebMapServiceImageryProvider} 加载时出现标注要素重复问题。
 * @example
 * var layer = new smart3d.WmsSingleImagery(viewer, {
  url: 'http://172.16.123.117:8080/geoserver/wuwei/wms',
  layers: 'wuwei:road',
  rectangle: Cesium.Rectangle.fromDegrees(102.15172118000004, 37.40107567800004, 103.16533059800008, 38.18435294200003),
  parameters: {
     format: 'image/png',
     transparent: true,
  },
});
layer.imageryProvider.readyPromise.then(function() {})
 * @param viewer - 视图
 * @param options.url - WMS服务url地址，例如：http://ipORdomain/geoserver/xxx/wms
 * @param options.layers - 要包含的图层，用逗号分隔，例如：xxx:road
 * @param [options.parameters = WmsSingleImagery.DefaultParameters] - 要在GetMap URL中传递到WMS服务器的其他参数
 * @param [options.rectangle = Rectangle.MAX_VALUE] - 图层的矩形范围
 * @param [options.tilingScheme = new GeographicTilingScheme()] - 用于将世界划分为瓦片的瓦片方案
 * @param [options.ellipsoid] - 椭球体。如果指定了平铺方案，则忽略此参数，并使用平铺方案的椭球。如果未指定任何参数，则使用WGS84椭球体
 * @param [options.crs] - CRS 规范, 用在 WMS 的规范版本 >= 1.3.0
 * @param [options.srs] - SRS 规范, 用在 WMS 的规范版本 1.1.0 or 1.1.1
 * @param [options.credit] - 数据源的信用标识，显示在画布上
 */
  export class WmsSingleImagery {
      constructor(
      viewer: Viewer,
      options: {
        url: Cesium.Resource | string;
        layers: string;
        parameters?: any;
        rectangle?: Cesium.Rectangle;
        tilingScheme?: Cesium.TilingScheme;
        ellipsoid?: Cesium.Ellipsoid;
        crs?: string;
        srs?: string;
        credit?: Cesium.Credit | string;
      }
    );
    /**
     * 获取创建的图层
     */
    layer: Cesium.ImageryLayer;
    /**
     * 销毁并移除图层
     * @returns undefined
     */
    destroy(): any;
    /**
     * The default parameters to include in the WMS URL to obtain images.  The values are as follows:
       service=WMS
       version=1.3.0
       request=GetMap
       styles=
       format=image/jpeg
     */
    static readonly DefaultParameters: any;
  }

  /**
 * 雾特效对象
 * @example
 * var fogEffect = new smart3d.FogEffect(scene);

// 设置雾浓度
var fogEffect = new smart3d.FogEffect(scene，{trength:0.3});
 * @param scene - 场景实例
 * @param [options.trength] - 雾浓度，值范围[0-1],值越大，雾浓度越大，默认值0.5
 */
  export class FogEffect {
      constructor(
      scene: Cesium.Scene,
      options?: {
        trength?: number;
      }
    );
    /**
     * 添加雾特效
     */
      add(): void;
      /**
     * 更新雾强度
     * @example
     * fogEffect.update(0.5);
     * @param trength - 雾强度，值范围[0-1],值越大，雾浓度越大
     */
      update(trength: number): void;
      /**
     * 移除雾效果
     */
      clear(): void;
  }

  /**
   * 粒子特效类
   * @param viewer - 场景实例
   */
  export class ParticleEffect {
      constructor(viewer: Viewer);
    /**
     * 粒子对象集合
     */
    particleArr: Cesium.ParticleSystem[];
    /**
     * 粒子承载实体集合
     */
    entitys: Cesium.Entity[];
    /**
     * 添加粒子特效
     * @example
     * // 雨
    var options = {
       particleMode: smart3d.ParticleMode.RAIN,
       minimumSpeed: -1.0,
       maximumSpeed: 1,
       minimumParticleLife: 1,
       maximumParticleLife: 15,
       startScale: 1,
       endScale: 5,
       emissionRate: 2000,
     }
     particleEffect.add(options);

    // 雪
    var options = {
       particleMode: smart3d.ParticleMode.SNOW,
       minimumSpeed: -1.0,
       maximumSpeed: 1,
       minimumParticleLife: 1,
       maximumParticleLife: 50,
       startScale: 1,
       endScale: 5,
       emissionRate: 1000,
     }
     particleEffect.add(options);

    // 火
    var staticPosition = Cesium.Cartesian3.fromDegrees(115.760367, 24.113540, 125.28);
    var fireEntity = viewer.entities.add({
      position: staticPosition
    });
    viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(115.760192, 24.104992, 135.17),
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(0),
        roll: Cesium.Math.toRadians(0)
      }
    });
    options = {
      particleMode: smart3d.ParticleMode.FIRE,
      entity: fireEntity,
      minimumSpeed: 1,
      maximumSpeed: 5,
      minimumParticleLife: 1,
      maximumParticleLife: 20,
      startScale: 0,
      endScale: 10,
      emissionRate: 4,
      imageSize: 10
    }
    particleEffect.add(options);

    // 喷泉
    var staticPosition = Cesium.Cartesian3.fromDegrees(115.760367, 24.113540, 125.28);
    var entity = viewer.entities.add({
      position: staticPosition
    });
    viewer.trackedEntity = entity;
    options = {
      particleMode: smart3d.ParticleMode.FONTAN,
      entity: entity,
      minimumSpeed: 9,
      maximumSpeed: 10,
      minimumParticleLife: 6,
      maximumParticleLife: 7,
      startScale: 1,
      endScale: 20,
      emissionRate: 30,
      imageSize: 2
    }
    particleEffect.add(options);

    // 烟
    var staticPosition = Cesium.Cartesian3.fromDegrees(115.761367, 24.114540, 125.28);
    var entity = viewer.entities.add({
      position: staticPosition
    });
    viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(115.760192, 24.104992, 135.17),
      orientation: {
        heading: Cesium.Math.toRadians(15),
        pitch: Cesium.Math.toRadians(0),
        roll: Cesium.Math.toRadians(0)
      }
    });
    options = {
      particleMode: smart3d.ParticleMode.SMOKE,
      entity: entity,
      minimumSpeed: 1,
      maximumSpeed: 5,
      minimumParticleLife: 1,
      maximumParticleLife: 4,
      startScale: 1,
      endScale: 5,
      emissionRate: 5,
      imageSize: 25
    }
    particleEffect.add(options);
     * @param options - 该对象具有以下属性
     * @param [options.particleMode] - 粒子类型
     * @param [options.entity] - 粒子承载实体
     * @param [options.emissionRate = 5] - 每秒发射的粒子数
     * @param [options.imageSize = 1.0] - 粒子大小
     * @param [options.minimumParticleLife = 1.0] - 设置粒子寿命可能的最小持续时间，单位秒
     * @param [options.maximumParticleLife = 10.0] - 设置粒子寿命可能的最大持续时间，单位秒
     * @param [options.minimumSpeed = 1.0] - 设置粒子可能的最小速度，单位米/秒
     * @param [options.maximumSpeed = 5.0] - 设置粒子可能的最大速度，单位米/秒
     * @param [options.startScale = 1] - 粒子寿命开始时应用于粒子图像的初始比例
     * @param [options.endScale = 5] - 粒子寿命结束时应用于粒子图像的最终比例
     * @param [options.startColor] - 粒子寿命开始时的颜色
     * @param [options.endColor] - 粒子寿命结束时的颜色
     */
    add(options: {
      particleMode?: ParticleMode;
      entity?: Cesium.Entity;
      emissionRate?: number;
      imageSize?: number;
      minimumParticleLife?: number;
      maximumParticleLife?: number;
      minimumSpeed?: number;
      maximumSpeed?: number;
      startScale?: number;
      endScale?: number;
      startColor?: Cesium.Color;
      endColor?: Cesium.Color;
    }): void;
    /**
     * 移除粒子效果
     */
    remove(): void;
    /**
     * 销毁
     */
    destroy(): void;
  }

  /**
   * 粒子特效模式
   */
  const enum ParticleMode {
    /**
     * 雪
     */
    SNOW = 'snow',
    /**
     * 雨
     */
    RAIN = 'rain',
    /**
     * 火
     */
    FIRE = 'fire',
    /**
     * 烟
     */
    SMOKE = 'smoke',
    /**
     * 喷泉
     */
    FONTAN = 'fontan'
  }

  /**
   * 雨特效对象
   * @example
   * var rainEffect = new smart3d.RainEffect(scene);
   * @param scene - 场景实例
   */
  export class RainEffect {
      constructor(scene: Cesium.Scene);
      /**
     * 添加雨效果
     * @param [uniforms] - 其属性将用于设置着色器制服的对象。属性可以是常量值或函数。常量值也可以是用作纹理的URI、数据URI或HTML元素。
     */
      add(uniforms?: any): void;
      /**
     * 移除雨效果
     */
      clear(): void;
  }

  /**
 * 雪效果
 * @example
 * var snowEffect = new smart3d.SnowEffect(scene);
snowEffect.add();
 * @param scene - 场景实例
 * @param [options.alpha] - 积雪程度, 值范围[0-1]，值越大，积雪程度越高
 */
  export class SnowEffect {
      constructor(
      scene: Cesium.Scene,
      options?: {
        alpha?: number;
      }
    );
    /**
     * 添加雪效果
     */
      add(): void;
      /**
     * 更新积雪程度
     * @example
     * snowEffect.update(0.5);
     * @param alpha - 积雪程度,值范围[0-1]，值越大，积雪程度越高
     */
      update(alpha: number): void;
      /**
     * 移除雪效果
     */
      clear(): void;
  }

  /**
 * {@link ImageryProvider} 在每一块具有可控背景和光泽的瓷砖上绘制一个六边形线框网格.
可能对自定义呈现效果或调试地形有用.
 * @param [options.tilingScheme = new GeographicTilingScheme()] - 用于绘制瓷砖的瓷砖方案.
 * @param [options.ellipsoid = Ellipsoid.WGS84] - 椭球体。如果指定了TilingScheme瓷砖方案，则忽略该参数。
 * @param [options.cells = 8] - 网格单元数.
 * @param [options.color = new Color(1.0, 1.0, 1.0, 0.4)] - 绘制网格线的颜色.
 * @param [options.glowWidth = 6] - 用于呈现线条辉光效果的线条宽度.
 * @param [options.backgroundColor = new Color(0.0, 0.5, 0.0, 0.2)] - 背景填充颜色.
 * @param [options.tileWidth = 256] - 用于详细级别选择的瓷砖的宽度.
 * @param [options.tileHeight = 256] - 用于详细级别选择的瓷砖的高度.
 * @param [options.canvasSize = 256] - 用于呈现的画布的大小.
 */
  export class HexagonalGridImageryProvider {
      constructor(options?: {
      tilingScheme?: Cesium.TilingScheme;
      ellipsoid?: Cesium.Ellipsoid;
      cells?: number;
      color?: Cesium.Color;
      glowWidth?: number;
      backgroundColor?: Cesium.Color;
      tileWidth?: number;
      tileHeight?: number;
      canvasSize?: number;
    });
    /**
     * 获取此提供程序使用的代理.
     */
    readonly proxy: Cesium.DefaultProxy;
    /**
     * 获取每个瓷砖的宽度(以像素为单位). 此函数不应该在
    {@link HexagonalGridImageryProvider#ready} 返回true之前调用.
     */
    readonly tileWidth: number;
    /**
     * 获取每个瓷砖的高度(以像素为单位). 此函数不应该在
    {@link HexagonalGridImageryProvider#ready} 返回true之前调用.
     */
    readonly tileHeight: number;
    /**
     * 获取可请求的最大级别详细信息. 此函数不应该在
    {@link HexagonalGridImageryProvider#ready} 返回true之前调用.
     */
    readonly maximumLevel: number;
    /**
     * 获取可请求的最小级别详细信息.  此函数不应该在
    {@link HexagonalGridImageryProvider#ready} 返回true之前调用.
     */
    readonly minimumLevel: number;
    /**
     * 获取此提供程序使用的平铺方案.  此函数不应该在
    {@link HexagonalGridImageryProvider#ready} 返回true之前调用.
     */
    readonly tilingScheme: Cesium.TilingScheme;
    /**
     * 以弧度表示此实例提供的影像的矩形.  此函数不应该在
    {@link HexagonalGridImageryProvider#ready} 返回true之前调用.
     */
    readonly rectangle: Cesium.Rectangle;
    /**
     * 获取瓷砖丢弃策略。如果没有定义，丢弃策略将负责通过其ThisdDishardImage函数
    过滤掉“丢失的”瓷砖。如果此函数返回未定义的值，则不会过滤任何瓷砖
    此函数不应该在 {@link HexagonalGridImageryProvider#ready} 返回true之前调用.
     */
    readonly tileDiscardPolicy: Cesium.TileDiscardPolicy;
    /**
     * 获取图像提供程序遇到异步错误时引发的事件。通过订阅对于该事件，您将被通知错误，
    并可能从该错误中恢复。事件侦听器传递了一个{@link TileProviderError}实例.
     */
    readonly errorEvent: Cesium.Event;
    /**
     * 获取指示提供程序是否已准备好使用的值.
     */
    readonly ready: boolean;
    /**
     * 取得当提供者准备使用时解析为true的承诺.
     */
    readonly readyPromise: Promise<boolean>;
    /**
     * 获取当此图像提供程序处于活动状态时要显示的信用。通常，这是用来表示图像的来源的
    此函数不应该在 {@link HexagonalGridImageryProvider#ready} 返回true之前调用.
     */
    readonly credit: Cesium.Credit;
    /**
     * 获取一个值，该值指示此图像提供程序提供的图像是否包括alpha通道。如果此属性为false，
    则将忽略alpha通道(如果存在)。如果此属性为真，则任何没有alpha通道的图像都将被视
    为它们的alpha在任何地方都是1.0。如果此属性为false，则减少内存使用和纹理上载时间。
     */
    readonly hasAlphaChannel: boolean;
    /**
     * 获取在显示给定瓷砖时要显示的学分.
     * @param x - 瓷砖X坐标.
     * @param y - 瓷砖Y坐标.
     * @param level - 瓷砖缩放级别;
     * @returns 显示平铺时将显示的来源标签.
     */
    getTileCredits(x: number, y: number, level: number): Cesium.Credit[];
    /**
     * 请求给定平铺的图像.
    此函数不应该在 {@link HexagonalGridImageryProvider#ready} 返回true之前调用.
     * @param x - 瓷砖X坐标.
     * @param y - 瓷砖Y坐标.
     * @param level - 瓷砖缩放级别.
     * @param [request] - 请求对象。仅供内部使用.
     * @returns 对于映像的承诺，它将在映像可用时解决，或者，如果服务器上有太多的活动请求，则需
             要进行未定义的解析，并且应该在以后重试该请求。解析的图像可以是图像，也可以是Canvas DOM对象.
     */
    requestImage(
      x: number,
      y: number,
      level: number,
      request?: Cesium.Request
    ): Promise<HTMLImageElement | HTMLCanvasElement> | undefined;
    /**
     * 此图像提供者目前不支持选择功能，因此此函数只是返回未定义的功能.
     * @param x - 瓷砖X坐标.
     * @param y - 瓷砖Y坐标.
     * @param level - 瓷砖缩放级别.
     * @param longitude - 拾取特征的经度.
     * @param latitude - 拾取特征的纬度.
     * @returns 将在异步拾取完成时解决所选特性的承诺。
                      已解析的值是{@link ImageryLayerFeatureInfo}实例数组
                      如果在给定位置找不到功能，则数组可能为空。如果不支持采摘，也可能没有定义.
     */
    pickFeatures(
      x: number,
      y: number,
      level: number,
      longitude: number,
      latitude: number
    ): Promise<Cesium.ImageryLayerFeatureInfo[]> | undefined;
  }

  /**
 * {@link ImageryProvider} 自主切片工具影像地图提供器.
 * @example
 * var smartlayer = new smart3d.SmartImageryProvider({
  minimumLevel: 14,
  maximumLevel: 15,
  url: '/modeldata/big',
});
 * @param [options] - 具有以下属性的对象:
 * @param options.url - 影像地图地址,指向瓦片的layer.json文件所在目录.
 * @param [options.minimumLevel = 0] - 瓦片最小显示层级,如果未设置则默认使用layer.json文件中的设置;反之,则使用设置的值.
 * @param [options.maximumLevel = 18] - 瓦片最大显示层级,如果未设置则默认使用layer.json文件中的设置;反之,则使用设置的值.
 * @param [options.tileWidth = 256] - 用于详细级别选择的瓷砖的宽度,如果没有特殊需要,可以使用默认值.
 * @param [options.tileHeight = 256] - 用于详细级别选择的瓷砖的高度,如果没有特殊需要,可以使用默认值.
 * @param [options.fileExtension = 'png'] - 图像文件的扩展名
 */
  export class SmartImageryProvider {
      constructor(options?: {
      url: Cesium.Resource | string;
      minimumLevel?: number;
      maximumLevel?: number;
      tileWidth?: number;
      tileHeight?: number;
      fileExtension?: string;
    });
    /**
     * 获取每个瓷砖的宽度(以像素为单位). 此函数不应该在
    {@link SmartImageryProvider#ready} 返回true之前调用.
     */
    readonly tileWidth: number;
    /**
     * 获取每个瓷砖的高度(以像素为单位). 此函数不应该在
    {@link SmartImageryProvider#ready} 返回true之前调用.
     */
    readonly tileHeight: number;
    /**
     * 获取可请求的最大级别详细信息. 此函数不应该在
    {@link SmartImageryProvider#ready} 返回true之前调用.
     */
    readonly maximumLevel: number;
    /**
     * 获取可请求的最小级别详细信息.  此函数不应该在
    {@link SmartImageryProvider#ready} 返回true之前调用.
     */
    readonly minimumLevel: number;
    /**
     * 获取此提供程序使用的平铺方案.  此函数不应该在
    {@link SmartImageryProvider#ready} 返回true之前调用.
     */
    readonly tilingScheme: Cesium.TilingScheme;
    /**
     * 以弧度表示此实例提供的影像的矩形.  此函数不应该在
    {@link SmartImageryProvider#ready} 返回true之前调用.
     */
    readonly rectangle: Cesium.Rectangle;
    /**
     * 获取瓷砖丢弃策略。如果没有定义，丢弃策略将负责通过其ThisdDishardImage函数
    过滤掉“丢失的”瓷砖。如果此函数返回未定义的值，则不会过滤任何瓷砖
    此函数不应该在 {@link SmartImageryProvider#ready} 返回true之前调用.
     */
    readonly tileDiscardPolicy: Cesium.TileDiscardPolicy;
    /**
     * 获取图像提供程序遇到异步错误时引发的事件。通过订阅对于该事件，您将被通知错误，
    并可能从该错误中恢复。事件侦听器传递了一个{@link TileProviderError}实例.
     */
    readonly errorEvent: Cesium.Event;
    /**
     * 获取指示提供程序是否已准备好使用的值.
     */
    readonly ready: boolean;
    /**
     * 取得当提供者准备使用时解析为true的Promise.
     */
    readonly readyPromise: Promise<boolean>;
    /**
     * 获取当此图像提供程序处于活动状态时要显示的信用。通常，这是用来表示图像的来源的
    此函数不应该在 {@link SmartImageryProvider#ready} 返回true之前调用.
     */
    readonly credit: Cesium.Credit;
    /**
     * 获取一个值，该值指示此图像提供程序提供的图像是否包括alpha通道。如果此属性为false，
    则将忽略alpha通道(如果存在)。如果此属性为真，则任何没有alpha通道的图像都将被视
    为它们的alpha在任何地方都是1.0。如果此属性为false，则减少内存使用和纹理上载时间。
     */
    readonly hasAlphaChannel: boolean;
    /**
     * 显示给定的瓦片信息来源.
     * @param x - 瓦片x坐标.
     * @param y - 瓦片y坐标.
     * @param level - 瓦片层级;
     * @returns 显示的瓦片信息来源.
     */
    getTileCredits(x: number, y: number, level: number): Cesium.Credit[];
    /**
     * 请求指定的瓦片.
    此函数不应该在 {@link SmartImageryProvider#ready} 返回true之前调用.
     * @param x - 瓦片行号.
     * @param y - 瓦片列号.
     * @param level - 瓦片层级.
     * @returns 对于映像的承诺，它将在映像可用时解决，或者，如果服务器上有太多的活动请求，则需
             要进行未定义的解析，并且应该在以后重试该请求。解析的图像可以是图像，也可以是Canvas DOM对象.
     */
    requestImage(
      x: number,
      y: number,
      level: number
    ): Promise<HTMLImageElement | HTMLCanvasElement> | undefined;
  }

  /**
   * 相机旋转工具类。
   * @param viewer - Cesium.Viewer 类实例。
   */
  export class CameraRotationTool {
      constructor(viewer: Viewer);
      /**
     * 环绕某点或 3D tiles 旋转。
     * @example
     * const cameraRotationTool = new smart3d.CameraRotationTool(viewer);
    const options = {
      hpr: new Cesium.HeadingPitchRange(Math.PI / 2.0, -Math.PI / 6.0, 200.0)),
      speed: 30
    };

    // 1. 绕某点旋转
    const origin = new Cesium.Cartesian3(-2355020, 5372867, 2495186);
    cameraRotationTool.surround(origin, options);

    // 2. 或者绕 3D tiles 旋转
    const tileset = new Cesium.Cesium3DTileset({
      url: 'path/to/tileset.json'
    });
    cameraRotationTool.surround(tileset, options);
     * @param origin - 原点。3D tiles 或者笛卡尔坐标。
     * @param [options.hpr = new Cesium.HeadingPitchRange(0.0, -Math.PI / 6.0, 100.0))] - 旋转起始偏航角、俯仰角及偏移量。如果原点参数为 3D tiles，则偏移量的默认值为 3D tiles <strong>包围盒半径与视场角正切值的乘积</strong>，否则为 100。
     * @param [options.speed = 30.0] - 旋转速度，单位为角度每秒。
     */
      surround(
      origin: Cesium.Cesium3DTileset | Cesium.Cartesian3,
      options?: {
        hpr?: Cesium.HeadingPitchRange;
        speed?: number;
      }
    ): void;
    /**
     * 原地向右旋转。
     * @example
     * const cameraRotationTool = new smart3d.CameraRotationTool(viewer);
    cameraRotationTool.rotateInPlace(20);
     * @param [speed = 10.0] - 旋转速度，单位为角度每秒。
     */
      rotateInPlace(speed?: number): void;
      /**
     * 停止旋转。
     * @example
     * cameraRotationTool.stop();
     */
      stop(): void;
      /**
     * 销毁。释放资源。如果不再使用该实例，请务必调用该方法。
     * @example
     * cameraRotationTool = cameraRotationTool && cameraRotationTool.destroy();
     * @returns undefined
     */
      destroy(): any;
  }

  /**
 * 模型剖切类
 * @example
 * var clipping = new smart3d.Clipping(viewer);
clipping.start(tileset, smart3d.ClippingMode.X);
 * @param viewer - 视图
 * @param [options.dimensions = 2] - 切面的尺寸，基于模型尺寸的倍数
 * @param [options.material = Color.WHITE.withAlpha(0.2)] - 切面的材质
 * @param [options.outline = true] - 是否启用切面的外边缘
 * @param [options.outlineColor = Color.WHITE.withAlpha(0.8)] - 切面切边缘的颜色，当outline为true时才有效
 * @param [options.edgeStylingEnabled = false] - 是否开启边缘处的样式
 * @param [options.debugBoundingVolumesEnabled = false] - 是否开启模型包围盒
 * @param [options.isReverse = false] - 是否反转裁切
 */
  export class Clipping {
      constructor(
      viewer: Viewer,
      options: {
        dimensions?: number;
        material?: Cesium.Material;
        outline?: boolean;
        outlineColor?: Cesium.Color;
        edgeStylingEnabled?: boolean;
        debugBoundingVolumesEnabled?: boolean;
        isReverse?: boolean;
      }
    );
    /**
     * 剖面拖动事件监听
     * @example
     * clipping.planeMoveEvent.addEventListener(function(distance) {})
     */
    readonly planeMoveEvent: Cesium.Event;
    /**
     * 开始剖切
     * @param model - 模型数据
     * @param mode - 剖切模式
     * @param [positions = null] - ClippingMode.Line时，需要传入沿线的两点Cartesian3
     */
    start(
      model: Cesium.Cesium3DTileset,
      mode: ClippingMode,
      positions?: Cesium.Cartesian3[]
    ): void;
    /**
     * 更新剖切面距离模型中心距离
     * @param distance - 剖切距离模型中心的距离，正负数代表不同方向
     */
    updateDistance(distance: number): void;
    /**
     * 取反剖切，当已经在剖切时操作有效
     */
    setReverse(): void;
    /**
     * 销毁
     */
    destroy(): void;
  }

  /**
   * 模型剖切模式
   */
  const enum ClippingMode {
    /**
     * x轴
     */
    X = 0,
    /**
     * y轴
     */
    Y = 1,
    /**
     * z轴
     */
    Z = 2,
    /**
     * 两点沿线的剖切
     */
    Line = 3
  }

  /**
   * 互联网坐标转换
   */
  export class CoordTransform {
      constructor();
      /**
     * 百度坐标系(BD-09) 转火星坐标系(GCJ-02)
     * @param bdLon - 经度（百度坐标）
     * @param bdLat - 纬度（百度坐标）
     * @returns {longitude, latitude}
     */
      static bd09togcj02(bdLon: number, bdLat: number): any;
      /**
     * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
    即谷歌、高德 转 百度
     * @param lng - GCJ-02经度
     * @param lat - GCJ-02纬度
     * @returns {longitude, latitude}
     */
      static gcj02tobd09(lng: number, lat: number): any;
      /**
     * WGS84转火星坐标系 (GCJ-02)
     * @param lng - 经度
     * @param lat - 纬度
     * @returns {longitude, latitude}
     */
      static wgs84togcj02(lng: number, lat: number): any;
      /**
     * 火星坐标系 (GCJ-02) 转换为 WGS84
     * @param lng - GCJ-02经度
     * @param lat - GCJ-02纬度
     * @returns {longitude, latitude}
     */
      static gcj02towgs84(lng: number, lat: number): any;
      /**
     * 百度坐标系 (BD-09) 转换为 WGS84
     * @param longitude - BD-09经度
     * @param latitude - BD-09纬度
     * @returns {longitude, latitude}
     */
      static bd09towgs84(longitude: number, latitude: number): any;
      /**
     * WGS84 转换为 百度坐标系 (BD-09)
     * @param lng - 经度
     * @param lat - 纬度
     * @returns {longitude, latitude}
     */
      static wgs84tobd09(lng: number, lat: number): any;
  }

  /**
 * 绘制可编辑长方体
<p>请使用{@link DrawEditableCube}来绘制，这只是它的模式中其中一种绘制</p>
 * @param viewer - 视图
 * @param [options.cuboidStyle] - 长方体样式
 * @param [options.pointStyle] - 编辑点样式
 * @param [options.showOutline = false] - 是否显示外边框
 */
  export class DrawEditableCuboid extends DrawEditBase {
      constructor(
      viewer: Viewer,
      options?: {
        cuboidStyle?: any;
        pointStyle?: any;
        showOutline?: boolean;
      }
    );
    /**
     * 绘制长方体
     */
      draw(): void;
      /**
     * 通过坐标集合点绘制长方体
     * @param positions - 绘制的坐标点集合，集合长度为2
     */
      drawByPositions(positions: Cesium.Cartesian3[]): void;
      /**
     * 编辑
     * @param [primitive] - 需要编辑的primtive
     */
      edit(primitive?: Cesium.Primitive): void;
      /**
     * 取消编辑
     * @param [isSave] - 是否保存当前编辑结果
     */
      exitEdit(isSave?: boolean): void;
      /**
     * 清除
     */
      clear(): void;
      /**
     * 销毁
     */
      destroy(): void;
  }

  /**
 * 绘制可编辑球体
<p>请使用{@link DrawEditableCube}来绘制，这只是它的模式中其中一种绘制</p>
 * @param viewer - 视图
 * @param [options.sphereStyle] - 球体样式
 * @param [options.pointStyle] - 编辑点样式
 * @param [options.showOutline = false] - 是否显示外边框
 */
  export class DrawEditableSphere extends DrawEditBase {
      constructor(
      viewer: Viewer,
      options?: {
        sphereStyle?: any;
        pointStyle?: any;
        showOutline?: boolean;
      }
    );
    /**
     * 绘制球体
     * @param positions - 根据球心坐标点，绘制球体
     */
      draw(positions: Cesium.Cartesian3): void;
      /**
     * 创建球体图元
     * @param options - 球体样式
     * @param isOutline - 是否为外边轮廓
     */
      _creatSphere(options: any, isOutline: boolean): void;
      /**
     * 编辑
     * @param [primitive] - 需要编辑的primtive
     */
      edit(primitive?: Cesium.Primitive): void;
      /**
     * 取消编辑
     * @param [isSave] - 是否保存当前编辑结果
     */
      exitEdit(isSave?: boolean): void;
      /**
     * 清除
     */
      clear(): void;
      /**
     * 销毁
     */
      destroy(): void;
    /**
     * 绘制点的集合
     */
    readonly positions: Cesium.Cartesian3[];
  }

  /**
 * 绘制可编辑垂直圆柱
<p>请使用{@link DrawEditableCube}来绘制，这只是它的模式中其中一种绘制</p>
 * @param viewer - 视图
 * @param [options.verticalCylinderStyle] - 圆柱样式
 * @param [options.pointStyle] - 编辑点样式
 * @param [options.showOutline = false] - 是否显示外边框
 */
  export class DrawEditableVerticalCylinder extends DrawEditBase {
      constructor(
      viewer: Viewer,
      options?: {
        verticalCylinderStyle?: any;
        pointStyle?: any;
        showOutline?: boolean;
      }
    );
    /**
     * 绘制垂直圆柱
     */
      draw(): void;
      /**
     * 编辑
     * @param [primitive] - 需要编辑的primtive
     */
      edit(primitive?: Cesium.Primitive): void;
      /**
     * 根据起始点，获取移动中基于起始点的垂直向上坐标及两点之间的长度
     * @param position - 起始坐标
     * @param endPosition - 鼠标移动的位置
     * @returns 坐标及长度
     */
      _getMovingVerticalPoint(position: Cesium.Cartesian3, endPosition: any): any;
      /**
     * 取消编辑
     * @param [isSave] - 是否保存当前编辑结果
     */
      exitEdit(isSave?: boolean): void;
      /**
     * 清除
     */
      clear(): void;
      /**
     * 销毁
     */
      destroy(): void;
  }

  /**
 * 绘制可编辑圆柱，选择两点形成圆柱
<p>请使用{@link DrawEditableCube}来绘制，这只是它的模式中其中一种绘制</p>
 * @param viewer - 视图
 * @param [options.cylinderStyle] - 圆柱样式
 * @param [options.pointStyle] - 编辑点样式
 * @param [options.showOutline = false] - 是否显示外边框
 */
  export class DrawEditableCylinder extends DrawEditBase {
      constructor(
      viewer: Viewer,
      options?: {
        cylinderStyle?: any;
        pointStyle?: any;
        showOutline?: boolean;
      }
    );
    /**
     * 通过鼠标绘制圆柱
     */
      draw(): void;
      /**
     * 编辑
     * @param [primitive] - 需要编辑的primtive
     */
      edit(primitive?: Cesium.Primitive): void;
      /**
     * 取消编辑
     * @param [isSave] - 是否保存当前编辑结果
     */
      exitEdit(isSave?: boolean): void;
      /**
     * 清除
     */
      clear(): void;
      /**
     * 销毁
     */
      destroy(): void;
  }

  /**
 * 绘制可编辑多面体
<p>请使用{@link DrawEditableCube}来绘制，这只是它的模式中其中一种绘制</p>
 * @param viewer - 视图
 * @param [options.polyhedronStyle] - 多面体样式
 * @param [options.pointStyle] - 编辑点样式
 * @param [options.showOutline = true] - 是否显示外边框
 */
  export class DrawEditablePolyhedron extends DrawEditBase {
      constructor(
      viewer: Viewer,
      options?: {
        polyhedronStyle?: any;
        pointStyle?: any;
        showOutline?: boolean;
      }
    );
    /**
     * 绘制多面体
     */
      draw(): void;
      /**
     * 编辑
     * @param [primitive] - 需要编辑的primtive
     */
      edit(primitive?: Cesium.Primitive): void;
      /**
     * 取消编辑
     * @param [isSave] - 是否保存当前编辑结果
     */
      exitEdit(isSave?: boolean): void;
      /**
     * 清除
     */
      clear(): void;
      /**
     * 销毁
     */
      destroy(): void;
  }

  /**
 * 绘制可编辑立方体
 * @example
 * var cubeHandler = new smart3d.DrawEditableCube(viewer, smart3d.CubeMode.Cylinder);
cubeHandler.draw();
 * @param viewer - 视图
 * @param mode - 立方体模式
 * @param [options.showOutline = false] - 是否显示外边框
 */
  export class DrawEditableCube {
      constructor(
      viewer: Viewer,
      mode: CubeMode,
      options?: {
        showOutline?: boolean;
      }
    );
    /**
     * 绘制圆柱体样式，包含<br>
    radius 圆柱半径<br>
    attributes 属性是{@link GeometryInstance#attributes}<br>
    outlineAttributes 外边框属性，仅在{@link DrawEditableCube#showOutline}开启时有效<br>
    appearance 外观 <br>
    depthFailAppearance 深度测试失败时对该基本体进行着色的外观
     */
    cylinderStyle: any;
    /**
     * 绘制垂直圆柱样式，包含<br>
    radius 圆柱半径<br>
    attributes 属性是{@link GeometryInstance#attributes}<br>
    outlineAttributes 外边框属性，仅在{@link DrawEditableCube#showOutline}开启时有效<br>
    appearance 外观 <br>
    depthFailAppearance 深度测试失败时对该基本体进行着色的外观
     */
    verticalCylinderStyle: any;
    /**
     * 绘制球体样式，包含<br>
    attributes 属性是{@link GeometryInstance#attributes}<br>
    outlineAttributes 外边框属性，仅在{@link DrawEditableCube#showOutline}开启时有效<br>
    appearance 外观 <br>
    depthFailAppearance 深度测试失败时对该基本体进行着色的外观
     */
    sphereStyle: any;
    /**
     * 多面体样式，包含<br>
    extrudedHeight 多面体拉伸高度<br>
    attributes 属性是{@link GeometryInstance#attributes}<br>
    outlineAttributes 外边框属性，仅在{@link DrawEditableCube#showOutline}开启时有效<br>
    appearance 外观 <br>
    depthFailAppearance 深度测试失败时对该基本体进行着色的外观
     */
    polyhedronStyle: any;
    /**
     * 长方体样式，包含<br>
    extrudedHeight 长方体拉伸高度<br>
    attributes 属性是{@link GeometryInstance#attributes}<br>
    outlineAttributes 外边框属性，仅在{@link DrawEditableCube#showOutline}开启时有效<br>
    appearance 外观 <br>
    depthFailAppearance 深度测试失败时对该基本体进行着色的外观
     */
    cuboidStyle: any;
    /**
     * 编辑点外观，包含 <br>
    outlineColor: 点外边缘颜色 <br>
    outlineWidth: 点外边缘宽度 <br>
    pixelSize: 点大小 <br>
     */
    pointStyle: any;
    /**
     * 绘制点的集合
    <p>当绘制垂直柱体时返回的是<code>{top, bottom}</code></p>
     */
    readonly positions: Cesium.Cartesian3[] | any;
    /**
     * 绘制产生属性数据，包含样式/高度/半径/坐标等内容
     */
    readonly attributes: object[];
    /**
     * 绘制体的Primitive集合
     */
    readonly primitives: Cesium.PrimitiveCollection;
    /**
     * 绘制体的外边框的Primitive集合
     */
    readonly outlinePrimitives: Cesium.PrimitiveCollection;
    /**
     * 是否显示外边框，改变后需重新绘制才能够应用
     */
    showOutline: any;
    /**
     * <p>绘制结束事件</p>
    <p>请在激活DrawEditableCube后使用，否则返回null</p>
    <p>返回的是绘制结束后的primitive</p>
     * @example
     * cubeHandler.drawEndEvent.addEventListener(function(result) {

    });
     */
    readonly drawEndEvent: Cesium.Event;
    /**
     * <p>编辑监听事件</p>
    <p>请在激活DrawEditableCube后使用，否则返回null</p>
    <p>返回的是编辑中的primitive</p>
     * @example
     * cubeHandler.editMovingEvent.addEventListener(function(result) {

    });
     */
    readonly editMovingEvent: Cesium.Event;
    /**
     * <p>保存编辑结果事件</p>
    <p>请在激活DrawEditableCube后且进入编辑状态后使用，否则返回null</p>
    <p>当调用取消编辑并保存的方法时，返回的是编辑结束后的primitive</p>
     * @example
     * cubeHandler.exitEdit(ture);
    cubeHandler.editEndEvent.addEventListener(function(result) {

    });
     */
    readonly editEndEvent: Cesium.Event;
    /**
     * 绘制立方体
     */
    draw(): void;
    /**
     * 编辑立方体
     */
    edit(): void;
    /**
     * 取消编辑<br>
    当调用取消编辑并保存的方法时，返回的是编辑结束后的primitive<br>
     * @param [isSave = false] - 是否保存当前编辑结果, ture返回编辑后primitive, false返回初始状态
     */
    exitEdit(isSave?: boolean): void;
    /**
     * 清除所绘制的立方体
     */
    clear(): void;
    /**
     * 销毁所有图层
     * @param [isClear = false] - 是否要销毁移除图层
     */
    destroy(isClear?: boolean): void;
    /**
     * 通过传入点集合创建可编辑立方体<br>
    若为球体时，传入第一个坐标为球心，第二个坐标为球面上任意一点<br>
    请在确保开启深度拾取的状态下使用，否则会出现编辑点位不准确等的问题
     * @example
     * smart3d.DrawEditableCube.drawByPositions(
      viewer,
      {
         positions: positions,
         mode: smart3d.CubeMode.Cuboid,
      }
    );
     * @param viewer - 视图
     * @param options.mode - 平面模式
     * @param options.positions - 点集合
     * @param [options.showOutline] - 是否显示外边框
     * @param [options.verticalCylinderStyle] - 和{@link DrawEditableCube#verticalCylinderStyle} 一样的设置
     * @param [options.sphereStyle] - 和{@link DrawEditableCube#sphereStyle} 一样的设置
     * @param [options.polyhedronStyle] - 和{@link DrawEditableCube#polyhedronStyle} 一样的设置
     * @param [options.cylinderStyle] - 和{@link DrawEditableCube#cylinderStyle} 一样的设置
     * @param [options.cuboidStyle] - 和{@link DrawEditableCube#cuboidStyle} 一样的设置
     * @param [options.pointStyle] - 和{@link DrawEditableCube#pointStyle} 一样的设置
     * @returns 各个绘制三维体的实例
     */
    static drawByPositions(
      viewer: Viewer,
      options: {
        mode: CubeMode;
        positions: Cesium.Cartesian3[];
        showOutline?: boolean;
        verticalCylinderStyle?: any;
        sphereStyle?: any;
        polyhedronStyle?: any;
        cylinderStyle?: any;
        cuboidStyle?: any;
        pointStyle?: any;
      }
    ): any;
    /**
     * 自由编辑体，可以拾取或者传入编辑的Primitive，但只支持通过{@link DrawEditableCube}绘制的
    <p>当传入primitive时，则不触发鼠标拾取</p>
    <p>鼠标交互：左键拾取，右键退出编辑并保存当前状态</p>
     * @example
     * smart3d.DrawEditableCube.freeEdit(viewer, primitive);
     * @param viewer - 视图
     * @param [primtive] - 编辑的primitive对象，该对象一定是通过{@link DrawEditableCube}绘制的
     */
    static freeEdit(viewer: Viewer, primtive?: Cesium.Primitive): void;
    /**
     * 对于 {@link DrawEditableCube#freeEdit} 的触发编辑的状态退出
     * @param [isSave = false] - 是否保存
     * @returns 返回编辑后的primitve
     */
    static freeExitEdit(isSave?: boolean): Cesium.Primitive;
  }

  /**
   * 绘制编辑的基类
   */
  export class DrawEditBase {
    /**
     * 绘制点的集合
     */
    readonly positions: Cesium.Cartesian3[];
    /**
     * 返回绘制时的属性内容，包含样式，点等
     */
    readonly attributes: object[];
    /**
     * 绘制的体集合
     */
    readonly primtives: Cesium.PrimitiveCollection;
    /**
     * 绘制的体轮廓集合
     */
    readonly outlinePrimtives: Cesium.PrimitiveCollection;
    /**
     * 是否显示外边框，改变后需重新绘制才能够应用
     */
    showOutline: any;
  }

  /**
   * 立方体模式
   */
  const enum CubeMode {
    /**
     * 圆柱体
     */
    Cylinder = 'cylinder',
    /**
     * 垂直圆柱
     */
    VerticalCylinder = 'verticalCylinder',
    /**
     * 球体
     */
    Sphere = 'sphere',
    /**
     * 多面体
     */
    Polyhedron = 'polyhedron',
    /**
     * 长方体
     */
    Cuboid = 'cuboid'
  }

  /**
   * 立方体编辑中移动点的类型
   */
  const enum CudeEditPointMode {
    /**
     * 编辑点为长度点
     */
    lengthPoint = 'lengthPoint',
    /**
     * 编辑点为长度点，联动半径点
     */
    lengthLinkRadius = 'changeLengthLinkRadiusPoint',
    /**
     * 编辑点为半径点
     */
    radiusPoint = 'radiusPoint'
  }

  /**
   * 绘制并编辑类封装类
   * @param viewer - 视图对象
   * @param [options.showTip = true] - 是否显示提示
   */
  export class DrawEditableLine {
      constructor(
      viewer: Viewer,
      options?: {
        showTip?: boolean;
      }
    );
    /**
     * 绘制点的样式 <br>
     */
    pointStyle: Cesium.PointPrimitive;
    /**
     * 绘制线样式，包含<br>
    geometry 几何图形，是除去 <code>positions</code> 的 {@link GroundPolylineGeometry} 或者 {@link PolylineGeometry}<br>
    attributes 属性是{@link GeometryInstance#attributes},<br>
    appearance 外观 <br>
    depthFailAppearance 深度测试失败时对该基本体进行着色的外观
     */
    lineStyle: any;
    /**
     * 编辑时点和线样式，包含 <br>
    point: 点的样式，和{@link DrawEditableLine#pointStyle} 一样的设置，不过是默认下color: Cesium.Color.RED <br>
    line: 线的样式，和{@link DrawEditableLine#lineStyle} 一样的设置，不过是默认color: Cesium.Color.YELLOW
     */
    editStyle: any;
    /**
     * 点图元聚集
     */
    readonly pointPrimitives: Cesium.PrimitiveCollection;
    /**
     * 线图元，第一次退出编辑后才能获取的到线图元
     */
    readonly primitive: Cesium.Primitive | Cesium.GroundPrimitive;
    /**
     * 编辑状态
     */
    readonly editStatus: boolean;
    /**
     * 绘制事件
     */
    readonly drawHandler: DrawHandler;
    /**
     * 开始/重新 绘制，绘制后直接进入编辑
     * @param isGround - 是否贴地绘制
     */
    draw(isGround: boolean): void;
    /**
     * 重新进入编辑状态
     */
    reEdit(): void;
    /**
     * 手动退出编辑状态
     * @returns 返回线图元信息
     */
    quitEdit(): Cesium.Primitive | Cesium.GroundPrimitive;
    /**
     * edit 通过传入线的点集合创建可编辑线
     * @example
     * handler.edit(positions);
    handler.quitEdit();
    primitive = handler.primitive;
     * @param positions - 点集合
     */
    edit(positions: Cesium.Cartesian3[]): void;
    /**
     * 清除绘制结果
     */
    clear(): void;
    /**
     * @returns 返回 true 表示已被销毁，否则 false
     */
    isDestroyed(): boolean;
    /**
     * 销毁
     */
    destroy(): void;
  }

  /**
   * 编辑轴模式
   */
  const enum EditAxisActionMode {
    /**
     * 拖动
     */
    PAN = 'pan',
    /**
     * 旋转
     */
    ROTATE = 'rotate',
    /**
     * 缩放
     */
    SCALE = 'scale'
  }

  /**
   * 编辑轴ID
   */
  const enum EditAxisIDMode {
    /**
     * x方向拖动轴id
     */
    XPAN = 'x-pan',
    /**
     * y方向拖动轴id
     */
    YPAN = 'y-pan',
    /**
     * z方向拖动轴
     */
    ZPAN = 'z-pan',
    /**
     * x方向旋转轴id
     */
    XROTATE = 'x-rotate',
    /**
     * y方向旋转轴id
     */
    YROTATE = 'y-rotate',
    /**
     * z方向旋转轴id
     */
    ZROTATE = 'z-rotate',
    /**
     * 缩放面id
     */
    SURFACESCALE = 'surface-scale',
    /**
     * 拖动面id
     */
    PPAN = 'p-pan'
  }

  /**
   * 编辑轴类型
   */
  const enum EditAxisMode {
    /**
     * X轴
     */
    X = 'x',
    /**
     * y轴
     */
    Y = 'y',
    /**
     * z轴
     */
    Z = 'z',
    /**
     * 平移面
     */
    P = 'p'
  }

  /**
 * 编辑类。 <br />
<strong>注意：坐标系只在 3D 模式下可见，在非 3D 模式下将无法显示，
但仍然可以通过该类的方法来编辑模型。</strong>
 * @example
 * var tileset = new Cesium.Cesium3DTileset({ url: '...'});
var tilesetEdit = new smart3d.Editing({
  viewer: viewer,
  model: tileset,
});
tilesetEdit.start();
 * @param options - 具有以下属性的对象:
 * @param options.viewer - <code>Cesium.Viewer</code> 类实例
 * @param options.model - 要编辑的对象
 */
  export class Editing {
      constructor(options: {
      viewer: Viewer;
      model: Cesium.Cesium3DTileset | Cesium.Model | Cesium.Primitive;
    });
    /**
     * 编辑类模型结束监听事件
     * @example
     * tilesetEdit.editEndEvent.addEventListener(function(result) {
    // 返回模型矩阵
    });
     */
    readonly editEndEvent: Cesium.Event;
    /**
     * 编辑类模型移动监听事件
     * @example
     * tilesetEdit.editMovingEvent.addEventListener(function(result) {
    // 返回模型矩阵
    });
     */
    readonly editMovingEvent: Cesium.Event;
    /**
     * 编辑时添加的图元集合
     */
    readonly primitives: Cesium.PrimitiveCollection;
    /**
     * 坐标轴的中心点。
     */
    readonly transformTranslation: Cesium.Cartesian3;
    /**
     * 开始编辑模型坐标。
     */
    start(): void;
    /**
     * 开始编辑模型的坐标系。
     */
    axisEditingStart(): void;
    /**
     * 保存编辑
     * @returns 返回调整好的矩阵
     */
    save(): Cesium.Matrix4;
    /**
     * 重置
     */
    reset(): void;
    /**
     * 把坐标系的原点标定到指定的点。
    一般先切换到编辑坐标系模式下（<code>axisEditingStart</code> 方法），调整好坐标系与模型的相对位置，然后切换到编辑模型坐标模式（<code>start</code> 方法），最后再应用该方法，可将模型上的某点与指定的点对齐。
     * @param position - 新的坐标轴原点。
     */
    calibrate(position: Cesium.Cartesian3): void;
    /**
     * 获取坐标系的轴长。
     * @returns 坐标系的轴长
     */
    getAxisLength(): number;
    /**
     * 缩放坐标轴, [0.001, 1) 为缩小，大于 1 为放大。
     * @param scaleFactor - 缩放比例，最小值为 0.001
     */
    updateAxisScale(scaleFactor: number): void;
    /**
     * 获取正在编辑坐标的对象
     * @returns 正在编辑坐标的对象
     */
    getModel(): Cesium.Cesium3DTileset | Cesium.Model | Cesium.Primitive;
    /**
     * 平移三维模型或坐标系。
     * @param editAxisMode - 移动方向轴
     * @param distance - 移动距离，单位为米。
     */
    translation(editAxisMode: EditAxisMode, distance: number): void;
    /**
     * 旋转三维模型或坐标系。
     * @param editAxisMode - 旋转方向轴
     * @param angle - 旋转角度
     */
    rotation(editAxisMode: EditAxisMode, angle: number): void;
    /**
     * 缩放三维模型和坐标系。 [0.001, 1) 为缩小，大于 1 为放大。
     * @param scale - 缩放比例，最小值为 0.001。
     */
    scale(scale: number): void;
    /**
     * 复制矩阵
     * @returns 返回矩阵字符串
     */
    copyMatrix(): string;
    /**
     * 粘贴矩阵
     * @param array - 16个连续元素对应于矩阵位置的数组
     */
    pasteMatrix(array: number[]): void;
    /**
     * 退出编辑。
     */
    destroy(): void;
  }

  /**
 * 飞行管理器
 * @example
 * var flyManager = new smart3d.FlyManager(viewer, {
  infinite: false,
  duration: 10
});
 * @param viewer - 视图
 * @param [options.perspective = FlyPerspective.FIRST] - 飞行视角模式
 * @param [options.duration = 60] - 飞行持续时间，秒为单位
 * @param [options.infinite = true] - 是否无限循环飞行
 * @param [options.camera = {followX:60, followZ:30}] - 飞行固定视角时的水平偏移和距离，作用在FlyPerspective.FIRST
 * @param [options.path = {width: 4, material: Cesium.PolylineGlowMaterialProperty}] - 路线
 * @param [options.point = {pixelSize: 10, color: Cesium.Color.RED}] - 运动点
 * @param [options.model] - 模型
 * @param [options.label] - 文本
 * @param [options.site = {show: false, point: {}}] - 站点，是否显示和站点的entity
 */
  export class FlyManager {
      constructor(
      viewer: Viewer,
      options?: {
        perspective?: FlyPerspective;
        duration?: number;
        infinite?: boolean;
        camera?: any;
        path?: Cesium.PathGraphics;
        point?: Cesium.PointGraphics;
        model?: Cesium.ModelGraphics;
        label?: Cesium.LabelGraphics;
        site?: any;
      }
    );
    /**
     * 绘制或生成的飞行路线
     */
    readonly flyPath: Cesium.Entity;
    /**
     * 是否飞行中
     */
    readonly isFlying: boolean;
    /**
     * 是否已停止
     */
    readonly isStop: boolean;
    /**
     * 飞行完成停止监听事件
     */
    readonly stopArrived: Cesium.Event;
    /**
     * 飞行中监听事件，返回已飞行距离和当前位置点
     * @example
     * flyManager.addEventListener(function(distance, curPosition) {})
     */
    readonly flightEvent: Cesium.Event;
    /**
     * 当前位置
     */
    readonly position: Cesium.Cartesian3;
    /**
     * 当前四元数取向
     */
    readonly orientation: Cesium.Quaternion;
    /**
     * 当前hpr角度
     */
    readonly hpr: Cesium.HeadingPitchRoll;
    /**
     * 当前矩阵
     */
    readonly matrix: Cesium.Matrix4;
    /**
     * 飞行站点entity，options时传有site参数时，才会生成数据
     */
    readonly siteEtities: Cesium.Entity[];
    /**
     * 飞行路线的点集合
     */
    readonly positions: Cesium.Cartesian3[];
    /**
     * 飞行路线的总长度，单位米
     */
    readonly totalLenth: number;
    /**
     * 已飞行经过的站点集合
     */
    readonly flightedPositions: Cesium.Cartesian3[];
    /**
     * 已飞行距离
     */
    readonly flightedDistance: number;
    /**
     * 暂停飞行
     */
    pause(): void;
    /**
     * 开始飞行
     * @param [options.perspective] - 飞行视角，如果无配置，用FlyManager里的配置
     * @param [options.camera] - 飞行固定视角时的相机偏移，如果无配置，用FlyManager里的配置
     */
    start(options: { perspective?: FlyPerspective; camera?: any }): void;
    /**
     * 停止飞行
     * @param [reset = true] - 是否回到起点，默认true
     */
    stop(reset?: boolean): void;
    /**
     * 绘制新的路线
     * @param options - 其他选项和 {@link FlyManager} 的 options 一样
     * @param [options.isGround = true] - 绘制路线是否贴地
     */
    drawNewRoute(options: { isGround?: boolean }): void;
    /**
     * 更新路径，更新时会先清除重新绘制渲染的
     * @param options - 和 {@link FlyManager} 的 options 一样
     */
    update(options: any): void;
    /**
     * 飞行过程中，实时改变视角
     * @param [options.perspective] - 飞行视角
     * @param [options.camera] - 飞行时跟随的水平偏移和距离, `{followX: 60, followZ: 30}`
     */
    change(options: { perspective?: FlyPerspective; camera?: any }): void;
    /**
     * 通过点集合，添加飞行路线
     * @param positions - 飞行点集成，从开始点到结束点
     * @param options - 其他选项和 {@link FlyManager} 的 options 一样
     * @param [options.id] - 飞行路线entity的id
     * @param [options.name] - 飞行路线entity的name
     */
    addRouteFromPositions(
      positions: Cesium.Cartesian3[],
      options: {
        id?: string;
        name?: string;
      }
    ): void;
    /**
     * 加载JSON飞行数据
     * @param jsonData - 参考<a href="../examples/assets/flypath.json" target="_blank">flypath.json</a>文件
     */
    addJSON(jsonData: JSON): void;
    /**
     * 清除
     */
    clear(): void;
    /**
     * 销毁
     */
    destroy(): void;
  }

  /**
   * 飞行视角
   */
  export class FlyPerspective {
      constructor();
    /**
     * 第一跟随视角
     */
    static readonly FIRST: number;
    /**
     * 第三跟随视角
     */
    static readonly THIRD: number;
    /**
     * 自由视角
     */
    static readonly FREE: number;
  }

  /**
   * 几何计算静态类
   */
  export class GeometryCalculation {
      /**
     * 计算三角形被基准面切割后的图形
     * @param triangle - 三角网的顶点
     * @param datumHeight - 基准面高度
     * @returns 返回格式为{ below: [], upper: [] }的切割后的图形对象
     */
      static datumPlaneCutTriangle(
      triangle: Cesium.Cartesian3[],
      datumHeight: number
    ): any;
    /**
     * 获取三角形的填方量
     * @param triangle - 三角形的顶点
     * @param datumHeight - 基准面高度
     * @returns 以立方米为单位的三角形的填方量
     */
      static getAmountOfFill(
      triangle: Cesium.Cartesian3[],
      datumHeight: number
    ): number;
    /**
     * 获取三角形的挖方量
     * @param triangle - 三角形的顶点
     * @param datumHeight - 基准面高度
     * @returns 以立方米为单位的三角形的挖方量
     */
      static getAmountOfExcavation(
      triangle: Cesium.Cartesian3[],
      datumHeight: number
    ): number;
    /**
     * 三角形在基准面的横截面积
     * @param triangle - 三角形顶点
     * @param datumHeight - 基准面高度
     * @returns 以平方米为单位的横截面面积
     */
      static getCrossSectionalArea(
      triangle: Cesium.Cartesian3[],
      datumHeight: number
    ): number;
    /**
     * 根据传入的多边形点集返回一个新的首尾相连的多边形点集
     * @param array - 多边形点集合
     * @returns 首尾相连的多边形点集,类型跟传入的多边形点集合的类型一致
     */
      static getEndToEndArray(
      array: Cesium.Cartesian3[] | Cesium.Cartesian2[] | Cesium.Cartographic[]
    ): Cesium.Cartesian3[] | Cesium.Cartesian2[] | Cesium.Cartographic[];
    /**
     * 获取指定范围内的三角网表面积.三角网来源于地形瓦片,地形瓦片集合请参照{@link Cesium.QuadtreeTile}
     * @example
     * var tiles = viewer.scene.globe._surface._tilesToRender;
    var result = GeometryCalculation.getTilesTinArea(boundary, tiles);
     * @param boundary - 指定的范围
     * @param tiles - 地形瓦片的集合,
     * @returns 以平方米为单位的所有三角网的表面积
     */
      static getTilesTinArea(
      boundary: Cesium.Cartesian3[],
      tiles: object[]
    ): number;
    /**
     * 获取指定范围内得三角网.三角网来源于地形瓦片,地形瓦片集合请参照{@link Cesium.QuadtreeTile}
     * @example
     * var tiles = viewer.scene.globe._surface._tilesToRender;
    var result = GeometryCalculation.getTilesTinArea(boundary, tiles);
     * @param boundary - 指定的范围
     * @param tiles - 地形瓦片的集合
     * @returns 三角网集合
     */
      static getTilesTinByBoundary(
      boundary: Cesium.Cartesian3[],
      tiles: object[]
    ): Cesium.Cartesian3[][];
    /**
     * 返回两条线段的交点
     * @param a1 - 线段a的一个顶点
     * @param a2 - 线段a的另一个顶点
     * @param b1 - 线段b的一个顶点
     * @param b2 - 线段b的另一个顶点
     * @returns 返回线段交点,若没有交点则返回undefined
     */
      static getLineIntersect(
      a1: Cesium.Cartographic,
      a2: Cesium.Cartographic,
      b1: Cesium.Cartographic,
      b2: Cesium.Cartographic
    ): Cesium.Cartesian2 | undefined;
    /**
     * 判断多边形的绘制方向
     * @param points - 多边形的顶点集
     * @returns 若结果大于零则三角形是顺时针绘制,反之则为逆时针
     */
      static getPolygonDirection(points: Cesium.Cartographic[]): number;
      /**
     * 获取指定范围内与之相交的地形瓦片.三角网来源于地形瓦片,地形瓦片请参照{@link Cesium.QuadtreeTile}
     * @example
     * var tiles = viewer.scene.globe._surface._tilesToRender;
    var result = GeometryCalculation.getTilesTinArea(boundary, tiles);
     * @param boundary - 指定的范围
     * @param tiles - 地形瓦片的集合,其格式为QuadtreeTile[]
     * @returns 返回与指定范围相交的地形瓦片数组,其格式跟传入的地形瓦片集合一致
     */
      static getTilesByPolygon(
      boundary: Cesium.Cartesian3[],
      tiles: object[]
    ): any;
    /**
     * 获取指定范围内的TIN数据.三角网来源于地形瓦片,地形瓦片集合请参照{@link Cesium.QuadtreeTile}
     * @example
     * var tiles = viewer.scene.globe._surface._tilesToRender;
    var result = GeometryCalculation.getTilesTinArea(boundary, tiles);
     * @param boundary - 指定的范围
     * @param tiles - 地形瓦片的集合
     * @returns 在指定范围内所有的TIN点
     */
      static getTinByPolygon(
      boundary: Cesium.Cartesian3[],
      tiles: object[]
    ): Cesium.Cartesian3[][];
    /**
     * 海伦公式计算三角形面积
     * @param a - 顶点a的坐标值
     * @param b - 顶点b的坐标值
     * @param c - 顶点c的坐标值
     * @returns 三角形的面积
     */
      static getTriangleArea(
      a: Cesium.Cartesian3,
      b: Cesium.Cartesian3,
      c: Cesium.Cartesian3
    ): number;
    /**
     * 判断三角形的绘制方向
     * @param points - 三角形的顶点集
     * @returns 若结果大于零则三角形是顺时针绘制,反之则为逆时针
     */
      static getTriangleDirection(points: Cesium.Cartographic[]): number;
      /**
     * 判断点是否在指定范围内
     * @param point - 需要被判断的点
     * @param polygon - 指定的范围
     * @returns true为在多边形内,反正则为false
     */
      static IsInsidePolygon(
      point: Cesium.Cartographic,
      polygon: Cesium.Cartographic[]
    ): boolean;
    /**
     * 判断该三角形是否为多边形的耳尖,连续顶点V0,V1和V2（就是这样的顺序相邻）组成的内部不包含其他任意顶点的三角形。v0与V2之间的连线称之为多边形的对角线,点V1称之为耳尖.常用于凸多边判断
     * @param triangle - 三角形的顶点集合
     * @param points - 多边形的顶点集合
     * @returns 如果是耳尖则为true,反之则为false
     */
      static isClippingEar(
      triangle: Cesium.Cartographic[],
      points: Cesium.Cartographic[]
    ): boolean;
    /**
     * 判断线段是否相交
     * @param a1 - 线段a的一个顶点
     * @param a2 - 线段a的另一个顶点
     * @param b1 - 线段b的一个顶点
     * @param b2 - 线段b的另一个顶点
     * @returns 相交结果
     */
      static isLineIntersect(
      a1: Cesium.Cartographic,
      a2: Cesium.Cartographic,
      b1: Cesium.Cartographic,
      b2: Cesium.Cartographic
    ): boolean;
    /**
     * 使用耳切法把多边形切割为多个三角形
     * @param points - 需要分割的多边形顶点坐标集合
     * @returns 包含多个三角形的集合
     */
      static splicePolygons(
      points: Cesium.Cartographic[]
    ): Cesium.Cartographic[][];
    /**
     * Weiler－Atherton任意多边形裁剪算法裁剪多边形
     * @param pointA - 被裁切的三角形
     * @param pointB - 用于裁切的多边形
     * @returns 多边形裁剪结果
     */
      static WeilerAthertonCut(
      pointA: Cesium.Cartesian3[],
      pointB: Cesium.Cartesian3[]
    ): Cesium.Cartographic[];
  }

  /**
   * 构造多边形裁切时的顶点对象
   * @param state - state的值0为A点,1为B点,2为交点
   * @param point - 顶点坐标
   * @param used - 是否被取用
   */
  export class VertexPoint {
      constructor(state: number, point: Cesium.Cartographic, used: boolean);
  }

  /**
   * 鹰眼
   * @param viewer - 视图实例
   * @param [options.containerId = hawkEyeMap] - 鹰眼容器ID
   */
  export class Hawkeye {
      constructor(
      viewer: Viewer,
      options: {
        containerId?: string;
      }
    );
    /**
     * 开启鹰眼
     * @param [baseLayer3D] - 鹰眼视图中的三维底图；如果为空，则默认加载天地图底图
     * @param [token] - 如果默认使用天地图时，需要传入的token
     */
      open(baseLayer3D?: Cesium.ImageryProvider, token?: string): void;
      /**
     * 关闭鹰眼
     */
      close(): void;
      /**
     * 更换鹰眼视图底图
     * @param baseLayer3D - 鹰眼视图中的底图提供器
     */
      changeBaseMap(baseLayer3D: Cesium.ImageryProvider): void;
      /**
     * 销毁
     */
      destroy(): void;
  }

  /**
   * 二三维联动
   * @param viewer - 视图实例
   * @param options.container - 二维容器DOM或者ID
   */
  export class Linkage23D {
      constructor(
      viewer: Viewer,
      options: {
        container: Element | string;
      }
    );
    /**
     * 二三维联动
     * @param baseLayer2D - 二维视图中的底图提供器,如果为空，则默认加载天地图底图
     * @param [options.isBDMap] - 是否为百度地图
     * @param [options.baseColor = Color.BLACK] - 球体的基础颜色，即`Globe`的`baseColor`
     */
      linkage(
      baseLayer2D: Cesium.ImageryProvider,
      options?: {
        isBDMap?: boolean;
        baseColor?: Cesium.Color;
      }
    ): void;
    /**
     * 更换二维视图底图
     * @param baseLayer2D - 二维视图中的底图提供器
     */
      changeBaseMap(baseLayer2D: Cesium.ImageryProvider): void;
      /**
     * 销毁
     */
      destroy(): void;
  }

  /**
 * 量测类，支持距离，面积，高度，角度测量
 * @example
 * var distanceHandler = new smart3d.MeasureHandler(viewer, smart3d.MeasureMode.Distance);
distanceHandler.activate();
 * @param viewer - 视图
 * @param mode - 量测模式
 * @param [options.showLabel = true] - 是否显示绘制结果文本
 * @param [options.pickWidth = 1] - 鼠标拾取宽度，需要拾取点云时，可调大该值
 * @param [options.pickHeight = 1] - 鼠标拾取高度，需要拾取点云时，可调大该值
 */
  export class MeasureHandler {
      constructor(
      viewer: Viewer,
      mode: MeasureMode,
      options?: {
        showLabel?: boolean;
        pickWidth?: number;
        pickHeight?: number;
      }
    );
    /**
     * 绘制类对象
    <p>
    当距离, 高度，角度测量，使用的 DrawMode.Line <br>
    当面积测量，使用的 DrawMode.Polygon <br>
    </p>
     */
    readonly drawHandler: DrawHandler;
    /**
     * 激活量测事件，当 {@link MeasureHandler#activate} 激活handler事件
     * @example
     * measureHandler.activeEvent.addEventListener(function(isActive) {

    });
     */
    readonly activeEvent: Cesium.Event;
    /**
     * <p>量测结束事件</p>

    <p>当量测模式是 MeasureMode.Distance 时，返回距离和绘制点 (distance, [point1, point2]) <br>
    当量测模式是 MeasureMode.Area 时，返回面积和绘制点 (area, [point1, ...]) <br>
    当量测模式是 MeasureMode.DVH 时，返回结果和绘制点 ({distance, horizontal, vertical}, [point1, ...]) <br>
    当量测模式是 MeasureMode.Angle 时，返回角度和绘制点 (angle, [point1, ...]) <br>
    </p>
     * @example
     * measureHandler.measuredEvent.addEventListener(function(result) {

    });
     */
    readonly measuredEvent: Cesium.Event;
    /**
     * 量测类激活handler
     */
    activate(): void;
    /**
     * handler暂停工作，可激活
     */
    deactivate(): void;
    /**
     * 清除图元
     */
    clear(): void;
    /**
     * 销毁
     */
    destroy(): void;
  }

  /**
   * 量测模式
   */
  const enum MeasureMode {
    /**
     * 距离模式
     */
    Distance = 0,
    /**
     * 面积模式
     */
    Area = 1,
    /**
     * 空间距离，水平距离，垂直距离模式
     */
    DVH = 2,
    /**
     * 角度模式
     */
    Angle = 3
  }

  /**
 * 绘制可编辑平面
 * @example
 * var planeHandler = new smart3d.DrawEditablePlane(viewer, smart3d.PlaneMode.Polygon);
planeHandler.draw();
 * @param viewer - 视图
 * @param mode - 平面模式
 * @param [options.isShowTip = true] - 是否显示提示
 * @param [options.isGround = false] - 是否贴地
 * @param [options.groundType] - 贴地类型,仅在isGround为true的情况下有效
 */
  export class DrawEditablePlane {
      constructor(
      viewer: Viewer,
      mode: PlaneMode,
      options?: {
        isShowTip?: boolean;
        isGround?: boolean;
        groundType?: Cesium.ClassificationType;
      }
    );
    /**
     * 绘制面样式，包含多边形、圆、矩形外观<br>
    attributes 属性是{@link GeometryInstance#attributes}<br>
    appearance 外观 <br>
    depthFailAppearance 深度测试失败时对该基本体进行着色的外观 <br>
     */
    polygonStyle: any;
    /**
     * 绘制线样式，包含<br>
    geometry 几何图形，是除去 <code>positions</code> 的 {@link GroundPolylineGeometry} 或者 {@link PolylineGeometry}<br>
    attributes 属性是{@link GeometryInstance#attributes},<br>
    appearance 外观 <br>
    depthFailAppearance 深度测试失败时对该基本体进行着色的外观 <br>
     */
    lineStyle: any;
    /**
     * 绘制点的样式 <br>
     */
    pointStyle: Cesium.PointPrimitive;
    /**
     * 编辑时点和线样式，包含 <br>
    point: 点的样式，和{@link DrawEditablePlane#pointStyle} 一样的设置，不过是默认下color: Cesium.Color.ORANGE <br>
    centerPoint: 中心点的样式，主要用于面编辑。和{@link DrawEditablePlane#pointStyle} 一样的设置，不过是默认下color: Cesium.Color.RED <br>
    line: 线的样式，和{@link DrawEditablePlane#lineStyle} 一样的设置，不过是默认color: Cesium.Color.YELLOW <br>
    polygon: 面的样式，和{@link DrawEditablePlane#polygonStyle} 一样的设置，不过是默认color: Cesium.Color.fromAlpha(Cesium.Color.YELLOW, 0.5)
     */
    editStyle: any;
    /**
     * <p>编辑监听事件</p>
    <p>请在激活DrawEditablePlane后使用，否则返回null</p>
    <p>返回的是编辑中的图元和坐标值</p>
     * @example
     * planeHandler.editMovingEvent.addEventListener(function(result) {

    });
     */
    readonly editMovingEvent: Cesium.Event;
    /**
     * <p>编辑结束监听</p>
    <p>请在激活DrawEditablePlane后使用，否则返回null</p>
    <p>返回的是编辑中的图元和坐标值</p>
     * @example
     * planeHandler.editEndEvent.addEventListener(function(result) {

    });
     */
    readonly editEndEvent: Cesium.Event;
    /**
     * <p>删除编辑点监听，仅在点、面编辑中使用</p>
    <p>请在激活DrawEditablePlane后使用，否则返回null</p>
    <p>返回的是编辑中的图元和坐标值</p>
     * @example
     * planeHandler.editDeleteEvent.addEventListener(function(result) {

    });
     */
    readonly editDeleteEvent: Cesium.Event;
    /**
     * <p>增加编辑点监听，仅在点、面编辑中使用</p>
    <p>请在激活DrawEditablePlane后使用，否则返回null</p>
    <p>返回的是编辑中的图元和坐标值</p>
     * @example
     * planeHandler.editAddEvent.addEventListener(function(result) {

    });
     */
    readonly editAddEvent: Cesium.Event;
    /**
     * <p>绘制移动的监听</p>
    <p>请在激活DrawEditablePlane后使用，否则返回null</p>
    <p>返回的是编辑中的图元和坐标值</p>
     * @example
     * planeHandler.drawMovingEvent.addEventListener(function(result) {

    });
     */
    readonly drawMovingEvent: Cesium.Event;
    /**
     * <p>绘制结束的监听</p>
    <p>请在激活DrawEditablePlane后使用，否则返回null</p>
    <p>返回的是编辑中的图元和坐标值</p>
     * @example
     * planeHandler.drawEndEvent.addEventListener(function(result) {

    });
     */
    readonly drawEndEvent: Cesium.Event;
    /**
     * 点图元聚集
     */
    readonly pointPrimitives: Cesium.PrimitiveCollection;
    /**
     * 第一次退出编辑后才能获取的到图元 <br>
    当 isGround 为 false 时，返回 {@link Primitive} <br>
    当 isGround 为 true 时，返回 {@link GroundPrimitive}
     */
    readonly primitive: Cesium.Primitive | Cesium.GroundPrimitive;
    /**
     * 编辑状态
     */
    readonly editStatus: boolean;
    /**
     * 绘制事件
     */
    readonly drawHandler: DrawHandler;
    /**
     * 开始/重新 绘制，绘制后直接进入编辑
     */
    draw(): void;
    /**
     * 手动退出编辑状态
     * @returns 返回图元信息
     */
    quitEdit(): Cesium.Primitive | Cesium.GroundPrimitive;
    /**
     * 重新进入编辑状态
     */
    reEdit(): void;
    /**
     * 清除结果
     */
    clear(): void;
    /**
     * 销毁
     */
    destroy(): void;
    /**
     * 通过传入点集合创建可编辑线或面
     * @example
     * smart3d.DrawEditablePlane.drawByPositions(viewer, smart3d.PlaneMode.Polygon, positions);
     * @param viewer - 视图
     * @param mode - 平面模式
     * @param positions - 点集合
     * @param [options.pointStyle] - 和{@link DrawEditablePlane#pointStyle} 一样的设置
     * @param [options.lineStyle] - 和{@link DrawEditablePlane#lineStyle} 一样的设置
     * @param [options.editStyle] - 和{@link DrawEditablePlane#editStyle} 一样的设置
     * @param [options.isShowTip] - 是否开启鼠标跟随
     * @param [options.isGround] - 是否贴地
     * @param [options.groundType] - 贴地类型,仅在isGround为true的情况下有效
     */
    static drawByPositions(
      viewer: Viewer,
      mode: PlaneMode,
      positions: Cesium.Cartesian3[],
      options?: {
        pointStyle?: any;
        lineStyle?: any;
        editStyle?: any;
        isShowTip?: boolean;
        isGround?: boolean;
        groundType?: Cesium.ClassificationType;
      }
    ): void;
  }

  /**
   * 平面模式
   */
  const enum PlaneMode {
    /**
     * 线
     */
    Line = 'planeline',
    /**
     * 面
     */
    Polygon = 'polygon',
    /**
     * 圆
     */
    Circle = 'circle',
    /**
     * 矩形
     */
    Rectangle = 'rectangle'
  }

  /**
 * 雷达效果管理类
 * @example
 * // 初始化雷达管理器
var radarManager = new smart3d.RadarManager(viewer, {scanDegreesPerSecond: 90});
// 调用绘制新增雷达方法
radarManager.draw();
 * @param viewer - 视图实例
 * @param [options.scanDegreesPerSecond = 120] - 每秒扫过的度数，单位度，默认值120
 * @param [options.lineColor = new Color(238 / 255, 90 / 255, 36 / 255, 0.2)] - 雷达扫描线颜色
 * @param [options.skyColor = Color.GREEN.withAlpha(0.3)] - 雷达顶部颜色
 */
  export class RadarManager {
      constructor(
      viewer: Viewer,
      options: {
        scanDegreesPerSecond?: number;
        lineColor?: Cesium.Color;
        skyColor?: Cesium.Color;
      }
    );
    /**
     * 每秒扫描度数
     */
    scanDegreesPerSecond: number;
    /**
     * 雷达扫描线颜色
     */
    lineColor: Cesium.Color;
    /**
     * 雷达顶部颜色
     */
    skyColor: Cesium.Color;
    /**
     * 绘制完成事件监听
     * @example
     * radarManager.drawEndEvent.addEventListener(function(result) {
     // 返回绘制的雷达信息
    });
     */
    readonly drawEndEvent: Cesium.Event;
    /**
     * 当前绘制雷达的点集
     */
    positions: Cesium.Cartesian3[];
    /**
     * 新增绘制
     * @param [options.id] - 唯一标识GUID
     * @param [options.name] - 雷达名称，默认值为'雷达'+id的前四位值
     * @param [options.startHeadingDegrees = 0] - 开始扫描方位角，单位度（°）
     * @param [options.endHeadingDegrees = 180] - 结束扫描方位角，单位度（°）
     * @param [options.scanDegreesPerSecond = 120] - 扫描转数 ，单位度（°/s）
     * @param [options.pitchDegrees = 7] - 扫描俯仰角，单位度（°）
     * @param [options.lineColor] - 雷达扫描线颜色，默认值见 {@link RadarManager#lineColor}。
     * @param [options.skyColor] - 雷达顶部颜色，默认值见 {@link RadarManager#skyColor}。
     * @param [options.singleDirection = false] - 雷达的扫描边是否是单向扫描，如果是则忽略 startHeadingDegrees 和 endHeadingDegrees
     */
    draw(options?: {
      id?: string;
      name?: string;
      startHeadingDegrees?: number;
      endHeadingDegrees?: number;
      scanDegreesPerSecond?: number;
      pitchDegrees?: number;
      lineColor?: Cesium.Color;
      skyColor?: Cesium.Color;
      singleDirection?: boolean;
    }): void;
    /**
     * 获取当前新增绘制的雷达信息
     */
    getRadarInfo(): void;
    /**
     * 添加雷达实体
     * @param [options.id] - 唯一标识GUID
     * @param [options.name] - 名称
     * @param options.center - 中心点
     * @param options.radius - 扫描半径，单位米（m）
     * @param [options.startHeadingDegrees = 0] - 开始扫描方位角，单位度（°）
     * @param [options.endHeadingDegrees = 180] - 结束扫描方位角，单位度（°）
     * @param [options.scanDegreesPerSecond = 120] - 扫描转数 ，单位度（°/s）
     * @param [options.pitchDegrees = 7] - 扫描俯仰角，单位度（°）
     * @param [options.lineColor] - 雷达扫描线颜色，默认值见 {@link RadarManager#lineColor}
     * @param [options.skyColor] - 雷达顶部颜色，默认值见 {@link RadarManager#skyColor}
     * @param [options.singleDirection = false] - 雷达的扫描边是否是单向扫描，如果是则忽略 startHeadingDegrees 和 endHeadingDegrees
     * @returns 返回的雷达实体
     */
    add(options: {
      id?: string;
      name?: string;
      center: Cesium.Cartesian3;
      radius: number;
      startHeadingDegrees?: number;
      endHeadingDegrees?: number;
      scanDegreesPerSecond?: number;
      pitchDegrees?: number;
      lineColor?: Cesium.Color;
      skyColor?: Cesium.Color;
      singleDirection?: boolean;
    }): Cesium.Entity;
    /**
     * 注意，是整体更新，需要传递所有的参数，除了中心点。对于不传的参数，则使用 {@link RadarManager#add} 的默认值。
     * @param options.id - 唯一标识GUID
     * @param options.name - 名称
     * @param [options.center] - 中心点
     * @param options.radius - 扫描半径，单位米（m）
     * @param options.startHeadingDegrees - 开始扫描方位角，单位度（°）
     * @param options.endHeadingDegrees - 结束扫描方位角，单位度（°）
     * @param options.scanDegreesPerSecond - 扫描转数 ，单位度（°/s）
     * @param options.pitchDegrees - 扫描俯仰角，单位度（°）
     * @param options.lineColor - 雷达扫描线颜色
     * @param options.skyColor - 雷达顶部颜色
     * @param options.singleDirection - 雷达的扫描边是否是单向扫描，如果是则忽略 startHeadingDegrees 和 endHeadingDegrees
     */
    update(options: {
      id: string;
      name: string;
      center?: Cesium.Cartesian3;
      radius: number;
      startHeadingDegrees: number;
      endHeadingDegrees: number;
      scanDegreesPerSecond: number;
      pitchDegrees: number;
      lineColor: Cesium.Color;
      skyColor: Cesium.Color;
      singleDirection: boolean;
    }): void;
    /**
     * 设置所有实体可见
     * @param isShow - 是否可见
     */
    setAllVisible(isShow: boolean): void;
    /**
     * 设置指定实体可见性
     * @param id - 唯一标识
     * @param isShow - 是否可见
     */
    setVisible(id: string, isShow: boolean): void;
    /**
     * 根据id移除
     * @param id - 唯一标识
     */
    remove(id: string): void;
    /**
     * 根据id获取指定实体
     * @param id - 唯一标识
     * @returns 返回的实体
     */
    getRadar(id: string): Cesium.Entity;
    /**
     * 获取所有实体
     */
    getAll(): Cesium.Entity[];
    /**
     * 移除所有
     */
    removeAll(): void;
    /**
     * 销毁
     */
    destroy(): void;
  }

  namespace RenderDomToScene {
    /**
     * 初始化配置项，提供至 RenderDomToScene 类的配置和render的配置
     * @property [dom] - html dom对象
     * @property [position] - 渲染的坐标点
     * @property [width] - 自定义渲染对象宽度，不设则使用dom的宽度
     * @property [height] - 自定义渲染对象高度，不设则使用dom的高度
     * @property [id] - 渲染对象唯一识
     * @property [heightReference = HeightReference.NONE] - 指定高度相对于什么的属性
     * @property [horizontalOrigin = HorizontalOrigin.CENTER] - 原点相对于对象的水平位置
     * @property [verticalOrigin = VerticalOrigin.CENTER] - 原点相对于对象的垂直位置
     * @property [scaleByDistance] - 作用于根据与相机的距离缩放点
     * @property [translucencyByDistance] - 作用于根据与相机的距离设置半透明度
     * @property [pixelOffset = Cartesian2.ZERO] - 指定像素偏移
     * @property [pixelOffsetScaleByDistance] - 作用于根据与相机的距离设置像素偏移
     * @property [eyeOffset = Cartesian3.ZERO] - 世界坐标值的视眼偏移
     * @property [disableDepthTestDistance] - 指定要禁用深度测试的距离相机的距离
     * @property [html2canvasOptions] - html2canvas的配置项，见{@link https://html2canvas.hertzen.com/configuration}
     */
    type ConstructorOptions = {
      dom?: HTMLElement;
      position?: Cesium.Cartesian3;
      width?: number;
      height?: number;
      id?: string;
      heightReference?: Cesium.HeightReference;
      horizontalOrigin?: Cesium.HorizontalOrigin;
      verticalOrigin?: Cesium.VerticalOrigin;
      scaleByDistance?: Cesium.NearFarScalar;
      translucencyByDistance?: Cesium.NearFarScalar;
      pixelOffset?: Cesium.Cartesian2;
      pixelOffsetScaleByDistance?: Cesium.NearFarScalar;
      eyeOffset?: Cesium.Cartesian3;
      disableDepthTestDistance?: number;
      html2canvasOptions?: any;
    };
  }

  /**
 * 通过HTML DOM对象渲染至场景类
<p>使用<a href="https://html2canvas.hertzen.com" target="_blank">html2canvas</a>库把html dom转换成canvas绘制至场景，需要注意常见问题，比如图片跨域, dom渲染才能转换canvas</p>
 * @param viewer - 必填项，视图对象
 * @param [options] - 配置项
 */
  export class RenderDomToScene {
      constructor(viewer: Viewer, options?: RenderDomToScene.ConstructorOptions);
    /**
     * 获取添加的billboardCollenction对象，如果渲染失败则返回undifined
     */
    billboards: Cesium.BillboardCollection;
    /**
     * 渲染
     * @param [options] - 配置项
     * @returns 返回绘制的billboard对象
     */
    render(
      options?: RenderDomToScene.ConstructorOptions
    ): Promise<Cesium.Billboard>;
    /**
     * 清除掉绘制场景中的entity对象
     */
    clear(): void;
    /**
     * 销毁，但不清除绘制结果
     * @returns undifined
     */
    destroy(): any;
  }

  /**
 * 漫游类，键盘操作的漫游功能，
<p>【QWESAD】相机平移，【↑↓←→】当前位置点旋转，【UIOJKL或者789456】屏幕中心点缩放/旋转视角，【ctrl+↑, ctrl+↓】加速/减速</p>
 * @param viewer - 视图
 * @param [options.speed = 150] - 平移的反速度，值越大，平移越慢
 * @param [options.rotateStep = 25] - 旋转的反步长，值越大，旋转越慢
 * @param [options.rotateRate = 1.0] - 旋转的速率，值越大，旋转越快
 * @param [options.minPitch = 0.1] - 最小仰角，[0, 1]区间值内
 * @param [options.maxPitch = 1.0] - 最大仰角，[0, 1]区间值内
 */
  export class Roam {
      constructor(
      viewer: Viewer,
      options?: {
        speed?: number;
        rotateStep?: number;
        rotateRate?: number;
        minPitch?: number;
        maxPitch?: number;
      }
    );
    /**
     * 平移的反速度，值越大，平移越慢
     */
    speed: number;
    /**
     * 旋转的反步长，值越大，旋转越慢
     */
    rotateStep: number;
    /**
     * 旋转的速率，值越大，旋转越快
     */
    rotateRate: number;
    /**
     * 最小仰角，[0, 1]区间值内
     */
    minPitch: number;
    /**
     * 最大仰角，[0, 1]区间值内
     */
    maxPitch: number;
    /**
     * 是否可用
     */
    enable: boolean;
    /**
     * 开始漫游
     */
    start(): void;
    /**
     * 销毁
     */
    destroy(): void;
  }

  /**
 * 3D Tiles 位置编辑类
 * @example
 * var pickedFeature = this.viewer.scene.pick(movement.position);
var tilesetEdit = new smart3d.TilesetEdit({
  viewer: viewer,
  model: pickedFeature.primitive
});
 * @param [options] - 具有以下属性的对象:
 * @param [options.viewer] - 场景实例
 * @param [options.model] - 选择编辑的3DTileset对象
 */
  export class TilesetEdit {
      constructor(options?: { viewer?: Viewer; model?: Cesium.Cesium3DTileset });
    /**
     * 编辑时添加的图元集合
     */
    readonly primitives: Cesium.PrimitiveCollection;
    /**
     * 初始化编辑
     */
    start(): void;
    /**
     * 重置
     */
    reset(): void;
    /**
     * 缩放三维模型
     * @param scale - 缩放比例
     */
    scale(scale: number): void;
    /**
     * 平移三维模型
     * @param editAxisMode - 移动方向轴
     * @param distance - 移动距离
     */
    translation(editAxisMode: EditAxisMode, distance: number): void;
    /**
     * 旋转三维模型
     * @param editAxisMode - 旋转方向轴
     * @param angle - 旋转角度
     */
    rotation(editAxisMode: EditAxisMode, angle: number): void;
    /**
     * 粘贴矩阵
     * @param array - 16个连续元素对应于矩阵位置的数组
     */
    pasteMatrix(array: number[]): void;
    /**
     * 复制矩阵
     * @returns 返回矩阵字符串
     */
    copyMatrix(): string;
    /**
     * 获取编辑的3dtielset
     */
    getModel(): void;
    /**
     * 保存编辑
     * @returns 返回调整好的矩阵
     */
    save(): Cesium.Matrix4;
    /**
     * 退出编辑
     */
    destroy(): void;
  }

  /**
   * 带有过渡动画的视点漫游。
   * @param viewer - Viewer 类实例，见 {@link Viewer}。
   */
  export class ViewRoaming {
      constructor(viewer: Viewer);
    /**
     * 正在漫游中的回调函数，该函数的第一个参数是一个对象，包含当前视点的属性，
    第二个参数是当前所处段的索引，第三个参数是每一段的进度。
     * @example
     * viewRoaming.roamingCallback = function(roamingView, i, elapsed) {
      // roamingView 对象包含
      // x、y、z、directionX、directionY、directionZ、upX、upY、upZ 属性
    }
     */
    roamingCallback: (...params: any[]) => any;
    /**
     * 漫游完成时的回调函数，如果是循环漫游，则是漫游完一轮的回调函数。
     */
    completeCallback: (...params: any[]) => any;
    /**
     * 漫游被取消时（调用 <code>viewer.flyTo</code> 或 <code>camera.flyTo</code> 时）的回调函数。
     */
    cancelCallback: (...params: any[]) => any;
    /**
     * 获取当前的视点数组，设置视点数组见 {@link ViewRoaming#setRoamingViews}。
     */
    readonly roamingViews: object[];
    /**
     * 是否显示辅助物，包括路径曲线和每个视角的方位（使用视锥体的方位表示）。
     */
    showHelper: boolean;
    /**
     * 设置视点数组。一个视点为一个对象，定义为一个世界坐标和一个世界坐标系下的方位（一个方向和一个 up 轴组成一个方位），包含以下属性：<br>
    <pre>
    {
      x：Number;                // 世界坐标的 x 分量，必选属性。
      y：Number;                // 世界坐标的 y 分量，必选属性。
      z：Number;                // 世界坐标的 z 分量，必选属性。
      directionX：Number;       // 方向的 x 分量，必选属性。
      directionY：Number;       // 方向的 y 分量，必选属性。
      directionZ：Number;       // 方向的 z 分量，必选属性。
      upX：Number;              // up 轴的 x 分量，必选属性。
      upY：Number;              // up 轴的 y 分量，必选属性。
      upZ：Number;              // up 轴的 z 分量，必选属性。
      duration：Number;         // 该视点到下一个视点的持续时间。可选属性，默认为 3000 ms。
      delay：Number;            // 该视点到下一个视点的延迟时间。可选属性，默认为 0 ms。
      easingFunction：Function; // 该视点到下一个视点的缓动函数。可选属性，默认为 Cesium.EasingFunction.LINEAR_NONE。
    }
    </pre>

    最后一个视点的 duration、delay、easingFunction 会被忽略，因为已到达终点，漫游结束。<br>
    提示：相机的世界坐标、方向和 up 轴可直接读取自 <code>camera.positionWC</code>、<code>camera.directionWC</code> 和 <code>camera.upWC</code>。<br>
    更多缓动函数，见 {@link EasingFunction}。
     * @example
     * const viewRoaming = new smart3d.ViewRoaming(viewer);
    // 相机的世界坐标、方向和 up 轴可直接读取自 camera.positionWC 、camera.directionWC 和 camera.upWC
    viewRoaming.setRoamingViews([
      {
        x: -2331367.832195439,
        y: 5383103.437110797,
        z: 2495188.4131367374,
        directionX: 0.8954760019355185,
        directionY: 0.14254199547129612,
        directionZ: 0.4216687200690141,
        upX: -0.32832549033505276,
        upY: 0.8511760136908274,
        upZ: 0.40951406094741083,
        easingFunction: Cesium.EasingFunction.QUADRACTIC_OUT,
      },
      {
        x: -2331324.2426973204,
        y: 5383112.224099962,
        z: 2495212.0369561943,
        directionX: 0.7878611540458561,
        directionY: 0.04695020449907578,
        directionZ: 0.6140606486683761,
        upX: -0.35931373394010874,
        upY: 0.8448355685472831,
        upZ: 0.3964170817704577,
        duration: 5000,
        delay: 1000,
        easingFunction: Cesium.EasingFunction.QUADRACTIC_IN,
      },
    ]);

    viewRoaming.start();
     * @param roamingViews - 视点数组。每个视点需包含相机的世界坐标、方向和 up 轴，还有可选的持续时间、延迟时间和缓动函数。
     */
    setRoamingViews(roamingViews: object[]): void;
    /**
     * 开始漫游。漫游之前需要先设置视点，见 {@link ViewRoaming#setRoamingViews}。
     * @param [repeat = false] - 是否循环漫游
     */
    start(repeat?: boolean): void;
    /**
     * 停止漫游。停止漫游后可重新开始漫游，见 {@link ViewRoaming#start}。
     */
    stop(): void;
    /**
     * 暂停漫游。继续漫游见 {@link ViewRoaming#resume}。
     */
    pause(): void;
    /**
     * 继续漫游。暂停漫游见 {@link ViewRoaming#pause}。
     */
    resume(): void;
    /**
     * 销毁。释放资源，例如移除监听函数。如果不再使用该实例，请务必调用该方法。
     * @example
     * viewRoaming = viewRoaming && viewRoaming.destroy();
     * @returns undefined
     */
    destroy(): any;
  }

  /**
   * 场景底图选择器
   * @param viewer - 视图
   * @param [options] - 场景底图选择器配置选项:
   * @param [options.baseLayer = BaseMapMode.TIANDITU] - 场景底图选择器配置选项:
   */
  export class BaseLayerPicker {
      constructor(
      viewer: Viewer,
      options?: {
        baseLayer?: BaseMapMode;
      }
    );
    /**
     * 场景底图对象
     */
    readonly baseLayer: Cesium.ImageryLayer;
    /**
     * 底部的dom元素
     */
    readonly container: Element;
    /**
     * 获取或设置场景瓦片底图模式
     */
    baseMapMode: number;
    /**
     * @returns 返回 true 表示已被销毁，否则 false
     */
    isDestroyed(): boolean;
    /**
     * 销毁
     */
    destroy(): void;
  }

  /**
   * 场景加载时显示的默认帮助界面
   * @param viewer - 视图
   * @param [options.duration = 2] - 显示持续时长，单位秒
   */
  export class Helper {
      constructor(
      viewer: Viewer,
      options?: {
        duration?: number;
      }
    );
    /**
     * 返回默认帮助界面Element
     */
    container: Element;
    /**
     * @returns 返回 true 表示已被销毁，否则 false
     */
    isDestroyed(): boolean;
    /**
     * 销毁并释放该对象
     */
    destroy(): void;
  }

  /**
   * 场景底部显示位置信息状态栏
   * @param viewer - 视图
   */
  export class Location {
      constructor(viewer: Viewer);
    /**
     * 场景位置信息的dom元素
     */
    readonly container: Element;
    /**
     * @returns 返回 true 表示已被销毁，否则 false
     */
    isDestroyed(): boolean;
    /**
     * 销毁
     */
    destroy(): void;
  }

  /**
   * 导航控件中的的罗盘部件
   * @param viewer - 视图
   * @param options - 罗盘部件配置选项:
   */
  export class Compass {
      constructor(viewer: Viewer, options: any);
    /**
     * 罗盘功能的父容器
     */
    readonly container: Element;
    /**
     * @returns 返回 true 表示已被销毁，否则 false
     */
    isDestroyed(): boolean;
    /**
     * 销毁并释放该对象
     */
    destroy(): void;
  }

  /**
 * 导航条功能控件
 * @example
 * // 创建单次点击功能的导航控件
var control = new smart3d.Control({
  title: name,
  imgRestore: imgPath,
  active: function(control) {}
})

// 创建含两次点击功能的导航控件
var control = new smart3d.Control({
  title: name,
  imgRestore: imgPath,
  active: function(control) {},
  restore: function(control) {}
})

// 创建带有前置条件的双次点击control导航控件
var control = new smart3d.Control({
  title: name,
  imgRestore: imgPath,
  onload: function(control) {},
  active: function(control) {},
  restore: function(control) {}
});
 * @param options.title - dom的title标题
 * @param options.imgRestore - 控件默认显示的图标路径，支持png|jpe?g|gif|svg
 * @param options.active - 控件点击触发方法
 * @param [options.onload] - 控件加载时触发方法
 * @param [options.restore] - 再次点击控件触发方法
 * @param [options.imgActive] - 点击控件显示的图标路径，支持png|jpe?g|gif|svg
 */
  export class Control {
      constructor(options: {
      title: string;
      imgRestore: string;
      active: (...params: any[]) => any;
      onload?: (...params: any[]) => any;
      restore?: (...params: any[]) => any;
      imgActive?: string;
    });
    /**
     * 设置控件显示图标
     * @param img - 需要显示图标的路径
     */
      setIMG(img: string): void;
    /**
     * 返回控件加载时触发的Function
     */
    readonly onload: (...params: any[]) => any;
    /**
     * 返回控件点击事件触发的Function
     */
    readonly active: (...params: any[]) => any;
    /**
     * 返回控件再次点击触发的Function
     */
    readonly restore: (...params: any[]) => any;
    /**
     * 控件的名称
     */
    readonly name: string;
    /**
     * 控件的父容器 <br>
     */
    readonly container: Element;
    /**
     * 点击控件显示的图标路径 <br>
     */
    readonly imgActive: string;
    /**
     * 控件默认显示图标的路径 <br>
     */
    readonly imgRestore: string;
  }

  /**
 * 导航控件集合
根据options中参数排列的顺序,依次排列导航条中各个导航按钮的位置.因此,可以通过动态改变传入参数的顺序排列控件显示顺序,如果不传参或者传入参数不完全,则会按照默认顺序排序
 * @example
 * // 创建包含默认功能控件的导航条
const controlCollection = new ControlCollection(viewer);

// 创建包含默认功能控件的导航条
const controlCollection = new ControlCollection(viewer, true);

// 创建空的控件的导航条
const controlCollection = new ControlCollection(viewer, flase);

// 创建指定顺序的zoomIn,zoomOut控件的导航条控件
const controlCollection = new ControlCollection(viewer, {
  zoomIn: true,
  zoomOut: true
});

// 创建指定顺序的zoomIn,custom,zoomOut控件的导航条控件
const controlCollection = new ControlCollection(viewer, {
  zoomIn: true,
  custom: new smart3d.Control({
    title: 'name,
    imgRestore: imgPath,
    active: function(control) {}
  }),
  zoomOut: true
});

// 创建指定显隐的控件的导航条控件
const controlCollection = new ControlCollection(viewer, {
  zoomIn: true,
  flyToHome: false,
  setNorth: false,
  fullScreen: false,
  saveAsIMG: false,
  modeSwitch: false,
  zoomOut: true
});
 * @param viewer - 场景视图
 * @param [options.zoomIn = true] - 是否显示放大控件.
 * @param [options.flyToHome = true] - 是否显示初始化控件.
 * @param [options.setNorth = true] - 是否显示指北控件.
 * @param [options.fullScreen = true] - 是否显示全屏控件.
 * @param [options.saveAsIMG = true] - 是否显示屏幕截图控件.
 * @param [options.modeSwitch = true] - 是否显示模式切换控件.
 * @param [options.modeSwitch.duration = 2] - 模式切换飞行持续时间.单位为秒
 * @param [options.zoomOut = true] - 是否显示缩小控件.
 * @param [options.custom] - 添加自定义的{@link Control}
 */
  export class ControlCollection {
      constructor(
      viewer: Viewer,
      options?: {
        zoomIn?: boolean;
        flyToHome?: boolean;
        setNorth?: boolean;
        fullScreen?: boolean;
        saveAsIMG?: boolean;
        modeSwitch?: {
          duration?: number;
        };
        zoomOut?: boolean;
        custom?: Control;
      }
    );
    /**
     * 导航功能是否显示 <br>
     */
    readonly isShow: boolean;
    /**
     * 导航控件中的功能部件集合 <br>
     */
    readonly controls: Control[];
    /**
     * 导航控件中的功能部件的Elment集合 <br>
     */
    readonly container: Element[];
    /**
     * 创建{@link Control} 添加到集合中
     * @param Control - 创建控件的参数
     */
    addControl(Control: Control): void;
    /**
     * 根据索引值获取控件集中的控件
     * @param index - 需要获取控件的索引值
     */
    get(index: number): void;
    /**
     * 将指定的{@link Control} 从集合中移除
     * @param Control - 需要移除的控件
     */
    remove(Control: Control): void;
    /**
     * 获取控件在集合中的索引值
     * @param control - 需要判断索引值的控件
     */
    indexOf(control: Control): void;
    /**
     * 判断该控件是否在集合内
     * @param control - 需要判断的控件
     */
    contains(control: Control): void;
    /**
     * 移除集合中所有的导航控件
     */
    removeAll(): void;
    /**
     * 设置导航控件是否显示
     * @param isVisiable - 是否显示,false代表不显示，true为显示
     */
    setVisiable(isVisiable: boolean): void;
    /**
     * 该控件是否被销毁
     */
    isDestroyed(): void;
    /**
     * 销毁并释放该对象
     */
    destroy(): void;
  }

  /**
   * 导航控件
   * @param Viewer - 视图
   * @param [options.navigationMode = NavigationMode.Both] - 导航显示模式.
   * @param [options.controls] - 导航控件集合{@link ControlCollection}的options.
   */
  export class Navigation {
      constructor(
      Viewer: Viewer,
      options?: {
        navigationMode?: NavigationMode;
        controls?: any;
      }
    );
    /**
     * 导航罗盘控件集合
     */
    readonly compass: Compass;
    /**
     * 导航功能控件集合
     */
    readonly controlCollection: ControlCollection;
    /**
     * @returns 返回 true 表示已被销毁，否则 false
     */
    isDestroyed(): boolean;
    /**
     * 销毁该对象
     */
    destroy(): void;
  }

  /**
   * 导航控件显示类型
   */
  export const enum NavigationMode {
    /**
     * 罗盘和导航工具条控件都显示
     */
    Both = 0,
    /**
     * 只显示罗盘控件显示
     */
    Compass = 1,
    /**
     * 只显示导航工具条控件
     */
    Controls = 2
  }
}
