define(["./when-a8daa614","./Cartesian2-c2e87f25","./ArcType-b86a0fcb","./Transforms-d7f8120c","./Color-84f605ee","./ComponentDatatype-11643cbc","./Check-3a7033c5","./GeometryAttribute-c85c47e3","./GeometryAttributes-1356486e","./IndexDatatype-6ac58125","./Math-9c4212b4","./PolylinePipeline-f3c4dd31","./RuntimeError-3ea13d12","./WebGLConstants-18e33079","./EllipsoidGeodesic-fc12f724","./EllipsoidRhumbLine-1b27589f","./IntersectionTests-12c4c5cb","./Plane-44fc4194"],(function(e,o,t,r,a,l,i,n,s,p,c,d,f,y,u,h,C,T){"use strict";function g(r){var l=(r=e.defaultValue(r,e.defaultValue.EMPTY_OBJECT)).positions,i=r.colors,n=e.defaultValue(r.colorsPerVertex,!1);this._positions=l,this._colors=i,this._colorsPerVertex=n,this._arcType=e.defaultValue(r.arcType,t.ArcType.GEODESIC),this._granularity=e.defaultValue(r.granularity,c.CesiumMath.RADIANS_PER_DEGREE),this._ellipsoid=e.defaultValue(r.ellipsoid,o.Ellipsoid.WGS84),this._workerName="createSimplePolylineGeometry",l=1+l.length*o.Cartesian3.packedLength,l+=e.defined(i)?1+i.length*a.Color.packedLength:1,this.packedLength=l+o.Ellipsoid.packedLength+3}g.pack=function(t,r,l){var i;l=e.defaultValue(l,0);var n=t._positions,s=n.length;for(r[l++]=s,i=0;i<s;++i,l+=o.Cartesian3.packedLength)o.Cartesian3.pack(n[i],r,l);var p=t._colors;s=e.defined(p)?p.length:0;for(r[l++]=s,i=0;i<s;++i,l+=a.Color.packedLength)a.Color.pack(p[i],r,l);return o.Ellipsoid.pack(t._ellipsoid,r,l),l+=o.Ellipsoid.packedLength,r[l++]=t._colorsPerVertex?1:0,r[l++]=t._arcType,r[l]=t._granularity,r},g.unpack=function(t,r,l){r=e.defaultValue(r,0);for(var i=t[r++],n=new Array(i),s=0;s<i;++s,r+=o.Cartesian3.packedLength)n[s]=o.Cartesian3.unpack(t,r);var p=0<(i=t[r++])?new Array(i):void 0;for(s=0;s<i;++s,r+=a.Color.packedLength)p[s]=a.Color.unpack(t,r);var c=o.Ellipsoid.unpack(t,r);r+=o.Ellipsoid.packedLength;var d=1===t[r++],f=t[r++],y=t[r];return e.defined(l)?(l._positions=n,l._colors=p,l._ellipsoid=c,l._colorsPerVertex=d,l._arcType=f,l._granularity=y,l):new g({positions:n,colors:p,ellipsoid:c,colorsPerVertex:d,arcType:f,granularity:y})};var m=new Array(2),P=new Array(2),_={positions:m,height:P,ellipsoid:void 0,minDistance:void 0,granularity:void 0};return g.createGeometry=function(i){var f=i._positions,y=i._colors,u=i._colorsPerVertex,h=i._arcType,C=i._granularity,T=(i=i._ellipsoid,c.CesiumMath.chordLength(C,i.maximumRadius)),g=e.defined(y)&&!u,v=f.length,b=0;if(h===t.ArcType.GEODESIC||h===t.ArcType.RHUMB){var B,A,E=h===t.ArcType.GEODESIC?(B=c.CesiumMath.chordLength(C,i.maximumRadius),A=d.PolylinePipeline.numberOfPoints,d.PolylinePipeline.generateArc):(B=C,A=d.PolylinePipeline.numberOfPointsRhumbLine,d.PolylinePipeline.generateRhumbArc),k=d.PolylinePipeline.extractHeights(f,i),G=_;if(h===t.ArcType.GEODESIC?G.minDistance=T:G.granularity=C,G.ellipsoid=i,g){for(var w=0,D=0;D<v-1;D++)w+=A(f[D],f[D+1],B)+1;M=new Float64Array(3*w),U=new Uint8Array(4*w),G.positions=m,G.height=P;var L=0;for(D=0;D<v-1;++D){m[0]=f[D],m[1]=f[D+1],P[0]=k[D],P[1]=k[D+1];var V=E(G);if(e.defined(y))for(var x=V.length/3,S=y[D],I=0;I<x;++I)U[L++]=a.Color.floatToByte(S.red),U[L++]=a.Color.floatToByte(S.green),U[L++]=a.Color.floatToByte(S.blue),U[L++]=a.Color.floatToByte(S.alpha);M.set(V,b),b+=V.length}}else if(G.positions=f,G.height=k,M=new Float64Array(E(G)),e.defined(y)){for(U=new Uint8Array(M.length/3*4),D=0;D<v-1;++D)b=function(e,o,t,r,l,i,n){var s=d.PolylinePipeline.numberOfPoints(e,o,l),p=t.red,c=t.green,f=t.blue,y=t.alpha,u=r.red;e=r.green,o=r.blue,l=r.alpha;if(a.Color.equals(t,r)){for(P=0;P<s;P++)i[n++]=a.Color.floatToByte(p),i[n++]=a.Color.floatToByte(c),i[n++]=a.Color.floatToByte(f),i[n++]=a.Color.floatToByte(y);return n}for(var h=(u-p)/s,C=(e-c)/s,T=(o-f)/s,g=(l-y)/s,m=n,P=0;P<s;P++)i[m++]=a.Color.floatToByte(p+P*h),i[m++]=a.Color.floatToByte(c+P*C),i[m++]=a.Color.floatToByte(f+P*T),i[m++]=a.Color.floatToByte(y+P*g);return m}(f[D],f[D+1],y[D],y[D+1],T,U,b);var R=y[v-1];U[b++]=a.Color.floatToByte(R.red),U[b++]=a.Color.floatToByte(R.green),U[b++]=a.Color.floatToByte(R.blue),U[b++]=a.Color.floatToByte(R.alpha)}}else{var O=g?2*v-2:v,M=new Float64Array(3*O),U=e.defined(y)?new Uint8Array(4*O):void 0,N=0,F=0;for(D=0;D<v;++D){var H=f[D];if(g&&0<D&&(o.Cartesian3.pack(H,M,N),N+=3,S=y[D-1],U[F++]=a.Color.floatToByte(S.red),U[F++]=a.Color.floatToByte(S.green),U[F++]=a.Color.floatToByte(S.blue),U[F++]=a.Color.floatToByte(S.alpha)),g&&D===v-1)break;o.Cartesian3.pack(H,M,N),N+=3,e.defined(y)&&(S=y[D],U[F++]=a.Color.floatToByte(S.red),U[F++]=a.Color.floatToByte(S.green),U[F++]=a.Color.floatToByte(S.blue),U[F++]=a.Color.floatToByte(S.alpha))}}(R=new s.GeometryAttributes).position=new n.GeometryAttribute({componentDatatype:l.ComponentDatatype.DOUBLE,componentsPerAttribute:3,values:M}),e.defined(y)&&(R.color=new n.GeometryAttribute({componentDatatype:l.ComponentDatatype.UNSIGNED_BYTE,componentsPerAttribute:4,values:U,normalize:!0})),O=M.length/3;var W=p.IndexDatatype.createTypedArray(O,2*(O-1)),Y=0;for(D=0;D<O-1;++D)W[Y++]=D,W[Y++]=D+1;return new n.Geometry({attributes:R,indices:W,primitiveType:n.PrimitiveType.LINES,boundingSphere:r.BoundingSphere.fromPoints(f)})},function(t,r){return(t=e.defined(r)?g.unpack(t,r):t)._ellipsoid=o.Ellipsoid.clone(t._ellipsoid),g.createGeometry(t)}}));