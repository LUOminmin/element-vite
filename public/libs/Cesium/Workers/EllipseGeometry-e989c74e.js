define(["exports","./GeometryOffsetAttribute-a68ce97c","./Transforms-d7f8120c","./Cartesian2-c2e87f25","./Check-3a7033c5","./ComponentDatatype-11643cbc","./when-a8daa614","./EllipseGeometryLibrary-4a7f6bbb","./GeometryAttribute-c85c47e3","./GeometryAttributes-1356486e","./GeometryInstance-656b99a6","./GeometryPipeline-6828c62b","./IndexDatatype-6ac58125","./Math-9c4212b4","./VertexFormat-26951076"],(function(t,e,r,a,i,n,o,s,u,l,m,c,p,y,d){"use strict";var A=new a.Cartesian3,h=new a.Cartesian3,f=new a.Cartesian3,x=new a.Cartesian3,g=new a.Cartesian2,_=new r.Matrix3,b=new r.Matrix3,C=new r.Quaternion,v=new a.Cartesian3,w=new a.Cartesian3,M=new a.Cartesian3,E=new a.Cartographic,I=new a.Cartesian3,T=new a.Cartesian2,G=new a.Cartesian2;function N(t,i,m){var c=i.vertexFormat,p=i.center,y=i.semiMajorAxis,d=i.semiMinorAxis,x=i.ellipsoid,N=i.stRotation,P=m?t.length/3*2:t.length/3,F=i.shadowVolume,V=c.st?new Float32Array(2*P):void 0,D=c.normal?new Float32Array(3*P):void 0,O=c.tangent?new Float32Array(3*P):void 0,S=c.bitangent?new Float32Array(3*P):void 0,L=F?new Float32Array(3*P):void 0,R=0,j=v,k=w,z=M,B=new r.GeographicProjection(x),Y=B.project(x.cartesianToCartographic(p,E),I);p=x.scaleToGeodeticSurface(p,A);x.geodeticSurfaceNormal(p,p);var H=_,U=b;U=0!==N?(it=r.Quaternion.fromAxisAngle(p,N,C),H=r.Matrix3.fromQuaternion(it,H),it=r.Quaternion.fromAxisAngle(p,-N,C),r.Matrix3.fromQuaternion(it,U)):(H=r.Matrix3.clone(r.Matrix3.IDENTITY,H),r.Matrix3.clone(r.Matrix3.IDENTITY,U));for(var Q=a.Cartesian2.fromElements(Number.POSITIVE_INFINITY,Number.POSITIVE_INFINITY,T),W=a.Cartesian2.fromElements(Number.NEGATIVE_INFINITY,Number.NEGATIVE_INFINITY,G),J=t.length,q=m?J:0,Z=q/3*2,K=0;K<J;K+=3){var X,$=K+1,tt=K+2,et=a.Cartesian3.fromArray(t,K,A);c.st&&(X=r.Matrix3.multiplyByVector(H,et,h),X=B.project(x.cartesianToCartographic(X,E),f),a.Cartesian3.subtract(X,Y,X),g.x=(X.x+y)/(2*y),g.y=(X.y+d)/(2*d),Q.x=Math.min(g.x,Q.x),Q.y=Math.min(g.y,Q.y),W.x=Math.max(g.x,W.x),W.y=Math.max(g.y,W.y),m&&(V[R+Z]=g.x,V[R+1+Z]=g.y),V[R++]=g.x,V[R++]=g.y),(c.normal||c.tangent||c.bitangent||F)&&(j=x.geodeticSurfaceNormal(et,j),F&&(L[K+q]=-j.x,L[$+q]=-j.y,L[tt+q]=-j.z),(c.normal||c.tangent||c.bitangent)&&((c.tangent||c.bitangent)&&(k=a.Cartesian3.normalize(a.Cartesian3.cross(a.Cartesian3.UNIT_Z,j,k),k),r.Matrix3.multiplyByVector(U,k,k)),c.normal&&(D[K]=j.x,D[$]=j.y,D[tt]=j.z,m&&(D[K+q]=-j.x,D[$+q]=-j.y,D[tt+q]=-j.z)),c.tangent&&(O[K]=k.x,O[$]=k.y,O[tt]=k.z,m&&(O[K+q]=-k.x,O[$+q]=-k.y,O[tt+q]=-k.z)),c.bitangent&&(z=a.Cartesian3.normalize(a.Cartesian3.cross(j,k,z),z),S[K]=z.x,S[$]=z.y,S[tt]=z.z,m&&(S[K+q]=z.x,S[$+q]=z.y,S[tt+q]=z.z))))}if(c.st){J=V.length;for(var rt=0;rt<J;rt+=2)V[rt]=(V[rt]-Q.x)/(W.x-Q.x),V[rt+1]=(V[rt+1]-Q.y)/(W.y-Q.y)}var at,it=new l.GeometryAttributes;return c.position&&(at=s.EllipseGeometryLibrary.raisePositionsToHeight(t,i,m),it.position=new u.GeometryAttribute({componentDatatype:n.ComponentDatatype.DOUBLE,componentsPerAttribute:3,values:at})),c.st&&(it.st=new u.GeometryAttribute({componentDatatype:n.ComponentDatatype.FLOAT,componentsPerAttribute:2,values:V})),c.normal&&(it.normal=new u.GeometryAttribute({componentDatatype:n.ComponentDatatype.FLOAT,componentsPerAttribute:3,values:D})),c.tangent&&(it.tangent=new u.GeometryAttribute({componentDatatype:n.ComponentDatatype.FLOAT,componentsPerAttribute:3,values:O})),c.bitangent&&(it.bitangent=new u.GeometryAttribute({componentDatatype:n.ComponentDatatype.FLOAT,componentsPerAttribute:3,values:S})),F&&(it.extrudeDirection=new u.GeometryAttribute({componentDatatype:n.ComponentDatatype.FLOAT,componentsPerAttribute:3,values:L})),m&&o.defined(i.offsetAttribute)&&(at=new Uint8Array(P),at=i.offsetAttribute===e.GeometryOffsetAttribute.TOP?e.arrayFill(at,1,0,P/2):(i=i.offsetAttribute===e.GeometryOffsetAttribute.NONE?0:1,e.arrayFill(at,i)),it.applyOffset=new u.GeometryAttribute({componentDatatype:n.ComponentDatatype.UNSIGNED_BYTE,componentsPerAttribute:1,values:at})),it}function P(t){for(var e,r,a=new Array(t*(t+1)*12-6),i=0,n=0,o=1,s=0;s<3;s++)a[i++]=o++,a[i++]=n,a[i++]=o;for(s=2;s<t+1;++s){for(o=s*(s+1)-1,n=(s-1)*s-1,a[i++]=o++,a[i++]=n,a[i++]=o,e=2*s,r=0;r<e-1;++r)a[i++]=o,a[i++]=n++,a[i++]=n,a[i++]=o++,a[i++]=n,a[i++]=o;a[i++]=o++,a[i++]=n,a[i++]=o}for(e=2*t,++o,++n,s=0;s<e-1;++s)a[i++]=o,a[i++]=n++,a[i++]=n,a[i++]=o++,a[i++]=n,a[i++]=o;for(a[i++]=o,a[i++]=n++,a[i++]=n,a[i++]=o++,a[i++]=n++,a[i++]=n,++n,s=t-1;1<s;--s){for(a[i++]=n++,a[i++]=n,a[i++]=o,e=2*s,r=0;r<e-1;++r)a[i++]=o,a[i++]=n++,a[i++]=n,a[i++]=o++,a[i++]=n,a[i++]=o;a[i++]=n++,a[i++]=n++,a[i++]=o++}for(s=0;s<3;s++)a[i++]=n++,a[i++]=n,a[i++]=o;return a}var F=new a.Cartesian3,V=new r.BoundingSphere,D=new r.BoundingSphere;function O(t,e,r,i,n,o,u){for(var l=s.EllipseGeometryLibrary.computeEllipsePositions({center:t,semiMajorAxis:e,semiMinorAxis:r,rotation:i,granularity:n},!1,!0).outerPositions,m=l.length/3,c=new Array(m),p=0;p<m;++p)c[p]=a.Cartesian3.fromArray(l,3*p);return(u=a.Rectangle.fromCartesianArray(c,o,u)).width>y.CesiumMath.PI&&(u.north=0<u.north?y.CesiumMath.PI_OVER_TWO-y.CesiumMath.EPSILON7:u.north,u.south=u.south<0?y.CesiumMath.EPSILON7-y.CesiumMath.PI_OVER_TWO:u.south,u.east=y.CesiumMath.PI,u.west=-y.CesiumMath.PI),u}function S(t){var e=(t=o.defaultValue(t,o.defaultValue.EMPTY_OBJECT)).center,r=o.defaultValue(t.ellipsoid,a.Ellipsoid.WGS84),i=t.semiMajorAxis,n=t.semiMinorAxis,s=o.defaultValue(t.granularity,y.CesiumMath.RADIANS_PER_DEGREE),u=o.defaultValue(t.vertexFormat,d.VertexFormat.DEFAULT),l=o.defaultValue(t.height,0),m=o.defaultValue(t.extrudedHeight,l);this._center=a.Cartesian3.clone(e),this._semiMajorAxis=i,this._semiMinorAxis=n,this._ellipsoid=a.Ellipsoid.clone(r),this._rotation=o.defaultValue(t.rotation,0),this._stRotation=o.defaultValue(t.stRotation,0),this._height=Math.max(m,l),this._granularity=s,this._vertexFormat=d.VertexFormat.clone(u),this._extrudedHeight=Math.min(m,l),this._shadowVolume=o.defaultValue(t.shadowVolume,!1),this._workerName="createEllipseGeometry",this._offsetAttribute=t.offsetAttribute,this._rectangle=void 0,this._textureCoordinateRotationPoints=void 0}S.packedLength=a.Cartesian3.packedLength+a.Ellipsoid.packedLength+d.VertexFormat.packedLength+9,S.pack=function(t,e,r){return r=o.defaultValue(r,0),a.Cartesian3.pack(t._center,e,r),r+=a.Cartesian3.packedLength,a.Ellipsoid.pack(t._ellipsoid,e,r),r+=a.Ellipsoid.packedLength,d.VertexFormat.pack(t._vertexFormat,e,r),r+=d.VertexFormat.packedLength,e[r++]=t._semiMajorAxis,e[r++]=t._semiMinorAxis,e[r++]=t._rotation,e[r++]=t._stRotation,e[r++]=t._height,e[r++]=t._granularity,e[r++]=t._extrudedHeight,e[r++]=t._shadowVolume?1:0,e[r]=o.defaultValue(t._offsetAttribute,-1),e};var L=new a.Cartesian3,R=new a.Ellipsoid,j=new d.VertexFormat,k={center:L,ellipsoid:R,vertexFormat:j,semiMajorAxis:void 0,semiMinorAxis:void 0,rotation:void 0,stRotation:void 0,height:void 0,granularity:void 0,extrudedHeight:void 0,shadowVolume:void 0,offsetAttribute:void 0};S.unpack=function(t,e,r){e=o.defaultValue(e,0);var i=a.Cartesian3.unpack(t,e,L);e+=a.Cartesian3.packedLength;var n=a.Ellipsoid.unpack(t,e,R);e+=a.Ellipsoid.packedLength;var s=d.VertexFormat.unpack(t,e,j);e+=d.VertexFormat.packedLength;var u=t[e++],l=t[e++],m=t[e++],c=t[e++],p=t[e++],y=t[e++],A=t[e++],h=1===t[e++];e=t[e];return o.defined(r)?(r._center=a.Cartesian3.clone(i,r._center),r._ellipsoid=a.Ellipsoid.clone(n,r._ellipsoid),r._vertexFormat=d.VertexFormat.clone(s,r._vertexFormat),r._semiMajorAxis=u,r._semiMinorAxis=l,r._rotation=m,r._stRotation=c,r._height=p,r._granularity=y,r._extrudedHeight=A,r._shadowVolume=h,r._offsetAttribute=-1===e?void 0:e,r):(k.height=p,k.extrudedHeight=A,k.granularity=y,k.stRotation=c,k.rotation=m,k.semiMajorAxis=u,k.semiMinorAxis=l,k.shadowVolume=h,k.offsetAttribute=-1===e?void 0:e,new S(k))},S.computeRectangle=function(t,e){var r=(t=o.defaultValue(t,o.defaultValue.EMPTY_OBJECT)).center,i=o.defaultValue(t.ellipsoid,a.Ellipsoid.WGS84),n=t.semiMajorAxis,s=t.semiMinorAxis,u=o.defaultValue(t.granularity,y.CesiumMath.RADIANS_PER_DEGREE);return O(r,n,s,o.defaultValue(t.rotation,0),u,i,e)},S.createGeometry=function(t){if(!(t._semiMajorAxis<=0||t._semiMinorAxis<=0)){var i=t._height,d=t._extrudedHeight,b=!y.CesiumMath.equalsEpsilon(i,d,0,y.CesiumMath.EPSILON2);t._center=t._ellipsoid.scaleToGeodeticSurface(t._center,t._center);var O;i={center:t._center,semiMajorAxis:t._semiMajorAxis,semiMinorAxis:t._semiMinorAxis,ellipsoid:t._ellipsoid,rotation:t._rotation,height:i,granularity:t._granularity,vertexFormat:t._vertexFormat,stRotation:t._stRotation};return b?(i.extrudedHeight=d,i.shadowVolume=t._shadowVolume,i.offsetAttribute=t._offsetAttribute,O=function(t){var i=t.center,y=t.ellipsoid,d=t.semiMajorAxis,b=a.Cartesian3.multiplyByScalar(y.geodeticSurfaceNormal(i,A),t.height,A);V.center=a.Cartesian3.add(i,b,V.center),V.radius=d,b=a.Cartesian3.multiplyByScalar(y.geodeticSurfaceNormal(i,b),t.extrudedHeight,b),D.center=a.Cartesian3.add(i,b,D.center),D.radius=d,y=(F=s.EllipseGeometryLibrary.computeEllipsePositions(t,!0,!0)).positions,i=F.numPts,b=F.outerPositions,d=r.BoundingSphere.union(V,D);var F=N(y,t,!0),O=(R=P(i)).length;R.length=2*O;for(var S=y.length/3,L=0;L<O;L+=3)R[L+O]=R[L+2]+S,R[L+1+O]=R[L+1]+S,R[L+2+O]=R[L]+S;y=p.IndexDatatype.createTypedArray(2*S/3,R),y=new u.Geometry({attributes:F,indices:y,primitiveType:u.PrimitiveType.TRIANGLES}),t=function(t,i){var s=i.vertexFormat,m=i.center,c=i.semiMajorAxis,p=i.semiMinorAxis,y=i.ellipsoid,d=i.height,b=i.extrudedHeight,N=i.stRotation,P=t.length/3*2,F=new Float64Array(3*P),V=s.st?new Float32Array(2*P):void 0,D=s.normal?new Float32Array(3*P):void 0,O=s.tangent?new Float32Array(3*P):void 0,S=s.bitangent?new Float32Array(3*P):void 0,L=i.shadowVolume,R=L?new Float32Array(3*P):void 0,j=0,k=v,z=w,B=M,Y=new r.GeographicProjection(y),H=Y.project(y.cartesianToCartographic(m,E),I);m=y.scaleToGeodeticSurface(m,A),y.geodeticSurfaceNormal(m,m),m=r.Quaternion.fromAxisAngle(m,N,C);for(var U=r.Matrix3.fromQuaternion(m,_),Q=a.Cartesian2.fromElements(Number.POSITIVE_INFINITY,Number.POSITIVE_INFINITY,T),W=a.Cartesian2.fromElements(Number.NEGATIVE_INFINITY,Number.NEGATIVE_INFINITY,G),J=(et=t.length)/3*2,q=0;q<et;q+=3){var Z=q+1,K=q+2,X=a.Cartesian3.fromArray(t,q,A);s.st&&(tt=r.Matrix3.multiplyByVector(U,X,h),$=Y.project(y.cartesianToCartographic(tt,E),f),a.Cartesian3.subtract($,H,$),g.x=($.x+c)/(2*c),g.y=($.y+p)/(2*p),Q.x=Math.min(g.x,Q.x),Q.y=Math.min(g.y,Q.y),W.x=Math.max(g.x,W.x),W.y=Math.max(g.y,W.y),V[j+J]=g.x,V[j+1+J]=g.y,V[j++]=g.x,V[j++]=g.y),X=y.scaleToGeodeticSurface(X,X),tt=a.Cartesian3.clone(X,h),k=y.geodeticSurfaceNormal(X,k),L&&(R[q+et]=-k.x,R[Z+et]=-k.y,R[K+et]=-k.z);var $=a.Cartesian3.multiplyByScalar(k,d,x),tt=(X=a.Cartesian3.add(X,$,X),$=a.Cartesian3.multiplyByScalar(k,b,$),a.Cartesian3.add(tt,$,tt));s.position&&(F[q+et]=tt.x,F[Z+et]=tt.y,F[K+et]=tt.z,F[q]=X.x,F[Z]=X.y,F[K]=X.z),(s.normal||s.tangent||s.bitangent)&&(B=a.Cartesian3.clone(k,B),$=a.Cartesian3.fromArray(t,(q+3)%et,x),a.Cartesian3.subtract($,X,$),X=a.Cartesian3.subtract(tt,X,f),k=a.Cartesian3.normalize(a.Cartesian3.cross(X,$,k),k),s.normal&&(D[q]=k.x,D[Z]=k.y,D[K]=k.z,D[q+et]=k.x,D[Z+et]=k.y,D[K+et]=k.z),s.tangent&&(z=a.Cartesian3.normalize(a.Cartesian3.cross(B,k,z),z),O[q]=z.x,O[Z]=z.y,O[K]=z.z,O[q+et]=z.x,O[q+1+et]=z.y,O[q+2+et]=z.z),s.bitangent&&(S[q]=B.x,S[Z]=B.y,S[K]=B.z,S[q+et]=B.x,S[Z+et]=B.y,S[K+et]=B.z))}if(s.st)for(var et=V.length,rt=0;rt<et;rt+=2)V[rt]=(V[rt]-Q.x)/(W.x-Q.x),V[rt+1]=(V[rt+1]-Q.y)/(W.y-Q.y);return N=new l.GeometryAttributes,s.position&&(N.position=new u.GeometryAttribute({componentDatatype:n.ComponentDatatype.DOUBLE,componentsPerAttribute:3,values:F})),s.st&&(N.st=new u.GeometryAttribute({componentDatatype:n.ComponentDatatype.FLOAT,componentsPerAttribute:2,values:V})),s.normal&&(N.normal=new u.GeometryAttribute({componentDatatype:n.ComponentDatatype.FLOAT,componentsPerAttribute:3,values:D})),s.tangent&&(N.tangent=new u.GeometryAttribute({componentDatatype:n.ComponentDatatype.FLOAT,componentsPerAttribute:3,values:O})),s.bitangent&&(N.bitangent=new u.GeometryAttribute({componentDatatype:n.ComponentDatatype.FLOAT,componentsPerAttribute:3,values:S})),L&&(N.extrudeDirection=new u.GeometryAttribute({componentDatatype:n.ComponentDatatype.FLOAT,componentsPerAttribute:3,values:R})),o.defined(i.offsetAttribute)&&(m=new Uint8Array(P),m=i.offsetAttribute===e.GeometryOffsetAttribute.TOP?e.arrayFill(m,1,0,P/2):(i=i.offsetAttribute===e.GeometryOffsetAttribute.NONE?0:1,e.arrayFill(m,i)),N.applyOffset=new u.GeometryAttribute({componentDatatype:n.ComponentDatatype.UNSIGNED_BYTE,componentsPerAttribute:1,values:m})),N}(b,t);var R=function(t){for(var e=t.length/3,r=p.IndexDatatype.createTypedArray(e,6*e),a=0,i=0;i<e;i++){var n=i+e,o=(i+1)%e,s=o+e;r[a++]=i,r[a++]=n,r[a++]=o,r[a++]=o,r[a++]=n,r[a++]=s}return r}(b);return b=p.IndexDatatype.createTypedArray(2*b.length/3,R),b=new u.Geometry({attributes:t,indices:b,primitiveType:u.PrimitiveType.TRIANGLES}),{boundingSphere:d,attributes:(b=c.GeometryPipeline.combineInstances([new m.GeometryInstance({geometry:y}),new m.GeometryInstance({geometry:b})]))[0].attributes,indices:b[0].indices}}(i)):(O=function(t){var e=t.center;F=a.Cartesian3.multiplyByScalar(t.ellipsoid.geodeticSurfaceNormal(e,F),t.height,F),F=a.Cartesian3.add(e,F,F);var i=new r.BoundingSphere(F,t.semiMajorAxis),n=(e=(n=s.EllipseGeometryLibrary.computeEllipsePositions(t,!0,!1)).positions,n.numPts);t=N(e,t,!1),n=P(n);return{boundingSphere:i,attributes:t,indices:n=p.IndexDatatype.createTypedArray(e.length/3,n)}}(i),o.defined(t._offsetAttribute)&&(d=O.attributes.position.values.length,i=new Uint8Array(d/3),d=t._offsetAttribute===e.GeometryOffsetAttribute.NONE?0:1,e.arrayFill(i,d),O.attributes.applyOffset=new u.GeometryAttribute({componentDatatype:n.ComponentDatatype.UNSIGNED_BYTE,componentsPerAttribute:1,values:i}))),new u.Geometry({attributes:O.attributes,indices:O.indices,primitiveType:u.PrimitiveType.TRIANGLES,boundingSphere:O.boundingSphere,offsetAttribute:t._offsetAttribute})}},S.createShadowVolume=function(t,e,r){var a=t._granularity,i=t._ellipsoid;e=e(a,i),r=r(a,i);return new S({center:t._center,semiMajorAxis:t._semiMajorAxis,semiMinorAxis:t._semiMinorAxis,ellipsoid:i,rotation:t._rotation,stRotation:t._stRotation,granularity:a,extrudedHeight:e,height:r,vertexFormat:d.VertexFormat.POSITION_ONLY,shadowVolume:!0})},Object.defineProperties(S.prototype,{rectangle:{get:function(){return o.defined(this._rectangle)||(this._rectangle=O(this._center,this._semiMajorAxis,this._semiMinorAxis,this._rotation,this._granularity,this._ellipsoid)),this._rectangle}},textureCoordinateRotationPoints:{get:function(){return o.defined(this._textureCoordinateRotationPoints)||(this._textureCoordinateRotationPoints=function(t){var e=-t._stRotation;if(0==e)return[0,0,0,1,1,0];for(var r=s.EllipseGeometryLibrary.computeEllipsePositions({center:t._center,semiMajorAxis:t._semiMajorAxis,semiMinorAxis:t._semiMinorAxis,rotation:t._rotation,granularity:t._granularity},!1,!0).outerPositions,i=r.length/3,n=new Array(i),o=0;o<i;++o)n[o]=a.Cartesian3.fromArray(r,3*o);var l=t._ellipsoid;t=t.rectangle;return u.Geometry._textureCoordinateRotationPoints(n,e,l,t)}(this)),this._textureCoordinateRotationPoints}}}),t.EllipseGeometry=S}));