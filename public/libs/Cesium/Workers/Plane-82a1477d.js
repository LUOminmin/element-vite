/**
 * Cesium - https://github.com/CesiumGS/cesium
 *
 * Copyright 2011-2020 Cesium Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * modify for smart3d
 * http://www.southsmart.com/smartmap/smart3d
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Columbus View (Pat. Pend.)
 *
 * Portions licensed separately.
 * See https://github.com/CesiumGS/cesium/blob/master/LICENSE.md for full licensing details.
 */
define(["exports","./when-fa189214","./Check-42d11d5c","./Math-6c04a9ed","./Cartesian2-5ad33469","./Transforms-81b965ce"],function(n,r,e,a,i,s){"use strict";function o(n,e){this.normal=i.Cartesian3.clone(n),this.distance=e}o.fromPointNormal=function(n,e,a){n=-i.Cartesian3.dot(e,n);return r.defined(a)?(i.Cartesian3.clone(e,a.normal),a.distance=n,a):new o(e,n)};var t=new i.Cartesian3;o.fromCartesian4=function(n,e){var a=i.Cartesian3.fromCartesian4(n,t),n=n.w;return r.defined(e)?(i.Cartesian3.clone(a,e.normal),e.distance=n,e):new o(a,n)},o.getPointDistance=function(n,e){return i.Cartesian3.dot(n.normal,e)+n.distance};var c=new i.Cartesian3;o.projectPointOntoPlane=function(n,e,a){r.defined(a)||(a=new i.Cartesian3);var t=o.getPointDistance(n,e),t=i.Cartesian3.multiplyByScalar(n.normal,t,c);return i.Cartesian3.subtract(e,t,a)};var d=new s.Matrix4,l=new s.Cartesian4,C=new i.Cartesian3;o.transform=function(n,e,a){var t=n.normal,n=n.distance,e=s.Matrix4.inverseTranspose(e,d),n=s.Cartesian4.fromElements(t.x,t.y,t.z,n,l),n=s.Matrix4.multiplyByVector(e,n,n),e=i.Cartesian3.fromCartesian4(n,C);return n=s.Cartesian4.divideByScalar(n,i.Cartesian3.magnitude(e),n),o.fromCartesian4(n,a)},o.clone=function(n,e){return r.defined(e)?(i.Cartesian3.clone(n.normal,e.normal),e.distance=n.distance,e):new o(n.normal,n.distance)},o.equals=function(n,e){return n.distance===e.distance&&i.Cartesian3.equals(n.normal,e.normal)},o.ORIGIN_XY_PLANE=Object.freeze(new o(i.Cartesian3.UNIT_Z,0)),o.ORIGIN_YZ_PLANE=Object.freeze(new o(i.Cartesian3.UNIT_X,0)),o.ORIGIN_ZX_PLANE=Object.freeze(new o(i.Cartesian3.UNIT_Y,0)),n.Plane=o});
