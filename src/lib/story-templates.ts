/**
 * Story pages for every book in the catalogue.
 *
 * Each book has 4 story pages (a simplified representation of a 24-page PDF).
 * Page numbers are landmarks: opening (1), early adventure (5),
 * climax / turning point (12), and resolution (20).
 *
 * {{NAME}} is replaced at render time — it appears naturally in narration and
 * dialogue so the child hears their own name woven through the story.
 *
 * gradient    — Tailwind CSS from/to pair; must also exist in GRADIENT_CSS in
 *               src/lib/pdf/page-template.ts so the PDF renderer knows the hex values.
 * accentColor — Tailwind text-* class used in the live preview.
 * scene       — AI image-generation prompt describing the visual scene on this page.
 *               Character appearance is injected automatically; focus on setting + action.
 * sceneLabel  — Short human-readable label shown in the progress overlay.
 */

export interface StoryPage {
  pageNumber:  number
  gradient:    string
  accentColor: string
  text:        string
  scene?:      string   // visual description for AI scene illustration
  sceneLabel?: string   // e.g. "exploring the savannah" — shown in progress overlay
}

// ── The Enchanted Forest ───────────────────────────────────────────────────────

const ENCHANTED_FOREST: StoryPage[] = [
  {
    pageNumber:  1,
    gradient:    'from-emerald-50 to-teal-100',
    accentColor: 'text-teal-700',
    text: 'Once upon a time, in a forest full of wonder and magic, there lived a brave little adventurer named {{NAME}}. {{NAME}} had always dreamed of exploring the Enchanted Forest — and today, that dream was finally coming true.',
    scene: 'young child standing at the edge of a glowing magical forest at dawn, tall ancient trees with luminous golden leaves, fireflies, sense of wonder and discovery, soft morning light',
    sceneLabel: 'entering the enchanted forest',
  },
  {
    pageNumber:  5,
    gradient:    'from-amber-50 to-yellow-100',
    accentColor: 'text-amber-700',
    text: '"{{NAME}}!" called a tiny voice from inside the old oak tree. {{NAME}} spun around, heart pounding with excitement. A small golden rabbit with sparkling eyes peered out from a hollow in the bark.',
    scene: 'young child kneeling beside a giant gnarled oak tree, a tiny golden glowing rabbit with sparkling eyes peering from a hollow in the bark, magical forest setting, warm golden afternoon light',
    sceneLabel: 'meeting the golden rabbit',
  },
  {
    pageNumber:  12,
    gradient:    'from-violet-50 to-purple-100',
    accentColor: 'text-violet-700',
    text: 'The rabbit bowed deeply. "We have been waiting for you, {{NAME}}. Only you can return the lost star to the sky." {{NAME}} stood tall, took a deep breath, and whispered, "Then let\'s go. Together."',
    scene: 'young child standing tall with quiet determination in a magical purple-lit forest clearing, golden rabbit companion at their feet, stars beginning to appear through the canopy above',
    sceneLabel: 'accepting the quest',
  },
  {
    pageNumber:  20,
    gradient:    'from-sky-50 to-blue-100',
    accentColor: 'text-blue-700',
    text: 'High above the treetops, {{NAME}} reached out a small hand and caught the falling star. It glowed warm and gold, and {{NAME}} smiled — because somehow, deep down, {{NAME}} had known all along that this was exactly where the story was meant to go.',
    scene: 'young child standing triumphantly on a treetop branch reaching up to catch a glowing falling star, night sky full of stars, golden warm light, magical triumphant moment',
    sceneLabel: 'catching the falling star',
  },
]

// ── A Starlight Adventure ─────────────────────────────────────────────────────

