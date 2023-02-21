import { lazy } from "react";

export function lazyLoad(path: string, nameExported: string | null) {
  return lazy(async () => {
    const promise = import(path);
    if (!nameExported) {
      return promise;
    } else {
      const module = await promise;
        return ({ default: module[nameExported] });
    }
  });
}
