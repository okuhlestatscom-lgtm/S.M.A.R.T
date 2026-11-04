/**
 * S.M.A.R.T - Sound Ministry and Reformation Tools
 * The Smart Leaders Family Of Churches
 * Data layer for Apostle Nicholas Dlamini's Apostolic & Prophetic Library
 */

export interface Teaching {
  id: string;
  title: string;
  subtitle: string;
  format: 'audio' | 'video' | 'pdf';
  category: 'Apostolic Order' | 'Ministry Delay Traps' | 'Holy Ghost Fire' | 'Prophetic Accuracy' | 'Fivefold Architecture' | 'Sound Doctrine';
  author: string;
  date: string;
  duration: string;
  scriptures: string[];
  description: string;
  keyRevelations: string[];
  audioDurationSeconds?: number;
  audioUrl?: string;
  youtubeUrl?: string;
  youtubeVideoId?: string;
  pdfContent?: {
    summary: string;
    chapters: { title: string; paragraphs: string[] }[];
    reformationChecklist: string[];
  };
  videoDetails?: {
    embedId: string;
    timestamps: { time: string; label: string }[];
  };
  downloadsCount: number;
  listenCount: number;
  isFeatured?: boolean;
}

export const extractYouTubeVideoId = (input?: string): string => {
  if (!input) return '';
  const trimmed = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|live\/|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : '';
};

export interface Book {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  coverImage: string;
  type: 'Hardcover' | 'Paperback' | 'eBook' | 'Digital Universal Edition';
  publishYear: string;
  pages: number;
  price: string;
  courierFee?: string;
  foreword?: string;
  publisher?: string;
  churchBuildingSupport?: string;
  scriptureTheme?: string;
  onlinePurchaseUrl?: string; // Books2Read universal link
  synopsis: string;
  keyTakeaways: string[];
  sampleChapters: {
    number: number;
    title: string;
    text: string[];
  }[];
  pdfDownloadUrl?: string;
  isBestseller?: boolean;
  category?: 'Marketplace & Governance' | 'Prayer & Intercession' | 'Apostolic Architecture' | 'Spiritual Warfare & Deliverance' | 'Leadership';
}

export const YOUTUBE_CHANNEL_URL = 'https://youtube.com/@intensewordsessionswithnic7314?si=sepyXjlwBicYTjZg';
export const YOUTUBE_CHANNEL_NAME = 'Intense Word Sessions With Nicholas Dlamini';
export const YOUTUBE_CHANNEL_HANDLE = '@intensewordsessionswithnic7314';

export interface JournalEntry {
  id: string;
  title: string;
  date: string;
  category: 'Scripture Study' | 'Prayer Petition' | 'Prophetic Revelation' | 'Personal Devotion' | 'Ministry Directive';
  scriptures: string[];
  notes: string;
  prayerPoints: string[];
  isAnswered: boolean;
  answeredDate?: string;
  answeredTestimony?: string;
  linkedResource?: {
    type: 'teaching' | 'book' | 'petition';
    id: string;
    title: string;
  };
  tags: string[];
}

export interface ItineraryEvent {
  id: string;
  title: string;
  theme: string;
  hostMinistry: string;
  city: string;
  country: string;
  venue: string;
  dateRange: string;
  startDateISO: string;
  endDateISO?: string;
  sessionTimes: string;
  status: 'Upcoming' | 'Live Now' | 'Completed';
  livestreamAvailable: boolean;
  livestreamPlatform?: string;
  livestreamUrl?: string;
  rsvpCount: number;
  rsvpCapacity: number;
  scripture: string;
  contactEmail: string;
  speaker?: string;
  description?: string;
  reminderSynced?: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'live' | 'teaching' | 'book' | 'itinerary' | 'report' | 'announcement';
  urgent?: boolean;
  read: boolean;
  targetTab?: string;
  imageUrl?: string; // Attached poster, book cover, or event flyer
  imageCaption?: string;
  actionLabel?: string;
  actionUrl?: string;
}

export interface PosterPreset {
  id: string;
  name: string;
  category: 'Book Cover' | 'Event Flyer' | 'Portrait' | 'Ministry Seal';
  url: string;
  thumbnail: string;
  description: string;
}

export const MINISTRY_POSTER_PRESETS: PosterPreset[] = [
  {
    id: 'secular-babylon-cover',
    name: 'How to Operate in Secular Babylon',
    category: 'Book Cover',
    url: '/assets/aistudio/FB_IMG_1793479297508_fa43cc88.jpg',
    thumbnail: '/assets/aistudio/FB_IMG_1793479297508_fa43cc88.jpg',
    description: 'Official 3D Hardcover Flyer · R399 + R60 Courier'
  },
  {
    id: 'prayer-manual-cover',
    name: 'The Apostolic and Prophetic Prayer Manual',
    category: 'Book Cover',
    url: '/assets/aistudio/FB_IMG_1793479322670_4123012d.jpg',
    thumbnail: '/assets/aistudio/FB_IMG_1793479322670_4123012d.jpg',
    description: 'Official Gold-Seal Flyer · R350 · Church Building Fund'
  },
  {
    id: 'five-senses-cover',
    name: 'Five Senses of Successful Leaders',
    category: 'Book Cover',
    url: '/assets/aistudio/FB_IMG_1793479335252_6e135219.jpg',
    thumbnail: '/assets/aistudio/FB_IMG_1793479335252_6e135219.jpg',
    description: 'Official Leadership Flyer · R100 + R60 Paxi'
  },
  {
    id: 'apostle-nicholas-portrait',
    name: 'Apostle Nicholas Dlamini — Official Portrait',
    category: 'Portrait',
    url: '/assets/aistudio/FB_IMG_1793479262926_b609c63e.jpg',
    thumbnail: '/assets/aistudio/FB_IMG_1793479262926_b609c63e.jpg',
    description: 'Senior Builder & Founder · S.M.A.R.T'
  },
  {
    id: 'smart-ministry-seal',
    name: 'S.M.A.R.T Golden Ministry Seal',
    category: 'Ministry Seal',
    url: '/assets/aistudio/file_000000007c2c8208b2cc5202023513b7_3aeb00d7.png',
    thumbnail: '/assets/aistudio/file_000000007c2c8208b2cc5202023513b7_3aeb00d7.png',
    description: 'The Smart Leaders Family Of Churches Official Emblem'
  }
];

export interface BookmarkStore {
  teachingIds: string[];
  bookIds: string[];
  journalIds?: string[];
}

export interface MinisterialReport {
  id: string;
  title: string;
  category: 'Apostolic Communique' | 'Revival Dispatch' | 'Field Report' | 'Building Project';
  summary: string;
  content: string[];
  author: string;
  date: string;
  location?: string;
  scriptures?: string[];
  stats?: { label: string; value: string }[];
  isFeatured?: boolean;
}

export interface BookOrder {
  id: string;
  bookId: string;
  bookTitle: string;
  bookPrice: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryMethod: 'courier' | 'paxi';
  deliveryAddress: string;
  timestamp: string;
  status: 'Pending Review' | 'Dispatched via Courier' | 'Collected via PAXI' | 'Delivered';
  notes?: string;
}

