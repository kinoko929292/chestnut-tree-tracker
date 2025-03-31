import { useState, useEffect } from 'react';
import { 
  getPlantRecords, 
  savePlantRecord, 
  deletePlantRecord 
} from '../features/plantRecord/PlantRecordService';
import { PlantRecord } from '../features/plantRecord/types';

const usePlantRecords = () => {
  const [plantRecords, setPlantRecords] = useState<PlantRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadPlantRecords = async () => {
      try {
        const data = await getPlantRecords();
        setPlantRecords(data);
        setLoading(false);
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    };

    loadPlantRecords();
  }, []);

  const addPlantRecord = async (data: PlantRecord) => {
    try {
      await savePlantRecord(data);
      setPlantRecords(prev => [...prev, data]);
    } catch (err) {
      setError(err as Error);
    }
  };

  const updatePlantRecord = async (data: PlantRecord) => {
    try {
      await savePlantRecord(data);
      setPlantRecords(prev => prev.map(p => p.id === data.id ? data : p));
    } catch (err) {
      setError(err as Error);
    }
  };

  const removePlantRecord = async (id: string) => {
    try {
      await deletePlantRecord(id);
      setPlantRecords(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError(err as Error);
    }
  };

  return {
    plantRecords,
    loading,
    error,
    addPlantRecord,
    updatePlantRecord,
    removePlantRecord
  };
};

export default usePlantRecords;

// モジュールとして認識させるための宣言
export type UsePlantRecordsHook = ReturnType<typeof usePlantRecords>;