const STARLIGHT_ADVENTURE: StoryPage[] = [
  {
    pageNumber:  1,
    gradient:    'from-indigo-50 to-blue-100',
    accentColor: 'text-indigo-700',
    text: 'Far beyond the last street light, past the highest rooftops, where the sky turns from black to the deepest blue — that is where adventures begin. And tonight, the adventure chose {{NAME}}. A soft beeping filled the room, and a tiny silver badge on the pillow glowed three times. {{NAME}} sat up and knew, with the certainty that only the bravest explorers ever feel: tonight was the night.',
    scene: 'young child sitting up in bed at night with a glowing silver badge on the pillow beside them, moonlit bedroom, stars and galaxies visible through the window, sense of wonder and destiny',
    sceneLabel: 'the glowing badge arrives',
  },
  {
    pageNumber:  5,
    gradient:    'from-sky-50 to-cyan-100',
    accentColor: 'text-cyan-700',
    text: '"Hello, {{NAME}}," said a voice like wind chimes. {{NAME}} turned to find a tiny creature made entirely of starlight, sitting on the co-pilot\'s seat. "We have been searching the whole galaxy for someone exactly like you," it said. "Will you help us?"',
    scene: 'young child in a small cozy rocket ship cockpit with wide star-filled windows, a tiny luminous creature made of starlight in the co-pilot seat, deep galaxy view outside, wonder and excitement',
    sceneLabel: 'meeting the starlight guide',
  },
  {
    pageNumber:  12,
    gradient:    'from-violet-50 to-purple-100',
    accentColor: 'text-violet-700',
    text: 'The lost planet hung in the darkness like a dimming candle. {{NAME}} pressed a hand to the glass and felt something warm pulse back — the planet knew {{NAME}} was there.',
    scene: 'young child inside a spaceship pressing both hands against the glass porthole, outside a beautiful dim glowing planet hangs in the dark cosmos, tender compassionate moment, purple and indigo tones',
    sceneLabel: 'finding the lost planet',
  },
  {
    pageNumber:  20,
    gradient:    'from-blue-50 to-indigo-100',
    accentColor: 'text-indigo-700',
    text: 'The planet blazed gold as {{NAME}} guided it home using the ancient star map. Every star in the sky seemed to cheer. When {{NAME}}\'s rocket touched down in the back garden at sunrise, everything looked the same — but {{NAME}} knew it wasn\'t.',
    scene: 'young child piloting a small rocket through a glorious galaxy, an ancient star map glowing on the console, stars blazing gold around them, triumphant joyful moment, warm sunrise colors',
    sceneLabel: 'guiding the planet home',
  },
]

// ── The Ocean of Dreams ───────────────────────────────────────────────────────

const OCEAN_OF_DREAMS: StoryPage[] = [
  {
    pageNumber:  1,
    gradient:    'from-teal-50 to-cyan-100',
    accentColor: 'text-teal-700',
    text: 'The sea has always kept its most beautiful secrets just below the surface — waiting for someone special to find them. It was waiting for {{NAME}}. One morning, when the tide came in and the waves whispered to the shore, {{NAME}} stepped into the shallows and felt something extraordinary: the water welcomed {{NAME}} like an old friend.',
    scene: 'young child stepping into shimmering magical ocean shallows at sunrise, glowing turquoise water, gentle waves, sense of belonging and wonder, warm golden light',
    sceneLabel: 'entering the magic ocean',
  },
  {
    pageNumber:  5,
    gradient:    'from-sky-50 to-blue-100',
    accentColor: 'text-blue-700',
    text: '"We\'ve heard about you, {{NAME}}," said the octopus. "The sea creatures have been talking about nothing else." {{NAME}} felt a flush of pride. "The ocean\'s light is fading," the octopus continued. "Only someone who truly loves the sea can bring it back."',
    scene: 'young child underwater surrounded by colorful sea creatures, a friendly octopus with swirling purple eyes gesturing gracefully, glowing coral reef in the background, magical undersea scene',
    sceneLabel: 'meeting the purple octopus',
  },
  {
    pageNumber:  12,
    gradient:    'from-cyan-50 to-teal-100',
    accentColor: 'text-cyan-700',
    text: 'Deep in a coral cave, where the last of the ocean\'s glow still pulsed, {{NAME}} found the ancient pearl. {{NAME}} cupped it gently. "Warm it with your heart," the octopus had said. {{NAME}} closed both hands around the pearl and thought of everything that was beautiful — and brave — and good.',
    scene: 'young child deep underwater in a glowing bioluminescent coral cave, cradling a dark ancient pearl in both cupped hands, soft magical light pulsing, quiet and tender moment',
    sceneLabel: 'holding the ancient pearl',
  },
  {
    pageNumber:  20,
    gradient:    'from-emerald-50 to-teal-100',
    accentColor: 'text-emerald-700',
    text: 'Light exploded outward in every colour imaginable. Fish, dolphins, sea turtles, and jellyfish spun in a glowing spiral as the ocean woke back up. {{NAME}} rose toward the surface laughing, the pearl blazing in one hand.',
    scene: 'young child rising through an underwater explosion of rainbow-colored light, dolphins sea turtles and fish swirling in a glowing spiral all around, the ocean celebrating, pure joy',
    sceneLabel: 'the ocean awakens',
  },
]