export interface PrayerPetition {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  category: 'Ministry Direction' | 'Deliverance & Healing' | 'Church Planting' | 'Financial Breakthrough' | 'Family & Marriage';
  petitionText: string;
  timestamp: string;
  prayedOver: boolean;
  ministerNote?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isGoogleAccount: boolean;
  googleSub?: string;
  joinedDate: string;
  lastSyncedAt?: string;
  role: 'leader' | 'believer' | 'intercessor' | 'pastor' | 'apostle';
  isAdmin?: boolean;
}

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'b-babylon',
    title: 'How to Operate in Secular Babylon',
    subtitle: 'Learn how to live, work and make an impact in a world that is not of God',
    author: 'Nicholas Dlamini',
    coverImage: '/assets/aistudio/FB_IMG_1793479297508_fa43cc88.jpg',
    type: 'Paperback',
    publishYear: 'ND Publishers',
    pages: 260,
    price: 'R399',
    courierFee: '+ R60 Courier Fee',
    foreword: 'Foreword by Apostle Christopher Kobane',
    publisher: 'ND Publishers — Words that Inspire. Truths that Last.',
    category: 'Marketplace & Governance',
    synopsis: 'A timely kingdom resource for a generation called to impact. Drawing deep biblical insights and practical wisdom, Apostle Nicholas Dlamini provides spiritual discernment and kingdom blueprints for believers who must thrive, conquer, and lead in secular corporate, political, and academic environments without bowing to modern Babylonian systems.',
    keyTakeaways: [
      'Biblical Insights: Uncompromising kingdom values that preserve your spiritual identity in hostile environments.',
      'Practical Guidance: Strategic wisdom for thriving professionally and entrepreneurially in modern Babylon.',
      'Spiritual Discernment: Recognizing subtle cultural traps, demonic compromises, and ideological shifts.',
      'Kingdom Impact: Operating with the exceptional spirit and excellence of Daniel, Joseph, and Esther.'
    ],
    sampleChapters: [
      {
        number: 1,
        title: 'The Challenge of Secular Babylon',
        text: [
          'We live in a world governed by systems, values, and philosophies that frequently oppose the government of God. Babylon is not merely an ancient historical city; it is an enduring spirit that seeks to assimilate God’s covenant people into its culture.',
          'Daniel and his companions were brought into the palace of King Nebuchadnezzar. They were given Babylonian education, Babylonian names, and Babylonian portions of meat and wine. Yet Daniel purposed in his heart that he would not defile himself.',
          'To make kingdom impact in our generation, we must learn the delicate art of being IN the world, functioning at the highest tier of competence, while remaining fiercely untouched by its spirit.'
        ]
      },
      {
        number: 2,
        title: 'The Daniel Paradigm: Excellence as Spiritual Authority',
        text: [
          'The secular marketplace does not yield to empty spiritual slogans; it bows to extraordinary solutions, character, and supernatural competence.',
          'Scripture notes that an excellent spirit was found in Daniel, and the king thought to set him over the whole realm. When you demonstrate solutions that Babylonian astrologers cannot match, secular kings will seek the God you serve.'
        ]
      }
    ],
    pdfDownloadUrl: '#sample-download',
    isBestseller: true
  },
  {
    id: 'b-prayer-manual',
    title: 'The Apostolic and Prophetic Prayer Manual',
    subtitle: 'A Practical Guide to Effective and Purpose-Driven Prayer',
    author: 'Nicholas Dlamini',
    coverImage: '/assets/aistudio/FB_IMG_1793479322670_4123012d.jpg',
    type: 'Hardcover',
    publishYear: 'Apostolic Imprint',
    pages: 295,
    price: 'R350',
    onlinePurchaseUrl: 'https://books2read.com/u/3nBkvB',
    churchBuildingSupport: 'NB: The profits of this book will go towards our church building project. Thank you for your support.',
    scriptureTheme: 'James 5:16 — "The effectual, fervent prayer of a righteous man avails much."',
    category: 'Prayer & Intercession',
    synopsis: 'A powerful guide to prayer that transforms. Deepen your faith, align with God, and see His power move! Be equipped, be empowered, and change spiritual atmospheres. Purchase online globally or order physical copies directly—all book profits go towards our church building project.',
    keyTakeaways: [
      'Deepen Your Faith: Move beyond repetitive ritual into deep communion and governmental authority.',
      'Align With God: Discern celestial blueprints so your intercession hits the bullseye every time.',
      'See His Power Move: Unleash apostolic breakthroughs over families, local churches, and territories.',
      'Support Kingdom Expansion: All book profits directly build the house of the Lord.'
    ],
    sampleChapters: [
      {
        number: 1,
        title: 'The Fire on the Altar: Restoring Fervent Prayer',
        text: [
          'Prayer is not an occasional religious duty; it is the spiritual oxygen of the kingdom builder. Leviticus 6:13 commands that the fire upon the altar shall be kept burning continually; it shall not go out.',
          'When prayer dies, human programming steps in to manufacture artificial excitement. But when apostolic and prophetic intercession is ignited, divine atmosphere shifts, bondages snap, and God’s glory invades the sanctuary.',
          'In this chapter, we outline the sacred protocols of building an unquenchable personal prayer altar that transforms your ministry and community.'
        ]
      },
      {
        number: 2,
        title: 'Atmospheric Domination and Territorial Breakthrough',
        text: [
          'Territories are not taken by natural charisma; they are claimed on the knees through purpose-driven prophetic decree.',
          'Jesus taught us to pray: "Your Kingdom come, Your will be done on earth as it is in heaven." True prayer is enforcing celestial law into earthly circumstances until righteousness reigns.'
        ]
      }
    ],
    pdfDownloadUrl: '#sample-download',
    isBestseller: true
  },
  {
    id: 'b-kingdom-commerce',
    title: 'Kingdom Commerce',
    subtitle: 'God’s Economic Blueprint for Wealth Creation, Stewardship and Dominion',
    author: 'Nicholas Dlamini',
    coverImage: '/assets/books/cover_kingdom_commerce_1793484734951.jpg',
    type: 'Digital Universal Edition',
    publishYear: 'Kingdom Economics',
    pages: 230,
    price: 'Digital Online',
    onlinePurchaseUrl: 'https://books2read.com/u/mKANPy',
    category: 'Marketplace & Governance',
    synopsis: 'An apostolic treatise on God’s system of commerce versus the Babylonian trade system. Unlocks kingdom wealth transfer, righteous financial intelligence, covenant giving, and economic hegemony for believers in the 21st century.',
    keyTakeaways: [
      'Differentiating Kingdom Commerce from carnal greed and worldly speculation.',
      'The covenant mechanics of wealth generation according to Deuteronomy 8:18.',
      'Building multigenerational wealth and funding apostolic reformation.',
      'Navigating inflationary crises through supernatural financial wisdom.'
    ],
    sampleChapters: [
      {
        number: 1,
        title: 'The Dual Economic Realities',
        text: [
          'There are two economic systems operating in the earth: the economy of heaven, which operates on covenant, seedtime, harvest, and righteousness; and the economy of Babylon, which is built on usury, manipulation, and pride.',
          'When believers lack revelation on Kingdom Commerce, they become slaves to the lenders of Babylon. God desires His people to be the head and not the tail, lending to nations and borrowing from none.'
        ]
      }
    ],
    isBestseller: true
  },
  {
    id: 'b-spiritual-building',
    title: 'Spiritual Building Concepts for 21st Century Churches (Part 1)',
    subtitle: 'Apostolic blueprints for sound doctrine, governmental order and generational continuity',
    author: 'Nicholas Dlamini',
    coverImage: '/assets/books/cover_spiritual_building_1793484750555.jpg',
    type: 'Digital Universal Edition',
    publishYear: 'Apostolic Series',
    pages: 275,
    price: 'Digital Online',
    onlinePurchaseUrl: 'https://books2read.com/u/mBK9ay',
    category: 'Apostolic Architecture',
    synopsis: 'Master the foundational architecture of the New Testament church. Part One explores ascension gifts, establishing elders, constructing healthy ecclesiastical structures, and avoiding ministerial delays caused by faulty foundations.',
    keyTakeaways: [
      '1 Corinthians 3:10: Building as a wise master builder.',
      'Eldership and fivefold government operating in synergy.',
      'Transitioning from an entertainment auditorium to an apostolic deploying center.',
      'Safeguarding the flock from doctrinal drift and charismatic manipulation.'
    ],
    sampleChapters: [
      {
        number: 1,
        title: 'The Blueprint Shown on the Mount',
        text: [
          'Moses was cautioned by God: "See that you make everything according to the pattern." Building outside the celestial pattern results in structures that cannot host the glory of God.',
          'In this manual, we restore the divine architectural specifications that ensure churches remain vibrant and structurally sound for generations.'
        ]
      }
    ],
    isBestseller: true
  },
  {
    id: 'b-prosperity-covenant',
    title: 'Prosperity Under the New Covenant',
    subtitle: 'Redeemed from Poverty: Sound Biblical Prosperity Free from Manipulation',
    author: 'Nicholas Dlamini',
    coverImage: '/assets/books/cover_prosperity_covenant_1793484763847.jpg',
    type: 'Digital Universal Edition',
    publishYear: 'Doctrinal Series',
    pages: 210,
    price: 'Digital Online',
    onlinePurchaseUrl: 'https://books2read.com/u/mlged7',
    category: 'Marketplace & Governance',
    synopsis: 'A sound, scripture-saturated defense and exposition of covenant prosperity. Dispels both poverty theology and toxic prosperity gospel manipulation, presenting Christ’s completed redemption for the whole person.',
    keyTakeaways: [
      '2 Corinthians 8:9: Though He was rich, for your sake He became poor so that you might become rich.',
      'The purpose of covenant blessing: to establish His covenant and bless the nations.',
      'Eliminating guilt and financial fatalism among believers.',
      'Integrity, diligence, and divine favor working in unison.'
    ],
    sampleChapters: [
      {
        number: 1,
        title: 'Grace and Generosity',
        text: [
          'Biblical prosperity is not about hoarding riches; it is having all sufficiency in all things so that you may abound in every good work (2 Cor 9:8).',
          'We must teach sound doctrine that delivers believers from the spirit of poverty without leading them into the ditch of materialism.'
        ]
      }
    ]
  },
  {
    id: 'b-ehud',
    title: 'A Panoramic View into the Life of Ehud',
    subtitle: 'The Left-Handed Deliverer: Strategic Warfare and Unexpected Instruments',
    author: 'Nicholas Dlamini',
    coverImage: '/assets/books/cover_ehud_1793484784084.jpg',
    type: 'Digital Universal Edition',
    publishYear: 'Prophetic Exposition',
    pages: 195,
    price: 'Digital Online',
    onlinePurchaseUrl: 'https://books2read.com/u/boVpPv',
    category: 'Spiritual Warfare & Deliverance',
    synopsis: 'A deep revelatory journey into Judges 3. How God uses the overlooked, the unusual, and the unconventional ("left-handed") to strike decisive blows against demonic oppression and national captivity.',
    keyTakeaways: [
      'The mystery of the double-edged dagger strapped to the right thigh.',
      'Piercing through bloated spiritual oppressions and systemic strongholds.',
      'Why God chooses non-traditional ministers to lead generational breakthroughs.',
      'Courage, precision, and secrecy in prophetic warfare.'
    ],
    sampleChapters: [
      {
        number: 1,
        title: 'The Instrument Prepared in Secret',
        text: [
          'Ehud did not announce his strategy on social billboards. He forged a dagger of a cubit’s length and fastened it beneath his garments.',
          'True spiritual deliverers are prepared in the hidden chambers of prayer before they confront the kings of Moab.'
        ]
      }
    ]
  },
  {
    id: 'b-serpent',
    title: 'There’s A Serpent in My Way',
    subtitle: 'Exposing and Overcoming Satanic Roadblocks, Hindrances and Spiritual Traps',
    author: 'Nicholas Dlamini',
    coverImage: '/assets/books/cover_serpent_1793484800245.jpg',
    type: 'Digital Universal Edition',
    publishYear: 'Spiritual Warfare Series',
    pages: 220,
    price: 'Digital Online',
    onlinePurchaseUrl: 'https://books2read.com/u/bMVqvV',
    category: 'Spiritual Warfare & Deliverance',
    synopsis: 'Genesis 49:17 speaks of Dan as a serpent by the way, an adder in the path, that bites the horse’s heels. Uncovers the covert spiritual resistance encountered on the verge of breakthrough and how to crush the serpent’s head with apostolic authority.',
    keyTakeaways: [
      'Identifying the specific nature of reptilian resistance (Leviathan, Python, Serpentine spirits).',
      'Luke 10:19: Authority to trample upon serpents and scorpions.',
      'Protecting your heels: guarding against retaliatory spiritual attacks.',
      'Maintaining momentum when invisible roadblocks arise.'
    ],
    sampleChapters: [
      {
        number: 1,
        title: 'The Nature of the Roadblock',
        text: [
          'The enemy rarely fights what is stagnant; he positions himself in the pathway of men and women marching toward territorial takeover.',
          'Recognizing the subtle bite that seeks to throw the rider backward is half the battle won.'
        ]
      }
    ]
  },
  {
    id: 'b-zion-people',
    title: 'Zion People',
    subtitle: 'The Identity, Mandate and Governance of the Remnant Church',
    author: 'Nicholas Dlamini',
    coverImage: '/assets/books/cover_zion_people_1793484838886.jpg',
    type: 'Digital Universal Edition',
    publishYear: 'Prophetic Destiny',
    pages: 240,
    price: 'Digital Online',
    onlinePurchaseUrl: 'https://books2read.com/u/mZV0pD',
    category: 'Apostolic Architecture',
    synopsis: 'Hebrews 12:22: "You have come to Mount Zion, to the city of the living God." Explores the royal priesthood, the order of Melchizedek, and the supernatural stature of believers called to rule and reign in the end times.',
    keyTakeaways: [
      'Transitioning from Sinai (fear and law) to Zion (glory and government).',
      'The worship and throne room protocols of Zion.',
      'Establishing apostolic communities with kingdom culture.',
      'The rising of an uncompromising holy remnant across the nations.'
    ],
    sampleChapters: [
      {
        number: 1,
        title: 'The Ascent to Zion',
        text: [
          'Zion is the highest mountain of divine governmental expression. When the Lord builds up Zion, He appears in His glory.',
          'To be a Zion person is to carry heaven’s consciousness into every realm of human existence.'
        ]
      }
    ]
  },
  {
    id: 'b-new-season',
    title: 'The New Season',
    subtitle: 'Discerning Prophetic Shifts, Divine Transitions and Entering Your Kairos',
    author: 'Nicholas Dlamini',
    coverImage: '/assets/books/cover_new_season_1793484855110.jpg',
    type: 'Digital Universal Edition',
    publishYear: 'Prophetic Shift',
    pages: 185,
    price: 'Digital Online',
    onlinePurchaseUrl: 'https://books2read.com/u/mgBA1K',
    category: 'Prayer & Intercession',
    synopsis: 'Ecclesiastes 3:1 declares there is a time for every purpose under heaven. Equips believers and leaders to recognize when an old spiritual cycle has closed, how to shed past baggage, and how to step boldly into divine alignment for a new season of glory.',
    keyTakeaways: [
      'Recognizing the subtle warning signs that a season has expired.',
      'Navigating the turbulent transition hallway without panic.',
      'Embracing new grace, relationships, and territory.',
      'Entering your prophetic Kairos moment with accuracy.'
    ],
    sampleChapters: [
      {
        number: 1,
        title: 'The Ending of the Old',
        text: [
          'Nothing hinders a new season faster than trying to preserve the obsolete wineskins of yesterday.',
          'When God shifts the spiritual climate, sensitivity and obedience are paramount to avoid lingering in yesterday’s mana.'
        ]
      }
    ]
  },
  {
    id: 'b-mantics',
    title: 'Mantics',
    subtitle: 'Biblical Prophetic Ministry vs Modern Divination and Counterfeit Revelations',
    author: 'Nicholas Dlamini',
    coverImage: '/assets/books/cover_mantics_1793484868133.jpg',
    type: 'Digital Universal Edition',
    publishYear: 'Prophetic Ethics',
    pages: 205,
    price: 'Digital Online',
    onlinePurchaseUrl: 'https://books2read.com/u/mq2XYQ',
    category: 'Apostolic Architecture',
    synopsis: 'A critical diagnostic work dismantling modern mantic practices, false seership, and commercial divination that masquerade as the Holy Spirit in contemporary assemblies. Restores the pure apostolic fountain and holy fear of God.',
    keyTakeaways: [
      'Unmasking the roots of mantic divination and commercialized prophecy.',
      '1 Corinthians 14: Testing and judging prophetic utterances.',
      'The heart condition of a true prophet versus a modern diviner.',
      'Restoring the holy fear of the Lord to prophetic altars.'
    ],
    sampleChapters: [
      {
        number: 1,
        title: 'The Purity of the Stream',
        text: [
          'God spoke through Jeremiah: "They speak a vision of their own heart, not from the mouth of the Lord." We must discern the difference between genuine Holy Ghost inspiration and psychological or psychic projection.',
          'True prophecy exalts the Lord Jesus Christ and calls believers to holiness, righteousness, and kingdom alignment.'
        ]
      }
    ]
  },
  {
    id: 'b-five-senses',
    title: 'Five Senses of Successful Leaders',
    subtitle: 'Unlock the Mind of a Leader: Insights that Inspire. Senses that Lead.',
    author: 'Nicholas Dlamini',
    coverImage: '/assets/aistudio/FB_IMG_1793479335252_6e135219.jpg',
    type: 'Paperback',
    publishYear: 'Executive Edition',
    pages: 184,
    price: 'R100',
    courierFee: '+ R60 Paxi if you are in SA',
    category: 'Leadership',
    synopsis: 'Discover the five senses that drive extraordinary leadership. Packed with powerful insights, practical wisdom, and blueprints to lead with absolute confidence in ministry, business, and community. Priced accessibly for every emerging leader across Southern Africa and beyond.',
    keyTakeaways: [
      'Unlock the Mind of a Leader: Master the mental and spiritual psychology of extraordinary visionaries.',
      'The Five Senses: Cultivate the perceptual faculties that discern opportunities before others see them.',
      'Lead with Confidence: Overcome fear of failure, insecurity, and organizational paralysis.',
      'Accessible Leadership: Comprehensive wisdom made affordable for every rising leader.'
    ],
    sampleChapters: [
      {
        number: 1,
        title: 'Perception Before Action: The Sight of a Leader',
        text: [
          'A leader does not see merely with physical eyes; a true leader perceives through prophetic foresight and wisdom. What you see determines how you build.',
          'Where the crowd sees an intimidating giant in the Valley of Elah, David perceived an uncircumcised Philistine defying the armies of the living God. Leadership begins with calibrated perspective.',
          'This foundational chapter unlocks the first sense: cultivating vision that pierces through immediate crises into divine opportunity.'
        ]
      },
      {
        number: 2,
        title: 'The Sense of Discernment in Timing',
        text: [
          'Like the sons of Issachar who had understanding of the times to know what Israel ought to do, a successful leader knows when to wait, when to build, and when to march.',
          'Acting prematurely brings exhaustion; acting late brings regret. Discover how to hone your leadership instincts to walk in synchronization with heaven.'
        ]
      }
    ],
    pdfDownloadUrl: '#sample-download',
    isBestseller: false
  }
];

