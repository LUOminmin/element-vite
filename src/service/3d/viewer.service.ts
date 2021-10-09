import smart3d from 'smart3d';
import * as Cesium from '@smart/cesium';
import { message } from 'antd';
import { LayerService } from './layers.service';
import { EnviromentConfigService } from './environment.config.service';
import { DarkCorner } from '../common/darkCorner';

export class ViewerService {
  readonly viewer: smart3d.Viewer;
  private config = window.$CONFIG;
  layerService: LayerService;
  enviromentConfigService: EnviromentConfigService;
  corner?: DarkCorner;

  constructor(domId: string) {
    this.viewer = new smart3d.Viewer(domId, {
      copyrightLogo: false,
      baseMapMode: smart3d.BaseMapMode.ESRI,
      baseLayerPicker: false,
      terrainProvider: smart3d.TerrainManager.createSTKTerrain(),
      location: false,
      navigation: {
        controls: {
          flyToHome: true,
          setNorth: true,
          fullScreen: true,
          zoomIn: true,
          zoomOut: true
        }
      }
    });

    // this._setEnviroment();
    this._setSkyBox();

    // window['viewer'] = this.viewer;
    // window['Cesium'] = Cesium;
    // window['smart3d'] = smart3d;
    this.init();

    let host = document.location.host;
    host = host.split(':')[0];
    const baseUrl = this.config.API.DATA_API.replace('{host}', host);
    this.layerService = new LayerService(this.viewer, baseUrl);
    this.enviromentConfigService = new EnviromentConfigService(this.viewer);
    this.enviromentConfigService.setConfig();
  }

  private init() {
    // 设置画布100%可以随着父级同步更新场景大小
    this.viewer.canvas.style.width = '100%';
    this.viewer.canvas.style.height = '100%';
    this.viewer.scene.fog.enabled = false;
    this.viewer.scene.globe.depthTestAgainstTerrain = true;
    this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
      Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
    );
    this.setCameraControllerConstant();
    // 监听webgl context lost
    this.viewer.canvas.addEventListener(
      'webglcontextlost',
      () => {
        message.error(
          'WebGL报错: 页面中 WebGL 找不到了，可能是内存不足引起崩溃，请重新刷新页面浏览。'
        );
      },
      false
    );
    this.initCorner();

    //TODO:3dtiles对内部组件改属性只有改shader唯一方法
    // Cesium['Cesium3DTileBatchTable'].prototype.getVertexShaderCallbackOrig =
    //   Cesium['Cesium3DTileBatchTable'].prototype.getVertexShaderCallback;
    // Cesium['Cesium3DTileBatchTable'].prototype.getVertexShaderCallback = function (handleTranslucent, batchIdAttributeName, diffuseAttributeOrUniformName) {
    //   const func = this.getVertexShaderCallbackOrig(handleTranslucent,
    //     batchIdAttributeName,
    //     diffuseAttributeOrUniformName);
    //   //console.log(handleTranslucent,batchIdAttributeName,diffuseAttributeOrUniformName,val);
    //   const func1 = (source) => {
    //     let val = func(source);
    //     //val = val.replace('vec4 featureProperties = texture2D(tile_batchTexture, st)','vec4 featureProperties = vec4(0.2,0.2,1,1)');
    //     //val = val.replace('computeSt(a_batchId);','vec2(0.49,0.51);\nst += gltf_a_dec_position.xy;');
    //     val = val.replace('computeSt(a_batchId);','computeSt(a_batchId);\nst += a_position.xy;');
    //     val = val.replace('ceil(featureProperties.a)', '1.0');
    //     val = val.replace('gl_Position *= 0.0;', '');
    //     val = val.replace('gl_Position *= 0.0;', '');
    //     console.log(val);
    //     return val;
    //   };
    //   return func1;
    // };
  }

  private initCorner = (): void => {
    if (!this.config.MAP_CONFIG.showDarkCorner) return;
    this.corner = new DarkCorner(this.viewer, true, {
      size: 0.8,
      color: '#080808'
    });
  };

  // 设置天空盒
  private _setSkyBox() {
    this.viewer.scene.skyBox.show = false;
    this.viewer.scene.backgroundColor = Cesium.Color.LIGHTSKYBLUE;
  }

  // // 设置环境
  // private _setEnviroment() {
  //   this.viewer.scene.moon.destroy(); // 去掉月亮
  //   const date = new Date('2021-09-27 22:00:00'); // 为避免模型受光照影响导致模型亮度不均匀，故设置一个默认事件
  //   this.viewer.clock.currentTime = Cesium.JulianDate.fromDate(date);
  //   this.viewer.scene.globe.enableLighting = true;
  //   this.viewer.scene.light.intensity = 0.8;
  // }

  private setCameraControllerConstant(): void {
    const { screenSpaceCameraController: cameraController } = this.viewer.scene;
    cameraController.inertiaSpin = 0.4;
    cameraController['_maximumRotateRate'] = 2.0;
  }

  gotoHome = (): void => {
    if (!this.config.MAP_CONFIG.home) return;
    const { lng, lat, alt, heading, pitch, roll } = this.config.MAP_CONFIG.home;
    if (!lng || !lat || !alt) return;
    const destination = Cesium.Cartesian3.fromDegrees(lng, lat, alt);
    const orientation = {
      heading: Cesium.Math.toRadians(heading),
      pitch: Cesium.Math.toRadians(pitch ?? -25),
      roll: Cesium.Math.toRadians(roll ?? 0)
    };
    this.viewer.setHome(
      destination,
      new Cesium.HeadingPitchRoll(
        orientation.heading,
        orientation.pitch,
        orientation.roll
      )
    );
    this.viewer.camera.flyTo({ destination, orientation, duration: 2 });
  };

  destroy(): void {
    this.viewer.destroy();
  }
}
