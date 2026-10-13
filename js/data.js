/* data.js — ALL the learning content lives here. Edit this file to add words, names, tips and love notes.
 *
 * Words are grouped by category. One word per line:   Luo | English | optional note
 * (For the "Plurals" category the second column is the plural.)
 * Source: a Dholuo–English dictionary, except "Everyday" which is from general knowledge and flagged in the app.
 */

/** Your name shown in the love notes. Change it to your own! */
const FROM = "your favourite human";

const RAW = {
  Numbers: `
    achiel|one
    ariyo|two
    adek|three
    ang'wen|four
    abich|five
    auchiel|six
    abiriyo|seven
    aboro|eight
    achiko|nine|Also ochiko
    apar|ten
    apar gachiel|eleven
    apar gariyo|twelve
    apar gadek|thirteen
    apar gabiriyo|seventeen
    piero ariyo|twenty
    aluf|one thousand|Also alufu
    mar ariyo|second
    mar adek|third
    mar ang'wen|fourth
    mar abich|fifth
    mar auchiel|sixth
    mar abiriyo|seventh
    mar aboro|eighth
    mar apar|tenth
    diuchiel|six times
    nya diriyo|second time
  `,

  Days: `
    tich ariyo|Tuesday
    tich adek|Wednesday
    tich ang'wen|Thursday
    tich abich|Friday
    saa abiriyo|one o'clock|Literally the seventh hour after sunrise
  `,

  Animals: `
    akuru|dove, pigeon
    akuch odugla|light colour rock pigeon
    akuru marateng'|large, black wood pigeon
    awendo|guinea fowl
    aluoluo|camel
    aluoluo konglo|giraffe|Also a grey species of crane
    apwoyo|rabbit, hare
    apwoch olando|small brown rabbit
    apwoch othundo|large grey rabbit
    abur|deer
    anyier|badger|Also onyuere
    achuth|vulture
    achuth nyasibondo|small vulture
    achuth nyasilong'|large vulture
    agak|crow|Black with white on the back and shoulders
    abang'|sparrow
    adiel|secretary bird
    atudo|duck
    ating'a|large eagle|Can carry off a lamb
    aluru|quail
    aywer|partridge
    arum|ground hornbill
    apol|waterbuck
    ambuor|eland, also horse
    adel|small black fish
    aguyo|moth, butterfly
    agoro|flying ant|Large and edible
    ang'ino|sugar ant
    adhuong'o|swarm of bees
    alwang'ini|small, stingless, honey-producing fly
    alum|green poisonous snake
    amboro|deadly snake|Long and brownish
    apondo|spotted hyena|The large species
  `,

  Food: `
    aduma|maize, corn|Also oduma, bando
    bando|maize, Indian corn
    aboka|boiled
    abula|roasted
    aloda|parched, roasted corn
    kuon|mush, as in corn mush
    abang'a|dry, plain, without sauce or meat
    amo|honey|Also mor kich
    awinja|simsim ground and mixed with fat|For a special occasion such as the birth of the first child
    adila|milk from a newly calved cow
    aduoga|colostrum, the first month's cooked milk
    apiwiya|the first milk from a cow
    akeyo|vegetable greens with small black seeds
    alika|species of tasty wild greens
    atipa|uncultivated green creeping vegetable
    abimbo|red sweet potato|Also obimbo
    adhing'a|strained beer
    ring abula|roasted meat
    ring abamba|jerky, sliced dried meat
  `,

  Things: `
    agulu|earthen pot
    aguch ring'o|meat pot
    aguch nyiedho|milking pot
    adita|small round basket
    atonga|basket for carrying grain
    atonga kisuma|larger basket
    atonga rego|normal-sized basket
    asoka|basket used to dish up mush
    andiwi|small basket
    agwata|gourd, calabash drinking cup
    ajawa|calabash rattle
    abu|wind instrument|Made from graduated calabashes with a waterbuck horn mouthpiece, used to announce important occasions
    asili|flute
    akara|trousers, pants
    akor|coat, shirt, dress
    atol|skirt, undergarment
    afong'o|skirt|Also afuong'o
    ang'uola|loin-cloth worn by boys
    afwete|loin-cloth worn by girls
    akoto|long beaded necklace|Worn by older women
    abong'o|bracelet|Made of leather painted with red ochre
    ataka|brass belt ornament
    athuok|wire coil arm ornament
    angolo|glasses, spectacles
    andururu|motor boat
    apaya|street, highroad
    asia|hedge between houses
    abila|small hut
    atung'|bow (weapon)
    athero|arrow, small knife
    asere|arrow, quiver
  `,

  Body: `
    adundo|heart
    agoko|chest, breast
    achiak|groin|Also chiek
    akwacha|pancreas
    alura|large intestine
    aduko|third stomach of ruminants
    bam|hip, front part of the thigh
    aywer|part of the thigh
    arwetu|pimple on face or head|Seen after shaving
  `,

  Nature: `
    aora|river, stream
    ataro|lake, ocean, flood
    ataro ngala|ocean, sea
    abururu|waterfall
    arip|The Milky Way|Also orip
    ahiti|wind, storm
    auki|strong wind, high wind|Also auka
    yamb aucha|gust of wind
    ajiki|drizzle, continuous gentle rain
    anete|quagmire, bog, fen
    aiti|trench, ditch
    achiya|dampness
    alwor|enclosure, inner part of village
    agola|ring around the sun or moon
  `,

  Actions: `
    goyo adhulo|play football
    goyo abu|blow a trumpet
    goyo asumbi|roar like a lion
    goyo akwadha|take turns
    goyo ajawa|rattle the calabash
    wuotho adika|walk stamping the feet; walk carefully
    wuotho akwala|walk stealthily
    wuotho akara|walk with legs spread apart
    timo anawa|act slowly but steadily
    timo achune|force, urge, insist
    timo agwambo|commit a murder
    timo andhoga|talk with a double tongue
    timo awayo|become sour, become bitter
    chamo asoya|receive a bribe
    pudho adhuola|pull up by the roots
    gore piny ataro|fall backwards
    gore piny auma|fall face down
    gore amodhi|fight a draw
    bago|stand, soak, steep overnight
    bako|fence with thorns
    bambo|gut and split meat for drying
    bandho|dun, exact a debt
    aliya|drying meat over fire
  `,

  Describing: `
    abidha|very well
    adier|truth, truthfulness
    adiera|truthfully, truly, certainly
    ademba|carefully
    apima|selectively, carefully
    arika|in haste
    arith|easily, effortlessly
    arida|greedily, voraciously
    adawa|very tired; also victoriously
    andu|swiftly
    ahula|suddenly, without warning
    aucha|momentarily, fleetingly
    ayanga|publicly
    ayiem|on purpose, intentionally
    arunda|frequently, often
    aruomba|simultaneously, together
    arum|together
    akwala|stealthily, secretly
    andar andar|one by one
    abodha|poorly, badly|Also abuodha
    agwenya|slanting, at an angle
    asoma|squatting
    atakla|flat
    ang'we|stinky
    anjwech|tricky, cunning
    angere|in jest, as a joke
    amara|slick, smooth talking
    aratrat|weak, feeble, infirm
  `,

  Plurals: `
    adita|aditni|Plural of: small round basket
    agulu|agulni|Plural of: pot
    atung'|atumbe|Plural of: bow
    athero|atherni|Plural of: arrow, small knife
    asere|aserini|Plural of: arrow, quiver
    awendo|awendini|Plural of: guinea fowl
    achuth|achudhe|Plural of: vulture
    adel|adende|Plural of: small black fish
    aora|aore|Plural of: river, stream
    agak|agege|Plural of: crow
    apol|aponde|Plural of: waterbuck
    agoko|agoke|Plural of: chest, breast
    ajuoga|ajuoge|Plural of: witch doctor, diviner
    akom|akombe|Plural of: forked pole
    alot|alote|Plural of: vegetable, green
    ataka|atekini|Plural of: brass belt ornament
    agwata|agwetni|Plural of: calabash cup
    apar|piero|Plural of: ten (tens)
  `,

  More: `
    abana|folded, doubled over
    abawa|patch
    abudha|unintentional, gentle beating; botched
    adega|watery, swampy, saturated with water
    adhok|one round of a coil
    adhula|football (the game)
    aero|right, correct; go ahead
    ageng'a|blockade, obstruction, screen, barrier
    ageya|intent, purpose, design
    ahonda|cough
    aila|nettle
    ajieka|last drops, as of blood or food
    ajuoga|witch doctor, medicine man, diviner
    ajwaa|tree; also a board game with twelve holes
    alam|worship, prayer
    amen|wrestling match
    anyuola|genealogy, lineage
    arita|turn, rotation
    asoya|bribe
    atamalo|the first; the outset, the beginning
    atawiye|at the outset, on the spot
    ategno|middle-aged man
    ayie|belief, creed
    ayuya|easily removable
    ayulwang'|drowsiness, sleep
    ayara|spread out; raised (eyebrows); boldly
    akwandekich|propolis, virgin wax
    akudini|section of honeycomb where bee grubs are
    awanya|act of sponging on others, free-loading
    awinjo|hearsay, rumor
    asumbi|roar of a lion
    angala|running stride (a measurement)
    ang'ut|slip loop with a single granny knot
  `,

  Everyday: `
    Oyawore|Good morning|From general knowledge, not the dictionary. Please check with a Luo speaker.
    Erokamano|Thank you|From general knowledge, not the dictionary. Please check with a Luo speaker.
    Misawa|Please; thanks|From general knowledge, not the dictionary. Please check with a Luo speaker.
    Idhi nade?|How are you?|From general knowledge, not the dictionary. Please check with a Luo speaker.
    Ber|Good, fine|From general knowledge, not the dictionary. Please check with a Luo speaker.
    Dhi gi kwe|Go in peace|From general knowledge, not the dictionary. Please check with a Luo speaker.
    Aheri|I love you|From general knowledge, not the dictionary. Please check with a Luo speaker.
    Aheri ahinya|I love you very much|From general knowledge, not the dictionary. Please check with a Luo speaker.
  `,

  Phrases: `
    Ia kanye?|Where did you come from?
    Idwaro ji adi?|How many people do you need?
    Aol adawa.|I am very tired.
    Giloyou adawa.|They won victoriously.
    Ne giloso wang'yo abidha.|They fixed the road well.
    Nodiro tong' abodha.|He cast the spear poorly.
    Gibang'o kuon abang'a.|They are eating plain mush.
    Kuon otimo adegedege.|The corn mush is watery.
    Oda otimo achiya.|My house is damp.
    Koth ochwe ajiki.|The rain falls in a drizzle.
    Ahero odumb abula moloyo odumb aboka.|I prefer roasted maize to boiled.
    Wahero ring abula moloyo ring ateda.|We prefer roasted meat to boiled meat.
    Nene oyombe arith.|He beat him easily in the race.
    Owuoyo achach.|He talks purposelessly.
    Ogore piny ahula nono.|He fell down suddenly.
    Ne gigore piny auma.|They fell face down.
    Ineno bagabaga, ok ing'iya.|You look everywhere except at me.
    Inyiedho aming'a.|You are taking too long to milk.
    Ok onege mar ayiem.|He did not kill it intentionally.
    Oyaro wang'e ayara.|He raises his eyebrows.
    Wayudo andar andar moko.|We found some scraps which were left.
    Pudho adhuola.|Pull up by the roots.
    Tweyo law abam.|Tie a sash to the side.
    Mi nyathi yadh adung'a.|Give the child an inhalation.
    Chok gik moko adundo.|Gather the things together in a pile.
    Mama bambo ring'o.|Mama is slicing meat for drying.
    Nyuka otimo andwayo.|The gruel is bitter.
    Thuond alum ni kod sum ahinya.|The green snake is highly venomous.
    Jang'ad bura ok yie awinja.|A judge does not accept hearsay evidence.
    Owalo gi wach awala.|He gives exaggerated information.
  `,
};

