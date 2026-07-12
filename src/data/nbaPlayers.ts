import type { AttrStats, Legend } from "@/types/game";
import { pick, shuffle } from "@/lib/utils";

export interface NBAPlayer {
  name: string;
  tier: 1 | 2 | 3;
  category: "scorer" | "playmaker" | "defender" | "athletic";
  stats: {
    arremesso: number;
    finalizacao: number;
    drible: number;
    passe: number;
    defesa: number;
    rebote: number;
    atletismo: number;
    instinto: number;
  };
}

export const nbaPlayersPool: NBAPlayer[] = [
  { name: "Stephen Curry", tier: 1, category: "scorer", stats: { arremesso: 99, finalizacao: 84, drible: 95, passe: 88, defesa: 65, rebote: 52, atletismo: 78, instinto: 95 } },
  { name: "Michael Jordan", tier: 1, category: "scorer", stats: { arremesso: 83, finalizacao: 98, drible: 88, passe: 78, defesa: 92, rebote: 68, atletismo: 96, instinto: 99 } },
  { name: "LeBron James", tier: 1, category: "athletic", stats: { arremesso: 78, finalizacao: 96, drible: 86, passe: 93, defesa: 85, rebote: 84, atletismo: 97, instinto: 96 } },
  { name: "Magic Johnson", tier: 1, category: "playmaker", stats: { arremesso: 74, finalizacao: 88, drible: 91, passe: 98, defesa: 72, rebote: 82, atletismo: 80, instinto: 94 } },
  { name: "Larry Bird", tier: 1, category: "scorer", stats: { arremesso: 91, finalizacao: 86, drible: 82, passe: 89, defesa: 80, rebote: 88, atletismo: 70, instinto: 97 } },
  { name: "Kobe Bryant", tier: 1, category: "scorer", stats: { arremesso: 86, finalizacao: 93, drible: 89, passe: 76, defesa: 88, rebote: 58, atletismo: 90, instinto: 98 } },
  { name: "Shaquille O'Neal", tier: 1, category: "athletic", stats: { arremesso: 25, finalizacao: 98, drible: 45, passe: 62, defesa: 88, rebote: 96, atletismo: 95, instinto: 93 } },
  { name: "Hakeem Olajuwon", tier: 1, category: "defender", stats: { arremesso: 40, finalizacao: 95, drible: 72, passe: 65, defesa: 97, rebote: 94, atletismo: 89, instinto: 94 } },
  { name: "Tim Duncan", tier: 1, category: "defender", stats: { arremesso: 62, finalizacao: 91, drible: 64, passe: 72, defesa: 95, rebote: 95, atletismo: 76, instinto: 95 } },
  { name: "Kevin Durant", tier: 1, category: "scorer", stats: { arremesso: 94, finalizacao: 90, drible: 86, passe: 78, defesa: 82, rebote: 74, atletismo: 84, instinto: 92 } },
  { name: "Nikola Jokic", tier: 1, category: "playmaker", stats: { arremesso: 84, finalizacao: 92, drible: 82, passe: 97, defesa: 74, rebote: 95, atletismo: 66, instinto: 96 } },
  { name: "Giannis Antetokounmpo", tier: 1, category: "athletic", stats: { arremesso: 68, finalizacao: 96, drible: 84, passe: 80, defesa: 91, rebote: 93, atletismo: 96, instinto: 90 } },
  { name: "Kawhi Leonard", tier: 1, category: "defender", stats: { arremesso: 88, finalizacao: 89, drible: 84, passe: 70, defesa: 96, rebote: 70, atletismo: 82, instinto: 92 } },
  { name: "Luka Doncic", tier: 1, category: "playmaker", stats: { arremesso: 85, finalizacao: 90, drible: 94, passe: 95, defesa: 68, rebote: 84, atletismo: 74, instinto: 93 } },
  { name: "Allen Iverson", tier: 1, category: "playmaker", stats: { arremesso: 78, finalizacao: 90, drible: 97, passe: 84, defesa: 74, rebote: 42, atletismo: 94, instinto: 91 } },
  { name: "Wilt Chamberlain", tier: 1, category: "athletic", stats: { arremesso: 48, finalizacao: 97, drible: 58, passe: 70, defesa: 90, rebote: 98, atletismo: 94, instinto: 92 } },
  { name: "Bill Russell", tier: 1, category: "defender", stats: { arremesso: 42, finalizacao: 82, drible: 55, passe: 75, defesa: 99, rebote: 96, atletismo: 88, instinto: 97 } },
  { name: "Julius Erving", tier: 1, category: "athletic", stats: { arremesso: 76, finalizacao: 94, drible: 82, passe: 78, defesa: 84, rebote: 70, atletismo: 93, instinto: 90 } },
  { name: "Oscar Robertson", tier: 1, category: "playmaker", stats: { arremesso: 82, finalizacao: 88, drible: 86, passe: 94, defesa: 80, rebote: 78, atletismo: 78, instinto: 93 } },
  { name: "Jerry West", tier: 1, category: "scorer", stats: { arremesso: 88, finalizacao: 86, drible: 84, passe: 82, defesa: 82, rebote: 48, atletismo: 80, instinto: 94 } },
  { name: "Kareem Abdul-Jabbar", tier: 1, category: "athletic", stats: { arremesso: 55, finalizacao: 96, drible: 62, passe: 70, defesa: 90, rebote: 92, atletismo: 82, instinto: 95 } },
  { name: "Dirk Nowitzki", tier: 1, category: "scorer", stats: { arremesso: 93, finalizacao: 88, drible: 70, passe: 72, defesa: 72, rebote: 86, atletismo: 68, instinto: 90 } },
  { name: "Dwyane Wade", tier: 1, category: "scorer", stats: { arremesso: 80, finalizacao: 95, drible: 90, passe: 78, defesa: 84, rebote: 58, atletismo: 90, instinto: 92 } },
  { name: "Kevin Garnett", tier: 1, category: "defender", stats: { arremesso: 72, finalizacao: 86, drible: 70, passe: 76, defesa: 96, rebote: 92, atletismo: 88, instinto: 94 } },
  { name: "Isiah Thomas", tier: 1, category: "playmaker", stats: { arremesso: 80, finalizacao: 88, drible: 92, passe: 93, defesa: 82, rebote: 42, atletismo: 86, instinto: 93 } },
  { name: "Scottie Pippen", tier: 1, category: "defender", stats: { arremesso: 78, finalizacao: 84, drible: 82, passe: 84, defesa: 95, rebote: 74, atletismo: 90, instinto: 91 } },
  { name: "Charles Barkley", tier: 1, category: "athletic", stats: { arremesso: 72, finalizacao: 90, drible: 74, passe: 78, defesa: 78, rebote: 96, atletismo: 88, instinto: 89 } },
  { name: "David Robinson", tier: 1, category: "defender", stats: { arremesso: 58, finalizacao: 90, drible: 62, passe: 68, defesa: 94, rebote: 90, atletismo: 92, instinto: 90 } },
  { name: "Patrick Ewing", tier: 1, category: "defender", stats: { arremesso: 52, finalizacao: 90, drible: 55, passe: 58, defesa: 92, rebote: 90, atletismo: 84, instinto: 88 } },
  { name: "Karl Malone", tier: 1, category: "athletic", stats: { arremesso: 70, finalizacao: 92, drible: 68, passe: 70, defesa: 82, rebote: 90, atletismo: 88, instinto: 90 } },
  { name: "John Stockton", tier: 1, category: "playmaker", stats: { arremesso: 82, finalizacao: 72, drible: 85, passe: 98, defesa: 89, rebote: 38, atletismo: 70, instinto: 91 } },
  { name: "Steve Nash", tier: 1, category: "playmaker", stats: { arremesso: 90, finalizacao: 70, drible: 88, passe: 97, defesa: 52, rebote: 36, atletismo: 72, instinto: 90 } },
  { name: "Kyrie Irving", tier: 2, category: "scorer", stats: { arremesso: 90, finalizacao: 92, drible: 99, passe: 82, defesa: 58, rebote: 45, atletismo: 80, instinto: 92 } },
  { name: "James Harden", tier: 2, category: "scorer", stats: { arremesso: 86, finalizacao: 88, drible: 95, passe: 90, defesa: 55, rebote: 62, atletismo: 76, instinto: 87 } },
  { name: "Anthony Davis", tier: 2, category: "defender", stats: { arremesso: 72, finalizacao: 90, drible: 74, passe: 66, defesa: 93, rebote: 91, atletismo: 84, instinto: 88 } },
  { name: "Jayson Tatum", tier: 2, category: "scorer", stats: { arremesso: 86, finalizacao: 89, drible: 84, passe: 74, defesa: 83, rebote: 78, atletismo: 82, instinto: 85 } },
  { name: "Damian Lillard", tier: 2, category: "scorer", stats: { arremesso: 91, finalizacao: 85, drible: 89, passe: 80, defesa: 52, rebote: 44, atletismo: 82, instinto: 92 } },
  { name: "Devin Booker", tier: 2, category: "scorer", stats: { arremesso: 89, finalizacao: 86, drible: 85, passe: 78, defesa: 64, rebote: 48, atletismo: 78, instinto: 84 } },
  { name: "Chris Paul", tier: 2, category: "playmaker", stats: { arremesso: 84, finalizacao: 72, drible: 92, passe: 96, defesa: 88, rebote: 46, atletismo: 70, instinto: 94 } },
  { name: "Russell Westbrook", tier: 2, category: "athletic", stats: { arremesso: 65, finalizacao: 88, drible: 84, passe: 85, defesa: 70, rebote: 78, atletismo: 95, instinto: 82 } },
  { name: "Jimmy Butler", tier: 2, category: "defender", stats: { arremesso: 75, finalizacao: 84, drible: 80, passe: 74, defesa: 90, rebote: 64, atletismo: 80, instinto: 93 } },
  { name: "Paul George", tier: 2, category: "scorer", stats: { arremesso: 88, finalizacao: 82, drible: 83, passe: 68, defesa: 87, rebote: 66, atletismo: 82, instinto: 84 } },
  { name: "Donovan Mitchell", tier: 2, category: "scorer", stats: { arremesso: 86, finalizacao: 89, drible: 86, passe: 72, defesa: 68, rebote: 48, atletismo: 92, instinto: 85 } },
  { name: "Ja Morant", tier: 2, category: "athletic", stats: { arremesso: 74, finalizacao: 91, drible: 90, passe: 84, defesa: 60, rebote: 54, atletismo: 96, instinto: 86 } },
  { name: "Tyrese Haliburton", tier: 2, category: "playmaker", stats: { arremesso: 87, finalizacao: 76, drible: 84, passe: 95, defesa: 68, rebote: 42, atletismo: 75, instinto: 86 } },
  { name: "Bam Adebayo", tier: 2, category: "defender", stats: { arremesso: 55, finalizacao: 85, drible: 72, passe: 76, defesa: 89, rebote: 88, atletismo: 84, instinto: 84 } },
  { name: "Rudy Gobert", tier: 2, category: "defender", stats: { arremesso: 15, finalizacao: 82, drible: 38, passe: 48, defesa: 94, rebote: 91, atletismo: 78, instinto: 80 } },
  { name: "Anthony Edwards", tier: 2, category: "athletic", stats: { arremesso: 84, finalizacao: 89, drible: 85, passe: 70, defesa: 81, rebote: 58, atletismo: 93, instinto: 88 } },
  { name: "Domantas Sabonis", tier: 2, category: "playmaker", stats: { arremesso: 70, finalizacao: 86, drible: 74, passe: 85, defesa: 70, rebote: 92, atletismo: 72, instinto: 82 } },
  { name: "Jaylen Brown", tier: 2, category: "athletic", stats: { arremesso: 82, finalizacao: 88, drible: 80, passe: 66, defesa: 82, rebote: 60, atletismo: 89, instinto: 82 } },
  { name: "Trae Young", tier: 2, category: "playmaker", stats: { arremesso: 85, finalizacao: 78, drible: 91, passe: 94, defesa: 42, rebote: 38, atletismo: 76, instinto: 85 } },
  { name: "De'Aaron Fox", tier: 2, category: "playmaker", stats: { arremesso: 78, finalizacao: 86, drible: 88, passe: 78, defesa: 74, rebote: 46, atletismo: 94, instinto: 86 } },
  { name: "Ray Allen", tier: 2, category: "scorer", stats: { arremesso: 95, finalizacao: 80, drible: 78, passe: 70, defesa: 74, rebote: 48, atletismo: 82, instinto: 88 } },
  { name: "Klay Thompson", tier: 2, category: "scorer", stats: { arremesso: 93, finalizacao: 74, drible: 68, passe: 62, defesa: 85, rebote: 44, atletismo: 74, instinto: 84 } },
  { name: "Carmelo Anthony", tier: 2, category: "scorer", stats: { arremesso: 88, finalizacao: 86, drible: 82, passe: 68, defesa: 66, rebote: 70, atletismo: 78, instinto: 86 } },
  { name: "Tracy McGrady", tier: 2, category: "scorer", stats: { arremesso: 88, finalizacao: 90, drible: 86, passe: 74, defesa: 78, rebote: 62, atletismo: 90, instinto: 88 } },
  { name: "Vince Carter", tier: 2, category: "athletic", stats: { arremesso: 84, finalizacao: 88, drible: 80, passe: 68, defesa: 76, rebote: 58, atletismo: 94, instinto: 86 } },
  { name: "Paul Pierce", tier: 2, category: "scorer", stats: { arremesso: 88, finalizacao: 86, drible: 80, passe: 72, defesa: 78, rebote: 64, atletismo: 76, instinto: 90 } },
  { name: "Manu Ginobili", tier: 2, category: "scorer", stats: { arremesso: 86, finalizacao: 84, drible: 88, passe: 84, defesa: 76, rebote: 48, atletismo: 82, instinto: 92 } },
  { name: "Tony Parker", tier: 2, category: "playmaker", stats: { arremesso: 78, finalizacao: 88, drible: 90, passe: 86, defesa: 68, rebote: 40, atletismo: 88, instinto: 86 } },
  { name: "Chauncey Billups", tier: 2, category: "playmaker", stats: { arremesso: 86, finalizacao: 78, drible: 82, passe: 88, defesa: 80, rebote: 42, atletismo: 74, instinto: 90 } },
  { name: "Jason Kidd", tier: 2, category: "playmaker", stats: { arremesso: 78, finalizacao: 72, drible: 84, passe: 95, defesa: 86, rebote: 72, atletismo: 78, instinto: 92 } },
  { name: "Gary Payton", tier: 2, category: "defender", stats: { arremesso: 80, finalizacao: 82, drible: 84, passe: 84, defesa: 94, rebote: 48, atletismo: 86, instinto: 90 } },
  { name: "Clyde Drexler", tier: 2, category: "athletic", stats: { arremesso: 82, finalizacao: 88, drible: 84, passe: 78, defesa: 82, rebote: 68, atletismo: 90, instinto: 88 } },
  { name: "Dominique Wilkins", tier: 2, category: "athletic", stats: { arremesso: 80, finalizacao: 92, drible: 78, passe: 62, defesa: 70, rebote: 58, atletismo: 94, instinto: 86 } },
  { name: "Penny Hardaway", tier: 2, category: "playmaker", stats: { arremesso: 80, finalizacao: 86, drible: 88, passe: 90, defesa: 78, rebote: 58, atletismo: 88, instinto: 86 } },
  { name: "Grant Hill", tier: 2, category: "athletic", stats: { arremesso: 78, finalizacao: 86, drible: 84, passe: 82, defesa: 80, rebote: 68, atletismo: 90, instinto: 86 } },
  { name: "Chris Webber", tier: 2, category: "playmaker", stats: { arremesso: 72, finalizacao: 86, drible: 78, passe: 86, defesa: 82, rebote: 88, atletismo: 84, instinto: 86 } },
  { name: "Shawn Kemp", tier: 2, category: "athletic", stats: { arremesso: 58, finalizacao: 90, drible: 62, passe: 58, defesa: 78, rebote: 86, atletismo: 94, instinto: 84 } },
  { name: "Alonzo Mourning", tier: 2, category: "defender", stats: { arremesso: 48, finalizacao: 88, drible: 50, passe: 52, defesa: 93, rebote: 86, atletismo: 86, instinto: 88 } },
  { name: "Dikembe Mutombo", tier: 2, category: "defender", stats: { arremesso: 10, finalizacao: 74, drible: 36, passe: 48, defesa: 94, rebote: 90, atletismo: 74, instinto: 86 } },
  { name: "Ben Wallace", tier: 2, category: "defender", stats: { arremesso: 12, finalizacao: 70, drible: 40, passe: 54, defesa: 95, rebote: 94, atletismo: 88, instinto: 88 } },
  { name: "Dennis Rodman", tier: 2, category: "defender", stats: { arremesso: 28, finalizacao: 60, drible: 52, passe: 62, defesa: 92, rebote: 99, atletismo: 84, instinto: 90 } },
  { name: "Reggie Miller", tier: 2, category: "scorer", stats: { arremesso: 94, finalizacao: 74, drible: 76, passe: 68, defesa: 72, rebote: 38, atletismo: 78, instinto: 94 } },
  { name: "Kevin McHale", tier: 2, category: "scorer", stats: { arremesso: 78, finalizacao: 92, drible: 58, passe: 62, defesa: 84, rebote: 84, atletismo: 72, instinto: 88 } },
  { name: "Robert Parish", tier: 2, category: "defender", stats: { arremesso: 48, finalizacao: 84, drible: 42, passe: 55, defesa: 88, rebote: 90, atletismo: 74, instinto: 84 } },
  { name: "James Worthy", tier: 2, category: "athletic", stats: { arremesso: 76, finalizacao: 90, drible: 74, passe: 68, defesa: 80, rebote: 70, atletismo: 88, instinto: 88 } },
  { name: "Adrian Dantley", tier: 2, category: "scorer", stats: { arremesso: 82, finalizacao: 94, drible: 72, passe: 62, defesa: 68, rebote: 58, atletismo: 78, instinto: 86 } },
  { name: "Alex English", tier: 2, category: "scorer", stats: { arremesso: 88, finalizacao: 86, drible: 78, passe: 72, defesa: 62, rebote: 52, atletismo: 76, instinto: 84 } },
  { name: "George Gervin", tier: 2, category: "scorer", stats: { arremesso: 90, finalizacao: 88, drible: 80, passe: 68, defesa: 70, rebote: 48, atletismo: 82, instinto: 88 } },
  { name: "Moses Malone", tier: 2, category: "athletic", stats: { arremesso: 55, finalizacao: 90, drible: 48, passe: 55, defesa: 82, rebote: 96, atletismo: 84, instinto: 88 } },
  { name: "Bob Cousy", tier: 2, category: "playmaker", stats: { arremesso: 78, finalizacao: 72, drible: 90, passe: 96, defesa: 70, rebote: 40, atletismo: 72, instinto: 92 } },
  { name: "Pete Maravich", tier: 2, category: "scorer", stats: { arremesso: 88, finalizacao: 84, drible: 96, passe: 86, defesa: 58, rebote: 42, atletismo: 80, instinto: 90 } },
  { name: "Joel Embiid", tier: 2, category: "athletic", stats: { arremesso: 82, finalizacao: 92, drible: 68, passe: 70, defesa: 88, rebote: 90, atletismo: 82, instinto: 88 } },
  { name: "Karl-Anthony Towns", tier: 2, category: "scorer", stats: { arremesso: 88, finalizacao: 88, drible: 68, passe: 72, defesa: 72, rebote: 88, atletismo: 76, instinto: 82 } },
  { name: "Zion Williamson", tier: 2, category: "athletic", stats: { arremesso: 68, finalizacao: 94, drible: 74, passe: 68, defesa: 72, rebote: 78, atletismo: 95, instinto: 84 } },
  { name: "Shai Gilgeous-Alexander", tier: 2, category: "scorer", stats: { arremesso: 86, finalizacao: 92, drible: 92, passe: 82, defesa: 80, rebote: 58, atletismo: 88, instinto: 90 } },
  { name: "Pascal Siakam", tier: 2, category: "athletic", stats: { arremesso: 80, finalizacao: 86, drible: 80, passe: 74, defesa: 80, rebote: 72, atletismo: 86, instinto: 84 } },
  { name: "Bradley Beal", tier: 2, category: "scorer", stats: { arremesso: 88, finalizacao: 86, drible: 84, passe: 72, defesa: 62, rebote: 48, atletismo: 82, instinto: 84 } },
  { name: "CJ McCollum", tier: 2, category: "scorer", stats: { arremesso: 88, finalizacao: 84, drible: 84, passe: 74, defesa: 64, rebote: 46, atletismo: 78, instinto: 84 } },
  { name: "Khris Middleton", tier: 2, category: "scorer", stats: { arremesso: 88, finalizacao: 82, drible: 78, passe: 78, defesa: 80, rebote: 58, atletismo: 74, instinto: 86 } },
  { name: "Jrue Holiday", tier: 2, category: "defender", stats: { arremesso: 82, finalizacao: 76, drible: 80, passe: 84, defesa: 90, rebote: 52, atletismo: 76, instinto: 88 } },
  { name: "Draymond Green", tier: 2, category: "defender", stats: { arremesso: 68, finalizacao: 65, drible: 74, passe: 86, defesa: 90, rebote: 78, atletismo: 74, instinto: 92 } },
  { name: "Victor Wembanyama", tier: 2, category: "defender", stats: { arremesso: 82, finalizacao: 86, drible: 72, passe: 70, defesa: 92, rebote: 86, atletismo: 88, instinto: 86 } },
  { name: "Marcus Smart", tier: 3, category: "defender", stats: { arremesso: 74, finalizacao: 68, drible: 76, passe: 78, defesa: 88, rebote: 48, atletismo: 76, instinto: 86 } },
  { name: "Alex Caruso", tier: 3, category: "defender", stats: { arremesso: 78, finalizacao: 64, drible: 72, passe: 68, defesa: 87, rebote: 44, atletismo: 80, instinto: 86 } },
  { name: "Derrick White", tier: 3, category: "defender", stats: { arremesso: 84, finalizacao: 72, drible: 76, passe: 74, defesa: 86, rebote: 46, atletismo: 76, instinto: 86 } },
  { name: "Brook Lopez", tier: 3, category: "defender", stats: { arremesso: 80, finalizacao: 76, drible: 48, passe: 50, defesa: 86, rebote: 66, atletismo: 60, instinto: 82 } },
  { name: "Mikal Bridges", tier: 3, category: "defender", stats: { arremesso: 84, finalizacao: 78, drible: 76, passe: 68, defesa: 85, rebote: 50, atletismo: 78, instinto: 82 } },
  { name: "Clint Capela", tier: 3, category: "defender", stats: { arremesso: 10, finalizacao: 80, drible: 35, passe: 42, defesa: 80, rebote: 90, atletismo: 76, instinto: 76 } },
  { name: "Steven Adams", tier: 3, category: "defender", stats: { arremesso: 15, finalizacao: 74, drible: 42, passe: 66, defesa: 78, rebote: 88, atletismo: 74, instinto: 84 } },
  { name: "Malik Monk", tier: 3, category: "scorer", stats: { arremesso: 84, finalizacao: 80, drible: 82, passe: 72, defesa: 52, rebote: 36, atletismo: 86, instinto: 80 } },
  { name: "Jarred Vanderbilt", tier: 3, category: "defender", stats: { arremesso: 52, finalizacao: 66, drible: 58, passe: 54, defesa: 84, rebote: 80, atletismo: 84, instinto: 78 } },
  { name: "Myles Turner", tier: 3, category: "defender", stats: { arremesso: 82, finalizacao: 76, drible: 52, passe: 48, defesa: 86, rebote: 72, atletismo: 74, instinto: 80 } },
  { name: "Obi Toppin", tier: 3, category: "athletic", stats: { arremesso: 76, finalizacao: 82, drible: 66, passe: 58, defesa: 58, rebote: 50, atletismo: 90, instinto: 74 } },
  { name: "Mitchell Robinson", tier: 3, category: "defender", stats: { arremesso: 10, finalizacao: 74, drible: 32, passe: 38, defesa: 82, rebote: 86, atletismo: 80, instinto: 76 } },
  { name: "Walker Kessler", tier: 3, category: "defender", stats: { arremesso: 48, finalizacao: 72, drible: 40, passe: 44, defesa: 84, rebote: 82, atletismo: 74, instinto: 78 } },
  { name: "Herb Jones", tier: 3, category: "defender", stats: { arremesso: 72, finalizacao: 70, drible: 68, passe: 64, defesa: 88, rebote: 52, atletismo: 82, instinto: 84 } },
  { name: "Lu Dort", tier: 3, category: "defender", stats: { arremesso: 76, finalizacao: 72, drible: 70, passe: 58, defesa: 89, rebote: 44, atletismo: 82, instinto: 84 } },
  { name: "Matisse Thybulle", tier: 3, category: "defender", stats: { arremesso: 70, finalizacao: 58, drible: 62, passe: 52, defesa: 90, rebote: 42, atletismo: 84, instinto: 82 } },
  { name: "Jose Alvarado", tier: 3, category: "defender", stats: { arremesso: 76, finalizacao: 68, drible: 78, passe: 74, defesa: 86, rebote: 36, atletismo: 80, instinto: 84 } },
  { name: "Aaron Gordon", tier: 3, category: "athletic", stats: { arremesso: 70, finalizacao: 86, drible: 70, passe: 66, defesa: 80, rebote: 74, atletismo: 90, instinto: 82 } },
  { name: "Robert Williams III", tier: 3, category: "defender", stats: { arremesso: 42, finalizacao: 78, drible: 48, passe: 52, defesa: 86, rebote: 86, atletismo: 86, instinto: 78 } },
  { name: "OG Anunoby", tier: 3, category: "defender", stats: { arremesso: 80, finalizacao: 76, drible: 72, passe: 62, defesa: 88, rebote: 62, atletismo: 84, instinto: 82 } },
  { name: "Dillon Brooks", tier: 3, category: "defender", stats: { arremesso: 78, finalizacao: 74, drible: 70, passe: 58, defesa: 86, rebote: 48, atletismo: 80, instinto: 84 } },
  { name: "Jaden McDaniels", tier: 3, category: "defender", stats: { arremesso: 78, finalizacao: 72, drible: 70, passe: 62, defesa: 86, rebote: 54, atletismo: 84, instinto: 80 } },
  { name: "Ausar Thompson", tier: 3, category: "athletic", stats: { arremesso: 62, finalizacao: 78, drible: 74, passe: 68, defesa: 84, rebote: 68, atletismo: 92, instinto: 78 } },
  { name: "Amen Thompson", tier: 3, category: "athletic", stats: { arremesso: 58, finalizacao: 80, drible: 78, passe: 74, defesa: 82, rebote: 68, atletismo: 94, instinto: 80 } },
  { name: "Josh Hart", tier: 3, category: "defender", stats: { arremesso: 76, finalizacao: 74, drible: 72, passe: 76, defesa: 82, rebote: 78, atletismo: 84, instinto: 84 } },
  { name: "T.J. McConnell", tier: 3, category: "playmaker", stats: { arremesso: 74, finalizacao: 68, drible: 82, passe: 86, defesa: 80, rebote: 42, atletismo: 72, instinto: 86 } },
  { name: "Davion Mitchell", tier: 3, category: "defender", stats: { arremesso: 74, finalizacao: 68, drible: 78, passe: 74, defesa: 88, rebote: 38, atletismo: 86, instinto: 82 } },
  { name: "Gary Payton II", tier: 3, category: "defender", stats: { arremesso: 72, finalizacao: 70, drible: 72, passe: 62, defesa: 88, rebote: 52, atletismo: 90, instinto: 82 } },
  { name: "Patrick Beverley", tier: 3, category: "defender", stats: { arremesso: 76, finalizacao: 68, drible: 74, passe: 76, defesa: 88, rebote: 44, atletismo: 78, instinto: 88 } },
  { name: "Tony Allen", tier: 3, category: "defender", stats: { arremesso: 62, finalizacao: 70, drible: 68, passe: 58, defesa: 92, rebote: 48, atletismo: 84, instinto: 90 } },
  { name: "Bruce Bowen", tier: 3, category: "defender", stats: { arremesso: 78, finalizacao: 58, drible: 55, passe: 48, defesa: 91, rebote: 40, atletismo: 74, instinto: 88 } },
  { name: "Raja Bell", tier: 3, category: "defender", stats: { arremesso: 80, finalizacao: 64, drible: 62, passe: 52, defesa: 88, rebote: 42, atletismo: 76, instinto: 84 } },
  { name: "Shane Battier", tier: 3, category: "defender", stats: { arremesso: 78, finalizacao: 62, drible: 58, passe: 68, defesa: 88, rebote: 52, atletismo: 72, instinto: 88 } },
  { name: "Andrei Kirilenko", tier: 3, category: "defender", stats: { arremesso: 72, finalizacao: 76, drible: 70, passe: 72, defesa: 90, rebote: 72, atletismo: 86, instinto: 86 } },
  { name: "Ben Simmons", tier: 3, category: "playmaker", stats: { arremesso: 42, finalizacao: 82, drible: 84, passe: 88, defesa: 84, rebote: 78, atletismo: 90, instinto: 78 } },
  { name: "Lonzo Ball", tier: 3, category: "playmaker", stats: { arremesso: 78, finalizacao: 64, drible: 78, passe: 86, defesa: 82, rebote: 62, atletismo: 80, instinto: 82 } },
  { name: "DeAndre Jordan", tier: 3, category: "defender", stats: { arremesso: 18, finalizacao: 78, drible: 35, passe: 48, defesa: 78, rebote: 90, atletismo: 82, instinto: 74 } },
  { name: "Dwight Howard", tier: 3, category: "athletic", stats: { arremesso: 35, finalizacao: 86, drible: 45, passe: 52, defesa: 86, rebote: 92, atletismo: 90, instinto: 82 } },
  { name: "Tyson Chandler", tier: 3, category: "defender", stats: { arremesso: 25, finalizacao: 74, drible: 38, passe: 48, defesa: 86, rebote: 88, atletismo: 80, instinto: 82 } },
  { name: "Joakim Noah", tier: 3, category: "defender", stats: { arremesso: 42, finalizacao: 72, drible: 55, passe: 74, defesa: 90, rebote: 90, atletismo: 82, instinto: 88 } },
  { name: "Serge Ibaka", tier: 3, category: "defender", stats: { arremesso: 78, finalizacao: 76, drible: 48, passe: 48, defesa: 86, rebote: 78, atletismo: 78, instinto: 80 } },
  { name: "Horace Grant", tier: 3, category: "defender", stats: { arremesso: 55, finalizacao: 74, drible: 52, passe: 62, defesa: 88, rebote: 86, atletismo: 78, instinto: 84 } },
  { name: "Dennis Scott", tier: 3, category: "scorer", stats: { arremesso: 90, finalizacao: 68, drible: 68, passe: 58, defesa: 58, rebote: 40, atletismo: 70, instinto: 82 } },
  { name: "Glen Rice", tier: 3, category: "scorer", stats: { arremesso: 90, finalizacao: 80, drible: 72, passe: 62, defesa: 68, rebote: 48, atletismo: 76, instinto: 84 } },
  { name: "Peja Stojakovic", tier: 3, category: "scorer", stats: { arremesso: 92, finalizacao: 74, drible: 68, passe: 64, defesa: 58, rebote: 48, atletismo: 72, instinto: 84 } },
  { name: "Mike Miller", tier: 3, category: "scorer", stats: { arremesso: 90, finalizacao: 68, drible: 66, passe: 70, defesa: 58, rebote: 48, atletismo: 68, instinto: 80 } },
  { name: "Kyle Korver", tier: 3, category: "scorer", stats: { arremesso: 94, finalizacao: 58, drible: 58, passe: 62, defesa: 62, rebote: 36, atletismo: 64, instinto: 82 } },
  { name: "JJ Redick", tier: 3, category: "scorer", stats: { arremesso: 93, finalizacao: 62, drible: 64, passe: 64, defesa: 58, rebote: 32, atletismo: 68, instinto: 84 } },
  { name: "Duncan Robinson", tier: 3, category: "scorer", stats: { arremesso: 90, finalizacao: 58, drible: 58, passe: 58, defesa: 52, rebote: 34, atletismo: 66, instinto: 78 } },
  { name: "Buddy Hield", tier: 3, category: "scorer", stats: { arremesso: 90, finalizacao: 72, drible: 72, passe: 62, defesa: 58, rebote: 48, atletismo: 76, instinto: 80 } },
  { name: "Grayson Allen", tier: 3, category: "scorer", stats: { arremesso: 88, finalizacao: 70, drible: 68, passe: 62, defesa: 64, rebote: 38, atletismo: 76, instinto: 80 } },
  { name: "Norman Powell", tier: 3, category: "scorer", stats: { arremesso: 86, finalizacao: 82, drible: 76, passe: 62, defesa: 72, rebote: 42, atletismo: 84, instinto: 82 } },
  { name: "Jordan Clarkson", tier: 3, category: "scorer", stats: { arremesso: 84, finalizacao: 84, drible: 82, passe: 68, defesa: 58, rebote: 44, atletismo: 84, instinto: 82 } },
  { name: "Montrezl Harrell", tier: 3, category: "athletic", stats: { arremesso: 48, finalizacao: 86, drible: 55, passe: 52, defesa: 74, rebote: 78, atletismo: 88, instinto: 80 } },
  { name: "Jusuf Nurkic", tier: 3, category: "defender", stats: { arremesso: 55, finalizacao: 78, drible: 48, passe: 68, defesa: 78, rebote: 90, atletismo: 68, instinto: 80 } },
  { name: "Ivica Zubac", tier: 3, category: "defender", stats: { arremesso: 48, finalizacao: 80, drible: 42, passe: 52, defesa: 78, rebote: 88, atletismo: 68, instinto: 78 } },
  { name: "Nic Claxton", tier: 3, category: "defender", stats: { arremesso: 52, finalizacao: 78, drible: 55, passe: 58, defesa: 84, rebote: 82, atletismo: 84, instinto: 78 } },
  { name: "Jakob Poeltl", tier: 3, category: "defender", stats: { arremesso: 42, finalizacao: 78, drible: 48, passe: 62, defesa: 82, rebote: 86, atletismo: 72, instinto: 80 } },
  { name: "Al Horford", tier: 3, category: "defender", stats: { arremesso: 80, finalizacao: 76, drible: 58, passe: 78, defesa: 84, rebote: 78, atletismo: 68, instinto: 88 } },
  { name: "PJ Tucker", tier: 3, category: "defender", stats: { arremesso: 78, finalizacao: 62, drible: 55, passe: 58, defesa: 86, rebote: 62, atletismo: 72, instinto: 86 } },
  { name: "Robert Covington", tier: 3, category: "defender", stats: { arremesso: 82, finalizacao: 64, drible: 62, passe: 58, defesa: 86, rebote: 62, atletismo: 74, instinto: 82 } },
  { name: "Kentavious Caldwell-Pope", tier: 3, category: "defender", stats: { arremesso: 84, finalizacao: 70, drible: 70, passe: 64, defesa: 84, rebote: 42, atletismo: 76, instinto: 82 } },
  { name: "Danny Green", tier: 3, category: "defender", stats: { arremesso: 86, finalizacao: 62, drible: 58, passe: 58, defesa: 86, rebote: 44, atletismo: 74, instinto: 84 } },
  { name: "Andre Iguodala", tier: 3, category: "defender", stats: { arremesso: 74, finalizacao: 78, drible: 78, passe: 82, defesa: 88, rebote: 58, atletismo: 84, instinto: 90 } },
  { name: "Boris Diaw", tier: 3, category: "playmaker", stats: { arremesso: 72, finalizacao: 78, drible: 72, passe: 86, defesa: 68, rebote: 74, atletismo: 68, instinto: 86 } },
  { name: "Vlade Divac", tier: 3, category: "playmaker", stats: { arremesso: 58, finalizacao: 78, drible: 55, passe: 84, defesa: 78, rebote: 86, atletismo: 68, instinto: 86 } },
  { name: "Arvydas Sabonis", tier: 3, category: "playmaker", stats: { arremesso: 78, finalizacao: 84, drible: 55, passe: 88, defesa: 78, rebote: 90, atletismo: 58, instinto: 90 } },
  { name: "Pau Gasol", tier: 3, category: "playmaker", stats: { arremesso: 78, finalizacao: 86, drible: 62, passe: 84, defesa: 78, rebote: 88, atletismo: 68, instinto: 88 } },
  { name: "Marc Gasol", tier: 3, category: "defender", stats: { arremesso: 78, finalizacao: 78, drible: 55, passe: 80, defesa: 88, rebote: 84, atletismo: 62, instinto: 88 } },
  { name: "Yao Ming", tier: 3, category: "athletic", stats: { arremesso: 72, finalizacao: 90, drible: 48, passe: 68, defesa: 82, rebote: 90, atletismo: 68, instinto: 86 } },
  { name: "Detlef Schrempf", tier: 3, category: "scorer", stats: { arremesso: 82, finalizacao: 84, drible: 74, passe: 80, defesa: 72, rebote: 68, atletismo: 74, instinto: 84 } },
  { name: "Toni Kukoc", tier: 3, category: "playmaker", stats: { arremesso: 82, finalizacao: 80, drible: 78, passe: 86, defesa: 68, rebote: 62, atletismo: 74, instinto: 86 } },
  { name: "Drazen Petrovic", tier: 3, category: "scorer", stats: { arremesso: 90, finalizacao: 84, drible: 80, passe: 72, defesa: 68, rebote: 38, atletismo: 80, instinto: 90 } },
];

