export const rolesAllowed = {
  admin: { canDownloadAllQR: true, canViewAllLogs: true },
  supervisor: { canDownloadAllQR: false, canViewAllLogs: true },
  invitado: { canDownloadAllQR: false, canViewAllLogs: false }
};
