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
define(["exports","./when-fa189214","./Check-42d11d5c","./Math-6c04a9ed","./Cartesian2-5ad33469","./Transforms-81b965ce","./GeometryAttribute-aa4fc0c2"],function(t,S,n,X,Y,a,l){"use strict";var w=Math.cos,M=Math.sin,m=Math.sqrt,r={computePosition:function(t,n,a,r,e,o,s){var i=n.radiiSquared,g=t.nwCorner,h=t.boundingRectangle,c=g.latitude-t.granYCos*r+e*t.granXSin,u=w(c),C=M(c),l=i.z*C,d=g.longitude+r*t.granYSin+e*t.granXCos,n=u*w(d),g=u*M(d),u=i.x*n,i=i.y*g,C=m(u*n+i*g+l*C);o.x=u/C,o.y=i/C,o.z=l/C,a&&(a=t.stNwCorner,S.defined(a)?(c=a.latitude-t.stGranYCos*r+e*t.stGranXSin,d=a.longitude+r*t.stGranYSin+e*t.stGranXCos,s.x=(d-t.stWest)*t.lonScalar,s.y=(c-t.stSouth)*t.latScalar):(s.x=(d-h.west)*t.lonScalar,s.y=(c-h.south)*t.latScalar))}},d=new l.Matrix2,p=new Y.Cartesian3,G=new Y.Cartographic,f=new Y.Cartesian3,x=new a.GeographicProjection;function R(t,n,a,r,e,o,s){var i=Math.cos(n),g=r*i,h=a*i,c=Math.sin(n),u=r*c,C=a*c;p=x.project(t,p),p=Y.Cartesian3.subtract(p,f,p);i=l.Matrix2.fromRotation(n,d);p=l.Matrix2.multiplyByVector(i,p,p),p=Y.Cartesian3.add(p,f,p),--o,--s;r=(t=x.unproject(p,t)).latitude,a=r+o*C,c=r-g*s,n=r-g*s+o*C,i=Math.max(r,a,c,n),r=Math.min(r,a,c,n),a=t.longitude,c=a+o*h,n=a+s*u,o=a+s*u+o*h;return{north:i,south:r,east:Math.max(a,c,n,o),west:Math.min(a,c,n,o),granYCos:g,granYSin:u,granXCos:h,granXSin:C,nwCorner:t}}r.computeOptions=function(t,n,a,r,e,o,s){var i=t.east,g=t.west,h=t.north,c=t.south,u=!1,C=!1;h===X.CesiumMath.PI_OVER_TWO&&(u=!0),c===-X.CesiumMath.PI_OVER_TWO&&(C=!0);var l,d=h-c,S=(w=i<g?X.CesiumMath.TWO_PI-g+i:i-g)/((l=Math.ceil(w/n)+1)-1),w=d/((M=Math.ceil(d/n)+1)-1),d=Y.Rectangle.northwest(t,o),n=Y.Rectangle.center(t,G);0===a&&0===r||(n.longitude<d.longitude&&(n.longitude+=X.CesiumMath.TWO_PI),f=x.project(n,f));var M,o=w,n=S,e=Y.Rectangle.clone(t,e),C={granYCos:o,granYSin:0,granXCos:n,granXSin:0,nwCorner:d,boundingRectangle:e,width:l,height:M,northCap:u,southCap:C};return 0!==a&&(h=(d=R(d,a,S,w,0,l,M)).north,c=d.south,i=d.east,g=d.west,C.granYCos=d.granYCos,C.granYSin=d.granYSin,C.granXCos=d.granXCos,C.granXSin=d.granXSin,e.north=h,e.south=c,e.east=i,e.west=g),0!==r&&(a-=r,M=R(s=Y.Rectangle.northwest(e,s),a,S,w,0,l,M),C.stGranYCos=M.granYCos,C.stGranXCos=M.granXCos,C.stGranYSin=M.granYSin,C.stGranXSin=M.granXSin,C.stNwCorner=s,C.stWest=M.west,C.stSouth=M.south),C},t.RectangleGeometryLibrary=r});
