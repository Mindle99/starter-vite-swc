export function maskPII(value: string, field: string, maskType: "none" | "partial" | "full"): string {
  if (!value) return "";
  if (maskType === "none") return value;

  switch (field) {
    case "firstName":
    case "lastName":
      if (maskType === "partial") return value[0] + "***";
      if (maskType === "full") return "***";
      break;
    case "phone":
      if (maskType === "partial") return value.replace(/(\d{3})\d{3}(\d{2,})/, "$1***$2");
      if (maskType === "full") return value.replace(/\d/g, "*");
      break;
    case "email":
      if (maskType === "partial") {
        const [user, domain] = value.split("@");
        return user[0] + "***@" + domain;
      }
      if (maskType === "full") return "***@***";
      break;
    case "address":
      if (maskType === "partial") return value.slice(0, 3) + "***";
      if (maskType === "full") return "***";
      break;
    default:
      if (maskType === "full") return "***";
      if (maskType === "partial") return value[0] + "***";
  }
  return value;
} 