export const INITIAL_TEACHINGS: Teaching[] = [
  {
    id: 't-1',
    title: 'The Anatomy of Ministry Delays: Unmasking Subtle Traps',
    subtitle: 'Why gifted ministers wander in the wilderness for decades and how to escape premature elevation',
    format: 'audio',
    category: 'Ministry Delay Traps',
    author: 'Apostle Nicholas Dlamini',
    date: 'October 28, 2026',
    duration: '52 min audio',
    audioDurationSeconds: 3120,
    scriptures: ['1 Corinthians 3:10', 'Galatians 4:1-2', '1 Timothy 3:6'],
    description: 'An exhaustive apostolic deconstruction of the seven invisible traps that stall fivefold ministers in the 21st century. Discover the tension between charisma and government, the peril of uncircumcised gifts, and how spiritual fatherhood accelerates destiny.',
    keyRevelations: [
      'Charisma can open doors that character cannot keep open.',
      'The difference between an anointed speaker and an apostolic builder is doctrinal alignment.',
      'Premature public exposure before secret table processing aborts the kingdom mandate.',
      'Accountability is not subjugation; it is divine preservation against the traps of Saul.'
    ],
    pdfContent: {
      summary: 'Executive transcript detailing how to diagnose personal delays and re-anchor in sound ecclesiastical protocol.',
      chapters: [
        {
          title: 'Section I: The Illusion of Speed vs. Divine Acceleration',
          paragraphs: [
            'In our modern digital landscape, the temptation to accelerate public ministry before private character formation has incapacitated thousands of fivefold ministers. When a preacher seeks visibility before structural alignment, delay becomes inevitable.',
            'Paul spent years in Arabia being re-educated in the mysteries of Christ before he laid foundational stones in Antioch and Ephesus. Ministry delay is frequently God’s mercy preventing your gift from destroying your soul.'
          ]
        },
        {
          title: 'Section II: The Seven Subtle Snare Points',
          paragraphs: [
            '1. Lone-Ranger Syndrome: Severing oneself from seasoned fathers in the faith.',
            '2. Economic Entanglement: Sacrificing sound doctrine to placate financial sponsors.',
            '3. Prophetic Sensationalism: Substituting emotional theater for transformative truth.'
          ]
        }
      ],
      reformationChecklist: [
        'Audit your spiritual accountability structure.',
        'Evaluate whether your sermons emphasize Christ or sensational hype.',
        'Refuse invitations that compromise biblical doctrinal standards.'
      ]
    },
    downloadsCount: 1420,
    listenCount: 8930,
    isFeatured: true
  },
  {
    id: 't-2',
    title: 'Restoring The Holy Ghost Fire in Local Churches',
    subtitle: 'From liturgical formality to burning apostolic altars: Rekindling corporate revival',
    format: 'video',
    category: 'Holy Ghost Fire',
    author: 'Apostle Nicholas Dlamini',
    date: 'October 19, 2026',
    duration: '1h 14m masterclass',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeVideoId: 'dQw4w9WgXcQ',
    scriptures: ['Leviticus 6:12-13', 'Acts 2:1-4', 'Luke 3:16'],
    description: 'A prophetic clarion call for the restoration of genuine Pentecost in our modern assemblies. Apostle Nicholas tackles entertainment-driven church cultures and outlines the blueprint for perpetual prayer altars.',
    keyRevelations: [
      'The fire upon the altar shall be kept burning; it shall not be put out.',
      'When the Holy Ghost fire departs, human programming steps in to manufacture artificial excitement.',
      'A true revival does not leave believers in spiritual frenzy; it transforms morals, establishes righteousness, and births societal reformers.'
    ],
    videoDetails: {
      embedId: 'dQw4w9WgXcQ',
      timestamps: [
        { time: '04:15', label: 'The State of Modern Altars' },
        { time: '18:30', label: 'Why Fire Dies: The Fuel of Brokenness' },
        { time: '41:10', label: 'Apostolic Intercession Protocols' },
        { time: '1:02:40', label: 'Impartation & Prayer Charge' }
      ]
    },
    downloadsCount: 980,
    listenCount: 12450,
    isFeatured: true
  },
  {
    id: 't-3',
    title: 'The Fivefold Blueprint: Building Accurately for the 21st Century',
    subtitle: 'Structural alignment of apostles, prophets, evangelists, pastors, and teachers according to Ephesians 4',
    format: 'pdf',
    category: 'Fivefold Architecture',
    author: 'Apostle Nicholas Dlamini',
    date: 'October 10, 2026',
    duration: '38 pages PDF',
    scriptures: ['Ephesians 4:11-16', '1 Corinthians 12:28', 'Nehemiah 4:17'],
    description: 'A comprehensive study manual and ordination handbook for kingdom ministers. Complete with structural diagrams, governmental functions, and mutual checks-and-balances within the fivefold council.',
    keyRevelations: [
      'The fivefold gifts are not ecclesiastical titles; they are ascension functions for saint-equipping.',
      'When the prophetic functions without the apostolic foundation, the house suffers directional instability.',
      'The purpose of ministry is maturity: bringing the body into the measure of the stature of the fullness of Christ.'
    ],
    pdfContent: {
      summary: 'A detailed 38-page doctrinal monograph on restoring divine architecture to churches and apostolic networks.',
      chapters: [
        {
          title: 'Chapter 1: The Government of Ascension',
          paragraphs: [
            'Christ did not leave an amorphous organization; He structured His ekklesia with divine offices designed to build simultaneously upon revelation and righteousness.',
            'Each of the five offices carries a distinct lens. The Apostle brings foundation, order, and governance. The Prophet injects divine perspective and heart-cry. The Evangelist gathers the harvest. The Pastor protects the flock. The Teacher secures doctrinal anchorage.'
          ]
        },
        {
          title: 'Chapter 2: The Tragedy of Fivefold Dysfunction',
          paragraphs: [
            'In modern times, the pastoral office has been burdened with doing the work of all five offices alone. The result is exhaustion, ministerial failure, and congregations that remain forever infants.'
          ]
        }
      ],
      reformationChecklist: [
        'Form a multi-gifted leadership elder council.',
        'Shift church metrics from Sunday attendance to equipping deployment.',
        'Screen ministers based on sound doctrine and family governance.'
      ]
    },
    downloadsCount: 3510,
    listenCount: 4200,
    isFeatured: true
  },
  {
    id: 't-4',
    title: 'Sound Doctrine vs Modern Deceptions: Guarding the Deposit',
    subtitle: 'Navigating contemporary theological drift, syncretism, and hyper-grace illusions',
    format: 'audio',
    category: 'Sound Doctrine',
    author: 'Apostle Nicholas Dlamini',
    date: 'September 28, 2026',
    duration: '45 min audio',
    audioDurationSeconds: 2700,
    scriptures: ['Titus 1:9', '2 Timothy 4:2-4', 'Jude 1:3'],
    description: 'A fierce defense of biblical orthodoxy against modern compromises that dilute the power of the cross. Apostle Nicholas provides ministers with doctrinal rubrics to test teachings.',
    keyRevelations: [
      'Sound doctrine produces sound living; toxic doctrine produces broken communities.',
      'Grace does not cancel holiness; grace empowers holy living that human discipline could never achieve.',
      'Young preachers must learn Greek and Hebrew hermeneutics rather than preaching soundbites gathered from social media.'
    ],
    downloadsCount: 890,
    listenCount: 6300,
    isFeatured: false
  },
  {
    id: 't-5',
    title: 'Prophetic Accuracy & Ethical Boundaries: Purifying the Stream',
    subtitle: 'Restoring fear of the Lord in revelatory ministry and eliminating manipulation',
    format: 'video',
    category: 'Prophetic Accuracy',
    author: 'Apostle Nicholas Dlamini',
    date: 'September 14, 2026',
    duration: '58 min session',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeVideoId: 'dQw4w9WgXcQ',
    scriptures: ['1 Thessalonians 5:20-21', 'Ezekiel 13:1-7', 'Amos 3:7'],
    description: 'An apostolic masterclass on why prophecies must be judged, how to avoid monetary divination, and the character requirements for prophets operating in nations.',
    keyRevelations: [
      'Prophetic revelation must always submit to written scripture.',
      'A true prophet loves the bride of Christ more than their own platform.',
      'Never allow financial compensation to dictate the frequency or tone of God’s oracle.'
    ],
    videoDetails: {
      embedId: 'dQw4w9WgXcQ',
      timestamps: [
        { time: '02:00', label: 'The Tragedy of Commercialized Prophecy' },
        { time: '19:45', label: 'Testing Spirits: Biblical Criteria' },
        { time: '40:15', label: 'Prophetic Etiquette in Local Assemblies' }
      ]
    },
    downloadsCount: 1620,
    listenCount: 9400,
    isFeatured: false
  },
  {
    id: 't-iws-1',
    title: 'How to Operate in the Gifts of the Spirit',
    subtitle: 'Intense Word Sessions: Moving beyond sensationalism into biblical manifestation',
    format: 'video',
    category: 'Holy Ghost Fire',
    author: 'Apostle Nicholas Dlamini',
    date: 'October 24, 2026',
    duration: '48 min masterclass',
    youtubeUrl: 'https://youtube.com/@intensewordsessionswithnic7314?si=sepyXjlwBicYTjZg',
    youtubeVideoId: 'dQw4w9WgXcQ',
    scriptures: ['1 Corinthians 12:1-11', 'Romans 12:6', 'Hebrews 2:4'],
    description: 'From the official YouTube series "Intense Word Sessions With Nicholas Dlamini". Apostle Nicholas demystifies the nine gifts of the Holy Spirit, demonstrating how believers and pastors can flow with purity, divine love, and scriptural accuracy without emotional manipulation.',
    keyRevelations: [
      'Spiritual gifts are not badges of personal maturity; they are manifestations of the Spirit for the common good.',
      'The gifts of revelation (word of wisdom, word of knowledge, discerning of spirits) must align with the written Word.',
      'Operate in gifts from a posture of intimacy, never to impress human audiences.'
    ],
    videoDetails: {
      embedId: 'dQw4w9WgXcQ',
      timestamps: [
        { time: '00:00', label: 'Opening Prayer & Supernatural Protocols' },
        { time: '12:30', label: 'The 3 Clusters of Spiritual Gifts' },
        { time: '28:40', label: 'Discerning of Spirits vs Psychic Intuition' },
        { time: '41:15', label: 'Activation & Impartation Session' }
      ]
    },
    downloadsCount: 2840,
    listenCount: 15900,
    isFeatured: true
  },
  {
    id: 't-iws-2',
    title: 'How to Grow in the Ministry of Light',
    subtitle: 'Intense Word Sessions: Dispelling darkness and establishing kingdom governance',
    format: 'video',
    category: 'Apostolic Order',
    author: 'Apostle Nicholas Dlamini',
    date: 'October 16, 2026',
    duration: '54 min masterclass',
    youtubeUrl: 'https://youtube.com/@intensewordsessionswithnic7314?si=sepyXjlwBicYTjZg',
    youtubeVideoId: 'dQw4w9WgXcQ',
    scriptures: ['Matthew 5:14-16', 'John 1:4-5', 'Ephesians 5:8-14'],
    description: 'An illuminating masterclass on walking in the fullness of Christ as the light of the world. Apostle Nicholas uncovers how fivefold ministers operate as luminaries that expose institutional deception, bring divine illumination to marketplace sectors, and build with clarity.',
    keyRevelations: [
      'Light does not negotiate with darkness; where light appears, darkness must naturally dissipate.',
      'The ministry of light begins with internal transparency, truth in the inward parts, and repentance.',
      'A true reformation leader illuminates systems and leaves an indelible generational standard.'
    ],
    videoDetails: {
      embedId: 'dQw4w9WgXcQ',
      timestamps: [
        { time: '00:00', label: 'Apostolic Introduction: The Nature of Light' },
        { time: '14:20', label: 'Three Dimensions of Divine Illumination' },
        { time: '32:00', label: 'Walking Untouched by Babylon’s Shadows' },
        { time: '48:30', label: 'Consecration & Prayer of Illumination' }
      ]
    },
    downloadsCount: 1950,
    listenCount: 11200,
    isFeatured: true
  },
  {
    id: 't-iws-3',
    title: 'Understanding Prayer & The Prophetic Altar',
    subtitle: 'Intense Word Sessions: Moving from petitionary exhaustion to governmental intercession',
    format: 'video',
    category: 'Apostolic Order',
    author: 'Apostle Nicholas Dlamini',
    date: 'October 08, 2026',
    duration: '1h 02m masterclass',
    youtubeUrl: 'https://youtube.com/@intensewordsessionswithnic7314?si=sepyXjlwBicYTjZg',
    youtubeVideoId: 'dQw4w9WgXcQ',
    scriptures: ['Luke 18:1', 'James 5:16', '1 Thessalonians 5:17'],
    description: 'A deep-dive apostolic teaching on the mechanics of prayer. Why many prayers remain unanswered, how to partner with heaven’s legal system, and how to maintain perpetual fire on your personal and church prayer altars.',
    keyRevelations: [
      'Prayer is celestial legislation; you are not begging God, you are enforcing what the cross has completed.',
      'Fervent prayer is fueled by brokenness and righteousness, not mere emotional volume.',
      'When you pray biblically, spiritual resistance breaks and territorial gates swing open.'
    ],
    videoDetails: {
      embedId: 'dQw4w9WgXcQ',
      timestamps: [
        { time: '00:00', label: 'Foundational Truths on Spiritual Communion' },
        { time: '16:45', label: 'The Legal Courts of Heaven' },
        { time: '38:10', label: 'Praying with Apostolic Authority' },
        { time: '55:00', label: 'Altar Fire Impartation' }
      ]
    },
    downloadsCount: 3120,
    listenCount: 18400,
    isFeatured: true
  },
  {
    id: 't-iws-4',
    title: "40 Days in the Word: Unleashing the Power of God's Word",
    subtitle: 'Intense Word Sessions: A structured apostolic devotional journey into doctrinal alignment',
    format: 'video',
    category: 'Sound Doctrine',
    author: 'Apostle Nicholas Dlamini',
    date: 'September 20, 2026',
    duration: '1h 10m masterclass',
    youtubeUrl: 'https://youtube.com/@intensewordsessionswithnic7314?si=sepyXjlwBicYTjZg',
    youtubeVideoId: 'dQw4w9WgXcQ',
    scriptures: ['2 Timothy 3:16-17', 'Hebrews 4:12', 'Psalm 119:105'],
    description: 'The flagship teaching for the "40 Days in the Word" journey on the Intense Word Sessions channel. Discover how consistent, unadulterated exposure to biblical scripture dismantles ministerial delay, renews the builder’s mind, and sparks corporate revival.',
    keyRevelations: [
      'The Word of God is alive and powerful; it diagnoses what human psychiatry cannot reach.',
      'Never substitute ministerial hustle for daily immersion in the scriptures.',
      'A generation rooted in sound doctrine cannot be misled by counterfeit spirits.'
    ],
    videoDetails: {
      embedId: 'dQw4w9WgXcQ',
      timestamps: [
        { time: '00:00', label: 'Welcome to 40 Days in the Word' },
        { time: '18:15', label: 'The Anatomy of Biblical Truth' },
        { time: '42:30', label: 'How to Study the Word Hermeneutically' },
        { time: '1:02:00', label: 'Benediction & 40-Day Challenge' }
      ]
    },
    downloadsCount: 4200,
    listenCount: 24500,
    isFeatured: true
  }
];

