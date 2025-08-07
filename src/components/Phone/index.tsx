import { Button, Card } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { usePhoneStore } from "../../store/usePhoneStore";
import { useState } from "react";
import NotificationBar from "./NotificationBar";
import PhoneCalling from "./PhoneCalling";
import LoadingThreeDotsPulse from "../LoadingThreeDotsJumping";
import "./index.css";

function PhoneInterface() {
  const botId = import.meta.env.VITE_BOT_ID;
  const { isCalling, isNotificationBarVisible, setIsNotificationBarVisible } =
    usePhoneStore();
  const [isLoading, setIsLoading] = useState(false);
  // const [selectedMenu, setSelectedMenu] = useState("keagenan");
  const [roomNameFromResponse, setRoomNameFromResponse] = useState("");
  // const [virtualAssistantId, setVirtualAssistantId] = useState(keagenanId);

  // const handleClickKeagenan = () => {
  //   setSelectedMenu("keagenan");
  //   setVirtualAssistantId(keagenanId);
  // };

  // const handleClickTeleSales = () => {
  //   setSelectedMenu("telesales");
  //   setVirtualAssistantId(teleSalesId);
  // };

  // const handleClickTelemarketing = () => {
  //   setSelectedMenu("telemarketing");
  //   setVirtualAssistantId(teleMarketingId);
  // };

  const handleClickSendCall = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_APP_APP_API_URL_VOICEBOT}/${botId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            embeds: [
              {
                uuid: "2b850056-2698-4226-acee-fb70d2c62279",
                name: "Azure OpenAI",
                logo: "",
                abbr: "AZOAI",
                embedType: "LLM",
              },
              {
                uuid: "31880448-b19e-4048-aa9c-b86a6b695ea0",
                name: "Deepgram",
                logo: "",
                abbr: "DPG",
                embedType: "STT",
              },
              {
                uuid: "a59c951e-7565-4576-a494-1e84d1798b6e",
                name: "Azure Speech",
                logo: null,
                abbr: "AZSP",
                embedType: "TTS",
              },
              {
                uuid: "d19db99e-9547-47d0-8050-d4cad45795bf",
                name: "Elevenlabs",
                logo: "",
                abbr: "ELV",
                embedType: "TTS",
              },
            ],
            kbgroup: {
              uuid: "133776d5-9a44-4a14-b618-ce5658b547f1",
              va_uuid: "260ea8f6-e992-41eb-8e66-f628022dfb60",
              name: "Red Doorz Knowledgebase",
              description: "Knowledgebase Untuk Red Doorz",
            },
            tenantId: "f970aa00-6cdd-4369-8a7f-6b2c809d1b73",
          }),
        }
      );

      const data = await res.json();
      const roomNameFromResponse = data?.data?.room?.name;

      setTimeout(() => {
        setRoomNameFromResponse(roomNameFromResponse);
        setIsNotificationBarVisible(true);
        setIsLoading(false);
      }, 5000);
    } catch (err) {
      console.error("❌ Failed to connect:", err);
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="absolute mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl">
        <div className="w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute z-50"></div>
        <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[124px] rounded-s-lg"></div>
        <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[178px] rounded-s-lg"></div>
        <div className="h-[64px] w-[3px] bg-gray-800 absolute -end-[17px] top-[142px] rounded-e-lg"></div>
        {isCalling ? (
          <div className="rounded-[2rem] overflow-hidden w-[272px] h-[572px] bg-white flex flex-col items-center justify-center">
            <AnimatePresence>
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <PhoneCalling />
              </motion.div>
            </AnimatePresence>
          </div>
        ) : (
          <div className="rounded-[2rem] overflow-hidden w-[272px] h-[572px] bg-gray-400 flex flex-col items-center justify-between">
            <div className="mt-10 relative z-10">
              <AnimatePresence>
                {isNotificationBarVisible && (
                  <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <NotificationBar roomName={roomNameFromResponse} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Card className="w-full">
              <div className="flex flex-col gap-5 items-center bg-white h-[250px] pb-8">
                <div className="flex flex-col gap-2 items-center">
                  <h1 className="text-2xl font-bold text-center">
                    Infomedia Operating Center
                  </h1>
                  <p className="text-sm text-gray-500">Voicebot IOC</p>
                </div>
                {/* <div className="flex flex-col gap-2 items-center w-full">
                  <Button
                    className="w-1/2"
                    type={selectedMenu === "keagenan" ? "primary" : "default"}
                    style={{ borderRadius: "20px", width: "50%" }}
                    onClick={handleClickKeagenan}
                  >
                    Keagenan
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      style={{ borderRadius: "20px", width: "50%" }}
                      type={
                        selectedMenu === "telesales" ? "primary" : "default"
                      }
                      onClick={handleClickTeleSales}
                    >
                      Telesales
                    </Button>
                    <Button
                      style={{ borderRadius: "20px", width: "50%" }}
                      type={
                        selectedMenu === "telemarketing" ? "primary" : "default"
                      }
                      onClick={handleClickTelemarketing}
                    >
                      Telemarketing
                    </Button>
                  </div>
                </div> */}
                <div className="flex flex-col gap-2 w-full">
                  <Button
                    className="custom-button-send-call"
                    type="text"
                    style={{ borderRadius: "20px" }}
                    onClick={handleClickSendCall}
                    disabled={isLoading}
                  >
                    {isLoading ? <LoadingThreeDotsPulse /> : "Please Send Call"}
                  </Button>
                  <Button
                    type="text"
                    className="custom-button-cancel"
                    onClick={() => {
                      setIsNotificationBarVisible(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </>
  );
}

export default PhoneInterface;
