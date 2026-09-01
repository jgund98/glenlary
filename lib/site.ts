export const site = {
  name: "The GlenLary Estate",
  tagline: "Kentucky's storied wedding estate, est. 1840",
  email: "elizabeth@eventsatglenlary.com",
  location: "Paris, Kentucky",
  region: "Bourbon County · 20 minutes from Lexington",
  instagram: "https://www.instagram.com/glenlaryestate/",
  facebook: "https://www.facebook.com/GlenLaryEstate/",
  twitter: "https://twitter.com/glenlaryestate",
};

export const nav = [
  { href: "/estate", label: "The Estate" },
  { href: "/weddings", label: "Weddings & Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/vendors", label: "Vendors" },
  { href: "/love-notes", label: "Love Notes" },
];

export type GalleryItem = {
  src: string;
  alt: string;
  cat: "ceremony" | "manor" | "barn" | "tent" | "grounds" | "details";
  w: number;
  h: number;
};

export const testimonials = [
  {
    quote:
      "GlenLary Estate is a dream. The opening scene is set as you drive to the property and arrive at the front gate, and it gets better with each moment. You feel tucked away from everything else that is happening in the world and cocooned with the people you adore.",
    name: "Melanie Mauer",
    role: "Melanie Mauer Photography",
  },
  {
    quote:
      "It was by far the most gorgeous event venue I have ever been to for a wedding. From the minute you pull up the long driveway, the sprawling grounds just take your breath away. There were even horses on the property when we arrived.",
    name: "Stacey Dinerstein",
    role: "Wedding guest",
  },
  {
    quote:
      "GlenLary Estate is absolutely enchanting. It is the perfect combination of Southern charm and elegance, and the homes on the property are as fabulous as the landscape. Our wedding was the perfect day in the perfect place. This estate is truly magical.",
    name: "Jennifer Myers",
    role: "GlenLary bride",
  },
  {
    quote:
      "An idealistic setting, the GlenLary Estate provides clients with understated elegance and the feeling of an intimate affair at home. The estate provides me with a blank slate for bringing each client's unique vision to life.",
    name: "Shelly Fortune",
    role: "Shelly Fortune Events",
  },
  {
    quote:
      "A graceful horse farm with modern conveniences. Whether you are staying for a weekend in the original log cabin or having a wedding with the main house as a backdrop, you will have a truly unique experience. They provide the backdrop to a perfect Southern event.",
    name: "Marti Heard",
    role: "Marti Heard Designs",
  },
  {
    quote:
      "For all those times you've wished you could run away and live in the country, here's your chance. I challenge you to find a spot on the property that isn't breathtaking. Though we were just visitors, we definitely felt right at home.",
    name: "Kristen Becker",
    role: "Estate guest",
  },
];

export const vendors = [
  { category: "Event Coordination", names: ["Shelly Fortune Events", "Alicia Collins", "Refined Social Events & Design"] },
  { category: "Photography", names: ["Melanie Mauer", "Samantha Moore Photography", "Malicote Photography"] },
  { category: "Catering", names: ["Dupree Catering", "Apiary Fine Events", "Selma's Catering"] },
  { category: "Floral Design", names: ["Marti Heard Designs"] },
  { category: "Stationery", names: ["Five Dot Design"] },
  { category: "Hair & Makeup", names: ["Kristin Gray"] },
];

