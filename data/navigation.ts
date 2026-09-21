import {
  fetchNavigation,
  type NavChild,
  type NavItem,
  type NavigationData,
} from "@/lib/cms";

export type { NavChild, NavItem, NavigationData };

export async function getNavigation() {
  return fetchNavigation();
}
