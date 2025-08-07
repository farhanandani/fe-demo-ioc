import { create } from "zustand";

interface PhoneStore {
  isCalling: boolean;
  isNotificationBarVisible: boolean;
  roomName: string;
  token: string;
  setIsCalling: (isCalling: boolean) => void;
  setIsNotificationBarVisible: (isNotificationBarVisible: boolean) => void;
  setRoomName: (roomName: string) => void;
  setToken: (token: string) => void;
}

export const usePhoneStore = create<PhoneStore>((set) => ({
  isCalling: false,
  isNotificationBarVisible: false,
  roomName: "",
  token: "",
  setIsCalling: (isCalling) => set({ isCalling }),
  setIsNotificationBarVisible: (isNotificationBarVisible) =>
    set({ isNotificationBarVisible }),
  setRoomName: (roomName) => set({ roomName }),
  setToken: (token) => set({ token }),
}));
