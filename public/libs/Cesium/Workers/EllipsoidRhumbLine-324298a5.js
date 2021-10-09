define(["exports","./Cartesian2-baaaa1b2","./Check-3a7033c5","./when-a8daa614","./Math-2bc59f31"],(function(t,i,a,e,n){"use strict";function s(t,i,a){if(0===t)return i*a;var e=t*t,n=e*e,s=n*e,h=s*e,u=h*e;return i*((1-e/4-3*n/64-5*s/256-175*h/16384-441*u/65536-4851*(t=u*e)/1048576)*(a=a)-(3*e/8+3*n/32+45*s/1024+105*h/4096+2205*u/131072+6237*t/524288)*Math.sin(2*a)+(15*n/256+45*s/1024+525*h/16384+1575*u/65536+155925*t/8388608)*Math.sin(4*a)-(35*s/3072+175*h/12288+3675*u/262144+13475*t/1048576)*Math.sin(6*a)+(315*h/131072+2205*u/524288+43659*t/8388608)*Math.sin(8*a)-(693*u/1310720+6237*t/5242880)*Math.sin(10*a)+1001*t/8388608*Math.sin(12*a))}function h(t,i){if(0===t)return Math.log(Math.tan(.5*(n.CesiumMath.PI_OVER_TWO+i)));var a=t*Math.sin(i);return Math.log(Math.tan(.5*(n.CesiumMath.PI_OVER_TWO+i)))-t/2*Math.log((1+a)/(1-a))}var u=new i.Cartesian3,o=new i.Cartesian3;function r(t,a,e,r){i.Cartesian3.normalize(r.cartographicToCartesian(a,o),u),i.Cartesian3.normalize(r.cartographicToCartesian(e,o),o);var l,d,M=r.maximumRadius,c=r.minimumRadius,g=M*M;t._ellipticitySquared=(g-c*c)/g,t._ellipticity=Math.sqrt(t._ellipticitySquared),t._start=i.Cartographic.clone(a,t._start),t._start.height=0,t._end=i.Cartographic.clone(e,t._end),t._end.height=0,t._heading=(l=t,d=a.longitude,M=a.latitude,c=e.longitude,g=e.latitude,M=h(l._ellipticity,M),g=h(l._ellipticity,g),Math.atan2(n.CesiumMath.negativePiToPi(c-d),g-M)),t._distance=(c=t,d=r.maximumRadius,g=r.minimumRadius,M=a.longitude,t=a.latitude,r=e.longitude,a=e.latitude,e=c._heading,r-=M,M=0,M=n.CesiumMath.equalsEpsilon(Math.abs(e),n.CesiumMath.PI_OVER_TWO,n.CesiumMath.EPSILON8)?d===g?d*Math.cos(t)*n.CesiumMath.negativePiToPi(r):(g=Math.sin(t),d*Math.cos(t)*n.CesiumMath.negativePiToPi(r)/Math.sqrt(1-c._ellipticitySquared*g*g)):(t=s(c._ellipticity,d,t),(s(c._ellipticity,d,a)-t)/Math.cos(e)),Math.abs(M))}function l(t,a,u,o,r,l){if(0===u)return i.Cartographic.clone(t,l);var d,M,c,g=r*r;return c=Math.abs(n.CesiumMath.PI_OVER_TWO-Math.abs(a))>n.CesiumMath.EPSILON8?(d=function(t,i,a){var e=t/a;if(0===i)return e;var n=e*e,s=n*e,h=s*e,u=i*i,o=u*u,r=o*u,l=r*u,d=l*u,M=d*u,c=Math.sin(2*e),g=Math.cos(2*e),m=Math.sin(4*e),_=Math.cos(4*e),p=Math.sin(6*e),C=Math.cos(6*e);t=Math.sin(8*e),a=Math.cos(8*e),i=Math.sin(10*e);return e+e*u/4+7*e*o/64+15*e*r/256+579*e*l/16384+1515*e*d/65536+16837*e*M/1048576+(3*e*o/16+45*e*r/256-e*(32*n-561)*l/4096-e*(232*n-1677)*d/16384+e*(399985-90560*n+512*h)*M/5242880)*g+(21*e*r/256+483*e*l/4096-e*(224*n-1969)*d/16384-e*(33152*n-112599)*M/1048576)*_+(151*e*l/4096+4681*e*d/65536+1479*e*M/16384-453*s*M/32768)*C+(1097*e*d/65536+42783*e*M/1048576)*a+8011*e*M/1048576*Math.cos(10*e)+(3*u/8+3*o/16+213*r/2048-3*n*r/64+255*l/4096-33*n*l/512+20861*d/524288-33*n*d/512+h*d/1024+28273*M/1048576-471*n*M/8192+9*h*M/4096)*c+(21*o/256+21*r/256+533*l/8192-21*n*l/512+197*d/4096-315*n*d/4096+584039*M/16777216-12517*n*M/131072+7*h*M/2048)*m+(151*r/6144+151*l/4096+5019*d/131072-453*n*d/16384+26965*M/786432-8607*n*M/131072)*p+(1097*l/131072+1097*d/65536+225797*M/10485760-1097*n*M/65536)*t+(8011*d/2621440+8011*M/1048576)*i+293393*M/251658240*Math.sin(12*e)}(s(r,o,t.latitude)+u*Math.cos(a),r,o),c=h(r,t.latitude),M=h(r,d),c=Math.tan(a)*(M-c),n.CesiumMath.negativePiToPi(t.longitude+c)):(d=t.latitude,c=u/(0===r?o*Math.cos(t.latitude):(r=Math.sin(t.latitude),o*Math.cos(t.latitude)/Math.sqrt(1-g*r*r))),0<a?n.CesiumMath.negativePiToPi(t.longitude+c):n.CesiumMath.negativePiToPi(t.longitude-c)),e.defined(l)?(l.longitude=c,l.latitude=d,l.height=0,l):new i.Cartographic(c,d,0)}function d(t,a,n){n=e.defaultValue(n,i.Ellipsoid.WGS84),this._ellipsoid=n,this._start=new i.Cartographic,this._end=new i.Cartographic,this._heading=void 0,this._distance=void 0,this._ellipticity=void 0,this._ellipticitySquared=void 0,e.defined(t)&&e.defined(a)&&r(this,t,a,n)}Object.defineProperties(d.prototype,{ellipsoid:{get:function(){return this._ellipsoid}},surfaceDistance:{get:function(){return this._distance}},start:{get:function(){return this._start}},end:{get:function(){return this._end}},heading:{get:function(){return this._heading}}}),d.fromStartHeadingDistance=function(t,a,s,h,u){var o=e.defaultValue(h,i.Ellipsoid.WGS84),r=o.maximumRadius,M=o.minimumRadius;r*=r,r=Math.sqrt((r-M*M)/r),r=l(t,a=n.CesiumMath.negativePiToPi(a),s,o.maximumRadius,r);return!e.defined(u)||e.defined(h)&&!h.equals(u.ellipsoid)?new d(t,r,o):(u.setEndPoints(t,r),u)},d.prototype.setEndPoints=function(t,i){r(this,t,i,this._ellipsoid)},d.prototype.interpolateUsingFraction=function(t,i){return this.interpolateUsingSurfaceDistance(t*this._distance,i)},d.prototype.interpolateUsingSurfaceDistance=function(t,i){return l(this._start,this._heading,t,this._ellipsoid.maximumRadius,this._ellipticity,i)},d.prototype.findIntersectionWithLongitude=function(t,a){var s=this._ellipticity,h=this._heading,u=Math.abs(h),o=this._start;if(t=n.CesiumMath.negativePiToPi(t),n.CesiumMath.equalsEpsilon(Math.abs(t),Math.PI,n.CesiumMath.EPSILON14)&&(t=n.CesiumMath.sign(o.longitude)*Math.PI),e.defined(a)||(a=new i.Cartographic),Math.abs(n.CesiumMath.PI_OVER_TWO-u)<=n.CesiumMath.EPSILON8)return a.longitude=t,a.latitude=o.latitude,a.height=0,a;if(n.CesiumMath.equalsEpsilon(Math.abs(n.CesiumMath.PI_OVER_TWO-u),n.CesiumMath.PI_OVER_TWO,n.CesiumMath.EPSILON8))return n.CesiumMath.equalsEpsilon(t,o.longitude,n.CesiumMath.EPSILON12)?void 0:(a.longitude=t,a.latitude=n.CesiumMath.PI_OVER_TWO*n.CesiumMath.sign(n.CesiumMath.PI_OVER_TWO-h),a.height=0,a);var r=o.latitude,l=(u=s*Math.sin(r),Math.tan(.5*(n.CesiumMath.PI_OVER_TWO+r))*Math.exp((t-o.longitude)/Math.tan(h))),d=(1+u)/(1-u),M=o.latitude;do{var c=M,g=s*Math.sin(c);M=2*Math.atan(l*Math.pow((1+g)/(1-g)/d,s/2))-n.CesiumMath.PI_OVER_TWO}while(!n.CesiumMath.equalsEpsilon(M,c,n.CesiumMath.EPSILON12));return a.longitude=t,a.latitude=M,a.height=0,a},d.prototype.findIntersectionWithLatitude=function(t,a){var s=this._ellipticity,u=this._heading,o=this._start;if(!n.CesiumMath.equalsEpsilon(Math.abs(u),n.CesiumMath.PI_OVER_TWO,n.CesiumMath.EPSILON8)){var r=h(s,o.latitude);s=h(s,t),r=Math.tan(u)*(s-r),r=n.CesiumMath.negativePiToPi(o.longitude+r);return e.defined(a)?(a.longitude=r,a.latitude=t,a.height=0,a):new i.Cartographic(r,t,0)}},t.EllipsoidRhumbLine=d}));