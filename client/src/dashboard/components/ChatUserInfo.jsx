import AvatarWithoutStatus from "./AvatarWithoutStatus";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import { VideoCamera, X } from "@phosphor-icons/react";
import { Phone } from "phosphor-react";
import { IconButton } from "@mui/material";
import { AnimatePresence, motion } from "motion/react";
import { memo } from "react";
import { useSelector } from "react-redux";

ChatUserInfo.propTypes = {
  setShowUserInfo: PropTypes.func.isRequired,
};

function ChatUserInfo({ setShowUserInfo }) {
  const { selectedUser } = useSelector((state) => state.chat);

  return (
    <AnimatePresence>
      <motion.div
        className="h-full md:w-[480px] w-full  bg-white border-l-[1px] relative z-50"
        initial={{ right: -480 }}
        animate={{ right: 0 }}
        exit={{ right: -480, transition: { duration: 0 } }}
      >
        <header className="h-14 w-full  flex items-center justify-between px-3   shrink-0 messagebox-header">
          <IconButton onClick={() => setShowUserInfo(false)}>
            <X size={20} color="black" />
          </IconButton>
        </header>
        <main>
          <div className="avatarContainer h-48 w-48 bg-black/30 rounded-full mx-auto">
            <AvatarWithoutStatus url={selectedUser?.avatar} />
          </div>
          <div className="UserName text-center mt-4">
            <h1 className="text-lg uppercase font-semibold">
              {selectedUser?.name}
            </h1>
          </div>
          <div className="callButtons w-full flex gap-4 justify-center mt-4">
            <Button variant="outline" className="">
              <Phone size={20} color="black" weight="fill" />
              Audio
            </Button>
            <Button variant="outline" className="">
              <VideoCamera size={20} color="black" weight="fill" />
              Video
            </Button>
          </div>
          <div className="userInfo p-8 flex flex-col gap-4">
            <div className="userEmail leading-normal   flex flex-col ">
              <span className="leading-normal text-black/60 uppercase text-base">
                Bio
              </span>
              <p className="font-normal">{selectedUser?.bio}</p>
            </div>
            <div className="userEmail leading-normal   flex flex-col ">
              <span className="leading-normal text-black/60 uppercase text-base">
                Email
              </span>
              <p className="font-normal">{selectedUser?.email}</p>
            </div>
            <div className="userEmail leading-normal   flex flex-col ">
              <span className="leading-normal text-black/60 uppercase text-base">
                Joined
              </span>
              <p className="font-normal">
                {new Date(selectedUser?.joined).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="blockOrExit text-center">
            <Button className="bg-red-100 border-red-600/30 border-[1px] hover:bg-red-200 text-red-500 w-28 rounded-full">
              Block
            </Button>
          </div>
        </main>
      </motion.div>
    </AnimatePresence>
  );
}
// function ChatUserInfo() {
//   return (
//     <div className="h-full md:w-[480px] w-full bg-white border-l-[1px]">
//       <header className="h-14 w-full  flex items-center justify-between px-3   shrink-0 messagebox-header">
//         <X size={20} color="black" />
//       </header>
//       <main>
//         <div className="avatarContainer h-48 w-48 bg-black/30 rounded-full mx-auto">
//           <AvatarWithoutStatus />
//         </div>
//         <div className="UserName text-center mt-4">
//           <h1 className="text-lg uppercase font-semibold">Aftab Alam</h1>
//         </div>
//         <div className="callButtons w-full flex gap-4 justify-center mt-4">
//           <Button variant="outline" className="">
//             <Phone size={20} color="black" weight="fill" />
//             Audio
//           </Button>
//           <Button variant="outline" className="">
//             <VideoCamera size={20} color="black" weight="fill" />
//             Video
//           </Button>
//         </div>
//         <div className="userInfo p-8 flex flex-col gap-4">
//           <div className="userEmail leading-normal   flex flex-col ">
//             <span className="leading-normal text-black/60 uppercase text-base">
//               Bio
//             </span>
//             <p className="font-normal">This is my bios...</p>
//           </div>
//           <div className="userEmail leading-normal   flex flex-col ">
//             <span className="leading-normal text-black/60 uppercase text-base">
//               Email
//             </span>
//             <p className="font-normal">aftabalamdlm@gmail.com</p>
//           </div>
//           <div className="userEmail leading-normal   flex flex-col ">
//             <span className="leading-normal text-black/60 uppercase text-base">
//               Joined
//             </span>
//             <p className="font-normal">{new Date().toDateString()}</p>
//           </div>
//         </div>
//         <div className="blockOrExit text-center">
//           <Button className="bg-red-100 border-red-600/30 border-[1px] hover:bg-red-200 text-red-500 w-28 rounded-full">
//             Block
//           </Button>
//         </div>
//       </main>
//     </div>
//   );
// }

export default memo(ChatUserInfo);
