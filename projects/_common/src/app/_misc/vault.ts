import { DELIVERME_EVENT_TYPES } from "projects/deliverme/src/app/enums/deliverme.enum";
import { COMMON_EVENT_TYPES } from "../enums/all.enums";

export const genderOptions = [
  { label: 'Male', value: 1 },
  { label: 'Female', value: 2 },
  { label: 'Other', value: 0 },
];

// https://stackoverflow.com/questions/36907341/stripe-fee-calculation
export const stripe_fees = Object.freeze({ 
  USD: { Percent: 2.9, Fixed: 0.30 },
  GBP: { Percent: 2.4, Fixed: 0.20 },
  EUR: { Percent: 2.4, Fixed: 0.24 },
  CAD: { Percent: 2.9, Fixed: 0.30 },
  AUD: { Percent: 2.9, Fixed: 0.30 },
  NOK: { Percent: 2.9, Fixed: 2 },
  DKK: { Percent: 2.9, Fixed: 1.8 },
  SEK: { Percent: 2.9, Fixed: 1.8 },
  JPY: { Percent: 3.6, Fixed: 0 },
  MXN: { Percent: 3.6, Fixed: 3 }
});

// https://stackoverflow.com/questions/6903823/regex-for-youtube-id/6904504
export const youtube_regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/gi;

export const ratingOptions = Array(5).fill(0).map((k, i) => i + 1);



// events that a user can/should listen for

export const user_conversation_events = [
  COMMON_EVENT_TYPES.CONVERSATION_MEMBER_ADDED,
  COMMON_EVENT_TYPES.CONVERSATION_MEMBER_REMOVED,
  COMMON_EVENT_TYPES.CONVERSATION_MEMBER_REQUESTED,
  COMMON_EVENT_TYPES.CONVERSATION_MEMBER_REQUEST_CANCELED,
  COMMON_EVENT_TYPES.CONVERSATION_MEMBER_REQUEST_ACCEPTED,
  COMMON_EVENT_TYPES.CONVERSATION_MEMBER_REQUEST_REJECTED,
];

export const user_delivery_events = [
  DELIVERME_EVENT_TYPES.CARRIER_ASSIGNED,
  DELIVERME_EVENT_TYPES.CARRIER_UNASSIGNED,
  DELIVERME_EVENT_TYPES.CARRIER_MARKED_AS_PICKED_UP,
  DELIVERME_EVENT_TYPES.CARRIER_MARKED_AS_DROPPED_OFF,
  DELIVERME_EVENT_TYPES.DELIVERY_NEW_TRACKING_UPDATE,
  DELIVERME_EVENT_TYPES.DELIVERY_NEW_MESSAGE,
  DELIVERME_EVENT_TYPES.DELIVERY_ADD_COMPLETED_PICTURE,
  DELIVERME_EVENT_TYPES.DELIVERY_COMPLETED,
  DELIVERME_EVENT_TYPES.DELIVERY_RETURNED,
];


export const user_notification_events = [
  ...user_conversation_events,
];