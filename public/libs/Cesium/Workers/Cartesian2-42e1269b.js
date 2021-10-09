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
define(["exports","./when-fa189214","./Check-42d11d5c","./Math-6c04a9ed"],function(e,S,r,q){"use strict";function O(e,t,n){this.x=S.defaultValue(e,0),this.y=S.defaultValue(t,0),this.z=S.defaultValue(n,0)}O.fromSpherical=function(e,t){S.defined(t)||(t=new O);var n=e.clock,a=e.cone,i=S.defaultValue(e.magnitude,1),e=i*Math.sin(a);return t.x=e*Math.cos(n),t.y=e*Math.sin(n),t.z=i*Math.cos(a),t},O.fromElements=function(e,t,n,a){return S.defined(a)?(a.x=e,a.y=t,a.z=n,a):new O(e,t,n)},O.fromCartesian4=O.clone=function(e,t){if(S.defined(e))return S.defined(t)?(t.x=e.x,t.y=e.y,t.z=e.z,t):new O(e.x,e.y,e.z)},O.packedLength=3,O.pack=function(e,t,n){return n=S.defaultValue(n,0),t[n++]=e.x,t[n++]=e.y,t[n]=e.z,t},O.unpack=function(e,t,n){return t=S.defaultValue(t,0),S.defined(n)||(n=new O),n.x=e[t++],n.y=e[t++],n.z=e[t],n},O.packArray=function(e,t){var n=e.length,a=3*n;if(S.defined(t)){if(!Array.isArray(t)&&t.length!==a)throw new r.DeveloperError("If result is a typed array, it must have exactly array.length * 3 elements");t.length!==a&&(t.length=a)}else t=new Array(a);for(var i=0;i<n;++i)O.pack(e[i],t,3*i);return t},O.unpackArray=function(e,t){var n=e.length;S.defined(t)?t.length=n/3:t=new Array(n/3);for(var a=0;a<n;a+=3){var i=a/3;t[i]=O.unpack(e,a,t[i])}return t},O.fromArray=O.unpack,O.maximumComponent=function(e){return Math.max(e.x,e.y,e.z)},O.minimumComponent=function(e){return Math.min(e.x,e.y,e.z)},O.minimumByComponent=function(e,t,n){return n.x=Math.min(e.x,t.x),n.y=Math.min(e.y,t.y),n.z=Math.min(e.z,t.z),n},O.maximumByComponent=function(e,t,n){return n.x=Math.max(e.x,t.x),n.y=Math.max(e.y,t.y),n.z=Math.max(e.z,t.z),n},O.magnitudeSquared=function(e){return e.x*e.x+e.y*e.y+e.z*e.z},O.magnitude=function(e){return Math.sqrt(O.magnitudeSquared(e))};var n=new O;O.distance=function(e,t){return O.subtract(e,t,n),O.magnitude(n)},O.distanceSquared=function(e,t){return O.subtract(e,t,n),O.magnitudeSquared(n)},O.normalize=function(e,t){var n=O.magnitude(e);return t.x=e.x/n,t.y=e.y/n,t.z=e.z/n,t},O.dot=function(e,t){return e.x*t.x+e.y*t.y+e.z*t.z},O.multiplyComponents=function(e,t,n){return n.x=e.x*t.x,n.y=e.y*t.y,n.z=e.z*t.z,n},O.divideComponents=function(e,t,n){return n.x=e.x/t.x,n.y=e.y/t.y,n.z=e.z/t.z,n},O.add=function(e,t,n){return n.x=e.x+t.x,n.y=e.y+t.y,n.z=e.z+t.z,n},O.subtract=function(e,t,n){return n.x=e.x-t.x,n.y=e.y-t.y,n.z=e.z-t.z,n},O.multiplyByScalar=function(e,t,n){return n.x=e.x*t,n.y=e.y*t,n.z=e.z*t,n},O.divideByScalar=function(e,t,n){return n.x=e.x/t,n.y=e.y/t,n.z=e.z/t,n},O.negate=function(e,t){return t.x=-e.x,t.y=-e.y,t.z=-e.z,t},O.abs=function(e,t){return t.x=Math.abs(e.x),t.y=Math.abs(e.y),t.z=Math.abs(e.z),t};var i=new O;O.lerp=function(e,t,n,a){return O.multiplyByScalar(t,n,i),a=O.multiplyByScalar(e,1-n,a),O.add(i,a,a)};var a=new O,u=new O;O.angleBetween=function(e,t){O.normalize(e,a),O.normalize(t,u);e=O.dot(a,u),t=O.magnitude(O.cross(a,u,a));return Math.atan2(t,e)};var o=new O;O.mostOrthogonalAxis=function(e,t){e=O.normalize(e,o);return O.abs(e,e),t=e.x<=e.y?e.x<=e.z?O.clone(O.UNIT_X,t):O.clone(O.UNIT_Z,t):e.y<=e.z?O.clone(O.UNIT_Y,t):O.clone(O.UNIT_Z,t)},O.projectVector=function(e,t,n){e=O.dot(e,t)/O.dot(t,t);return O.multiplyByScalar(t,e,n)},O.equals=function(e,t){return e===t||S.defined(e)&&S.defined(t)&&e.x===t.x&&e.y===t.y&&e.z===t.z},O.equalsArray=function(e,t,n){return e.x===t[n]&&e.y===t[n+1]&&e.z===t[n+2]},O.equalsEpsilon=function(e,t,n,a){return e===t||S.defined(e)&&S.defined(t)&&q.CesiumMath.equalsEpsilon(e.x,t.x,n,a)&&q.CesiumMath.equalsEpsilon(e.y,t.y,n,a)&&q.CesiumMath.equalsEpsilon(e.z,t.z,n,a)},O.cross=function(e,t,n){var a=e.x,i=e.y,r=e.z,u=t.x,o=t.y,e=t.z,t=i*e-r*o,e=r*u-a*e,u=a*o-i*u;return n.x=t,n.y=e,n.z=u,n},O.midpoint=function(e,t,n){return n.x=.5*(e.x+t.x),n.y=.5*(e.y+t.y),n.z=.5*(e.z+t.z),n},O.fromDegrees=function(e,t,n,a,i){return e=q.CesiumMath.toRadians(e),t=q.CesiumMath.toRadians(t),O.fromRadians(e,t,n,a,i)};var d=new O,s=new O,h=new O(40680631590769,40680631590769,40408299984661.445);O.fromRadians=function(e,t,n,a,i){n=S.defaultValue(n,0);var r=S.defined(a)?a.radiiSquared:h,a=Math.cos(t);d.x=a*Math.cos(e),d.y=a*Math.sin(e),d.z=Math.sin(t),d=O.normalize(d,d),O.multiplyComponents(r,d,s);r=Math.sqrt(O.dot(d,s));return s=O.divideByScalar(s,r,s),d=O.multiplyByScalar(d,n,d),S.defined(i)||(i=new O),O.add(s,d,i)},O.fromDegreesArray=function(e,t,n){var a=e.length;S.defined(n)?n.length=a/2:n=new Array(a/2);for(var i=0;i<a;i+=2){var r=e[i],u=e[i+1],o=i/2;n[o]=O.fromDegrees(r,u,0,t,n[o])}return n},O.fromRadiansArray=function(e,t,n){var a=e.length;S.defined(n)?n.length=a/2:n=new Array(a/2);for(var i=0;i<a;i+=2){var r=e[i],u=e[i+1],o=i/2;n[o]=O.fromRadians(r,u,0,t,n[o])}return n},O.fromDegreesArrayHeights=function(e,t,n){var a=e.length;S.defined(n)?n.length=a/3:n=new Array(a/3);for(var i=0;i<a;i+=3){var r=e[i],u=e[i+1],o=e[i+2],d=i/3;n[d]=O.fromDegrees(r,u,o,t,n[d])}return n},O.fromRadiansArrayHeights=function(e,t,n){var a=e.length;S.defined(n)?n.length=a/3:n=new Array(a/3);for(var i=0;i<a;i+=3){var r=e[i],u=e[i+1],o=e[i+2],d=i/3;n[d]=O.fromRadians(r,u,o,t,n[d])}return n},O.ZERO=Object.freeze(new O(0,0,0)),O.UNIT_X=Object.freeze(new O(1,0,0)),O.UNIT_Y=Object.freeze(new O(0,1,0)),O.UNIT_Z=Object.freeze(new O(0,0,1)),O.prototype.clone=function(e){return O.clone(this,e)},O.prototype.equals=function(e){return O.equals(this,e)},O.prototype.equalsEpsilon=function(e,t,n){return O.equalsEpsilon(this,e,t,n)},O.prototype.toString=function(){return"("+this.x+", "+this.y+", "+this.z+")"};var T=new O,A=new O;function l(e,t,n,a,i){var r=e.x,u=e.y,o=e.z,d=t.x,s=t.y,t=t.z,h=r*r*d*d,l=u*u*s*s,f=o*o*t*t,d=h+l+f,s=Math.sqrt(1/d),t=O.multiplyByScalar(e,s,T);if(d<a)return isFinite(s)?O.clone(t,i):void 0;var c=n.x,m=n.y,y=n.z,n=A;n.x=t.x*c*2,n.y=t.y*m*2,n.z=t.z*y*2;var p,g,M,x,w,v,_,C=(1-s)*O.magnitude(e)/(.5*O.magnitude(n)),z=0;do{z=(p=h*(w=(g=1/(1+(C-=z)*c))*g)+l*(v=(M=1/(1+C*m))*M)+f*(_=(x=1/(1+C*y))*x)-1)/(-2*(h*(w*g)*c+l*(v*M)*m+f*(_*x)*y))}while(Math.abs(p)>q.CesiumMath.EPSILON12);return S.defined(i)?(i.x=r*g,i.y=u*M,i.z=o*x,i):new O(r*g,u*M,o*x)}function f(e,t,n){this.longitude=S.defaultValue(e,0),this.latitude=S.defaultValue(t,0),this.height=S.defaultValue(n,0)}f.fromRadians=function(e,t,n,a){return n=S.defaultValue(n,0),S.defined(a)?(a.longitude=e,a.latitude=t,a.height=n,a):new f(e,t,n)},f.fromDegrees=function(e,t,n,a){return e=q.CesiumMath.toRadians(e),t=q.CesiumMath.toRadians(t),f.fromRadians(e,t,n,a)};var c=new O,m=new O,y=new O,p=new O(1/6378137,1/6378137,1/6356752.314245179),g=new O(1/40680631590769,1/40680631590769,1/40408299984661.445),M=q.CesiumMath.EPSILON1;function x(e,t,n,a){t=S.defaultValue(t,0),n=S.defaultValue(n,0),a=S.defaultValue(a,0),e._radii=new O(t,n,a),e._radiiSquared=new O(t*t,n*n,a*a),e._radiiToTheFourth=new O(t*t*t*t,n*n*n*n,a*a*a*a),e._oneOverRadii=new O(0===t?0:1/t,0===n?0:1/n,0===a?0:1/a),e._oneOverRadiiSquared=new O(0===t?0:1/(t*t),0===n?0:1/(n*n),0===a?0:1/(a*a)),e._minimumRadius=Math.min(t,n,a),e._maximumRadius=Math.max(t,n,a),e._centerToleranceSquared=q.CesiumMath.EPSILON1,0!==e._radiiSquared.z&&(e._squaredXOverSquaredZ=e._radiiSquared.x/e._radiiSquared.z)}function w(e,t,n){this._radii=void 0,this._radiiSquared=void 0,this._radiiToTheFourth=void 0,this._oneOverRadii=void 0,this._oneOverRadiiSquared=void 0,this._minimumRadius=void 0,this._maximumRadius=void 0,this._centerToleranceSquared=void 0,this._squaredXOverSquaredZ=void 0,x(this,e,t,n)}f.fromCartesian=function(e,t,n){var a=S.defined(t)?t.oneOverRadii:p,i=S.defined(t)?t.oneOverRadiiSquared:g,a=l(e,a,i,S.defined(t)?t._centerToleranceSquared:M,m);if(S.defined(a)){t=O.multiplyComponents(a,i,c),t=O.normalize(t,t),i=O.subtract(e,a,y),a=Math.atan2(t.y,t.x),t=Math.asin(t.z),i=q.CesiumMath.sign(O.dot(i,e))*O.magnitude(i);return S.defined(n)?(n.longitude=a,n.latitude=t,n.height=i,n):new f(a,t,i)}},f.toCartesian=function(e,t,n){return O.fromRadians(e.longitude,e.latitude,e.height,t,n)},f.clone=function(e,t){if(S.defined(e))return S.defined(t)?(t.longitude=e.longitude,t.latitude=e.latitude,t.height=e.height,t):new f(e.longitude,e.latitude,e.height)},f.equals=function(e,t){return e===t||S.defined(e)&&S.defined(t)&&e.longitude===t.longitude&&e.latitude===t.latitude&&e.height===t.height},f.equalsEpsilon=function(e,t,n){return n=S.defaultValue(n,0),e===t||S.defined(e)&&S.defined(t)&&Math.abs(e.longitude-t.longitude)<=n&&Math.abs(e.latitude-t.latitude)<=n&&Math.abs(e.height-t.height)<=n},f.ZERO=Object.freeze(new f(0,0,0)),f.prototype.clone=function(e){return f.clone(this,e)},f.prototype.equals=function(e){return f.equals(this,e)},f.prototype.equalsEpsilon=function(e,t){return f.equalsEpsilon(this,e,t)},f.prototype.toString=function(){return"("+this.longitude+", "+this.latitude+", "+this.height+")"},Object.defineProperties(w.prototype,{radii:{get:function(){return this._radii}},radiiSquared:{get:function(){return this._radiiSquared}},radiiToTheFourth:{get:function(){return this._radiiToTheFourth}},oneOverRadii:{get:function(){return this._oneOverRadii}},oneOverRadiiSquared:{get:function(){return this._oneOverRadiiSquared}},minimumRadius:{get:function(){return this._minimumRadius}},maximumRadius:{get:function(){return this._maximumRadius}}}),w.clone=function(e,t){if(S.defined(e)){var n=e._radii;return S.defined(t)?(O.clone(n,t._radii),O.clone(e._radiiSquared,t._radiiSquared),O.clone(e._radiiToTheFourth,t._radiiToTheFourth),O.clone(e._oneOverRadii,t._oneOverRadii),O.clone(e._oneOverRadiiSquared,t._oneOverRadiiSquared),t._minimumRadius=e._minimumRadius,t._maximumRadius=e._maximumRadius,t._centerToleranceSquared=e._centerToleranceSquared,t):new w(n.x,n.y,n.z)}},w.fromCartesian3=function(e,t){return S.defined(t)||(t=new w),S.defined(e)&&x(t,e.x,e.y,e.z),t},w.WGS84=Object.freeze(new w(6378137,6378137,6356752.314245179)),w.UNIT_SPHERE=Object.freeze(new w(1,1,1)),w.MOON=Object.freeze(new w(q.CesiumMath.LUNAR_RADIUS,q.CesiumMath.LUNAR_RADIUS,q.CesiumMath.LUNAR_RADIUS)),w.prototype.clone=function(e){return w.clone(this,e)},w.packedLength=O.packedLength,w.pack=function(e,t,n){return n=S.defaultValue(n,0),O.pack(e._radii,t,n),t},w.unpack=function(e,t,n){t=S.defaultValue(t,0);t=O.unpack(e,t);return w.fromCartesian3(t,n)},w.prototype.geocentricSurfaceNormal=O.normalize,w.prototype.geodeticSurfaceNormalCartographic=function(e,t){var n=e.longitude,a=e.latitude,i=Math.cos(a),e=i*Math.cos(n),n=i*Math.sin(n),a=Math.sin(a);return S.defined(t)||(t=new O),t.x=e,t.y=n,t.z=a,O.normalize(t,t)},w.prototype.geodeticSurfaceNormal=function(e,t){if(!O.equalsEpsilon(e,O.ZERO,q.CesiumMath.EPSILON14))return S.defined(t)||(t=new O),t=O.multiplyComponents(e,this._oneOverRadiiSquared,t),O.normalize(t,t)};var v=new O,_=new O;w.prototype.cartographicToCartesian=function(e,t){var n=v,a=_;this.geodeticSurfaceNormalCartographic(e,n),O.multiplyComponents(this._radiiSquared,n,a);var i=Math.sqrt(O.dot(n,a));return O.divideByScalar(a,i,a),O.multiplyByScalar(n,e.height,n),S.defined(t)||(t=new O),O.add(a,n,t)},w.prototype.cartographicArrayToCartesianArray=function(e,t){var n=e.length;S.defined(t)?t.length=n:t=new Array(n);for(var a=0;a<n;a++)t[a]=this.cartographicToCartesian(e[a],t[a]);return t};var C=new O,z=new O,R=new O;w.prototype.cartesianToCartographic=function(e,t){var n=this.scaleToGeodeticSurface(e,z);if(S.defined(n)){var a=this.geodeticSurfaceNormal(n,C),i=O.subtract(e,n,R),n=Math.atan2(a.y,a.x),a=Math.asin(a.z),i=q.CesiumMath.sign(O.dot(i,e))*O.magnitude(i);return S.defined(t)?(t.longitude=n,t.latitude=a,t.height=i,t):new f(n,a,i)}},w.prototype.cartesianArrayToCartographicArray=function(e,t){var n=e.length;S.defined(t)?t.length=n:t=new Array(n);for(var a=0;a<n;++a)t[a]=this.cartesianToCartographic(e[a],t[a]);return t},w.prototype.scaleToGeodeticSurface=function(e,t){return l(e,this._oneOverRadii,this._oneOverRadiiSquared,this._centerToleranceSquared,t)},w.prototype.scaleToGeocentricSurface=function(e,t){S.defined(t)||(t=new O);var n=e.x,a=e.y,i=e.z,r=this._oneOverRadiiSquared,r=1/Math.sqrt(n*n*r.x+a*a*r.y+i*i*r.z);return O.multiplyByScalar(e,r,t)},w.prototype.transformPositionToScaledSpace=function(e,t){return S.defined(t)||(t=new O),O.multiplyComponents(e,this._oneOverRadii,t)},w.prototype.transformPositionFromScaledSpace=function(e,t){return S.defined(t)||(t=new O),O.multiplyComponents(e,this._radii,t)},w.prototype.equals=function(e){return this===e||S.defined(e)&&O.equals(this._radii,e._radii)},w.prototype.toString=function(){return this._radii.toString()},w.prototype.getSurfaceNormalIntersectionWithZAxis=function(e,t,n){t=S.defaultValue(t,0);var a=this._squaredXOverSquaredZ;if(S.defined(n)||(n=new O),n.x=0,n.y=0,n.z=e.z*(1-a),!(Math.abs(n.z)>=this._radii.z-t))return n};var V=[.14887433898163,.43339539412925,.67940956829902,.86506336668898,.97390652851717,0],I=[.29552422471475,.26926671930999,.21908636251598,.14945134915058,.066671344308684,0];function b(e,t,n){for(var a=.5*(t+e),i=.5*(t-e),r=0,u=0;u<5;u++){var o=i*V[u];r+=I[u]*(n(a+o)+n(a-o))}return r*=i}function E(e,t,n,a){this.west=S.defaultValue(e,0),this.south=S.defaultValue(t,0),this.east=S.defaultValue(n,0),this.north=S.defaultValue(a,0)}w.prototype.surfaceArea=function(e){for(var t=e.west,i=e.east,n=e.south,a=e.north;i<t;)i+=q.CesiumMath.TWO_PI;var e=this._radiiSquared,r=e.x,u=e.y,o=e.z,d=r*u;return b(n,a,function(e){var n=Math.cos(e),a=Math.sin(e);return Math.cos(e)*b(t,i,function(e){var t=Math.cos(e),e=Math.sin(e);return Math.sqrt(d*a*a+o*(u*t*t+r*e*e)*n*n)})})},Object.defineProperties(E.prototype,{width:{get:function(){return E.computeWidth(this)}},height:{get:function(){return E.computeHeight(this)}}}),E.packedLength=4,E.pack=function(e,t,n){return n=S.defaultValue(n,0),t[n++]=e.west,t[n++]=e.south,t[n++]=e.east,t[n]=e.north,t},E.unpack=function(e,t,n){return t=S.defaultValue(t,0),S.defined(n)||(n=new E),n.west=e[t++],n.south=e[t++],n.east=e[t++],n.north=e[t],n},E.computeWidth=function(e){var t=e.east,e=e.west;return t<e&&(t+=q.CesiumMath.TWO_PI),t-e},E.computeHeight=function(e){return e.north-e.south},E.fromDegrees=function(e,t,n,a,i){return e=q.CesiumMath.toRadians(S.defaultValue(e,0)),t=q.CesiumMath.toRadians(S.defaultValue(t,0)),n=q.CesiumMath.toRadians(S.defaultValue(n,0)),a=q.CesiumMath.toRadians(S.defaultValue(a,0)),S.defined(i)?(i.west=e,i.south=t,i.east=n,i.north=a,i):new E(e,t,n,a)},E.fromRadians=function(e,t,n,a,i){return S.defined(i)?(i.west=S.defaultValue(e,0),i.south=S.defaultValue(t,0),i.east=S.defaultValue(n,0),i.north=S.defaultValue(a,0),i):new E(e,t,n,a)},E.fromCartographicArray=function(e,t){for(var n=Number.MAX_VALUE,a=-Number.MAX_VALUE,i=Number.MAX_VALUE,r=-Number.MAX_VALUE,u=Number.MAX_VALUE,o=-Number.MAX_VALUE,d=0,s=e.length;d<s;d++)var h=e[d],n=Math.min(n,h.longitude),a=Math.max(a,h.longitude),u=Math.min(u,h.latitude),o=Math.max(o,h.latitude),h=0<=h.longitude?h.longitude:h.longitude+q.CesiumMath.TWO_PI,i=Math.min(i,h),r=Math.max(r,h);return r-i<a-n&&(n=i,(a=r)>q.CesiumMath.PI&&(a-=q.CesiumMath.TWO_PI),n>q.CesiumMath.PI&&(n-=q.CesiumMath.TWO_PI)),S.defined(t)?(t.west=n,t.south=u,t.east=a,t.north=o,t):new E(n,u,a,o)},E.fromCartesianArray=function(e,t,n){t=S.defaultValue(t,w.WGS84);for(var a=Number.MAX_VALUE,i=-Number.MAX_VALUE,r=Number.MAX_VALUE,u=-Number.MAX_VALUE,o=Number.MAX_VALUE,d=-Number.MAX_VALUE,s=0,h=e.length;s<h;s++)var l=t.cartesianToCartographic(e[s]),a=Math.min(a,l.longitude),i=Math.max(i,l.longitude),o=Math.min(o,l.latitude),d=Math.max(d,l.latitude),l=0<=l.longitude?l.longitude:l.longitude+q.CesiumMath.TWO_PI,r=Math.min(r,l),u=Math.max(u,l);return u-r<i-a&&(a=r,(i=u)>q.CesiumMath.PI&&(i-=q.CesiumMath.TWO_PI),a>q.CesiumMath.PI&&(a-=q.CesiumMath.TWO_PI)),S.defined(n)?(n.west=a,n.south=o,n.east=i,n.north=d,n):new E(a,o,i,d)},E.clone=function(e,t){if(S.defined(e))return S.defined(t)?(t.west=e.west,t.south=e.south,t.east=e.east,t.north=e.north,t):new E(e.west,e.south,e.east,e.north)},E.equalsEpsilon=function(e,t,n){return n=S.defaultValue(n,0),e===t||S.defined(e)&&S.defined(t)&&Math.abs(e.west-t.west)<=n&&Math.abs(e.south-t.south)<=n&&Math.abs(e.east-t.east)<=n&&Math.abs(e.north-t.north)<=n},E.prototype.clone=function(e){return E.clone(this,e)},E.prototype.equals=function(e){return E.equals(this,e)},E.equals=function(e,t){return e===t||S.defined(e)&&S.defined(t)&&e.west===t.west&&e.south===t.south&&e.east===t.east&&e.north===t.north},E.prototype.equalsEpsilon=function(e,t){return E.equalsEpsilon(this,e,t)},E.validate=function(e){},E.southwest=function(e,t){return S.defined(t)?(t.longitude=e.west,t.latitude=e.south,t.height=0,t):new f(e.west,e.south)},E.northwest=function(e,t){return S.defined(t)?(t.longitude=e.west,t.latitude=e.north,t.height=0,t):new f(e.west,e.north)},E.northeast=function(e,t){return S.defined(t)?(t.longitude=e.east,t.latitude=e.north,t.height=0,t):new f(e.east,e.north)},E.southeast=function(e,t){return S.defined(t)?(t.longitude=e.east,t.latitude=e.south,t.height=0,t):new f(e.east,e.south)},E.center=function(e,t){var n=e.east,a=e.west;n<a&&(n+=q.CesiumMath.TWO_PI);n=q.CesiumMath.negativePiToPi(.5*(a+n)),e=.5*(e.south+e.north);return S.defined(t)?(t.longitude=n,t.latitude=e,t.height=0,t):new f(n,e)},E.intersection=function(e,t,n){var a=e.east,i=e.west,r=t.east,u=t.west;a<i&&0<r?a+=q.CesiumMath.TWO_PI:r<u&&0<a&&(r+=q.CesiumMath.TWO_PI),a<i&&u<0?u+=q.CesiumMath.TWO_PI:r<u&&i<0&&(i+=q.CesiumMath.TWO_PI);u=q.CesiumMath.negativePiToPi(Math.max(i,u)),a=q.CesiumMath.negativePiToPi(Math.min(a,r));if(!((e.west<e.east||t.west<t.east)&&a<=u)){r=Math.max(e.south,t.south),t=Math.min(e.north,t.north);if(!(t<=r))return S.defined(n)?(n.west=u,n.south=r,n.east=a,n.north=t,n):new E(u,r,a,t)}},E.simpleIntersection=function(e,t,n){var a=Math.max(e.west,t.west),i=Math.max(e.south,t.south),r=Math.min(e.east,t.east),t=Math.min(e.north,t.north);if(!(t<=i||r<=a))return S.defined(n)?(n.west=a,n.south=i,n.east=r,n.north=t,n):new E(a,i,r,t)},E.union=function(e,t,n){S.defined(n)||(n=new E);var a=e.east,i=e.west,r=t.east,u=t.west;a<i&&0<r?a+=q.CesiumMath.TWO_PI:r<u&&0<a&&(r+=q.CesiumMath.TWO_PI),a<i&&u<0?u+=q.CesiumMath.TWO_PI:r<u&&i<0&&(i+=q.CesiumMath.TWO_PI);u=q.CesiumMath.convertLongitudeRange(Math.min(i,u)),r=q.CesiumMath.convertLongitudeRange(Math.max(a,r));return n.west=u,n.south=Math.min(e.south,t.south),n.east=r,n.north=Math.max(e.north,t.north),n},E.expand=function(e,t,n){return S.defined(n)||(n=new E),n.west=Math.min(e.west,t.longitude),n.south=Math.min(e.south,t.latitude),n.east=Math.max(e.east,t.longitude),n.north=Math.max(e.north,t.latitude),n},E.contains=function(e,t){var n=t.longitude,a=t.latitude,i=e.west,t=e.east;return t<i&&(t+=q.CesiumMath.TWO_PI,n<0&&(n+=q.CesiumMath.TWO_PI)),(i<n||q.CesiumMath.equalsEpsilon(n,i,q.CesiumMath.EPSILON14))&&(n<t||q.CesiumMath.equalsEpsilon(n,t,q.CesiumMath.EPSILON14))&&a>=e.south&&a<=e.north};var P=new f;function N(e,t){this.x=S.defaultValue(e,0),this.y=S.defaultValue(t,0)}E.subsample=function(e,t,n,a){t=S.defaultValue(t,w.WGS84),n=S.defaultValue(n,0),S.defined(a)||(a=[]);var i=0,r=e.north,u=e.south,o=e.east,d=e.west,s=P;s.height=n,s.longitude=d,s.latitude=r,a[i]=t.cartographicToCartesian(s,a[i]),i++,s.longitude=o,a[i]=t.cartographicToCartesian(s,a[i]),i++,s.latitude=u,a[i]=t.cartographicToCartesian(s,a[i]),i++,s.longitude=d,a[i]=t.cartographicToCartesian(s,a[i]),i++,s.latitude=r<0?r:0<u?u:0;for(var h=1;h<8;++h)s.longitude=-Math.PI+h*q.CesiumMath.PI_OVER_TWO,E.contains(e,s)&&(a[i]=t.cartographicToCartesian(s,a[i]),i++);return 0===s.latitude&&(s.longitude=d,a[i]=t.cartographicToCartesian(s,a[i]),i++,s.longitude=o,a[i]=t.cartographicToCartesian(s,a[i]),i++),a.length=i,a},E.MAX_VALUE=Object.freeze(new E(-Math.PI,-q.CesiumMath.PI_OVER_TWO,Math.PI,q.CesiumMath.PI_OVER_TWO)),N.fromElements=function(e,t,n){return S.defined(n)?(n.x=e,n.y=t,n):new N(e,t)},N.fromCartesian3=N.clone=function(e,t){if(S.defined(e))return S.defined(t)?(t.x=e.x,t.y=e.y,t):new N(e.x,e.y)},N.fromCartesian4=N.clone,N.packedLength=2,N.pack=function(e,t,n){return n=S.defaultValue(n,0),t[n++]=e.x,t[n]=e.y,t},N.unpack=function(e,t,n){return t=S.defaultValue(t,0),S.defined(n)||(n=new N),n.x=e[t++],n.y=e[t],n},N.packArray=function(e,t){var n=e.length,a=2*n;if(S.defined(t)){if(!Array.isArray(t)&&t.length!==a)throw new r.DeveloperError("If result is a typed array, it must have exactly array.length * 2 elements");t.length!==a&&(t.length=a)}else t=new Array(a);for(var i=0;i<n;++i)N.pack(e[i],t,2*i);return t},N.unpackArray=function(e,t){var n=e.length;S.defined(t)?t.length=n/2:t=new Array(n/2);for(var a=0;a<n;a+=2){var i=a/2;t[i]=N.unpack(e,a,t[i])}return t},N.fromArray=N.unpack,N.maximumComponent=function(e){return Math.max(e.x,e.y)},N.minimumComponent=function(e){return Math.min(e.x,e.y)},N.minimumByComponent=function(e,t,n){return n.x=Math.min(e.x,t.x),n.y=Math.min(e.y,t.y),n},N.maximumByComponent=function(e,t,n){return n.x=Math.max(e.x,t.x),n.y=Math.max(e.y,t.y),n},N.magnitudeSquared=function(e){return e.x*e.x+e.y*e.y},N.magnitude=function(e){return Math.sqrt(N.magnitudeSquared(e))};var U=new N;N.distance=function(e,t){return N.subtract(e,t,U),N.magnitude(U)},N.distanceSquared=function(e,t){return N.subtract(e,t,U),N.magnitudeSquared(U)},N.normalize=function(e,t){var n=N.magnitude(e);return t.x=e.x/n,t.y=e.y/n,t},N.dot=function(e,t){return e.x*t.x+e.y*t.y},N.multiplyComponents=function(e,t,n){return n.x=e.x*t.x,n.y=e.y*t.y,n},N.divideComponents=function(e,t,n){return n.x=e.x/t.x,n.y=e.y/t.y,n},N.add=function(e,t,n){return n.x=e.x+t.x,n.y=e.y+t.y,n},N.subtract=function(e,t,n){return n.x=e.x-t.x,n.y=e.y-t.y,n},N.multiplyByScalar=function(e,t,n){return n.x=e.x*t,n.y=e.y*t,n},N.divideByScalar=function(e,t,n){return n.x=e.x/t,n.y=e.y/t,n},N.negate=function(e,t){return t.x=-e.x,t.y=-e.y,t},N.abs=function(e,t){return t.x=Math.abs(e.x),t.y=Math.abs(e.y),t};var L=new N;N.lerp=function(e,t,n,a){return N.multiplyByScalar(t,n,L),a=N.multiplyByScalar(e,1-n,a),N.add(L,a,a)};var W=new N,k=new N;N.angleBetween=function(e,t){return N.normalize(e,W),N.normalize(t,k),q.CesiumMath.acosClamped(N.dot(W,k))};var B=new N;N.mostOrthogonalAxis=function(e,t){e=N.normalize(e,B);return N.abs(e,e),t=e.x<=e.y?N.clone(N.UNIT_X,t):N.clone(N.UNIT_Y,t)},N.equals=function(e,t){return e===t||S.defined(e)&&S.defined(t)&&e.x===t.x&&e.y===t.y},N.equalsArray=function(e,t,n){return e.x===t[n]&&e.y===t[n+1]},N.equalsEpsilon=function(e,t,n,a){return e===t||S.defined(e)&&S.defined(t)&&q.CesiumMath.equalsEpsilon(e.x,t.x,n,a)&&q.CesiumMath.equalsEpsilon(e.y,t.y,n,a)},N.ZERO=Object.freeze(new N(0,0)),N.UNIT_X=Object.freeze(new N(1,0)),N.UNIT_Y=Object.freeze(new N(0,1)),N.prototype.clone=function(e){return N.clone(this,e)},N.prototype.equals=function(e){return N.equals(this,e)},N.prototype.equalsEpsilon=function(e,t,n){return N.equalsEpsilon(this,e,t,n)},N.prototype.toString=function(){return"("+this.x+", "+this.y+")"},e.Cartesian2=N,e.Cartesian3=O,e.Cartographic=f,e.Ellipsoid=w,e.Rectangle=E});
