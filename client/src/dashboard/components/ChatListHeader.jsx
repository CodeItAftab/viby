// import { ListFilter } from "lucide-react";
import { memo, useState } from "react";
import { IconButton } from "@mui/material";
import { ArrowLeft, DotsThreeVertical, UsersThree } from "phosphor-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ChatsCircle, UserCircle } from "@phosphor-icons/react/dist/ssr";

import { useDispatch } from "react-redux";
import { setOpenCreateGroupModal } from "@/redux/slices/app";
import { useNavigate } from "react-router-dom";

function ChatListHeader() {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  return (
    // <header className="w-full lg:p-4 my-1  lg:pl-3 lg:pr-3 px-3 flex items-center justify-between">
    //   <h1 className="lg:font-poppins lg:text-xl text-sm text-[#1976d4] font-medium">
    //     All Chats
    //   </h1>
    //   <div className="flex items-center gap-3">
    //     {/* <div className="h-8 w-8 flex items-center justify-center cursor-pointer active:bg-slate-300 rounded-full hover:bg-slate-200">
    //       <SquarePen size={20} color="#1976d4" />
    //     </div> */}
    //     <div className="h-6 w-6 flex items-center justify-center cursor-pointer active:bg-slate-300 rounded-full hover:bg-slate-200">
    //       <ListFilter color="#1976d4" className="lg:w-5 lg:h-5 w-4 h-4" />
    //     </div>
    //   </div>
    // </header>
    <header className="w-full pl-3 py-3 flex items-center justify-between">
      <h1 className="font-poppins text-xl text-[#1976d4] font-medium">
        All Chats
      </h1>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <IconButton>
            <DotsThreeVertical color="black" size={24} />
          </IconButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="relative right-4">
          <DropdownMenuItem
            className="flex items-center"
            onClick={() => dispatch(setOpenCreateGroupModal(true))}
          >
            <UsersThree size={28} />
            <span className="text-sm">New Group</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center"
            onClick={() => {
              navigate("/friends");
            }}
          >
            <ChatsCircle size={28} />
            <span className="text-sm">New Chat</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center">
            <UserCircle size={28} />
            <span className="text-sm">My profile</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* <Dialog
        open={openCreateGroupModal}
        onOpenChange={() =>
          dispatch(setOpenCreateGroupModal(!openCreateGroupModal))
        }
        className="p-0 m-0 h-full w-full"
      >
        <DialogContent className="md:w-[480px] overflow-hidden flex flex-col items-start md:h-[600px] h-full w-full outline-none focus-visible:outline-none  ">
          <DialogHeader className="w-full flex flex-row items-center justify-between">
            {tab == 1 && (
              <div className="flex flex-col items-start gap-1">
                <DialogTitle>Add Members</DialogTitle>
                <DialogDescription className="text-sm">
                  Select members to add to the group
                </DialogDescription>
              </div>
            )}
            {tab == 2 && (
              <IconButton sx={{ alignSelf: "start" }} onClick={() => setTab(1)}>
                <ArrowLeft size={24} />
              </IconButton>
            )}
            <IconButton
              sx={{ marginBottom: "0.5rem" }}
              onClick={() => dispatch(setOpenCreateGroupModal(false))}
            >
              <X size={24} />
            </IconButton>
          </DialogHeader>
          <div className={`flex w-full flex-grow relative `}>
            <div
              className={`h-full px-2 w-full flex flex-col items-center shrink-0 transition-all ease-in-out bg-white absolute top-0 ${
                tab === 1 ? "left-0" : "left-[-600px]"
              }`}
            >
              <ScrollArea className="flex flex-col gap-2 w-full h-full py-2 ">
                {friends?.map((friend) => (
                  <GroupMemberSelectItem
                    key={friend._id}
                    user={friend}
                    selected={selectedMembers.includes(friend._id)}
                    onSelect={handleSelectAndDeselect}
                  />
                ))}
              </ScrollArea>
              <Button className="w-full mb-2" onClick={() => handleContinue()}>
                Continue
              </Button>
            </div>
            <div
              className={`h-full px-2 w-full flex flex-col items-center shrink-0 transition-all ease-in-out bg-white absolute top-0 ${
                tab === 2 ? "left-0 mb-4" : "left-[600px]"
              }`}
            >
              <form
                className="w-full lg:px-0 px-2 py-4 flex flex-col  items-center gap-4"
                onSubmit={handleSubmit}
              >
                <div className="h-44 w-44 relative">
                  <label
                    htmlFor="avatar"
                    className="h-44 w-44 rounded-full cursor-pointer relative border-2 overflow-hidden bg-slate-100 flex items-center justify-center"
                  >
                    {avatar && (
                      <img
                        src={URL.createObjectURL(avatar)}
                        alt="avatar"
                        className={`object-cover object-center h-full ${
                          avatar ? "bg-white" : ""
                        }`}
                      />
                    )}
                  </label>
                  <label
                    htmlFor="avatar"
                    className="h-8 w-8 rounded-full z-20 flex items-center justify-center bg-blue-500 cursor-pointer absolute right-2 bottom-2"
                  >
                    <Pencil size={16} color="white" />
                  </label>
                </div>
                <div className="w-full flex flex-col gap-3 py-2 mt-4">
                  <input
                    type="file"
                    name="avatar"
                    id="avatar"
                    className="hidden"
                    max={1}
                    onChange={(e) => setAvatar(e.target.files[0])}
                  />
                  <Label
                    htmlFor="groupName"
                    className="text-base font-normal leading-normal tracking-wide"
                  >
                    Group Name
                  </Label>
                  <Input
                    id="groupName "
                    name="groupName"
                    className="w-full resize-none"
                    placeholder="Enter your group name here"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                  />
                </div>
              </form>
              <Button
                className="w-full mb-2"
                disabled={isLoading}
                onClick={handleSubmit}
              >
                {isLoading && <Loader2 className="animate-spin" />}
                {isLoading ? "Please wait" : "Create Group"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog> */}
    </header>
  );
}

export default memo(ChatListHeader);
