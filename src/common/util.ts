import * as Cesium from '@smart/cesium';
import smart3d from 'smart3d';
import * as proj4 from 'proj4';

export const generateUUID = (): string => {
  let d = new Date().getTime();
  if (window.performance && typeof window.performance.now === 'function') {
    d += performance.now(); // use high-precision timer if available
  }
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    // tslint:disable no-bitwise
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
};

/**
 * 计算垂足坐标
 */
export function computeCZ(
  p1: Cesium.Cartesian3,
  p2: Cesium.Cartesian3,
  p3: Cesium.Cartesian3
): any {
  const c1 = Cesium.Cartesian3.subtract(p2, p1, new Cesium.Cartesian3());
  const c2 = Cesium.Cartesian3.subtract(p3, p1, new Cesium.Cartesian3());
  const angle = Cesium.Cartesian3.angleBetween(c1, c2);
  let dis = Cesium.Cartesian3.distance(p1, p3);
  dis = dis * Math.cos(angle);
  const nor = Cesium.Cartesian3.normalize(c1, new Cesium.Cartesian3());
  const newC = Cesium.Cartesian3.multiplyByScalar(
    nor,
    dis,
    new Cesium.Cartesian3()
  );

  const res = Cesium.Cartesian3.add(newC, p1, new Cesium.Cartesian3());

  return res;
}

/**
 * 计算两点之间距离
 * @param point1
 * @param point2
 * @returns
 */
// eslint-disable-next-line
export const getDistance = (point1: any, point2: any): number => {
  if (!point1 || !point2) {
    return 0;
  }
  if (point1.x >= -180 && point1.x <= 180) {
    point1 = wgs842WebMercator(point1.x, point1.y);
  }
  if (point2.x >= -180 && point2.x <= 180) {
    point2 = wgs842WebMercator(point2.x, point2.y);
  }
  const distance = Cesium.Cartesian3.distance(point1, point2);
  return distance;
};

/**
 * wgs84转WebMercator
 * @param lon 经度
 * @param lat 纬度
 * @returns
 */
export const wgs842WebMercator = (lon: number, lat: number): any => {
  const x = (lon * 20037508.34) / 180;
  let y = Math.log(Math.tan((90 + lat) * Math.PI) / 360) / (Math.PI / 180);
  y = (y * 20037508.34) / 180;
  return { x: x, y: y };
};

/**
 * 计算空间两条直线的最短距离
 */
export function minDistanceBetweenLine(
  p1: Cesium.Cartesian3,
  p2: Cesium.Cartesian3,
  p3: Cesium.Cartesian3,
  p4: Cesium.Cartesian3
): any {
  const distanceArray = [] as any;
  const pointArray = [] as any;
  let distance;
  let point;
  let footPoint;
  const pointInLine = getPointbetweenLine(p1, p2, 100);
  for (let i = 0; i < 100; i++) {
    footPoint = computeCZ(p3, p4, pointInLine[i]);
    distance = getDistance(pointInLine[i], footPoint);
    point = pointInLine[i];
    distanceArray.push(distance);
    pointArray.push(footPoint);
  }
  for (let i = 0; i < distanceArray.length; i++) {
    if (distanceArray[i] < distance) {
      distance = distanceArray[i];
      footPoint = pointArray[i];
      point = pointInLine[i];
    }
  }
  return [distance, point, footPoint];
}

function getPointbetweenLine(p1, p2, count) {
  const pointArray = [] as any;
  for (let i = 0; i < count; i++) {
    pointArray.push(
      Cesium.Cartesian3.lerp(p1, p2, i / 100, new Cesium.Cartesian3())
    );
  }
  return pointArray;
}

/**
 * 获取数组最小值
 */
// eslint-disable-next-line
export function getArrayminValue(disArray: any): any {
  let min = disArray[0];
  let id = 0;
  disArray.forEach((item, index) => {
    if (item < min) {
      min = item;
      id = index;
    }
  });
  return id;
}

/**
 * 屏幕坐标转世界坐标，带点云吸附效果
 * @param {Viewer} [options.viewer] 视图对象
 * @param {Cartesian2} [options.cartesian2] 屏幕坐标
 * @param {Number} [options.screenPixels] 吸附范围（屏幕像素）
 * @param {Number} [options.intervalAngle] 间隔角度
 * @param {Boolean} [options.rerunOtherPoint=true] 如果未吸附到点云，是否返回鼠标拾取到的世界坐标点
 * @returns
 */
