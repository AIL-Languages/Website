/** Enmascara el correo para mostrarlo en pantalla sin exponer la dirección completa. */
export function maskEmail(email: string) {
  const normalized = email.trim().toLowerCase();
  const at = normalized.lastIndexOf("@");
  if (at <= 0 || at === normalized.length - 1) return normalized;

  const local = normalized.slice(0, at);
  const domain = normalized.slice(at + 1);
  const visible = local.slice(0, 1);
  const hidden = "*".repeat(Math.max(local.length - 1, 3));
  return `${visible}${hidden}@${domain}`;
}

export function firstNameFrom(name: string) {
  const token = name.trim().split(/\s+/)[0];
  return token || name.trim();
}
