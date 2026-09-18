/**
 * Single source of truth for tournament rules content.
 *
 * Previously this same content was hand-duplicated in three places
 * (the homepage preview, the About page summary, and the full /rules
 * page), each with its own slightly different wording and icon keys -
 * easy to accidentally let drift out of sync. Now there's one canonical
 * list here; each surface just picks which items it wants to show via
 * the `homepagePreview` / `aboutSummary` flags below.
 *
 * To add or edit a rule: change it here. To change WHERE it shows up,
 * flip its `homepagePreview` / `aboutSummary` flags - no need to touch
 * actions/home.ts, actions/about.ts, or actions/rules.ts.
 */

export interface RuleCategory {
  id: string;
  label: string;
}

export const RULE_CATEGORIES: RuleCategory[] = [
  { id: "general", label: "General" },
  { id: "match-day", label: "Match Day" },
  { id: "fair-play", label: "Fair Play" },
  { id: "conduct", label: "Conduct" },
];

export const DEFAULT_RULE_CATEGORY = "general";

export interface TournamentRule {
  id: string;
  category: string;
  title: string;
  description: string;
  icon: string;
  /** Shown in the homepage's "Play Fair. Compete With Integrity." preview. */
  homepagePreview?: boolean;
  /** Shown in the About page's "Tournament Rules" summary sidebar. */
  aboutSummary?: boolean;
}

export const TOURNAMENT_RULES: TournamentRule[] = [
  {
    id: "follow-rules",
    category: "general",
    title: "Follow All Tournament Rules",
    description:
      "Follow all tournament rules and decisions made by the Tournament Organizer.",
    icon: "clipboard",
    homepagePreview: true,
    aboutSummary: true,
  },
  {
    id: "final-decision",
    category: "general",
    title: "Organizer's Decision Is Final",
    description:
      "The Tournament Organizer's decision is final in all disputes and match rulings.",
    icon: "scale",
    aboutSummary: true,
  },
  {
    id: "registration",
    category: "general",
    title: "Complete Registration Required",
    description:
      "Teams must complete registration with a full roster before the tournament's registration deadline to be eligible to compete.",
    icon: "clipboard-check",
  },
  {
    id: "ready",
    category: "match-day",
    title: "All Teams Must Be Ready",
    description:
      "All teams must be ready at least 10 minutes before their scheduled match.",
    icon: "clock",
    homepagePreview: true,
    aboutSummary: true,
  },
  {
    id: "default-loss",
    category: "match-day",
    title: "Default Loss",
    description:
      "Teams that fail to complete their lineup or do not report within the allotted waiting time will automatically forfeit the match (Default Loss).",
    icon: "x-circle",
    homepagePreview: true,
    aboutSummary: true,
  },
  {
    id: "stable-internet",
    category: "match-day",
    title: "Stable Internet Required",
    description:
      "Stable internet connection is the responsibility of each player. Technical issues caused by a player's own connection may lead to a match loss or disqualification, depending on the situation.",
    icon: "wifi",
    aboutSummary: true,
  },
  {
    id: "rescheduling",
    category: "match-day",
    title: "Rescheduling Requests",
    description:
      "Any request to reschedule a match must be submitted to the Tournament Organizer well in advance and is granted only under exceptional circumstances.",
    icon: "calendar-clock",
  },
  {
    id: "no-cheating",
    category: "fair-play",
    title: "No Cheating",
    description:
      "The use of Map Hack, Scripts, Cheats, Exploits, Third-Party Apps, or any unfair advantage is strictly prohibited and will result in immediate disqualification.",
    icon: "user-x",
    homepagePreview: true,
    aboutSummary: true,
  },
  {
    id: "identity-verification",
    category: "fair-play",
    title: "Identity Verification",
    description:
      "Players may be required to join a video call or enable their camera for identity verification and fair play.",
    icon: "video",
    aboutSummary: true,
  },
  {
    id: "roster-lock",
    category: "fair-play",
    title: "Roster Lock",
    description:
      "Registered rosters are locked once the group stage begins. Substitute players may only be used if they were registered before the deadline.",
    icon: "lock",
  },
  {
    id: "respect-everyone",
    category: "conduct",
    title: "Respect Everyone",
    description:
      "Respect all players, referees, organizers, and spectators. Toxic behavior, harassment, hate speech, and offensive language will not be tolerated.",
    icon: "handshake",
    aboutSummary: true,
  },
  {
    id: "sportsmanship",
    category: "conduct",
    title: "Good Sportsmanship",
    description:
      "Win or lose, all participants are expected to conduct themselves with good sportsmanship, on stream, in game, and across official tournament channels.",
    icon: "star",
  },
];