export const cartesian2To3PointCloud = (options: {
  viewer: smart3d.Viewer;
  cartesian2: Cesium.Cartesian2;
  screenPixels: number;
  intervalAngle: number;
  rerunOtherPoint?: boolean;
}): Cesium.Cartesian3 | null => {
  const { viewer, cartesian2, screenPixels, intervalAngle } = options;
  const scene = viewer.scene;
  if (intervalAngle <= 0 || intervalAngle >= 360) {
    throw new Cesium.DeveloperError(
      'intervalAngle parameter range from 0 to 360！'
    );
  }
  if (screenPixels <= 0) {
    throw new Cesium.DeveloperError(
      'screenPixels parameter must be greater than zero！'
    );
  }
  // const rerunOtherPoint = Cesium.defaultValue(options.rerunOtherPoint, true);

  const pickPointCloud = scene.pick(cartesian2, screenPixels, screenPixels);
  if (
    pickPointCloud &&
    pickPointCloud.content &&
    pickPointCloud.content instanceof (Cesium as any).PointCloud3DTileContent
  ) {
    for (let sp = 0; sp <= screenPixels; sp += 1) {
      for (let ia = 0; ia < 360; ia += intervalAngle) {
        const myCartesian2 = new Cesium.Cartesian2(
          cartesian2.x + sp * Math.cos(Cesium.Math.toRadians(ia)),
          cartesian2.y + sp * Math.sin(Cesium.Math.toRadians(ia))
        );
        const pick = scene.pick(myCartesian2);
        if (
          pick &&
          pick.content &&
          pick.content instanceof (Cesium as any).PointCloud3DTileContent
        ) {
          const cartesian3point = scene.pickPosition(myCartesian2);
          const cartographic =
            Cesium.Cartographic.fromCartesian(cartesian3point);
          if (cartographic.height >= 0 && scene.globe) {
            const ray = viewer.camera.getPickRay(myCartesian2);
            const cartesian = scene.globe.pick(ray, scene) as any;
            const distance = Cesium.Cartesian3.distance(
              cartesian3point,
              cartesian
            );
            if (distance > 0.6) {
              return cartesian3point;
            }
          }
        }
      }
    }
  }

  // return rerunOtherPoint ? cartesian2To3(cartesian2, viewer) : null;
  // 当前数据不涉及点云格式
  return cartesian2To3(cartesian2, viewer);
};

export const cartesian2To3 = (
  cartesian2: Cesium.Cartesian2,
  viewer: smart3d.Viewer
): Cesium.Cartesian3 => {
  const scene = viewer.scene;
  let cartesian = scene.pickPosition(cartesian2);

  if (cartesian) {
    const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
    if (cartographic.height < 0 && scene.globe) {
      const ray = viewer.camera.getPickRay(cartesian2);
      cartesian = scene.globe.pick(ray, scene) as any;
    }
  } else {
    const ray = viewer.camera.getPickRay(cartesian2);
    cartesian = scene.globe.pick(ray, scene) as any;
    if (!cartesian)
      cartesian = viewer.camera.pickEllipsoid(
        cartesian2,
        scene.globe.ellipsoid
      ) as any;
  }
  return cartesian;
};

/**
 * 获取圆的外边框点
 * @param center 圆的圆心
 * @param radius 圆的半径
 * @param height 圆的高度
 * @returns
 */
export function getCircularCartesian(
  center: Cesium.Cartesian3,
  radius: number,
  height: number
): Cesium.Cartesian3[] {
  const circleIn = new Cesium.CircleOutlineGeometry({
    center,
    radius,
    height
  });
  const geometryIn = Cesium.CircleOutlineGeometry.createGeometry(circleIn);
  return getGeometryPoints(geometryIn);
}

/**
 * 获取Geometry的节点
 * @param geometryIn Geometry
 * @returns
 */
// eslint-disable-next-line
export function getGeometryPoints(geometryIn: any): Cesium.Cartesian3[] {
  if (!geometryIn) return [];
  const float64ArrayPositionsIn = geometryIn.attributes.position.values;
  const positionsIn = [].slice.call(float64ArrayPositionsIn);
  const oneArrL1 = positionsIn.length;
  // 将一维数组转换成三维数组istrack
  const erArrL1 = positionsIn.length / 3;
  const er1 = [] as any;
  for (let p = 0; p < erArrL1; p++) {
    er1[p] = [];
  }

  let k1 = 0;
  for (let o = 0; o < erArrL1; o++) {
    for (let u = 0; u < 3; u++) {
      er1[o][u] = positionsIn[k1];
      k1++;
      if (k1 > oneArrL1 - 1) {
        break;
      }
    }
  }

  const posCir1 = [] as any;
  er1.forEach((item) => {
    posCir1.push(new Cesium.Cartesian3(item[0], item[1], item[2]));
  });
  return posCir1;
}

