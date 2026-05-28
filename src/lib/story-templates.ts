/**
 * Story pages for every book in the catalogue.
 *
 * Each book has 10 story pages.
 * {{NAME}} is replaced at render time.
 *
 * gradient    — Tailwind CSS from/to pair; must also exist in GRADIENT_CSS in
 *               src/lib/pdf/page-template.ts so the PDF renderer knows the hex values.
 * accentColor — Tailwind text-* class used in the live preview.
 * scene       — AI image-generation prompt describing the visual scene on this page.
 * sceneLabel  — Short human-readable label shown in the progress overlay.
 */

export interface StoryPage {
  pageNumber:  number
  gradient?:   string   // kept optional — StoryPreview.tsx reads this
  accentColor?: string  // kept optional — StoryPreview.tsx reads this
  text:        string
  scene?:      string
  sceneLabel?: string
}

// ── The Enchanted Forest ───────────────────────────────────────────────────────

const ENCHANTED_FOREST: StoryPage[] = [
  {
    pageNumber: 1,
    gradient:    'from-emerald-50 to-teal-100',
    accentColor: 'text-teal-700',
    text: 'Once upon a time, in a forest full of wonder and magic, there lived a brave little adventurer named {{NAME}}. {{NAME}} had always dreamed of exploring the Enchanted Forest — and today, that dream was finally coming true.',
    scene: 'young child standing at the edge of a glowing magical forest at golden dawn, tall ancient trees with luminous leaves, fireflies twinkling, soft morning mist, watercolor style',
    sceneLabel: 'entering the enchanted forest',
  },
  {
    pageNumber: 2,
    gradient:    'from-teal-50 to-emerald-100',
    accentColor: 'text-emerald-700',
    text: 'The moment {{NAME}} stepped between the first two great oaks, the world changed. The air smelled of pine and honey. Every leaf was a different shade of green, and somewhere ahead, something was singing.',
    scene: 'young child walking through towering ancient oak trees, dappled golden light filtering through the canopy, colorful wildflowers, magical atmosphere, watercolor style',
    sceneLabel: 'deep in the forest',
  },
  {
    pageNumber: 3,
    gradient:    'from-emerald-50 to-green-100',
    accentColor: 'text-green-700',
    text: '{{NAME}} followed the sound and found a crystal-clear stream winding through mossy stones. Tiny fish made of light darted beneath the surface. A little frog wearing a crown sat on a lily pad. "You\'re here at last," it croaked.',
    scene: 'young child kneeling by a magical crystal stream, tiny glowing fish in the water, a small frog wearing a tiny golden crown on a lily pad, mossy stones, watercolor style',
    sceneLabel: 'the frog with a crown',
  },
  {
    pageNumber: 4,
    gradient:    'from-amber-50 to-yellow-100',
    accentColor: 'text-amber-700',
    text: '"{{NAME}}!" called a tiny voice from inside the old oak tree. {{NAME}} spun around, heart pounding with excitement. A small golden rabbit with sparkling eyes peered out from a hollow in the bark.',
    scene: 'young child kneeling beside a giant gnarled oak tree, a tiny golden glowing rabbit with sparkling eyes peering from a hollow in the bark, warm golden afternoon light, watercolor style',
    sceneLabel: 'meeting the golden rabbit',
  },
  {
    pageNumber: 5,
    gradient:    'from-yellow-50 to-amber-100',
    accentColor: 'text-yellow-700',
    text: 'The golden rabbit hopped out and shook {{NAME}}\'s hand with great seriousness. "I am Pip," it said. "Guardian of the forest\'s most important secret. I have been waiting for someone brave enough — and kind enough — to help."',
    scene: 'young child shaking paws with a small golden glowing rabbit in a sun-dappled forest clearing, both looking very serious and important, butterflies nearby, watercolor style',
    sceneLabel: 'Pip the guardian rabbit',
  },
  {
    pageNumber: 6,
    gradient:    'from-violet-50 to-purple-100',
    accentColor: 'text-violet-700',
    text: 'Pip led {{NAME}} through a tangle of silver ferns to a clearing where a single tree stood, leafless and dark, its branches reaching up like asking hands. "The Heart Tree," Pip whispered. "It lost its star three winters ago. Without it, the whole forest is forgetting how to glow."',
    scene: 'young child and a golden rabbit looking at a large leafless tree in a clearing, its bare branches reaching upward dramatically, the forest dim and grey around it, watercolor style',
    sceneLabel: 'the Heart Tree',
  },
  {
    pageNumber: 7,
    gradient:    'from-violet-50 to-indigo-100',
    accentColor: 'text-indigo-700',
    text: 'The rabbit bowed deeply. "We have been waiting for you, {{NAME}}. Only you can return the lost star to the sky." {{NAME}} stood tall, took a deep breath, and whispered, "Then let\'s go. Together."',
    scene: 'young child standing tall with quiet determination in a magical purple-lit forest clearing, golden rabbit companion at their feet, stars beginning to appear through the canopy above, watercolor style',
    sceneLabel: 'accepting the quest',
  },
  {
    pageNumber: 8,
    gradient:    'from-indigo-50 to-blue-100',
    accentColor: 'text-indigo-700',
    text: 'They climbed higher and higher, past the sleeping owls and the dreaming foxes, until the forest fell away and {{NAME}} could see the whole dark sky. And there — caught in the branches of a cloud — was a soft, tumbling light.',
    scene: 'young child and golden rabbit climbing toward a hilltop above the forest at night, a softly glowing star caught in the silvery branches of a cloud above them, vast starry sky, watercolor style',
    sceneLabel: 'climbing toward the star',
  },
  {
    pageNumber: 9,
    gradient:    'from-sky-50 to-blue-100',
    accentColor: 'text-blue-700',
    text: 'High above the treetops, {{NAME}} reached out a small hand and caught the falling star. It glowed warm and gold in {{NAME}}\'s palm — and down below, the Heart Tree burst into bloom, its branches blazing with silver light.',
    scene: 'young child standing triumphantly on a treetop reaching up to catch a glowing falling star, the forest below suddenly blazing with silver magical light, night sky full of stars, watercolor style',
    sceneLabel: 'catching the falling star',
  },
  {
    pageNumber: 10,
    gradient:    'from-emerald-50 to-teal-100',
    accentColor: 'text-teal-700',
    text: '{{NAME}} smiled — because somehow, deep down, {{NAME}} had known all along that this was exactly where the story was meant to go. Pip nestled beside {{NAME}} under the glowing tree. "Come back any time," the forest seemed to whisper. "This is your magic too."',
    scene: 'young child sitting peacefully under a magnificent glowing tree in a magical forest at night, the golden rabbit curled beside them, the whole forest shimmering with warm soft light, watercolor style',
    sceneLabel: 'the magic is yours',
  },
]

// ── A Starlight Adventure ─────────────────────────────────────────────────────

