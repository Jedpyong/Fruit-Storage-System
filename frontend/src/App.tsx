import { updateFruit } from "./features/fruit-storage/api/fruit.api";
import { FruitForm } from "./features/fruit-storage/components/FruitForm";
import { FruitList } from "./features/fruit-storage/components/FruitList";
import { useFruitStorage } from "./features/fruit-storage/hooks/use-fruit-storage";
import "./features/fruit-storage/styles/fruit-storage.css";

function App() {
  const {
    fruits,
    loading,
    error,
    createFruit,
    storeFruit,
    removeFruit,
    deleteFruit,
  } = useFruitStorage();
  return (
    <div className="fs-app">
      <div className="fs-shell">
        <header className="fs-header">
          <h1 className="fs-title">
            Fruit Storage<span>Stockroom Ledger</span>
          </h1>
          <div className="fs-ledger-no">
            Book No. <strong>001</strong>
            <br />
            Est. today
          </div>
        </header>
        {error && <p className="fs-error">{error}</p>}
        <FruitForm onCreate={createFruit} />
        <FruitList
          fruits={fruits}
          onStore={storeFruit}
          onRemove={removeFruit}
          onDelete={deleteFruit}
          onUpdate={updateFruit}
        />
      </div>
    </div>
  );
}

export default App;
