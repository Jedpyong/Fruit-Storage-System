import { useState } from "react";
import { Fruit } from "../api/fruit-types";

interface Props {
  fruit: Fruit;
  onSubmit: (input: {
    name: string;
    description: string;
    limitOfFruitToBeStored: number;
  }) => void;
  onCancel: () => void;
}

export function EditFruitForm({ fruit, onSubmit, onCancel }: Props) {
  const [description, setDescription] = useState(fruit.description);
  const [limit, setLimit] = useState(fruit.limitOfFruitToBeStored);

  const handleSubmit = () => {
    onSubmit({ name: fruit.name, description, limitOfFruitToBeStored: limit });
  };

  return (
    <form
      className="fs-modal-form"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <div className="fs-field">
        <label htmlFor="edit-desc">Description</label>
        <input
          id="edit-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <span className="fs-field-hint">{description.trim().length}/30</span>
      </div>
      <div className="fs-field">
        <label htmlFor="edit-limit">Limit</label>
        <input
          id="edit-limit"
          type="number"
          min={fruit.amount}
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          required
        />
        <span className="fs-field-hint">
          Can't go below current stock ({fruit.amount})
        </span>
      </div>
      <div className="fs-modal-actions">
        <button type="button" className="fs-action" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="fs-btn">
          Save changes
        </button>
      </div>
    </form>
  );
}
