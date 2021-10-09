import * as Cesium from '@smart/cesium';
import smart3d from 'smart3d';

export interface DarkCornerOptions {
  size?: number;
  color?: Cesium.Color | string;
  offset?: Cesium.Cartesian2;
  show?: boolean;
}
const initDarkCornerOptions: DarkCornerOptions = {
  size: 0.1, // [0, 1]  暗角径向尺寸大小
  color: Cesium.Color.BLACK, // 遮罩层颜色
  offset: new Cesium.Cartesian2(0.5, 0.5), // ([0, 1], [0, 1])  暗角相对于左下角（0,0）的偏移
  show: true
};

export interface PostProcessStage extends Cesium.PostProcessStage {
  index: number;
}

export class DarkCorner {
  _viewer: smart3d.Viewer;
  _stages: PostProcessStage[] = [];
  _fs = `
    uniform sampler2D colorTexture;
    varying vec2 v_textureCoordinates;
    uniform float u_size;
    uniform vec4 u_maskColor;
    uniform vec2 u_offset;
    float sdfCircle(vec2 p, float r) {
      return length(p) - r;
    }
    void main() {
      vec4 color = texture2D(colorTexture, v_textureCoordinates);
      float d = sdfCircle((v_textureCoordinates - u_offset) * 2., u_size);
      if (d > 0.) {
        gl_FragColor = mix(color, u_maskColor, d);
      }
      else {
        gl_FragColor = color;
      }
    }
  `;

  _size?: number; // [0, 1]  暗角径向尺寸大小
  _color?: Cesium.Color; // 遮罩层颜色
  get color(): string | undefined {
    return this._color?.toCssColorString();
  }
  // _offset = new Cesium.Cartesian2(0.5, 0.5); // ([0, 1], [0, 1])  暗角相对于左下角（0,0）的偏移
  _show: boolean;
  get show(): boolean {
    return this._show;
  }
  set show(val: boolean) {
    this._show = val;
    this._isShow();
  }

  constructor(
    viewer: smart3d.Viewer,
    isShow = true,
    options?: DarkCornerOptions
  ) {
    this._viewer = viewer;
    this._stages = [] as any;
    this._show = isShow;

    options && this.add(options);
  }

  private _isShow(): void {
    this._stages.forEach((t) => {
      t.enabled = this._show;
    });
  }

  // eslint-disable-next-line
  add(options: DarkCornerOptions = {}): PostProcessStage {
    const opt = { ...initDarkCornerOptions, ...options };
    const stage = new Cesium.PostProcessStage({
      fragmentShader: this._fs,
      uniforms: {
        //! CallbackProperty无效
        u_size: opt.size,
        u_maskColor:
          typeof opt.color === 'string'
            ? Cesium.Color.fromCssColorString(opt.color)
            : opt.color,
        u_offset: opt.offset
      }
    }) as PostProcessStage;
    stage.enabled = opt.show ?? true;
    this._viewer.scene.postProcessStages.add(stage);
    this._stages.push(stage);
    stage.index = this._stages.length - 1;
    return stage;
  }

  remove(stage: PostProcessStage): boolean {
    if (stage.index !== 0 && !stage.index) return false;
    this._viewer.scene.postProcessStages.remove(stage);
    this._stages.splice(stage.index, 1);
    return true;
  }

  removeAll(): void {
    this._stages.forEach((t) => {
      this.remove(t);
    });
    this._stages = [];
  }

  destroy(): void {
    this.removeAll();
    this._stages = [];
  }
}