const STARLIGHT_ADVENTURE: StoryPage[] = [
  {
    pageNumber: 1,
    gradient:    'from-indigo-50 to-blue-100',
    accentColor: 'text-indigo-700',
    text: 'Far beyond the last street light, past the highest rooftops, where the sky turns from black to the deepest blue — that is where adventures begin. And tonight, the adventure chose {{NAME}}.',
    scene: 'young child looking out a moonlit bedroom window at a vast starry sky, galaxies visible, soft blue light, sense of destiny and wonder, watercolor style',
    sceneLabel: 'gazing at the stars',
  },
  {
    pageNumber: 2,
    gradient:    'from-blue-50 to-indigo-100',
    accentColor: 'text-blue-700',
    text: 'A soft beeping filled the room, and a tiny silver badge on the pillow glowed three times. {{NAME}} sat up and knew, with the certainty that only the bravest explorers ever feel: tonight was the night.',
    scene: 'young child sitting up in bed holding a small glowing silver badge, moonlit bedroom, stars outside the window, magical beginning, watercolor style',
    sceneLabel: 'the glowing badge',
  },
  {
    pageNumber: 3,
    gradient:    'from-violet-50 to-blue-100',
    accentColor: 'text-violet-700',
    text: 'The badge pulled {{NAME}} gently upward — past the window, past the rooftop, up through a warm silver cloud — and into the waiting seat of the smallest, most perfectly made rocket ship {{NAME}} had ever seen.',
    scene: 'young child floating upward through a silver cloud toward a small cozy rocket ship glowing in the night sky, stars all around, wonder and delight, watercolor style',
    sceneLabel: 'rising to the rocket',
  },
  {
    pageNumber: 4,
    gradient:    'from-sky-50 to-cyan-100',
    accentColor: 'text-cyan-700',
    text: '"Hello, {{NAME}}," said a voice like wind chimes. {{NAME}} turned to find a tiny creature made entirely of starlight sitting in the co-pilot\'s seat. "We have been searching the whole galaxy for someone exactly like you," it said.',
    scene: 'young child in a small cozy rocket ship cockpit with wide star-filled windows, a tiny luminous creature made of starlight in the co-pilot seat, deep galaxy view outside, watercolor style',
    sceneLabel: 'meeting the starlight guide',
  },
  {
    pageNumber: 5,
    gradient:    'from-indigo-50 to-violet-100',
    accentColor: 'text-indigo-700',
    text: '"A planet has gone missing," the creature explained, spreading its shimmering arms wide. "It wandered from its orbit long ago, and now it drifts alone in the cold dark. Without a guide, it will drift forever." {{NAME}} gripped the controls. "Show me where."',
    scene: 'young child and a luminous starlight guide studying a glowing holographic star map inside the cozy rocket cockpit, stars and nebulae filling the windows, focus and determination, watercolor style',
    sceneLabel: 'studying the star map',
  },
  {
    pageNumber: 6,
    gradient:    'from-blue-50 to-indigo-100',
    accentColor: 'text-blue-700',
    text: 'They flew through meteor showers and past rings of frozen silver and through clouds of cosmic dust that sparkled like glitter. {{NAME}} steered carefully, calmly, following the ancient map on the glowing screen.',
    scene: 'young child piloting a rocket through a spectacular meteor shower, glowing cosmic dust, rings of frozen silver, stars blazing past, focused expression, watercolor style',
    sceneLabel: 'through the meteor shower',
  },
  {
    pageNumber: 7,
    gradient:    'from-violet-50 to-purple-100',
    accentColor: 'text-violet-700',
    text: 'The lost planet hung in the darkness like a dimming candle. {{NAME}} pressed a hand to the glass and felt something warm pulse back — the planet knew {{NAME}} was there.',
    scene: 'young child inside a spaceship pressing both hands against the glass porthole, outside a beautiful dim glowing planet hangs in the dark cosmos, tender compassionate moment, purple and indigo tones, watercolor style',
    sceneLabel: 'finding the lost planet',
  },
  {
    pageNumber: 8,
    gradient:    'from-indigo-50 to-blue-100',
    accentColor: 'text-indigo-700',
    text: '{{NAME}} broadcast the ancient star signal — a pattern of light as old as the universe itself. The planet trembled. Then, slowly, it began to turn toward home.',
    scene: 'young child at the rocket controls sending out beams of ancient star-light signals toward a distant glowing planet, the planet beginning to slowly turn, cosmic moment, watercolor style',
    sceneLabel: 'sending the star signal',
  },
  {
    pageNumber: 9,
    gradient:    'from-sky-50 to-indigo-100',
    accentColor: 'text-sky-700',
    text: 'The planet blazed gold as {{NAME}} guided it home using the ancient star map. Every star in the sky seemed to cheer. Rings of light rippled outward across the whole galaxy.',
    scene: 'young child piloting a rocket beside a now-blazing golden planet, both moving together through a galaxy of cheering stars, light rippling outward in every direction, joyful, watercolor style',
    sceneLabel: 'guiding the planet home',
  },
  {
    pageNumber: 10,
    gradient:    'from-blue-50 to-indigo-100',
    accentColor: 'text-indigo-700',
    text: 'When {{NAME}}\'s rocket touched down in the back garden at sunrise, everything looked the same — but {{NAME}} knew it wasn\'t. Some adventures change you quietly, from the inside out. {{NAME}} kept the silver badge, just in case.',
    scene: 'young child stepping out of a small rocket in their back garden at sunrise, the sky turning warm golden pink, holding a glowing silver badge, peaceful and changed, watercolor style',
    sceneLabel: 'home again',
  },
]

// ── The Ocean of Dreams ───────────────────────────────────────────────────────

