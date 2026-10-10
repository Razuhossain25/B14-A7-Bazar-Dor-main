const D = "০১২৩৪৫৬৭৮৯";

export const toBn = (n) => {
  if (n === null || n === undefined) return "";
  return String(n).replace(/\d/g, (d) => D[d]);
};

export const fromBn = (s) => {
  if (!s) return 0;
  return Number(String(s).replace(/[০-৯]/g, (d) => D.indexOf(d)).replace(/,/g, ""));
};

export const formatUnit = (u) => {
  if (!u) return "একক";
  const map = {
    kg: "কেজি",
    litre: "লিটার",
    liter: "লিটার",
    dozen: "ডজন",
    piece: "পিস",
  };
  return map[u] || u;
};

export const fmtPrice = (n) => {
  const val = Number(n) || 0;
  return toBn(val.toLocaleString("en-US")) + " টাকা";
};

export const getChangePct = (change) => {
  if (!change) return 0;
  if (typeof change === "number") return change;
  return Number(change.pct) || 0;
};

export const getChangeDir = (change) => {
  if (!change) return "flat";
  if (typeof change === "object" && change.dir) return change.dir;
  const pct = getChangePct(change);
  return pct > 0 ? "up" : pct < 0 ? "down" : "flat";
};

export const fmtPct = (change) => {
  const dir = getChangeDir(change);
  const pct = Math.abs(getChangePct(change));
  const sign = dir === "up" ? "▲ " : dir === "down" ? "▼ " : "— ";
  return sign + toBn(pct.toFixed(1)) + "%";
};

export const banglaDate = () => {
  try {
    return new Date().toLocaleDateString("bn-BD", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "আজকের বাজারদর";
  }
};

export const getBadgeColor = (change) => {
  const dir = getChangeDir(change);
  if (dir === "up") return "text-[#d03739]";
  if (dir === "down") return "text-[#1a9951]";
  return "text-[#1d271f]";
};
