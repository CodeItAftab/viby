/* eslint-disable react/prop-types */
import { Check, Checks, X } from "phosphor-react";
import { getFromattedDate } from "../../utils/date";
// import AvatarWithoutStatus from "./AvatarWithoutStatus";
import { forwardRef, useRef, useState } from "react";
import { Link } from "react-router-dom";
// import { useEffect, useRef } from "react";
// import { InView } from "react-intersection-observer";
// import { useSelector } from "react-redux";
// import { readIndividualMessage } from "@/redux/slices/chat";
// import { READ_MESSAGE } from "@/constants/event";
// import { useSocket } from "@/hooks/useSocket";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// import AvatarWithoutStatus from "./AvatarWithoutStatus";
import { MagnifyingGlassMinus } from "@phosphor-icons/react/dist/ssr";
import { CloudArrowDown, MagnifyingGlassPlus } from "@phosphor-icons/react";
// import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { IconButton } from "@mui/material";
// import { makeMessageViewdById } from "@/redux/slices/chat";

const MessageItem = forwardRef(function MessageItem({ message }, ref) {
  switch (message?.type) {
    case "text":
      return <TextMessage message={message} />;
    case "media":
      return <ImageMessage message={message} />;
    case "date":
      return <DateStamp date={message.date} ref={ref} />;
  }
});

// const TextMessage = ({ message }) => {
//   // const { socket } = useSocket();
//   // const dispatch = useDispatch();

//   return (
//     // <li
//     //   className={`text-message bg-green--400 flex gap-3 h-fit w-fit max-h-[900px] max-w-[95%] shrink-0   ${
//     //     message?.isSender && "self-end"
//     //   }`}
//     //   id={message?.isFirstUnread ? "first_unread" : ""}
//     // >
//     //   <div className="flex flex-col">
//     //     {/* <div className="text-wrap max-height-[600px] text-center "> */}
//     //     <div className="text-wrap max-height-[600px] text-center w-full lg:max-w-[600px] max-w-[400px]">
//     //       <p
//     //         className={`message   flex justify-center text-base leading-normal tracking-wider break-all  px-3 py-1 rounded-full   max-h-[600px]  w-full lg:max-w-[600px] max-w-[400px] text-wrap   ${
//     //           message?.isSender
//     //             ? "bg-[#4853ee] text-white   order-2"
//     //             : `bg-slate-200/60  text-black `
//     //         }`}
//     //       >
//     //         {message.content}
//     //       </p>
//     //     </div>
//     //     <div
//     //       className={
//     //         "flex gap-1 w-full h-5 items-center justify-end" +
//     //         (message?.isSender ? "" : "justify-start")
//     //       }
//     //     >
//     //       {message.isSender && (
//     //         <span className="flex items-center justify-center">
//     //           {message.state === "read" && (
//     //             <Checks
//     //               size={16}
//     //               color="#1976d2"
//     //               className="self-end text-slate-500"
//     //             />
//     //           )}
//     //           {message.state === "delivered" && (
//     //             <Checks size={16} className="self-end text-slate-500" />
//     //           )}
//     //           {message.state === "sent" && (
//     //             <Check size={16} className="self-end text-slate-500" />
//     //           )}
//     //         </span>
//     //       )}
//     //       <span className={`time-stamp  text-[9px] leading-none`}>
//     //         {new Date(message.createdAt).toLocaleString("en-US", {
//     //           hour: "numeric",
//     //           minute: "numeric",
//     //           hour12: true,
//     //         })}
//     //       </span>
//     //     </div>
//     //   </div>
//     //   {/* </li> */}
//     // </li>

//   );
// };

