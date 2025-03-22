import { ScrollArea } from "@/components/ui/scroll-area";
import img from "../../assets/image4.jpg";
import { FriendListItem } from "../components/ChatListItem";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { FetchAllFriends } from "@/redux/slices/user";
import SearchInput from "../components/SearchInput";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { setOpenCreateGroupModal } from "@/redux/slices/app";

function Friends() {
  const { friends } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  useEffect(() => {
    document.title = "Friends";
    // dispatch(FetchAllFriends());
    // }, [dispatch]);
  }, []);

  return (
    <div className="h-full w-full bg-white  shadow-sm overflow-hidden flex items-center">
      <Tabs
        defaultValue="friends"
        className="h-full w-full lg:w-[360px] lg:bg-slate-100 flex flex-col items-center shrink-0"
      >
        <header className="w-full px-3 py-4 flex items-center justify-between">
          <h1 className="font-poppins text-xl text-slate-600 font-medium">
            Friends
          </h1>
          <TabsList className="flex items-center gap-3 bg-slate-200">
            <TabsTrigger value="friends" className="w-1/2 font-poppins">
              Friends
            </TabsTrigger>
            <TabsTrigger value="groups" className="w-1/2 font-poppins">
              Groups
            </TabsTrigger>
          </TabsList>
        </header>
        <SearchInput />
        <ScrollArea className="w-full flex-grow py-3">
          <TabsContent value="friends" className="h-full w-full p-0">
            <ul className="w-full px-4 py-2 flex flex-col gap-2 items-center">
              {friends?.map((friend) => (
                <FriendListItem key={friend._id} user={friend} />
              ))}

              {friends.length === 0 && (
                <span className="text-muted-foreground mt-10 text-sm">
                  No Friends Found
                </span>
              )}
            </ul>
          </TabsContent>
          <TabsContent value="groups" className="h-full w-full p-0">
            <ul className="w-full px-4 py-2 flex flex-col gap-2 items-center">
              <div className="flex flex-col items-center justify-center gap-4">
                <span className="text-muted-foreground mt-10 text-sm">
                  No Groups Found
                </span>
                <Button
                  variant="outline"
                  onClick={() => {
                    // console.log("Create Group");
                    dispatch(setOpenCreateGroupModal(true));
                  }}
                >
                  Create Group
                </Button>
              </div>
            </ul>
          </TabsContent>
        </ScrollArea>
      </Tabs>
      <div className="h-full flex-grow hidden lg:flex flex-col items-center justify-center p-4 shrink-0">
        <div>
          <img src={img} alt="image" className="h-[400px]" />
        </div>
        <h1 className="text-2xl text-blue-500 font-medium mb-12">
          Chat. Connect. Cherish. Your friends, just a tap away!
        </h1>
      </div>
    </div>
  );
}

export default Friends;
