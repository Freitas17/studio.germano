import { formatBRL, formatDate } from "./format.js";

export function buildMessage({ nome, data, hora, servicos }) {
  const lines = ["Ola! Gostaria de agendar:"];
  servicos.forEach((s) => {
    lines.push(`- ${s.nome} (${formatBRL(s.preco)})`);
  });
  lines.push("");
  lines.push(`Nome: ${nome}`);
  if (data && hora) {
    lines.push(`Data: ${formatDate(data)} as ${hora}`);
  }
  return lines.join("\n");
}

export function buildWhatsAppLink(number, message) {
  const digits = String(number || "").replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