// ── The Dragon Keeper ─────────────────────────────────────────────────────────

const DRAGON_KEEPER: StoryPage[] = [
  {
    pageNumber:  1,
    gradient:    'from-red-50 to-rose-100',
    accentColor: 'text-rose-700',
    text: 'The mountain had many names — Forbidden Peak, the Sleeping Giant, the Place Where No One Goes — but {{NAME}} called it by the name that mattered most: Waiting. Because ever since {{NAME}} could remember, the mountain had felt like it was waiting for something. Waiting for someone.',
    scene: 'young child at the base of a dramatic misty mountain looking up at a narrow winding path disappearing into the fog, morning mist, dramatic peaks, sense of destiny calling',
    sceneLabel: 'the mountain is calling',
  },
  {
    pageNumber:  5,
    gradient:    'from-orange-50 to-amber-100',
    accentColor: 'text-amber-700',
    text: 'The cave was warm — warmer than it should have been — and lit from within by a deep amber glow. Curled in the very back, as large as a bus and as lonely as a lighthouse, was the dragon. It was magnificent: scales like hammered copper, eyes the colour of embers, wings that could hold the whole sky.',
    scene: 'young child inside a warm mountain cave meeting an enormous magnificent dragon with gleaming copper scales and glowing ember eyes, warm amber light filling the cave, awe and wonder',
    sceneLabel: 'meeting the dragon',
  },
  {
    pageNumber:  12,
    gradient:    'from-rose-50 to-red-100',
    accentColor: 'text-red-700',
    text: '"I have forgotten how to fly," the dragon said softly. {{NAME}} sat down beside the great creature and said simply: "Then we\'ll remember together." The dragon blinked its ember eyes. "You would do that — for me?" "What are friends for?" said {{NAME}}.',
    scene: 'young child sitting close beside a massive copper-scaled dragon with ember eyes inside a cave, a quiet moment of deep friendship and trust, gentle firelight, tender and warm',
    sceneLabel: 'a new friendship',
  },
  {
    pageNumber:  20,
    gradient:    'from-amber-50 to-orange-100',
    accentColor: 'text-orange-700',
    text: 'They flew until the stars came out — {{NAME}} on the dragon\'s back, wind roaring past their ears, the whole world spread below like a map of everywhere worth going. When they landed on the mountain peak, the dragon was laughing for the first time in a hundred years.',
    scene: 'young child riding joyfully on the back of a magnificent copper dragon soaring through a star-filled sky above mountain peaks, wind and freedom and exhilaration, stars and moonlight',
    sceneLabel: 'flying through the stars',
  },
]

// ── The Time Traveller ────────────────────────────────────────────────────────

