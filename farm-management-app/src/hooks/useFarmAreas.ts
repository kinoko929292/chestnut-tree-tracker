import { useState, useEffect } from 'react';
import { FarmArea } from '../features/farmArea/types';
import { getFarmAreas, saveFarmArea, deleteFarmArea } from '../features/farmArea/FarmAreaService';

const useFarmAreas = () => {
  const [farmAreas, setFarmAreas] = useState<FarmArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadFarmAreas = async () => {
      try {
        const data = await getFarmAreas();
        setFarmAreas(data);
        setLoading(false);
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    };

    loadFarmAreas();
  }, []);

  const addFarmArea = async (data: FarmArea) => {
    try {
      await saveFarmArea(data);
      setFarmAreas(prev => [...prev, data]);
    } catch (err) {
      setError(err as Error);
    }
  };

  const updateFarmArea = async (data: FarmArea) => {
    try {
      await saveFarmArea(data);
      setFarmAreas(prev => prev.map(a => a.id === data.id ? data : a));
    } catch (err) {
      setError(err as Error);
    }
  };

  const removeFarmArea = async (id: string) => {
    try {
      await deleteFarmArea(id);
      setFarmAreas(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      setError(err as Error);
    }
  };

  return {
    farmAreas,
    loading,
    error,
    addFarmArea,
    updateFarmArea,
    removeFarmArea
  };
};

export default useFarmAreas;

// モジュールとして認識させるための空エクスポート
export {}