const OCEAN_OF_DREAMS: StoryPage[] = [
  {
    pageNumber: 1,
    gradient:    'from-teal-50 to-cyan-100',
    accentColor: 'text-teal-700',
    text: 'The sea has always kept its most beautiful secrets just below the surface — waiting for someone special to find them. It was waiting for {{NAME}}.',
    scene: 'young child standing at the edge of a shimmering magical ocean at sunrise, glowing turquoise waves, golden reflections, sense of belonging and wonder, watercolor style',
    sceneLabel: 'at the ocean\'s edge',
  },
  {
    pageNumber: 2,
    gradient:    'from-sky-50 to-teal-100',
    accentColor: 'text-sky-700',
    text: 'One morning, when the tide came in and the waves whispered to the shore, {{NAME}} stepped into the shallows and felt something extraordinary: the water welcomed {{NAME}} like an old friend.',
    scene: 'young child stepping into magical glowing shallows, the water swirling around their feet with soft golden light, waves curling gently, early morning, watercolor style',
    sceneLabel: 'stepping into the magic',
  },
  {
    pageNumber: 3,
    gradient:    'from-cyan-50 to-sky-100',
    accentColor: 'text-cyan-700',
    text: 'A warm current wrapped around {{NAME}}\'s ankles and pulled — gently, curiously — and before {{NAME}} could take a breath, the surface was above and the whole underwater world was below.',
    scene: 'young child being gently pulled underwater by a golden current, the ocean surface shimmering above, an entire magical underwater world opening below in brilliant turquoise, watercolor style',
    sceneLabel: 'pulled underwater',
  },
  {
    pageNumber: 4,
    gradient:    'from-sky-50 to-blue-100',
    accentColor: 'text-blue-700',
    text: '"We\'ve heard about you, {{NAME}}," said the octopus. "The sea creatures have been talking about nothing else." {{NAME}} felt a flush of pride. "The ocean\'s light is fading," the octopus continued. "Only someone who truly loves the sea can bring it back."',
    scene: 'young child underwater surrounded by colorful sea creatures, a friendly purple octopus with swirling kind eyes gesturing gracefully, glowing coral reef behind, magical undersea scene, watercolor style',
    sceneLabel: 'meeting the wise octopus',
  },
  {
    pageNumber: 5,
    gradient:    'from-teal-50 to-emerald-100',
    accentColor: 'text-teal-700',
    text: 'A pod of dolphins arrived, looping and leaping around {{NAME}} in circles of silver bubbles. The oldest one pressed its nose gently to {{NAME}}\'s forehead. "We will guide you," it clicked. "But you must be the one to heal it."',
    scene: 'young child underwater surrounded by a joyful pod of dolphins creating silver bubble circles, the oldest dolphin gently touching their forehead, deep ocean blue and green, watercolor style',
    sceneLabel: 'the dolphin guides',
  },
  {
    pageNumber: 6,
    gradient:    'from-blue-50 to-cyan-100',
    accentColor: 'text-blue-700',
    text: 'They swam down, deeper and deeper, past sleeping whales and gardens of waving sea grass, until the water turned cold and the light turned a pale, fading blue.',
    scene: 'young child swimming deeper past enormous sleeping whales and swaying sea grass gardens, the light growing a pale cold blue as they descend, tiny fish glowing around them, watercolor style',
    sceneLabel: 'descending to the deep',
  },
  {
    pageNumber: 7,
    gradient:    'from-cyan-50 to-teal-100',
    accentColor: 'text-cyan-700',
    text: 'Deep in a coral cave, where the last of the ocean\'s glow still pulsed, {{NAME}} found the ancient pearl. {{NAME}} cupped it gently. "Warm it with your heart," the octopus had said. {{NAME}} closed both hands around it and thought of everything beautiful — and brave — and good.',
    scene: 'young child deep underwater in a glowing bioluminescent coral cave, cradling a dark ancient pearl in cupped hands, soft magical light pulsing, quiet and tender moment, watercolor style',
    sceneLabel: 'the ancient pearl',
  },
  {
    pageNumber: 8,
    gradient:    'from-emerald-50 to-teal-100',
    accentColor: 'text-emerald-700',
    text: 'The pearl began to warm. Then to glow. A thin crack of gold split across its surface — and from inside came a sound like all the rain that had ever fallen into the sea at once.',
    scene: 'young child holding a cracking glowing pearl, golden light streaming through the cracks, the deep ocean beginning to fill with warm golden radiance, awe on the child\'s face, watercolor style',
    sceneLabel: 'the pearl awakens',
  },
  {
    pageNumber: 9,
    gradient:    'from-teal-50 to-cyan-100',
    accentColor: 'text-teal-700',
    text: 'Light exploded outward in every colour imaginable. Fish, dolphins, sea turtles, and jellyfish spun in a glowing spiral as the ocean woke back up. {{NAME}} rose toward the surface laughing, the pearl blazing in one hand.',
    scene: 'young child rising through an underwater explosion of rainbow-colored light, dolphins sea turtles and fish swirling in a glowing spiral all around, pure joy, the ocean celebrating, watercolor style',
    sceneLabel: 'the ocean awakens',
  },
  {
    pageNumber: 10,
    gradient:    'from-sky-50 to-teal-100',
    accentColor: 'text-sky-700',
    text: '{{NAME}} stepped back onto the shore as the sun broke through the clouds. The sea sparkled in a thousand colours. The pearl rested in {{NAME}}\'s pocket — small, warm, and alive. The ocean had given {{NAME}} a piece of itself to keep forever.',
    scene: 'young child standing on a sunlit beach as the sea sparkles in a thousand colors, a small warm glow in their pocket, waves gentle and joyful, golden morning light, watercolor style',
    sceneLabel: 'the sea\'s gift',
  },
]

// ── The Dragon Keeper ─────────────────────────────────────────────────────────

const DRAGON_KEEPER: StoryPage[] = [
  {
    pageNumber: 1,
    gradient:    'from-red-50 to-rose-100',
    accentColor: 'text-rose-700',
    text: 'The mountain had many names — Forbidden Peak, the Sleeping Giant, the Place Where No One Goes — but {{NAME}} called it by the name that mattered most: Waiting. Because ever since {{NAME}} could remember, the mountain had felt like it was waiting for someone.',
    scene: 'young child at the base of a dramatic misty mountain looking up at a winding path disappearing into fog, dramatic peaks, morning mist, sense of destiny calling, watercolor style',
    sceneLabel: 'the calling mountain',
  },
  {
    pageNumber: 2,
    gradient:    'from-rose-50 to-orange-100',
    accentColor: 'text-rose-700',
    text: 'The other children said to stay away. The villagers left bread on the doorstep and hurried home before dark. But {{NAME}} had never been afraid of the mountain. {{NAME}} had always felt, somehow, that it was a friend who had not yet been introduced.',
    scene: 'young child walking alone on a mountain path while a village can be seen far below, bold and curious, mist swirling around rocky outcroppings, warm autumn colors, watercolor style',
    sceneLabel: 'walking alone',
  },
  {
    pageNumber: 3,
    gradient:    'from-orange-50 to-amber-100',
    accentColor: 'text-orange-700',
    text: 'Halfway up the path, {{NAME}} found a single copper-colored scale lying on the rocks. It was warm to the touch, even in the cold mountain air. And it was the most beautiful thing {{NAME}} had ever held.',
    scene: 'young child kneeling on a rocky mountain path holding a beautiful copper-colored scale that glows warmly, mountain mist all around, curious and wonder-struck, watercolor style',
    sceneLabel: 'finding the dragon scale',
  },
  {
    pageNumber: 4,
    gradient:    'from-amber-50 to-red-100',
    accentColor: 'text-amber-700',
    text: 'The cave was warm — warmer than it should have been — and lit from within by a deep amber glow. Curled in the very back, as large as a bus and as lonely as a lighthouse, was the dragon. It was magnificent: scales like hammered copper, eyes the colour of embers.',
    scene: 'young child inside a warm mountain cave seeing an enormous magnificent dragon with gleaming copper scales and glowing ember eyes for the first time, warm amber light, pure awe, watercolor style',
    sceneLabel: 'meeting the dragon',
  },
  {
    pageNumber: 5,
    gradient:    'from-red-50 to-orange-100',
    accentColor: 'text-red-700',
    text: 'The dragon did not roar. It did not breathe fire. It simply watched {{NAME}} with those great ember eyes, and {{NAME}} watched back. After a long moment, it lowered its enormous head — just slightly — the way you do when you meet someone you have been hoping to meet.',
    scene: 'young child and a magnificent copper-scaled dragon regarding each other with quiet curiosity in a warm cave, the dragon lowering its great head gently, a moment of recognition, watercolor style',
    sceneLabel: 'a quiet meeting',
  },
  {
    pageNumber: 6,
    gradient:    'from-rose-50 to-red-100',
    accentColor: 'text-red-700',
    text: '"I have forgotten how to fly," the dragon said softly. {{NAME}} sat down beside the great creature and said simply: "Then we\'ll remember together." The dragon blinked its ember eyes. "You would do that — for me?" "What are friends for?" said {{NAME}}.',
    scene: 'young child sitting close beside a massive copper-scaled dragon in a cave, a quiet moment of deep friendship and trust beginning, gentle firelight, tender and warm, watercolor style',
    sceneLabel: 'a new friendship',
  },
  {
    pageNumber: 7,
    gradient:    'from-orange-50 to-amber-100',
    accentColor: 'text-orange-700',
    text: 'Every day {{NAME}} climbed the mountain. They talked about the sky and the wind and what it had felt like to soar. Slowly, the dragon began to stretch its great wings again — first just an inch, then a foot, then wider and wider.',
    scene: 'young child watching a magnificent dragon stretching enormous copper wings wide in front of a mountain cave entrance, the wings catching late afternoon sunlight, hope and progress, watercolor style',
    sceneLabel: 'learning to stretch',
  },
  {
    pageNumber: 8,
    gradient:    'from-amber-50 to-orange-100',
    accentColor: 'text-amber-700',
    text: 'On the fortieth day, the dragon said: "I think I am ready. Will you come?" {{NAME}} climbed up carefully and settled between the great copper wings. The dragon took one long breath, crouched, and leapt.',
    scene: 'young child climbing carefully onto the back of a magnificent copper dragon at the edge of a mountain peak, the dragon crouching and preparing to leap, dramatic moment, sunset light, watercolor style',
    sceneLabel: 'the first flight',
  },
  {
    pageNumber: 9,
    gradient:    'from-red-50 to-amber-100',
    accentColor: 'text-amber-700',
    text: 'They flew until the stars came out — {{NAME}} on the dragon\'s back, wind roaring past their ears, the whole world spread below like a map of everywhere worth going. The dragon laughed for the first time in a hundred years.',
    scene: 'young child riding joyfully on the back of a magnificent copper dragon soaring through a star-filled sky above mountain peaks, wind and freedom and exhilaration, stars and moonlight, watercolor style',
    sceneLabel: 'flying through the stars',
  },
  {
    pageNumber: 10,
    gradient:    'from-amber-50 to-orange-100',
    accentColor: 'text-orange-700',
    text: 'When they landed on the mountain peak, the dragon looked at {{NAME}} with those ember eyes full of warmth. "You gave me back the sky," it said. {{NAME}} smiled. "You were always going to fly again. You just needed a friend to believe it first."',
    scene: 'young child and a magnificent copper dragon sitting together on a mountaintop at night, the dragon looking down warmly, stars and moonlight, deep friendship, watercolor style',
    sceneLabel: 'friends on the peak',
  },
]