/**
 * 获取指定范围内的TIN数据.三角网来源于地形瓦片,地形瓦片集合请参照{@link Cesium.QuadtreeTile}
 * @param {Array.<Cartesian3>} boundary 指定的范围(必须首尾相连)
 * @param {Array.<Object>} tiles 地形瓦片的集合
 * @returns {Array.<Cartesian3[]>} 在指定范围内所有的TIN点
 *
 */
export const getTinByPolygon = (
  boundary: Cesium.Cartesian3[],
  tiles: any[]
): Cesium.Cartesian3[] => {
  const tins = [] as any;
  getTilesByPolygon(boundary, tiles).map((tile) => {
    const mesh = tile.data.renderedMesh;
    const vertices = mesh.vertices;
    const indices = mesh.indices;
    const encoding = mesh.encoding;
    for (let num = 0; num < mesh.indexCountWithoutSkirts; num += 1) {
      tins.push(
        encoding.decodePosition(vertices, indices[num], new Cesium.Cartesian3())
      );
    }
  });
  const cartographicBoundary = boundary.map((value) =>
    Cesium.Cartographic.fromCartesian(value)
  );
  return tins.filter((tin) => {
    const cartographicTin = Cesium.Cartographic.fromCartesian(tin);
    return IsInsidePolygon(cartographicTin, cartographicBoundary);
  });
};

/**
 * 获取指定范围内与之相交的地形瓦片节点
 * @param {Array.<Cartesian3>} boundary 指定的范围(必须首尾相连)
 * @param {Array.<Object>} tiles 地形瓦片的集合,其格式为QuadtreeTile[]
 * @returns {Object}  返回与指定范围相交的地形瓦片数组,其格式跟传入的地形瓦片集合一致
 */
export const getTilesByPolygon = (
  boundary: Cesium.Cartesian3[],
  tiles: any[]
): any[] => {
  const vertex =
    Cesium.Ellipsoid.WGS84.cartesianArrayToCartographicArray(boundary);
  const insideTiles = [] as any;
  tiles.map((tile) => {
    const rect = tile.rectangle;
    for (let i = 0; i < vertex.length - 1; i += 2) {
      const a1 = vertex[i];
      const a2 = vertex[i + 1];
      if (
        // 多边形跟瓦片相交
        isLineIntersect(
          a1,
          a2,
          Cesium.Rectangle.southwest(rect),
          Cesium.Rectangle.northwest(rect)
        ) ||
        isLineIntersect(
          a1,
          a2,
          Cesium.Rectangle.northwest(rect),
          Cesium.Rectangle.northeast(rect)
        ) ||
        isLineIntersect(
          a1,
          a2,
          Cesium.Rectangle.northeast(rect),
          Cesium.Rectangle.southeast(rect)
        ) ||
        isLineIntersect(
          a1,
          a2,
          Cesium.Rectangle.southeast(rect),
          Cesium.Rectangle.southwest(rect)
        ) ||
        // 瓦片的顶点在多边形内部,作为第一种情况的补充,排除偶然的计算误差
        IsInsidePolygon(Cesium.Rectangle.southwest(rect), vertex) ||
        IsInsidePolygon(Cesium.Rectangle.northeast(rect), vertex) ||
        IsInsidePolygon(Cesium.Rectangle.northwest(rect), vertex) ||
        IsInsidePolygon(Cesium.Rectangle.southeast(rect), vertex) ||
        // 多边形在单个瓦片内部
        IsInsidePolygon(a1, [
          Cesium.Rectangle.southwest(rect),
          Cesium.Rectangle.northeast(rect),
          Cesium.Rectangle.northwest(rect),
          Cesium.Rectangle.southeast(rect),
          Cesium.Rectangle.southwest(rect)
        ]) ||
        IsInsidePolygon(a2, [
          Cesium.Rectangle.southwest(rect),
          Cesium.Rectangle.northeast(rect),
          Cesium.Rectangle.northwest(rect),
          Cesium.Rectangle.southeast(rect),
          Cesium.Rectangle.southwest(rect)
        ])
      ) {
        insideTiles.push(tile);
        break;
      }
    }
  });
  return insideTiles;
};

