define(["exports","./Check-3a7033c5","./when-a8daa614"],(function(e,t,a){"use strict";var f=Object.freeze({NONE:0,TOP:1,ALL:2});e.GeometryOffsetAttribute=f,e.arrayFill=function(e,t,f,r){if("function"==typeof e.fill)return e.fill(t,f,r);for(var n=e.length>>>0,i=(f=a.defaultValue(f,0))<0?Math.max(n+f,0):Math.min(f,n),l=(r=a.defaultValue(r,n))<0?Math.max(n+r,0):Math.min(r,n);i<l;)e[i]=t,i++;return e}}));