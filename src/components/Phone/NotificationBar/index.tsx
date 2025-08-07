import { motion } from "framer-motion";
import callerImage from "../../../assets/infomedia_bulet.png";
import { Phone, PhoneOff } from "lucide-react";
import { useState } from "react";
import { usePhoneStore } from "../../../store/usePhoneStore";
import { Image } from "antd";

function NotificationBar({ roomName }: { roomName: string }) {
  const { setIsCalling, setIsNotificationBarVisible, setRoomName } =
    usePhoneStore();
  const [isHovered, setIsHovered] = useState(false);

  const handleCall = () => {
    setIsCalling(true);
    setRoomName(roomName);
    setIsNotificationBarVisible(false);
  };

  return (
    <>
      <motion.div
        animate={
          isHovered
            ? { scale: 1, opacity: 1 }
            : {
                scale: [1, 1.03, 1],
                opacity: [1, 0.8, 1],
              }
        }
        transition={{
          duration: 1.5,
          repeat: isHovered ? 0 : Infinity,
          ease: "easeInOut",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          padding: "10px",
          width: "250px",
          height: "80px",
          fontSize: "12px",
          borderRadius: "10px",
          border: "none",
          backgroundColor: "#444444",
          color: "white",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Image
              src={callerImage}
              preview={false}
              style={{
                width: "55px",
                height: "55px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
              alt="caller"
            />
            <div className="flex flex-col">
              <p className="text-sm font-bold">IOC</p>
              <p className="text-xs">Mobile</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.div
              className="w-[30px] h-[30px] bg-red-500 rounded-full flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              onClick={() => {
                setIsCalling(false);
                setIsNotificationBarVisible(false);
              }}
            >
              <PhoneOff
                className="w-[15px] h-[15px]"
                onClick={() => setIsNotificationBarVisible(false)}
              />
            </motion.div>
            <motion.div
              className="w-[30px] h-[30px] bg-green-500 rounded-full flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              onClick={handleCall}
            >
              <Phone className="w-[15px] h-[15px]" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default NotificationBar;
