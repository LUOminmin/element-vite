define(["./when-a8daa614","./PrimitivePipeline-744fd7d4","./createTaskProcessorWorker","./Transforms-d7f8120c","./Cartesian2-c2e87f25","./Check-3a7033c5","./Math-9c4212b4","./RuntimeError-3ea13d12","./ComponentDatatype-11643cbc","./WebGLConstants-18e33079","./GeometryAttribute-c85c47e3","./GeometryAttributes-1356486e","./GeometryPipeline-6828c62b","./AttributeCompression-9d280301","./EncodedCartesian3-a26ebc30","./IndexDatatype-6ac58125","./IntersectionTests-12c4c5cb","./Plane-44fc4194","./WebMercatorProjection-3d566667"],(function(e,r,t,n,o,a,i,c,s,u,f,d,m,b,p,l,y,P,k){"use strict";var C={};return t((function(t,n){for(var o=t.subTasks,a=o.length,i=new Array(a),c=0;c<a;c++){var s=o[c],u=s.geometry,f=s.moduleName;e.defined(f)?(f=function(r){var t=C[r];return e.defined(t)||("object"==typeof exports?C[t]=t=require("Workers/"+r):require(["Workers/"+r],(function(e){C[t=e]=e}))),t}(f),i[c]=f(u,s.offset)):i[c]=u}return e.when.all(i,(function(e){return r.PrimitivePipeline.packCreateGeometryResults(e,n)}))}))}));