const TIME_TRAVELLER: StoryPage[] = [
  {
    pageNumber:  1,
    gradient:    'from-amber-50 to-yellow-100',
    accentColor: 'text-amber-700',
    text: 'It was the sort of watch that made you feel, the moment you held it, that something extraordinary was about to happen. {{NAME}} found it in a dusty cardboard box at the very back of the very top shelf — a golden pocket watch, ticking steadily, with tiny symbols around the face that no one could explain.',
    scene: 'young child in a dusty sunlit attic holding up a beautiful gleaming golden pocket watch with mysterious symbols, golden swirling time-light beginning to appear around them, sense of discovery',
    sceneLabel: 'finding the golden watch',
  },
  {
    pageNumber:  5,
    gradient:    'from-lime-50 to-green-100',
    accentColor: 'text-green-700',
    text: 'The dinosaurs were bigger than any picture in any book — and one of them was looking straight at {{NAME}}. It was a young Triceratops, no taller than a car, with wide gentle eyes and a small worried crease between its horns.',
    scene: 'young child face to face with a gentle young Triceratops dinosaur in a lush prehistoric jungle landscape, the dinosaur has wide curious gentle eyes, prehistoric ferns and trees all around',
    sceneLabel: 'meeting the triceratops',
  },
  {
    pageNumber:  12,
    gradient:    'from-yellow-50 to-amber-100',
    accentColor: 'text-amber-700',
    text: 'The herd had gathered at the river, and they stamped with relief when the young Triceratops came trotting back. One enormous adult turned and regarded {{NAME}} with an eye as deep as a well — ancient, warm, knowing. It bowed its great crested head, just once, slowly. {{NAME}} bowed back.',
    scene: 'young child at the edge of a prehistoric river watching a herd of Triceratops reuniting, a huge adult Triceratops bowing its great crested head toward the child in silent gratitude',
    sceneLabel: 'the herd says thank you',
  },
  {
    pageNumber:  20,
    gradient:    'from-orange-50 to-amber-100',
    accentColor: 'text-orange-700',
    text: 'Three turns of the crown counter-clockwise, and {{NAME}} was back — same dusty shelf, same afternoon light. But {{NAME}} was not the same at all. The watch went back on the shelf, still ticking. {{NAME}} sat quietly for a long time, thinking of a young Triceratops and a slow bow that would last forever.',
    scene: 'young child sitting peacefully in a warm sunlit attic looking thoughtfully out a dusty window, golden afternoon light, a sense of wonder and quiet reflection, changed forever',
    sceneLabel: 'home again, forever changed',
  },
]

// ── The Superhero Academy ─────────────────────────────────────────────────────

const SUPERHERO_ACADEMY: StoryPage[] = [
  {
    pageNumber:  1,
    gradient:    'from-indigo-50 to-violet-100',
    accentColor: 'text-indigo-700',
    text: 'The acceptance letter arrived in a silver envelope that glowed faintly in the dark. {{NAME}} turned it over three times before daring to open it. Inside, in bold golden letters: "Welcome to the Superhero Academy. Your gift is real. Your training begins now."',
    scene: 'young child holding open a glowing silver envelope with golden magical letters inside, nighttime bedroom, wonder and excitement, soft magical light illuminating their face',
    sceneLabel: 'the invitation arrives',
  },
  {
    pageNumber:  5,
    gradient:    'from-violet-50 to-purple-100',
    accentColor: 'text-violet-700',
    text: 'On the first day, the teacher turned to {{NAME}}. "And what is your gift?" {{NAME}} took a breath — and the whole room filled with warmth, a golden glow that made everyone smile without knowing why. "I see," said the teacher softly. "You give people courage. That is the rarest power of all."',
    scene: 'young child at a superhero academy classroom radiating golden warmth and light that fills the entire room, other students smiling and glowing, amazed teacher watching, powerful and heartwarming',
    sceneLabel: 'discovering the gift',
  },
  {
    pageNumber:  12,
    gradient:    'from-blue-50 to-indigo-100',
    accentColor: 'text-indigo-700',
    text: 'The academy alarm rang for the first time in fifty years. A great storm of fear was sweeping toward the city. One by one the students faltered. But {{NAME}} stood firm at the edge of the tower, raised both hands, and sent that golden warmth out into the dark clouds.',
    scene: 'young child standing heroically at the edge of a tall tower with arms raised, sending waves of golden light into a dramatic stormy dark sky, city lights below, courageous and powerful',
    sceneLabel: 'facing the fear storm',
  },
  {
    pageNumber:  20,
    gradient:    'from-purple-50 to-indigo-100',
    accentColor: 'text-purple-700',
    text: 'The storm cleared. The city woke up brave again. The teacher placed a gleaming badge on {{NAME}}\'s chest — not for having the strongest power, but for being exactly the hero the world most needed.',
    scene: 'young child receiving a gleaming superhero badge pinned to their chest by a proud teacher, academy hall, other young heroes cheering, golden light, proud and joyful moment',
    sceneLabel: 'receiving the hero badge',
  },
]

