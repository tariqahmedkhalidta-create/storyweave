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
 * gradient  — Tailwind CSS from/to pair; must also exist in GRADIENT_CSS in
 *             src/lib/pdf/page-template.ts so the PDF renderer knows the hex values.
 * accentColor — Tailwind text-* class used in the live preview.
 */

export interface StoryPage {
  pageNumber:  number
  gradient:    string
  accentColor: string
  text:        string
}

// ── The Enchanted Forest ───────────────────────────────────────────────────────

const ENCHANTED_FOREST: StoryPage[] = [
  {
    pageNumber:  1,
    gradient:    'from-emerald-50 to-teal-100',
    accentColor: 'text-teal-700',
    text: 'Once upon a time, in a forest full of wonder and magic, there lived a brave little adventurer named {{NAME}}. {{NAME}} had always dreamed of exploring the Enchanted Forest — and today, that dream was finally coming true.',
  },
  {
    pageNumber:  5,
    gradient:    'from-amber-50 to-yellow-100',
    accentColor: 'text-amber-700',
    text: '"{{NAME}}!" called a tiny voice from inside the old oak tree. {{NAME}} spun around, heart pounding with excitement. A small golden rabbit with sparkling eyes peered out from a hollow in the bark.',
  },
  {
    pageNumber:  12,
    gradient:    'from-violet-50 to-purple-100',
    accentColor: 'text-violet-700',
    text: 'The rabbit bowed deeply. "We have been waiting for you, {{NAME}}. Only you can return the lost star to the sky." {{NAME}} stood tall, took a deep breath, and whispered, "Then let\'s go. Together."',
  },
  {
    pageNumber:  20,
    gradient:    'from-sky-50 to-blue-100',
    accentColor: 'text-blue-700',
    text: 'High above the treetops, {{NAME}} reached out a small hand and caught the falling star. It glowed warm and gold, and {{NAME}} smiled — because somehow, deep down, {{NAME}} had known all along that this was exactly where the story was meant to go.',
  },
]

// ── A Starlight Adventure ─────────────────────────────────────────────────────

const STARLIGHT_ADVENTURE: StoryPage[] = [
  {
    pageNumber:  1,
    gradient:    'from-indigo-50 to-blue-100',
    accentColor: 'text-indigo-700',
    text: 'Far beyond the last street light, past the highest rooftops, where the sky turns from black to the deepest blue — that is where adventures begin. And tonight, the adventure chose {{NAME}}. A soft beeping filled the room, and a tiny silver badge on the pillow glowed three times. {{NAME}} sat up and knew, with the certainty that only the bravest explorers ever feel: tonight was the night.',
  },
  {
    pageNumber:  5,
    gradient:    'from-sky-50 to-cyan-100',
    accentColor: 'text-cyan-700',
    text: 'The rocket was small — just the right size for one — but the windows were wide and the stars outside were dazzling. "Hello, {{NAME}}," said a voice like wind chimes. {{NAME}} turned to find a tiny creature made entirely of starlight, sitting on the co-pilot\'s seat. "We have been searching the whole galaxy for someone exactly like you," it said. "Will you help us?"',
  },
  {
    pageNumber:  12,
    gradient:    'from-violet-50 to-purple-100',
    accentColor: 'text-violet-700',
    text: 'The lost planet hung in the darkness like a dimming candle. {{NAME}} pressed a hand to the glass and felt something warm pulse back — the planet knew {{NAME}} was there. "It\'s afraid," said the starlight creature quietly. {{NAME}} straightened up. "Don\'t be afraid," {{NAME}} whispered. "I\'m going to help you find your way home."',
  },
  {
    pageNumber:  20,
    gradient:    'from-blue-50 to-indigo-100',
    accentColor: 'text-indigo-700',
    text: 'The planet blazed gold as {{NAME}} guided it home using the ancient star map. Every star in the sky seemed to cheer. When {{NAME}}\'s rocket touched down in the back garden at sunrise, everything looked the same — but {{NAME}} knew it wasn\'t. The whole universe was a little bigger, a little brighter, because {{NAME}} had been brave enough to answer the call.',
  },
]

// ── The Ocean of Dreams ───────────────────────────────────────────────────────

