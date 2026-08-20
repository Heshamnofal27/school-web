export function paymentStatusMeta(t) {
  return {
    paid: { color: "success", label: t("accounting.directory.fullyPaidLabel") },
    partial: { color: "warning", label: t("accounting.directory.partialLabel") },
    unpaid: { color: "error", label: t("accounting.directory.unpaidLabel") },
  };
}