/** Every word as an object: { id, cat, luo, english, note }. Built from RAW above. */
const ALL = Object.entries(RAW).flatMap(([cat, text]) =>
  text.trim().split("\n").map((line, i) => {
    const [luo, english, note] = line.trim().split("|");
    return { id: cat + i, cat, luo, english, note };
  })
);

/** The units on the home screen: [key in RAW, title] */
const CATS = [
  ["Numbers", "Numbers"],
  ["Animals", "Animals & birds"],
  ["Food", "Food & drink"],
  ["Things", "Things & clothes"],
  ["Days", "Days & time"],
  ["Nature", "Land & water"],
  ["Body", "Body"],
  ["Actions", "Doing things"],
  ["Describing", "Describing"],
  ["Phrases", "Sentences"],
  ["Plurals", "Plurals"],
  ["More", "More words"],
  ["Everyday", "Greetings & love"],
];

/** Bottom tabs: [name, icon name from js/icons.js] */
const NAVI = [["Journey", "map"], ["Practice", "target"], ["Explore", "compass"], ["Culture", "book"], ["For You", "heart"]];

/** Luo names: [name, story] */
const NAMES = [
  ["Atieno / Otieno", "born at night"],
  ["Akeyo / Okeyo", "born during harvest"],
  ["Akumu / Okumu", "conceived before mother's first menstruation, or born breech"],
  ["Apiyo / Opiyo", "firstborn twin"],
  ["Adongo / Odongo", "second born twin"],
  ["Awuor / Owuor", "born at night"],
  ["Abiero / Obiero", "birth involved a difficulty with the placenta"],
  ["Achola / Ochola", "first child conceived by an inherited wife after her husband's death"],
  ["Ayoo", "born on the road"],
  ["Akech", "girl born during a famine"],
  ["Ajwang'", "girl born after the death of her father"],
  ["Abu", "child born during the sounding of the abu instrument"],
  ["Arange", "nickname given to a new bride by in-laws and new neighbors"],
];

