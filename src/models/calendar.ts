interface Calendar {
    kind: string;
    etag: string;
    id: string;
    summary: string;
    description?: string;
    timeZone: string;
    colorId: string;
    backgroundColor: string;
    foregroundColor: string;
    selected?: boolean;
    accessRole: string;
    defaultReminders: Reminder[];
    conferenceProperties: ConferenceProperties;
    summaryOverride?: string;
    notificationSettings?: NotificationSettings;
    primary?: boolean;
  }
  
  interface Reminder {
    method: string;
    minutes: number;
  }
  
  interface ConferenceProperties {
    allowedConferenceSolutionTypes: string[];
  }
  
  interface NotificationSettings {
    notifications: Notification[];
  }
  
  interface Notification {
    type: string;
    method: string;
  }
  