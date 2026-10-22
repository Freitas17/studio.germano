import "./WhatsAppButton.css";

const BUBBLE =
  "M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Z";

const PHONE =
  "M7.44 8.11c-.21 0-.55.08-.84.39-.29.31-1.1 1.08-1.1 2.63 0 1.55 1.13 3.05 1.29 3.26.16.21 2.19 3.48 5.39 4.75.75.32 1.34.51 1.8.66.76.24 1.44.21 1.99.13.61-.09 1.87-.76 2.13-1.5.26-.74.26-1.37.18-1.5-.08-.13-.29-.21-.61-.37-.31-.16-1.87-.92-2.16-1.03-.29-.1-.5-.16-.71.16-.21.31-.81 1.03-.99 1.24-.18.21-.37.24-.68.08-.31-.16-1.32-.49-2.52-1.55-.93-.83-1.56-1.85-1.74-2.16-.18-.31-.02-.48.14-.63.14-.14.31-.37.47-.55.16-.18.21-.31.31-.52.1-.21.05-.39-.03-.55-.08-.16-.71-1.71-.97-2.34-.24-.61-.49-.53-.68-.54l-.58-.01Z";

export default function WhatsAppButton({ whatsapp }) {
  const digits = String(whatsapp || "").replace(/\D/g, "");
  if (!digits) return null;

  return (
    <a
      className="whatsapp-float"
      href={`https://wa.me/${digits}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Falar no WhatsApp"
    >
      <svg
        viewBox="0 0 24 24"
        width="26"
        height="26"
        aria-hidden="true"
        focusable="false"
      >
        <path className="whatsapp-float__bubble" d={BUBBLE} />
        <path
          className="whatsapp-float__phone"
          d={PHONE}
          transform="translate(0.72 -1.44) scale(0.95)"
        />
      </svg>
    </a>
  );
}
