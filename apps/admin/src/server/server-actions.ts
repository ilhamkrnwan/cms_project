import {
  getPreferencePersistence,
  PREFERENCE_REGISTRY,
  type PreferenceKey,
  type PreferenceValueMap,
  parsePreference,
} from "@/lib/preferences/preferences-config";
import { getClientCookie, setClientCookie } from "@/lib/cookie";

export async function getValueFromCookie(key: string): Promise<string | undefined> {
  return getClientCookie(key);
}

export async function setValueToCookie(
  key: string,
  value: string,
  options: { path?: string; maxAge?: number } = {},
): Promise<void> {
  setClientCookie(key, value);
}

export async function getPreference<K extends PreferenceKey>(key: K): Promise<PreferenceValueMap[K]> {
  const definition = PREFERENCE_REGISTRY[key];
  const persistence = getPreferencePersistence(key);

  if (persistence !== "client-cookie" && persistence !== "server-cookie") {
    return definition.defaultValue;
  }

  return parsePreference(key, getClientCookie(key)?.trim()) as PreferenceValueMap[K];
}

export async function getDashboardLayout() {
  return {
    defaultOpen: getClientCookie("sidebar_state") !== "false",
    variant: parsePreference("sidebar_variant", getClientCookie("sidebar_variant")?.trim()),
    collapsible: parsePreference("sidebar_collapsible", getClientCookie("sidebar_collapsible")?.trim()),
  };
}
