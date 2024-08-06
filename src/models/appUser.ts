export default interface AppUser {
  email: string;
  userId: string;
  meta?: AppUserMetadata;
  photoURL?: string | null;
  settings: AppUserSettings;
  displayName?: string | null;
  role?: string;
}

export interface AppUserMetadata {
  referralCode: string;
}

export interface AppUserSettings {
  showNotifications: boolean;
}