const OCEAN_OF_DREAMS: StoryPage[] = [
  {
    pageNumber:  1,
    gradient:    'from-teal-50 to-cyan-100',
    accentColor: 'text-teal-700',
    text: 'The sea has always kept its most beautiful secrets just below the surface — waiting for someone special to find them. It was waiting for {{NAME}}. One morning, when the tide came in and the waves whispered to the shore, {{NAME}} stepped into the shallows and felt something extraordinary: the water welcomed {{NAME}} like an old friend, like {{NAME}} had always belonged there.',
  },
  {
    pageNumber:  5,
    gradient:    'from-sky-50 to-blue-100',
    accentColor: 'text-blue-700',
    text: 'Beneath the waves, everything sparkled. An octopus with swirling purple eyes offered a graceful wave of two tentacles. "We\'ve heard about you, {{NAME}}," it said. "The sea creatures have been talking about nothing else." {{NAME}} felt a flush of pride. "The ocean\'s light is fading," the octopus continued. "Only someone who truly loves the sea can bring it back — and that someone is you, {{NAME}}."',
  },
  {
    pageNumber:  12,
    gradient:    'from-cyan-50 to-teal-100',
    accentColor: 'text-cyan-700',
    text: 'Deep in a coral cave, where the last of the ocean\'s glow still pulsed, {{NAME}} found the ancient pearl. It was perfectly smooth and perfectly dark, waiting for someone\'s hands to wake it up. {{NAME}} cupped it gently. "Warm it with your heart," the octopus had said. {{NAME}} closed both hands around the pearl and thought of everything that was beautiful — and brave — and good.',
  },
  {
    pageNumber:  20,
    gradient:    'from-emerald-50 to-teal-100',
    accentColor: 'text-emerald-700',
    text: 'Light exploded outward in every colour imaginable. Fish, dolphins, sea turtles, and jellyfish spun in a glowing spiral as the ocean woke back up. {{NAME}} rose toward the surface laughing, the pearl blazing in one hand. Long after {{NAME}} dried off and went home, the light at the bottom of the ocean kept on shining — and whenever the sea caught the sun just right, {{NAME}} knew it was saying thank you.',
  },
]

// ── The Dragon Keeper ─────────────────────────────────────────────────────────

const DRAGON_KEEPER: StoryPage[] = [
  {
    pageNumber:  1,
    gradient:    'from-red-50 to-rose-100',
    accentColor: 'text-rose-700',
    text: 'The mountain had many names — Forbidden Peak, the Sleeping Giant, the Place Where No One Goes — but {{NAME}} called it by the name that mattered most: Waiting. Because ever since {{NAME}} could remember, the mountain had felt like it was waiting for something. Waiting for someone. And on the morning {{NAME}} found the narrow path winding up through the mist, everything became clear.',
  },
  {
    pageNumber:  5,
    gradient:    'from-orange-50 to-amber-100',
    accentColor: 'text-amber-700',
    text: 'The cave was warm — warmer than it should have been — and lit from within by a deep amber glow. Curled in the very back, as large as a bus and as lonely as a lighthouse, was the dragon. It was magnificent: scales like hammered copper, eyes the colour of embers, wings that could hold the whole sky. It looked up when it saw {{NAME}}, and its great eyes were full of surprise. Nobody had ever come before.',
  },
  {
    pageNumber:  12,
    gradient:    'from-rose-50 to-red-100',
    accentColor: 'text-red-700',
    text: '"I have forgotten how to fly," the dragon said softly, and it was the saddest sentence {{NAME}} had ever heard. The wings were perfect — it was that the dragon had been alone so long it had forgotten what it was for. {{NAME}} sat down beside the great creature and said simply: "Then we\'ll remember together." The dragon blinked its ember eyes. "You would do that — for me?" "What are friends for?" said {{NAME}}.',
  },
  {
    pageNumber:  20,
    gradient:    'from-amber-50 to-orange-100',
    accentColor: 'text-orange-700',
    text: 'They flew until the stars came out — {{NAME}} on the dragon\'s back, wind roaring past their ears, the whole world spread below like a map of everywhere worth going. When they landed on the mountain peak and caught their breath, the dragon was laughing for the first time in a hundred years. {{NAME}} laughed too. Some adventures end with treasure. Some with glory. This one ended with two new friends watching the sunrise — and that, {{NAME}} already knew, was the best ending of all.',
  },
]

// ── The Time Traveller ────────────────────────────────────────────────────────

