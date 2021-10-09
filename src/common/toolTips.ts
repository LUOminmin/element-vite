import * as Cesium from '@smart/cesium';
import smart3d from 'smart3d';

interface ToolTipsOptions {
  fontSize?: number;
  fontColor?: string;
  backgroundColor?: string;
  size?: Cesium.Cartesian2;
  fontOffset?: Cesium.Cartesian2;
  positionOffset?: Cesium.Cartesian2;
}

const defaultStyles = {
  fontSize: 25,
  fontColor: 'rgba(255, 255, 255,1)',
  backgroundColor: 'rgba(11, 19, 61, 0.5)',
  fontOffset: new Cesium.Cartesian2(20, 18),
  positionOffset: new Cesium.Cartesian2(10, 0)
};

export class ToolTips {
  private _canvas!: HTMLCanvasElement;
  private _message?: string;
  private _fontSize = defaultStyles.fontSize;
  private _fontColor = defaultStyles.fontColor;
  private _backgroundColor = defaultStyles.backgroundColor;
  private _mouseMoveListener: any;
  private _size?: Cesium.Cartesian2;
  private _fontOffset = defaultStyles.fontOffset;
  private _positionOffset = defaultStyles.positionOffset;
  private viewer: any;
  private _isActivate?: boolean;
  isInit?: boolean;
  private height = 30;
  private width = 0;
  show = false;

  get canvas(): HTMLCanvasElement {
    return this._canvas;
  }

  /**
   * 提示框大小
   */
  get size(): Cesium.Cartesian2 | undefined {
    return this._size;
  }
  // eslint-disable-next-line
  set size(value) {
    this._size = value;
    this._canvas.width = this._size?.x ?? 0;
    this._canvas.height = this._size?.y ?? this.height;
    this.refresh();
  }

  /**
   * 提示框的字体大小
   */
  get fontSize(): number {
    return this._fontSize;
  }
  // eslint-disable-next-line
  set fontSize(value) {
    this._fontSize = value;
    this.refresh();
  }

  /**
   * 提示框的字体颜色
   */
  get fontColor(): string {
    return this._fontColor;
  }
  // eslint-disable-next-line
  set fontColor(value) {
    this._fontColor = value;
    this.refresh();
  }

  /**
   * 提示框的背景色
   */
  get backgroundColor(): string {
    return this._backgroundColor;
  }
  // eslint-disable-next-line
  set backgroundColor(value) {
    this._backgroundColor = value;
    this._canvas.style.backgroundColor = this.backgroundColor;
    this.refresh();
  }

  /**
   * 提示框中的字体以左上角为原点的偏移量
   */
  get fontOffset(): Cesium.Cartesian2 {
    return this._fontOffset;
  }
  // eslint-disable-next-line
  set fontOffset(value) {
    this._fontOffset = value;
    this.refresh();
  }

  /**
   * 提示框的位置以左上角为原点的偏移量
   */
  get positionOffset(): Cesium.Cartesian2 {
    return this._positionOffset;
  }
  // eslint-disable-next-line
  set positionOffset(value) {
    this._positionOffset = value;
    this.refresh();
  }

  /**
   * 提示框的显示文本
   */
  get message(): string {
    return this._message ?? '';
  }
  // eslint-disable-next-line
  set message(value) {
    this._message = value;
    this.refresh();
  }

  /**
   * 创建提示框控件
   * @param viewer 视图
   * @param options [object] 提示框样式
   * @param options.fontSize [options.fontSize = 25] number 提示框的字体大小
   * @param options.fontColor [options.fontColor = 'rgba(255, 255, 255,1)'] string 提示框的字体颜色
   * @param options.backgroundColor [options.backgroundColor = 'rgba(11, 19, 61, 0.5)'] string 提示框的背景色
   * @param options.size [options.size = new Cesium.Cartesian2(200, 30)] Cartesian2 提示框的大小
   * @param options.fontOffset [options.fontOffset = new Cesium.Cartesian2(20, 18)] Cartesian2 提示框中的字体以左上角为原点的偏移量，横向为x，竖向为y
   * @param options.positionOffset [options.positionOffset = new Cesium.Cartesian2(10, 0)] Cartesian2 提示框的位置以左上角为原点的偏移量，横向为x，竖向为y
   */
  // eslint-disable-next-line
  constructor(viewer: smart3d.Viewer, options: ToolTipsOptions = {}) {
    this.viewer = viewer;

    if (Cesium.defined(this.isInit)) return;
    if (!Cesium.defined(this.viewer)) {
      throw new Cesium.DeveloperError(
        'viewer was not created, tooltips initialization failed.'
      );
    }
    this._canvas = document.createElement('canvas');
    this.viewer.container.appendChild(this._canvas);
    this._canvas.style.position = 'absolute';
    this._canvas.style.pointerEvents = 'none';
    this.isInit = true;
    this._canvas.style.display = 'none';
    this.setStyle({ ...defaultStyles, ...options });
    this._mouseMoveListener = (event) => {
      this.setTipsPosition(event.x, event.y - 54);
    };
  }

