export interface FarmArea {
  id: string;
  name: string;
  size: number;
  location: string;
  memo?: string;
  imageUrl?: string; // 追加
  createdAt: Date;
  updatedAt: Date;
}

export type FarmAreaInput = Omit<FarmArea, 'id' | 'createdAt' | 'updatedAt'>;

// モジュールとして認識させるための空エクスポート
export {}