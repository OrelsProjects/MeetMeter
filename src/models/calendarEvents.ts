import { UserResponse } from "@prisma/client";

export interface CalendarEventMeta {
  canNotifyAt?: Date | "now";
  response: UserResponse | null;
}

export type CalendarEventWithMeta = CalendarEvent & CalendarEventMeta;

export interface CalendarEvents {
  kind: string;
  etag: string;
  summary: string;
  description: string;
  calendarBackgroundColor?: string;
  calendarForegroundColor?: string;
  updated: string;
  timeZone: string;
  accessRole: string;
  defaultReminders: Reminder[];
  nextPageToken: string;
  items: CalendarEventWithMeta[];
}

interface Reminder {
  method: string;
  minutes: number;
}

export interface CalendarEvent {
  kind: string;
  etag: string;
  id: string;
  status: string;
  htmlLink: string;
  created: string;
  updated: string;
  summary: string;
  description: string;
  location: string;
  colorId: string;
  creator: EventParticipant;
  organizer: EventParticipant;
  start: EventDateTime;
  end: EventDateTime;
  endTimeUnspecified: boolean;
  recurrence: string[];
  recurringEventId: string;
  originalStartTime: EventDateTime;
  transparency: string;
  visibility: string;
  iCalUID: string;
  sequence: number;
  attendees: EventAttendee[];
  attendeesOmitted: boolean;
  extendedProperties: ExtendedProperties;
  hangoutLink: string;
  conferenceData: ConferenceData;
  gadget: Gadget;
  anyoneCanAddSelf: boolean;
  guestsCanInviteOthers: boolean;
  guestsCanModify: boolean;
  guestsCanSeeOtherGuests: boolean;
  privateCopy: boolean;
  locked: boolean;
  reminders: EventReminders;
  source: EventSource;
  workingLocationProperties: WorkingLocationProperties;
  outOfOfficeProperties: OutOfOfficeProperties;
  focusTimeProperties: FocusTimeProperties;
  attachments: EventAttachment[];
  eventType: string;
}

interface EventParticipant {
  id?: string;
  email: string;
  displayName: string;
  self: boolean;
  organizer?: boolean;
  resource?: boolean;
  optional?: boolean;
  responseStatus?: string;
  comment?: string;
  additionalGuests?: number;
}

interface EventDateTime {
  date?: string;
  dateTime?: string;
  timeZone?: string;
}

interface EventAttendee extends EventParticipant {}

interface ExtendedProperties {
  private: { [key: string]: string };
  shared: { [key: string]: string };
}

interface ConferenceData {
  createRequest: ConferenceCreateRequest;
  entryPoints: ConferenceEntryPoint[];
  conferenceSolution: ConferenceSolution;
  conferenceId: string;
  signature: string;
  notes?: string;
}

interface ConferenceCreateRequest {
  requestId: string;
  conferenceSolutionKey: ConferenceSolutionKey;
  status: ConferenceStatus;
}

interface ConferenceSolutionKey {
  type: string;
}

interface ConferenceStatus {
  statusCode: string;
}

interface ConferenceEntryPoint {
  entryPointType: string;
  uri: string;
  label?: string;
  pin?: string;
  accessCode?: string;
  meetingCode?: string;
  passcode?: string;
  password?: string;
}

interface ConferenceSolution {
  key: ConferenceSolutionKey;
  name: string;
  iconUri: string;
}

interface Gadget {
  type: string;
  title: string;
  link: string;
  iconLink: string;
  width: number;
  height: number;
  display: string;
  preferences: { [key: string]: string };
}

interface EventReminders {
  useDefault: boolean;
  overrides?: Reminder[];
}

interface EventSource {
  url: string;
  title: string;
}

interface WorkingLocationProperties {
  type: string;
  homeOffice?: any;
  customLocation?: CustomLocation;
  officeLocation?: OfficeLocation;
}

interface CustomLocation {
  label: string;
}

interface OfficeLocation {
  buildingId: string;
  floorId: string;
  floorSectionId: string;
  deskId: string;
  label: string;
}

interface OutOfOfficeProperties {
  autoDeclineMode: string;
  declineMessage: string;
}

interface FocusTimeProperties {
  autoDeclineMode: string;
  declineMessage: string;
  chatStatus: string;
}

interface EventAttachment {
  fileUrl: string;
  title: string;
  mimeType: string;
  iconLink: string;
  fileId: string;
}
