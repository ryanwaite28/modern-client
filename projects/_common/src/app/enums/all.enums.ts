/** Enums */

export enum AlertTypes {
  SUCCESS = 'success',
  INFO = 'info',
  WARNING = 'warning',
  DANGER = 'danger',
  SECONDARY = 'secondary',
  PRIMARY = 'primary',
  LIGHT = 'light',
  DARK = 'dark',
}

export enum StoreKeys {
  USER_FIELDS = 'USER_FIELDS',
  LOCATION_PREFERENCES = 'LOCATION_PREFERENCES',
}

export enum USER_RECORDS {
  FIELDS = 'fields',
  CONNECTIONS = 'connections',
  CONNECTION_REQUESTS = 'connection-requests',
  CLIQUES = 'cliques',
  POSTS = 'posts',
  RECIPES = 'recipes',
  CLIQUE_INTERESTS = 'clique-interests',
  CLIQUE_MEMBERSHIPS = 'clique-memberships',
  CLIQUE_MEMBERSHIP_REQUESTS = 'member-requests',
  RESOURCES = 'resources',
  RESOURCE_INTERESTS = 'resource-interests',
  NOTIFICATIONS = 'notifications',
  FOLLOWERS = 'followers',
  FOLLOWINGS = 'followings',
}

export enum REACTIONS {
  LIKE = 1,
  DISLIKE,
  LOVE,
  CLAP,
  IDEA,
  CONFUSED,
  EXCITED,
  CARE,
  LAUGH,
  WOW,
  SAD,
  UPSET,
  FIRE,
  ONE_HUNDRED,
}
export enum REACTION_TYPES {
  LIKE = 'LIKE',
  DISLIKE = 'DISLIKE',
  LOVE = 'LOVE',
  CLAP = 'CLAP',
  IDEA = 'IDEA',
  CONFUSED = 'CONFUSED',
  EXCITED = 'EXCITED',
  CARE = 'CARE',
  LAUGH = 'LAUGH',
  WOW = 'WOW',
  SAD = 'SAD',
  UPSET = 'UPSET',
  FIRE = 'FIRE',
  ONE_HUNDRED = 'ONE_HUNDRED',
}

export enum PREMIUM_SUBSCRIPTIONS {
  BACKGROUND_MARKETING = 'BACKGROUND_MARKETING',
}

export enum NOTIFICATION_TARGET_TYPES {
  RESOURCE = 'RESOURCE',
  CLIQUE = 'CLIQUE',
  MESSAGING = 'MESSAGING',
  MESSAGE = 'MESSAGE',
  CONVERSATION = 'CONVERSATION',
}

export enum SUBSCRIPTION_TARGET_ACTIONS {
  
}

export enum SUBSCRIPTION_TARGET_ACTIONS_INFO {
  
}

export enum SUBSCRIPTION_TARGET_FREQ {
  INSTANT = 'INSTANT',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

export enum EVENT_TYPES {
  NEW_MESSAGE = 'NEW_MESSAGE',
  NEW_MESSAGING = 'NEW_MESSAGING',
  NEW_FOLLOWER = 'NEW_FOLLOWER',
  NEW_UNFOLLOWER = 'NEW_UNFOLLOWER',
  NEW_CONVERSATION = 'NEW_CONVERSATION',
  NEW_CONVERSATION_MESSAGE = 'NEW_CONVERSATION_MESSAGE',
  CONVERSATION_MEMBER_ADDED = 'CONVERSATION_MEMBER_ADDED',
  CONVERSATION_MEMBER_REMOVED = 'CONVERSATION_MEMBER_REMOVED',
  CONVERSATION_MEMBER_LEFT = 'CONVERSATION_MEMBER_LEFT',
  NEW_CLIQUE = 'NEW_CLIQUE',
  CLIQUE_MEMBER_REQUEST = 'CLIQUE_MEMBER_REQUEST',
  CLIQUE_MEMBER_CANCEL = 'CLIQUE_MEMBER_CANCEL',
  CLIQUE_MEMBER_ACCEPT = 'CLIQUE_MEMBER_ACCEPT',
  CLIQUE_MEMBER_DECLINE = 'CLIQUE_MEMBER_DECLINE',
  CLIQUE_MEMBER_ADDED = 'CLIQUE_MEMBER_ADDED',
  CLIQUE_MEMBER_REMOVED = 'CLIQUE_MEMBER_REMOVED',
  CLIQUE_MEMBER_LEFT = 'CLIQUE_MEMBER_LEFT',
  NEW_CLIQUE_INTEREST = 'NEW_CLIQUE_INTEREST',
  CLIQUE_UNINTEREST = 'CLIQUE_UNINTEREST',
  NEW_RESOURCE_INTEREST = 'NEW_RESOURCE_INTEREST',
  RESOURCE_UNINTEREST = 'RESOURCE_UNINTEREST',
  MESSAGE_TYPING = 'MESSAGE_TYPING',
  MESSAGE_TYPING_STOPPED = 'MESSAGE_TYPING_STOPPED',
  CONVERSATION_MESSAGE_TYPING = 'CONVERSATION_MESSAGE_TYPING',
  CONVERSATION_MESSAGE_TYPING_STOPPED = 'CONVERSATION_MESSAGE_TYPING_STOPPED',
  CONVERSATION_UPDATED = 'CONVERSATION_UPDATED',
  CONVERSATION_DELETED = 'CONVERSATION_DELETED',
  CLIQUE_UPDATED = 'CLIQUE_UPDATED',
  CLIQUE_DELETED = 'CLIQUE_DELETED',
  CONNECTION_REQUEST = 'CONNECTION_REQUEST',
  CONNECTION_CANCEL = 'CONNECTION_CANCEL',
  CONNECTION_ACCEPT = 'CONNECTION_ACCEPT',
  CONNECTION_DECLINE = 'CONNECTION_DECLINE',
  CONNECTION_BROKEN = 'CONNECTION_BROKEN',
}

export enum CRON_JOB_TYPES {
  UNSUSCRIBE_PREMIUM = 'UNSUSCRIBE_PREMIUM',
}

export enum USER_TYPES {
  ENTREPRENEUR = 'ENTREPRENEUR',
  INVESTOR = 'INVESTOR',
  PARTNER = 'PARTNER',
}

export enum RESOURCE_TYPES {
  BOOK = 'BOOK',
  VIDEO = 'VIDEO',
  EVENT = 'EVENT',
  ARTICLE = 'ARTICLE',
  WEBSITE = 'WEBSITE',
  PERSON = 'PERSON',
  OTHER = 'OTHER',
}

export enum CommentModel {
  POST = 'POST',
  LINK = 'LINK',
  RECIPE = 'RECIPE',
}

export enum CommentParent {
  POST = 'post',
  RECIPE = 'recipe',
}

export enum ReplyModel {
  POST = 'POST',
  LINK = 'LINK',
  RECIPE = 'RECIPE',
}