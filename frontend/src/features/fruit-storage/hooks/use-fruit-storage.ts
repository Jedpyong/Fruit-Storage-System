import { useCallback, useEffect, useState } from "react";
import * as api from "../api/fruit.api";
import { Fruit } from "../api/fruit-types";
export function useFruitStorage() {
  const [fruits, setFruits] = useState<Fruit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setFruits(await api.listFruits());
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const runAction = useCallback(
    async (action: () => Promise<unknown>) => {
      setError(null);
      try {
        await action();
        await refresh();
      } catch (e) {
        setError((e as Error).message);
      }
    },
    [refresh]
  );

  return {
    fruits,
    loading,
    error,
    createFruit: (input: {
      name: string;
      description: string;
      limitOfFruitToBeStored: number;
    }) => runAction(() => api.createFruit(input)),
    storeFruit: (name: string, amount: number) =>
      runAction(() => api.storeFruit(name, amount)),
    removeFruit: (name: string, amount: number) =>
      runAction(() => api.removeFruit(name, amount)),
    deleteFruit: (name: string, forceDelete: boolean) =>
      runAction(() => api.deleteFruit(name, forceDelete)),
    updateFruit: (input: {
      name: string;
      description: string;
      limitOfFruitToBeStored: number;
    }) => runAction(() => api.updateFruit(input)),
  };
}
