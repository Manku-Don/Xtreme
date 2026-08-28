// Central content file for Xtreme Fitness Gym.
// Swap image URLs, copy, trainer bios and the address block here as real
// assets come in — nothing else in the codebase needs to change.

// Named, single-use images referenced by key across the site (hero
// backgrounds, About/Trainers feature panels). Previously this was a flat
// array, so every `IMAGES.heroGym` / `IMAGES.gymFloor` / etc. lookup in the
// pages silently resolved to `undefined` and rendered a broken image — this
// object shape is what those pages actually expect.
export const IMAGES = {
  heroGym: {
    src: "/images/gym-floor-wide-shot.jpeg",
    alt: "A wide-angle view of the training floor, with members lifting under warm linear ceiling lighting.",
  },
  gymFloor: {
    src: "/images/weight-rack-mirror-selfie.jpeg",
    alt: "Rows of dumbbells racked along the training floor.",
  },
  chalkHands: {
    src: "/images/flexing-man-savage-sign.jpeg",
    alt: "A member training under the gym's 'Be Savage Not Average' wall sign.",
  },
  womanLifting: {
    src: "/images/gym-floor-wide-shot.jpeg",
    alt: "Members training together on the floor, including a woman mid-set on the machines.",
  },
  personalTraining: {
    src: "/images/gym-selfie-mirror.jpeg",
    alt: "A member on the training floor, surrounded by racks and machines mid-session.",
  },
};

// Full gallery — every real photo of the floor, shown as-is on the Gallery page.
export const GALLERY_IMAGES = [
  {
    src: "/images/gym-floor-wide-shot.jpeg",
    alt: "A wide-angle view of a busy gym floor with various workout equipment and people training under modern linear lighting.",
  },
  {
    src: "/images/gym-selfie-mirror.jpeg",
    alt: "A man taking a mirror selfie in a well-equipped gym, wearing white tank top and unique graphic pants.",
  },
  {
    src: "/images/weight-rack-mirror-selfie.jpeg",
    alt: "A man taking a mirror selfie, with rows of dumbbell racks and weights in the foreground.",
  },
  {
    src: "/images/flexing-man-savage-sign.jpeg",
    alt: "A man in a white tank top flexing his arms under a motivational sign that reads 'BE SAVAGE NOT AVERAGE'.",
  },
  {
    src: "/images/dance-xtreme-wall.jpeg",
    alt: "A wall with 'Dance Xtreme' lettering, a crown logo, red brick texture, and a large mirror reflecting the space.",
  },
  {
    src: "/images/man-at-dance-xtreme.jpeg",
    alt: "A man in a white tank top taking a mirror selfie in front of the 'Dance Xtreme' wall mural.",
  },
  {
    src: "/images/man-posing-with-hanuman-mural.jpeg",
    alt: "A man in a black t-shirt flexing his bicep next to a large, vibrant mural of Hanuman.",
  },
  {
    src: "/images/hanuman-mural-closeup.jpeg",
    alt: "A detailed and powerful close-up of the Hanuman wall mural.",
  },
];

export const GYM = {
  name: "Xtreme Fitness Gym",
  tagline: "Train Like It Costs More.",
  subTagline: "International powerlifting coaches. Air-conditioned floor. Honest pricing.",
  phone: "+91 97114 03248", // pulled from the gym's public Google Business listing — confirm this is current
  email: "hello@xtremefitnessgym.in", // TODO: replace with real email
  whatsapp: "https://wa.me/919711403248",
  hours: "5:00 AM – 10:00 PM",
  days: "Monday – Saturday",
  closedNote: "Closed Sundays",
  address: {
    line1: "Xtreme Fitness Gym",
    line2: "B-4, Pankha Rd, opp. Janak Cinema Complex, Block A, Raghu Nagar, Dabri, New Delhi, Delhi 110045",
    mapsShareUrl: "https://share.google/VYMzK8u07tUKEAclV",
    mapsEmbedQuery: "Xtreme Fitness Gym, B-4 Pankha Road, Raghu Nagar, Dabri, New Delhi 110045",
    placeId: "ChIJlVKbEOgbDTkRagcWRBXfRqc",
  },
};

export const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Trainers", to: "/trainers" },
  { label: "Programs", to: "/programs" },
  { label: "Pricing", to: "/pricing" },
  { label: "Gallery", to: "/gallery" },
  { label: "Contact", to: "/contact" },
];

export const STATS = [
  { value: "5AM", label: "Opening Time" },
  { value: "10PM", label: "Closing Time" },
  { value: "6", label: "Days a Week" },
  { value: "AC", label: "Climate Controlled" },
];