  /**
   * 设置控件位置
   * @param x number 控件的屏幕x坐标
   * @param y number 控件的屏幕y坐标
   */
  setTipsPosition(x: number, y: number): any {
    if (!Cesium.defined(this.isInit)) {
      throw new Cesium.DeveloperError('toolTips is not init.');
    }
    const offsetx =
      this.positionOffset && this.positionOffset.x ? this.positionOffset.x : 0;
    const offsety =
      this.positionOffset && this.positionOffset.y ? this.positionOffset.y : 0;
    this._canvas.style.top = y + offsety + 'px';
    const width = this.size?.x ?? this.width;
    this._canvas.style.left =
      x + width < this.viewer.container.offsetWidth
        ? x + offsetx + 'px'
        : x - width - offsetx + 'px';
  }

  /**
   * 激活提示控件
   */
  activate(): any {
    if (!Cesium.defined(this.isInit)) {
      throw new Cesium.DeveloperError('toolTips is not init.');
    }
    if (this._isActivate) return;

    document.addEventListener('mousemove', this._mouseMoveListener);
    this.canvas.style.display = '';
    this._isActivate = true;
    this.setTipsPosition(
      this.viewer.container.offsetWidth,
      this.viewer.container.offsetHeight
    );
  }

  /**
   * 停用提示控件
   */
  deactivate(): any {
    if (!Cesium.defined(this.isInit)) {
      throw new Cesium.DeveloperError('toolTips is not init.');
    }
    if (this._isActivate) {
      document.removeEventListener('mousemove', this._mouseMoveListener);
      this.canvas.style.display = 'none';
      this._isActivate = false;
    } else {
      // throw new Cesium.DeveloperError('toolTips is already deactivated.');
    }
  }

  /**
   * 设置提示框得样式
   * @param options object 提示框样式
   * @param options.fontSize [options.fontSize = this.fontSize] number 字体大小
   * @param options.fontColor [options.fontColor = this.fontColor] string 字体颜色
   * @param options.backgroundColor [options.backgroundColor = this.backgroundColor] string 提示框背景色
   * @param options.size [options.size = this.size] Cartesian2 提示框大小
   * @param options.fontOffset [options.fontOffset = this.fontOffset] Cartesian2 提示框中的字体以左上角为原点的偏移量，横向为x，竖向为y
   * @param options.positionOffset [options.positionOffset = this.positionOffset] Cartesian2 提示框的位置以左上角为原点的偏移量，横向为x，竖向为y
   */
  setStyle(options: ToolTipsOptions = {}): void {
    if (!Cesium.defined(this.isInit)) {
      throw new Cesium.DeveloperError('toolTips is not init.');
    }
    this.size =
      Cesium.defined(options) && Cesium.defined(options?.size)
        ? options?.size
        : this.size;
    this.fontSize = options?.fontSize ?? this.fontSize;
    this.fontColor = options?.fontColor ?? this.fontColor;
    this.backgroundColor = options?.backgroundColor ?? this.backgroundColor;
    this.fontOffset = options?.fontOffset ?? this.fontOffset;
    this.positionOffset = options?.positionOffset ?? this.positionOffset;
  }

  /**
   * 显示文本信息
   * @param message 需要显示得文本信息
   */
  setMessage(message: string): any {
    if (!Cesium.defined(this.isInit)) {
      throw new Cesium.DeveloperError('toolTips is not init.');
    }
    const ctx = this._canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    if (!this.size) {
      this.width = ctx.measureText(message).width + this.fontOffset.x * 2;
      this._canvas.width = this.width;
    }
    ctx.font = this._fontSize + 'px 微软雅黑';
    ctx.fillStyle = this.fontColor;
    ctx.fillText(message, this.fontOffset?.x, this.fontOffset?.y);
  }

  /**
   * 刷新提示框显示消息
   */
  refresh(): any {
    const ctx = this._canvas.getContext('2d');
    if (!ctx) return;
    ctx.font = this._fontSize + 'px 微软雅黑';
    ctx.fillStyle = this.fontColor;
    if (Cesium.defined(this.message)) {
      this.setMessage(this.message as any);
    }
  }

  hideTips(): void {
    if (!this.show) return;
    this.deactivate();
    this.show = false;
  }

  setMsg(msg: string): void {
    if (!this.show) {
      this.activate();
      this.show = true;
    }
    if (msg === undefined || msg === null) {
      this.hideTips();
    } else {
      this.setMessage(msg);
    }
  }

  /**
   * 销毁
   */
  destroy(): any {
    if (this._isActivate) {
      this.deactivate();
    }
    this.viewer.container.removeChild(this._canvas);
    // this._canvas = undefined;
    this.isInit = undefined;
    this.viewer = undefined;
    this._message = undefined;
    this._mouseMoveListener = undefined;
    this._size = undefined;

    return undefined;
  }
}
