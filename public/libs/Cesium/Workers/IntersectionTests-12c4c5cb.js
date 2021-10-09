define(["exports","./Cartesian2-c2e87f25","./when-a8daa614","./Check-3a7033c5","./Transforms-d7f8120c","./Math-9c4212b4"],(function(a,t,e,r,n,i){"use strict";var s={};function o(a,t,e){var r=a+t;return i.CesiumMath.sign(a)!==i.CesiumMath.sign(t)&&Math.abs(r/Math.max(Math.abs(a),Math.abs(t)))<e?0:r}s.computeDiscriminant=function(a,t,e){return t*t-4*a*e},s.computeRealRoots=function(a,t,e){if(0===a)return 0===t?[]:[-e/t];if(0===t){if(0===e)return[0,0];var r=Math.abs(e),n=Math.abs(a);return r<n&&r/n<i.CesiumMath.EPSILON14?[0,0]:n<r&&n/r<i.CesiumMath.EPSILON14||(n=-e/a)<0?[]:[-(r=Math.sqrt(n)),r]}return 0===e?(n=-t/a)<0?[n,0]:[0,n]:(n=o(t*t,-4*a*e,i.CesiumMath.EPSILON14))<0?[]:(n=-.5*o(t,i.CesiumMath.sign(t)*Math.sqrt(n),i.CesiumMath.EPSILON14),0<t?[n/a,e/n]:[e/n,n/a])};var u={};function C(a,t,e,r){var n=t/3,i=e/3,s=(d=a)*i,o=n*(c=r);if((e=4*(m=d*i-(M=n*n))*(t=n*c-(h=i*i))-(a=d*c-n*i)*a)<0){r=s*h<=M*o?-2*n*(l=m)+(u=d)*a:-(u=c)*a+2*i*(l=t);var u=(u=(f=(C=-(r<0?-1:1)*Math.abs(u)*Math.sqrt(-e))-r)/2)<0?-Math.pow(-u,1/3):Math.pow(u,1/3),C=f===C?-u:-l/u;C=l<=0?u+C:-r/(u*u+C*C+l);return s*h<=M*o?[(C-n)/d]:[-c/(C+i)]}var c,l=m,h=(s=-2*n*m+d*a,t),M=-c*a+2*i*t,m=(o=Math.sqrt(e),Math.sqrt(3)/2),d=(a=Math.abs(Math.atan2(d*o,-s)/3),(s=2*n<(f=(C=2*Math.sqrt(-l))*(t=Math.cos(a)))+(e=C*(-t/2-m*Math.sin(a)))?f-n:e-n)/(l=d)),f=(a=Math.abs(Math.atan2(c*o,-M)/3),(c=-c)/(a=(f=(C=2*Math.sqrt(-h))*(t=Math.cos(a)))+(e=C*(-t/2-m*Math.sin(a)))<2*i?f+i:e+i));return d<=(a=(i*(e=-s*a-l*c)-n*(s*c))/(-n*e+i*(l*a)))?d<=f?a<=f?[d,a,f]:[d,f,a]:[f,d,a]:d<=f?[a,d,f]:a<=f?[a,f,d]:[f,a,d]}u.computeDiscriminant=function(a,t,e,r){var n=t*t,i=e*e;return 18*a*t*e*r+n*i-a*a*27*(r*r)-4*(a*i*e+n*t*r)},u.computeRealRoots=function(a,t,e,r){var n;if(0===a)return s.computeRealRoots(t,e,r);if(0!==t)return 0===e?0===r?(i=-t/a)<0?[i,0,0]:[0,0,i]:C(a,t,0,r):0===r?0===(n=s.computeRealRoots(a,t,e)).length?[0]:n[1]<=0?[n[0],n[1],0]:0<=n[0]?[0,n[0],n[1]]:[n[0],0,n[1]]:C(a,t,e,r);if(0!==e)return 0===r?0===(n=s.computeRealRoots(a,0,e)).Length?[0]:[n[0],0,n[1]]:C(a,0,e,r);if(0===r)return[0,0,0];var i=(i=-r/a)<0?-Math.pow(-i,1/3):Math.pow(i,1/3);return[i,i,i]};var c={};function l(a,t,e,r){var n=a*a,o=t-3*n/8,C=e-t*a/2+n*a/8;r=r-e*a/4+t*n/16-3*n*n/256;if(0<(e=u.computeRealRoots(1,2*o,o*o-4*r,-C*C)).length){if(t=-a/4,n=e[e.length-1],Math.abs(n)<i.CesiumMath.EPSILON14){if(2===(a=s.computeRealRoots(1,o,r)).length){e=a[0];var c=a[1];if(0<=e&&0<=c)return r=Math.sqrt(e),[t-(a=Math.sqrt(c)),t-r,t+r,t+a];if(0<=e&&c<0)return[t-(l=Math.sqrt(e)),t+l];if(e<0&&0<=c)return[t-(l=Math.sqrt(c)),t+l]}return[]}if(0<n){var l=(o+n+C/(c=Math.sqrt(n)))/2;C=s.computeRealRoots(1,c,(o+n-C/c)/2),l=s.computeRealRoots(1,-c,l);return 0!==C.length?(C[0]+=t,C[1]+=t,0!==l.length?(l[0]+=t,l[1]+=t,C[1]<=l[0]?[C[0],C[1],l[0],l[1]]:l[1]<=C[0]?[l[0],l[1],C[0],C[1]]:C[0]>=l[0]&&C[1]<=l[1]?[l[0],C[0],C[1],l[1]]:l[0]>=C[0]&&l[1]<=C[1]?[C[0],l[0],l[1],C[1]]:C[0]>l[0]&&C[0]<l[1]?[l[0],C[0],l[1],C[1]]:[C[0],l[0],C[1],l[1]]):C):0!==l.length?(l[0]+=t,l[1]+=t,l):[]}}return[]}function h(a,t,e,r){var n=a*a;if(0<(m=u.computeRealRoots(1,-2*t,e*a+t*t-4*r,n*r-e*t*a+e*e)).length){var o,C,c,l,h=m[0],M=a/2,m=(d=t-h)/2,d=(t=(f=d*d)-4*r,f+4*Math.abs(r)),f=n-4*h;n=n+4*Math.abs(h);C=h<0||t*n<f*d?(o=(f=Math.sqrt(f))/2,0===f?0:(a*m-e)/f):(o=0===(C=Math.sqrt(t))?0:(a*m-e)/C,C/2),0==M&&0===o?l=c=0:i.CesiumMath.sign(M)===i.CesiumMath.sign(o)?l=h/(c=M+o):c=h/(l=M-o),0==m&&0===C?p=g=0:i.CesiumMath.sign(m)===i.CesiumMath.sign(C)?p=r/(g=m+C):g=r/(p=m-C);var g=s.computeRealRoots(1,c,g),p=s.computeRealRoots(1,l,p);if(0!==g.length)return 0!==p.length?g[1]<=p[0]?[g[0],g[1],p[0],p[1]]:p[1]<=g[0]?[p[0],p[1],g[0],g[1]]:g[0]>=p[0]&&g[1]<=p[1]?[p[0],g[0],g[1],p[1]]:p[0]>=g[0]&&p[1]<=g[1]?[g[0],p[0],p[1],g[1]]:g[0]>p[0]&&g[0]<p[1]?[p[0],g[0],p[1],g[1]]:[g[0],p[0],g[1],p[1]]:g;if(0!==p.length)return p}return[]}function M(a,r){r=t.Cartesian3.clone(e.defaultValue(r,t.Cartesian3.ZERO)),t.Cartesian3.equals(r,t.Cartesian3.ZERO)||t.Cartesian3.normalize(r,r),this.origin=t.Cartesian3.clone(e.defaultValue(a,t.Cartesian3.ZERO)),this.direction=r}c.computeDiscriminant=function(a,t,e,r,n){var i=a*a,s=t*t,o=s*t,u=e*e,C=u*e,c=r*r,l=c*r,h=n*n;return s*u*c-4*o*l-4*a*C*c+18*a*t*e*l-27*i*c*c+i*a*256*(h*n)+n*(18*o*e*r-4*s*C+16*a*u*u-80*a*t*u*r-6*a*s*c+144*i*e*c)+h*(144*a*s*e-27*s*s-128*i*u-192*i*t*r)},c.computeRealRoots=function(a,t,e,r,n){if(Math.abs(a)<i.CesiumMath.EPSILON15)return u.computeRealRoots(t,e,r,n);var s=t/a,o=e/a,C=r/a,c=n/a;a=s<0?1:0;switch(a+=o<0?a+1:a,a+=C<0?a+1:a,a+=c<0?a+1:a){case 0:case 3:case 4:case 6:case 7:case 9:case 10:case 12:case 13:case 14:case 15:return l(s,o,C,c);case 1:case 2:case 5:case 8:case 11:return h(s,o,C,c);default:return}},M.clone=function(a,r){if(e.defined(a))return e.defined(r)?(r.origin=t.Cartesian3.clone(a.origin),r.direction=t.Cartesian3.clone(a.direction),r):new M(a.origin,a.direction)},M.getPoint=function(a,r,n){return e.defined(n)||(n=new t.Cartesian3),n=t.Cartesian3.multiplyByScalar(a.direction,r,n),t.Cartesian3.add(a.origin,n,n)};var m={rayPlane:function(a,r,n){e.defined(n)||(n=new t.Cartesian3);var s=a.origin,o=a.direction,u=r.normal;a=t.Cartesian3.dot(u,o);if(!(Math.abs(a)<i.CesiumMath.EPSILON15)&&!((a=(-r.distance-t.Cartesian3.dot(u,s))/a)<0))return n=t.Cartesian3.multiplyByScalar(o,a,n),t.Cartesian3.add(s,n,n)}},d=new t.Cartesian3,f=new t.Cartesian3,g=new t.Cartesian3,p=new t.Cartesian3,v=new t.Cartesian3;m.rayTriangleParametric=function(a,r,n,s,o){o=e.defaultValue(o,!1);var u,C,c,l=a.origin,h=a.direction,M=t.Cartesian3.subtract(n,r,d);a=t.Cartesian3.subtract(s,r,f),n=t.Cartesian3.cross(h,a,g),s=t.Cartesian3.dot(M,n);if(o){if(s<i.CesiumMath.EPSILON6)return;if(w=t.Cartesian3.subtract(l,r,p),(m=t.Cartesian3.dot(w,n))<0||s<m)return;if(u=t.Cartesian3.cross(w,M,v),(C=t.Cartesian3.dot(h,u))<0||s<m+C)return;c=t.Cartesian3.dot(a,u)/s}else{if(Math.abs(s)<i.CesiumMath.EPSILON6)return;s=1/s;var m,w=t.Cartesian3.subtract(l,r,p);if((m=t.Cartesian3.dot(w,n)*s)<0||1<m)return;if(u=t.Cartesian3.cross(w,M,v),(C=t.Cartesian3.dot(h,u)*s)<0||1<m+C)return;c=t.Cartesian3.dot(a,u)*s}return c},m.rayTriangle=function(a,r,n,i,s,o){if(s=m.rayTriangleParametric(a,r,n,i,s),e.defined(s)&&!(s<0))return e.defined(o)||(o=new t.Cartesian3),t.Cartesian3.multiplyByScalar(a.direction,s,o),t.Cartesian3.add(a.origin,o,o)};var w=new M;m.lineSegmentTriangle=function(a,r,n,i,s,o,u){var C=w;if(t.Cartesian3.clone(a,C.origin),t.Cartesian3.subtract(r,a,C.direction),t.Cartesian3.normalize(C.direction,C.direction),o=m.rayTriangleParametric(C,n,i,s,o),!(!e.defined(o)||o<0||o>t.Cartesian3.distance(a,r)))return e.defined(u)||(u=new t.Cartesian3),t.Cartesian3.multiplyByScalar(C.direction,o,u),t.Cartesian3.add(C.origin,u,u)};var R={root0:0,root1:0};function S(a,r,i){e.defined(i)||(i=new n.Interval);var s=a.origin,o=a.direction;a=r.center,r=r.radius*r.radius,a=t.Cartesian3.subtract(s,a,g),r=function(a,t,e,r){if(!((i=t*t-4*a*e)<0)){if(0<i){var n=1/(2*a),i=(-t+(e=Math.sqrt(i)))*n;return i<(n=(-t-e)*n)?(r.root0=i,r.root1=n):(r.root0=n,r.root1=i),r}if(0!=(a=-t/(2*a)))return r.root0=r.root1=a,r}}(t.Cartesian3.dot(o,o),2*t.Cartesian3.dot(o,a),t.Cartesian3.magnitudeSquared(a)-r,R);if(e.defined(r))return i.start=r.root0,i.stop=r.root1,i}m.raySphere=function(a,t,r){if(r=S(a,t,r),e.defined(r)&&!(r.stop<0))return r.start=Math.max(r.start,0),r};var O=new M;m.lineSegmentSphere=function(a,r,n,i){var s=O;if(t.Cartesian3.clone(a,s.origin),r=t.Cartesian3.subtract(r,a,s.direction),a=t.Cartesian3.magnitude(r),t.Cartesian3.normalize(r,r),i=S(s,n,i),!(!e.defined(i)||i.stop<0||i.start>a))return i.start=Math.max(i.start,0),i.stop=Math.min(i.stop,a),i};var x=new t.Cartesian3,y=new t.Cartesian3;function P(a,t,e){var r=a+t;return i.CesiumMath.sign(a)!==i.CesiumMath.sign(t)&&Math.abs(r/Math.max(Math.abs(a),Math.abs(t)))<e?0:r}m.rayEllipsoid=function(a,e){var r=e.oneOverRadii,i=t.Cartesian3.multiplyComponents(r,a.origin,x);e=t.Cartesian3.multiplyComponents(r,a.direction,y),r=t.Cartesian3.magnitudeSquared(i),a=t.Cartesian3.dot(i,e);if(1<r){if(0<=a)return;var s,o,u=r-1;if((i=a*a)<(o=(s=t.Cartesian3.magnitudeSquared(e))*u))return;if(o<i){var C,c=a*a-o,l=(C=-a+Math.sqrt(c))/s;return l<(i=u/C)?new n.Interval(l,i):{start:i,stop:l}}return l=Math.sqrt(u/s),new n.Interval(l,l)}return r<1?(u=r-1,c=a*a-(o=(s=t.Cartesian3.magnitudeSquared(e))*u),C=-a+Math.sqrt(c),new n.Interval(0,C/s)):a<0?(s=t.Cartesian3.magnitudeSquared(e),new n.Interval(0,-a/s)):void 0};var N=new t.Cartesian3,b=new t.Cartesian3,q=new t.Cartesian3,L=new t.Cartesian3,I=new t.Cartesian3,E=new n.Matrix3,z=new n.Matrix3,T=new n.Matrix3,U=new n.Matrix3,W=new n.Matrix3,B=new n.Matrix3,V=new n.Matrix3,Z=new t.Cartesian3,A=new t.Cartesian3,D=new t.Cartographic;m.grazingAltitudeLocation=function(a,r){var o=a.origin,u=a.direction;if(!t.Cartesian3.equals(o,t.Cartesian3.ZERO)){var C=r.geodeticSurfaceNormal(o,N);if(0<=t.Cartesian3.dot(u,C))return o}var l=e.defined(this.rayEllipsoid(a,r)),h=r.transformPositionToScaledSpace(u,N),M=(C=t.Cartesian3.normalize(h,h),a=t.Cartesian3.mostOrthogonalAxis(h,L),h=t.Cartesian3.normalize(t.Cartesian3.cross(a,C,b),b),a=t.Cartesian3.normalize(t.Cartesian3.cross(C,h,q),q),E);M[0]=C.x,M[1]=C.y,M[2]=C.z,M[3]=h.x,M[4]=h.y,M[5]=h.z,M[6]=a.x,M[7]=a.y,M[8]=a.z;C=n.Matrix3.transpose(M,z);var m=n.Matrix3.fromScale(r.radii,T);h=n.Matrix3.fromScale(r.oneOverRadii,U);(a=W)[0]=0,a[1]=-u.z,a[2]=u.y,a[3]=u.z,a[4]=0,a[5]=-u.x,a[6]=-u.y,a[7]=u.x,a[8]=0;h=n.Matrix3.multiply(n.Matrix3.multiply(C,h,B),a,B),a=n.Matrix3.multiply(n.Matrix3.multiply(h,m,V),M,V),h=n.Matrix3.multiplyByVector(h,o,I);var d=function(a,e,r,o,u){var C=1*(a[n.Matrix3.COLUMN1ROW1]-a[n.Matrix3.COLUMN2ROW2]),l=1*(0*P(a[n.Matrix3.COLUMN1ROW0],a[n.Matrix3.COLUMN0ROW1],i.CesiumMath.EPSILON15)+e.y),h=0*a[n.Matrix3.COLUMN0ROW0]+1*a[n.Matrix3.COLUMN2ROW2]+0*e.x+0,M=1*P(a[n.Matrix3.COLUMN2ROW1],a[n.Matrix3.COLUMN1ROW2],i.CesiumMath.EPSILON15),m=1*(0*P(a[n.Matrix3.COLUMN2ROW0],a[n.Matrix3.COLUMN0ROW2])+e.z),d=[];if(0==m&&0==M){if(0===(w=s.computeRealRoots(C,l,h)).length)return d;var f=w[0],g=Math.sqrt(Math.max(1-f*f,0));return d.push(new t.Cartesian3(0,1*f,1*-g)),d.push(new t.Cartesian3(0,1*f,1*g)),2===w.length&&(p=w[1],v=Math.sqrt(Math.max(1-p*p,0)),d.push(new t.Cartesian3(0,1*p,1*-v)),d.push(new t.Cartesian3(0,1*p,1*v))),d}var p=C*C+(f=M*M),v=2*(l*C+(g=m*M));f=2*h*C+l*l-f+(e=m*m),g=2*(h*l-g);if(0==p&&0==v&&0==f&&0==g)return d;var w,R=(w=c.computeRealRoots(p,v,f,g,h*h-e)).length;if(0===R)return d;for(var S=0;S<R;++S){var O=w[S],x=O*O,y=Math.max(1-x,0);y=Math.sqrt(y);(x=(x=i.CesiumMath.sign(C)===i.CesiumMath.sign(h)?P(C*x+h,l*O,i.CesiumMath.EPSILON12):i.CesiumMath.sign(h)===i.CesiumMath.sign(l*O)?P(C*x,l*O+h,i.CesiumMath.EPSILON12):P(C*x+l*O,h,i.CesiumMath.EPSILON12))*P(M*O,m,i.CesiumMath.EPSILON15))<0?d.push(new t.Cartesian3(0,1*O,1*y)):0<x?d.push(new t.Cartesian3(0,1*O,1*-y)):0!==y?(d.push(new t.Cartesian3(0,1*O,1*-y)),d.push(new t.Cartesian3(0,1*O,1*y)),++S):d.push(new t.Cartesian3(0,1*O,1*y))}return d}(a,t.Cartesian3.negate(h,N)),f=d.length;if(0<f){for(var g=t.Cartesian3.clone(t.Cartesian3.ZERO,A),p=Number.NEGATIVE_INFINITY,v=0;v<f;++v){var w=n.Matrix3.multiplyByVector(m,n.Matrix3.multiplyByVector(M,d[v],Z),Z),R=t.Cartesian3.normalize(t.Cartesian3.subtract(w,o,L),L);p<(R=t.Cartesian3.dot(R,u))&&(p=R,g=t.Cartesian3.clone(w,g))}return a=r.cartesianToCartographic(g,D),p=i.CesiumMath.clamp(p,0,1),h=t.Cartesian3.magnitude(t.Cartesian3.subtract(g,o,L))*Math.sqrt(1-p*p),a.height=h=l?-h:h,r.cartographicToCartesian(a,new t.Cartesian3)}};var k=new t.Cartesian3;m.lineSegmentPlane=function(a,r,n,s){e.defined(s)||(s=new t.Cartesian3);var o=t.Cartesian3.subtract(r,a,k),u=n.normal;r=t.Cartesian3.dot(u,o);if(!(Math.abs(r)<i.CesiumMath.EPSILON6)&&(u=t.Cartesian3.dot(u,a),!((r=-(n.distance+u)/r)<0||1<r)))return t.Cartesian3.multiplyByScalar(o,r,s),t.Cartesian3.add(a,s,s),s},m.trianglePlaneIntersection=function(a,e,r,n){var i,s,o=n.normal,u=n.distance,C=t.Cartesian3.dot(o,a)+u<0,c=t.Cartesian3.dot(o,e)+u<0;o=t.Cartesian3.dot(o,r)+u<0,u=0;if(u+=C?1:0,u+=c?1:0,1!=(u+=o?1:0)&&2!=u||(i=new t.Cartesian3,s=new t.Cartesian3),1==u){if(C)return m.lineSegmentPlane(a,e,n,i),m.lineSegmentPlane(a,r,n,s),{positions:[a,e,r,i,s],indices:[0,3,4,1,2,4,1,4,3]};if(c)return m.lineSegmentPlane(e,r,n,i),m.lineSegmentPlane(e,a,n,s),{positions:[a,e,r,i,s],indices:[1,3,4,2,0,4,2,4,3]};if(o)return m.lineSegmentPlane(r,a,n,i),m.lineSegmentPlane(r,e,n,s),{positions:[a,e,r,i,s],indices:[2,3,4,0,1,4,0,4,3]}}else if(2==u){if(!C)return m.lineSegmentPlane(e,a,n,i),m.lineSegmentPlane(r,a,n,s),{positions:[a,e,r,i,s],indices:[1,2,4,1,4,3,0,3,4]};if(!c)return m.lineSegmentPlane(r,e,n,i),m.lineSegmentPlane(a,e,n,s),{positions:[a,e,r,i,s],indices:[2,0,4,2,4,3,1,3,4]};if(!o)return m.lineSegmentPlane(a,r,n,i),m.lineSegmentPlane(e,r,n,s),{positions:[a,e,r,i,s],indices:[0,1,4,0,4,3,2,3,4]}}},a.IntersectionTests=m,a.Ray=M}));