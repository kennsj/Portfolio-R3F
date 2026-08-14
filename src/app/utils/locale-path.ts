import type { AppLocale } from "../hooks/useI18n";

export function stripLocalePrefix(pathname: string): string {
  const stripped = pathname.replace(/^\/en(?=\/|$)/, "");
  return stripped || "/";
}

export function localeFromPathname(pathname: string): AppLocale {
  return /^\/en(?:\/|$)/.test(pathname) ? "en" : "nb";
}

export function localizePath(path: string, locale: AppLocale): string {
  const hashIndex = path.indexOf("#");
  const pathname = hashIndex >= 0 ? path.slice(0, hashIndex) : path;
  const hash = hashIndex >= 0 ? path.slice(hashIndex) : "";
  const logicalPath = stripLocalePrefix(pathname || "/");
  const localizedPath = locale === "en"
    ? logicalPath === "/" ? "/en" : `/en${logicalPath}`
    : logicalPath;

  return `${localizedPath}${hash}`;
}
