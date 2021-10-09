define(["./when-a8daa614","./Transforms-d7f8120c","./Cartesian2-c2e87f25","./Check-3a7033c5","./ComponentDatatype-11643cbc","./GeometryAttribute-c85c47e3","./GeometryAttributes-1356486e","./VertexFormat-26951076","./Math-9c4212b4","./RuntimeError-3ea13d12","./WebGLConstants-18e33079"],(function(e,t,r,n,a,o,m,i,u,p,c){"use strict";function y(t){t=e.defaultValue(t,e.defaultValue.EMPTY_OBJECT),t=e.defaultValue(t.vertexFormat,i.VertexFormat.DEFAULT),this._vertexFormat=t,this._workerName="createPlaneGeometry"}y.packedLength=i.VertexFormat.packedLength,y.pack=function(t,r,n){return n=e.defaultValue(n,0),i.VertexFormat.pack(t._vertexFormat,r,n),r};var s=new i.VertexFormat,A={vertexFormat:s};y.unpack=function(t,r,n){return r=e.defaultValue(r,0),r=i.VertexFormat.unpack(t,r,s),e.defined(n)?(n._vertexFormat=i.VertexFormat.clone(r,n._vertexFormat),n):new y(A)};var l=new r.Cartesian3(-.5,-.5,0),F=new r.Cartesian3(.5,.5,0);return y.createGeometry=function(e){var n,i,u=e._vertexFormat,p=new m.GeometryAttributes;return u.position&&((e=new Float64Array(12))[0]=l.x,e[1]=l.y,e[2]=0,e[3]=F.x,e[4]=l.y,e[5]=0,e[6]=F.x,e[7]=F.y,e[8]=0,e[9]=l.x,e[10]=F.y,e[11]=0,p.position=new o.GeometryAttribute({componentDatatype:a.ComponentDatatype.DOUBLE,componentsPerAttribute:3,values:e}),u.normal&&((e=new Float32Array(12))[0]=0,e[1]=0,e[2]=1,e[3]=0,e[4]=0,e[5]=1,e[6]=0,e[7]=0,e[8]=1,e[9]=0,e[10]=0,e[11]=1,p.normal=new o.GeometryAttribute({componentDatatype:a.ComponentDatatype.FLOAT,componentsPerAttribute:3,values:e})),u.st&&((n=new Float32Array(8))[0]=0,n[1]=0,n[2]=1,n[3]=0,n[4]=1,n[5]=1,n[6]=0,n[7]=1,p.st=new o.GeometryAttribute({componentDatatype:a.ComponentDatatype.FLOAT,componentsPerAttribute:2,values:n})),u.tangent&&((n=new Float32Array(12))[0]=1,n[1]=0,n[2]=0,n[3]=1,n[4]=0,n[5]=0,n[6]=1,n[7]=0,n[8]=0,n[9]=1,n[10]=0,n[11]=0,p.tangent=new o.GeometryAttribute({componentDatatype:a.ComponentDatatype.FLOAT,componentsPerAttribute:3,values:n})),u.bitangent&&((i=new Float32Array(12))[0]=0,i[1]=1,i[2]=0,i[3]=0,i[4]=1,i[5]=0,i[6]=0,i[7]=1,i[8]=0,i[9]=0,i[10]=1,i[11]=0,p.bitangent=new o.GeometryAttribute({componentDatatype:a.ComponentDatatype.FLOAT,componentsPerAttribute:3,values:i})),(i=new Uint16Array(6))[0]=0,i[1]=1,i[2]=2,i[3]=0,i[4]=2,i[5]=3),new o.Geometry({attributes:p,indices:i,primitiveType:o.PrimitiveType.TRIANGLES,boundingSphere:new t.BoundingSphere(r.Cartesian3.ZERO,Math.sqrt(2))})},function(t,r){return e.defined(r)&&(t=y.unpack(t,r)),y.createGeometry(t)}}));