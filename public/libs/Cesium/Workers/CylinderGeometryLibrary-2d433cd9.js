define(["exports","./Math-dd0eccae"],(function(r,t){"use strict";var e={computePositions:function(r,e,a,i,n){for(var o=.5*r,s=-o,c=(r=i+i,new Float64Array(3*(n?2*r:r))),u=0,d=0,f=n?3*r:0,h=n?3*(r+i):3*i,y=0;y<i;y++){var M=y/i*t.CesiumMath.TWO_PI,m=(v=Math.cos(M))*a,v=(M=(l=Math.sin(M))*a,v*e),l=l*e;c[d+f]=m,c[d+f+1]=M,c[d+f+2]=s,c[d+h]=v,c[d+h+1]=l,c[d+h+2]=o,d+=3,n&&(c[u++]=m,c[u++]=M,c[u++]=s,c[u++]=v,c[u++]=l,c[u++]=o)}return c}};r.CylinderGeometryLibrary=e}));