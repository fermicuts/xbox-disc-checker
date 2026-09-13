import React, { useState, useMemo, useEffect } from 'react';
import { Search, X, RefreshCw, AlertCircle } from 'lucide-react';

const XboxDiscChecker = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showIndex, setShowIndex] = useState(false);
  const [gameList, setGameList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [updateStatus, setUpdateStatus] = useState('');

  // Default/fallback game list from Windows Central (800+ games)
  const defaultGameList = [
    "007 First Light", "7 Days to Die", "8 To Glory", "A Plague Tale: Innocence", "A Plague Tale: Requiem",
    "A Quiet Place: The Road Ahead", "Ad Infinitum", "Adventure Time: Finn and Jake Investigations",
    "Adventure Time: Pirates of the Enchiridion", "AEW: Fight Forever", "Agatha Christie - Death on the Nile",
    "Agatha Christie - Hercule Poirot: The First Cases", "Agatha Christie - The ABC Murders", "Agents of Mayhem",
    "Agony", "AI: THE SOMNIUM FILES Nirvana Initiative", "Airoheart", "Alan Wake 2", "Alan Wake: Remastered",
    "Alex Kidd in Miracle World DX", "Aliens: Fireteam Elite", "Alone in the Dark (2024)", "Amerzone - The Explorer's Legacy",
    "Among Us", "Anthem", "Apex Legends", "Arcadegeddon", "ARK: Survival Evolved", "Armello",
    "ARSLAN: THE WARRIORS OF LEGEND", "Arzette: The Jewel of Faramore", "Ashes Cricket", "Assetto Corsa",
    "Asterix & Obelix Slap Them All! 2", "Asterix & Obelix XXL3", "ASTRONEER", "Atari 50: The Anniversary Celebration",
    "Atari Flashback Classics Vol. 1", "Atari Flashback Classics Vol. 2", "Atari Flashback Classics Vol. 3",
    "Atelier Yumia", "Atlas Fallen: Reign of Sand", "Atomic Heart", "Attack on Titan", "Attack on Titan 2",
    "Aven Colony", "AVICII Invector", "Back 4 Blood", "Back to the Future: The Game",
    "Baja: Edge of Control HD", "Balatro", "Baldur's Gate 3", "Baldur's Gate and Baldur's Gate II: Enhanced Edition",
    "Banishers: Ghosts of New Eden", "Banner Saga 3", "Barbie: Project Friendship", "Batman: Arkham Knight",
    "Batman: Return to Arkham - Arkham Asylum", "Batman: Return to Arkham - Arkham City", "Batman: The Telltale Series",
    "Battle Chasers: Nightwar", "Battleborn", "Battlefield 1", "Battlefield 2042", "Battlefield 6", "Battlefield V",
    "Battlefield: Hardline", "Beast Quest", "Ben 10", "Beyond a Steel Sky", "Biomutant", "BioShock 2: Remastered",
    "BioShock: Infinite - The Complete Edition", "BioShock: Remastered", "Black Desert", "Black Mirror", "Blackguards 2",
    "BLADESTORM: Nightmare", "Blair Witch", "Blasphemous 2", "BlazBlue: Chronophantasma Extend", "Bleeding Edge",
    "Bloodstained: Ritual of the Night", "Bomb Rush Cyberfunk", "Borderlands 2", "Borderlands 3", "Borderlands 4",
    "Borderlands: Game of the Year Edition", "Borderlands: The Pre-Sequel", "Bramble: The Mountain King",
    "Bridge Constructor: Portal", "Brothers: a Tale of Two Sons", "Bulletstorm: Full Clip Edition",
    "Burnout Paradise: Remastered", "Bus Simulator 21 Next Stop", "Cabela's African Adventures",
    "Call of Duty: Advanced Warfare", "Call of Duty: Black Ops 4", "Call of Duty: Black Ops 6",
    "Call of Duty: Black Ops Cold War", "Call of Duty: Black Ops III", "Call of Duty: Infinite Warfare",
    "Call of Duty: Modern Warfare", "Call of Duty: Modern Warfare Remastered", "Call of Duty: Vanguard",
    "Call of Duty: WWII", "Capcom Arcade 2nd Stadium", "Carmageddon: Max Damage", "Carnival Games",
    "Cars 3: Driven to Win", "Cartoon Network: Battle Crashers", "Castlevania Advance Collection",
    "Castlevania Dominus Collection", "CHAOS;CHILD", "Charon's Staircase", "Chicken Run: Eggstraction",
    "Chronos: Before the Ashes", "Clair Obscur: Expedition 33", "Clash: Artifacts of Chaos",
    "Classified: France '44", "Clock Tower: Rewind", "Company of Heroes 3", "Conan Exiles",
    "Construction Simulator", "Constructor", "Contra: Operation Galuga", "CONTRA: ROGUE CORPS",
    "Control", "Control Ultimate Edition", "Crackdown 3: Campaign", "Crash Bandicoot: N. Sane Trilogy",
    "Crayola Scoot", "Cricket 24: The Official Game of the Ashes", "Crimson Desert", "Cris Tales",
    "Crysis 2 Remastered", "Crysis 3 Remastered", "Crysis Remastered", "Cuisineer", "Cuphead",
    "Cyberpunk 2077", "CYGNI: All Guns Blazing", "Daemon X Machina: Titanic Scion", "Danger Zone 2",
    "Dangerous Driving", "Darksiders Genesis", "Darksiders II Deathinitive Edition", "Darksiders III",
    "Darksiders Warmastered Edition", "DARQ Ultimate Edition", "Day of the Tentacle: Remastered",
    "DC League of Super-Pets: The Adventures of Krypto and Ace", "DC's Justice League: Cosmic Chaos",
    "DCL-The Game", "de Blob", "de Blob 2", "Dead Alliance: Multiplayer Edition", "Dead Island 2",
    "Dead Island: Definitive Edition", "DEAD OR ALIVE 5 Last Round: Core Fighters",
    "DEAD OR ALIVE 6: Core Fighters", "Dead Rising", "Dead Rising 2", "Dead Rising 4",
    "Dead Rising Deluxe Remaster", "Dead Space", "Deadlight: Director's Cut", "Deadpool",
    "DEATHLOOP", "Deformers", "Deliver Us The Moon", "Demon Turf", "Desperados III",
    "Destroy All Humans!", "Destroy All Humans! 2 - Reprobed", "Devil May Cry 5",
    "Devil May Cry 5 Special Edition", "Devil May Cry HD Collection", "Diablo III: Reaper of Souls",
    "Diablo IV", "DiRT 4", "DIRT 5", "DiRT Rally", "Disciples: Liberation", "Disco Elysium - The Final Cut",
    "Dishonored 2", "Dishonored: Death of the Outsider", "Dishonored: Definitive Edition",
    "Disney Classic Games: Aladdin and The Lion King", "Disney Dreamlight Valley", "Disney Epic Mickey: Rebrushed",
    "Disney Illusion Island", "Disney Infinity 3.0", "Disneyland Adventures", "Divinity: Original Sin - Enhanced Edition",
    "Divinity: Original Sin 2 - Definitive Edition", "DmC Devil May Cry: Definitive Edition",
    "Doctor Who: The Edge of Reality", "Doctor Who: The Lonely Assassins", "Dolmen", "Don Bradman Cricket",
    "DOOM", "DOOM + DOOM II", "DOOM 64", "DOOM Eternal", "DOOM: The Dark Ages",
    "Double Dragon Gaiden: Rise of the Dragons", "Dragon Age: Inquisition", "Dragon Age: The Veilguard",
    "Dragon's Dogma 2", "Dragon's Dogma: Dark Arisen", "DreamWorks Dragons Dawn of New Riders",
    "DREDGE", "Dungeons 3", "Dying Light", "Dying Light 2: Stay Human - Reloaded Edition",
    "DYNASTY WARRIORS 8 Empires", "DYNASTY WARRIORS 9", "DYNASTY WARRIORS 9 Empires",
    "DYNASTY WARRIORS: ORIGINS", "EA SPORTS College Football 25", "EA SPORTS College Football 26",
    "EA SPORTS FC 25", "EA SPORTS FIFA 17", "EA SPORTS FIFA 20", "EA SPORTS NHL 16",
    "EA SPORTS Rory McIlroy PGA TOUR", "Earthfall", "Earthlock: Festival of Magic", "eFootball PES 2020",
    "eFootball PES 2021 SEASON UPDATE", "Elex", "ELEX II", "Endling - Extinction is Forever",
    "Enotria: The Last Song", "EVERSPACE 2", "Evil Dead: The Game", "Evil Genius 2: World Domination",
    "Evil West", "Evolve", "Exoprimal", "Extinction", "F1 2015", "F1 2016", "F1 2017", "F1 2018",
    "F1 2019", "F1 2020", "F1 2021", "F1 22", "F1 23", "Fallen Legion Revenants",
    "Fallen Legion: Rise to Glory", "Farming Simulator 15", "FATAL FRAME II: Crimson Butterfly REMAKE",
    "FATAL FURY: City of the Wolves", "FIFA 15", "FIFA 16", "FIFA 21", "FIFA 22", "FIFA 23",
    "Firefighters: Airport Fire Department", "Fishing Sim World: Pro Tour", "Five Nights at Freddy's",
    "Five Nights at Freddy's 2", "Five Nights at Freddy's 3", "Five Nights at Freddy's 4",
    "Five Nights at Freddy's Into the Pit", "Five Nights at Freddy's: Security Breach",
    "Five Nights at Freddy's: Sister Location", "Flashback 2", "FlatOut 4: Total Insanity",
    "Flintlock: The Siege of Dawn", "Fortnite", "Forza Horizon 4", "Friday the 13th: The Game",
    "FRONT MISSION 1st: Remake", "FRONT MISSION 2: Remake", "Frostpunk", "Funko Fusion",
    "G.I. Joe: Operation Blackout", "Game of Thrones - The Telltale Series", "Gears 5",
    "Gears of War 4", "Gears of War: Ultimate Edition", "Gears Tactics", "Generation Zero",
    "Gex Trilogy", "Ghostbusters: Spirits Unleashed Ecto Edition", "Ghostbusters: The Video Game Remastered",
    "Ghostbusters", "Ghostrunner", "Ghostrunner 2", "Goat Simulator", "Goat Simulator 3",
    "God of Rock", "Gotham Knights", "Gothic Classic", "GRADIUS ORIGINS", "Grand Theft Auto III – The Definitive Edition",
    "Grand Theft Auto V", "Grand Theft Auto: San Andreas – The Definitive Edition",
    "Grand Theft Auto: Vice City – The Definitive Edition", "Grandia HD Collection", "Gravel",
    "GreedFall", "GRID", "Grim Fandango Remastered", "Grounded", "Hades", "Halo 5: Guardians",
    "Halo Infinite", "Halo Wars 2", "Halo: The Master Chief Collection", "Harry Potter: Quidditch Champions",
    "Harvest Moon: One World", "Harvest Moon: The Winds of Anthos", "Has-Been Heroes",
    "Hellblade: Senua's Sacrifice", "Hello Neighbor", "Hello Neighbor 2", "Hello Neighbor: Hide and Seek",
    "Hi-Fi RUSH", "High On Life", "High On Life 2", "HITMAN 3", "HITMAN 2",
    "Hogwarts Legacy", "Homefront: The Revolution", "Hot Wheels Let's Race: Ultimate Speed",
    "HOT WHEELS UNLEASHED", "HOT WHEELS UNLEASHED 2 - Turbocharged", "HOTEL BARCELONA",
    "Hotel Transylvania 3: Monsters Overboard", "House Flipper 2", "Human Fall Flat",
    "Immortal: Unchained", "Immortals of Aveum", "Indiana Jones and the Great Circle",
    "Indivisible", "Industry Giant 2", "Infinite Air with Mark McMorris", "Injustice 2",
    "INSIDE", "Iron Harvest: Complete Edition", "John Carpenter's Toxic Commando", "John Wick Hex",
    "JoJo Siwa: Worldwide Party", "Journey to the Savage Planet", "Jumanji: The Video Game",
    "Jumanji: Wild Adventures", "Jurassic World Evolution", "Jurassic World Evolution 2",
    "Jurassic World Evolution 3", "Ken Follett's The Pillars of the Earth", "Kena: Bridge of Spirits",
    "KeyWe", "Killer Frequency", "Killer Instinct", "Killing Floor 2", "Kingdom Come: Deliverance",
    "Kingdom Come: Deliverance II", "Kingdoms of Amalur: Re-Reckoning", "Kung Fu Panda Showdown of Legendary Legends",
    "L.A. Noire", "Legacy of Kain Soul Reaver 1&2 Remastered", "LEGO 2K Drive", "LEGO Batman 3: Beyond Gotham",
    "LEGO Batman: Legacy of the Dark Knight", "LEGO CITY Undercover", "LEGO DC Super-Villains",
    "LEGO Dimensions", "LEGO Harry Potter Collection", "LEGO Jurassic World", "LEGO Marvel Super Heroes",
    "LEGO Marvel Super Heroes 2", "LEGO Marvel's Avengers", "LEGO Party!", "LEGO Star Wars: The Force Awakens",
    "LEGO Star Wars: The Skywalker Saga", "LEGO The Incredibles", "LEGO Worlds", "LEGO Brawls",
    "Let's Build a Zoo", "Let's Sing 2022", "Let's Sing 2024", "Let's Sing 2026", "Let's Sing Country",
    "Lichdom: Battlemage", "Lies of P", "LOLLIPOP CHAINSAW RePOP", "Looney Tunes: Wacky World of Sports",
    "Lords of the Fallen (2014)", "Lords of the Fallen (2024)", "LUNAR Remastered Collection", "Mad Max",
    "Madden NFL 16", "Madden NFL 17", "Madden NFL 18", "Madden NFL 19", "Madden NFL 21",
    "Madden NFL 23", "Mafia II: Definitive Edition", "Mafia III", "Mafia: Definitive Edition",
    "Mafia: The Old Country", "Maneater", "MARVEL Cosmic Invasion", "Marvel Pinball Epic Collection Vol. 1",
    "Marvel's Midnight Suns", "Marvel's Guardians of the Galaxy: The Telltale Series",
    "Mass Effect: Andromeda", "Mass Effect: Legendary Edition", "Matchbox Driving Adventures",
    "Mato Anomalies", "Mega Man 11", "Mega Man Legacy Collection 2", "Mega Man X Legacy Collection",
    "Mega Man X Legacy Collection 2", "Mega Man Zero/ZX Legacy Collection", "Mega Man Legacy Collection",
    "METAL GEAR & METAL GEAR 2: Solid Snake", "Metal Gear Solid - Master Collection Version",
    "Metal Gear Solid 2: Sons of Liberty - Master Collection Version",
    "Metal Gear Solid 3: Snake Eater - Master Collection Version",
    "METAL GEAR SOLID 4: Guns of the Patriots - Master Collection Version",
    "Metal Gear Solid V: The Phantom Pain", "Metal Gear Solid Δ: Snake Eater",
    "METAL GEAR SOLID: Peace Walker - Master Collection Version", "Metal Gear Survive",
    "Metal Slug Tactics", "Metro Redux", "Micro Machines World Series",
    "Middle-earth: Shadow of Mordor - Game of the Year Edition", "Middle-earth: Shadow of War",
    "Mighty No. 9", "MindsEye", "Minecraft", "Minecraft Dungeons", "Minecraft Legends",
    "Minecraft: Story Mode", "Minecraft: Story Mode - Season 2", "Mirror's Edge: Catalyst",
    "MLB The Show 21", "MLB The Show 22", "MLB The Show 24", "MLB The Show 25",
    "Monster Crown", "Monster Energy Supercross - The Official Videogame 4",
    "Monster High Skulltimate Secrets", "Monster Hunter Wilds", "MONSTER HUNTER: WORLD",
    "Monster Jam Steel Titans", "Monster Jam: Crush It!", "Mortal Kombat 11", "Mortal Kombat X",
    "Mortal Kombat: Legacy Kollection", "Mortal Kombat 1", "Mortal Shell: Enhanced Edition",
    "MOTHERGUNSHIP", "Mount & Blade II: Bannerlord", "MOUSE: P.I. For Hire", "Moving Out",
    "Moving Out 2", "Mutant Football League", "Mutant Year Zero: Road to Eden", "MX vs ATV All Out",
    "MX vs ATV Legends", "MX vs. ATV Supercross Encore", "MXGP2", "MXX",
    "MY LITTLE PONY: A Maretime Bay Adventure", "My Time At Portia", "My Time at Sandrock",
    "MySims", "MySims Kingdom", "NASCAR Heat 2", "NASCAR Heat 4", "NASCAR Heat 5",
    "NASCAR Heat Evolution", "NBA 2K15", "NBA 2K16", "NBA 2K17", "NBA 2K19", "NBA 2K20",
    "NBA 2K21", "NBA 2K22", "NBA 2K23", "NBA 2K24", "NBA 2K25", "NBA 2K26",
    "NBA BOUNCE", "Necromunda: Hired Gun", "Need for Speed", "Need for Speed: Heat",
    "Need for Speed: Hot Pursuit Remastered", "Need for Speed: Payback", "Need for Speed: Unbound",
    "Neptunia Game Maker R:Evolution", "Neptunia: Sisters VS Sisters", "NERF Legends",
    "Neverwinter Nights: Enhanced Edition", "New Tales from the Borderlands", "NHL 19",
    "NHL 20", "NHL 15 Full Game", "NHL 21 Great Eight Edition", "Nickelodeon All-Star Brawl",
    "Nickelodeon All-Star Brawl 2", "Nickelodeon Kart Racers", "Nickelodeon Kart Racers 2: Grand Prix",
    "Nickelodeon Kart Racers 3: Slime Speedway", "Nicktoons & The Dice of Destiny",
    "NINJA GAIDEN 4", "No Man's Sky", "No More Heroes 3", "No Place Like Home",
    "No Straight Roads", "Northgard", "Now That's What I Call Sing 2", "Now That's What I Call Sing",
    "Observer: System Redux", "OCCULTIC;NINE", "Oddworld: Soulstorm Enhanced Edition",
    "OK K.O.! Let's Play Heroes", "ONRUSH", "Ori and the Blind Forest: Definitive Edition",
    "Ori and the Will of the Wisps", "Outcast - A New Beginning", "Outlast", "Outlast 2",
    "Overcooked! All You Can Eat", "Overwatch", "Painkiller", "Paleo Pines", "Past Cure",
    "Pathfinder: Kingmaker - Definitive Edition", "PAW Patrol The Movie: Adventure City Calls",
    "Paw Patrol: On a Roll", "PAYDAY 2: CRIMEWAVE EDITION", "PAYDAY 3", "Pentiment",
    "Peppa Pig: World Adventures", "PGA TOUR 2K25", "Phantom Breaker: Battle Grounds Ultimate",
    "Phar Lap - Horse Racing Challenge", "Pharaonic", "Phoenix Point", "Pillars of Eternity II: Deadfire",
    "Pillars of Eternity: Complete Edition", "PJ Masks: Heroes of the Night", "Planet Coaster: Console Edition",
    "Plants vs. Zombies: Battle for Neighborville", "Plants vs. Zombies Garden Warfare 2",
    "Plumbers Don't Wear Ties: Definitive Edition", "Police Simulator: Patrol Officers",
    "Port Royale 4", "Power Rangers: Battle for the Grid", "PRAGMATA", "Prey",
    "Pro Evolution Soccer 2015", "Pro Evolution Soccer 2016", "Pro Evolution Soccer 2017",
    "PRO EVOLUTION SOCCER 2018", "PRO EVOLUTION SOCCER 2019", "Professional Farmer 2017",
    "Project Cars", "Project Highrise: Architect's Edition", "Project Spark", "Promenade",
    "Prototype 2", "PSYCHO-PASS MANDATORY HAPPINESS", "Psychonauts 2", "Quake", "Quake 2 (2023)",
    "R-Type Final 2", "R.B.I. Baseball 16", "Race with Ryan", "RAGE 2", "RAID: World War II",
    "Raiden III x MIKADO MANIAX", "Raiden IV x MIKADO remix", "Rare Replay", "REANIMAL",
    "ReCore", "Red Dead Redemption 2", "Red Faction Guerrilla Re-Mars-tered", "Redfall",
    "Redout 2", "Redout: Lightspeed Edition", "Remothered: Broken Porcelain",
    "Remothered: Tormented Fathers", "Resident Evil", "Resident Evil 0", "Resident Evil 2",
    "Resident Evil 4 (2023)", "Resident Evil 4", "Resident Evil 5", "Resident Evil 6",
    "Resident Evil 7: Biohazard", "Resident Evil: Requiem", "Resident Evil: Revelations",
    "Resident Evil: Revelations 2", "Resident Evil: Village", "Resonance: A Plague Tale Legacy",
    "RetroRealms Arcade", "Return to Monkey Island", "RICO London", "RIDE", "Ride 2",
    "RiME", "Risk of Rain", "Risk of Rain 2", "RoboCop: Rogue City", "RoboCop: Rogue City - Unfinished Business",
    "Rock Band 4", "Rocket Arena", "Rocket League", "Rogue Trooper Redux",
    "Roman Rumble in Las Vegum - Asterix & Obelix XXL 2", "Rugby 15", "Rugby League Live 4",
    "Rugby World Cup 2015", "Rush: A Disney/Pixar Adventure", "Rustler", "RWBY: Arrowfell",
    "S.T.A.L.K.E.R. 2: Heart of Chornobyl", "Saints Row", "Saints Row IV: Re-Elected",
    "Saints Row: Gat out of Hell", "Saints Row: The Third - Remastered", "SAMURAI SHODOWN (Standard Ver.)",
    "SAMURAI WARRIORS 5", "Scar-Lead Salvation", "Scars Above", "Scott Pilgrim EX",
    "Screamer", "ScreamRide", "Scribblenauts Showdown", "Sea of Stars: Sunset Edition",
    "Sea of Thieves", "Session: Skate Sim", "Severed Steel", "Shadow Tactics: Blades of the Shogun",
    "Shadow Warrior", "Shadows of Doubt", "Shadows: Awakening", "Shantae Advance: Risky Revolution",
    "Shaq Fu: A Legend Reborn", "Shenmue", "Shenmue II", "Sherlock Holmes: The Devil's Daughter",
    "Shi In", "Shovel Knight: Treasure Trove", "Sid Meier's Civilization VI", "Sid Meier's Civilization VII",
    "Sifu", "SILENT HILL f", "Sine Mora EX", "Skull Island: Rise of Kong", "Skylanders Imaginators",
    "Skylanders SuperChargers Portal Owner's Pack", "Slay The Spire", "Slime Rancher",
    "Slime Rancher 2", "Sniper Elite 4", "Sniper Elite 5", "Sniper Elite V2 Remastered",
    "Sniper Elite: Resistance", "SNIPER Ghost Warrior 3", "Sniper Ghost Warrior Contracts",
    "Snooper 19", "Song of the Deep", "Sophstar", "Soulstice", "SOUTH PARK: SNOW DAY!",
    "SpongeBob SquarePants: Battle for Bikini Bottom - Rehydrated", "SpongeBob SquarePants: The Cosmic Shake",
    "SpongeBob SquarePants: The Patrick Star Game", "SpongeBob SquarePants: Titans of the Tide",
    "Spyro: Reignited Trilogy", "Squirrel with a Gun", "Star Trek Prodigy: Supernova",
    "Star Trek: Resurgence", "Star Wars - Episode I: Jedi Power Battles", "Star Wars - Jedi: Fallen Order",
    "Star Wars - Jedi: Survivor", "STAR WARS Zero Company", "Star Wars: Squadrons",
    "STAR WARS Battlefront", "STAR WARS Battlefront II", "STAR WARS: Bounty Hunter",
    "Stardew Valley", "Starfield", "Starship Troopers: Extermination", "State of Decay 2: Juggernaut Edition",
    "State of Mind", "Steelrising - Standard Edition", "Stern Pinball Arcade",
    "Steven Universe: Save the Light", "STORY OF SEASONS: A Wonderful Life", "Strange Brigade",
    "Stray", "Street Fighter 30th Anniversary Collection", "Street Fighter 6", "Street Outlaws: The List",
    "Street Power Soccer", "Streets of Rage 4", "Stubbs the Zombie in Rebel Without a Pulse",
    "Styx: Shards of Darkness", "Subnautica", "Subnautica: Below Zero",
    "Sudden Strike 4 - European Battlefields Edition", "Suicide Squad: Kill the Justice League",
    "Suikoden I&II HD Remaster Gate Rune and Dunan Unification Wars", "Sunset Overdrive",
    "SUPER BOMBERMAN R", "SUPER BOMBERMAN R 2", "Super Lucky's Tale", "Surviving Mars",
    "Syberia - The World Before", "Syberia 3", "System Shock", "Sébastien Loeb Rally EVO",
    "Tales from the Borderlands - A Telltale Games Series", "Teenage Mutant Ninja Turtles Arcade: Wrath of the Mutants",
    "Teenage Mutant Ninja Turtles: Shredder's Revenge", "Teenage Mutant Ninja Turtles: The Cowabunga Collection",
    "Teenage Mutant Ninja Turtles: Mutants in Manhattan", "Tempest 4000", "Temtem",
    "Tennis World Tour", "Terminator 2D: NO FATE", "TERMINATOR: RESISTANCE", "Terraria",
    "Test Drive Unlimited Solar Crown", "The Addams Family: Mansion Mayhem", "The Banner Saga",
    "The Banner Saga 2", "The Book of Unwritten Tales 2", "The Callisto Protocol", "The Chant",
    "The Elder Scrolls IV: Oblivion Remastered", "The Elder Scrolls Online", "The Elder Scrolls V: Skyrim Special Edition",
    "The Elf on the Shelf: Christmas Heroes", "The Escapists", "The Eternal Cylinder",
    "The Evil Within", "The Evil Within 2", "The Falconeer", "The First Berserker: Khazan",
    "The Grinch: Christmas Adventures", "The Inner World - The Last Wind Monk", "The Invisible Hours",
    "The Jackbox Party Pack 7", "The Karate Kid: Street Rumble", "THE KING OF FIGHTERS XV",
    "The Knight Witch", "The Last Kids on Earth and the Staff of Doom", "The Last Stand: Aftermath",
    "The LEGO Movie Videogame", "The LEGO NINJAGO Movie Video Game", "The Medium", "The Occupation",
    "The Precinct", "The Quarry", "The Riftbreaker", "The Sims 4", "The Smurfs - Mission Vileaf",
    "The Surge", "The Survivalists", "The Technomancer", "The Texas Chain Saw Massacre",
    "The Town of Light", "The Unicorn Princess", "The Voice", "The Voice, la plus belle voix",
    "The Walking Dead Collection - The Telltale Series", "The Walking Dead: Season 2",
    "The Walking Dead: The Final Season", "The Walking Dead: The Telltale Definitive Series",
    "The Witcher 3: Wild Hunt", "The Witcher 3: Wild Hunt – Complete Edition", "The Wolf Among Us",
    "theHunter: Call of the Wild", "Them's Fightin' Herds", "This Is the Police",
    "This War of Mine: The Little Ones", "Thymesia", "Tiny Tina's Wonderlands", "Titan Quest",
    "Titanfall 2", "Tomb Raider I-III Remastered Starring Lara Croft", "Tony Stewart's All-American Racing",
    "Tony Stewart's Sprint Car Racing", "TopSpin 2K25", "Torment: Tides of Numenera",
    "Tour de France 2016", "Tower of Guns: Special Edition", "TRANSFORMERS: BATTLEGROUNDS",
    "TRANSFORMERS: Galactic Trials", "TRANSFORMERS: Devastation", "Trepang2", "Trine 2: Complete Story",
    "Trine 3: The Artifacts of Power", "Trine 4: The Nightmare Prince", "Trine 5: A Clockwork Conspiracy",
    "Trine Enchanted Edition", "Troll & I", "Tropico 5 - Penultimate Edition", "Tropico 6 - Next Gen Edition",
    "TUNIC", "Turok", "Turok 2: Seeds of Evil", "Turok 3: Shadow of Oblivion Remastered",
    "TY the Tasmanian Tiger HD", "UFO ROBOT GRENDIZER – The Feast of the Wolves", "Ufouria: The Saga 2",
    "UglyDolls: An Imperfect Adventure", "Undertale", "Unravel", "Unravel 2",
    "Vampire: The Masquerade - Bloodlines 2", "Vampyr", "Victor Vran", "Vikings - Wolves of Midgard",
    "Wanted: Dead", "Warhammer 40,000: Inquisitor - Martyr", "Warhammer: Chaosbane",
    "Warhammer: End Times - Vermintide", "Warhammer: Vermintide 2", "WARHAMMER 40,000: Darktide",
    "WARHAMMER 40,000: Mechanicus", "WARHAMMER 40,000: Space Marine 2", "WARRIORS OROCHI 4",
    "Wasteland 2: Director's Cut", "We Happy Few", "Who Wants to Be a Millionaire? (2020)",
    "Wild Hearts", "Wo Long: Fallen Dynasty", "Wolfenstein II: The New Colossus",
    "Wolfenstein: The Old Blood", "Wolfenstein: Youngblood", "World War Z", "Worms W.M.D",
    "Wreckfest", "Wreckreation", "WUCHANG: Fallen Feathers", "WWE 2K Battlegrounds",
    "WWE 2K15", "WWE 2K16", "WWE 2K17", "WWE 2K18", "WWE 2K19", "WWE 2K20",
    "WWE 2K22", "WWE 2K23", "WWE 2K24", "XCOM 2", "Xenon Racer", "XIII",
    "Xuan Yuan Sword 7", "Yooka-Laylee", "Yooka-Laylee and the Impossible Lair",
    "Yooka-Replaylee", "You Suck at Parking Complete Edition", "Ziggurat",
    "Zombie Army 4: Dead War", "Zombie Army Trilogy", "Zoo Tycoon: Ultimate Animal Collection",
    "Zorro The Chronicles", "ŌKAMI HD"
  ];

  // Fetch game list from remote source on component mount
  useEffect(() => {
    loadGameList();
  }, []);

  const loadGameList = async () => {
    setLoading(true);
    setUpdateStatus('');
    
    try {
      // Try to fetch from GitHub raw content
      // Replace with your own GitHub gist or raw file URL
      const response = await fetch(
        'https://raw.githubusercontent.com/YOUR_USERNAME/xbox-disc-digital/main/games.json',
        { 
          headers: { 'Cache-Control': 'no-cache' },
          signal: AbortSignal.timeout(5000) // 5 second timeout
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setGameList(data);
          const now = new Date().toLocaleString();
          setLastUpdated(now);
          localStorage.setItem('gameList', JSON.stringify(data));
          localStorage.setItem('lastUpdated', now);
          setUpdateStatus('List updated successfully!');
          setTimeout(() => setUpdateStatus(''), 3000);
        } else {
          throw new Error('Invalid data format');
        }
      } else {
        throw new Error('Failed to fetch from remote source');
      }
    } catch (error) {
      // Fallback to localStorage if available, otherwise use default
      const cached = localStorage.getItem('gameList');
      const cachedTime = localStorage.getItem('lastUpdated');
      
      if (cached) {
        try {
          setGameList(JSON.parse(cached));
          setLastUpdated(cachedTime || 'Unknown');
          setUpdateStatus('Using cached list (remote source unavailable)');
          setTimeout(() => setUpdateStatus(''), 4000);
        } catch {
          setGameList(defaultGameList);
          setLastUpdated(null);
          setUpdateStatus('Error loading data');
        }
      } else {
        setGameList(defaultGameList);
        setLastUpdated(null);
        setUpdateStatus('Using built-in list (remote source unavailable)');
        setTimeout(() => setUpdateStatus(''), 4000);
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredGames = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    return gameList
      .filter(game => game.toLowerCase().includes(query))
      .sort((a, b) => {
        const aIndex = a.toLowerCase().indexOf(query);
        const bIndex = b.toLowerCase().indexOf(query);
        if (aIndex !== bIndex) return aIndex - bIndex;
        return a.length - b.length;
      });
  }, [searchQuery]);

  const isCompatible = filteredGames.length > 0 && searchQuery.trim();

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      color: '#fff',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: '2.5em',
            marginBottom: '8px',
            color: '#00b050'
          }}>
            Xbox Disc-to-Digital Checker
          </h1>
          <p style={{ 
            fontSize: '0.95em',
            color: '#b0b0b0',
            marginBottom: '20px'
          }}>
            Check if your physical Xbox discs can be converted to digital. 800+ games supported.
          </p>
          <p style={{ 
            fontSize: '0.85em',
            color: '#808080',
            fontStyle: 'italic',
            marginBottom: '15px'
          }}>
            Data sourced from official Xbox channels and verified by the community
          </p>
          
          {/* Status Info */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '15px',
            flexWrap: 'wrap'
          }}>
            {lastUpdated && (
              <span style={{
                fontSize: '0.85em',
                color: '#00b050',
                background: 'rgba(0, 176, 80, 0.1)',
                padding: '6px 12px',
                borderRadius: '4px'
              }}>
                Last updated: {lastUpdated}
              </span>
            )}
            
            <button
              onClick={loadGameList}
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                background: loading ? '#666' : '#00b050',
                color: '#000',
                border: 'none',
                borderRadius: '4px',
                fontSize: '0.85em',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
                opacity: loading ? 0.7 : 1
              }}
              onMouseOver={(e) => !loading && (e.target.style.background = '#00e050')}
              onMouseOut={(e) => !loading && (e.target.style.background = '#00b050')}
            >
              <RefreshCw size={14} style={{
                animation: loading ? 'spin 1s linear infinite' : 'none'
              }} />
              {loading ? 'Updating...' : 'Check for Updates'}
            </button>
          </div>
          
          {/* Update Status Message */}
          {updateStatus && (
            <div style={{
              marginTop: '12px',
              fontSize: '0.85em',
              color: updateStatus.includes('Error') ? '#ff6b6b' : '#00b050',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}>
              {updateStatus.includes('Error') && <AlertCircle size={14} />}
              {updateStatus}
            </div>
          )}
          
          <style>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{
            textAlign: 'center',
            marginBottom: '30px',
            fontSize: '0.95em',
            color: '#00b050'
          }}>
            Loading game database...
          </div>
        )}

        {/* Search Bar */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Search size={20} style={{
              position: 'absolute',
              left: '15px',
              color: '#808080'
            }} />
            <input
              type="text"
              placeholder={loading ? "Loading..." : "Search for a game title..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px 40px 12px 45px',
                fontSize: '1em',
                border: '2px solid #00b050',
                borderRadius: '8px',
                background: '#2a2a2a',
                color: '#fff',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#00e050'}
              onBlur={(e) => e.target.style.borderColor = '#00b050'}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '15px',
                  background: 'none',
                  border: 'none',
                  color: '#808080',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {isCompatible && (
          <div style={{
            background: '#1f1f1f',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px',
            borderLeft: '4px solid #00b050'
          }}>
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              marginBottom: '15px',
              gap: '10px'
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                background: '#00b050',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                ✓
              </div>
              <h2 style={{ margin: 0, fontSize: '1.3em' }}>
                Compatible! ({filteredGames.length} match{filteredGames.length !== 1 ? 'es' : ''})
              </h2>
            </div>
            
            <div style={{
              maxHeight: '400px',
              overflowY: 'auto',
              paddingRight: '10px'
            }}>
              {filteredGames.map((game, index) => (
                <div 
                  key={index}
                  style={{
                    padding: '10px',
                    background: '#252525',
                    marginBottom: '8px',
                    borderRadius: '4px',
                    fontSize: '0.95em'
                  }}
                >
                  {game}
                </div>
              ))}
            </div>
          </div>
        )}

        {searchQuery && !isCompatible && (
          <div style={{
            background: '#1f1f1f',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px',
            borderLeft: '4px solid #ff6b6b',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '1.1em', margin: '0' }}>
              No matches found for "{searchQuery}"
            </p>
            <p style={{ fontSize: '0.9em', color: '#b0b0b0', margin: '8px 0 0 0' }}>
              This game may not be supported yet, or try a partial title search.
            </p>
          </div>
        )}

        {/* Toggle Index Button */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <button
            onClick={() => setShowIndex(!showIndex)}
            style={{
              padding: '10px 20px',
              background: '#00b050',
              color: '#000',
              border: 'none',
              borderRadius: '4px',
              fontSize: '0.95em',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.target.style.background = '#00e050'}
            onMouseOut={(e) => e.target.style.background = '#00b050'}
          >
            {showIndex ? 'Hide Full Index' : 'View Full Index'}
          </button>
        </div>

        {/* Full Game Index */}
        {showIndex && (
          <div style={{
            background: '#1f1f1f',
            borderRadius: '8px',
            padding: '20px',
            borderTop: '2px solid #00b050'
          }}>
            <h2 style={{ marginTop: 0, fontSize: '1.3em', marginBottom: '15px' }}>
              All Compatible Games ({gameList.length} total)
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '10px',
              maxHeight: '600px',
              overflowY: 'auto',
              paddingRight: '10px'
            }}>
              {gameList.map((game, index) => (
                <div
                  key={index}
                  style={{
                    padding: '10px',
                    background: '#252525',
                    borderRadius: '4px',
                    fontSize: '0.9em',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.background = '#2d2d2d'}
                  onMouseOut={(e) => e.target.style.background = '#252525'}
                  onClick={() => setSearchQuery(game)}
                >
                  {game}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div style={{
          marginTop: '40px',
          padding: '20px',
          background: '#1f1f1f',
          borderRadius: '8px',
          fontSize: '0.9em',
          color: '#b0b0b0',
          lineHeight: '1.6'
        }}>
          <h3 style={{ marginTop: 0, color: '#00b050' }}>How It Works</h3>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li>Insert your physical Xbox disc into your Xbox One S</li>
            <li>Press the menu button and select "Get Digital Version"</li>
            <li>The game will be added to your account as a digital license</li>
            <li>Play on Xbox Series S or other consoles via Play Anywhere</li>
            <li>If you sell the disc, the license transfers to the new owner</li>
          </ul>
          <p style={{ marginTop: '15px', fontSize: '0.85em', color: '#808080' }}>
            Data sourced from Windows Central and community verification. List is continually growing as Xbox adds more titles.
          </p>

          <h3 style={{ marginTop: '25px', color: '#00b050' }}>Auto-Update Setup</h3>
          <p style={{ marginBottom: '10px' }}>
            This app can automatically check for new games added to the disc-to-digital program:
          </p>
          <ol style={{ margin: 0, paddingLeft: '20px', marginBottom: '10px' }}>
            <li><strong>Create a GitHub Gist or Repository</strong>
              <ul style={{ margin: '5px 0' }}>
                <li>Create a file named <code style={{ background: '#252525', padding: '2px 6px', borderRadius: '3px' }}>games.json</code></li>
                <li>Add the complete game list as a JSON array: <code style={{ background: '#252525', padding: '2px 6px', borderRadius: '3px' }}>[&quot;Game 1&quot;, &quot;Game 2&quot;, ...]</code></li>
              </ul>
            </li>
            <li><strong>Update the fetch URL</strong>
              <ul style={{ margin: '5px 0' }}>
                <li>In the code, find the line with <code style={{ background: '#252525', padding: '2px 6px', borderRadius: '3px' }}>YOUR_USERNAME</code></li>
                <li>Replace it with your actual GitHub username and repository/gist URL</li>
              </ul>
            </li>
            <li><strong>Maintain the List</strong>
              <ul style={{ margin: '5px 0' }}>
                <li>Update your <code style={{ background: '#252525', padding: '2px 6px', borderRadius: '3px' }}>games.json</code> file whenever new titles are added</li>
                <li>Users can click "Check for Updates" to fetch the latest list</li>
                <li>The app caches updates locally and remembers the last update time</li>
              </ul>
            </li>
          </ol>
          <p style={{ fontSize: '0.85em', color: '#808080', margin: 0 }}>
            <strong>Alternative:</strong> If you don't want to maintain a remote list, the app will use the built-in list (which you can update periodically in the code).
          </p>
        </div>
      </div>
    </div>
  );
};

export default XboxDiscChecker;