// ── The Time Traveller ────────────────────────────────────────────────────────

const TIME_TRAVELLER: StoryPage[] = [
  {
    pageNumber: 1,
    gradient:    'from-amber-50 to-yellow-100',
    accentColor: 'text-amber-700',
    text: 'It was the sort of watch that made you feel, the moment you held it, that something extraordinary was about to happen. {{NAME}} found it in a dusty cardboard box at the very back of the very top shelf — a golden pocket watch, ticking steadily.',
    scene: 'young child in a dusty sunlit attic discovering a gleaming golden pocket watch in an old cardboard box, golden dust motes floating in sunlight, sense of discovery, watercolor style',
    sceneLabel: 'finding the golden watch',
  },
  {
    pageNumber: 2,
    gradient:    'from-yellow-50 to-amber-100',
    accentColor: 'text-yellow-700',
    text: 'The symbols around the watch face glowed faintly when {{NAME}} traced a finger over them. A faint hum filled the attic. And then the floor disappeared.',
    scene: 'young child in an attic holding a glowing pocket watch as golden swirling time-light begins to appear around them, the world starting to dissolve, awe and excitement, watercolor style',
    sceneLabel: 'time begins to swirl',
  },
  {
    pageNumber: 3,
    gradient:    'from-lime-50 to-green-100',
    accentColor: 'text-green-700',
    text: '{{NAME}} landed softly in a world of impossible green. Trees taller than buildings. Ferns the size of houses. The air smelled like rain and earth and something ancient. And somewhere nearby, something very large was moving.',
    scene: 'young child surrounded by enormous prehistoric ferns and jungle vegetation, trees impossibly tall, lush prehistoric world in brilliant greens, sense of enormous scale, watercolor style',
    sceneLabel: 'the prehistoric jungle',
  },
  {
    pageNumber: 4,
    gradient:    'from-green-50 to-lime-100',
    accentColor: 'text-green-700',
    text: 'The dinosaurs were bigger than any picture in any book — and one of them was looking straight at {{NAME}}. It was a young Triceratops, no taller than a car, with wide gentle eyes and a small worried crease between its horns.',
    scene: 'young child face to face with a gentle young Triceratops dinosaur in a lush prehistoric jungle, the dinosaur has wide curious gentle eyes, prehistoric ferns and trees, watercolor style',
    sceneLabel: 'meeting the triceratops',
  },
  {
    pageNumber: 5,
    gradient:    'from-emerald-50 to-teal-100',
    accentColor: 'text-emerald-700',
    text: 'The little Triceratops had wandered away from its herd and was going in circles around a split tree, confused and frightened. {{NAME}} crouched down slowly and held out a hand — and waited.',
    scene: 'young child crouching very still with hand gently outstretched toward a small frightened Triceratops near a split ancient tree, patient and kind, prehistoric jungle all around, watercolor style',
    sceneLabel: 'earning its trust',
  },
  {
    pageNumber: 6,
    gradient:    'from-teal-50 to-green-100',
    accentColor: 'text-teal-700',
    text: 'The Triceratops sniffed {{NAME}}\'s hand. Then it nuzzled against {{NAME}}\'s shoulder with surprising gentleness. Together they set off through the jungle, {{NAME}} listening to the sounds of the herd calling in the distance.',
    scene: 'young child walking side by side with a small Triceratops through a lush prehistoric jungle, the dinosaur nuzzling gently, following the sound of a distant herd, warm afternoon light, watercolor style',
    sceneLabel: 'walking together',
  },
  {
    pageNumber: 7,
    gradient:    'from-yellow-50 to-amber-100',
    accentColor: 'text-amber-700',
    text: 'The herd had gathered at the river, and they stamped with relief when the young Triceratops came trotting back. One enormous adult turned and regarded {{NAME}} with an eye as deep as a well. It bowed its great crested head, just once, slowly.',
    scene: 'young child at the edge of a prehistoric river watching a herd of Triceratops reuniting, a huge adult Triceratops bowing its great crested head in silent gratitude, watercolor style',
    sceneLabel: 'the herd says thank you',
  },
  {
    pageNumber: 8,
    gradient:    'from-amber-50 to-orange-100',
    accentColor: 'text-orange-700',
    text: '{{NAME}} bowed back. The whole herd seemed to breathe out at once. Then the young Triceratops turned, looked at {{NAME}} one last time with those gentle eyes, and trotted home.',
    scene: 'young child bowing respectfully to a herd of Triceratops by a river, the young dinosaur looking back one last time, prehistoric sunset sky, bittersweet farewell, watercolor style',
    sceneLabel: 'a respectful goodbye',
  },
  {
    pageNumber: 9,
    gradient:    'from-amber-50 to-yellow-100',
    accentColor: 'text-amber-700',
    text: 'Three turns of the crown counter-clockwise, and {{NAME}} was back — same dusty shelf, same afternoon light, same attic. But {{NAME}} was not the same at all.',
    scene: 'young child materializing back in the dusty sunlit attic holding the golden watch, everything familiar and the same, but the child quietly transformed, golden light, watercolor style',
    sceneLabel: 'back home',
  },
  {
    pageNumber: 10,
    gradient:    'from-orange-50 to-amber-100',
    accentColor: 'text-orange-700',
    text: 'The watch went back on the shelf, still ticking. {{NAME}} sat quietly for a long time, thinking of a young Triceratops and a slow bow that would last forever. Some moments, once lived, belong to you always.',
    scene: 'young child sitting peacefully in a warm sunlit attic looking out a dusty window in quiet reflection, golden afternoon light, changed forever, the watch visible on the shelf, watercolor style',
    sceneLabel: 'forever changed',
  },
]