// ── The Pirate\'s Treasure ─────────────────────────────────────────────────────

const PIRATE_TREASURE: StoryPage[] = [
  {
    pageNumber:  1,
    gradient:    'from-sky-50 to-blue-100',
    accentColor: 'text-sky-700',
    text: 'The map appeared rolled up inside a bottle that washed onto the beach on the morning of {{NAME}}\'s birthday. It was old — old enough that the ink had turned the colour of a sunset — and right in the centre, above a drawing of a tiny island, someone had written: "Only the bravest captain will find this."',
    scene: 'young child on a sunny beach holding a rolled-up ancient treasure map from a glass bottle just washed ashore, ocean waves, birthday morning, adventure and excitement',
    sceneLabel: 'finding the treasure map',
  },
  {
    pageNumber:  5,
    gradient:    'from-teal-50 to-cyan-100',
    accentColor: 'text-teal-700',
    text: '"Captain {{NAME}}!" squawked a parrot from the ship\'s mast — a parrot with feathers the colours of a stained-glass window and eyes that held a thousand secrets. "I\'ve been waiting for you for a hundred years," it said.',
    scene: 'young child on a pirate ship deck looking up at a magnificent colorful parrot with stained-glass-like feathers perched on the mast, sparkling ocean all around, adventure beginning',
    sceneLabel: 'the parrot with secrets',
  },
  {
    pageNumber:  12,
    gradient:    'from-blue-50 to-sky-100',
    accentColor: 'text-blue-700',
    text: 'The Sea Serpent rose from the deep, vast and ancient and lonely. Every pirate in history had fled from those glowing eyes. But {{NAME}} did not. "You are not my enemy," {{NAME}} said steadily.',
    scene: 'young child on a ship bravely facing an enormous ancient sea serpent rising from stormy ocean waves, the serpent has curious glowing eyes, child stands calm and fearless, dramatic ocean scene',
    sceneLabel: 'befriending the sea serpent',
  },
  {
    pageNumber:  20,
    gradient:    'from-cyan-50 to-teal-100',
    accentColor: 'text-cyan-700',
    text: 'The treasure chest was not full of gold. It was full of letters — hundreds of them, from children across centuries who had made it this far. {{NAME}} added one too. Then {{NAME}} looked out from the island at the sea stretching endlessly in every direction.',
    scene: 'young child sitting on a remote tropical island opening a treasure chest overflowing with handwritten letters, warm golden sunset, ocean horizon stretching endlessly, sense of wonder and connection',
    sceneLabel: 'the real treasure revealed',
  },
]

// ── The Magic Academy ─────────────────────────────────────────────────────────