export const INITIAL_ITINERARY: ItineraryEvent[] = [
  {
    id: 'it-1',
    title: 'Apostolic Reformation Summit 2026',
    theme: 'Building Accurately: Laying Foundations for End-Time Revival',
    hostMinistry: 'The Smart Leaders Family Of Churches · London Network',
    city: 'London',
    country: 'United Kingdom',
    venue: 'ExCeL London Convention Centre, Royal Victoria Dock',
    dateRange: 'Nov 12 - Nov 15, 2026',
    startDateISO: '2026-11-12T18:00:00Z',
    endDateISO: '2026-11-15T21:00:00Z',
    sessionTimes: 'Morning Leadership: 9:00 AM · Evening Impartation: 6:30 PM GMT',
    status: 'Upcoming',
    livestreamAvailable: true,
    livestreamPlatform: 'YouTube & SMART Live Portal',
    livestreamUrl: 'https://youtube.com/@intensewordsessionswithnic7314?si=sepyXjlwBicYTjZg',
    rsvpCount: 1420,
    rsvpCapacity: 2000,
    scripture: '1 Corinthians 3:10',
    speaker: 'Apostle Nicholas Dlamini',
    description: 'An international gathering of fivefold ministry builders, apostles, and prophets focusing on ecclesiastical architecture, spiritual fatherhood, and overcoming subtle delays in ministry.',
    contactEmail: 'itinerary@smartministrytools.org'
  },
  {
    id: 'it-2',
    title: 'School of Fivefold Builders Bootcamp',
    theme: 'Avoiding The Traps of Ministry Delay & Prophetic Alignment',
    hostMinistry: 'Kingdom Governance Apostolic Center',
    city: 'Atlanta, Georgia',
    country: 'United States',
    venue: 'Cobb Galleria Centre, Two Galleria Pkwy',
    dateRange: 'Dec 04 - Dec 07, 2026',
    startDateISO: '2026-12-04T10:00:00Z',
    endDateISO: '2026-12-07T18:00:00Z',
    sessionTimes: 'Intensive Masterclasses: 10:00 AM - 4:00 PM EST',
    status: 'Upcoming',
    livestreamAvailable: true,
    livestreamPlatform: 'YouTube & SMART Live Portal',
    livestreamUrl: 'https://youtube.com/@intensewordsessionswithnic7314?si=sepyXjlwBicYTjZg',
    rsvpCount: 680,
    rsvpCapacity: 850,
    scripture: 'Ephesians 4:11-12',
    speaker: 'Apostle Nicholas Dlamini',
    description: 'Intensive ordination bootcamp equipping rising pastors and ministers with sound doctrine, governance blueprints, and ethical guidelines for prophetic ministry.',
    contactEmail: 'usa-events@smartministrytools.org'
  },
  {
    id: 'it-3',
    title: 'The Holy Ghost Fire Revival Gathering',
    theme: 'Restoring The Fire Upon The Altar in Africa',
    hostMinistry: 'Assemblies of the Redeemed & Fire Apostolic Hub',
    city: 'Lagos',
    country: 'Nigeria',
    venue: 'TBS Main Arena, Onikan, Lagos Island',
    dateRange: 'Jan 15 - Jan 18, 2027',
    startDateISO: '2027-01-15T16:00:00Z',
    endDateISO: '2027-01-18T22:00:00Z',
    sessionTimes: 'Night of Perpetual Fire: 5:00 PM WAT Daily',
    status: 'Upcoming',
    livestreamAvailable: true,
    livestreamPlatform: 'SMART Global Satellite & YouTube Live',
    livestreamUrl: 'https://youtube.com/@intensewordsessionswithnic7314?si=sepyXjlwBicYTjZg',
    rsvpCount: 8400,
    rsvpCapacity: 12000,
    scripture: 'Leviticus 6:13',
    speaker: 'Apostle Nicholas Dlamini',
    description: 'A catalytic revival event igniting intercessory prayer altars across West Africa. Restoring the glory, holiness, and transformative power of God.',
    contactEmail: 'africa-mission@smartministrytools.org'
  },
  {
    id: 'it-4',
    title: 'Prophetic Order & Doctrinal Soundness Consultation',
    theme: 'Purifying the Prophetic Stream in Southern Africa',
    hostMinistry: 'The Smart Leaders Family Of Churches · Sandton Embassy',
    city: 'Johannesburg',
    country: 'South Africa',
    venue: 'Sandton Convention Centre, Maude St',
    dateRange: 'Feb 20 - Feb 22, 2027',
    startDateISO: '2027-02-20T17:00:00Z',
    endDateISO: '2027-02-22T21:00:00Z',
    sessionTimes: 'Apostolic Roundtables: 2:00 PM · Evening Sessions: 6:30 PM SAST',
    status: 'Upcoming',
    livestreamAvailable: true,
    livestreamPlatform: 'YouTube Live Portal',
    livestreamUrl: 'https://youtube.com/@intensewordsessionswithnic7314?si=sepyXjlwBicYTjZg',
    rsvpCount: 1150,
    rsvpCapacity: 1500,
    scripture: 'Titus 1:9',
    speaker: 'Apostle Nicholas Dlamini',
    description: 'High-level apostolic summit for senior leaders confronting the commercialization of prophecy and establishing biblical accountability structures.',
    contactEmail: 'sa-itinerary@smartministrytools.org'
  },
  {
    id: 'it-5',
    title: 'Eswatini National Apostolic Convocation',
    theme: 'Strategic Kingdom Living & Market Dominance',
    hostMinistry: 'The Smart Leaders Family Of Churches · Apostolic Headquarters',
    city: 'Mbabane',
    country: 'Eswatini',
    venue: 'Royal Swazi Spa Convention Centre, Ezulwini Valley',
    dateRange: 'March 18 - March 21, 2027',
    startDateISO: '2027-03-18T16:30:00Z',
    endDateISO: '2027-03-21T20:00:00Z',
    sessionTimes: 'Morning Equipping: 9:30 AM · Evening Impartation: 5:30 PM SAST',
    status: 'Upcoming',
    livestreamAvailable: true,
    livestreamPlatform: 'YouTube Live & Eswatini National Portal',
    livestreamUrl: 'https://youtube.com/@intensewordsessionswithnic7314?si=sepyXjlwBicYTjZg',
    rsvpCount: 2300,
    rsvpCapacity: 3000,
    scripture: 'Daniel 11:32',
    speaker: 'Apostle Nicholas Dlamini',
    description: 'Annual home convocation convening pastors, marketplace reformers, and kingdom entrepreneurs across Eswatini and Southern Africa.',
    contactEmail: 'admin@smartministrytools.org'
  }
];

