define(["exports","./Math-6e9be73a","./Cartesian2-e2daacf3","./Transforms-0f378919"],function(a,E,V,y){"use strict";var e={},u=new V.Cartesian3,m=new V.Cartesian3,c=new y.Quaternion,h=new y.Matrix3;function A(a,e,r,t,i,n,s,o,l,C){e=a+e;V.Cartesian3.multiplyByScalar(t,Math.cos(e),u),V.Cartesian3.multiplyByScalar(r,Math.sin(e),m),V.Cartesian3.add(u,m,u);e=Math.cos(a);e*=e;a=Math.sin(a);a*=a;a=n/Math.sqrt(s*e+i*a)/o;return y.Quaternion.fromAxisAngle(u,a,c),y.Matrix3.fromQuaternion(c,h),y.Matrix3.multiplyByVector(h,l,C),V.Cartesian3.normalize(C,C),V.Cartesian3.multiplyByScalar(C,o,C),C}var R=new V.Cartesian3,W=new V.Cartesian3,S=new V.Cartesian3,M=new V.Cartesian3;e.raisePositionsToHeight=function(a,e,r){for(var t=e.ellipsoid,i=e.height,n=e.extrudedHeight,e=r?a.length/3*2:a.length/3,s=new Float64Array(3*e),o=a.length,l=r?o:0,C=0;C<o;C+=3){var y=C+1,u=C+2,m=V.Cartesian3.fromArray(a,C,R);t.scaleToGeodeticSurface(m,m);var c=V.Cartesian3.clone(m,W),h=t.geodeticSurfaceNormal(m,M),x=V.Cartesian3.multiplyByScalar(h,i,S);V.Cartesian3.add(m,x,m),r&&(V.Cartesian3.multiplyByScalar(h,n,x),V.Cartesian3.add(c,x,c),s[C+l]=c.x,s[y+l]=c.y,s[u+l]=c.z),s[C]=m.x,s[y]=m.y,s[u]=m.z}return s};var B=new V.Cartesian3,b=new V.Cartesian3,Q=new V.Cartesian3;e.computeEllipsePositions=function(a,e,r){var t=a.semiMinorAxis,i=a.semiMajorAxis,n=a.rotation,s=a.center,a=8*a.granularity,o=t*t,l=i*i,C=i*t,y=V.Cartesian3.magnitude(s),u=V.Cartesian3.normalize(s,B),m=V.Cartesian3.cross(V.Cartesian3.UNIT_Z,s,b),m=V.Cartesian3.normalize(m,m),c=V.Cartesian3.cross(u,m,Q),h=1+Math.ceil(E.CesiumMath.PI_OVER_TWO/a),x=E.CesiumMath.PI_OVER_TWO/(h-1),M=E.CesiumMath.PI_OVER_TWO-h*x;M<0&&(h-=Math.ceil(Math.abs(M)/x));var f,z,_,d,O,p=e?new Array(3*(h*(h+2)*2)):void 0,w=0,P=R,T=W,a=4*h*3,I=a-1,g=0,v=r?new Array(a):void 0,P=A(M=E.CesiumMath.PI_OVER_TWO,n,c,m,o,C,l,y,u,P);for(e&&(p[w++]=P.x,p[w++]=P.y,p[w++]=P.z),r&&(v[I--]=P.z,v[I--]=P.y,v[I--]=P.x),M=E.CesiumMath.PI_OVER_TWO-x,f=1;f<h+1;++f){if(P=A(M,n,c,m,o,C,l,y,u,P),T=A(Math.PI-M,n,c,m,o,C,l,y,u,T),e){for(p[w++]=P.x,p[w++]=P.y,p[w++]=P.z,_=2*f+2,z=1;z<_-1;++z)d=z/(_-1),O=V.Cartesian3.lerp(P,T,d,S),p[w++]=O.x,p[w++]=O.y,p[w++]=O.z;p[w++]=T.x,p[w++]=T.y,p[w++]=T.z}r&&(v[I--]=P.z,v[I--]=P.y,v[I--]=P.x,v[g++]=T.x,v[g++]=T.y,v[g++]=T.z),M=E.CesiumMath.PI_OVER_TWO-(f+1)*x}for(f=h;1<f;--f){if(P=A(-(M=E.CesiumMath.PI_OVER_TWO-(f-1)*x),n,c,m,o,C,l,y,u,P),T=A(M+Math.PI,n,c,m,o,C,l,y,u,T),e){for(p[w++]=P.x,p[w++]=P.y,p[w++]=P.z,_=2*(f-1)+2,z=1;z<_-1;++z)d=z/(_-1),O=V.Cartesian3.lerp(P,T,d,S),p[w++]=O.x,p[w++]=O.y,p[w++]=O.z;p[w++]=T.x,p[w++]=T.y,p[w++]=T.z}r&&(v[I--]=P.z,v[I--]=P.y,v[I--]=P.x,v[g++]=T.x,v[g++]=T.y,v[g++]=T.z)}P=A(-(M=E.CesiumMath.PI_OVER_TWO),n,c,m,o,C,l,y,u,P);a={};return e&&(p[w++]=P.x,p[w++]=P.y,p[w++]=P.z,a.positions=p,a.numPts=h),r&&(v[I--]=P.z,v[I--]=P.y,v[I--]=P.x,a.outerPositions=v),a},a.EllipseGeometryLibrary=e});
