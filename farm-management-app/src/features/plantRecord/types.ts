// PlantRecord関連の型定義
export interface PlantRecord {
  id: string;
  plantType: string;
  plantingDate: Date;
  quantity: number;
  farmAreaId: string;
  memo?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type PlantRecordInput = Omit<PlantRecord, 'id' | 'createdAt' | 'updatedAt'>;

// モジュールとして認識させるための宣言
export type PlantRecordTypes = PlantRecord | PlantRecordInput;