/** Regional forms: [meaning, main form, region tag, other forms] */
const DIAL = [
  ["nine", "achiko", "CN", "ochiko"],
  ["maize", "aduma", "Nyando", "oduma (SN, CN)"],
  ["murder", "agwambo", "SN, CN", "magwambo (Nyando)"],
  ["moth, butterfly", "aguyo", "SN", "oguyo (Ugenya)"],
  ["tree good for stools", "aduogo", "", "oduogo; adugo (CN)"],
  ["poorly, badly", "abodha", "Nyando", "abuodha (CN)"],
  ["skimming", "achwecha", "Nyando, CN", "achera (SN)"],
  ["completely, absolutely", "baa", "Nyando", "haa (SN)"],
  ["unique", "andili", "SN", "nyandili (CN)"],
  ["new grass, aftermath", "alemo", "Ugenya", "olemo (SN)"],
  ["blind worm", "adhagaria", "", "andhaguria; andhagariya (SN)"],
  ["potsherd, broken pottery", "balatago", "", "tago; balathago (CN, Ugenya)"],
  ["groin", "achiak", "SN, CN", "chiek"],
];

/** Proverbs: [Luo, English] */
const PROV = [
  ["Awendo onyuolo awendo.", "A thief gives birth to a thief."],
  ["Apoyo tin, to goyo rude.", "The rabbit is small, but it can bear twins."],
  ["Muchi tin ka muchi alika.", "You are as powerless as a wild green."],
];

