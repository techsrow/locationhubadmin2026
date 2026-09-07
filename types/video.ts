export interface Video {
  id: string;
  title?: string;
  vimeoId: string;
  category: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVideoPayload {
  title?: string;
  vimeoId: string;
  category: string;
  isActive?: boolean;
}