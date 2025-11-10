import { User, Item, NewItem } from '../types';

const API_BASE_URL = '/api';

const handleResponse = async (response: Response) => {
    if (response.status === 204) { // No Content
        return;
    }
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || `Request failed with status ${response.status}`);
    }
    return data;
};

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token 
        ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        : { 'Content-Type': 'application/json' };
};

const mapItemDate = (item: any): Item => ({
    ...item,
    createdAt: new Date(item.createdAt),
});

export const api = {
  async login(email: string, password: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    const data = await handleResponse(response);
    localStorage.setItem('token', data.token);
    return data.user;
  },

  async signup(name: string, email: string, password: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
    });
    const data = await handleResponse(response);
    localStorage.setItem('token', data.token);
    return data.user;
  },

  async logout(): Promise<void> {
    localStorage.removeItem('token');
    return Promise.resolve();
  },

  async getCurrentUser(): Promise<User | null> {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const response = await fetch(`${API_BASE_URL}/user`, {
            headers: getAuthHeaders(),
        });
        if (response.status === 401) { // Unauthorized
            localStorage.removeItem('token');
            return null;
        }
        return await handleResponse(response);
    } catch (error) {
        console.error("Failed to fetch current user:", error);
        localStorage.removeItem('token');
        return null;
    }
  },

  async getItems(): Promise<Item[]> {
    const response = await fetch(`${API_BASE_URL}/items`, {
        headers: getAuthHeaders()
    });
    const items = await handleResponse(response);
    return items.map(mapItemDate);
  },

  async createItem(newItemData: NewItem): Promise<Item> {
    const response = await fetch(`${API_BASE_URL}/items`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newItemData),
    });
    const item = await handleResponse(response);
    return mapItemDate(item);
  },

  async updateItem(itemId: string, updates: Partial<NewItem>): Promise<Item> {
    const response = await fetch(`${API_BASE_URL}/items/${itemId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
    });
    const item = await handleResponse(response);
    return mapItemDate(item);
  },

  async deleteItem(itemId: string): Promise<void> {
    await fetch(`${API_BASE_URL}/items/${itemId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
  },
};
