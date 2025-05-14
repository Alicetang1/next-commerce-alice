// export function ensureStartWith (stringToCheck:string,startWith){
//   stringToCheck.startsWith(startWith)?stringToCheck: `${startWith}${stringToCheck}`;
// }

import { ReadonlyURLSearchParams } from "next/navigation";

export function ensureStartWith(stringToCheck: string, startWith: string): string {
  if (!stringToCheck.startsWith(startWith)) {
    return `${startWith}${stringToCheck}`;
  }
  return stringToCheck;
}

export function createUrl(
  pathname:string,
  params:URLSearchParams | ReadonlyURLSearchParams
  ){
  const paramsString = params.toString();
  const queryString =`${paramsString.length? '?' : ''}${paramsString}`;
  return `${pathname}${queryString}`;
}