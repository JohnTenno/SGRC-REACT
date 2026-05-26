export function isNavLinkActive(pathname, { to, end, prefix }) {
  if (end) return pathname === to
  if (prefix) return pathname === to || pathname.startsWith(`${prefix}/`)
  return pathname === to || pathname.startsWith(`${to}/`)
}