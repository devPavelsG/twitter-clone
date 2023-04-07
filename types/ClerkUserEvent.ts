
export enum ClerkUserEventType {
  USER_UPDATED = 'user.updated',
  USER_DELETED = 'user.deleted',
  USER_CREATED = 'user.created',
}

export interface ClerkUserEvent {
  object: 'event';
  type: ClerkUserEventType;
  data: {
    object: 'user';
    id: string;
    created_at: number;
    updated_at: number;
    last_sign_in_at?: number;
    username?: string;
    first_name: string;
    last_name?: string;
    profile_image_url: string;
  };
}