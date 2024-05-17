export interface GameProfileProperty {
  name: string;
  value: string;
}

export interface PlayerProfileData {
  username: string;
  id: string;
  raw_id: string;
  avatar: string;
  skin_texture: string;
  properties: GameProfileProperty[];
}

export interface PlayerDbResponse {
  code: string;
  message: string;
  success: boolean;
  error: boolean;
  data: {
    player?: PlayerProfileData;
  }
}
