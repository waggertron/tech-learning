// @ts-nocheck
import { useState, type ChangeEvent } from "react";

function InventoryFilter() {
  const [inStockOnly, setInStockOnly] = useState(true);

  return (
    <InStockOnly
      checked={inStockOnly}
      onChange={setInStockOnly}
    />
  );
}

function InStockOnly({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(event.target.checked);
  }

  return (
    <label>
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
      />
      In stock only
    </label>
  );
}

export { InventoryFilter };