export const PRICING_PLANS = [
  {
    id: "monthly",
    name: "1 Month",
    plates: 1,
    price: 1200,
    perMonth: 1200,
    duration: "month",
    tagline: "Try the floor",
    savings: null,
    featured: false,
  },
  {
    id: "quarterly",
    name: "3 Months",
    plates: 2,
    price: 3000,
    perMonth: 1000,
    duration: "3 months",
    tagline: "Build the habit",
    savings: "Save ₹600 vs monthly",
    featured: true,
  },
  {
    id: "annual",
    name: "12 Months",
    plates: 4,
    price: 9000,
    perMonth: 750,
    duration: "12 months",
    tagline: "Commit to the lift",
    savings: "Save ₹5,400 vs monthly",
    featured: false,
  },
];

export const PLAN_INCLUSIONS = [
  "Full access to the strength & conditioning floor",
  "Coaching cues from international powerlifting trainers",
  "Air-conditioned training floor, every session",
  "Open 5:00 AM – 10:00 PM, Monday to Saturday",
];

export const PROGRAMS = [
  {
    id: "personal-training",
    name: "Personal Training",
    summary:
      "One-to-one programming with a powerlifting coach who plans your sessions, tracks your numbers, and corrects your form set by set.",
    points: ["1-on-1 coaching", "Form correction on every lift", "Progression tracking"],
    image: "/images/Personal Training.png",
  },
  {
    id: "strength-powerlifting",
    name: "Strength & Powerlifting",
    summary:
      "Squat, bench and deadlift built on real programming — for members who want to chase real numbers, not just a pump.",
    points: ["Structured programming", "Technique built from competition standards", "Progressive overload tracking"],
    image: "/images/Powerlifting.png",
  },
  {
    id: "general-fitness",
    name: "General Fitness & Gym Access",
    summary:
      "Full run of the AC floor — free weights, machines and conditioning space — for members training on their own schedule.",
    points: ["Full equipment access", "5 AM – 10 PM, 6 days a week", "Air-conditioned floor"],
    image: "/images/General Fitness.png",
  },
];

// Placeholder roster — replace names, photos and specific achievements with
// the real trainer bios before this goes live.
export const TRAINERS = [
  {
    id: "trainer-1",
    name: "Head Coach",
    title: "International Powerlifter",
    focus: "Strength & Powerlifting",
  },
  {
    id: "trainer-2",
    name: "Personal Trainer",
    title: "International Powerlifter",
    focus: "Personal Training",
  },
  {
    id: "trainer-3",
    name: "Floor Coach",
    title: "International Powerlifter",
    focus: "General Fitness",
  },
];

export const WHY_US = [
  {
    icon: "Dumbbell",
    title: "Coached by Powerlifters",
    body: "Every trainer on the floor is an international competitive powerlifter — your squat, bench and deadlift are coached to a competition standard, not guessed at.",
  },
  {
    icon: "Snowflake",
    title: "Air-Conditioned Floor",
    body: "Delhi heat doesn't get a vote. The whole training floor stays climate-controlled through every session, every month of the year.",
  },
  {
    icon: "UserCheck",
    title: "Personal Training, Built In",
    body: "One-to-one coaching is available for anyone who wants a program built around their own body and their own goals.",
  },
  {
    icon: "IndianRupee",
    title: "Honest, Affordable Pricing",
    body: "₹1,200 a month. No hidden joining fees, no surprise add-ons — serious coaching priced for a neighbourhood gym, not a premium chain.",
  },
];

// Pulled from the gym's public Google listing (4.8 rating, 51 reviews at time
// of writing). Google only surfaces a handful of review snippets per place
// and doesn't expose a per-review star value, so this list is limited to the
// reviews that read as clearly 5-star and are actually about the gym floor
// (one real review about "Sunday practice classes" was about the academy,
// now closed, so it's left out; one explicitly says "four-star experience"
// so it's excluded too). Paste in more from the Google Business dashboard —
// which shows all 51 with their star ratings — to fill this out further.
export const REVIEWS = [
  {
    id: "review-1",
    text: "The instructors here are the best part — professional, comfortable, and genuinely motivating to train under.",
    rating: 5,
  },
  {
    id: "review-2",
    text: "Great amenities, and trainers who are skilled without ever being intimidating.",
    rating: 5,
  },
  {
    id: "review-3",
    text: "Supportive staff, newer equipment, and a familiar, welcoming gym floor.",
    rating: 5,
  },
];

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
