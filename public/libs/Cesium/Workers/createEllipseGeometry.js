define(["./Cartesian2-c2e87f25","./when-a8daa614","./EllipseGeometry-e989c74e","./Check-3a7033c5","./Math-9c4212b4","./GeometryOffsetAttribute-a68ce97c","./Transforms-d7f8120c","./RuntimeError-3ea13d12","./ComponentDatatype-11643cbc","./WebGLConstants-18e33079","./EllipseGeometryLibrary-4a7f6bbb","./GeometryAttribute-c85c47e3","./GeometryAttributes-1356486e","./GeometryInstance-656b99a6","./GeometryPipeline-6828c62b","./AttributeCompression-9d280301","./EncodedCartesian3-a26ebc30","./IndexDatatype-6ac58125","./IntersectionTests-12c4c5cb","./Plane-44fc4194","./VertexFormat-26951076"],(function(e,t,r,n,c,a,i,o,s,l,b,m,d,p,y,f,u,G,C,E,A){"use strict";return function(n,c){return(n=t.defined(c)?r.EllipseGeometry.unpack(n,c):n)._center=e.Cartesian3.clone(n._center),n._ellipsoid=e.Ellipsoid.clone(n._ellipsoid),r.EllipseGeometry.createGeometry(n)}}));