export const INITIAL_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'j-1',
    title: 'Notes on 1 Corinthians 3:10 — Apostolic Foundations',
    date: 'October 30, 2026',
    category: 'Scripture Study',
    scriptures: ['1 Corinthians 3:10-15', 'Ephesians 2:20'],
    notes: 'According to the grace of God given to me, like a skilled master builder I laid a foundation. Notice Paul calls himself a wise master builder (architect). Foundation building is rarely flashy, but it is what sustains the weight of end-time revival. I must not rush into public elevation without solid internal character alignment.',
    prayerPoints: [
      'Lord, deliver my ministry from the snare of premature visibility.',
      'Grant me the spiritual blueprint and discernment of a master builder.',
      'Align our church eldership with sound doctrine and holy fear of God.'
    ],
    isAnswered: false,
    tags: ['Apostolic Order', 'Foundation', 'Sound Doctrine']
  },
  {
    id: 'j-2',
    title: 'Intercession for Church Building Project & Territorial Victory',
    date: 'October 25, 2026',
    category: 'Prayer Petition',
    scriptures: ['James 5:16', 'Haggai 2:7-9', '2 Corinthians 10:4'],
    notes: 'Standing in faith with Apostle Nicholas Dlamini regarding our church building project and sanctuary acquisition. Declaring that celestial resources, supernatural provision, and righteous sponsors will be mobilized. James 5:16 reminds me that effectual fervent prayer avails much.',
    prayerPoints: [
      'Break every financial embargo and territorial delay in our region.',
      'Release favour with city authorities and planners for the church building.',
      'Provide 100% of the funds through our book sales and joyful kingdom giving.'
    ],
    isAnswered: true,
    answeredDate: 'October 29, 2026',
    answeredTestimony: 'Praise God! The initial building deposit was cleared and municipal council granted zoning permit approval after 3 weeks of intensive prayer!',
    tags: ['Church Building', 'Financial Breakthrough', 'Answered Prayer']
  },
  {
    id: 'j-3',
    title: 'Personal Devotion: Keeping Fire Continually on the Altar',
    date: 'October 20, 2026',
    category: 'Personal Devotion',
    scriptures: ['Leviticus 6:12-13', 'Romans 12:1-2'],
    notes: 'The fire shall ever be burning upon the altar; it shall never go out. Fire requires daily wood (prayer, brokenness, consecrated time). If I rely on yesterday’s anointing, my spirit grows lukewarm. Commitment: 1 hour of morning intercession before engaging with work or phone messages.',
    prayerPoints: [
      'Baptize my secret place with unquenchable holy fire.',
      'Purge every root of spiritual apathy, fatigue, and distraction.',
      'Restore burning zeal for the lost and hunger for the Word.'
    ],
    isAnswered: false,
    tags: ['Holy Ghost Fire', 'Secret Place', 'Revival']
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: '🚨 LIVE APOSTOLIC BROADCAST TONIGHT',
    message: 'Apostle Nicholas Dlamini goes live at 7:00 PM for an impartation on "Operating in Secular Babylon & Overcoming Delays". Connect now on Facebook & YouTube.',
    timestamp: '15 mins ago',
    type: 'live',
    urgent: true,
    read: false,
    targetTab: 'teachings',
    imageUrl: '/assets/aistudio/FB_IMG_1793479262926_b609c63e.jpg',
    imageCaption: 'Apostle Nicholas Dlamini — Live Apostolic Impartation Flyer',
    actionLabel: 'Watch Live Stream'
  },
  {
    id: 'notif-2',
    title: '📚 How to Operate in Secular Babylon — Order Copies',
    message: 'Equip your leaders with the master blueprint for kingdom governance in contemporary society. Hardcover R399 + R60 courier fee, or digital edition on Books2Read.',
    timestamp: 'Just now',
    type: 'book',
    read: false,
    targetTab: 'books',
    imageUrl: '/assets/aistudio/FB_IMG_1793479297508_fa43cc88.jpg',
    imageCaption: 'How to Operate in Secular Babylon — Official Book Cover Flyer (R399)',
    actionLabel: 'Order Hardcover Copy'
  },
  {
    id: 'notif-3',
    title: '🏛️ Church Building Support: Apostolic Prayer Manual',
    message: 'The Apostolic and Prophetic Prayer Manual (R350) is now available. 100% of profits directly support our church building sanctuary project.',
    timestamp: '3 hours ago',
    type: 'book',
    read: false,
    targetTab: 'books',
    imageUrl: '/assets/aistudio/FB_IMG_1793479322670_4123012d.jpg',
    imageCaption: 'The Apostolic & Prophetic Prayer Manual — Church Building Project Edition (R350)',
    actionLabel: 'Support Building Fund'
  },
  {
    id: 'notif-4',
    title: '✈️ Five Senses of Successful Leaders Announced',
    message: 'Discover the five spiritual and executive senses that drive extraordinary leadership. Order your copy for only R100 plus R60 Paxi delivery across South Africa.',
    timestamp: 'Yesterday',
    type: 'book',
    read: true,
    targetTab: 'books',
    imageUrl: '/assets/aistudio/FB_IMG_1793479335252_6e135219.jpg',
    imageCaption: 'Unlock the Mind of a Leader — Five Senses of Successful Leaders (R100)',
    actionLabel: 'Order via Paxi'
  }
];

