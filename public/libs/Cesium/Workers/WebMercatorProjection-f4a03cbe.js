define(["exports","./Cartesian2-f08aba2b","./when-505ff3ec","./Check-59cd0530","./Math-4f9d5df7"],(function(e,t,i,a,o){"use strict";function r(e){this._ellipsoid=i.defaultValue(e,t.Ellipsoid.WGS84),this._semimajorAxis=this._ellipsoid.maximumRadius,this._oneOverSemimajorAxis=1/this._semimajorAxis}Object.defineProperties(r.prototype,{ellipsoid:{get:function(){return this._ellipsoid}}}),r.mercatorAngleToGeodeticLatitude=function(e){return o.CesiumMath.PI_OVER_TWO-2*Math.atan(Math.exp(-e))},r.geodeticLatitudeToMercatorAngle=function(e){return r.MaximumLatitude<e?e=r.MaximumLatitude:e<-r.MaximumLatitude&&(e=-r.MaximumLatitude),e=Math.sin(e),.5*Math.log((1+e)/(1-e))},r.MaximumLatitude=r.mercatorAngleToGeodeticLatitude(Math.PI),r.prototype.project=function(e,a){var o=this._semimajorAxis,n=e.longitude*o;o=r.geodeticLatitudeToMercatorAngle(e.latitude)*o,e=e.height;return i.defined(a)?(a.x=n,a.y=o,a.z=e,a):new t.Cartesian3(n,o,e)},r.prototype.unproject=function(e,a){var o=this._oneOverSemimajorAxis,n=e.x*o;o=r.mercatorAngleToGeodeticLatitude(e.y*o),e=e.z;return i.defined(a)?(a.longitude=n,a.latitude=o,a.height=e,a):new t.Cartographic(n,o,e)},e.WebMercatorProjection=r}));