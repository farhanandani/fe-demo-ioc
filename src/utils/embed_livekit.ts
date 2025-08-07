import { AccessToken, type VideoGrant } from "livekit-server-sdk";

const API_KEY: string = import.meta.env.VITE_LIVEKIT_API_KEY as string;
const API_SECRET: string = import.meta.env.VITE_LIVEKIT_API_SECRET as string;
const LIVEKIT_URL: string = import.meta.env.VITE_LIVEKIT_URL as string;

if (!API_KEY || !API_SECRET || !LIVEKIT_URL) {
  throw new Error("LiveKit environment variables are not set properly.");
}

export interface ConnectionDetails {
  serverUrl: string;
  roomName: string;
  participantName: string;
  participantToken: string;
}

export async function createParticipantToken(
  identity: string,
  roomName: string
): Promise<string> {
  const at = new AccessToken(API_KEY, API_SECRET, {
    identity,
    ttl: 900, // 15 minutes
  });

  const grant: VideoGrant = {
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canPublishData: true,
    canSubscribe: true,
  };

  at.addGrant(grant);
  return await at.toJwt();
}

export async function getConnectionDetails({
  roomName,
}: {
  roomName: string;
}): Promise<ConnectionDetails> {
  const participantIdentity = `voice_assistant_user_${Math.floor(
    Math.random() * 10000
  )}`;

  const participantToken = await createParticipantToken(
    participantIdentity,
    roomName
  );
  return {
    serverUrl: "wss://voicebot-uti0n4e5.livekit.cloud",
    roomName,
    participantName: `voice_assistant_user_${Math.floor(
      Math.random() * 10000
    )}`,
    participantToken,
  };
}