// ── The Superhero Academy ─────────────────────────────────────────────────────

const SUPERHERO_ACADEMY: StoryPage[] = [
  {
    pageNumber: 1,
    gradient:    'from-indigo-50 to-violet-100',
    accentColor: 'text-indigo-700',
    text: 'The acceptance letter arrived in a silver envelope that glowed faintly in the dark. {{NAME}} turned it over three times before daring to open it. Inside, in bold golden letters: "Welcome to the Superhero Academy. Your gift is real. Your training begins now."',
    scene: 'young child holding open a glowing silver envelope with golden magical letters inside, nighttime bedroom, wonder and excitement, soft magical light illuminating their face, watercolor style',
    sceneLabel: 'the invitation arrives',
  },
  {
    pageNumber: 2,
    gradient:    'from-violet-50 to-indigo-100',
    accentColor: 'text-violet-700',
    text: 'The Academy floated on a cloud above the city — a great silver building with tall windows and a rooftop that touched the stars. {{NAME}} rode the beam of a sunrise up to the front gates and walked in.',
    scene: 'young child approaching a magnificent silver superhero academy building floating on clouds above a city, sunrise beams of light, golden and violet tones, sense of scale and wonder, watercolor style',
    sceneLabel: 'arriving at the academy',
  },
  {
    pageNumber: 3,
    gradient:    'from-blue-50 to-indigo-100',
    accentColor: 'text-blue-700',
    text: 'On the first day, the teacher turned to {{NAME}}. "And what is your gift?" {{NAME}} took a breath — and the whole room filled with warmth, a golden glow that made everyone smile without knowing why.',
    scene: 'young child at a superhero academy classroom radiating golden warmth that fills the entire room, other students and teacher smiling and glowing, powerful and heartwarming moment, watercolor style',
    sceneLabel: 'discovering the gift',
  },
  {
    pageNumber: 4,
    gradient:    'from-violet-50 to-purple-100',
    accentColor: 'text-violet-700',
    text: '"I see," said the teacher softly. "You give people courage. That is the rarest power of all." The other students looked at {{NAME}} with wide eyes. Some of them already felt braver than they had in years.',
    scene: 'young child standing in a classroom of amazed fellow young heroes, a teacher looking on with deep respect, the room still glowing with warm golden courage, watercolor style',
    sceneLabel: 'the rarest power',
  },
  {
    pageNumber: 5,
    gradient:    'from-indigo-50 to-blue-100',
    accentColor: 'text-indigo-700',
    text: '{{NAME}} trained hard — learning to focus the warmth, to send it farther, to aim it precisely where it was needed most. Some days it was easy. Other days, especially when {{NAME}} felt small, it was the hardest thing in the world.',
    scene: 'young child training in a bright Academy hall, practicing focusing golden light between their hands with deep concentration, sweat and effort, fellow heroes training in the background, watercolor style',
    sceneLabel: 'the hard training days',
  },
  {
    pageNumber: 6,
    gradient:    'from-purple-50 to-indigo-100',
    accentColor: 'text-purple-700',
    text: 'When a classmate named Zara lost her power during a difficult drill, {{NAME}} sat with her quietly and shared the warmth until Zara could feel it herself again. The teacher watched from the doorway and said nothing. But she was smiling.',
    scene: 'young child sitting beside a sad classmate in a quiet corner of the academy, sharing a gentle glow of warmth, the classmate beginning to smile, the teacher watching from a doorway with pride, watercolor style',
    sceneLabel: 'helping a friend',
  },
  {
    pageNumber: 7,
    gradient:    'from-blue-50 to-indigo-100',
    accentColor: 'text-indigo-700',
    text: 'The academy alarm rang for the first time in fifty years. A great storm of fear was sweeping toward the city — thick and dark, making every person below feel hopeless and small.',
    scene: 'young child looking out a tall academy window at a dramatic dark storm of fear sweeping toward a city below, lightning and dark clouds rolling in, urgent and dramatic, watercolor style',
    sceneLabel: 'the fear storm arrives',
  },
  {
    pageNumber: 8,
    gradient:    'from-indigo-50 to-violet-100',
    accentColor: 'text-violet-700',
    text: 'One by one the students faltered. But {{NAME}} stood firm at the edge of the tower, raised both hands, and sent that golden warmth out into the dark clouds — not fighting the storm, but simply refusing to be afraid of it.',
    scene: 'young child standing heroically at the edge of a tall tower with arms raised wide, sending waves of golden warm light into a dramatic dark stormy sky, city lights below, courageous, watercolor style',
    sceneLabel: 'facing the storm',
  },
  {
    pageNumber: 9,
    gradient:    'from-violet-50 to-purple-100',
    accentColor: 'text-purple-700',
    text: 'The storm cleared. The city woke up brave again. The teacher placed a gleaming badge on {{NAME}}\'s chest — not for having the strongest power, but for being exactly the hero the world most needed.',
    scene: 'young child receiving a gleaming golden superhero badge from a proud teacher in the academy hall, other young heroes cheering, golden light, warm and triumphant moment, watercolor style',
    sceneLabel: 'the hero badge',
  },
  {
    pageNumber: 10,
    gradient:    'from-indigo-50 to-blue-100',
    accentColor: 'text-indigo-700',
    text: 'That night, {{NAME}} looked out over the city from the rooftop. It sparkled and hummed below, full of people who didn\'t know what had happened — but who felt, somehow, just a little braver than before. {{NAME}} smiled. That was enough.',
    scene: 'young child standing on the academy rooftop at night looking out over a sparkling city below, a small hero badge glowing on their chest, peaceful and purposeful, stars above, watercolor style',
    sceneLabel: 'watching over the city',
  },
]

// ── The Pirate's Treasure ─────────────────────────────────────────────────────

