
export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Item {
  id: string;
  userId: string;
  name: string;
  description: string;
  createdAt: Date;
}

export type NewItem = Omit<Item, 'id' | 'userId' | 'createdAt'>;