/**
 * 判断线段是否相交
 * @param {Cartographic} a1 线段a的一个顶点
 * @param {Cartographic} a2 线段a的另一个顶点
 * @param {Cartographic} b1 线段b的一个顶点
 * @param {Cartographic} b2 线段b的另一个顶点
 * @returns {boolean} 相交结果
 */
export const isLineIntersect = (
  a1: Cesium.Cartographic,
  a2: Cesium.Cartographic,
  b1: Cesium.Cartographic,
  b2: Cesium.Cartographic
): boolean => {
  return Cesium.defined(getLineIntersect(a1, a2, b1, b2));
};

/**
 * 返回两条线段的交点
 * @param {Cartographic} a1 线段a的一个顶点
 * @param {Cartographic} a2 线段a的另一个顶点
 * @param {Cartographic} b1 线段b的一个顶点
 * @param {Cartographic} b2 线段b的另一个顶点
 * @returns {Cartesian2|undefined} 返回线段交点,若没有交点则返回undefined
 */
export const getLineIntersect = (
  a1: Cesium.Cartographic,
  a2: Cesium.Cartographic,
  b1: Cesium.Cartographic,
  b2: Cesium.Cartographic
): Cesium.Cartesian2 | undefined => {
  return Cesium.Intersections2D.computeLineSegmentLineSegmentIntersection(
    a1.longitude,
    a1.latitude,
    a2.longitude,
    a2.latitude,
    b1.longitude,
    b1.latitude,
    b2.longitude,
    b2.latitude
  );
};

/**
 * 判断点是否在指定范围内
 * @param {Cartographic} point 需要被判断的点
 * @param {Array.<Cartographic>} polygon 指定的范围(必须首尾相连)
 * @returns {boolean} true为在多边形内,反正则为false
 */
export const IsInsidePolygon = (
  point: Cesium.Cartographic,
  polygon: Cesium.Cartographic[]
): boolean => {
  let counter = 0;
  let xinters;
  let p1, p2;
  const pointCount = polygon.length;
  const checkPoint = Cesium.Cartographic.clone(point);
  p1 = polygon[0];
  for (let i = 1; i <= pointCount; i++) {
    p2 = polygon[i % pointCount];
    if (
      checkPoint.longitude > Math.min(p1.longitude, p2.longitude) &&
      checkPoint.longitude <= Math.max(p1.longitude, p2.longitude)
    ) {
      if (checkPoint.latitude <= Math.max(p1.latitude, p2.latitude)) {
        if (p1.longitude !== p2.longitude) {
          xinters =
            (checkPoint.longitude - p1.longitude) * (p2.latitude - p1.latitude);
          xinters = xinters / (p2.longitude - p1.longitude) + p1.latitude;
          if (p1.latitude === p2.latitude || checkPoint.latitude <= xinters) {
            counter++;
          }
        }
      }
    }
    p1 = p2;
  }
  return counter % 2 !== 0;
};

/**
 * 大地2000经纬/大地2000投影转WGS84经纬度
 * @param x 坐标x
 * @param y 坐标y
 */
export const unprojPoint = (x: number, y: number): number[] => {
  const proj = proj4['default'];
  const prj84 =
    '+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees';
  const cgcs2000 =
    '+proj=tmerc +lat_0=0 +lon_0=120 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs';
  const cwcs2000 = '+proj=longlat +ellps=GRS80 +no_defs';

  // 大地2000经纬->WGS84经纬度
  if (x >= 0 && x <= 180 && y >= -90 && y <= 90) {
    return proj(cwcs2000, prj84, [x, y]);
  } else {
    return proj(cgcs2000, prj84, [x, y]);
  }
};

export const projPoint = (
  lon: number,
  lat: number,
  coortype: '2000g' | '2000p' | '84g'
): [number, number] => {
  const proj = proj4['default'];
  if (lon && lat && coortype !== '84g') {
    const prj84 =
      '+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees';
    const cwcs2000 = '+proj=longlat +ellps=GRS80 +no_defs';
    if (coortype === '2000g') {
      return proj(prj84, cwcs2000, [lon, lat]);
    } else {
      const coordInCwcs = proj(prj84, cwcs2000, [lon, lat]);
      const realCrsText = getProject2000Text(coordInCwcs[0]);
      return proj(prj84, realCrsText, [lon, lat]);
    }
  } else {
    return [lon, lat];
  }
};

