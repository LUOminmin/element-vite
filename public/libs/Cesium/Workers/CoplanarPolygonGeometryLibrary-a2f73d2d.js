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
define(["exports","./Check-42d11d5c","./Cartesian2-42e1269b","./Transforms-e0fb2733","./OrientedBoundingBox-a034c581"],function(n,t,g,l,f){"use strict";var e={},i=new g.Cartesian3,x=new g.Cartesian3,B=new g.Cartesian3,P=new g.Cartesian3,M=new f.OrientedBoundingBox;function o(n,t,e,r,a){t=g.Cartesian3.subtract(n,t,i),e=g.Cartesian3.dot(e,t),t=g.Cartesian3.dot(r,t);return g.Cartesian2.fromElements(e,t,a)}e.validOutline=function(n){var t=f.OrientedBoundingBox.fromPoints(n,M).halfAxes,e=l.Matrix3.getColumn(t,0,x),n=l.Matrix3.getColumn(t,1,B),t=l.Matrix3.getColumn(t,2,P),e=g.Cartesian3.magnitude(e),n=g.Cartesian3.magnitude(n),t=g.Cartesian3.magnitude(t);return!(0===e&&(0===n||0===t)||0===n&&0===t)},e.computeProjectTo2DArguments=function(n,t,e,r){var a,i,o=f.OrientedBoundingBox.fromPoints(n,M),u=o.halfAxes,s=l.Matrix3.getColumn(u,0,x),C=l.Matrix3.getColumn(u,1,B),c=l.Matrix3.getColumn(u,2,P),m=g.Cartesian3.magnitude(s),d=g.Cartesian3.magnitude(C),n=g.Cartesian3.magnitude(c),u=Math.min(m,d,n);return(0!==m||0!==d&&0!==n)&&(0!==d||0!==n)&&(u!==d&&u!==n||(a=s),u===m?a=C:u===n&&(i=C),u!==m&&u!==d||(i=c),g.Cartesian3.normalize(a,e),g.Cartesian3.normalize(i,r),g.Cartesian3.clone(o.center,t),!0)},e.createProjectPointsTo2DFunction=function(r,a,i){return function(n){for(var t=new Array(n.length),e=0;e<n.length;e++)t[e]=o(n[e],r,a,i);return t}},e.createProjectPointTo2DFunction=function(e,r,a){return function(n,t){return o(n,e,r,a,t)}},n.CoplanarPolygonGeometryLibrary=e});
