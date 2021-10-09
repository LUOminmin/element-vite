/**
 * Cesium - https://github.com/CesiumGS/cesium
 *
 * Copyright 2011-2020 Cesium Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * modify for smart3d
 * http://www.southsmart.com/smartmap/smart3d
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Columbus View (Pat. Pend.)
 *
 * Portions licensed separately.
 * See https://github.com/CesiumGS/cesium/blob/master/LICENSE.md for full licensing details.
 */
define(["exports","./when-fa189214","./WebGLConstants-18e33079","./Check-42d11d5c","./Math-6c04a9ed"],function(e,r,t,n,N){"use strict";var E={UNSIGNED_BYTE:t.WebGLConstants.UNSIGNED_BYTE,UNSIGNED_SHORT:t.WebGLConstants.UNSIGNED_SHORT,UNSIGNED_INT:t.WebGLConstants.UNSIGNED_INT,getSizeInBytes:function(e){switch(e){case E.UNSIGNED_BYTE:return Uint8Array.BYTES_PER_ELEMENT;case E.UNSIGNED_SHORT:return Uint16Array.BYTES_PER_ELEMENT;case E.UNSIGNED_INT:return Uint32Array.BYTES_PER_ELEMENT}},fromSizeInBytes:function(e){switch(e){case 2:return E.UNSIGNED_SHORT;case 4:return E.UNSIGNED_INT;case 1:return E.UNSIGNED_BYTE}},validate:function(e){return r.defined(e)&&(e===E.UNSIGNED_BYTE||e===E.UNSIGNED_SHORT||e===E.UNSIGNED_INT)},createTypedArray:function(e,r){return new(e>=N.CesiumMath.SIXTY_FOUR_KILOBYTES?Uint32Array:Uint16Array)(r)},createTypedArrayFromArrayBuffer:function(e,r,t,n){return new(e>=N.CesiumMath.SIXTY_FOUR_KILOBYTES?Uint32Array:Uint16Array)(r,t,n)}},t=Object.freeze(E);e.IndexDatatype=t});
