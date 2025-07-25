export interface MsgDataType {
  sender: string;
  receiver: string;
  text: string;
  attachments?: {
    path?: string;
    size?: string;
    mimeType?: string;
    fileName?: string;
  }[];
  location?: {
    latitude: number;
    longitude: number;
    name?: string;
    address?: string;
  };
  contact?: {
    name: string;
    phoneNumber: string;
    email?: string;
    profilePicture?: string;
  };
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}