export interface AlignmentQuestion {
  id: number;
  area: string;
  question: string;
  options: {
    text: string;
    score: number;
    guidance: string;
  }[];
}

export const ALIGNMENT_QUESTIONS: AlignmentQuestion[] = [
  {
    id: 1,
    area: 'Spiritual Fatherhood & Accountability',
    question: 'How is your ministry currently aligned with seasoned spiritual fathers and apostolic oversight?',
    options: [
      {
        text: 'I operate completely independently; I answer only to God directly.',
        score: 0,
        guidance: 'Severe Trap: Lone-Ranger syndrome is the primary source of deception and early ministry collapse.'
      },
      {
        text: 'I have informal mentor friends, but no seasoned father with authority to correct me.',
        score: 1,
        guidance: 'Vulnerable: Peer encouragement is good, but without paternal correction, blindspots remain unaddressed.'
      },
      {
        text: 'I am submitted to a verified, godly spiritual father/apostolic council who can examine my life, doctrine, and finances.',
        score: 2,
        guidance: 'Aligned: Paternal covering is an apostolic shield that secures long-term generational success.'
      }
    ]
  },
  {
    id: 2,
    area: 'Doctrinal Anchorage & Hermeneutics',
    question: 'What is the primary foundation and methodology for the messages you preach to believers?',
    options: [
      {
        text: 'Catchy inspirational thoughts and viral quotes from social media or popular speakers.',
        score: 0,
        guidance: 'Severe Trap: Shallow motivational talks produce carnal believers unable to endure hardship.'
      },
      {
        text: 'Scripture-based preaching, but often leaning heavily on emotional hype and personal experiences.',
        score: 1,
        guidance: 'Vulnerable: Subjective experiences must always be tested and governed by the objective written Word.'
      },
      {
        text: 'Systematic, Christ-centered, expository biblical teaching grounded in original context and sound doctrine.',
        score: 2,
        guidance: 'Aligned: Sound doctrine builds believers who are rooted, grounded, and immune to every wind of error.'
      }
    ]
  },
  {
    id: 3,
    area: 'Financial Integrity & Ministerial Ethics',
    question: 'How do you handle money, fundraising, and honorariums in your ministerial activities?',
    options: [
      {
        text: 'All donations go into my personal account and I decide how to spend them without oversight.',
        score: 0,
        guidance: 'Severe Trap: Financial opacity creates vulnerability to greed, scandals, and ministerial delay.'
      },
      {
        text: 'We have basic church bookkeeping, but financial decisions remain exclusively in my hands.',
        score: 1,
        guidance: 'Vulnerable: Transparent dual-signature elder oversight is required to guard against suspicion.'
      },
      {
        text: 'Strict separation of personal and ministry finances, audited books, and independent trustees.',
        score: 2,
        guidance: 'Aligned: Paul ensured trustworthy brethren carried the financial gift to avoid any blame.'
      }
    ]
  },
  {
    id: 4,
    area: 'Fivefold Equipping vs One-Man Show',
    question: 'How does your local assembly or ministry operate on a weekly basis?',
    options: [
      {
        text: 'Everything revolves around my personality, charisma, and voice; no one else preaches or ministers.',
        score: 0,
        guidance: 'Severe Trap: You become the ceiling of the house; the congregation remains in perpetual infancy.'
      },
      {
        text: 'I delegate administrative tasks, but spiritual ministry is still 90% performed by me.',
        score: 1,
        guidance: 'Vulnerable: The pastor is called to equip the saints for the work of ministry, not monopolize it.'
      },
      {
        text: 'We cultivate an Ephesians 4 environment: multiple fivefold voices equipping believers for societal deployment.',
        score: 2,
        guidance: 'Aligned: An apostolic culture produces reproductive sons and daughters who conquer territory.'
      }
    ]
  },
  {
    id: 5,
    area: 'Holy Ghost Fire & Altar Culture',
    question: 'What is the true condition of the secret prayer altar in your personal life and local church?',
    options: [
      {
        text: 'Dry and mechanical; prayer happens mostly during public services to fill program slots.',
        score: 0,
        guidance: 'Severe Trap: Ministry without an ongoing personal secret altar leads directly to moral compromise and burnout.'
      },
      {
        text: 'Intermittent bursts of intense prayer before major conferences, but lacking daily consistency.',
        score: 1,
        guidance: 'Vulnerable: Leviticus commanded that the fire shall never go out. Perpetual fire requires daily fuel.'
      },
      {
        text: 'Vibrant, prioritized daily prayer and fasting altars where the presence and glory of God are host with reverence.',
        score: 2,
        guidance: 'Aligned: Anointed builders drink from the deep well of the secret place before stepping onto the platform.'
      }
    ]
  }
];

