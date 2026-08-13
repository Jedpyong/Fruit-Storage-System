import { useState } from "react";
import { Fruit } from "../api/fruit-types";
import { Modal } from "./Modal";
import { EditFruitForm } from "./EditFruitForm";
import { QuantityForm } from "./QuantityForm";

interface Props {
  fruits: Fruit[];
  onStore: (name: string, amount: number) => void;
  onRemove: (name: string, amount: number) => void;
  onDelete: (name: string, forceDelete: boolean) => void;
  onUpdate: (input: {
    name: string;
    description: string;
    limitOfFruitToBeStored: number;
  }) => void;
}

type StampLevel = "empty" | "in-stock" | "nearly-full" | "at-limit";

function getStampLevel(amount: number, limit: number): StampLevel {
  if (amount <= 0) return "empty";
  if (amount >= limit) return "at-limit";
  if (amount / limit >= 0.75) return "nearly-full";
  return "in-stock";
}

const STAMP_LABEL: Record<StampLevel, string> = {
  empty: "EMPTY",
  "in-stock": "IN STOCK",
  "nearly-full": "NEARLY FULL",
  "at-limit": "AT LIMIT",
};

type ActiveModal =
  | { type: "edit"; fruit: Fruit }
  | { type: "store"; fruit: Fruit }
  | { type: "remove"; fruit: Fruit }
  | null;

export function FruitList({
  fruits,
  onStore,
  onRemove,
  onDelete,
  onUpdate,
}: Props) {
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  return (
    <section>
      <div className="fs-ledger-heading">
        <h2>Storage ledger</h2>
        <span className="fs-ledger-count">
          {fruits.length} {fruits.length === 1 ? "entry" : "entries"}
        </span>
      </div>

      <div className="fs-table-wrap">
        {fruits.length === 0 ? (
          <p className="fs-empty">No fruit logged yet — add one above.</p>
        ) : (
          <table className="fs-table">
            <thead>
              <tr className="text-center">
                <th>Fruit</th>
                <th>Description</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {fruits.map((fruit) => {
                const level = getStampLevel(
                  fruit.amount,
                  fruit.limitOfFruitToBeStored
                );
                return (
                  <tr key={fruit.name}>
                    <td className="fs-name">{fruit.name}</td>
                    <td className="fs-desc">{fruit.description}</td>
                    <td className="fs-qty">
                      {fruit.amount} / {fruit.limitOfFruitToBeStored}
                    </td>
                    <td>
                      <span className={`fs-stamp fs-stamp--${level}`}>
                        {STAMP_LABEL[level]}
                      </span>
                    </td>
                    <td>
                      <div className="fs-actions">
                        <button
                          className="fs-action fs-action--leaf"
                          onClick={() =>
                            setActiveModal({ type: "store", fruit })
                          }
                        >
                          Store
                        </button>
                        <button
                          className="fs-action"
                          onClick={() =>
                            setActiveModal({ type: "remove", fruit })
                          }
                          disabled={fruit.amount === 0}
                        >
                          Remove
                        </button>
                        <button
                          className="fs-action"
                          onClick={() =>
                            setActiveModal({ type: "edit", fruit })
                          }
                        >
                          Edit
                        </button>
                        <button
                          className="fs-action fs-action--danger"
                          onClick={() => onDelete(fruit.name, false)}
                        >
                          Delete
                        </button>
                        <button
                          className="fs-action fs-action--danger-filled"
                          onClick={() => onDelete(fruit.name, true)}
                        >
                          Force delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {activeModal?.type === "edit" && (
        <Modal
          title={`Edit ${activeModal.fruit.name}`}
          onClose={() => setActiveModal(null)}
        >
          <EditFruitForm
            fruit={activeModal.fruit}
            onCancel={() => setActiveModal(null)}
            onSubmit={(input) => {
              onUpdate(input);
              setActiveModal(null);
            }}
          />
        </Modal>
      )}

      {activeModal?.type === "store" && (
        <Modal
          title={`Store ${activeModal.fruit.name}`}
          onClose={() => setActiveModal(null)}
        >
          <QuantityForm
            fruitName={activeModal.fruit.name}
            mode="store"
            onCancel={() => setActiveModal(null)}
            onSubmit={(amount) => {
              onStore(activeModal.fruit.name, amount);
              setActiveModal(null);
            }}
          />
        </Modal>
      )}

      {activeModal?.type === "remove" && (
        <Modal
          title={`Remove ${activeModal.fruit.name}`}
          onClose={() => setActiveModal(null)}
        >
          <QuantityForm
            fruitName={activeModal.fruit.name}
            mode="remove"
            onCancel={() => setActiveModal(null)}
            onSubmit={(amount) => {
              onRemove(activeModal.fruit.name, amount);
              setActiveModal(null);
            }}
          />
        </Modal>
      )}
    </section>
  );
}