const TIME_TRAVELLER: StoryPage[] = [
  {
    pageNumber:  1,
    gradient:    'from-amber-50 to-yellow-100',
    accentColor: 'text-amber-700',
    text: 'It was the sort of watch that made you feel, the moment you held it, that something extraordinary was about to happen. {{NAME}} found it in a dusty cardboard box at the very back of the very top shelf — a golden pocket watch, ticking steadily, with tiny symbols around the face that no one could explain. When {{NAME}} pressed the crown and turned it clockwise three full times, the world went very still. And then: golden light.',
  },
  {
    pageNumber:  5,
    gradient:    'from-lime-50 to-green-100',
    accentColor: 'text-green-700',
    text: 'The dinosaurs were bigger than any picture in any book — and one of them was looking straight at {{NAME}}. It was a young Triceratops, no taller than a car, with wide gentle eyes and a small worried crease between its horns. The watch spoke: "That young one is lost, {{NAME}}. It can\'t find its herd." The Triceratops looked at {{NAME}}. {{NAME}} looked back. And then {{NAME}} took a careful step forward.',
  },
  {
    pageNumber:  12,
    gradient:    'from-yellow-50 to-amber-100',
    accentColor: 'text-amber-700',
    text: 'The herd had gathered at the river, and they stamped with relief when the young Triceratops came trotting back. {{NAME}} stood at the edge of the clearing, watching. One enormous adult turned and regarded {{NAME}} with an eye as deep as a well — ancient, warm, knowing. It bowed its great crested head, just once, slowly. {{NAME}} bowed back. Some moments don\'t need words. Across sixty-five million years, that was one of them.',
  },
  {
    pageNumber:  20,
    gradient:    'from-orange-50 to-amber-100',
    accentColor: 'text-orange-700',
    text: 'Three turns of the crown counter-clockwise, and {{NAME}} was back — same dusty shelf, same afternoon light. But {{NAME}} was not the same at all. The watch went back on the shelf, still ticking. {{NAME}} sat quietly for a long time, thinking of a young Triceratops, a river at the edge of time, and a slow bow that would last forever. History, {{NAME}} now knew, isn\'t just the past. It\'s everywhere the brave have ever been.',
  },
]

// ── The Superhero Academy ─────────────────────────────────────────────────────

const SUPERHERO_ACADEMY: StoryPage[] = [
  {
    pageNumber:  1,
    gradient:    'from-indigo-50 to-violet-100',
    accentColor: 'text-indigo-700',
    text: 'The acceptance letter arrived in a silver envelope that glowed faintly in the dark. {{NAME}} turned it over three times before daring to open it. Inside, in bold golden letters: "Welcome to the Superhero Academy. Your gift is real. Your training begins now." {{NAME}} had always felt a little different — a little more. Now, for the first time, that felt like a very good thing.',
  },
  {
    pageNumber:  5,
    gradient:    'from-violet-50 to-purple-100',
    accentColor: 'text-violet-700',
    text: 'On the first day, the other students compared powers — one could run faster than sound, another could grow flowers from thin air. Then the teacher turned to {{NAME}}. "And what is your gift?" {{NAME}} took a breath — and the whole room filled with warmth, a golden glow that made everyone smile without knowing why. "I see," said the teacher softly. "You give people courage. That is the rarest power of all."',
  },
  {
    pageNumber:  12,
    gradient:    'from-blue-50 to-indigo-100',
    accentColor: 'text-indigo-700',
    text: 'The academy alarm rang for the first time in fifty years. A great storm of fear was sweeping toward the city — a storm that drained the courage from everyone it touched. One by one the students faltered. But {{NAME}} stood firm at the edge of the tower, raised both hands, and sent that golden warmth out into the dark clouds. The storm shuddered. It had never met anyone like {{NAME}} before.',
  },
  {
    pageNumber:  20,
    gradient:    'from-purple-50 to-indigo-100',
    accentColor: 'text-purple-700',
    text: 'The storm cleared. The city woke up brave again. The teacher placed a gleaming badge on {{NAME}}\'s chest — not for having the strongest power, but for being exactly the hero the world most needed. "Anyone can be powerful," the teacher said. "But choosing to lift others up — that is what makes a true superhero." {{NAME}} looked down at the badge and smiled. Class one was just getting started.',
  },
]

// ── The Pirate's Treasure ─────────────────────────────────────────────────────