const MAGIC_ACADEMY: StoryPage[] = [
  {
    pageNumber:  1,
    gradient:    'from-purple-50 to-violet-100',
    accentColor: 'text-violet-700',
    text: 'The doors of Wyndmere Academy were as tall as oak trees and carved with stars that moved when you weren\'t looking at them directly. {{NAME}} had read every book ever written about magic but had never cast a single spell. "That\'s precisely why we chose you," said the headmistress at the gate.',
    scene: 'young child arriving at towering magical academy doors carved with moving stars, stone archway dripping with ivy, magical mist, sense of awe and belonging, golden light from within',
    sceneLabel: 'arriving at Wyndmere',
  },
  {
    pageNumber:  5,
    gradient:    'from-fuchsia-50 to-purple-100',
    accentColor: 'text-fuchsia-700',
    text: 'When it was {{NAME}}\'s turn, something unexpected happened: the candle didn\'t just light — every candle in the room lit, and the ceiling filled with small golden stars. The class went completely silent.',
    scene: 'young child in a magic classroom accidentally lighting every candle in the room simultaneously, ceiling filling with hundreds of tiny golden stars, amazed classmates and wide-eyed teacher watching',
    sceneLabel: 'lighting every candle',
  },
  {
    pageNumber:  12,
    gradient:    'from-violet-50 to-indigo-100',
    accentColor: 'text-indigo-700',
    text: '{{NAME}} stood before the locked door while every other student waited. Slowly, {{NAME}} reached out a hand — not to cast a spell, but simply to listen. The door seemed to breathe. Then it opened.',
    scene: 'young child reaching out a gentle hand toward enormous ancient sealed library doors in a stone corridor, magical golden light streaming through the crack as the doors begin to open, other students watching in awe',
    sceneLabel: 'the library door opens',
  },
  {
    pageNumber:  20,
    gradient:    'from-pink-50 to-fuchsia-100',
    accentColor: 'text-fuchsia-700',
    text: 'By the end of the first year, everyone at Wyndmere had learned something new about magic. But the most important lesson hadn\'t come from a book or a spell — it had come from watching {{NAME}}.',
    scene: 'young child standing warmly at the center of a magical academy courtyard, fellow students and teachers gathered around, golden magical light glowing from within, confident and kind',
    sceneLabel: 'the heart of magic',
  },
]

// ── The Safari Quest ──────────────────────────────────────────────────────────

const SAFARI_QUEST: StoryPage[] = [
  {
    pageNumber:  1,
    gradient:    'from-amber-50 to-orange-100',
    accentColor: 'text-amber-700',
    text: 'The golden savannah stretched in every direction, shimmering under a sky so blue it hurt to look at. {{NAME}} had arrived at sunrise with a small backpack, a field notebook, and a feeling that something extraordinary was about to happen. From somewhere in the tall grass came a rumbling sound — not frightening, but like a question. {{NAME}} stepped forward. "Hello?" A pair of enormous amber eyes blinked through the grass.',
    scene: 'young child with a small backpack and field notebook standing on the golden African savannah at sunrise, vast golden grassland, a pair of enormous amber lion eyes watching from the tall grass',
    sceneLabel: 'arriving on the savannah',
  },
  {
    pageNumber:  5,
    gradient:    'from-yellow-50 to-amber-100',
    accentColor: 'text-amber-700',
    text: 'The old lion had been king of this land for fifteen years — but today his crown was heavy. "The watering hole has dried up," he told {{NAME}}, his voice low and tired. "The animals are moving away, and without them this place will die. We have tried everything." {{NAME}} opened the field notebook and studied it carefully.',
    scene: 'young child sitting on the dry savannah beside a noble old lion, field notebook open between them, dry cracked earth and sparse grass, a serious and tender conversation',
    sceneLabel: 'the lion needs help',
  },
  {
    pageNumber:  12,
    gradient:    'from-orange-50 to-amber-100',
    accentColor: 'text-orange-700',
    text: 'Deep in a rocky ravine, a great tangle of fallen trees had blocked the underground spring. {{NAME}} asked the elephants to lift, the meerkats to dig, the birds to call out directions from above. Together, slowly, the blockage shifted — and with a great rushing sound, clean cold water burst through.',
    scene: 'young child coordinating elephants lifting fallen trees in a rocky ravine as meerkats dig and birds guide from above, a burst of sparkling water suddenly rushing free, teamwork and triumph, afternoon sunlight',
    sceneLabel: 'freeing the spring',
  },
  {
    pageNumber:  20,
    gradient:    'from-lime-50 to-yellow-100',
    accentColor: 'text-green-700',
    text: 'By evening the watering hole was full, and every animal in the savannah had come to drink. The old lion walked beside {{NAME}} as the sun turned orange and enormous behind the flat-topped trees. "In all my years," he said, "I have never seen a human who listened to the land the way you do."',
    scene: 'young child walking peacefully beside a majestic lion at golden sunset on the savannah, a full shimmering watering hole in the distance with animals drinking, vast orange sky and acacia silhouettes',
    sceneLabel: 'sunset on the savannah',
  },
]

