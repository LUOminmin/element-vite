define(["./Cartesian2-c2e87f25","./when-a8daa614","./EllipseOutlineGeometry-3a69c907","./Check-3a7033c5","./Math-9c4212b4","./GeometryOffsetAttribute-a68ce97c","./Transforms-d7f8120c","./RuntimeError-3ea13d12","./ComponentDatatype-11643cbc","./WebGLConstants-18e33079","./EllipseGeometryLibrary-4a7f6bbb","./GeometryAttribute-c85c47e3","./GeometryAttributes-1356486e","./IndexDatatype-6ac58125"],(function(e,t,r,n,i,a,c,o,l,s,u,m,p,y){"use strict";return function(n,i){return(n=t.defined(i)?r.EllipseOutlineGeometry.unpack(n,i):n)._center=e.Cartesian3.clone(n._center),n._ellipsoid=e.Ellipsoid.clone(n._ellipsoid),r.EllipseOutlineGeometry.createGeometry(n)}}));