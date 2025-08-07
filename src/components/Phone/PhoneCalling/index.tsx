import { motion } from "framer-motion";
import callerImage from "../../../assets/infomedia_bulet.png";
import { PhoneOff, Volume2, VolumeOff } from "lucide-react";
import { usePhoneStore } from "../../../store/usePhoneStore";
import {
  getConnectionDetails,
  type ConnectionDetails,
} from "../../../utils/embed_livekit";
import { useState, useEffect, useRef } from "react";
import {
  LiveKitRoom,
  useLocalParticipant,
  RoomAudioRenderer,
} from "@livekit/components-react";
import type { MediaDeviceFailure } from "livekit-client";
import { Button, Image } from "antd";

function PhoneCalling() {
  const { setIsCalling, setIsNotificationBarVisible, roomName } =
    usePhoneStore();
  const [connectionDetails, setConnectionDetails] =
    useState<ConnectionDetails | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerBoosted, setIsSpeakerBoosted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  useEffect(() => {
    const setupConnection = async () => {
      if (!roomName) return;

      try {
        setError(null);

        const details = await getConnectionDetails({ roomName });

        setConnectionDetails(details);
      } catch (error) {
        console.error("Failed to setup connection:", error);
        setError(
          error instanceof Error ? error.message : "Failed to setup connection"
        );
      }
    };

    setupConnection();
  }, [roomName]);

  const handleClickMute = () => {
    setIsMuted(!isMuted);
  };

  const handleClickSpeaker = () => {
    try {
      // Cleanup koneksi audio yang ada
      if (sourceRef.current) {
        sourceRef.current.disconnect();
        sourceRef.current = null;
      }
      if (gainNodeRef.current) {
        gainNodeRef.current.disconnect();
        gainNodeRef.current = null;
      }

      // Jika akan menonaktifkan boost, cukup update state
      if (isSpeakerBoosted) {
        setIsSpeakerBoosted(false);
        return;
      }

      // Inisialisasi AudioContext jika belum ada
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
      }

      // Buat GainNode baru
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.gain.value = 2.0;

      const audioElements = document.getElementsByTagName("audio");
      Array.from(audioElements).forEach((audio) => {
        if (audio.srcObject) {
          sourceRef.current = audioContextRef.current!.createMediaStreamSource(
            audio.srcObject as MediaStream
          );
          sourceRef.current.connect(gainNodeRef.current!);
          gainNodeRef.current!.connect(audioContextRef.current!.destination);
        }
      });

      setIsSpeakerBoosted(true);
    } catch (err) {
      console.error("Error boosting speaker:", err);
      setIsSpeakerBoosted(false);
    }
  };

  const handleDisconnect = () => {
    setIsCalling(false);
    setIsNotificationBarVisible(false);
    setConnectionDetails(null);
  };

  useEffect(() => {
    return () => {
      if (sourceRef.current) {
        sourceRef.current.disconnect();
      }
      if (gainNodeRef.current) {
        gainNodeRef.current.disconnect();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <Button
          onClick={handleDisconnect}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Disconnect
        </Button>
      </div>
    );
  }

  if (!connectionDetails) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-gray-600 mb-4">No connection available</p>
        <Button
          onClick={handleDisconnect}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[30px] items-center">
      <LiveKitRoom
        token={connectionDetails?.participantToken}
        serverUrl={connectionDetails?.serverUrl}
        connect={true}
        audio={true}
        video={false}
        onMediaDeviceFailure={onDeviceFailure}
        onDisconnected={handleDisconnect}
        className="flex gap-2"
      >
        <RoomAudioRenderer />
        <MicrophoneControl isMuted={isMuted} />
        <div className="flex flex-col items-center">
          <Image
            src={callerImage}
            preview={false}
            style={{
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
            alt="caller"
          />
          <p className="text-2xl font-bold mt-4 text-center">
            Infomedia Operating Center
          </p>

          <div className="flex gap-[40px] items-center mt-6">
            <div className="flex flex-col items-center">
              <motion.button
                onClick={handleClickMute}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`text-black w-[50px] h-[50px] rounded-full flex items-center justify-center cursor-pointer border-1 border-gray-200 ${
                  isMuted ? "bg-red-100" : "bg-gray-100"
                }`}
              >
                {isMuted ? <VolumeOff size={20} /> : <Volume2 size={20} />}
              </motion.button>
              <p className="text-sm text-gray-500">
                {isMuted ? "Unmute" : "Mute"}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <motion.button
                onClick={handleClickSpeaker}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`text-black w-[50px] h-[50px] rounded-full flex items-center justify-center cursor-pointer border-1 border-gray-200 ${
                  isSpeakerBoosted ? "bg-blue-100" : "bg-gray-100"
                }`}
              >
                <Volume2 size={20} />
              </motion.button>
              <p className="text-sm text-gray-500">
                {isSpeakerBoosted ? "Boost" : "Normal"}
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-white w-[70px] h-[70px] rounded-full flex items-center justify-center cursor-pointer border-1 border-gray-200 bg-red-500 mt-6"
            onClick={handleDisconnect}
          >
            <PhoneOff size={20} />
          </motion.button>
        </div>
      </LiveKitRoom>
    </div>
  );
}

function MicrophoneControl({ isMuted }: { isMuted: boolean }) {
  const { localParticipant } = useLocalParticipant();

  useEffect(() => {
    if (localParticipant) {
      localParticipant.setMicrophoneEnabled(!isMuted);
    }
  }, [isMuted, localParticipant]);

  return null;
}

export default PhoneCalling;

function onDeviceFailure(error?: MediaDeviceFailure) {
  console.error("Device failure:", error);
  alert(
    "Error acquiring microphone permissions. Please make sure you grant the necessary permissions in your browser and reload the tab"
  );
}
