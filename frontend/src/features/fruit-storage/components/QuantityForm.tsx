import { useState } from "react";

interface Props {
  fruitName: string;
  mode: "store" | "remove";
  onSubmit: (amount: number) => void;
  onCancel: () => void;
}

export function QuantityForm({ fruitName, mode, onSubmit, onCancel }: Props) {
  const [amount, setAmount] = useState(1);

  const handleSubmit = () => {
    onSubmit(amount);
  };

  return (
    <form
      className="fs-modal-form"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <p className="fs-modal-copy">
        {mode === "store" ? "Add to" : "Remove from"}{" "}
        <strong>{fruitName}</strong>
      </p>
      <div className="fs-field">
        <label htmlFor="qty">Amount</label>
        <input
          id="qty"
          type="number"
          min={1}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          required
          autoFocus
        />
      </div>
      <div className="fs-modal-actions">
        <button type="button" className="fs-action" onClick={onCancel}>
          Cancel
        </button>
        <button
          type="submit"
          className={mode === "store" ? "fs-btn" : "fs-btn fs-btn--danger"}
        >
          {mode === "store" ? "Store" : "Remove"}
        </button>
      </div>
    </form>
  );
}
