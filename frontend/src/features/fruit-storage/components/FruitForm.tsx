import { useState } from "react";

interface Props {
  onCreate: (input: {
    name: string;
    description: string;
    limitOfFruitToBeStored: number;
  }) => void;
}

export function FruitForm({ onCreate }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [limit, setLimit] = useState(10);

  const handleSubmit = () => {
    onCreate({ name, description, limitOfFruitToBeStored: limit });
    setName("");
    setDescription("");
    setLimit(0);
  };

  return (
    <form
      className="fs-slip"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <h3 className="fs-slip-title">Add new fruit</h3>
      <div className="fs-field-row">
        <div className="fs-field">
          <label htmlFor="fs-name">Name</label>
          <input
            id="fs-name"
            placeholder="lemon"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="fs-field">
          <label htmlFor="fs-desc">Description </label>
          <input
            id="fs-desc"
            placeholder="this is a lemon"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="fs-field">
          <label htmlFor="fs-limit">Limit</label>
          <input
            id="fs-limit"
            type="number"
            min={1}
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            required
          />
        </div>
        <button className="fs-btn" type="submit">
          Add to storage
        </button>
      </div>
    </form>
  );
}
