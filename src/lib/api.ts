import axios, { AxiosInstance, AxiosProgressEvent } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use((config) => {
      const token = this.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('eventsnap_token');
    }
    return null;
  }

  setToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('eventsnap_token', token);
    }
  }

  removeToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('eventsnap_token');
    }
  }

  // Auth
  async login(email: string, password: string) {
    const response = await this.client.post('/auth/login', { email, password });
    return response.data;
  }

  // Events
  async createEvent(data: any) {
    const response = await this.client.post('/events', data);
    return response.data;
  }

  async getEvents() {
    const response = await this.client.get('/events');
    return response.data;
  }

  async getEvent(id: string) {
    const response = await this.client.get(`/events/${id}`);
    return response.data;
  }

  async deleteEvent(id: string) {
    const response = await this.client.delete(`/events/${id}`);
    return response.data;
  }

  // Photos
  async getAllPhotos() {
    const response = await this.client.get('/photos');
    return response.data;
  }
  async uploadPhotos(
    files: File[],
    eventId: string,
    onProgress?: (progress: number, fileName: string) => void
  ) {
    const formData = new FormData();
    files.forEach((file, idx) => {
      console.log('api.uploadPhotos file:', idx, file, file instanceof File, file?.name, file?.size);
      formData.append('photo', file);
    });
    formData.append('eventId', eventId);
    for (let pair of formData.entries()) {
      if (pair[1] instanceof File) {
        console.log('api.uploadPhotos FormData:', pair[0], pair[1].name, pair[1].type, pair[1].size);
      } else {
        console.log('api.uploadPhotos FormData:', pair[0], pair[1]);
      }
    }

    const response = await this.client.post('/photos/upload', formData, {
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        if (progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress?.(progress, files[0].name);
        }
      },
    });
    return response.data;
  }

  async getEventPhotos(eventId: string) {
    const response = await this.client.get(`/photos/event/${eventId}`);
    return response.data;
  }

  async tagPhoto(photoId: string, guestId: string) {
    const response = await this.client.post(`/photos/${photoId}/tag`, {
      guestId,
    });
    return response.data;
  }

  async deletePhoto(photoId: string) {
    const response = await this.client.delete(`/photos/${photoId}`);
    return response.data;
  }

  // Guests
  async getGuests() {
    const response = await this.client.get('/guests');
    return response.data;
  }
  async registerGuest(eventId: string, data: any) {
    const response = await this.client.post(`/guests/event/${eventId}`, data);
    return response.data;
  }

  async getPhotoUrl(key: string) {
    const response = await this.client.get(`/photos/presigned/${encodeURIComponent(key)}`);
    return response.data.url;
  }

  async getEventGuests(eventId: string) {
    const response = await this.client.get(`/guests/event/${eventId}`);
    return response.data;
  }
}

export const api = new ApiClient();