const PIRATE_TREASURE: StoryPage[] = [
  {
    pageNumber: 1,
    gradient:    'from-sky-50 to-blue-100',
    accentColor: 'text-sky-700',
    text: 'The map appeared rolled up inside a bottle that washed onto the beach on the morning of {{NAME}}\'s birthday. It was old — old enough that the ink had turned the colour of a sunset — and right in the centre it read: "Only the bravest captain will find this."',
    scene: 'young child on a sunny birthday beach holding a rolled-up ancient treasure map from a glass bottle just washed ashore, ocean waves, warm morning light, watercolor style',
    sceneLabel: 'the map in a bottle',
  },
  {
    pageNumber: 2,
    gradient:    'from-blue-50 to-teal-100',
    accentColor: 'text-blue-700',
    text: 'The map led to the old harbour, where a small wooden ship sat as if it had been waiting there all along. Its sails were a deep red, its hull was painted with sea creatures, and above the door to the captain\'s cabin was a single word: {{NAME}}.',
    scene: 'young child arriving at a harbour to find a beautiful wooden sailing ship with red sails and sea creatures painted on the hull, their name above the captain\'s door, watercolor style',
    sceneLabel: 'the waiting ship',
  },
  {
    pageNumber: 3,
    gradient:    'from-teal-50 to-cyan-100',
    accentColor: 'text-teal-700',
    text: '"Captain {{NAME}}!" squawked a parrot from the ship\'s mast — a parrot with feathers the colours of a stained-glass window and eyes that held a thousand secrets. "I\'ve been waiting for you for a hundred years," it said.',
    scene: 'young child on a pirate ship deck looking up at a magnificent colorful parrot with jewel-bright feathers perched on the mast, sparkling ocean all around, watercolor style',
    sceneLabel: 'the parrot with secrets',
  },
  {
    pageNumber: 4,
    gradient:    'from-sky-50 to-teal-100',
    accentColor: 'text-sky-700',
    text: 'They sailed for three days and three nights, past cliffs of red rock and islands covered in flowers and a lighthouse made entirely of stacked driftwood. The parrot told stories. {{NAME}} steered. The wind was always exactly right.',
    scene: 'young child steering a wooden sailing ship through a beautiful ocean with red rock cliffs and flower-covered islands visible, colorful parrot on the railing, adventure and freedom, watercolor style',
    sceneLabel: 'sailing the open sea',
  },
  {
    pageNumber: 5,
    gradient:    'from-blue-50 to-sky-100',
    accentColor: 'text-blue-700',
    text: 'On the third night, a great storm rose. Waves like hills crashed over the deck. The map got wet and the ink ran. "What do we do?" {{NAME}} shouted over the wind. "You already know the way," the parrot called back.',
    scene: 'young child gripping the wheel of a wooden ship in a dramatic ocean storm, massive waves, rain, the parrot clinging to a rope nearby, brave and determined, watercolor style',
    sceneLabel: 'the great storm',
  },
  {
    pageNumber: 6,
    gradient:    'from-cyan-50 to-blue-100',
    accentColor: 'text-cyan-700',
    text: 'The Sea Serpent rose from the deep, vast and ancient and lonely. Every pirate in history had fled from those glowing eyes. But {{NAME}} did not. "You are not my enemy," {{NAME}} said steadily. The serpent blinked.',
    scene: 'young child on a ship bravely facing an enormous ancient sea serpent rising from stormy ocean waves, the serpent has surprised and curious glowing eyes, child stands calm and fearless, watercolor style',
    sceneLabel: 'the sea serpent',
  },
  {
    pageNumber: 7,
    gradient:    'from-teal-50 to-sky-100',
    accentColor: 'text-teal-700',
    text: '"No one has ever said that to me before," the serpent said. Its voice was low and deep, like a bell rung underwater. "Everyone runs." "I can see you\'re lonely," said {{NAME}}. "And loneliness is nothing to be afraid of. I know that too."',
    scene: 'young child on a calm ship speaking gently to a great sea serpent whose enormous head hovers above the water, the serpent looking surprised and moved, still ocean at night, watercolor style',
    sceneLabel: 'speaking to loneliness',
  },
  {
    pageNumber: 8,
    gradient:    'from-sky-50 to-cyan-100',
    accentColor: 'text-sky-700',
    text: 'The serpent guided the ship safely to the island. It didn\'t say goodbye — sea serpents rarely do — but as the ship pulled away, its great tail rose once from the water and fell in a slow wave.',
    scene: 'young child watching from the ship as a great sea serpent\'s tail rises from the water in a farewell wave, a small tropical island ahead, dawn sky pink and gold, watercolor style',
    sceneLabel: 'a serpent farewell',
  },
  {
    pageNumber: 9,
    gradient:    'from-blue-50 to-sky-100',
    accentColor: 'text-blue-700',
    text: 'The treasure chest was not full of gold. It was full of letters — hundreds of them, from children across centuries who had made it this far. {{NAME}} added one too. Then looked out at the sea stretching endlessly in every direction.',
    scene: 'young child on a remote tropical island opening a treasure chest overflowing with handwritten letters, warm golden sunset, ocean horizon stretching endlessly, wonder and connection, watercolor style',
    sceneLabel: 'the real treasure',
  },
  {
    pageNumber: 10,
    gradient:    'from-cyan-50 to-teal-100',
    accentColor: 'text-cyan-700',
    text: 'The best treasure was never gold. The best treasure was the journey — the storm you didn\'t run from, the serpent you befriended, the map that got wet and still got you there. {{NAME}} sealed the chest, patted it once, and sailed for home.',
    scene: 'young child sailing homeward on the wooden ship at golden sunset, colorful parrot on the railing, the ocean sparkling all around, happy and peaceful, watercolor style',
    sceneLabel: 'sailing for home',
  },
]

// ── The Magic Academy ─────────────────────────────────────────────────────────

const MAGIC_ACADEMY: StoryPage[] = [
  {
    pageNumber: 1,
    gradient:    'from-purple-50 to-violet-100',
    accentColor: 'text-violet-700',
    text: 'The doors of Wyndmere Academy were as tall as oak trees and carved with stars that moved when you weren\'t looking at them directly. {{NAME}} had read every book ever written about magic but had never cast a single spell. "That\'s precisely why we chose you," said the headmistress at the gate.',
    scene: 'young child arriving at towering magical academy doors carved with moving stars, stone archway, magical mist, sense of awe and belonging, golden light from within, watercolor style',
    sceneLabel: 'arriving at Wyndmere',
  },
  {
    pageNumber: 2,
    gradient:    'from-violet-50 to-purple-100',
    accentColor: 'text-purple-700',
    text: 'Wyndmere was enormous and impossible — staircases that changed direction mid-step, classrooms that floated slowly through the building, a library so large that some rooms hadn\'t been visited in living memory. {{NAME}} loved every inch of it immediately.',
    scene: 'young child in a magical academy corridor with staircases going in every direction, floating classrooms, books flying through the air, golden magical light, wide-eyed wonder, watercolor style',
    sceneLabel: 'the magical halls',
  },
  {
    pageNumber: 3,
    gradient:    'from-fuchsia-50 to-purple-100',
    accentColor: 'text-fuchsia-700',
    text: 'In the first lesson, students had to light a candle using only their thoughts. The other students flickered theirs to life easily. {{NAME}} stared at the wick for a long time — but nothing happened. "Don\'t push it," a classmate whispered. "Listen to it instead."',
    scene: 'young child sitting at a wooden desk staring with deep concentration at an unlit candle, other students\'s candles glowing, the room warm and magical, patience and determination, watercolor style',
    sceneLabel: 'the candle lesson',
  },
  {
    pageNumber: 4,
    gradient:    'from-purple-50 to-fuchsia-100',
    accentColor: 'text-purple-700',
    text: 'When it was {{NAME}}\'s turn the next day, something unexpected happened: the candle didn\'t just light — every candle in the room lit, and the ceiling filled with small golden stars. The class went completely silent.',
    scene: 'young child in a magic classroom accidentally lighting every candle in the room simultaneously, ceiling filling with hundreds of tiny golden stars, amazed classmates and wide-eyed teacher watching, watercolor style',
    sceneLabel: 'every candle lights',
  },
  {
    pageNumber: 5,
    gradient:    'from-indigo-50 to-violet-100',
    accentColor: 'text-indigo-700',
    text: 'The headmistress called {{NAME}} aside. "Your gift is unusual," she said, sitting by the fire. "You don\'t cast magic on things. You wake up the magic that is already inside them. That is called kindling — and it is very rare."',
    scene: 'young child sitting by a warm fireplace with a wise headmistress in a cozy study, golden firelight, magical books on shelves, an important and intimate conversation, watercolor style',
    sceneLabel: 'the kindling gift',
  },
  {
    pageNumber: 6,
    gradient:    'from-violet-50 to-indigo-100',
    accentColor: 'text-violet-700',
    text: '{{NAME}} stood before the locked door while every other student waited. This door had been sealed for two hundred years. Slowly, {{NAME}} reached out a hand — not to cast a spell, but simply to listen. The door seemed to breathe. Then it opened.',
    scene: 'young child reaching out a gentle listening hand toward enormous ancient sealed library doors in a stone corridor, magical golden light streaming through the crack as doors begin to open, other students watching in awe, watercolor style',
    sceneLabel: 'the door opens',
  },
  {
    pageNumber: 7,
    gradient:    'from-fuchsia-50 to-violet-100',
    accentColor: 'text-fuchsia-700',
    text: 'Inside was the oldest room in the academy — and every book was dark, every spell dormant, the magic drained long ago by a great sadness. {{NAME}} walked slowly through the shelves, trailing fingers along the spines. One by one, the books began to glow.',
    scene: 'young child walking slowly through a vast dark ancient library, trailing fingers along bookshelves, books beginning to light up one by one as they pass, golden magic awakening, watercolor style',
    sceneLabel: 'waking the library',
  },
  {
    pageNumber: 8,
    gradient:    'from-purple-50 to-violet-100',
    accentColor: 'text-purple-700',
    text: 'The whole library blazed with recovered light. Old spells rose from the pages like butterflies. Students and teachers came running. The oldest professor, who had studied magic for eighty years, sat down on the floor and cried.',
    scene: 'young child standing in a magnificent blazing library as old spells rise from books like golden butterflies, professors and students arriving in awe, the elderly professor sitting down overcome with emotion, watercolor style',
    sceneLabel: 'magic returns',
  },
  {
    pageNumber: 9,
    gradient:    'from-violet-50 to-fuchsia-100',
    accentColor: 'text-violet-700',
    text: 'By the end of the first year, everyone at Wyndmere had learned something new about magic. But the most important lesson hadn\'t come from a book or a spell — it had come from watching {{NAME}}.',
    scene: 'young child standing warmly in a magical academy courtyard at golden hour, fellow students and teachers gathered around, golden magical light glowing, confident and kind, watercolor style',
    sceneLabel: 'the heart of magic',
  },
  {
    pageNumber: 10,
    gradient:    'from-pink-50 to-fuchsia-100',
    accentColor: 'text-fuchsia-700',
    text: 'Magic, {{NAME}} had shown them, is not something you do to the world. It is something you notice in it — something you wake up, piece by piece, whenever you are quiet enough to listen. {{NAME}} walked home through the moving stars and was already looking forward to next year.',
    scene: 'young child walking through magical academy grounds at night under a sky of moving stars, warm light in the windows above, peaceful and purposeful, looking forward, watercolor style',
    sceneLabel: 'the lesson of listening',
  },
]

