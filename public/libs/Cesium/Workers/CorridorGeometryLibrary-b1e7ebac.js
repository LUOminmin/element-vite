define(["exports","./Cartesian2-baaaa1b2","./PolylineVolumeGeometryLibrary-d0f84d12","./when-a8daa614","./Math-2bc59f31","./Transforms-0a2c7f40","./PolylinePipeline-de2c5e75"],(function(a,e,r,n,t,i,s){"use strict";var o={},C=new e.Cartesian3,l=new e.Cartesian3,y=new e.Cartesian3,u=new e.Cartesian3,c=[new e.Cartesian3,new e.Cartesian3],d=new e.Cartesian3,p=new e.Cartesian3,m=new e.Cartesian3,g=new e.Cartesian3,h=new e.Cartesian3,f=new e.Cartesian3,w=new e.Cartesian3,z=new e.Cartesian3,x=new e.Cartesian3,P=new e.Cartesian3,A=new i.Quaternion,B=new i.Matrix3;function v(a,n,s,o,y){var u=e.Cartesian3.angleBetween(e.Cartesian3.subtract(n,a,C),e.Cartesian3.subtract(s,a,l)),c=o===r.CornerType.BEVELED?1:Math.ceil(u/t.CesiumMath.toRadians(5))+1,d=(o=3*c,new Array(o));d[o-3]=s.x,d[o-2]=s.y,d[o-1]=s.z;var p=y?i.Matrix3.fromQuaternion(i.Quaternion.fromAxisAngle(e.Cartesian3.negate(a,C),u/c,A),B):i.Matrix3.fromQuaternion(i.Quaternion.fromAxisAngle(a,u/c,A),B),m=0;n=e.Cartesian3.clone(n,C);for(var g=0;g<c;g++)n=i.Matrix3.multiplyByVector(p,n,n),d[m++]=n.x,d[m++]=n.y,d[m++]=n.z;return d}function E(a,r,n,t){var i=C;return[(t||(r=e.Cartesian3.negate(r,r)),i=e.Cartesian3.add(a,r,i)).x,i.y,i.z,n.x,n.y,n.z]}function S(a,r,n,t){for(var i=new Array(a.length),s=new Array(a.length),o=e.Cartesian3.multiplyByScalar(r,n,C),c=e.Cartesian3.negate(o,l),d=0,p=a.length-1,m=0;m<a.length;m+=3){var g=e.Cartesian3.fromArray(a,m,y),h=e.Cartesian3.add(g,c,u);i[d++]=h.x,i[d++]=h.y,i[d++]=h.z,g=e.Cartesian3.add(g,o,u),s[p--]=g.z,s[p--]=g.y,s[p--]=g.x}return t.push(i,s),t}o.addAttribute=function(a,e,r,t){var i=e.x,s=e.y;e=e.z;n.defined(r)&&(a[r]=i,a[r+1]=s,a[r+2]=e),n.defined(t)&&(a[t]=e,a[t-1]=s,a[t-2]=i)};var b=new e.Cartesian3,D=new e.Cartesian3;o.computePositions=function(a){var n=a.granularity,i=a.positions,o=a.ellipsoid,l=a.width/2,y=a.cornerType,u=a.saveAttributes,A=d,B=m,M=g,T=h,N=f,L=w,O=z,R=x,V=P,Q=[],U=u?[]:void 0,G=u?[]:void 0,I=i[0],q=i[1],j=e.Cartesian3.normalize(e.Cartesian3.subtract(q,I,j=p),j);A=o.geodeticSurfaceNormal(I,A),M=e.Cartesian3.normalize(e.Cartesian3.cross(A,j,M),M);u&&(U.push(M.x,M.y,M.z),G.push(A.x,A.y,A.z));L=e.Cartesian3.clone(I,L),I=q,B=e.Cartesian3.negate(j,B);for(var k,F,H,J,K,W,X,Y=[],Z=i.length,$=1;$<Z-1;$++){A=o.geodeticSurfaceNormal(I,A),q=i[$+1],j=e.Cartesian3.normalize(e.Cartesian3.subtract(q,I,j),j),T=e.Cartesian3.normalize(e.Cartesian3.add(j,B,T),T);var _=e.Cartesian3.multiplyByScalar(A,e.Cartesian3.dot(j,A),b);e.Cartesian3.subtract(j,_,_),e.Cartesian3.normalize(_,_);var aa=e.Cartesian3.multiplyByScalar(A,e.Cartesian3.dot(B,A),D);e.Cartesian3.subtract(B,aa,aa),e.Cartesian3.normalize(aa,aa),t.CesiumMath.equalsEpsilon(Math.abs(e.Cartesian3.dot(_,aa)),1,t.CesiumMath.EPSILON7)||(T=e.Cartesian3.cross(T,A,T),T=e.Cartesian3.cross(A,T,T),T=e.Cartesian3.normalize(T,T),_=l/Math.max(.25,e.Cartesian3.magnitude(e.Cartesian3.cross(T,B,C))),aa=r.PolylineVolumeGeometryLibrary.angleIsGreaterThanPi(j,B,I,o),T=e.Cartesian3.multiplyByScalar(T,_,T),aa?(O=e.Cartesian3.add(I,T,O),V=e.Cartesian3.add(O,e.Cartesian3.multiplyByScalar(M,l,V),V),R=e.Cartesian3.add(O,e.Cartesian3.multiplyByScalar(M,2*l,R),R),c[0]=e.Cartesian3.clone(L,c[0]),c[1]=e.Cartesian3.clone(V,c[1]),Q=S(s.PolylinePipeline.generateArc({positions:c,granularity:n,ellipsoid:o}),M,l,Q),u&&(U.push(M.x,M.y,M.z),G.push(A.x,A.y,A.z)),N=e.Cartesian3.clone(R,N),M=e.Cartesian3.normalize(e.Cartesian3.cross(A,j,M),M),R=e.Cartesian3.add(O,e.Cartesian3.multiplyByScalar(M,2*l,R),R),L=e.Cartesian3.add(O,e.Cartesian3.multiplyByScalar(M,l,L),L),y===r.CornerType.ROUNDED||y===r.CornerType.BEVELED?Y.push({leftPositions:v(O,N,R,y,aa)}):Y.push({leftPositions:E(I,e.Cartesian3.negate(T,T),R,aa)})):(R=e.Cartesian3.add(I,T,R),V=e.Cartesian3.add(R,e.Cartesian3.negate(e.Cartesian3.multiplyByScalar(M,l,V),V),V),O=e.Cartesian3.add(R,e.Cartesian3.negate(e.Cartesian3.multiplyByScalar(M,2*l,O),O),O),c[0]=e.Cartesian3.clone(L,c[0]),c[1]=e.Cartesian3.clone(V,c[1]),Q=S(s.PolylinePipeline.generateArc({positions:c,granularity:n,ellipsoid:o}),M,l,Q),u&&(U.push(M.x,M.y,M.z),G.push(A.x,A.y,A.z)),N=e.Cartesian3.clone(O,N),M=e.Cartesian3.normalize(e.Cartesian3.cross(A,j,M),M),O=e.Cartesian3.add(R,e.Cartesian3.negate(e.Cartesian3.multiplyByScalar(M,2*l,O),O),O),L=e.Cartesian3.add(R,e.Cartesian3.negate(e.Cartesian3.multiplyByScalar(M,l,L),L),L),y===r.CornerType.ROUNDED||y===r.CornerType.BEVELED?Y.push({rightPositions:v(R,N,O,y,aa)}):Y.push({rightPositions:E(I,T,O,aa)})),B=e.Cartesian3.negate(j,B)),I=q}return A=o.geodeticSurfaceNormal(I,A),c[0]=e.Cartesian3.clone(L,c[0]),c[1]=e.Cartesian3.clone(I,c[1]),Q=S(s.PolylinePipeline.generateArc({positions:c,granularity:n,ellipsoid:o}),M,l,Q),u&&(U.push(M.x,M.y,M.z),G.push(A.x,A.y,A.z)),y===r.CornerType.ROUNDED&&(F=d,H=m,J=(k=Q)[1],K=e.Cartesian3.fromArray(k[1],J.length-3,p),H=e.Cartesian3.fromArray(k[0],0,H),W=v(F=e.Cartesian3.midpoint(K,H,F),K,H,r.CornerType.ROUNDED,!1),a=k[(X=k.length-1)-1],J=k[X],K=e.Cartesian3.fromArray(a,a.length-3,K),H=e.Cartesian3.fromArray(J,0,H),H=[W,v(F=e.Cartesian3.midpoint(K,H,F),K,H,r.CornerType.ROUNDED,!1)]),{positions:Q,corners:Y,lefts:U,normals:G,endPositions:H}},a.CorridorGeometryLibrary=o}));