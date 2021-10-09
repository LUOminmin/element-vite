define(["./when-a8daa614","./Cartesian2-c2e87f25","./Check-3a7033c5","./EllipsoidGeometry-1416b9c0","./VertexFormat-26951076","./Math-9c4212b4","./GeometryOffsetAttribute-a68ce97c","./Transforms-d7f8120c","./RuntimeError-3ea13d12","./ComponentDatatype-11643cbc","./WebGLConstants-18e33079","./GeometryAttribute-c85c47e3","./GeometryAttributes-1356486e","./IndexDatatype-6ac58125"],(function(e,t,r,i,a,o,n,s,c,d,l,m,u,p){"use strict";function y(r){var a=e.defaultValue(r.radius,1);r={radii:new t.Cartesian3(a,a,a),stackPartitions:r.stackPartitions,slicePartitions:r.slicePartitions,vertexFormat:r.vertexFormat};this._ellipsoidGeometry=new i.EllipsoidGeometry(r),this._workerName="createSphereGeometry"}y.packedLength=i.EllipsoidGeometry.packedLength,y.pack=function(e,t,r){return i.EllipsoidGeometry.pack(e._ellipsoidGeometry,t,r)};var G=new i.EllipsoidGeometry,f={radius:void 0,radii:new t.Cartesian3,vertexFormat:new a.VertexFormat,stackPartitions:void 0,slicePartitions:void 0};return y.unpack=function(r,o,n){return o=i.EllipsoidGeometry.unpack(r,o,G),f.vertexFormat=a.VertexFormat.clone(o._vertexFormat,f.vertexFormat),f.stackPartitions=o._stackPartitions,f.slicePartitions=o._slicePartitions,e.defined(n)?(t.Cartesian3.clone(o._radii,f.radii),n._ellipsoidGeometry=new i.EllipsoidGeometry(f),n):(f.radius=o._radii.x,new y(f))},y.createGeometry=function(e){return i.EllipsoidGeometry.createGeometry(e._ellipsoidGeometry)},function(t,r){return e.defined(r)&&(t=y.unpack(t,r)),y.createGeometry(t)}}));