// ── The Safari Quest ──────────────────────────────────────────────────────────

const SAFARI_QUEST: StoryPage[] = [
  {
    pageNumber: 1,
    gradient:    'from-amber-50 to-orange-100',
    accentColor: 'text-amber-700',
    text: 'The golden savannah stretched in every direction, shimmering under a sky so blue it hurt to look at. {{NAME}} had arrived at sunrise with a small backpack, a field notebook, and a feeling that something extraordinary was about to happen.',
    scene: 'young child with a small backpack and field notebook standing on the vast golden African savannah at sunrise, acacia trees silhouetted against a brilliant blue sky, watercolor style',
    sceneLabel: 'arriving on the savannah',
  },
  {
    pageNumber: 2,
    gradient:    'from-orange-50 to-amber-100',
    accentColor: 'text-orange-700',
    text: 'From somewhere in the tall grass came a rumbling sound — not frightening, but like a question. {{NAME}} stepped forward. "Hello?" A pair of enormous amber eyes blinked through the grass. Then a great mane parted the stems.',
    scene: 'young child stepping toward tall golden grass as a magnificent lion slowly emerges, enormous amber eyes meeting the child\'s gaze, calm and curious encounter, warm sunrise light, watercolor style',
    sceneLabel: 'the lion appears',
  },
  {
    pageNumber: 3,
    gradient:    'from-amber-50 to-yellow-100',
    accentColor: 'text-amber-700',
    text: 'The old lion had been king of this land for fifteen years — but today his crown was heavy. "The watering hole has dried up," he told {{NAME}}, his voice low and tired. "The animals are leaving. Without water, everything here will die."',
    scene: 'young child sitting on dry cracked earth in conversation with a noble old lion, dry savannah all around, a serious and solemn moment of listening, watercolor style',
    sceneLabel: 'the lion\'s trouble',
  },
  {
    pageNumber: 4,
    gradient:    'from-yellow-50 to-orange-100',
    accentColor: 'text-yellow-700',
    text: '{{NAME}} opened the field notebook and studied the land carefully. Sketched the dry riverbeds. Traced the paths the animals had worn. "The water is still here," {{NAME}} said slowly. "It\'s just been blocked."',
    scene: 'young child sitting on the savannah drawing careful sketches of riverbeds and terrain in a field notebook, the old lion watching attentively, mid-morning golden light, watercolor style',
    sceneLabel: 'reading the land',
  },
  {
    pageNumber: 5,
    gradient:    'from-orange-50 to-red-100',
    accentColor: 'text-orange-700',
    text: 'A family of elephants agreed to lead {{NAME}} to the deepest part of the ravine — a place they hadn\'t visited since their grandmothers were calves. They walked in single file, trunks swaying, trusting {{NAME}} completely.',
    scene: 'young child walking in single file with a family of elephants through a rocky ravine, trunks swaying, the landscape rugged and dramatic, trust and purpose, watercolor style',
    sceneLabel: 'walking with elephants',
  },
  {
    pageNumber: 6,
    gradient:    'from-amber-50 to-orange-100',
    accentColor: 'text-amber-700',
    text: 'Deep in the ravine, a great tangle of fallen trees had blocked the underground spring. Water was backing up behind it, going nowhere. {{NAME}} looked at the elephants, the meerkats watching from above, the birds calling from the branches. "We need all of you," {{NAME}} said.',
    scene: 'young child standing in a rocky ravine looking at a huge tangle of fallen trees blocking a spring, elephants gathered, meerkats peering from rocks, birds perched above, a plan forming, watercolor style',
    sceneLabel: 'finding the blockage',
  },
  {
    pageNumber: 7,
    gradient:    'from-orange-50 to-amber-100',
    accentColor: 'text-orange-700',
    text: '{{NAME}} asked the elephants to lift, the meerkats to dig, the birds to call out directions from above. Together, slowly, the blockage shifted. And then — with a great rushing sound — clean cold water burst through.',
    scene: 'young child coordinating elephants lifting fallen trees while meerkats dig and birds guide from treetops, a burst of sparkling water suddenly rushing free, teamwork and triumph, watercolor style',
    sceneLabel: 'freeing the spring',
  },
  {
    pageNumber: 8,
    gradient:    'from-yellow-50 to-amber-100',
    accentColor: 'text-yellow-700',
    text: 'The animals cheered in their different ways — trumpeting and calling and stamping and singing. The watering hole filled by evening. Zebras and giraffes came first, then the smaller ones, then the birds in great sweeping flocks.',
    scene: 'young child watching with joy as a watering hole fills with water and animals begin arriving from all directions — zebras giraffes birds small creatures — the savannah celebrating, watercolor style',
    sceneLabel: 'the watering hole fills',
  },
  {
    pageNumber: 9,
    gradient:    'from-orange-50 to-amber-100',
    accentColor: 'text-orange-700',
    text: 'The old lion walked beside {{NAME}} as the sun turned orange and enormous behind the flat-topped trees. "In all my years," he said, "I have never seen a human who listened to the land the way you do."',
    scene: 'young child walking peacefully beside a majestic lion at golden sunset on the savannah, the full watering hole shimmering in the distance, vast orange sky and acacia silhouettes, watercolor style',
    sceneLabel: 'sunset walk',
  },
  {
    pageNumber: 10,
    gradient:    'from-lime-50 to-yellow-100',
    accentColor: 'text-green-700',
    text: '{{NAME}} looked out at the savannah — full and alive and loud with the sounds of animals going about their lives — and wrote one last thing in the field notebook: "The land already knows what it needs. You just have to listen."',
    scene: 'young child sitting peacefully on an acacia-root at night writing in a field notebook by moonlight, the savannah spread out below full of life, stars above, the lion resting nearby, watercolor style',
    sceneLabel: 'the last note',
  },
]

