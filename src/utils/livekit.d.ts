declare module "./livekit" {
  export function createParticipantToken(
    identity: string,
    roomName: string,
  ): Promise<string>;

  export interface ConnectionDetails {
    serverUrl: string;
    roomName: string;
    participantName: string;
    participantToken: string;
  }

  export function getConnectionDetails(): Promise<ConnectionDetails>;
}
