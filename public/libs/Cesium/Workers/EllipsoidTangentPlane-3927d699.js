define(["exports","./Cartesian2-c2e87f25","./Check-3a7033c5","./when-a8daa614","./Transforms-d7f8120c","./IntersectionTests-12c4c5cb","./Plane-44fc4194"],(function(e,n,t,i,a,r,s){"use strict";function o(e,t,a){this.minimum=n.Cartesian3.clone(i.defaultValue(e,n.Cartesian3.ZERO)),this.maximum=n.Cartesian3.clone(i.defaultValue(t,n.Cartesian3.ZERO)),a=i.defined(a)?n.Cartesian3.clone(a):n.Cartesian3.midpoint(this.minimum,this.maximum,new n.Cartesian3),this.center=a}o.fromPoints=function(e,t){if(i.defined(t)||(t=new o),!i.defined(e)||0===e.length)return t.minimum=n.Cartesian3.clone(n.Cartesian3.ZERO,t.minimum),t.maximum=n.Cartesian3.clone(n.Cartesian3.ZERO,t.maximum),t.center=n.Cartesian3.clone(n.Cartesian3.ZERO,t.center),t;for(var a=e[0].x,r=e[0].y,s=e[0].z,m=e[0].x,c=e[0].y,l=e[0].z,u=e.length,d=1;d<u;d++){var f=(C=e[d]).x,h=C.y,C=C.z;a=Math.min(f,a),m=Math.max(f,m),r=Math.min(h,r),c=Math.max(h,c),s=Math.min(C,s),l=Math.max(C,l)}var p=t.minimum;p.x=a,p.y=r,p.z=s;var x=t.maximum;return x.x=m,x.y=c,x.z=l,t.center=n.Cartesian3.midpoint(p,x,t.center),t},o.clone=function(e,t){if(i.defined(e))return i.defined(t)?(t.minimum=n.Cartesian3.clone(e.minimum,t.minimum),t.maximum=n.Cartesian3.clone(e.maximum,t.maximum),t.center=n.Cartesian3.clone(e.center,t.center),t):new o(e.minimum,e.maximum,e.center)},o.equals=function(e,t){return e===t||i.defined(e)&&i.defined(t)&&n.Cartesian3.equals(e.center,t.center)&&n.Cartesian3.equals(e.minimum,t.minimum)&&n.Cartesian3.equals(e.maximum,t.maximum)};var m=new n.Cartesian3;o.intersectPlane=function(e,t){m=n.Cartesian3.subtract(e.maximum,e.minimum,m);var i=n.Cartesian3.multiplyByScalar(m,.5,m),r=t.normal;i=i.x*Math.abs(r.x)+i.y*Math.abs(r.y)+i.z*Math.abs(r.z);return 0<(t=n.Cartesian3.dot(e.center,r)+t.distance)-i?a.Intersect.INSIDE:t+i<0?a.Intersect.OUTSIDE:a.Intersect.INTERSECTING},o.prototype.clone=function(e){return o.clone(this,e)},o.prototype.intersectPlane=function(e){return o.intersectPlane(this,e)},o.prototype.equals=function(e){return o.equals(this,e)};var c=new a.Cartesian4;function l(e,t){e=(t=i.defaultValue(t,n.Ellipsoid.WGS84)).scaleToGeodeticSurface(e);var r=a.Transforms.eastNorthUpToFixedFrame(e,t);this._ellipsoid=t,this._origin=e,this._xAxis=n.Cartesian3.fromCartesian4(a.Matrix4.getColumn(r,0,c)),this._yAxis=n.Cartesian3.fromCartesian4(a.Matrix4.getColumn(r,1,c)),r=n.Cartesian3.fromCartesian4(a.Matrix4.getColumn(r,2,c)),this._plane=s.Plane.fromPointNormal(e,r)}Object.defineProperties(l.prototype,{ellipsoid:{get:function(){return this._ellipsoid}},origin:{get:function(){return this._origin}},plane:{get:function(){return this._plane}},xAxis:{get:function(){return this._xAxis}},yAxis:{get:function(){return this._yAxis}},zAxis:{get:function(){return this._plane.normal}}});var u=new o;l.fromPoints=function(e,n){return new l(o.fromPoints(e,u).center,n)};var d=new r.Ray,f=new n.Cartesian3;l.prototype.projectPointOntoPlane=function(e,t){var a=d;if(a.origin=e,n.Cartesian3.normalize(e,a.direction),e=r.IntersectionTests.rayPlane(a,this._plane,f),i.defined(e)||(n.Cartesian3.negate(a.direction,a.direction),e=r.IntersectionTests.rayPlane(a,this._plane,f)),i.defined(e))return a=n.Cartesian3.subtract(e,this._origin,e),e=n.Cartesian3.dot(this._xAxis,a),a=n.Cartesian3.dot(this._yAxis,a),i.defined(t)?(t.x=e,t.y=a,t):new n.Cartesian2(e,a)},l.prototype.projectPointsOntoPlane=function(e,n){i.defined(n)||(n=[]);for(var t=0,a=e.length,r=0;r<a;r++){var s=this.projectPointOntoPlane(e[r],n[t]);i.defined(s)&&(n[t]=s,t++)}return n.length=t,n},l.prototype.projectPointToNearestOnPlane=function(e,t){i.defined(t)||(t=new n.Cartesian2);var a=d;return a.origin=e,n.Cartesian3.clone(this._plane.normal,a.direction),e=r.IntersectionTests.rayPlane(a,this._plane,f),i.defined(e)||(n.Cartesian3.negate(a.direction,a.direction),e=r.IntersectionTests.rayPlane(a,this._plane,f)),a=n.Cartesian3.subtract(e,this._origin,e),e=n.Cartesian3.dot(this._xAxis,a),a=n.Cartesian3.dot(this._yAxis,a),t.x=e,t.y=a,t},l.prototype.projectPointsToNearestOnPlane=function(e,n){i.defined(n)||(n=[]);var t=e.length;n.length=t;for(var a=0;a<t;a++)n[a]=this.projectPointToNearestOnPlane(e[a],n[a]);return n};var h=new n.Cartesian3;l.prototype.projectPointOntoEllipsoid=function(e,t){i.defined(t)||(t=new n.Cartesian3);var a=this._ellipsoid,r=this._origin,s=this._xAxis,o=this._yAxis,m=h;return n.Cartesian3.multiplyByScalar(s,e.x,m),t=n.Cartesian3.add(r,m,t),n.Cartesian3.multiplyByScalar(o,e.y,m),n.Cartesian3.add(t,m,t),a.scaleToGeocentricSurface(t,t),t},l.prototype.projectPointsOntoEllipsoid=function(e,n){var t=e.length;i.defined(n)?n.length=t:n=new Array(t);for(var a=0;a<t;++a)n[a]=this.projectPointOntoEllipsoid(e[a],n[a]);return n},e.AxisAlignedBoundingBox=o,e.EllipsoidTangentPlane=l}));