const TextMessage = ({ message }) => {
  const isMultiLineMessage = message?.content?.length > 32;
  return (
    <div
      className={`${
        message?.sameSender
          ? "rounded-sm"
          : message?.isSender
          ? "chat-bubble-right mt-3 rounded-l-md rounded-b-md"
          : "chat-bubble-left mt-3 rounded-r-md rounded-b-md"
      } ${
        message?.isSender && "self-end"
      }  relative min-w-16 h-fit w-fit max-w-[320px]  shrink-0  bg-slate-200  `}
    >
      <p
        className={`w-fit text-base inline-block  ${
          isMultiLineMessage ? "pt-1" : "py-[6px]"
        } px-2 overflow-ellipsis break-all `}
      >
        {/* Lorem ipsum dolor sit Lorem Lore Lorem ipsum dolor sit amet consectetur
        adipisicing elit. Voluptatem, dolorem. */}
        {message.content}
      </p>
      <span
        className={`float-right relative inline-block ${
          isMultiLineMessage ? "mt-0 mb-[2px]" : "mt-[11px]"
        }  self-end h-5 w-[72px] shrink-0 bg-rded-200`}
      >
        <div className="h-full  w-full flex items-center justify-center pr-1 gap-1 flex-shrink-0">
          <span className="text-[10px] relative ">
            {message?.createdAt &&
              new Date(message?.createdAt).toLocaleString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
          </span>
          {message?.isSender && (
            <span className="flex items-center justify-center">
              {message?.state === "read" && (
                <Checks
                  size={16}
                  color="#1976d2"
                  className="self-end text-slate-500"
                />
              )}
              {message?.state === "delivered" && (
                <Checks size={16} className="self-end text-slate-500" />
              )}
              {message?.state === "sent" && (
                <Check size={16} className="self-end text-slate-500" />
              )}
            </span>
          )}
        </div>
      </span>
    </div>
  );
};

const ImageMessage = ({ message }) => {
  const isMultiLineMessage = message?.content?.length > 20;
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  // const [imageName, setImageName] = useState("image");
  const [selecteImageIndex, setSelectedImageIndex] = useState(0);

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const imgRef = useRef(null);
  const containerRef = useRef(null);

  const handleOpen = (imageUrl) => {
    if (open) {
      setOpen(false);
      setZoomLevel(1);
      setSelectedImage(null);
      setSelectedImageIndex(0);
      setZoomLevel(1);
      setPosition({ x: 0, y: 0 });
      return;
    }

    setSelectedImage(imageUrl);
    setOpen(true);
    setZoomLevel(1);

    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });

    // Extract file name from Cloudinary URL
    const urlParts = imageUrl.split("/");
    let fileName = urlParts[urlParts.length - 1].split("?")[0]; // Remove query params

    // If Cloudinary adds versioning (v1234), remove it
    if (fileName.startsWith("v")) {
      fileName =
        urlParts[urlParts.length - 2] + "." + fileName.split(".").pop();
    }

    // setImageName(fileName || "image.jpg");
  };

  const zoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.2, 3));
  const zoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.2, 0.5));

  const handleDoubleClick = () => {
    setZoomLevel((prev) => (prev === 1 ? 2 : 1));
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({ x: e.clientX - startPos.x, y: e.clientY - startPos.y });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY
      );
      imgRef.current.startDistance = distance;
      imgRef.current.startZoom = zoomLevel;
    } else if (e.touches.length === 1 && zoomLevel > 1) {
      setIsDragging(true);
      setStartPos({
        x: e.touches[0].pageX - position.x,
        y: e.touches[0].pageY - position.y,
      });
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && imgRef.current.startDistance) {
      const newDistance = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY
      );
      const scale =
        (newDistance / imgRef.current.startDistance) * imgRef.current.startZoom;
      setZoomLevel(Math.max(1, Math.min(3, scale)));
    } else if (e.touches.length === 1 && isDragging) {
      setPosition({
        x: e.touches[0].pageX - startPos.x,
        y: e.touches[0].pageY - startPos.y,
      });
    }
  };

  const handleTouchEnd = () => setIsDragging(false);

  const handleDownload = async () => {
    if (!selectedImage) return;

    try {
      // Fetch the image and convert it to a Blob
      const response = await fetch(selectedImage);
      const blob = await response.blob();

      // Create a Blob URL
      const blobUrl = URL.createObjectURL(blob);

      const extension = selectedImage.split(".").pop().split("?")[0] || "jpg";
      const fileName = `VibyChat_${
        new Date(message?.createdAt).getTime() + selecteImageIndex
      }.${extension}`;

      // Create a download link
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Release memory
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  return (
    <>
      {message.attachments.map((attachment, index) => (
        <div
          key={index}
          className={`${
            message?.sameSender && index === 0
              ? "rounded-sm"
              : message?.isSender
              ? "chat-bubble-right mt-3 rounded-l-md rounded-b-md"
              : "chat-bubble-left mt-3 rounded-r-md rounded-b-md"
          } ${
            message?.isSender && "self-end"
          } relative flex flex-col min-h-[140px] h-fit w-fit max-w-[240px] shrink-0 bg-slate-200`}
        >
          <div
            className="h-full w-full cursor-pointer"
            onClick={() => {
              setSelectedImage(attachment?.url || attachment?.preview);
              setSelectedImageIndex(index);
              setOpen(true);
            }}
          >
            <div className="relative overflow-hidden h-full w-full rounded-md border-4 shadow-[2px] border-slate-200/60">
              <img
                key={index}
                src={attachment?.url || attachment?.preview}
                alt="preview"
                loading="lazy"
                className="w-full h-full object-cover rounded-md"
              />
              <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/35 to-transparent pointer-events-none rounded-md"></div>
            </div>
            {(!message?.content ||
              (message?.content &&
                index !== message.attachments.length - 1)) && (
              <span className="absolute inline-block bottom-1 right-0 h-5 w-[72px]">
                <div className="h-full w-full flex items-center justify-center pr-1 gap-1 flex-shrink-0">
                  <span className="text-[10px] text-white relative">
                    {message?.createdAt &&
                      new Date(message?.createdAt).toLocaleString("en-US", {
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      })}
                  </span>
                  {message?.isSender && (
                    <span className="flex items-center justify-center">
                      {message?.state === "read" && (
                        <Checks
                          size={16}
                          color="#1976d2"
                          className="self-end text-slate-500"
                        />
                      )}
                      {message?.state === "delivered" && (
                        <Checks size={16} className="self-end text-slate-500" />
                      )}
                      {message?.state === "sent" && (
                        <Check size={16} className="self-end text-slate-500" />
                      )}
                    </span>
                  )}
                </div>
              </span>
            )}
          </div>
          {message?.content && (
            <div>
              <p
                className={`w-fit text-base inline-block pb-1  px-2 overflow-ellipsis break-all `}
              >
                {message.content}
              </p>
              <span
                className={`float-right relative inline-block ${
                  isMultiLineMessage ? "mt-0 mb-[2px]" : "mt-[8px]"
                }  self-end h-4 w-[72px] shrink-0 bg-rded-200`}
              >
                <div className="h-full  w-full flex items-center justify-center pr-1 gap-1 flex-shrink-0">
                  <span className="text-[10px] relative ">
                    {new Date(message?.createdAt).toLocaleString("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    })}
                  </span>
                  {message?.isSender && (
                    <span className="flex items-center justify-center">
                      {message?.state === "read" && (
                        <Checks
                          size={16}
                          color="#1976d2"
                          className="self-end text-slate-500"
                        />
                      )}
                      {message?.state === "delivered" && (
                        <Checks size={16} className="self-end text-slate-500" />
                      )}
                      {message?.state === "sent" && (
                        <Check size={16} className="self-end text-slate-500" />
                      )}
                    </span>
                  )}
                </div>
              </span>
            </div>
          )}
        </div>
      ))}

      <Dialog
        className="rounded-none outline-none"
        open={open}
        onOpenChange={handleOpen}
      >
        {/* <DialogTrigger className="rounded-none flex items-center justify-center"></DialogTrigger> */}
        <DialogContent className="w-full h-full p-0 shadow-none border-none   rounded-none sm:rounded-none outline-none bg-transparent/15  max-w-full ">
          <DialogHeader className={"hidden"}>
            <DialogTitle>Image Preview</DialogTitle>
            <DialogDescription>
              This is the full view of the image
            </DialogDescription>
          </DialogHeader>
          <div className="h-full w-full overflow-hidden flex flex-col ">
            <div className="w-full h-12 bg-black flex items-center justify-between">
              <IconButton
                className="justify-self-start flex items-center justify-center"
                onClick={handleOpen}
                sx={{ marginLeft: "1rem" }}
              >
                <X size={20} color="white" />
              </IconButton>
              <div className="h-full px-8 flex items-center gap-3 ">
                <div
                  className=" h-9 w-9 border-white/15 border-[2px] hover:bg-white/15 active:bg-white/25 rounded-md flex items-center justify-center gap-2 cursor-pointer"
                  onClick={zoomOut}
                >
                  <MagnifyingGlassMinus
                    size={20}
                    weight="regular"
                    className="cursor-pointer text-white"
                  />
                </div>
                <div
                  className=" h-9 w-9 border-white/15 border-[2px] hover:bg-white/15 active:bg-white/25 rounded-md flex items-center justify-center gap-2 cursor-pointer"
                  onClick={zoomIn}
                >
                  <MagnifyingGlassPlus
                    size={20}
                    weight="regular"
                    className="cursor-pointer text-white"
                  />
                </div>
                <div>
                  <Button
                    variant="outline"
                    className="px-2 h-8 mx-2 rounded-sm"
                    onClick={handleDownload}
                  >
                    <CloudArrowDown size={18} />
                    {/* <span className="text-sm font-medium">Save</span> */}
                  </Button>
                </div>
              </div>
            </div>
            <div
              className="flex-grow flex items-center justify-center overflow-hidden"
              onClick={handleOpen}
            >
              <div
                className="sm:h-[95%] sm:w-[80%] h-[98%] w-full  flex items-center justify-center overflow-hidden"
                ref={containerRef}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <img
                  className="object-contain max-h-[95%]  select-none "
                  src={selectedImage}
                  ref={imgRef}
                  alt="image"
                  draggable="false"
                  // style={{
                  //   transform: `scale(${zoomLevel})`,
                  //   cursor: zoomLevel > 1 ? "grab" : "pointer",
                  // }}
                  style={{
                    transform: `scale(${zoomLevel}) translate(${position.x}px, ${position.y}px)`,
                    cursor: zoomLevel > 1 ? "grab" : "pointer",
                    transition: isDragging ? "none" : "transform 0.2s ease-out",
                  }}
                  onMouseDown={handleMouseDown}
                  onDoubleClick={handleDoubleClick}
                  onTouchStart={handleTouchStart}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export const LinkMessage = () => {
  return (
    <li
      className={`text-message flex flex-col items-center px-2 py-2 bg-[#2d61f0ed]  h-36 max-h-fit w-80 max-w-[95%] rounded-sm shrink-0 self-end  `}
    >
      <Link
        to={"https://www.youtube.com/watch?v=MejbOFk7H6c"}
        target="_blank"
        className="link-preview-box h-20 w-full flex bg-white hover:shadow-sm rounded-sm cursor-pointer "
      >
        <div className="previewImage h-20 w-20 overflow-hidden rounded-sm shrink-0">
          <img
            src="https://i.ytimg.com/vi/MejbOFk7H6c/maxresdefault.jpg"
            alt="preview"
            className="h-full object-cover rounded-t-sm"
          />
        </div>
        <div className="LinkDescription h-full flex-grow flex flex-col  justify-center p-2 box-border">
          <p className="link-title text-sm leading-normal tract-wider">
            {"OK Go - Needing/Getting - Official Video".substring(0, 25) +
              "..."}
          </p>
          <p className="text-xs text-slate-500">
            {`https://linktr.ee/okgomusic Website | http://www.okgo.netInstagram |
            http://www.instagram.com/okgoTwitter |
            http://www.twitter.com/okgoFacebook | http://www....`.substring(
              0,
              35
            ) + "..."}
          </p>
          <span className="hostname text-xs text-slate-400 mt-1 ">
            {new URL("https://www.youtube.com/watch?v=MejbOFk7H6c").hostname}
          </span>
        </div>
      </Link>
      <Link
        to={"https://www.youtube.com/watch?v=MejbOFk7H6c"}
        target="_blank"
        className="hover:underline w-full h-12 inline-flex items-center"
      >
        <span className="text-sm  text-wrap hover:underline text-white leading-normal">
          https://www.youtube.com/watch?v=MejbOFk7H6c
        </span>
      </Link>
    </li>
  );
};

const DateStamp = forwardRef(function DateStamp({ date }, ref) {
  return (
    <li
      className="date-stamp my-8 shrink-0 flex justify-center items-center w-full h-4 gap-2"
      ref={ref}
    >
      <div className="h-[1px] border-[1px] sm:w-[20%] w-[40%] bg-slate-200"></div>
      <span className="date-stamp-text text-[12px] leading-none bg-slate-200 font-semibold w-20  text-slate-900 h-6 flex items-center justify-center  px-2 rounded-sm">
        {date && getFromattedDate(new Date(date))}
      </span>
      <div className="h-[1px] border-[1px]  sm:w-[20%] w-[40%] bg-slate-200"></div>
    </li>
  );
});

export default MessageItem;
