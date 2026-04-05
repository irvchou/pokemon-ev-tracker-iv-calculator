export interface Pokemon {
  id: string;
  name: string;
  evs: {
    hp: number;
    attack: number;
    defense: number;
    spAttack: number;
    spDefense: number;
    speed: number;
  };
  totalEVs: number;
}

export interface StatButton {
  stat: keyof Pokemon['evs'];
  label: string;
  color: string;
}
