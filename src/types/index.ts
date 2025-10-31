export interface Photographer {
  id: string;
  email: string;
  name: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  type: string;
  photographerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Photo {
  id: string;
  url?: string;
  file_url?: string;
  eventId?: string;
  uploadedAt?: string;
  tags?: Guest[];
}

export interface Guest {
  id: string;
  name: string;
  eventId: string;
  referencePhotoUrl?: string;
  reference_photo_url?: string;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  photographer: Photographer;
}

export interface CreateEventRequest {
  title: string;
  date: string;
  location: string;
  type: string;
}

export interface TagPhotoRequest {
  guestId: string;
}

export interface RegisterGuestRequest {
  name: string;
  referencePhotoUrl?: string;
}

export interface UploadProgress {
  fileName: string;
  progress: number;
  status: 'uploading' | 'success' | 'error';
}