export const INITIAL_REPORTS: MinisterialReport[] = [
  {
    id: 'rep-1',
    title: 'Apostolic Field Report: Eswatini & Mpumalanga Fire Revival Assembly',
    category: 'Revival Dispatch',
    summary: 'Miraculous outpourings of the Holy Spirit, restoration of prophetic altars, and deep doctrinal realignment for over 1,200 regional leaders.',
    content: [
      'The Lord commanded us to strengthen the stakes and lengthen the cords across Southern Africa. During the 4-day intensive apostolic summit, the atmosphere was marked by raw conviction and repentant restoration.',
      'Over 140 emerging pastors renounced commercialized prophetic shortcuts and recommitted to the Pauline pattern of building on Jesus Christ the true Chief Cornerstone.',
      'Testimonies of instantaneous healing, deliverance from demonic covenants, and supernatural financial turnarounds were recorded. All glory belongs to Jesus!'
    ],
    author: 'Apostle Nicholas Dlamini',
    date: 'October 28, 2026',
    location: 'Manzini & Mbombela Hub',
    scriptures: ['Acts 19:11-20', '1 Corinthians 3:10-15', 'Titus 1:5'],
    stats: [
      { label: 'Leaders Realigned', value: '1,200+' },
      { label: 'Altars Restored', value: '84 Assemblies' },
      { label: 'Books Distributed', value: '450 Copies' }
    ],
    isFeatured: true
  },
  {
    id: 'rep-2',
    title: 'Church Building Project Progress & Expansion Communique',
    category: 'Building Project',
    summary: 'Financial transparency report regarding proceeds from "The Apostolic and Prophetic Prayer Manual" (R350) dedicated towards our permanent sanctuary.',
    content: [
      'Beloved partners and saints of God, we give thanks for your radical generosity. Every copy of "The Apostolic and Prophetic Prayer Manual" purchased directly funds our permanent sanctuary and apostolic training institute.',
      'Phase 1 foundation ground-breaking and architectural approval have been achieved. We are now advancing into the structural steel framing phase.',
      'We invite every builder who carries this vision to continue standing with us through book purchases and kingdom seed-faith partnership.'
    ],
    author: 'Apostle Nicholas Dlamini & Secretariat',
    date: 'October 15, 2026',
    location: 'Mbabane Kingdom Centre',
    scriptures: ['Haggai 1:8', 'Exodus 35:21', 'Nehemiah 2:18'],
    stats: [
      { label: 'Phase Status', value: 'Phase 1 Complete' },
      { label: 'Next Milestone', value: 'Superstructure Framing' },
      { label: 'Goal Reach', value: '68% of Phase 1 Budget' }
    ],
    isFeatured: true
  },
  {
    id: 'rep-3',
    title: 'Special Prophetic Directive: Discerning Traps in Secular Babylon',
    category: 'Apostolic Communique',
    summary: 'A critical advisory note for Christian professionals, executives, and leaders navigating pressure in corporate and civil governance.',
    content: [
      'We must not flee the marketplace; we must conquer it with divine discernment. Babylon will always attempt to change your name, your diet, and your convictions, just as it attempted with Daniel.',
      'Our new volume "How to Operate in Secular Babylon" provides the tactical wisdom required to withstand systemic corruption without compromise.',
      'Take heart: the Kingdom of God is an everlasting kingdom that shall dismantle every statue forged by human pride.'
    ],
    author: 'Apostle Nicholas Dlamini',
    date: 'October 5, 2026',
    location: 'Apostolic Apostolic Advisory Council',
    scriptures: ['Daniel 1:8-17', 'Romans 12:1-2', 'Proverbs 8:15-16'],
    stats: [
      { label: 'Advisory Reach', value: 'Global Body of Christ' },
      { label: 'Audience', value: 'Marketplace Ministers' }
    ],
    isFeatured: false
  }
];

