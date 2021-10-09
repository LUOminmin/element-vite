import smart3d from 'smart3d';
import * as Cesium from '@smart/cesium';
import { AnalysisBaseService } from './analysis-base.service';
import { StoreService } from './store.service';
import { message } from 'antd';
import { ViewerService } from './viewer.service';

const flags = {
  looking: false,
  moveForward: false,
  moveBackward: false,
  moveUp: false,
  moveDown: false,
  moveLeft: false,
  moveRight: false
};
export class SkylineService
  extends StoreService
  implements AnalysisBaseService
{
  type = 'ViewRoom';
  private handler?: Cesium.ScreenSpaceEventHandler;
  private tickEvent: any;
  private skyLine?: smart3d.Skyline;
  private originView?: {
    destination: Cesium.Cartesian3;
    orientation: {
      heading: number;
      pitch: number;
      roll: number;
    };
  };
  private originStyles: Record<string, any> = {};
  private originController: Record<string, any> = {};
  private timer?: NodeJS.Timer;
  private isLook = false;
  private viewer: smart3d.Viewer;

  constructor(private viewerService: ViewerService) {
    super();
    this.viewer = viewerService.viewer;
  }

  active(): void {
    message.info('请选择页面下方的观察点');
    // if (
    //   this.getState('building') !== '1624' ||
    //   this.getState('floor') !== '25'
    // ) {
    //   message.warn('暂时没有观察点！');
    //   return;
    // }
  }

  changeViewByIndex(index: number): void {
    if (index < 0) {
      this.restoreView();
      return;
    }
    const data = [
      [120.11266935694907, 29.329104473252332, 160.09124477345546, 0.0],
      [120.11258333532099, 29.3289816487649, 160.09124477345546, 273.0],
      [120.11274012862886, 29.329104473252332, 160.09124477345546, 0.0]
    ];
    const t = data[index];
    if (!t) {
      message.warn('尚未采集观察点！');
      return;
    }
    this.changeView(t[0], t[1], t[2], t[3]);
  }

  changeView(lng: number, lat: number, alt: number, heading: number): void {
    this.setCamerePos();
    this.viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(lng, lat, alt),
      orientation: {
        heading: Cesium.Math.toRadians(heading),
        pitch: Cesium.Math.toRadians(0.0),
        roll: 0.0
      },
      duration: 2
    });
    this.clearTimer();
    this.timer = setTimeout(() => {
      this.setStyles();
      this.activeController();
      this.isLook = true;
    }, 1000);
  }

  private activeController() {
    if (this.isLook) return;
    this.skyLine = new smart3d['SkyLine'](this.viewer);
    const { scene, canvas } = this.viewer;
    canvas.setAttribute('tabindex', '0'); // needed to put focus on the canvas
    canvas.onclick = () => {
      canvas.focus();
    };
    const ellipsoid = scene.globe.ellipsoid;
    this.setController(scene);

    let startMousePosition;
    let mousePosition;
    this.handler = new Cesium.ScreenSpaceEventHandler(canvas);
    this.handler.setInputAction((movement) => {
      flags.looking = true;
      mousePosition = startMousePosition = Cesium.Cartesian3.clone(
        movement.position
      );
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
    this.handler.setInputAction((movement) => {
      mousePosition = movement.endPosition;
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    this.handler.setInputAction(() => {
      flags.looking = false;
    }, Cesium.ScreenSpaceEventType.LEFT_UP);

    document.addEventListener('keydown', this.keyDown, false);
    document.addEventListener('keyup', this.keyUp, false);

    this.viewer.clock.onTick.addEventListener(
      (this.tickEvent = () => {
        const camera = this.viewer?.camera as any;

        if (flags.looking) {
          const width = canvas.clientWidth;
          const height = canvas.clientHeight;

          // Coordinate (0.0, 0.0) will be where the mouse was clicked.
          const x = (mousePosition.x - startMousePosition.x) / width;
          const y = -(mousePosition.y - startMousePosition.y) / height;

          const lookFactor = 0.05;
          if (Math.abs(x) >= Math.abs(y)) {
            camera.lookRight(x * lookFactor);
          } else if (Math.abs(x) < Math.abs(y)) {
            camera.lookUp(y * lookFactor);
          }
        }

        // Change movement speed based on the distance of the camera to the surface of the ellipsoid.
        const cameraHeight = ellipsoid.cartesianToCartographic(
          camera.position
        ).height;
        const moveRate = cameraHeight / 100.0;

        if (flags.moveForward) {
          camera.moveForward(moveRate);
        }
        if (flags.moveBackward) {
          camera.moveBackward(moveRate);
        }
        if (flags.moveUp) {
          camera.moveUp(moveRate);
        }
        if (flags.moveDown) {
          camera.moveDown(moveRate);
        }
        if (flags.moveLeft) {
          camera.moveLeft(moveRate);
        }
        if (flags.moveRight) {
          camera.moveRight(moveRate);
        }
      })
    );
  }

  private setCamerePos() {
    if (this.isLook) return;
    const { camera } = this.viewer;
    this.originView = {
      destination: camera.position.clone(),
      orientation: {
        heading: camera.heading,
        pitch: camera.pitch,
        roll: camera.roll
      }
    };
  }

  private restoreCamerePos() {
    if (!this.originView) return;
    this.viewer.camera.flyTo({ ...this.originView, duration: 2 });
    this.originView = undefined;
  }

  private setStyles() {
    if (this.isLook) return;
    const campus = this.getState('campus') + '';
    const { primitives } = this.viewerService.layerService;
    const config = this.viewerService.layerService.getBuildingConfig(campus);
    config?.forEach((t) => {
      if (!('index' in t)) return;
      const target = primitives.get(t.index);
      this.originStyles[t.index] = target.style;
      target.style = new Cesium.Cesium3DTileStyle();
    });
  }

  private restoreStyles() {
    const keys = Object.keys(this.originStyles);
    if (keys.length === 0) return;
    const { primitives } = this.viewerService.layerService;
    keys.forEach((key) => {
      const p = primitives.get(Number(key));
      if (!p) return;
      p.style = this.originStyles[key];
    });
    this.originStyles = {};
  }

  private setController(scene) {
    if (this.isLook) return;
    this.originController.fov = scene.camera.frustum.fov;
    scene.camera.frustum.fov = Cesium.Math.toRadians(140);
    const controller = scene.screenSpaceCameraController;
    this.originController.enableRotate = controller.enableRotate;
    controller.enableRotate = false;
    this.originController.enableTranslate = controller.enableTranslate;
    controller.enableTranslate = false;
    this.originController.enableZoom = controller.enableZoom;
    controller.enableZoom = true;
    this.originController.enableTilt = controller.enableTilt;
    controller.enableTilt = true;
    this.originController.enableLook = controller.enableLook;
    controller.enableLook = true;
  }

  private restoreController(scene) {
    scene.camera.frustum.fov = this.originController.fov;
    const controller = scene.screenSpaceCameraController;
    controller.enableRotate = this.originController.enableRotate;
    controller.enableTranslate = this.originController.enableTranslate;
    controller.enableZoom = this.originController.enableZoom;
    controller.enableTilt = this.originController.enableTilt;
    controller.enableLook = this.originController.enableLook;
  }

  keyUp(e: globalThis.KeyboardEvent): void {
    const flagName = getFlagForKeyCode(e.keyCode);
    if (typeof flagName !== 'undefined') {
      flags[flagName] = false;
    }
  }

  keyDown(e: globalThis.KeyboardEvent): void {
    const flagName = getFlagForKeyCode(e.keyCode);
    if (typeof flagName !== 'undefined') {
      flags[flagName] = true;
    }
  }

  private clearTimer() {
    if (!this.timer) return;
    clearTimeout(this.timer);
    this.timer = undefined;
  }

  restoreView(): void {
    const scene = this.viewer.scene;
    document.removeEventListener('keydown', this.keyDown, false);
    document.removeEventListener('keyup', this.keyUp, false);
    this.handler && this.handler.destroy();
    this.viewer.clock.onTick.removeEventListener(this.tickEvent);
    this.skyLine?.destroy();
    // this.restoreRoom();
    this.restoreCamerePos();
    this.clearTimer();
    setTimeout(() => {
      this.restoreController(scene);
      this.restoreStyles();
    }, 1000);
    this.isLook = false;
  }

  deactive(): void {
    if (!this.isLook) return;
    this.restoreView();
  }
}

function getFlagForKeyCode(keyCode) {
  switch (keyCode) {
    case 'W'.charCodeAt(0):
      return 'moveForward';
    case 'S'.charCodeAt(0):
      return 'moveBackward';
    case 'Q'.charCodeAt(0):
      return 'moveUp';
    case 'E'.charCodeAt(0):
      return 'moveDown';
    case 'D'.charCodeAt(0):
      return 'moveRight';
    case 'A'.charCodeAt(0):
      return 'moveLeft';
    default:
      return undefined;
  }
}
