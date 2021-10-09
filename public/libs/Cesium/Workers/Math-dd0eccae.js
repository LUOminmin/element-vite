define(["exports","./Check-3a7033c5","./when-a8daa614"],(function(t,n,a){"use strict";function i(t){null==t&&(t=(new Date).getTime()),this.N=624,this.M=397,this.MATRIX_A=2567483615,this.UPPER_MASK=2147483648,this.LOWER_MASK=2147483647,this.mt=new Array(this.N),this.mti=this.N+1,this.init_genrand(t)}i.prototype.init_genrand=function(t){for(this.mt[0]=t>>>0,this.mti=1;this.mti<this.N;this.mti++)t=this.mt[this.mti-1]^this.mt[this.mti-1]>>>30,this.mt[this.mti]=(1812433253*((4294901760&t)>>>16)<<16)+1812433253*(65535&t)+this.mti,this.mt[this.mti]>>>=0},i.prototype.genrand_int32=function(){var t,n,a=new Array(0,this.MATRIX_A);if(this.mti>=this.N){for(this.mti==this.N+1&&this.init_genrand(5489),n=0;n<this.N-this.M;n++)t=this.mt[n]&this.UPPER_MASK|this.mt[n+1]&this.LOWER_MASK,this.mt[n]=this.mt[n+this.M]^t>>>1^a[1&t];for(;n<this.N-1;n++)t=this.mt[n]&this.UPPER_MASK|this.mt[n+1]&this.LOWER_MASK,this.mt[n]=this.mt[n+(this.M-this.N)]^t>>>1^a[1&t];t=this.mt[this.N-1]&this.UPPER_MASK|this.mt[0]&this.LOWER_MASK,this.mt[this.N-1]=this.mt[this.M-1]^t>>>1^a[1&t],this.mti=0}return t=this.mt[this.mti++],t^=t>>>11,t^=t<<7&2636928640,t^=t<<15&4022730752,(t^=t>>>18)>>>0},i.prototype.random=function(){return this.genrand_int32()*(1/4294967296)};var e={EPSILON1:.1,EPSILON2:.01,EPSILON3:.001,EPSILON4:1e-4,EPSILON5:1e-5,EPSILON6:1e-6,EPSILON7:1e-7,EPSILON8:1e-8,EPSILON9:1e-9,EPSILON10:1e-10,EPSILON11:1e-11,EPSILON12:1e-12,EPSILON13:1e-13,EPSILON14:1e-14,EPSILON15:1e-15,EPSILON16:1e-16,EPSILON17:1e-17,EPSILON18:1e-18,EPSILON19:1e-19,EPSILON20:1e-20,EPSILON21:1e-21,GRAVITATIONALPARAMETER:3986004418e5,SOLAR_RADIUS:6955e5,LUNAR_RADIUS:1737400,SIXTY_FOUR_KILOBYTES:65536,FOUR_GIGABYTES:4294967296};e.sign=a.defaultValue(Math.sign,(function(t){return 0===(t=+t)||t!=t?t:0<t?1:-1})),e.signNotZero=function(t){return t<0?-1:1},e.toSNorm=function(t,n){return n=a.defaultValue(n,255),Math.round((.5*e.clamp(t,-1,1)+.5)*n)},e.fromSNorm=function(t,n){return n=a.defaultValue(n,255),e.clamp(t,0,n)/n*2-1},e.normalize=function(t,n,a){return 0===(a=Math.max(a-n,0))?0:e.clamp((t-n)/a,0,1)},e.sinh=a.defaultValue(Math.sinh,(function(t){return(Math.exp(t)-Math.exp(-t))/2})),e.cosh=a.defaultValue(Math.cosh,(function(t){return(Math.exp(t)+Math.exp(-t))/2})),e.lerp=function(t,n,a){return(1-a)*t+a*n},e.PI=Math.PI,e.ONE_OVER_PI=1/Math.PI,e.PI_OVER_TWO=Math.PI/2,e.PI_OVER_THREE=Math.PI/3,e.PI_OVER_FOUR=Math.PI/4,e.PI_OVER_SIX=Math.PI/6,e.THREE_PI_OVER_TWO=3*Math.PI/2,e.TWO_PI=2*Math.PI,e.ONE_OVER_TWO_PI=1/(2*Math.PI),e.RADIANS_PER_DEGREE=Math.PI/180,e.DEGREES_PER_RADIAN=180/Math.PI,e.RADIANS_PER_ARCSECOND=e.RADIANS_PER_DEGREE/3600,e.toRadians=function(t){return t*e.RADIANS_PER_DEGREE},e.toDegrees=function(t){return t*e.DEGREES_PER_RADIAN},e.convertLongitudeRange=function(t){var n=e.TWO_PI;return(t=t-Math.floor(t/n)*n)<-Math.PI?t+n:t>=Math.PI?t-n:t},e.clampToLatitudeRange=function(t){return e.clamp(t,-1*e.PI_OVER_TWO,e.PI_OVER_TWO)},e.negativePiToPi=function(t){return e.zeroToTwoPi(t+e.PI)-e.PI},e.zeroToTwoPi=function(t){var n=e.mod(t,e.TWO_PI);return Math.abs(n)<e.EPSILON14&&Math.abs(t)>e.EPSILON14?e.TWO_PI:n},e.mod=function(t,n){return(t%n+n)%n},e.equalsEpsilon=function(t,n,i,e){i=a.defaultValue(i,0),e=a.defaultValue(e,i);var r=Math.abs(t-n);return r<=e||r<=i*Math.max(Math.abs(t),Math.abs(n))},e.lessThan=function(t,n,a){return t-n<-a},e.lessThanOrEquals=function(t,n,a){return t-n<a},e.greaterThan=function(t,n,a){return a<t-n},e.greaterThanOrEquals=function(t,n,a){return-a<t-n};var r=[1];e.factorial=function(t){var n=r.length;if(n<=t)for(var a=r[n-1],i=n;i<=t;i++){var e=a*i;r.push(e),a=e}return r[t]},e.incrementWrap=function(t,n,i){return i=a.defaultValue(i,0),n<++t?i:t},e.isPowerOfTwo=function(t){return 0!==t&&0==(t&t-1)},e.nextPowerOfTwo=function(t){return--t,t|=t>>1,t|=t>>2,t|=t>>4,t|=t>>8,t|=t>>16,++t},e.clamp=function(t,n,a){return t<n?n:a<t?a:t};var h=new i;e.setRandomNumberSeed=function(t){h=new i(t)},e.nextRandomNumber=function(){return h.random()},e.randomBetween=function(t,n){return e.nextRandomNumber()*(n-t)+t},e.acosClamped=function(t){return Math.acos(e.clamp(t,-1,1))},e.asinClamped=function(t){return Math.asin(e.clamp(t,-1,1))},e.chordLength=function(t,n){return 2*n*Math.sin(.5*t)},e.logBase=function(t,n){return Math.log(t)/Math.log(n)},e.cbrt=a.defaultValue(Math.cbrt,(function(t){var n=Math.pow(Math.abs(t),1/3);return t<0?-n:n})),e.log2=a.defaultValue(Math.log2,(function(t){return Math.log(t)*Math.LOG2E})),e.fog=function(t,n){return n*=t,1-Math.exp(-n*n)},e.fastApproximateAtan=function(t){return t*(-.1784*Math.abs(t)-.0663*t*t+1.0301)},e.fastApproximateAtan2=function(t,n){var a=Math.abs(t),i=Math.abs(n),r=Math.max(a,i);return i=Math.min(a,i),a=e.fastApproximateAtan(i/r),a=Math.abs(n)>Math.abs(t)?e.PI_OVER_TWO-a:a,a=t<0?e.PI-a:a,n<0?-a:a},t.CesiumMath=e}));