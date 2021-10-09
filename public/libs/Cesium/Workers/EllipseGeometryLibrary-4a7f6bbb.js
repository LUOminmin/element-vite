define(["exports","./Cartesian2-c2e87f25","./Math-9c4212b4","./Transforms-d7f8120c"],(function(a,e,r,t){"use strict";var i={},n=new e.Cartesian3,s=new e.Cartesian3,o=new t.Quaternion,l=new t.Matrix3;function C(a,r,i,C,y,u,c,m,h,x){return r=a+r,e.Cartesian3.multiplyByScalar(C,Math.cos(r),n),e.Cartesian3.multiplyByScalar(i,Math.sin(r),s),e.Cartesian3.add(n,s,n),r=Math.cos(a),r*=r,a=Math.sin(a),a*=a,a=u/Math.sqrt(c*r+y*a),t.Quaternion.fromAxisAngle(n,a/m,o),t.Matrix3.fromQuaternion(o,l),t.Matrix3.multiplyByVector(l,h,x),e.Cartesian3.normalize(x,x),e.Cartesian3.multiplyByScalar(x,m,x),x}var y=new e.Cartesian3,u=new e.Cartesian3,c=new e.Cartesian3,m=new e.Cartesian3;i.raisePositionsToHeight=function(a,r,t){for(var i=r.ellipsoid,n=r.height,s=r.extrudedHeight,o=(r=t?a.length/3*2:a.length/3,new Float64Array(3*r)),l=a.length,C=t?l:0,h=0;h<l;h+=3){var x=h+1,M=h+2,f=e.Cartesian3.fromArray(a,h,y);i.scaleToGeodeticSurface(f,f);var z=e.Cartesian3.clone(f,u),_=i.geodeticSurfaceNormal(f,m),d=e.Cartesian3.multiplyByScalar(_,n,c);e.Cartesian3.add(f,d,f),t&&(e.Cartesian3.multiplyByScalar(_,s,d),e.Cartesian3.add(z,d,z),o[h+C]=z.x,o[x+C]=z.y,o[M+C]=z.z),o[h]=f.x,o[x]=f.y,o[M]=f.z}return o};var h=new e.Cartesian3,x=new e.Cartesian3,M=new e.Cartesian3;i.computeEllipsePositions=function(a,t,i){var n=a.semiMinorAxis,s=a.semiMajorAxis,o=a.rotation,l=a.center,m=(a=8*a.granularity,n*n),f=s*s,z=s*n,_=e.Cartesian3.magnitude(l),d=e.Cartesian3.normalize(l,h),O=e.Cartesian3.cross(e.Cartesian3.UNIT_Z,l,x),p=(O=e.Cartesian3.normalize(O,O),e.Cartesian3.cross(d,O,M)),w=1+Math.ceil(r.CesiumMath.PI_OVER_TWO/a),P=r.CesiumMath.PI_OVER_TWO/(w-1),T=r.CesiumMath.PI_OVER_TWO-w*P;T<0&&(w-=Math.ceil(Math.abs(T)/P));var I,g,v,E,V=t?new Array(w*(w+2)*2*3):void 0,A=0,R=y,W=u,S=(a=4*w*3)-1,B=0,b=i?new Array(a):void 0;R=C(T=r.CesiumMath.PI_OVER_TWO,o,p,O,m,z,f,_,d,R);for(t&&(V[A++]=R.x,V[A++]=R.y,V[A++]=R.z),i&&(b[S--]=R.z,b[S--]=R.y,b[S--]=R.x),T=r.CesiumMath.PI_OVER_TWO-P,I=1;I<w+1;++I){if(R=C(T,o,p,O,m,z,f,_,d,R),W=C(Math.PI-T,o,p,O,m,z,f,_,d,W),t){for(V[A++]=R.x,V[A++]=R.y,V[A++]=R.z,v=2*I+2,g=1;g<v-1;++g)E=e.Cartesian3.lerp(R,W,g/(v-1),c),V[A++]=E.x,V[A++]=E.y,V[A++]=E.z;V[A++]=W.x,V[A++]=W.y,V[A++]=W.z}i&&(b[S--]=R.z,b[S--]=R.y,b[S--]=R.x,b[B++]=W.x,b[B++]=W.y,b[B++]=W.z),T=r.CesiumMath.PI_OVER_TWO-(I+1)*P}for(I=w;1<I;--I){if(R=C(-(T=r.CesiumMath.PI_OVER_TWO-(I-1)*P),o,p,O,m,z,f,_,d,R),W=C(T+Math.PI,o,p,O,m,z,f,_,d,W),t){for(V[A++]=R.x,V[A++]=R.y,V[A++]=R.z,v=2*(I-1)+2,g=1;g<v-1;++g)E=e.Cartesian3.lerp(R,W,g/(v-1),c),V[A++]=E.x,V[A++]=E.y,V[A++]=E.z;V[A++]=W.x,V[A++]=W.y,V[A++]=W.z}i&&(b[S--]=R.z,b[S--]=R.y,b[S--]=R.x,b[B++]=W.x,b[B++]=W.y,b[B++]=W.z)}return R=C(-(T=r.CesiumMath.PI_OVER_TWO),o,p,O,m,z,f,_,d,R),a={},t&&(V[A++]=R.x,V[A++]=R.y,V[A++]=R.z,a.positions=V,a.numPts=w),i&&(b[S--]=R.z,b[S--]=R.y,b[S--]=R.x,a.outerPositions=b),a},a.EllipseGeometryLibrary=i}));