import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenCreateGroupModal } from "@/redux/slices/app";
import { IconButton } from "@mui/material";
import { GroupMemberSelectItem } from "./ChatListItem";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { X } from "@phosphor-icons/react";
import toast from "react-hot-toast";
import { CreateGroup } from "@/redux/slices/chat";
import { ArrowLeft } from "phosphor-react";

function CreateGroupModal() {
  const [tab, setTab] = useState(1);
  const [avatar, setAvatar] = useState(null);
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const { openCreateGroupModal } = useSelector((state) => state.app);
  const { friends } = useSelector((state) => state.user);
  const { isLoading } = useSelector((state) => state.chat);

  const dispatch = useDispatch();

  const handleSelectAndDeselect = (id) => {
    if (selectedMembers.includes(id)) {
      setSelectedMembers((prev) => prev.filter((item) => item !== id));
    } else {
      setSelectedMembers((prev) => [...prev, id]);
    }
  };

  const handleContinue = () => {
    // Check members length and show error if less than 2
    if (selectedMembers.length < 2) {
      toast.error("Please select at least 2 members to create a group");
      return;
    }
    setTab(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if atleast 2 members are selected and show error if not
    if (selectedMembers.length < 2) {
      toast.error("Please select at least 2 members to create a group");
      return;
    }

    // Check group name and show error if empty
    if (!groupName) {
      toast.error("Please enter a group name");
      return;
    }

    const data = {
      members: selectedMembers,
      name: groupName,
      avatar,
    };
    // Dispatch create group action
    const response = await dispatch(CreateGroup(data));
    if (response.payload.success) {
      toast.success("Group created successfully");
      setGroupName("");
      setAvatar(null);
      setSelectedMembers([]);
      setTab(1);
      dispatch(setOpenCreateGroupModal(false));
    }
  };

  return (
    <Dialog
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
                  key={friend?._id}
                  user={friend}
                  selected={selectedMembers.includes(friend?._id)}
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
    </Dialog>
  );
}

export default CreateGroupModal;