const getProject2000Text = (longitude: number) => {
  const minLon = 73.5; // EPSG:4534 最小经度
  const maxLon = 133.5; // EPSG:4554 最小经度
  const minCenterLon = 75; // EPSG:4534 中央子午线

  if (longitude < minLon) {
    longitude = minLon;
  } else if (longitude > maxLon) {
    longitude = maxLon;
  }
  const lonDif = longitude - minLon;
  const curLon = minCenterLon + Math.floor(lonDif / 3) * 3;

  const projectionText =
    '+proj=tmerc +lat_0=0 +lon_0=' +
    curLon +
    ' +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs';
  return projectionText;
};

export type Degrees = {
  longitude: number;
  latitude: number;
  height: number;
};

export function cartesianToDegrees(cartesian: Cesium.Cartesian3): Degrees {
  const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
  return cartographicToDegrees(cartographic);
}

function cartographicToDegrees(cartographic: Cesium.Cartographic): Degrees {
  const longitude = Cesium.Math.toDegrees(cartographic.longitude);
  const latitude = Cesium.Math.toDegrees(cartographic.latitude);
  const height = cartographic.height;
  return {
    longitude,
    latitude,
    height
  };
}

/**
 * 端点判断法将多边形顶点以逆时针方向输出
 * @param points 多边形的笛卡尔点集
 * @param anti => true: 逆， false: 顺
 * @returns points => 转换后的点集
 * notes: 目前只支持平面上多边形的顺逆判断，所以points最好高程一致
 */
export function getPolygonClockwise(
  points: Cesium.Cartesian3[],
  anti = true
): Cesium.Cartesian3[] {
  const inversePoints: Cesium.Cartesian3[] = [];
  const pointLen = points.length;
  let [indexOfMaxX, indexOfMaxY] = [pointLen - 1, pointLen - 1];
  let [maxX, maxY] = [points[pointLen - 1].x, points[pointLen - 1].y];
  let [sameX, sameY] = [true, true];
  for (let i = pointLen - 1; i >= 0; i--) {
    const point = points[i];
    inversePoints.push(point);
    // 判断多边形是否与XOZ/XOY平面平行
    if (i !== pointLen - 1) {
      if (point.x !== points[i + 1].x) {
        sameX = false;
      }
      if (point.y !== points[i + 1].y) {
        sameY = false;
      }
    }
    if (point.x > maxX) {
      maxX = point[i];
      indexOfMaxX = i;
    }
    if (point.y > maxY) {
      maxY = point[i];
      indexOfMaxY = i;
    }
  }
  let maxPoint; // 坐标轴正方向的点
  let lastPoint;
  let nextPoint;
  let axisNormal;
  // 端点判断多边形顺逆
  if (!sameX) {
    maxPoint = points[indexOfMaxX];
    if (indexOfMaxX === 0) {
      lastPoint = points[pointLen - 1];
      nextPoint = points[indexOfMaxX + 1];
    } else if (indexOfMaxX === pointLen - 1) {
      lastPoint = points[indexOfMaxX - 1];
      nextPoint = points[0];
    } else {
      lastPoint = points[indexOfMaxX - 1];
      nextPoint = points[indexOfMaxX + 1];
    }
    axisNormal = new Cesium.Cartesian3(0, 0, 1);
  } else if (!sameY) {
    maxPoint = points[indexOfMaxY];
    if (indexOfMaxY === 0) {
      lastPoint = points[pointLen - 1];
      nextPoint = points[indexOfMaxY + 1];
    } else if (indexOfMaxY === pointLen - 1) {
      lastPoint = points[indexOfMaxY - 1];
      nextPoint = points[0];
    } else {
      lastPoint = points[indexOfMaxY - 1];
      nextPoint = points[indexOfMaxY + 1];
    }
    axisNormal = new Cesium.Cartesian3(1, 0, 0);
  } else {
    console.error(
      'The area is so special that is parallel to PLANE XOY!',
      points
    );
    return points;
  }
  const cross = Cesium.Cartesian3.cross(
    Cesium.Cartesian3.subtract(maxPoint, lastPoint, new Cesium.Cartesian3()),
    Cesium.Cartesian3.subtract(nextPoint, maxPoint, new Cesium.Cartesian3()),
    new Cesium.Cartesian3()
  );
  const res = Cesium.Cartesian3.dot(cross, axisNormal); // 正为逆
  return anti
    ? res > 0
      ? points
      : inversePoints
    : res > 0
    ? inversePoints
    : points;
}