export const gallery: GalleryItem[] = [
  // Ceremony
  { src: "/images/ceremony-oak-crowd.jpg", alt: "A full ceremony gathered beneath the great oak", cat: "ceremony", w: 3, h: 2 },
  { src: "/images/ceremony-oak-chairs.jpg", alt: "White chairs circling the great oak before the ceremony", cat: "ceremony", w: 3, h: 2 },
  { src: "/images/ceremony-arch-tree.jpg", alt: "A floral arch set against the pasture view", cat: "ceremony", w: 3, h: 2 },
  { src: "/images/ceremony-vows.jpg", alt: "Vows under the oak, guests seated on the lawn", cat: "ceremony", w: 3, h: 2 },
  { src: "/images/ceremony-arch.jpg", alt: "A draped ceremony arch with coral florals", cat: "ceremony", w: 2, h: 3 },
  { src: "/images/ceremony-mandap.jpg", alt: "A mandap ceremony beneath the oak canopy", cat: "ceremony", w: 2, h: 3 },
  { src: "/images/ceremony-tree-chairs.jpg", alt: "Ceremony seating in the shade of an old tree", cat: "ceremony", w: 3, h: 2 },
  { src: "/images/ceremony-drapes-bw.jpg", alt: "The bride arriving through draped panels", cat: "ceremony", w: 3, h: 2 },
  { src: "/images/vows-bw.jpg", alt: "A quiet moment during the vows", cat: "ceremony", w: 3, h: 2 },
  // Manor
  { src: "/images/manor-front.jpg", alt: "The Lary Manor in full summer", cat: "manor", w: 3, h: 2 },
  { src: "/images/manor-lawn-party.jpg", alt: "A reception spilling across the manor's front lawn", cat: "manor", w: 3, h: 2 },
  { src: "/images/party-columns-color.jpg", alt: "The whole wedding party before the columns", cat: "manor", w: 3, h: 2 },
  { src: "/images/manor-ceremony-lawn.jpg", alt: "Ceremony chairs set before the manor", cat: "manor", w: 3, h: 2 },
  { src: "/images/morning-prep.jpg", alt: "Finishing touches in the bridal suite", cat: "manor", w: 2, h: 3 },
  { src: "/images/couple-porch.jpg", alt: "Newlyweds on the manor porch", cat: "manor", w: 2, h: 3 },
  { src: "/images/couple-columns-bw.jpg", alt: "The couple beneath the manor columns", cat: "manor", w: 3, h: 2 },
  { src: "/images/party-porch-bw.jpg", alt: "The wedding party across the double gallery", cat: "manor", w: 3, h: 2 },
  { src: "/images/couple-manor-bw.jpg", alt: "Portraits on the front lawn of the manor", cat: "manor", w: 3, h: 2 },
  { src: "/images/bridesmaids-robes.jpg", alt: "The morning of, in the manor bridal suite", cat: "manor", w: 3, h: 2 },
  { src: "/images/manor-parlor.jpg", alt: "Escort cards under the parlor chandelier", cat: "manor", w: 3, h: 2 },
  { src: "/images/manor-sitting-room.jpg", alt: "A sitting room inside the Lary Manor", cat: "manor", w: 2, h: 3 },
  { src: "/images/manor-mantel-florals.jpg", alt: "Florals and candlelight on the manor mantel", cat: "manor", w: 3, h: 2 },
  { src: "/images/dress-wardrobe.jpg", alt: "The gown waiting in the bridal suite", cat: "manor", w: 2, h: 3 },
  { src: "/images/couple-steps-fur.jpg", alt: "A winter couple on the manor steps", cat: "manor", w: 2, h: 3 },
  { src: "/images/couple-winter-steps.jpg", alt: "A snow-dusted exit down the front walk", cat: "manor", w: 2, h: 3 },
  // Barn
  { src: "/images/barn-front.jpg", alt: "The black barn dressed for an evening event", cat: "barn", w: 3, h: 2 },
  { src: "/images/couple-barn-walk.jpg", alt: "Just married, walking the lane to the black barn", cat: "barn", w: 3, h: 2 },
  { src: "/images/barn-moody.jpg", alt: "The black barn beneath a Kentucky storm sky", cat: "barn", w: 3, h: 2 },
  { src: "/images/barn-long-table.jpg", alt: "A single long table down the barn gallery", cat: "barn", w: 2, h: 3 },
  { src: "/images/barn-tables.jpg", alt: "Dinner tables set beneath the barn doors", cat: "barn", w: 3, h: 2 },
  { src: "/images/barn-chandelier.jpg", alt: "A greenery chandelier in the barn loft", cat: "barn", w: 3, h: 2 },
  { src: "/images/barn-lounge.jpg", alt: "A velvet lounge inside the barn", cat: "barn", w: 3, h: 2 },
  { src: "/images/couple-barn-kiss.jpg", alt: "A kiss between the hay bales", cat: "barn", w: 3, h: 2 },
  { src: "/images/couple-hay-barn.jpg", alt: "Portraits in the hay barn light", cat: "barn", w: 3, h: 2 },
  { src: "/images/bridesmaids-barn.jpg", alt: "The bridal party walking from the black barn", cat: "barn", w: 3, h: 2 },
  // Tent
  { src: "/images/tent-chandeliers.jpg", alt: "Crystal chandeliers under the sailcloth tent", cat: "tent", w: 3, h: 2 },
  { src: "/images/clear-tent.jpg", alt: "A clear-top tent with a checkered dance floor", cat: "tent", w: 3, h: 2 },
  { src: "/images/pool-party-manor.jpg", alt: "Cocktail hour around the pool", cat: "tent", w: 3, h: 2 },
  { src: "/images/tent-long-table.jpg", alt: "A king's table running the length of the tent", cat: "tent", w: 3, h: 2 },
  { src: "/images/tent-dinner.jpg", alt: "Dinner service under the tent", cat: "tent", w: 3, h: 2 },
  { src: "/images/reception-toast-bride.jpg", alt: "The bride taking the microphone", cat: "tent", w: 3, h: 2 },
  { src: "/images/reception-laugh-bw.jpg", alt: "A toast that landed", cat: "tent", w: 3, h: 2 },
  { src: "/images/reception-party-bw.jpg", alt: "The dance floor under string lights", cat: "tent", w: 3, h: 2 },
  { src: "/images/band-bw.jpg", alt: "The band at full tilt", cat: "tent", w: 3, h: 2 },
  { src: "/images/sky-lanterns.jpg", alt: "Sky lanterns rising over the send-off", cat: "tent", w: 2, h: 3 },
  { src: "/images/pool-cocktails.jpg", alt: "Cocktail hour around the pool at dusk", cat: "tent", w: 3, h: 2 },
  { src: "/images/pool-tent.jpg", alt: "The tent raised beside the pool", cat: "tent", w: 3, h: 2 },
  { src: "/images/bar-trailer-night.jpg", alt: "The bar glowing after dark", cat: "tent", w: 3, h: 2 },
  // Grounds
  { src: "/images/gates-wreath.jpg", alt: "The estate gates hung with a wreath", cat: "grounds", w: 3, h: 2 },
  { src: "/images/estate-approach.jpg", alt: "The manor at the end of the long drive", cat: "grounds", w: 3, h: 2 },
  { src: "/images/manor-spring.jpg", alt: "The manor across the spring lawn", cat: "grounds", w: 3, h: 2 },
  { src: "/images/barn-lane.jpg", alt: "The lane past the black barn", cat: "grounds", w: 2, h: 3 },
  { src: "/images/pond-autumn-swan.jpg", alt: "The pond in autumn, swan included", cat: "grounds", w: 3, h: 2 },
  { src: "/images/pond-spring.jpg", alt: "The pond against a big bluegrass sky", cat: "grounds", w: 2, h: 3 },
  { src: "/images/pastures-golden.jpg", alt: "Golden hour over the pastures", cat: "grounds", w: 3, h: 2 },
  { src: "/images/great-oak.jpg", alt: "The great oak above the ceremony lawn", cat: "grounds", w: 3, h: 2 },
  { src: "/images/couple-two-horses.jpg", alt: "Bride and groom with two of GlenLary's horses", cat: "grounds", w: 3, h: 2 },
  { src: "/images/couple-horse-kiss.jpg", alt: "A kiss under the tree, horse in attendance", cat: "grounds", w: 3, h: 2 },
  { src: "/images/bride-flower-girls-horse.jpg", alt: "The bride and her flower girls making a friend", cat: "grounds", w: 3, h: 2 },
  { src: "/images/ceremony-valley.jpg", alt: "Vows above the rolling valley", cat: "ceremony", w: 3, h: 2 },
  { src: "/images/groomsmen-cabin.jpg", alt: "The groomsmen on the cabin porch", cat: "grounds", w: 3, h: 2 },
  { src: "/images/horse-portrait.jpg", alt: "One of GlenLary's horses at the fence", cat: "grounds", w: 2, h: 3 },
  { src: "/images/couple-horse.jpg", alt: "A quiet moment with one of the horses", cat: "grounds", w: 3, h: 2 },
  { src: "/images/couple-horse-bw.jpg", alt: "Newlyweds greeting a curious horse", cat: "grounds", w: 3, h: 2 },
  { src: "/images/couple-fence-lane.jpg", alt: "Down the fence-lined lane", cat: "grounds", w: 2, h: 3 },
  { src: "/images/couple-sunset.jpg", alt: "Last light over the farm", cat: "grounds", w: 3, h: 2 },
  { src: "/images/couple-dusk.jpg", alt: "Dusk on the hill", cat: "grounds", w: 2, h: 3 },
  { src: "/images/couple-veil-field.jpg", alt: "The veil catching the breeze", cat: "grounds", w: 2, h: 3 },
  { src: "/images/couple-snow.jpg", alt: "A winter wedding across the white fields", cat: "grounds", w: 3, h: 2 },
  { src: "/images/manor-snow.jpg", alt: "The manor after a snowfall", cat: "grounds", w: 3, h: 2 },
  { src: "/images/cabin.jpg", alt: "The 1790s log cabin", cat: "grounds", w: 2, h: 3 },
  { src: "/images/gates-allee.jpg", alt: "The white gates and the long allee to the manor", cat: "grounds", w: 3, h: 2 },
  { src: "/images/barn-summer-lane.jpg", alt: "The drive curving past the black barn", cat: "grounds", w: 2, h: 3 },
  { src: "/images/fence-portraits.jpg", alt: "Portraits along the four-board fence", cat: "grounds", w: 3, h: 2 },
  { src: "/images/ceremony-vista.jpg", alt: "Vows above the long view of the farm", cat: "ceremony", w: 3, h: 2 },
  { src: "/images/manor-processional.jpg", alt: "The processional before the manor", cat: "ceremony", w: 3, h: 2 },
  { src: "/images/manor-balcony.jpg", alt: "Newlyweds on the manor's upper gallery", cat: "manor", w: 3, h: 2 },
  { src: "/images/porch-kiss.jpg", alt: "A kiss beside the porch", cat: "manor", w: 3, h: 2 },
  { src: "/images/groom-manor-door.jpg", alt: "The groom waiting at the manor door", cat: "manor", w: 3, h: 2 },
  { src: "/images/bridesmaids-navy.jpg", alt: "Bridesmaids in navy at the green shutters", cat: "manor", w: 3, h: 2 },
  { src: "/images/tent-sailcloth.jpg", alt: "The sailcloth tent set for dinner", cat: "tent", w: 2, h: 3 },
  { src: "/images/pool-entrance.jpg", alt: "A grand entrance beside the pool", cat: "tent", w: 3, h: 2 },
  { src: "/images/first-dance.jpg", alt: "The first dance under the tent", cat: "tent", w: 3, h: 2 },
  // Details
  { src: "/images/lily-crown.jpg", alt: "A lily-of-the-valley flower crown", cat: "details", w: 2, h: 3 },
  { src: "/images/ring-pillow.jpg", alt: "A monogrammed ring pillow", cat: "details", w: 3, h: 2 },
  { src: "/images/rings-horse.jpg", alt: "Rings kept by a golden horse", cat: "details", w: 3, h: 2 },
  { src: "/images/stationery-horses.jpg", alt: "A horse-print stationery suite", cat: "details", w: 3, h: 2 },
  { src: "/images/place-setting-horse.jpg", alt: "A menu and a small brass horse at each place", cat: "details", w: 3, h: 2 },
  { src: "/images/cake.jpg", alt: "The cake with garden roses", cat: "details", w: 2, h: 3 },
  { src: "/images/cake-magnolia.jpg", alt: "A magnolia-trimmed cake", cat: "details", w: 3, h: 2 },
  { src: "/images/bouquet.jpg", alt: "A pastel bouquet in full sun", cat: "details", w: 2, h: 3 },
  { src: "/images/florals-coral.jpg", alt: "Coral florals on barnwood", cat: "details", w: 3, h: 2 },
  { src: "/images/candles-florals.jpg", alt: "Candlelight and garden florals", cat: "details", w: 3, h: 2 },
  { src: "/images/heels-blue.jpg", alt: "Something blue", cat: "details", w: 3, h: 2 },
  { src: "/images/drinks.jpg", alt: "Front-porch drinks in mason jars", cat: "details", w: 2, h: 3 },
  { src: "/images/getaway-car.jpg", alt: "The getaway car waiting under the pines", cat: "details", w: 2, h: 3 },
  { src: "/images/getaway-car-just-married.jpg", alt: "Just married, headed down the drive", cat: "details", w: 3, h: 2 },
];

export const galleryCats = [
  { key: "all", label: "Everything" },
  { key: "ceremony", label: "The Ceremony" },
  { key: "manor", label: "The Manor" },
  { key: "barn", label: "The Barn" },
  { key: "tent", label: "Under the Tent" },
  { key: "grounds", label: "The Grounds" },
  { key: "details", label: "The Details" },
] as const;
