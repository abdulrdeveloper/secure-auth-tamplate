// Turns a User-Agent header into the words a person recognises, such as
// "Chrome" on "Windows". Order matters: Edge and Opera also say "Chrome",
// and Chrome also says "Safari".

type DeviceType = "desktop" | "mobile" | "tablet";

interface DeviceInfo {
  browser: string;
  os: string;
  type: DeviceType;
}

const BROWSERS: [RegExp, string][] = [
  [/Edg(e|A|iOS)?\//, "Edge"],
  [/OPR\/|Opera/, "Opera"],
  [/SamsungBrowser\//, "Samsung Internet"],
  [/Firefox\/|FxiOS\//, "Firefox"],
  [/Chrome\/|CriOS\//, "Chrome"],
  [/Version\/.*Safari\//, "Safari"],
];

const SYSTEMS: [RegExp, string][] = [
  [/iPad/, "iPadOS"],
  [/iPhone|iPod/, "iOS"],
  [/Android/, "Android"],
  [/Windows NT/, "Windows"],
  [/CrOS/, "ChromeOS"],
  [/Mac OS X|Macintosh/, "macOS"],
  [/Linux/, "Linux"],
];

export function describeDevice(userAgent: string): DeviceInfo {
  const browser = BROWSERS.find(([pattern]) => pattern.test(userAgent))?.[1] ?? "Unknown browser";
  const os = SYSTEMS.find(([pattern]) => pattern.test(userAgent))?.[1] ?? "Unknown system";

  let type: DeviceType = "desktop";
  if (/iPad|Tablet/.test(userAgent) || (/Android/.test(userAgent) && !/Mobile/.test(userAgent))) {
    type = "tablet";
  } else if (/Mobi|iPhone|iPod|Android/.test(userAgent)) {
    type = "mobile";
  }

  return { browser, os, type };
}