export const INITIAL_ORDERS: BookOrder[] = [
  {
    id: 'ord-101',
    bookId: 'b-babylon',
    bookTitle: 'How to Operate in Secular Babylon',
    bookPrice: 'R399',
    customerName: 'Pastor Sibusiso Mkhize',
    customerEmail: 'sibusiso.m@kingdomministries.co.za',
    customerPhone: '+27 83 456 7890',
    deliveryMethod: 'courier',
    deliveryAddress: '24 Ridge Way, Sandton, Johannesburg, 2196',
    timestamp: 'Yesterday at 14:20',
    status: 'Dispatched via Courier',
    notes: 'Courier tracking #ND-JHB-982'
  },
  {
    id: 'ord-102',
    bookId: 'b-prayer-manual',
    bookTitle: 'The Apostolic and Prophetic Prayer Manual',
    bookPrice: 'R350',
    customerName: 'Deaconess Nomsa Dube',
    customerEmail: 'nomsa.d@gmail.com',
    customerPhone: '+268 7601 2345',
    deliveryMethod: 'paxi',
    deliveryAddress: 'PAXI PEP Store Mbabane Mall, Eswatini',
    timestamp: 'Today at 09:15',
    status: 'Pending Review',
    notes: 'Support for church building project'
  },
  {
    id: 'ord-103',
    bookId: 'b-mind-leader',
    bookTitle: 'Five Senses of Successful Leaders',
    bookPrice: 'R100',
    customerName: 'Elder Thabo Cele',
    customerEmail: 'tcele@leadwell.org',
    customerPhone: '+27 72 889 1122',
    deliveryMethod: 'paxi',
    deliveryAddress: 'PAXI PEP Store Nelspruit Crossing, SA',
    timestamp: 'Today at 11:45',
    status: 'Collected via PAXI',
    notes: 'Collected at local PEP'
  }
];

export const INITIAL_PETITIONS: PrayerPetition[] = [
  {
    id: 'pet-1',
    name: 'Rev. Emmanuel Banda',
    email: 'e.banda@glorytabernacle.org',
    phone: '+260 97 123 4567',
    category: 'Church Planting',
    petitionText: 'Apostle Nicholas, please stand with us in apostolic prayer for our new church plant. We are facing territorial witchcraft resistance in the eastern district.',
    timestamp: 'Today at 08:30 AM',
    prayedOver: true,
    ministerNote: 'Lifted up in morning altar. Spiritual authority released. 2 Cor 10:4.'
  },
  {
    id: 'pet-2',
    name: 'Sister Grace Sithole',
    email: 'gracesithole@gmail.com',
    phone: '+268 7812 3456',
    category: 'Deliverance & Healing',
    petitionText: 'Please intercede for my brother hospitalized with sudden lung complications. We believe for total reversal and supernatural breath of God.',
    timestamp: 'Yesterday at 18:45 PM',
    prayedOver: true,
    ministerNote: 'Anointed mantle of healing declared over the intensive care room.'
  },
  {
    id: 'pet-3',
    name: 'Brother Lindokuhle Masina',
    phone: '+27 81 555 9012',
    category: 'Ministry Direction',
    petitionText: 'Seeking counsel and impartation: I sense a divine transition into full-time fivefold apostolic training. Requesting alignment guidance.',
    timestamp: '2 days ago',
    prayedOver: false
  }
];

// LocalStorage helpers
const STORAGE_KEYS = {
  TEACHINGS: 'smart_teachings_v5',
  BOOKS: 'smart_books_v5',
  ITINERARY: 'smart_itinerary_v4',
  NOTIFICATIONS: 'smart_notifications_v4',
  BOOKMARKS: 'smart_bookmarks_v2',
  REPORTS: 'smart_reports_v1',
  ORDERS: 'smart_orders_v1',
  PETITIONS: 'smart_petitions_v1',
  USER_PROFILE: 'smart_user_profile_v1',
  JOURNAL: 'smart_journal_v1'
};

export const getStoredTeachings = (): Teaching[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TEACHINGS);
    if (!raw) {
      return INITIAL_TEACHINGS;
    }
    const parsed: Teaching[] = JSON.parse(raw);
    // Ensure newly added Intense Word Sessions are included if not present
    const existingIds = new Set(parsed.map((p) => p.id));
    const missing = INITIAL_TEACHINGS.filter((t) => !existingIds.has(t.id));
    return [...parsed, ...missing];
  } catch {
    return INITIAL_TEACHINGS;
  }
};

export const saveTeachings = (teachings: Teaching[]) => {
  localStorage.setItem(STORAGE_KEYS.TEACHINGS, JSON.stringify(teachings));
};

export const getStoredJournalEntries = (): JournalEntry[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.JOURNAL);
    return raw ? JSON.parse(raw) : INITIAL_JOURNAL_ENTRIES;
  } catch {
    return INITIAL_JOURNAL_ENTRIES;
  }
};

export const saveJournalEntries = (entries: JournalEntry[]) => {
  localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(entries));
};

export const getStoredBooks = (): Book[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKS);
    if (!raw) return INITIAL_BOOKS;
    const parsed: Book[] = JSON.parse(raw);
    
    // Purge any accidental ministry logo from cached book covers
    return parsed.map((book) => {
      const canonical = INITIAL_BOOKS.find((b) => b.id === book.id);
      if (
        !book.coverImage ||
        book.coverImage.includes('file_000000007c2c8208b2cc5202023513b7') ||
        book.coverImage.includes('file_')
      ) {
        return {
          ...book,
          coverImage: canonical ? canonical.coverImage : book.coverImage
        };
      }
      return book;
    });
  } catch {
    return INITIAL_BOOKS;
  }
};

export const saveBooks = (books: Book[]) => {
  localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(books));
};

export const getStoredItinerary = (): ItineraryEvent[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ITINERARY);
    if (!raw) return INITIAL_ITINERARY;
    const parsed: ItineraryEvent[] = JSON.parse(raw);
    const existingIds = new Set(parsed.map((p) => p.id));
    const missing = INITIAL_ITINERARY.filter((ev) => !existingIds.has(ev.id));
    return [...parsed, ...missing].map((ev) => {
      const canonical = INITIAL_ITINERARY.find((c) => c.id === ev.id);
      return {
        ...ev,
        livestreamUrl: ev.livestreamUrl || canonical?.livestreamUrl || YOUTUBE_CHANNEL_URL,
        speaker: ev.speaker || canonical?.speaker || 'Apostle Nicholas Dlamini',
        endDateISO: ev.endDateISO || canonical?.endDateISO,
        description: ev.description || canonical?.description
      };
    });
  } catch {
    return INITIAL_ITINERARY;
  }
};

export const saveItinerary = (itinerary: ItineraryEvent[]) => {
  localStorage.setItem(STORAGE_KEYS.ITINERARY, JSON.stringify(itinerary));
};

export const getStoredNotifications = (): NotificationItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (!raw) return INITIAL_NOTIFICATIONS;
    const parsed: NotificationItem[] = JSON.parse(raw);
    return parsed.map((item) => {
      const canonical = INITIAL_NOTIFICATIONS.find((c) => c.id === item.id);
      return {
        ...item,
        imageUrl: item.imageUrl || canonical?.imageUrl,
        imageCaption: item.imageCaption || canonical?.imageCaption,
        actionLabel: item.actionLabel || canonical?.actionLabel
      };
    });
  } catch {
    return INITIAL_NOTIFICATIONS;
  }
};

export const saveNotifications = (notifications: NotificationItem[]) => {
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
};

export const getStoredBookmarks = (): BookmarkStore => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    return raw ? JSON.parse(raw) : { teachingIds: ['t-1', 't-3'], bookIds: ['b-babylon', 'b-prayer-manual'] };
  } catch {
    return { teachingIds: ['t-1', 't-3'], bookIds: ['b-babylon', 'b-prayer-manual'] };
  }
};

export const saveBookmarks = (bookmarks: BookmarkStore) => {
  localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
};

export const getStoredReports = (): MinisterialReport[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REPORTS);
    return raw ? JSON.parse(raw) : INITIAL_REPORTS;
  } catch {
    return INITIAL_REPORTS;
  }
};

export const saveReports = (reports: MinisterialReport[]) => {
  localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
};

export const getStoredOrders = (): BookOrder[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return raw ? JSON.parse(raw) : INITIAL_ORDERS;
  } catch {
    return INITIAL_ORDERS;
  }
};

export const saveOrders = (orders: BookOrder[]) => {
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
};

export const getStoredPetitions = (): PrayerPetition[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PETITIONS);
    return raw ? JSON.parse(raw) : INITIAL_PETITIONS;
  } catch {
    return INITIAL_PETITIONS;
  }
};

export const savePetitions = (petitions: PrayerPetition[]) => {
  localStorage.setItem(STORAGE_KEYS.PETITIONS, JSON.stringify(petitions));
};

export const getStoredUserProfile = (): UserProfile | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const saveUserProfile = (profile: UserProfile | null) => {
  if (profile) {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  } else {
    localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
  }
};

