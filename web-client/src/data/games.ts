export interface Game {
  id: string;
  title: string;
  developer: string;
  imageUrl: string;
  bgImageUrl: string;
  tags: string[];
}

export const games: Game[] = [
  {
    id: "1091500",
    title: "Cyberpunk 2077",
    developer: "CD PROJEKT RED",
    imageUrl: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1091500/capsule_616x353.jpg",
    bgImageUrl: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1091500/page_bg_generated_v6b.jpg",
    tags: ["RPG", "Action", "Sci-Fi", "Steam"]
  },
  {
    id: "2161700",
    title: "Persona 3 Reload",
    developer: "ATLUS",
    imageUrl: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2161700/capsule_616x353.jpg",
    bgImageUrl: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2161700/page_bg_generated_v6b.jpg",
    tags: ["JRPG", "Anime", "Story Rich", "Steam"]
  },
  {
    id: "1687950",
    title: "Persona 5 Royal",
    developer: "ATLUS",
    imageUrl: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1687950/capsule_616x353.jpg",
    bgImageUrl: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1687950/page_bg_generated_v6b.jpg",
    tags: ["JRPG", "Turn-Based", "Masterpiece", "Steam"]
  }
];