const PIRATE_TREASURE: StoryPage[] = [
  {
    pageNumber:  1,
    gradient:    'from-sky-50 to-blue-100',
    accentColor: 'text-sky-700',
    text: 'The map appeared rolled up inside a bottle that washed onto the beach on the morning of {{NAME}}\'s birthday. It was old — old enough that the ink had turned the colour of a sunset — and right in the centre, above a drawing of a tiny island, someone had written: "Only the bravest captain will find this." {{NAME}} smoothed the map flat, looked at the sea, and made a decision.',
  },
  {
    pageNumber:  5,
    gradient:    'from-teal-50 to-cyan-100',
    accentColor: 'text-teal-700',
    text: '"Captain {{NAME}}!" squawked a parrot from the ship\'s mast — a parrot with feathers the colours of a stained-glass window and eyes that held a thousand secrets. "I\'ve been waiting for you for a hundred years," it said. "I know where the treasure is. But first, you must prove yourself brave enough to deserve it." {{NAME}} squared both shoulders. "Tell me what to do," said {{NAME}}.',
  },
  {
    pageNumber:  12,
    gradient:    'from-blue-50 to-sky-100',
    accentColor: 'text-blue-700',
    text: 'The Sea Serpent rose from the deep, vast and ancient and lonely. Every pirate in history had fled from those glowing eyes. But {{NAME}} did not. "You are not my enemy," {{NAME}} said steadily. The serpent paused. It had never been spoken to kindly before. Slowly, it lowered its great head — and with a single sweep of its tail, it cleared the path to the treasure island.',
  },
  {
    pageNumber:  20,
    gradient:    'from-cyan-50 to-teal-100',
    accentColor: 'text-cyan-700',
    text: 'The treasure chest was not full of gold. It was full of letters — hundreds of them, from children across centuries who had made it this far. {{NAME}} added one too. Then {{NAME}} looked out from the island at the sea stretching endlessly in every direction and felt something better than any coin: the certainty that the world is large, and adventures are everywhere, and {{NAME}} was exactly the kind of captain who could find them.',
  },
]

// ── The Magic Academy ─────────────────────────────────────────────────────────

const MAGIC_ACADEMY: StoryPage[] = [
  {
    pageNumber:  1,
    gradient:    'from-purple-50 to-violet-100',
    accentColor: 'text-violet-700',
    text: 'The doors of Wyndmere Academy were as tall as oak trees and carved with stars that moved when you weren\'t looking at them directly. {{NAME}} had read every book ever written about magic but had never cast a single spell. "That\'s precisely why we chose you," said the headmistress at the gate. "Real magic doesn\'t come from books. It comes from here." She tapped {{NAME}}\'s chest, right over the heart.',
  },
  {
    pageNumber:  5,
    gradient:    'from-fuchsia-50 to-purple-100',
    accentColor: 'text-fuchsia-700',
    text: 'In the first class, every student had to light a candle with their mind. The candles blazed, flickered, and popped. When it was {{NAME}}\'s turn, something unexpected happened: the candle didn\'t just light — every candle in the room lit, and the ceiling filled with small golden stars. The class went completely silent. Even the teacher looked surprised. "I\'ve taught here for forty years," she whispered, "and I\'ve never seen that before."',
  },
  {
    pageNumber:  12,
    gradient:    'from-violet-50 to-indigo-100',
    accentColor: 'text-indigo-700',
    text: 'The ancient library had been dark for three hundred years — sealed by a spell no one could unravel. Inside were all the lost spells of Wyndmere. {{NAME}} stood before the locked door while every other student waited. Slowly, {{NAME}} reached out a hand — not to cast a spell, but simply to listen. The door seemed to breathe. Then it opened. "Some doors," the headmistress said quietly, "only open for kindness."',
  },
  {
    pageNumber:  20,
    gradient:    'from-pink-50 to-fuchsia-100',
    accentColor: 'text-fuchsia-700',
    text: 'By the end of the first year, everyone at Wyndmere had learned something new about magic. But the most important lesson hadn\'t come from a book or a spell — it had come from watching {{NAME}}. Magic, they now understood, wasn\'t about power. It was about choosing, again and again, to use what you had to help the people and the world around you. {{NAME}} had known that all along.',
  },
]

// ── The Safari Quest ──────────────────────────────────────────────────────────

