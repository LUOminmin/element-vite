define(["./Cartesian2-c2e87f25","./AttributeCompression-9d280301","./Math-9c4212b4","./IndexDatatype-6ac58125","./createTaskProcessorWorker","./Check-3a7033c5","./when-a8daa614","./WebGLConstants-18e33079"],(function(a,e,r,n,t,i,s,u){"use strict";var c=32767,o=new a.Cartographic,p=new a.Cartesian3,f=new a.Rectangle,C=new a.Ellipsoid,d=new a.Cartesian3,b={min:void 0,max:void 0},w=new a.Cartesian3,h=new a.Cartesian3,l=new a.Cartesian3,y=new a.Cartesian3,k=new a.Cartesian3;return t((function(t,i){var s=new Uint16Array(t.positions),u=new Uint16Array(t.widths),v=new Uint32Array(t.counts),A=new Uint16Array(t.batchIds);!function(e){e=new Float64Array(e);var r=0;b.min=e[r++],b.max=e[r++],a.Rectangle.unpack(e,2,f),r+=a.Rectangle.packedLength,a.Ellipsoid.unpack(e,r,C),r+=a.Ellipsoid.packedLength,a.Cartesian3.unpack(e,r,d)}(t.packedBuffer);for(var g=d,m=function(n,t,i,s,u){var f=n.length/3,C=n.subarray(0,f),d=n.subarray(f,2*f),b=n.subarray(2*f,3*f);e.AttributeCompression.zigZagDeltaDecode(C,d,b);for(var w=new Float64Array(n.length),h=0;h<f;++h){var l=C[h],y=d[h],k=b[h];l=r.CesiumMath.lerp(t.west,t.east,l/c),y=r.CesiumMath.lerp(t.south,t.north,y/c),k=r.CesiumMath.lerp(i,s,k/c),k=a.Cartographic.fromRadians(l,y,k,o),k=u.cartographicToCartesian(k,p);a.Cartesian3.pack(k,w,3*h)}return w}(s,f,b.min,b.max,C),x=(s=4*(t=m.length/3)-4,new Float32Array(3*s)),E=new Float32Array(3*s),D=new Float32Array(3*s),I=new Float32Array(2*s),T=new Uint16Array(s),U=0,F=0,N=0,R=0,M=v.length,P=0;P<M;++P){for(var L,S=v[P],_=u[P],G=A[P],W=0;W<S;++W){0===W?(z=a.Cartesian3.unpack(m,3*R,w),B=a.Cartesian3.unpack(m,3*(R+1),h),L=a.Cartesian3.subtract(z,B,l),a.Cartesian3.add(z,L,L)):L=a.Cartesian3.unpack(m,3*(R+W-1),l);var B,z,H,O=a.Cartesian3.unpack(m,3*(R+W),y);W===S-1?(B=a.Cartesian3.unpack(m,3*(R+S-1),w),z=a.Cartesian3.unpack(m,3*(R+S-2),h),H=a.Cartesian3.subtract(B,z,k),a.Cartesian3.add(B,H,H)):H=a.Cartesian3.unpack(m,3*(R+W+1),k),a.Cartesian3.subtract(L,g,L),a.Cartesian3.subtract(O,g,O),a.Cartesian3.subtract(H,g,H);for(var Y=W===S-1?2:4,Z=0===W?2:0;Z<Y;++Z){a.Cartesian3.pack(O,x,U),a.Cartesian3.pack(L,E,U),a.Cartesian3.pack(H,D,U),U+=3;var j=Z-2<0?-1:1;I[F++]=Z%2*2-1,I[F++]=j*_,T[N++]=G}}R+=S}var q=n.IndexDatatype.createTypedArray(s,6*t-6),J=0,K=0;M=t-1;for(P=0;P<M;++P)q[K++]=J,q[K++]=J+2,q[K++]=J+1,q[K++]=J+1,q[K++]=J+2,q[K++]=J+3,J+=4;return i.push(x.buffer,E.buffer,D.buffer),i.push(I.buffer,T.buffer,q.buffer),{indexDatatype:2===q.BYTES_PER_ELEMENT?n.IndexDatatype.UNSIGNED_SHORT:n.IndexDatatype.UNSIGNED_INT,currentPositions:x.buffer,previousPositions:E.buffer,nextPositions:D.buffer,expandAndWidth:I.buffer,batchIds:T.buffer,indices:q.buffer}}))}));