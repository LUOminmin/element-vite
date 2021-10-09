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
define(["exports","./Math-6c04a9ed"],function(r,l){"use strict";var t={computePositions:function(r,t,e,a,i){for(var n=.5*r,o=-n,r=a+a,s=new Float64Array(3*(i?2*r:r)),c=0,u=0,f=i?3*r:0,h=i?3*(r+a):3*a,y=0;y<a;y++){var M=y/a*l.CesiumMath.TWO_PI,d=Math.cos(M),m=Math.sin(M),v=d*e,M=m*e,d=d*t,m=m*t;s[u+f]=v,s[u+f+1]=M,s[u+f+2]=o,s[u+h]=d,s[u+h+1]=m,s[u+h+2]=n,u+=3,i&&(s[c++]=v,s[c++]=M,s[c++]=o,s[c++]=d,s[c++]=m,s[c++]=n)}return s}};r.CylinderGeometryLibrary=t});