/** Grammar tips: [title, explanation] */
const TIPS = [
  ["Ordinals: put mar before a number", "mar ariyo = second, mar adek = third, mar abich = fifth, mar aboro = eighth."],
  ["Weekdays use tich + a number", "tich ariyo = Tuesday, tich adek = Wednesday, tich ang'wen = Thursday, tich abich = Friday."],
  ["a- means I", "a- is a pronoun for I; an means I or me; -a means my or me."],
  ["The a...a pattern", "Wrapping a verb in a...a turns it into an adverb: bodho (to botch) becomes abudha (poorly, badly)."],
  ["A or O at the start", "Many words start with a in one region and o in another: aduma / oduma (maize), achiko / ochiko (nine), aguyo / oguyo (moth)."],
  ["Names follow gender", "Girls' names start with A and boys' with O: Atieno / Otieno, Akeyo / Okeyo, Apiyo / Opiyo."],
  ["Plurals are irregular", "Each word has its own plural: agulu becomes agulni, atung' becomes atumbe, aora becomes aore. Learn them in pairs."],
  ["goyo, wuotho and timo + a word", "goyo adhulo = play football, wuotho akwala = walk stealthily, timo anawa = act slowly but steadily. The verb stays, the second word changes the meaning."],
  ["Counting times", "The dictionary lists diuchiel (six times) and nya diriyo (second time)."],
];

/** Love notes shown after lessons and in the feed. */
const LOVE = [
  "Every word you learn is one more way we understand each other. I'm proud of you.",
  "I made this just for you, one word at a time.",
  "Take your time. Learning a language is slow and beautiful, and you're doing great.",
  "If today was hard, one card is enough. I'm cheering for you.",
  "You make everything better. Keep going, Noela.",
];