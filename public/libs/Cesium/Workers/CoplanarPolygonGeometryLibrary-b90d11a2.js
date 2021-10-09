define(["exports","./Cartesian2-f08aba2b","./Check-59cd0530","./Transforms-450da373","./OrientedBoundingBox-238d5080"],(function(n,t,e,r,a){"use strict";var i={},o=new t.Cartesian3,u=new t.Cartesian3,s=new t.Cartesian3,C=new t.Cartesian3,m=new a.OrientedBoundingBox;function c(n,e,r,a,i){return e=t.Cartesian3.subtract(n,e,o),r=t.Cartesian3.dot(r,e),e=t.Cartesian3.dot(a,e),t.Cartesian2.fromElements(r,e,i)}i.validOutline=function(n){var e=a.OrientedBoundingBox.fromPoints(n,m).halfAxes,i=r.Matrix3.getColumn(e,0,u);n=r.Matrix3.getColumn(e,1,s),e=r.Matrix3.getColumn(e,2,C),i=t.Cartesian3.magnitude(i),n=t.Cartesian3.magnitude(n),e=t.Cartesian3.magnitude(e);return!(0===i&&(0===n||0===e)||0===n&&0===e)},i.computeProjectTo2DArguments=function(n,e,i,o){var c,d,g=a.OrientedBoundingBox.fromPoints(n,m),l=g.halfAxes,f=r.Matrix3.getColumn(l,0,u),x=r.Matrix3.getColumn(l,1,s),B=r.Matrix3.getColumn(l,2,C),P=t.Cartesian3.magnitude(f),M=t.Cartesian3.magnitude(x);n=t.Cartesian3.magnitude(B),l=Math.min(P,M,n);return(0!==P||0!==M&&0!==n)&&(0!==M||0!==n)&&(l!==M&&l!==n||(c=f),l===P?c=x:l===n&&(d=x),l!==P&&l!==M||(d=B),t.Cartesian3.normalize(c,i),t.Cartesian3.normalize(d,o),t.Cartesian3.clone(g.center,e),!0)},i.createProjectPointsTo2DFunction=function(n,t,e){return function(r){for(var a=new Array(r.length),i=0;i<r.length;i++)a[i]=c(r[i],n,t,e);return a}},i.createProjectPointTo2DFunction=function(n,t,e){return function(r,a){return c(r,n,t,e,a)}},n.CoplanarPolygonGeometryLibrary=i}));