import type { TourDetailContent } from "@/data/tour-details/types";

export const tourDetailsBySlug: Record<string, TourDetailContent> = {
  "beach-safari-relaxing": {
    tourId: "fixed-5-opt1",
    slug: "beach-safari-relaxing",
    optionLabel: "Option 01:",
    pageTitle: "Beach + Safari (Relaxing Tour)",
    metaDescription:
      'Five-day "No Hurry" journey through Sri Lanka\'s southern coast — Galle, Mirissa, Yala, and the shoreline.',
    durationLabel: "5 days",
    intro: [
      "This tour covers the beautiful Down South of Sri Lanka at a slow, relaxing pace.",
    ],
    theme:
      '"No Hurry" – A peaceful journey through the southern coast.',
    days: [
      {
        title: "Day 01: Arrival & Galle Fort",
        bullets: [
          "Pick up from the airport and travel to Galle.",
          "Explore the historic Galle Fort.",
          "Local activities: Cinnamon peeling, Diving, Surfing, and visiting Jungle Beach.",
          "Enjoy the vibrant Nightlife in the evening.",
        ],
      },
      {
        title: "Day 02: Mirissa – Relax Beach Day",
        bullets: [
          "Travel to Mirissa for a full day of relaxation by the ocean.",
        ],
      },
      {
        title: "Day 03: Kataragama & Yala National Park",
        bullets: [
          "Visit the sacred city of Kataragama.",
          "Evening Safari at Yala National Park to see leopards and wild elephants.",
        ],
      },
      {
        title: "Day 04: The Coastline Loop",
        bullets: [
          "Visit the famous beaches of Weligama, Hikkaduwa, and Hiriketiya.",
        ],
      },
      {
        title: "Day 05: Departure",
        bullets: ["Travel back for your departure."],
      },
    ],
  },

  "hill-country-beach-express": {
    tourId: "fixed-5-opt2",
    slug: "hill-country-beach-express",
    optionLabel: "Option 02:",
    pageTitle: "Hill Country + Beach (Express Tour)",
    metaDescription:
      "Five-day express route through Negombo, Kandy, Nuwara Eliya, Ella, and Mirissa.",
    durationLabel: "5 days",
    intro: [
      "Hill Country, Culture, Tea Experience, and beautiful Beaches.",
    ],
    theme: "A fast-paced journey through culture, mountains, and sea.",
    days: [
      {
        title: "Day 01: Arrival & Negombo",
        bullets: ["Arrival and overnight stay in the coastal town of Negombo."],
      },
      {
        title: "Day 02: Kandy – The Cultural Capital",
        bullets: [
          "Visit the Temple of the Sacred Tooth Relic.",
          "Explore Ceylon Gems and the Royal Botanical Gardens.",
        ],
      },
      {
        title: "Day 03: Nuwara Eliya & Ella",
        bullets: [
          "Tea Experience: See how Ceylon tea is made in the mountains.",
          "Visit the historic Nuwara Eliya Post Office.",
          'Travel to Ella to experience the famous "Ella Town" vibe in the evening.',
        ],
      },
      {
        title: "Day 04: Mirissa – To the Coast",
        bullets: [
          "Travel from the mountains down to the sandy beaches of Mirissa.",
        ],
      },
      {
        title: "Day 05: Departure",
        bullets: ["Travel back for your departure."],
      },
    ],
  },

  "cultural-highland-express": {
    tourId: "fixed-5-opt3",
    slug: "cultural-highland-express",
    optionLabel: "7-Day Tour Option 01:",
    pageTitle: "The Cultural & Highland Express",
    metaDescription:
      "Seven days: Sigiriya, Kandy, Nuwara Eliya, Ella, Mirissa — village life, ancient history, and the hill country.",
    durationLabel: "7 days",
    intro: [
      "Historic sites, Village culture, Hill country views, and Beach time.",
    ],
    theme:
      "Village life, Ancient History, and the Beautiful Hill Country.",
    tips: [
      "For Sigiriya Rock, we recommend starting the climb at 7:00 AM. This helps you beat the heat and the crowds, so you can enjoy the 360-degree views in peace.",
    ],
    days: [
      {
        title: "Day 01: Arrival & Negombo",
        bullets: [
          "Relax by the beach after your flight.",
          "Visit the Fish Market and enjoy a scenic sunset.",
        ],
      },
      {
        title: 'Day 02: Sigiriya – The "Eighth Wonder"',
        bullets: [
          "Sigiriya Rock Fortress: Climb the UNESCO World Heritage site, famous for its giant Lion Paws and ancient palace ruins at the summit.",
          "Pidurangala Rock: A short hike for the best view of Sigiriya.",
          "Village Experience: Enjoy a traditional Sri Lankan lunch and a peaceful boat ride.",
        ],
      },
      {
        title: "Day 03: Kandy Cultural Hub",
        bullets: [
          "Visit the Temple of the Tooth, Ambuluwawa Tower, and the Royal Botanical Garden.",
        ],
      },
      {
        title: "Day 04: Nuwara Eliya Mountains",
        bullets: [
          "Experience a Tea Factory tour, Moon Plains, and Gregory Lake.",
        ],
      },
      {
        title: "Day 05: Ella Town",
        bullets: [
          "Explore Nine Arch Bridge and Little Adam’s Peak. Enjoy the Ella nightlife.",
        ],
      },
      {
        title: "Day 06: Mirissa Beach",
        bullets: [
          "Travel to the southern coast for golden sands and relaxation.",
        ],
      },
      {
        title: "Day 07: Departure",
        bullets: ["Final travel back to the airport for your flight home."],
      },
    ],
  },

  "nature-safari-adventure": {
    tourId: "fixed-7-opt1",
    slug: "nature-safari-adventure",
    optionLabel: "7-Day Tour Option 02:",
    pageTitle: "Nature & Safari Adventure",
    metaDescription:
      "Seven days from Negombo and Kandy through Ella, Udawalawe safari, to Mirissa.",
    durationLabel: "7 days",
    intro: [
      "Cultural heritage, Hill country, Wildlife Safari, and Nightlife.",
    ],
    theme:
      "A journey through the mountains leading to the wild heart of Sri Lanka.",
    days: [
      {
        title: "Day 01: Arrival & Negombo",
        bullets: ["Smooth start to your journey in the coastal city."],
      },
      {
        title: "Day 02: Kandy",
        bullets: [
          "Visit the sacred sites and lush gardens of the hill capital.",
        ],
      },
      {
        title: "Day 03: Ella",
        bullets: [
          "Scenic travel to the most famous mountain town in Sri Lanka.",
        ],
      },
      {
        title: "Day 04: Ella & Udawalawe",
        bullets: [
          "Explore Ella in the morning; travel to Udawalawe in the evening.",
        ],
      },
      {
        title: "Day 05: Safari Day",
        bullets: [
          "Morning Safari in Udawalawe (Elephants!) and evening travel to Mirissa.",
        ],
      },
      {
        title: "Day 06: Mirissa Relax",
        bullets: ["A full day to enjoy the rhythm of the ocean."],
      },
      {
        title: "Day 07: Departure",
        bullets: ["Final travel back to the airport."],
      },
    ],
  },

  "beach-wildlife-dream": {
    tourId: "fixed-7-opt2",
    slug: "beach-wildlife-dream",
    optionLabel: "7-Day Tour Option 03:",
    pageTitle: "The Beach & Wildlife Dream",
    metaDescription:
      "Seven days on the south coast: Galle Fort, Mirissa, whale watching, Yala safari, and Colombo.",
    durationLabel: "7 days",
    intro: [],
    theme:
      'A relaxing journey focused on the ocean, coastal culture, and the "Big Game" of the wild.',
    days: [
      {
        title: "Day 01: Arrival & Galle Fort (UNESCO Heritage)",
        bullets: [
          "Transfer to the South Coast. Explore the historic ramparts of Galle Fort at sunset.",
        ],
      },
      {
        title: "Day 02: Galle Coastal Life",
        bullets: [
          "Local activities: Cinnamon peeling, a traditional boat ride, and swimming at the hidden Jungle Beach.",
        ],
      },
      {
        title: "Day 03: Mirissa – Morning Whale Watching",
        bullets: [
          "Early Morning: Join a professional boat tour to spot Blue Whales and Spinner Dolphins.",
          "Afternoon: Visit Coconut Tree Hill for photos and relax on Mirissa Beach.",
        ],
      },
      {
        title: "Day 04: Mirissa – Sun & Surf",
        bullets: [
          "A free day for surfing lessons in Weligama or pure relaxation on the golden sands of Mirissa.",
        ],
      },
      {
        title: "Day 05: Yala Safari – The Leopard Search",
        bullets: [
          "Morning travel to Yala (~2 to 2.5 hours).",
          "Evening Safari: Enter Yala National Park to search for leopards, bears, and wild elephants.",
        ],
      },
      {
        title: "Day 06: Colombo City & Shopping",
        bullets: [
          "Travel to the capital. Sightseeing at Lotus Tower, Gangaramaya Temple, and time for souvenir shopping.",
        ],
      },
      {
        title: "Day 07: Departure",
        bullets: ["Final transfer to the airport."],
      },
    ],
    notes: [
      {
        title: "Important note for Meridiano Ceylon clients",
        body:
          "Whale Watching Season: The best time for this activity in Mirissa is from November to April. If your guests are traveling between May and October, we recommend swapping this for a coastal mangrove safari or visiting the East Coast.",
      },
    ],
  },

  "ancient-cultural-grand-tour": {
    tourId: "fixed-10-opt1",
    slug: "ancient-cultural-grand-tour",
    optionLabel: "10-Day Tour Option 01:",
    pageTitle: "The Ancient & Cultural Grand Tour",
    metaDescription:
      "Ten days: Anuradhapura, Sigiriya, Dambulla, Kandy, Nuwara Eliya, Ella, Mirissa, and Colombo.",
    durationLabel: "10 days",
    intro: [],
    focus:
      "Ancient Cities, UNESCO Heritage, and the Hill Country.",
    days: [
      {
        title: "Day 01: Arrival & Transfer to Negombo",
        bullets: [
          "Arrival and transfer to Negombo.",
          "Visit the Fish Market and enjoy a scenic sunset.",
        ],
      },
      {
        title: "Day 02: Travel to Anuradhapura",
        bullets: [
          "Explore the Ancient Capital, Atamasthanaya, Mihintale, and the Moon Stone.",
        ],
      },
      {
        title: "Day 03: Sigiriya",
        bullets: [
          "Climb the UNESCO Sigiriya Rock and Pidurangala.",
          "Enjoy a traditional Village Boat Ride.",
        ],
      },
      {
        title: "Day 04: Sigiriya & Dambulla",
        bullets: [
          "Morning Safari at Minneriya National Park followed by a visit to the Dambulla Cave Temple.",
        ],
      },
      {
        title: "Day 05: Travel to Kandy",
        bullets: [
          "Visit the Temple of the Tooth and explore the city.",
        ],
      },
      {
        title: "Day 06: Nuwara Eliya",
        bullets: [
          "Enjoy the tea estates and cool mountain air. Evening travel to Ella.",
        ],
      },
      {
        title: "Day 07: Ella",
        bullets: [
          "Explore the Nine Arch Bridge and Little Adam’s Peak.",
        ],
      },
      {
        title: "Day 08: Mirissa",
        bullets: [
          "Relax on the beach or visit any other South Coast beach.",
        ],
      },
      {
        title: "Day 09: Colombo",
        bullets: ["Full city tour and final sightseeing."],
      },
      {
        title: "Day 10: Departure",
        bullets: ["Departure."],
      },
    ],
    tenDayClientSummary: true,
  },

  "southern-beach-wildlife-loop": {
    tourId: "fixed-7-opt3",
    slug: "southern-beach-wildlife-loop",
    optionLabel: "10-Day Tour Option 02:",
    pageTitle: "The Southern Beach & Wildlife Loop",
    metaDescription:
      "Ten days: Kalutara, Bentota, Galle, Mirissa, Yala, Ella, Nuwara Eliya, Kandy, and Colombo.",
    durationLabel: "10 days",
    intro: [],
    focus: "Coastal relaxation, Galle history, and Safari.",
    days: [
      {
        title: "Day 01: Arrival & Transfer to Kalutara",
        bullets: ["Arrival and transfer to Kalutara for your first night."],
      },
      {
        title: "Day 02: Bentota or Hikkaduwa",
        bullets: [
          "Spend the day by the sea. Evening visit to Galle Fort.",
        ],
      },
      {
        title: "Day 03: Galle & Mirissa",
        bullets: [
          "Cinnamon peeling, Jungle Beach, and a Boat Ride. Evening travel to Mirissa.",
        ],
      },
      {
        title: "Day 04: Mirissa",
        bullets: [
          "A full day of beach relaxation and coastal vibes.",
        ],
      },
      {
        title: "Day 05: Travel to Yala",
        bullets: ["Evening or morning Safari to search for leopards."],
      },
      {
        title: "Day 06: Ella",
        bullets: [
          "Travel to the mountains and enjoy the Ella town atmosphere.",
        ],
      },
      {
        title: "Day 07: Nuwara Eliya",
        bullets: ['Visit the "Little England" of Sri Lanka.'],
      },
      {
        title: "Day 08: Kandy",
        bullets: ["Visit the sacred Temple of the Tooth."],
      },
      {
        title: "Day 09: Colombo",
        bullets: ["City tour and shopping."],
      },
      {
        title: "Day 10: Departure",
        bullets: ["Departure."],
      },
    ],
    tenDayClientSummary: true,
  },

  "wildlife-wellness-safari": {
    tourId: "fixed-10-opt2",
    slug: "wildlife-wellness-safari",
    optionLabel: "10-Day Tour Option 03:",
    pageTitle: "Wildlife & Wellness Safari",
    metaDescription:
      "Ten days: Sigiriya, Habarana wellness, Minneriya, Ella, Buduruwagala, Yala, and Hiriketiya.",
    durationLabel: "10 days",
    intro: [],
    theme:
      "A rhythmic journey through nature, ancient history, and spiritual healing.",
    days: [
      {
        title: "Day 01: Arrival & Negombo",
        bullets: [
          "Pick up from the airport and transfer to the coastal town of Negombo for your first night.",
        ],
      },
      {
        title: "Day 02: Sigiriya & Pidurangala",
        bullets: [
          'Climb the UNESCO World Heritage Sigiriya Rock Fortress and hike Pidurangala Rock for the best view of the "Eighth Wonder".',
        ],
      },
      {
        title: "Day 03: Habarana Village & Wellness",
        bullets: [
          "Travel to Habarana for an authentic Village Experience including a traditional lunch and boat ride.",
          "Relax with a professional Ayurvedic Spa & Wellness session.",
        ],
      },
      {
        title: "Day 04: Hiriwaduna Trek & Safari",
        bullets: [
          "Enjoy the Hiriwaduna Village Trek to experience local nature.",
          "Evening Safari: Head to Minneriya National Park to witness the gathering of wild elephants.",
        ],
      },
      {
        title: "Day 05: Travel to Ella",
        bullets: [
          "Journey into the central highlands to the famous mountain town of Ella.",
        ],
      },
      {
        title: "Day 06: Ella Exploration",
        bullets: [
          "Hike Ella Rock and visit the iconic Nine Arch Bridge and Little Adam's Peak.",
          "Take a city tour to experience the local Ella atmosphere.",
        ],
      },
      {
        title: "Day 07: Waterfalls & Ancient Art",
        bullets: [
          "Visit Ravana Waterfall and the 10th-century Buduruwagala rock carvings.",
          "Travel to Tissamaharama for your overnight stay.",
        ],
      },
      {
        title: "Day 08: Yala Leopard Safari",
        bullets: [
          "Full Day Safari: Enter Yala National Park for a thrilling experience searching for leopards, sloth bears, and elephants.",
        ],
      },
      {
        title: "Day 09: Hiriketiya Beach Relaxing",
        bullets: [
          "Travel to the horseshoe-shaped Hiriketiya Beach for a full day of relaxation, surfing, or yoga.",
        ],
      },
      {
        title: "Day 10: Departure",
        bullets: [
          "Final travel back to the airport for your departure.",
        ],
      },
    ],
    tenDayClientSummary: true,
  },

  "meridiano-hidden-gems": {
    tourId: "fixed-10-opt3",
    slug: "meridiano-hidden-gems",
    optionLabel: "10-Day Tour Option 04:",
    pageTitle: "Meridiano Ceylon Special (Hidden Gems)",
    metaDescription:
      "Ten days: Kandy, Horton Plains, Diyaluma, Ella, Udawalawe, Mirissa, and Galle.",
    durationLabel: "10 days",
    intro: [],
    focus: "Tracking, Waterfalls, and the best of Wellawaya.",
    days: [
      {
        title: "Day 01: Arrival & Transfer to Negombo",
        bullets: ["Pick up from the airport and overnight in Negombo."],
      },
      {
        title: "Day 02: Kandy",
        bullets: ["Explore the cultural heart of the island."],
      },
      {
        title: "Day 03: Nuwara Eliya",
        bullets: ["Beautiful tea landscapes."],
      },
      {
        title: "Day 04: Horton Plains",
        bullets: [
          "Trek through the national park. Evening in Haputale.",
        ],
      },
      {
        title: "Day 05: The Waterfall Experience",
        bullets: [
          "Visit Upper Diyaluma (Hidden Gem) and Elle Wala in Wellawaya. Evening in Ella Town.",
        ],
      },
      {
        title: "Day 06: Ella & Buduruwagala",
        bullets: [
          "Ella city tour and the ancient rock carvings at Buduruwagala. Evening in Udawalawe.",
        ],
      },
      {
        title: "Day 07: Udawalawe Safari",
        bullets: [
          "Morning elephant safari. Afternoon travel to Mirissa.",
        ],
      },
      {
        title: "Day 08: Mirissa",
        bullets: ["Enjoy the sun, sand, and surf."],
      },
      {
        title: "Day 09: Galle",
        bullets: ["Final stop at the historic Dutch Fort."],
      },
      {
        title: "Day 10: Departure",
        bullets: ["Departure."],
      },
    ],
    tenDayClientSummary: true,
  },

  "north-south-expedition": {
    tourId: "fixed-16-opt1",
    slug: "north-south-expedition",
    optionLabel: "16-Day Ultimate Grand Tour:",
    pageTitle: "North to South Expedition",
    metaDescription:
      "Sixteen days from Negombo and the Cultural Triangle to Jaffna, the east coast, hill country, Yala, and Galle.",
    durationLabel: "16 days",
    intro: [],
    focus:
      "A complete cross-country journey from the northernmost tip to the southern coast of Sri Lanka.",
    phases: [
      {
        title: "Phase 1: The Cultural Triangle & The Far North",
        days: [
          {
            title: "Day 01: Arrival & Negombo",
            bullets: [
              "Transfer from the airport to the coastal town of Negombo.",
            ],
          },
          {
            title: "Day 02: Sigiriya & Dambulla",
            bullets: [
              "Explore the historic rock fortress and cave temples.",
            ],
          },
          {
            title: "Day 03: Anuradhapura",
            bullets: ["Visit the ancient sacred city."],
          },
          {
            title: "Day 04: Jaffna (The Long Ride)",
            bullets: ["Travel to the northern peninsula."],
          },
          {
            title: "Day 05: Jaffna City Tour",
            bullets: [
              "Visit Point Pedro, Nallur Kovil, and enjoy a relaxing day in the city.",
            ],
          },
        ],
      },
      {
        title: "Phase 2: The Eastern Coast & Ancient Kingdoms",
        days: [
          {
            title: "Day 06: Trincomalee",
            bullets: [
              "Journey to the east coast for beach time and sightseeing.",
            ],
          },
          {
            title: "Day 07: Pasikuda & Polonnaruwa",
            bullets: [
              "Travel to Pasikuda for relaxation, followed by a visit to the ancient kingdom of Polonnaruwa.",
            ],
          },
          {
            title: "Day 08: Kandy",
            bullets: [
              "Travel to the hill capital and cultural center.",
            ],
          },
        ],
      },
      {
        title: "Phase 3: The Hill Country & Waterfall Trail",
        days: [
          {
            title: "Day 09: Nuwara Eliya",
            bullets: [
              'Experience the cool climate and tea estates of "Little England".',
            ],
          },
          {
            title: "Day 10: Ella",
            bullets: ["Scenic travel to the mountain town of Ella."],
          },
          {
            title: "Day 11: Ella Exploration",
            bullets: [
              "A full day to enjoy the sights and atmosphere of Ella.",
            ],
          },
          {
            title: "Day 12: The Wellawaya Trail",
            bullets: [
              "Visit Buduruwagala and Diyaluma Falls.",
              "Evening: Travel to Tissamaharama.",
            ],
          },
        ],
      },
      {
        title: "Phase 4: The Wild South & Coastal Finish",
        days: [
          {
            title: "Day 13: Yala Safari",
            bullets: [
              "Experience a wildlife safari in Yala National Park.",
              "Evening: Travel to Mirissa.",
            ],
          },
          {
            title: "Day 14: The Southern Tip",
            bullets: [
              "Visit the Dondra Head Lighthouse and relax at Mirissa beach.",
            ],
          },
          {
            title: "Day 15: Galle",
            bullets: ["Explore the historic Galle Fort."],
          },
          {
            title: "Day 16: Departure",
            bullets: ["Final transfer for your journey home."],
          },
        ],
      },
    ],
    highlightBullets: [
      "The Complete Island: This tour travels from the very top at Point Pedro to the very bottom at Dondra Head.",
      "Diverse Experiences: Covers everything from the northern culture of Jaffna to the eastern beaches of Trincomalee and the misty mountains of Ella.",
      "Local Treasures: Features unique spots like Buduruwagala and Diyaluma Falls near Wellawaya.",
    ],
  },
};

export const tourDetailSlugs = Object.keys(tourDetailsBySlug);

export function getTourDetailBySlug(slug: string): TourDetailContent | undefined {
  return tourDetailsBySlug[slug];
}
