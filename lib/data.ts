export type Person = {
  id: string
  name: string
  age: number
  image: string
  location: string
  bio: string
  interests: string[]
  compatibility: number
}

export const matches: Person[] = [
  {
    id: 'maya',
    name: 'Maya',
    age: 27,
    image: '/images/person-1.png',
    location: 'Brooklyn, NY',
    bio: "Coffee enthusiast, weekend hiker, and amateur film photographer. I'm happiest with a good book and an even better conversation.",
    interests: ['Coffee', 'Photography', 'Hiking', 'Indie Film', 'Travel'],
    compatibility: 94,
  },
  {
    id: 'leo',
    name: 'Leo',
    age: 29,
    image: '/images/person-2.png',
    location: 'San Francisco, CA',
    bio: 'Product designer by day, vinyl collector by night. Looking for someone to share quiet mornings and loud concerts with.',
    interests: ['Design', 'Music', 'Cooking', 'Running', 'Art'],
    compatibility: 88,
  },
  {
    id: 'priya',
    name: 'Priya',
    age: 26,
    image: '/images/person-3.png',
    location: 'Austin, TX',
    bio: 'Bookworm with a soft spot for cozy libraries and rainy days. I write poetry and overthink playlists.',
    interests: ['Reading', 'Writing', 'Tea', 'Museums', 'Yoga'],
    compatibility: 91,
  },
  {
    id: 'noah',
    name: 'Noah',
    age: 31,
    image: '/images/person-4.png',
    location: 'Seattle, WA',
    bio: "Surfer, dog dad, and the guy who'll plan the perfect beach walk. Sunsets are non-negotiable.",
    interests: ['Surfing', 'Dogs', 'Beaches', 'Coffee', 'Travel'],
    compatibility: 85,
  },
  {
    id: 'sofia',
    name: 'Sofia',
    age: 28,
    image: '/images/person-5.png',
    location: 'Chicago, IL',
    bio: 'Gallery curator who believes a great date starts with great art. Let me show you my favorite paintings.',
    interests: ['Art', 'Wine', 'Jazz', 'Architecture', 'Cooking'],
    compatibility: 90,
  },
  {
    id: 'mateo',
    name: 'Mateo',
    age: 30,
    image: '/images/person-6.png',
    location: 'Miami, FL',
    bio: 'Chef-in-training with too many plants and a weakness for park picnics. I make a mean espresso.',
    interests: ['Cooking', 'Plants', 'Coffee', 'Cycling', 'Music'],
    compatibility: 82,
  },
]

export type Environment = {
  id: string
  name: string
  description: string
  image: string
  duration: string
  mood: string
}

export const environments: Environment[] = [
  {
    id: 'coffee',
    name: 'Coffee Shop',
    description:
      'A warm, intimate café with soft jazz and the gentle hum of conversation. Perfect for breaking the ice.',
    image: '/images/env-coffee.png',
    duration: '20–30 min',
    mood: 'Cozy & Casual',
  },
  {
    id: 'library',
    name: 'Library',
    description:
      'Tall shelves, quiet corners, and warm reading lamps. For the deep talkers and slow burners.',
    image: '/images/env-library.png',
    duration: '25–40 min',
    mood: 'Thoughtful & Calm',
  },
  {
    id: 'park',
    name: 'Park Walk',
    description:
      'A golden-hour stroll along tree-lined paths. Movement makes conversation flow naturally.',
    image: '/images/env-park.png',
    duration: '30–45 min',
    mood: 'Relaxed & Open',
  },
  {
    id: 'gallery',
    name: 'Art Gallery',
    description:
      'Wander a curated gallery together and let the art spark unexpected conversations.',
    image: '/images/env-gallery.png',
    duration: '25–35 min',
    mood: 'Curious & Creative',
  },
  {
    id: 'beach',
    name: 'Beach Walk',
    description:
      'Soft sand, a setting sun, and the sound of waves. The most romantic way to meet.',
    image: '/images/env-beach.png',
    duration: '30–45 min',
    mood: 'Romantic & Dreamy',
  },
]

export const interestOptions = [
  'Coffee',
  'Photography',
  'Hiking',
  'Reading',
  'Music',
  'Cooking',
  'Travel',
  'Art',
  'Yoga',
  'Film',
  'Wine',
  'Running',
  'Gaming',
  'Dogs',
  'Plants',
  'Writing',
  'Dancing',
  'Fashion',
]
