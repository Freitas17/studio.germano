import { createContext, useCallback, useContext, useMemo, useState } from "react";

const SelectionContext = createContext(null);

export function SelectionProvider({ children }) {
  const [selected, setSelected] = useState([]);

  const toggle = useCallback((id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  const toggleExclusive = useCallback((id, groupIds = [id]) => {
    setSelected((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      const group = new Set([id, ...groupIds]);
      return [...prev.filter((item) => !group.has(item)), id];
    });
  }, []);

  const clear = useCallback(() => setSelected([]), []);

  const value = useMemo(
    () => ({
      selected,
      toggle,
      toggleExclusive,
      clear,
      isSelected: (id) => selected.includes(id),
    }),
    [selected, toggle, toggleExclusive, clear]
  );

  return (
    <SelectionContext.Provider value={value}>
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelection() {
  const context = useContext(SelectionContext);
  if (!context) {
    throw new Error("useSelection deve ser usado dentro de SelectionProvider");
  }
  return context;
}
