declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';
declare module '*.json' {
  const value: { readonly [key: string]: string }
  export default value
}

declare interface Window {
$TOKEN: any;
}