const SAFARI_QUEST: StoryPage[] = [
  {
    pageNumber:  1,
    gradient:    'from-amber-50 to-orange-100',
    accentColor: 'text-amber-700',
    text: 'The golden savannah stretched in every direction, shimmering under a sky so blue it hurt to look at. {{NAME}} had arrived at sunrise with a small backpack, a field notebook, and a feeling that something extraordinary was about to happen. From somewhere in the tall grass came a rumbling sound — not frightening, but like a question. {{NAME}} stepped forward. "Hello?" A pair of enormous amber eyes blinked through the grass.',
  },
  {
    pageNumber:  5,
    gradient:    'from-yellow-50 to-amber-100',
    accentColor: 'text-amber-700',
    text: 'The old lion had been king of this land for fifteen years — but today his crown was heavy. "The watering hole has dried up," he told {{NAME}}, his voice low and tired. "The animals are moving away, and without them this place will die. We have tried everything." {{NAME}} opened the field notebook and studied it carefully. "I think I know what\'s blocking the spring," said {{NAME}}. "Follow me."',
  },
  {
    pageNumber:  12,
    gradient:    'from-orange-50 to-amber-100',
    accentColor: 'text-orange-700',
    text: 'Deep in a rocky ravine, a great tangle of fallen trees had blocked the underground spring. A dozen animals had tried to move them — and failed. But {{NAME}} didn\'t try to push alone. {{NAME}} asked: the elephants to lift, the meerkats to dig, the birds to call out directions from above. Together, slowly, the blockage shifted — and with a great rushing sound, clean cold water burst through, sparkling in the afternoon sun.',
  },
  {
    pageNumber:  20,
    gradient:    'from-lime-50 to-yellow-100',
    accentColor: 'text-green-700',
    text: 'By evening the watering hole was full, and every animal in the savannah had come to drink. The old lion walked beside {{NAME}} as the sun turned orange and enormous behind the flat-topped trees. "In all my years," he said, "I have never seen a human who listened to the land the way you do." {{NAME}} looked out over the rippling gold and green and knew — this was only the first of many quests. The wild had chosen {{NAME}}.',
  },
]

// ── The Mermaid Kingdom ───────────────────────────────────────────────────────

const MERMAID_KINGDOM: StoryPage[] = [
  {
    pageNumber:  1,
    gradient:    'from-cyan-50 to-teal-100',
    accentColor: 'text-teal-700',
    text: 'The shell was unlike any {{NAME}} had ever seen — spiral-shaped, glowing faintly from within, humming a note just below the edge of hearing. When {{NAME}} held it to one ear, a voice as clear as deep water spoke: "We need you. The light of our kingdom is fading. Please come." {{NAME}} stood at the water\'s edge, looked out at the horizon, and stepped in.',
  },
  {
    pageNumber:  5,
    gradient:    'from-teal-50 to-cyan-100',
    accentColor: 'text-cyan-700',
    text: 'The Mermaid Kingdom was everything the stories had promised and more: towers of coral, streets of smooth white sand, gardens that glowed in every colour. But the great Crystal at its heart — the source of all the kingdom\'s light — was cracked, its glow flickering. The mermaid queen bowed her silver-crowned head. "Only a child from the land can mend what we cannot," she said, "because the crack came from forgetting the surface world."',
  },
  {
    pageNumber:  12,
    gradient:    'from-sky-50 to-blue-100',
    accentColor: 'text-blue-700',
    text: 'The Crystal needed something the sea had lost: the memory of rain — of how water fell from clouds and sang as it hit the surface from above. {{NAME}} closed both eyes and remembered: puddles and raincoats, and the smell of the earth drinking, and the sound of drops on a window at night. Slowly, those memories flowed through {{NAME}}\'s hands into the Crystal. The crack began to close.',
  },
  {
    pageNumber:  20,
    gradient:    'from-emerald-50 to-cyan-100',
    accentColor: 'text-emerald-700',
    text: 'The light returned in a wave of warm gold and blue, rushing through every coral tower and shell-paved street. The kingdom erupted with celebration. The queen pressed a small luminous pearl into {{NAME}}\'s palm. "It will glow whenever the sea is thinking of you," she said. "And the sea always will." Back on the beach, as the sun set, {{NAME}} held the pearl and watched it glow — a small, steady light, like a promise kept across two worlds.',
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