const CATEGORY_NICK: Record<NBAPlayer["category"], string> = {
  scorer: "Scorer",
  playmaker: "Playmaker",
  defender: "Defender",
  athletic: "Athletic",
};

function slugify(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function mapNbaStats(stats: NBAPlayer["stats"]): AttrStats {
  return {
    shot: stats.arremesso,
    fin: stats.finalizacao,
    drb: stats.drible,
    pass: stats.passe,
    def: stats.defesa,
    reb: stats.rebote,
    ath: stats.atletismo,
    clu: stats.instinto,
  };
}

export function toLegend(player: NBAPlayer): Legend {
  return {
    id: slugify(player.name),
    name: player.name,
    nick: CATEGORY_NICK[player.category],
    tier: player.tier,
    category: player.category,
    stats: mapNbaStats(player.stats),
  };
}

/** Full draft pool mapped to Legend shape. */
export const LEGENDS: Legend[] = nbaPlayersPool.map(toLegend);

/**
 * Exactly 2 Tier 1 + 4 Tier 2 + 2 Tier 3, shuffled.
 * Prevents stacking a perfect 95+ card every run.
 */
export function buildBalancedDraftPool(): Legend[] {
  const byTier = (tier: 1 | 2 | 3) =>
    shuffle(LEGENDS.filter((l) => l.tier === tier));

  const picks = [
    ...byTier(1).slice(0, 2),
    ...byTier(2).slice(0, 4),
    ...byTier(3).slice(0, 2),
  ];

  return shuffle(picks);
}

/** Reroll prefers same tier among unused names. */
export function pickRerollLegend(
  current: Legend,
  draftPool: Legend[],
): Legend | null {
  const used = new Set(draftPool.map((l) => l.name));
  const sameTier = LEGENDS.filter(
    (l) => l.tier === current.tier && !used.has(l.name),
  );
  const fallback = LEGENDS.filter((l) => !used.has(l.name));
  const pool = sameTier.length > 0 ? sameTier : fallback;
  return pool.length > 0 ? pick(pool) : null;
}
