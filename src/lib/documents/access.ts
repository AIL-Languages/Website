import { canCoordinate, canManageSystem } from "@/lib/auth/admin";
import type { PublicUser } from "@/lib/auth/types";
import type { StoredDocument } from "@/lib/documents/store";

export function canReadDocument(
  user: PublicUser,
  document: Pick<StoredDocument, "uploadedBy" | "kind">,
) {
  if (canManageSystem(user.role, user.email)) return true;
  if (document.uploadedBy === user.id) return true;
  if (canCoordinate(user.role, user.email)) return true;
  return false;
}

export function canDeleteDocument(
  user: PublicUser,
  document: Pick<StoredDocument, "uploadedBy">,
) {
  return canManageSystem(user.role, user.email) || document.uploadedBy === user.id;
}

export function visibleDocuments<T extends Pick<StoredDocument, "uploadedBy" | "kind">>(
  user: PublicUser,
  documents: T[],
) {
  return documents.filter((document) => canReadDocument(user, document));
}
