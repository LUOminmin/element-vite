define(["./GeometryOffsetAttribute-a68ce97c","./arrayRemoveDuplicates-98e917ed","./Transforms-d7f8120c","./Cartesian2-c2e87f25","./Check-3a7033c5","./ComponentDatatype-11643cbc","./PolylineVolumeGeometryLibrary-fb34ed38","./CorridorGeometryLibrary-9cb451ea","./when-a8daa614","./GeometryAttribute-c85c47e3","./GeometryAttributes-1356486e","./IndexDatatype-6ac58125","./Math-9c4212b4","./PolygonPipeline-caa2b3a7","./RuntimeError-3ea13d12","./WebGLConstants-18e33079","./EllipsoidTangentPlane-3927d699","./IntersectionTests-12c4c5cb","./Plane-44fc4194","./PolylinePipeline-f3c4dd31","./EllipsoidGeodesic-fc12f724","./EllipsoidRhumbLine-1b27589f"],(function(e,t,i,r,o,a,n,s,l,d,u,p,h,f,y,c,g,b,m,v,A,_){"use strict";var E=new r.Cartesian3,C=new r.Cartesian3,G=new r.Cartesian3;function T(e,t){var i,o=[],h=e.positions,f=e.corners,y=e.endPositions,c=new u.GeometryAttributes,g=0,b=0,m=0;for(R=0;R<h.length;R+=2)g+=i=h[R].length-3,m+=i/3*4,b+=h[R+1].length-3;for(g+=3,b+=3,R=0;R<f.length;R++){var v=f[R],A=f[R].leftPositions;l.defined(A)?g+=i=A.length:b+=i=f[R].rightPositions.length,m+=i/3*2}var _,T=l.defined(y);T&&(g+=_=y[0].length-3,b+=_,m+=4*(_/=3));e=g+b;var P,w,L,D,k=new Float64Array(e),N=0,O=e-1,V=_/2,x=p.IndexDatatype.createTypedArray(e/3,m+4),H=0;if(x[H++]=N/3,x[H++]=(O-2)/3,T){o.push(N/3);for(var I=E,S=C,M=y[0],R=0;R<V;R++)I=r.Cartesian3.fromArray(M,3*(V-1-R),I),S=r.Cartesian3.fromArray(M,3*(V+R),S),s.CorridorGeometryLibrary.addAttribute(k,S,N),s.CorridorGeometryLibrary.addAttribute(k,I,void 0,O),D=1+(w=N/3),L=(P=(O-2)/3)-1,x[H++]=P,x[H++]=L,x[H++]=w,x[H++]=D,N+=3,O-=3}var B=0,U=h[B++],F=h[B++];for(k.set(U,N),k.set(F,O-F.length+1),i=F.length-3,o.push(N/3,(O-2)/3),R=0;R<i;R+=3)D=1+(w=N/3),L=(P=(O-2)/3)-1,x[H++]=P,x[H++]=L,x[H++]=w,x[H++]=D,N+=3,O-=3;for(R=0;R<f.length;R++){var Y,q,W=(v=f[R]).leftPositions,J=v.rightPositions,j=G;if(l.defined(W)){for(O-=3,q=L,o.push(D),Y=0;Y<W.length/3;Y++)j=r.Cartesian3.fromArray(W,3*Y,j),x[H++]=q-Y-1,x[H++]=q-Y,s.CorridorGeometryLibrary.addAttribute(k,j,void 0,O),O-=3;o.push(q-Math.floor(W.length/6)),t===n.CornerType.BEVELED&&o.push((O-2)/3+1),N+=3}else{for(N+=3,q=D,o.push(L),Y=0;Y<J.length/3;Y++)j=r.Cartesian3.fromArray(J,3*Y,j),x[H++]=q+Y,x[H++]=q+Y+1,s.CorridorGeometryLibrary.addAttribute(k,j,N),N+=3;o.push(q+Math.floor(J.length/6)),t===n.CornerType.BEVELED&&o.push(N/3-1),O-=3}for(U=h[B++],F=h[B++],U.splice(0,3),F.splice(F.length-3,3),k.set(U,N),k.set(F,O-F.length+1),i=F.length-3,Y=0;Y<F.length;Y+=3)w=(D=N/3)-1,x[H++]=P=1+(L=(O-2)/3),x[H++]=L,x[H++]=w,x[H++]=D,N+=3,O-=3;N-=3,O+=3,o.push(N/3,(O-2)/3)}if(T){N+=3,O-=3,I=E,S=C;var z=y[1];for(R=0;R<V;R++)I=r.Cartesian3.fromArray(z,3*(_-R-1),I),S=r.Cartesian3.fromArray(z,3*R,S),s.CorridorGeometryLibrary.addAttribute(k,I,void 0,O),s.CorridorGeometryLibrary.addAttribute(k,S,N),w=(D=N/3)-1,x[H++]=P=1+(L=(O-2)/3),x[H++]=L,x[H++]=w,x[H++]=D,N+=3,O-=3;o.push(N/3)}else o.push(N/3,(O-2)/3);return x[H++]=N/3,x[H++]=(O-2)/3,c.position=new d.GeometryAttribute({componentDatatype:a.ComponentDatatype.DOUBLE,componentsPerAttribute:3,values:k}),{attributes:c,indices:x,wallIndices:o}}function P(e){var t=(e=l.defaultValue(e,l.defaultValue.EMPTY_OBJECT)).positions,i=e.width,o=l.defaultValue(e.height,0),a=l.defaultValue(e.extrudedHeight,o);this._positions=t,this._ellipsoid=r.Ellipsoid.clone(l.defaultValue(e.ellipsoid,r.Ellipsoid.WGS84)),this._width=i,this._height=Math.max(o,a),this._extrudedHeight=Math.min(o,a),this._cornerType=l.defaultValue(e.cornerType,n.CornerType.ROUNDED),this._granularity=l.defaultValue(e.granularity,h.CesiumMath.RADIANS_PER_DEGREE),this._offsetAttribute=e.offsetAttribute,this._workerName="createCorridorOutlineGeometry",this.packedLength=1+t.length*r.Cartesian3.packedLength+r.Ellipsoid.packedLength+6}P.pack=function(e,t,i){i=l.defaultValue(i,0);var o=e._positions,a=o.length;t[i++]=a;for(var n=0;n<a;++n,i+=r.Cartesian3.packedLength)r.Cartesian3.pack(o[n],t,i);return r.Ellipsoid.pack(e._ellipsoid,t,i),i+=r.Ellipsoid.packedLength,t[i++]=e._width,t[i++]=e._height,t[i++]=e._extrudedHeight,t[i++]=e._cornerType,t[i++]=e._granularity,t[i]=l.defaultValue(e._offsetAttribute,-1),t};var w=r.Ellipsoid.clone(r.Ellipsoid.UNIT_SPHERE),L={positions:void 0,ellipsoid:w,width:void 0,height:void 0,extrudedHeight:void 0,cornerType:void 0,granularity:void 0,offsetAttribute:void 0};return P.unpack=function(e,t,i){t=l.defaultValue(t,0);for(var o=e[t++],a=new Array(o),n=0;n<o;++n,t+=r.Cartesian3.packedLength)a[n]=r.Cartesian3.unpack(e,t);var s=r.Ellipsoid.unpack(e,t,w);t+=r.Ellipsoid.packedLength;var d=e[t++],u=e[t++],p=e[t++],h=e[t++],f=e[t++],y=e[t];return l.defined(i)?(i._positions=a,i._ellipsoid=r.Ellipsoid.clone(s,i._ellipsoid),i._width=d,i._height=u,i._extrudedHeight=p,i._cornerType=h,i._granularity=f,i._offsetAttribute=-1===y?void 0:y,i):(L.positions=a,L.width=d,L.height=u,L.extrudedHeight=p,L.cornerType=h,L.granularity=f,L.offsetAttribute=-1===y?void 0:y,new P(L))},P.createGeometry=function(o){var n=o._positions,u=o._width,y=o._ellipsoid,c=(n=function(e,t){for(var i=0;i<e.length;i++)e[i]=t.scaleToGeodeticSurface(e[i],e[i]);return e}(n,y),t.arrayRemoveDuplicates(n,r.Cartesian3.equalsEpsilon));if(!(c.length<2||u<=0)){var g,b=o._height,m=o._extrudedHeight;n=!h.CesiumMath.equalsEpsilon(b,m,0,h.CesiumMath.EPSILON2),u={ellipsoid:y,positions:c,width:u,cornerType:o._cornerType,granularity:o._granularity,saveAttributes:!1};n?(u.height=b,u.extrudedHeight=m,u.offsetAttribute=o._offsetAttribute,g=function(t){var i=t.ellipsoid,r=(c=T(s.CorridorGeometryLibrary.computePositions(t),t.cornerType)).wallIndices,o=t.height,n=t.extrudedHeight,u=c.attributes,h=c.indices,y=(g=u.position.values).length;(b=new Float64Array(y)).set(g);var c=new Float64Array(2*y),g=f.PolygonPipeline.scaleToGeodeticHeight(g,o,i),b=f.PolygonPipeline.scaleToGeodeticHeight(b,n,i);c.set(g),c.set(b,y),u.position.values=c,y/=3,l.defined(t.offsetAttribute)&&(b=new Uint8Array(2*y),b=t.offsetAttribute===e.GeometryOffsetAttribute.TOP?e.arrayFill(b,1,0,y):(t=t.offsetAttribute===e.GeometryOffsetAttribute.NONE?0:1,e.arrayFill(b,t)),u.applyOffset=new d.GeometryAttribute({componentDatatype:a.ComponentDatatype.UNSIGNED_BYTE,componentsPerAttribute:1,values:b}));var m=h.length,v=p.IndexDatatype.createTypedArray(c.length/3,2*(m+r.length));v.set(h);for(var A,_,E=m,C=0;C<m;C+=2){var G=h[C],P=h[C+1];v[E++]=G+y,v[E++]=P+y}for(C=0;C<r.length;C++)_=(A=r[C])+y,v[E++]=A,v[E++]=_;return{attributes:u,indices:v}}(u)):((g=T(s.CorridorGeometryLibrary.computePositions(u),u.cornerType)).attributes.position.values=f.PolygonPipeline.scaleToGeodeticHeight(g.attributes.position.values,b,y),l.defined(o._offsetAttribute)&&(v=g.attributes.position.values.length,A=new Uint8Array(v/3),v=o._offsetAttribute===e.GeometryOffsetAttribute.NONE?0:1,e.arrayFill(A,v),g.attributes.applyOffset=new d.GeometryAttribute({componentDatatype:a.ComponentDatatype.UNSIGNED_BYTE,componentsPerAttribute:1,values:A})));var v=g.attributes,A=i.BoundingSphere.fromVertices(v.position.values,void 0,3);return new d.Geometry({attributes:v,indices:g.indices,primitiveType:d.PrimitiveType.LINES,boundingSphere:A,offsetAttribute:o._offsetAttribute})}},function(e,t){return(e=l.defined(t)?P.unpack(e,t):e)._ellipsoid=r.Ellipsoid.clone(e._ellipsoid),P.createGeometry(e)}}));