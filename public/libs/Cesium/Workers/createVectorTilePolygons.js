define(["./AttributeCompression-9d280301","./Cartesian2-c2e87f25","./Color-84f605ee","./when-a8daa614","./IndexDatatype-6ac58125","./Math-9c4212b4","./OrientedBoundingBox-5bffc097","./createTaskProcessorWorker","./Check-3a7033c5","./Transforms-d7f8120c","./RuntimeError-3ea13d12","./WebGLConstants-18e33079","./EllipsoidTangentPlane-3927d699","./IntersectionTests-12c4c5cb","./Plane-44fc4194"],(function(e,a,r,n,t,i,o,s,f,d,c,u,h,l,g){"use strict";var p=new a.Cartesian3,b=new a.Ellipsoid,C=new a.Rectangle,y={min:void 0,max:void 0,indexBytesPerElement:void 0};var I=new a.Cartesian3,m=new a.Cartesian3,w=new a.Cartesian3,v=new a.Cartesian3,x=new a.Cartesian3,A=new a.Cartographic,E=new a.Rectangle;return s((function(s,f){var d;u=s.packedBuffer,d=new Float64Array(u),u=0,y.indexBytesPerElement=d[u++],y.min=d[u++],y.max=d[u++],a.Cartesian3.unpack(d,3,p),u+=a.Cartesian3.packedLength,a.Ellipsoid.unpack(d,u,b),u+=a.Ellipsoid.packedLength,a.Rectangle.unpack(d,u,C);var c=new(2===y.indexBytesPerElement?Uint16Array:Uint32Array)(s.indices),u=new Uint16Array(s.positions),h=new Uint32Array(s.counts),l=new Uint32Array(s.indexCounts),g=new Uint32Array(s.batchIds),N=new Uint32Array(s.batchTableColors),T=new Array(h.length),k=p,B=b,L=C,O=y.min,U=y.max,P=s.minimumHeights,F=s.maximumHeights;n.defined(P)&&n.defined(F)&&(P=new Float32Array(P),F=new Float32Array(F));var S=u.length/2,R=u.subarray(0,S),D=u.subarray(S,2*S);e.AttributeCompression.zigZagDeltaDecode(R,D);for(var M=new Float64Array(3*S),_=0;_<S;++_){var G=R[_],Y=D[_];G=i.CesiumMath.lerp(L.west,L.east,G/32767),Y=i.CesiumMath.lerp(L.south,L.north,Y/32767),Y=a.Cartographic.fromRadians(G,Y,0,A),Y=B.cartographicToCartesian(Y,I);a.Cartesian3.pack(Y,M,3*_)}var V=h.length,H=new Array(V),W=new Array(V),z=0,Z=0;for(_=0;_<V;++_)H[_]=z,W[_]=Z,z+=h[_],Z+=l[_];var j=new Float32Array(3*S*2),q=new Uint16Array(2*S),J=new Uint32Array(W.length),K=new Uint32Array(l.length),Q=[],X={};for(_=0;_<V;++_)ne=N[_],n.defined(X[ne])?(X[ne].positionLength+=h[_],X[ne].indexLength+=l[_],X[ne].batchIds.push(_)):X[ne]={positionLength:h[_],indexLength:l[_],offset:0,indexOffset:0,batchIds:[_]};var $,ee=0,ae=0;for(ne in X)X.hasOwnProperty(ne)&&((te=X[ne]).offset=ee,te.indexOffset=ae,ee+=2*te.positionLength,ae+=$=2*te.indexLength+6*te.positionLength,te.indexLength=$);var re=[];for(ne in X)X.hasOwnProperty(ne)&&(te=X[ne],re.push({color:r.Color.fromRgba(parseInt(ne)),offset:te.indexOffset,count:te.indexLength,batchIds:te.batchIds}));for(_=0;_<V;++_){var ne,te,ie=(te=X[ne=N[_]]).offset,oe=3*ie,se=ie,fe=H[_],de=h[_],ce=g[_],ue=O,he=U;n.defined(P)&&n.defined(F)&&(ue=P[_],he=F[_]);for(var le=Number.POSITIVE_INFINITY,ge=Number.NEGATIVE_INFINITY,pe=Number.POSITIVE_INFINITY,be=Number.NEGATIVE_INFINITY,Ce=0;Ce<de;++Ce){var ye=a.Cartesian3.unpack(M,3*fe+3*Ce,I);B.scaleToGeodeticSurface(ye,ye);var Ie=(we=B.cartesianToCartographic(ye,A)).latitude,me=we.longitude,we=(le=Math.min(Ie,le),ge=Math.max(Ie,ge),pe=Math.min(me,pe),be=Math.max(me,be),B.geodeticSurfaceNormal(ye,m));Ie=a.Cartesian3.multiplyByScalar(we,ue,w),me=a.Cartesian3.add(ye,Ie,v),Ie=a.Cartesian3.multiplyByScalar(we,he,Ie),Ie=a.Cartesian3.add(ye,Ie,x);a.Cartesian3.subtract(Ie,k,Ie),a.Cartesian3.subtract(me,k,me),a.Cartesian3.pack(Ie,j,oe),a.Cartesian3.pack(me,j,oe+3),q[se]=ce,q[se+1]=ce,oe+=6,se+=2}(L=E).west=pe,L.east=be,L.south=le,L.north=ge,T[_]=o.OrientedBoundingBox.fromRectangle(L,O,U,B);var ve=te.indexOffset,xe=W[_],Ae=l[_];for(J[_]=ve,Ce=0;Ce<Ae;Ce+=3){var Ee=c[xe+Ce]-fe,Ne=c[xe+Ce+1]-fe,Te=c[xe+Ce+2]-fe;Q[ve++]=2*Ee+ie,Q[ve++]=2*Ne+ie,Q[ve++]=2*Te+ie,Q[ve++]=2*Te+1+ie,Q[ve++]=2*Ne+1+ie,Q[ve++]=2*Ee+1+ie}for(Ce=0;Ce<de;++Ce){var ke=Ce,Be=(Ce+1)%de;Q[ve++]=2*ke+1+ie,Q[ve++]=2*Be+ie,Q[ve++]=2*ke+ie,Q[ve++]=2*ke+1+ie,Q[ve++]=2*Be+1+ie,Q[ve++]=2*Be+ie}te.offset+=2*de,te.indexOffset=ve,K[_]=ve-J[_]}Q=t.IndexDatatype.createTypedArray(j.length/3,Q);for(var Le=re.length,Oe=0;Oe<Le;++Oe){for(var Ue=re[Oe].batchIds,Pe=0,Fe=Ue.length,Se=0;Se<Fe;++Se)Pe+=K[Ue[Se]];re[Oe].count=Pe}return u=function(e,a,n){var t=a.length,i=2+t*o.OrientedBoundingBox.packedLength+1+function(e){for(var a=e.length,n=0,t=0;t<a;++t)n+=r.Color.packedLength+3+e[t].batchIds.length;return n}(n),s=new Float64Array(i),f=0;s[f++]=e,s[f++]=t;for(var d=0;d<t;++d)o.OrientedBoundingBox.pack(a[d],s,f),f+=o.OrientedBoundingBox.packedLength;var c=n.length;s[f++]=c;for(var u=0;u<c;++u){var h=n[u];r.Color.pack(h.color,s,f),f+=r.Color.packedLength,s[f++]=h.offset,s[f++]=h.count;var l=h.batchIds,g=l.length;s[f++]=g;for(var p=0;p<g;++p)s[f++]=l[p]}return s}(2===Q.BYTES_PER_ELEMENT?t.IndexDatatype.UNSIGNED_SHORT:t.IndexDatatype.UNSIGNED_INT,T,re),f.push(j.buffer,Q.buffer,J.buffer,K.buffer,q.buffer,u.buffer),{positions:j.buffer,indices:Q.buffer,indexOffsets:J.buffer,indexCounts:K.buffer,batchIds:q.buffer,packedBuffer:u.buffer}}))}));