// ── The Mermaid Kingdom ───────────────────────────────────────────────────────

const MERMAID_KINGDOM: StoryPage[] = [
  {
    pageNumber:  1,
    gradient:    'from-cyan-50 to-teal-100',
    accentColor: 'text-teal-700',
    text: 'The shell was unlike any {{NAME}} had ever seen — spiral-shaped, glowing faintly from within, humming a note just below the edge of hearing. When {{NAME}} held it to one ear, a voice as clear as deep water spoke: "We need you. The light of our kingdom is fading. Please come." {{NAME}} stood at the water\'s edge, looked out at the horizon, and stepped in.',
    scene: 'young child standing at the ocean edge at sunset holding a softly glowing magical spiral shell to their ear, warm light, gentle waves, about to step into the shimmering sea',
    sceneLabel: 'the shell speaks',
  },
  {
    pageNumber:  5,
    gradient:    'from-teal-50 to-cyan-100',
    accentColor: 'text-cyan-700',
    text: 'The Mermaid Kingdom was everything the stories had promised and more: towers of coral, streets of smooth white sand, gardens that glowed in every colour. But the great Crystal at its heart was cracked, its glow flickering. The mermaid queen bowed her silver-crowned head.',
    scene: 'young child underwater in a breathtaking mermaid kingdom with glowing coral towers and colorful sea gardens, elegant mermaid queen with a silver crown bowing solemnly, a large cracked crystal dimly glowing nearby',
    sceneLabel: 'the mermaid kingdom',
  },
  {
    pageNumber:  12,
    gradient:    'from-sky-50 to-blue-100',
    accentColor: 'text-blue-700',
    text: '{{NAME}} closed both eyes and remembered: puddles and raincoats, and the smell of the earth drinking, and the sound of drops on a window at night. Slowly, those memories flowed through {{NAME}}\'s hands into the Crystal. The crack began to close.',
    scene: 'young child underwater with eyes closed and hands gently touching a large cracked crystal, streams of warm golden memory-light flowing from the child into the crystal as it begins to glow and heal',
    sceneLabel: 'healing the crystal',
  },
  {
    pageNumber:  20,
    gradient:    'from-emerald-50 to-cyan-100',
    accentColor: 'text-emerald-700',
    text: 'The light returned in a wave of warm gold and blue, rushing through every coral tower and shell-paved street. The kingdom erupted with celebration. The queen pressed a small luminous pearl into {{NAME}}\'s palm.',
    scene: 'young child receiving a glowing luminous pearl from a smiling mermaid queen as waves of warm gold and blue light rush through the underwater kingdom, sea creatures celebrating everywhere, joyful',
    sceneLabel: 'the kingdom glows again',
  },
]

// ── Registry ──────────────────────────────────────────────────────────────────

export const BOOK_STORIES: Record<string, StoryPage[]> = {
  'enchanted-forest':    ENCHANTED_FOREST,
  'starlight-adventure': STARLIGHT_ADVENTURE,
  'ocean-of-dreams':     OCEAN_OF_DREAMS,
  'dragon-keeper':       DRAGON_KEEPER,
  'time-traveller':      TIME_TRAVELLER,
  'superhero-academy':   SUPERHERO_ACADEMY,
  'pirate-treasure':     PIRATE_TREASURE,
  'magic-academy':       MAGIC_ACADEMY,
  'safari-quest':        SAFARI_QUEST,
  'mermaid-kingdom':     MERMAID_KINGDOM,
}

/**
 * Returns the story pages for the given bookId.
 * Falls back to the Enchanted Forest if the id is unrecognised.
 */
export function getStoryPages(bookId: string): StoryPage[] {
  return BOOK_STORIES[bookId] ?? BOOK_STORIES['enchanted-forest']
}

/**
 * Legacy export used by StoryPreview before bookId was plumbed through.
 * Kept to avoid breaking any existing imports during the transition.
 * @deprecated Use getStoryPages(bookId) instead.
 */
export const STORY_PAGES = ENCHANTED_FOREST
