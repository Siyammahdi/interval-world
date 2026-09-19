export const DIRECTORY_PAGE_SIZE = 12;

/** Map Search region groups — links to country listing pages when available */
export const mapSearchRegions: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Worldwide",
    links: [
      { label: "Asia", href: "/resort-directory/regions#asia" },
      { label: "Australia", href: "/resort-page/Australia" },
      { label: "Canada", href: "/resort-page/Canada" },
      { label: "Caribbean", href: "/resort-directory/regions#caribbean" },
      { label: "Central America", href: "/resort-directory/regions#central-america" },
      { label: "Europe", href: "/resort-directory/regions#europe" },
      { label: "Mexico", href: "/resort-page/Mexico" },
      { label: "Middle East", href: "/resort-directory/regions#middle-east" },
      { label: "Africa", href: "/resort-directory/regions#africa" },
      { label: "South America", href: "/resort-directory/regions#south-america" },
      { label: "South Pacific", href: "/resort-directory/regions#south-pacific" },
    ],
  },
  {
    heading: "United States",
    links: [
      { label: "USA (All)", href: "/resort-page/USA" },
      { label: "California", href: "/resort-page/USA" },
      { label: "Florida", href: "/resort-page/USA" },
      { label: "Hawaii", href: "/resort-page/USA" },
      { label: "Nevada", href: "/resort-page/USA" },
      { label: "Arizona", href: "/resort-page/USA" },
      { label: "Colorado", href: "/resort-page/USA" },
      { label: "South Carolina", href: "/resort-page/USA" },
      { label: "Virginia", href: "/resort-page/USA" },
      { label: "Pennsylvania", href: "/resort-page/USA" },
    ],
  },
  {
    heading: "Popular Countries",
    links: [
      { label: "Dominican Republic", href: "/resort-page/Dominican%20Republic" },
      { label: "India", href: "/resort-page/India" },
      { label: "Japan", href: "/resort-page/Japan" },
      { label: "France", href: "/resort-page/France" },
      { label: "United Kingdom", href: "/resort-page/United%20Kingdom" },
      { label: "Brazil", href: "/resort-page/Brazil" },
      { label: "Costa Rica", href: "/resort-page/Costa%20Rica" },
      { label: "Spain", href: "/resort-page/Spain" },
      { label: "Italy", href: "/resort-page/Italy" },
      { label: "Aruba", href: "/resort-page/Aruba" },
    ],
  },
];

export const advancedSearchAmenities = [
  "Swimming Pool",
  "Fitness Center",
  "Spa",
  "Restaurant",
  "Golf",
  "Beach Access",
  "Kitchen",
  "Wi-Fi",
  "Kids Club",
  "Tennis",
  "Parking",
  "Laundry",
] as const;
