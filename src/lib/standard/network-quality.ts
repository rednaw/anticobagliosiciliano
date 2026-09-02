/** Network Information API — slow-link / Save-Data signals for media tier. */

export type EffectiveConnectionType = 'slow-2g' | '2g' | '3g' | '4g';

const SLOW_TYPES = new Set<string>(['slow-2g', '2g', '3g']);

type NetworkInformationLike = {
  saveData?: boolean;
  effectiveType?: string;
};

type NavigatorConnection = Navigator & {
  connection?: NetworkInformationLike;
  mozConnection?: NetworkInformationLike;
  webkitConnection?: NetworkInformationLike;
};

export function getNetworkInformation(
  nav: Navigator = typeof navigator !== 'undefined' ? navigator : ({} as Navigator)
): NetworkInformationLike | undefined {
  const n = nav as NavigatorConnection;
  return n.connection ?? n.mozConnection ?? n.webkitConnection;
}

/** True when Save-Data is on or effectiveType is slow-2g / 2g / 3g. */
export function isSlowNetwork(
  info: NetworkInformationLike | undefined = getNetworkInformation()
): boolean {
  if (!info) return false;
  if (info.saveData) return true;
  const type = info.effectiveType;
  return typeof type === 'string' && SLOW_TYPES.has(type);
}
