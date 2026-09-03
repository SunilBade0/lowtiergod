export interface Game {
  id: string;
  title: string;
  developer: string;
  imageUrl: string;
  tags: string[];
}

export const games: Game[] = [
  {
    id: "1091500",
    title: "Cyberpunk 2077",
    developer: "CD PROJEKT RED",
    imageUrl: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=800&auto=format&fit=crop",
    tags: ["RPG", "Action", "Sci-Fi", "Steam"]
  },
  {
    id: "2161700",
    title: "Persona 3 Reload",
    developer: "ATLUS",
    imageUrl: "https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?q=80&w=800&auto=format&fit=crop",
    tags: ["JRPG", "Anime", "Story Rich", "Steam"]
  },
  {
    id: "1687950",
    title: "Persona 5 Royal",
    developer: "ATLUS",
    imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop",
    tags: ["JRPG", "Turn-Based", "Masterpiece", "Steam"]
  }
];