// ── The Mermaid Kingdom ───────────────────────────────────────────────────────

const MERMAID_KINGDOM: StoryPage[] = [
  {
    pageNumber: 1,
    gradient:    'from-cyan-50 to-teal-100',
    accentColor: 'text-teal-700',
    text: 'The shell was unlike any {{NAME}} had ever seen — spiral-shaped, glowing faintly from within, humming a note just below the edge of hearing. When {{NAME}} held it to one ear, a voice as clear as deep water spoke: "We need you. Please come."',
    scene: 'young child standing at the ocean edge at sunset holding a softly glowing magical spiral shell to their ear, warm light, gentle waves, wonder, watercolor style',
    sceneLabel: 'the shell speaks',
  },
  {
    pageNumber: 2,
    gradient:    'from-teal-50 to-sky-100',
    accentColor: 'text-teal-700',
    text: '{{NAME}} stood at the water\'s edge, looked out at the horizon, and stepped in. The waves rose to meet {{NAME}} like arms opening. The ocean was warm. It knew {{NAME}}\'s name.',
    scene: 'young child wading into a luminous ocean at golden hour, the water glowing warm and welcoming, soft waves, the horizon shimmering, watercolor style',
    sceneLabel: 'stepping into the sea',
  },
  {
    pageNumber: 3,
    gradient:    'from-sky-50 to-cyan-100',
    accentColor: 'text-sky-700',
    text: 'A young mermaid with silver hair and a tail the colour of seafoam rose from the waves. "I am Lyra," she said. "I was sent to find you." She pressed a glowing sea-glass pendant into {{NAME}}\'s hand. "This lets you breathe below."',
    scene: 'young child in the shallows meeting a graceful young mermaid with silver hair and a seafoam tail, who is handing over a glowing sea-glass pendant, ocean sunset, magical, watercolor style',
    sceneLabel: 'meeting Lyra',
  },
  {
    pageNumber: 4,
    gradient:    'from-cyan-50 to-teal-100',
    accentColor: 'text-cyan-700',
    text: 'The Mermaid Kingdom was everything the stories had promised and more: towers of coral, streets of smooth white sand, gardens that glowed in every colour. But the great Crystal at its heart was cracked, its glow flickering.',
    scene: 'young child underwater in a breathtaking mermaid kingdom with glowing coral towers and colorful gardens, a large cracked crystal dimly flickering in the center, wonder and concern, watercolor style',
    sceneLabel: 'the cracked crystal',
  },
  {
    pageNumber: 5,
    gradient:    'from-teal-50 to-emerald-100',
    accentColor: 'text-teal-700',
    text: 'The mermaid queen bowed her silver-crowned head. "Three generations of our kingdom have tried to heal it," she said. "We have given it everything — power, song, even tears. Nothing has worked." {{NAME}} looked at the Crystal carefully.',
    scene: 'young child standing before an elegant mermaid queen in an underwater throne room, the queen bowing her silver-crowned head in sadness, the cracked crystal visible behind them, watercolor style',
    sceneLabel: 'the queen\'s sorrow',
  },
  {
    pageNumber: 6,
    gradient:    'from-sky-50 to-teal-100',
    accentColor: 'text-sky-700',
    text: '"What does it need?" {{NAME}} asked the Crystal quietly — not out loud, but in the way you ask when you\'re really listening. The Crystal pulsed once. Then a warmth moved up through {{NAME}}\'s feet, through the water, into both hands.',
    scene: 'young child kneeling before a large cracked crystal underwater, hands hovering near it, eyes closed in deep listening, the crystal beginning to pulse with a faint warm light, watercolor style',
    sceneLabel: 'listening to the crystal',
  },
  {
    pageNumber: 7,
    gradient:    'from-blue-50 to-cyan-100',
    accentColor: 'text-blue-700',
    text: '{{NAME}} closed both eyes and remembered: puddles and raincoats, the smell of earth drinking, drops on a window at night. Slowly, those memories flowed through {{NAME}}\'s hands into the Crystal. The crack began to close.',
    scene: 'young child underwater with eyes closed and hands gently touching a large cracked crystal, streams of warm golden memory-light flowing from the child into the crystal as it begins to glow and heal, watercolor style',
    sceneLabel: 'healing the crystal',
  },
  {
    pageNumber: 8,
    gradient:    'from-teal-50 to-cyan-100',
    accentColor: 'text-teal-700',
    text: 'Lyra swam close and added her memories too — of storms ridden and deep places found and the quiet of the ocean floor at midnight. The crack closed. The Crystal rang like a bell. And the kingdom held its breath.',
    scene: 'young child and young mermaid both touching the crystal together, the crack closing, the crystal ringing with light, the entire underwater kingdom watching in breathless silence, watercolor style',
    sceneLabel: 'healing together',
  },
  {
    pageNumber: 9,
    gradient:    'from-emerald-50 to-teal-100',
    accentColor: 'text-emerald-700',
    text: 'Light returned in a wave of warm gold and blue, rushing through every coral tower and shell-paved street. The kingdom erupted with celebration. The queen pressed a small luminous pearl into {{NAME}}\'s palm. "Come back whenever you need the sea."',
    scene: 'young child receiving a glowing luminous pearl from a smiling mermaid queen as waves of warm gold and blue light rush through the underwater kingdom, sea creatures celebrating, joyful, watercolor style',
    sceneLabel: 'the kingdom glows',
  },
  {
    pageNumber: 10,
    gradient:    'from-cyan-50 to-sky-100',
    accentColor: 'text-cyan-700',
    text: '{{NAME}} surfaced into the evening air, pearl in hand. Lyra waved from below the surface, her silver hair fanning out like light. The shell had gone quiet — its message delivered. But {{NAME}} kept it anyway. Sometimes the sea calls, and you should always answer.',
    scene: 'young child floating in a glowing ocean at dusk, a mermaid waving from just below the shimmering surface, the pearl glowing in the child\'s hand, peaceful and magical farewell, watercolor style',
    sceneLabel: 'farewell at the surface',
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
 * @deprecated Use getStoryPages(bookId) instead.
 */
export const STORY_PAGES = ENCHANTED_FOREST
