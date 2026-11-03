// all home page photos live here so they are easy to swap later
const unsplash = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;

export interface GalleryImage {
  src: string;
  alt: string;
  caption: string;
  place: string;
}

export const galleryImages: GalleryImage[] = [
  {
    src: unsplash("1758599668429-121d54188b9c", 800),
    alt: "Volunteers cleaning a park with blue trash bags",
    caption: "Park cleanup day",
    place: "Riverside Park",
  },
  {
    src: unsplash("1598335624134-5bceb5de202d", 800),
    alt: "A woman and a child planting a small tree",
    caption: "Tree plantation drive",
    place: "Green Belt Project",
  },
  {
    src: unsplash("1599059813005-11265ba4b4ce", 800),
    alt: "Volunteers sorting canned food donations",
    caption: "Holiday food drive",
    place: "City Food Bank",
  },
  {
    src: unsplash("1536856136534-bb679c52a9aa", 800),
    alt: "A person donating blood at a donation camp",
    caption: "Blood donation camp",
    place: "Harbour Health Centre",
  },
  {
    src: unsplash("1593113598332-cd288d649433", 800),
    alt: "Volunteers loading donation boxes onto a truck",
    caption: "Flood relief supplies",
    place: "Coastal Relief Hub",
  },
  {
    src: unsplash("1582213782179-e0d53f98f2ca", 800),
    alt: "A group of volunteers stacking hands together",
    caption: "Volunteer orientation",
    place: "Community Hall",
  },
  {
    src: unsplash("1628717341663-0007b0ee2597", 800),
    alt: "Two volunteers packing paper bags under a canopy",
    caption: "Winter clothes packing",
    place: "Northside Shelter",
  },
  {
    src: unsplash("1758599668408-dfb4a7ed22c0", 800),
    alt: "Volunteers picking up litter in a forest",
    caption: "Forest trail cleanup",
    place: "Pine Ridge Trail",
  },
];
