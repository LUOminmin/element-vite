define(["./when-a8daa614","./Cartesian2-c2e87f25","./arrayRemoveDuplicates-98e917ed","./BoundingRectangle-f3757a69","./Transforms-d7f8120c","./ComponentDatatype-11643cbc","./PolylineVolumeGeometryLibrary-fb34ed38","./Check-3a7033c5","./GeometryAttribute-c85c47e3","./GeometryAttributes-1356486e","./IndexDatatype-6ac58125","./Math-9c4212b4","./PolygonPipeline-caa2b3a7","./RuntimeError-3ea13d12","./WebGLConstants-18e33079","./EllipsoidTangentPlane-3927d699","./IntersectionTests-12c4c5cb","./Plane-44fc4194","./PolylinePipeline-f3c4dd31","./EllipsoidGeodesic-fc12f724","./EllipsoidRhumbLine-1b27589f"],(function(e,i,n,t,a,r,o,l,s,p,c,d,u,y,h,g,f,m,E,v,P){"use strict";function _(n){var t=(n=e.defaultValue(n,e.defaultValue.EMPTY_OBJECT)).polylinePositions,a=n.shapePositions;this._positions=t,this._shape=a,this._ellipsoid=i.Ellipsoid.clone(e.defaultValue(n.ellipsoid,i.Ellipsoid.WGS84)),this._cornerType=e.defaultValue(n.cornerType,o.CornerType.ROUNDED),this._granularity=e.defaultValue(n.granularity,d.CesiumMath.RADIANS_PER_DEGREE),this._workerName="createPolylineVolumeOutlineGeometry",t=1+t.length*i.Cartesian3.packedLength,t+=1+a.length*i.Cartesian2.packedLength,this.packedLength=t+i.Ellipsoid.packedLength+2}_.pack=function(n,t,a){var r;a=e.defaultValue(a,0);var o=n._positions,l=o.length;for(t[a++]=l,r=0;r<l;++r,a+=i.Cartesian3.packedLength)i.Cartesian3.pack(o[r],t,a);var s=n._shape;l=s.length;for(t[a++]=l,r=0;r<l;++r,a+=i.Cartesian2.packedLength)i.Cartesian2.pack(s[r],t,a);return i.Ellipsoid.pack(n._ellipsoid,t,a),a+=i.Ellipsoid.packedLength,t[a++]=n._cornerType,t[a]=n._granularity,t};var k=i.Ellipsoid.clone(i.Ellipsoid.UNIT_SPHERE),C={polylinePositions:void 0,shapePositions:void 0,ellipsoid:k,height:void 0,cornerType:void 0,granularity:void 0};_.unpack=function(n,t,a){t=e.defaultValue(t,0);for(var r=n[t++],o=new Array(r),l=0;l<r;++l,t+=i.Cartesian3.packedLength)o[l]=i.Cartesian3.unpack(n,t);r=n[t++];var s=new Array(r);for(l=0;l<r;++l,t+=i.Cartesian2.packedLength)s[l]=i.Cartesian2.unpack(n,t);var p=i.Ellipsoid.unpack(n,t,k);t+=i.Ellipsoid.packedLength;var c=n[t++],d=n[t];return e.defined(a)?(a._positions=o,a._shape=s,a._ellipsoid=i.Ellipsoid.clone(p,a._ellipsoid),a._cornerType=c,a._granularity=d,a):(C.polylinePositions=o,C.shapePositions=s,C.cornerType=c,C.granularity=d,new _(C))};var b=new t.BoundingRectangle;return _.createGeometry=function(e){var l=e._positions,d=n.arrayRemoveDuplicates(l,i.Cartesian3.equalsEpsilon),y=e._shape;y=o.PolylineVolumeGeometryLibrary.removeDuplicatesFromShape(y);if(!(d.length<2||y.length<3))return u.PolygonPipeline.computeWindingOrder2D(y)===u.WindingOrder.CLOCKWISE&&y.reverse(),l=t.BoundingRectangle.fromPoints(y,b),function(e,i){var n=new p.GeometryAttributes;n.position=new s.GeometryAttribute({componentDatatype:r.ComponentDatatype.DOUBLE,componentsPerAttribute:3,values:e});var t=i.length,o=(i=n.position.values.length/3,e.length/3/t),l=c.IndexDatatype.createTypedArray(i,2*t*(1+o)),d=0,u=0,y=u*t;for(f=0;f<t-1;f++)l[d++]=f+y,l[d++]=f+y+1;for(l[d++]=t-1+y,l[d++]=y,y=(u=o-1)*t,f=0;f<t-1;f++)l[d++]=f+y,l[d++]=f+y+1;for(l[d++]=t-1+y,l[d++]=y,u=0;u<o-1;u++)for(var h=t*u,g=h+t,f=0;f<t;f++)l[d++]=f+h,l[d++]=f+g;return new s.Geometry({attributes:n,indices:c.IndexDatatype.createTypedArray(i,l),boundingSphere:a.BoundingSphere.fromVertices(e),primitiveType:s.PrimitiveType.LINES})}(o.PolylineVolumeGeometryLibrary.computePositions(d,y,l,e,!1),y)},function(n,t){return(n=e.defined(t)?_.unpack(n,t):n)._ellipsoid=i.Ellipsoid.clone(n._ellipsoid),_.createGeometry(n)}}));