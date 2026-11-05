import { useEffect, useMemo, useRef, useState } from "react";
import { formatDate } from "../utils/format.js";
import "./Calendar.css";

const WEEKDAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const WEEKDAY_INITIALS = ["D", "S", "T", "Q", "Q", "S", "S"];
const MONTH_NAMES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addDays(date, days) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

function parseISO(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function toISO(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function buildHint(businessDays, businessHours) {
  const groups = new Map();

  businessDays.forEach((day) => {
    const hours = businessHours[String(day)];
    if (!hours) return;
    const key = `${hours.open} às ${hours.close}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(WEEKDAY_LABELS[day]);
  });

  return Array.from(groups.entries())
    .map(([hours, days]) => `${days.join(", ")} · ${hours}`)
    .join(" • ");
}

export default function Calendar({
  id,
  value,
  onChange,
  businessDays = [0, 1, 2, 3, 4, 5],
  businessHours = {},
  maxAdvanceDays = 60,
}) {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() =>
    startOfMonth(value ? parseISO(value) : new Date())
  );
  const rootRef = useRef(null);

  const today = startOfDay(new Date());
  const maxDate = addDays(today, maxAdvanceDays);

  useEffect(() => {
    if (!open) return;
    setViewDate(startOfMonth(value ? parseISO(value) : new Date()));
  }, [open, value]);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const days = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [];

    for (let i = 0; i < firstWeekday; i += 1) cells.push(null);
    for (let day = 1; day <= daysInMonth; day += 1) {
      cells.push(new Date(year, month, day));
    }
    while (cells.length % 7 !== 0) cells.push(null);

    return cells;
  }, [viewDate]);

  const hint = useMemo(
    () => buildHint(businessDays, businessHours),
    [businessDays, businessHours]
  );

  const canGoPrevious =
    startOfMonth(viewDate) > startOfMonth(today);
  const canGoNext =
    startOfMonth(viewDate) < startOfMonth(maxDate);

  function isSelectable(day) {
    const current = startOfDay(day);
    return (
      current >= today &&
      current <= maxDate &&
      businessDays.includes(current.getDay())
    );
  }

  function goToMonth(offset) {
    setViewDate(
      (current) =>
        new Date(current.getFullYear(), current.getMonth() + offset, 1)
    );
  }

  function selectDay(day) {
    onChange(toISO(day));
    setOpen(false);
  }

  return (
    <div className="calendar" ref={rootRef}>
      <button
        type="button"
        id={id}
        className="calendar__trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span className={value ? "" : "calendar__placeholder"}>
          {value ? formatDate(value) : "Selecione uma data"}
        </span>
        <span className="calendar__icon" aria-hidden="true">
          ▾
        </span>
      </button>

      {open && (
        <div className="calendar__popover" role="dialog" aria-label="Escolher data">
          <div className="calendar__header">
            <button
              type="button"
              className="calendar__nav"
              aria-label="Mês anterior"
              onClick={() => goToMonth(-1)}
              disabled={!canGoPrevious}
            >
              ‹
            </button>
            <strong>
              {MONTH_NAMES[viewDate.getMonth()]} {viewDate.getFullYear()}
            </strong>
            <button
              type="button"
              className="calendar__nav"
              aria-label="Próximo mês"
              onClick={() => goToMonth(1)}
              disabled={!canGoNext}
            >
              ›
            </button>
          </div>

          <div className="calendar__weekdays" aria-hidden="true">
            {WEEKDAY_INITIALS.map((label, index) => (
              <span key={`${label}-${index}`}>{label}</span>
            ))}
          </div>

          <div className="calendar__grid">
            {days.map((day, index) => {
              if (!day) {
                return (
                  <span
                    key={`empty-${index}`}
                    className="calendar__day calendar__day--empty"
                  />
                );
              }

              const iso = toISO(day);
              const selectable = isSelectable(day);
              const selected = value === iso;

              return (
                <button
                  key={iso}
                  type="button"
                  className={`calendar__day${
                    selected ? " calendar__day--selected" : ""
                  }`}
                  disabled={!selectable}
                  aria-pressed={selected}
                  onClick={() => selectDay(day)}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>

          {hint && <p className="calendar__hint">{hint}</p>}
        </div>
      )}
    </div>
  );
}
