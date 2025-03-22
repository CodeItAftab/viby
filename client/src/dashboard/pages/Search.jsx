import { ScrollArea } from "@/components/ui/scroll-area";
import img from "../../assets/image5.jpg";
import {
  FriendListItem,
  RequestListItem,
  SearchListItem,
  SentRequestListItem,
} from "../components/ChatListItem";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FetchAllUsers } from "@/redux/slices/user";
import SearchInput from "../components/SearchInput";

function Search() {
  const dispatch = useDispatch();

  const { users } = useSelector((state) => state.user);
  useEffect(() => {
    document.title = "Search";
    dispatch(FetchAllUsers());
  }, [dispatch]);

  return (
    <div className="h-full w-full bg-white shadow-sm overflow-hidden flex items-center">
      <div className="h-full lg:w-[360px] w-full lg:bg-slate-100 bg:white flex flex-col items-center shrink-0">
        <header className="w-full px-3 py-4 flex items-center justify-between">
          <h1 className="font-poppins text-xl text-slate-600 font-medium">
            Seach People
          </h1>
        </header>
        <SearchInput />
        <ScrollArea className="w-full flex-grow py-3">
          <ul className="w-full px-4 py-2 flex flex-col gap-2 items-center">
            {users?.map((user) => {
              if (user.isFriend)
                return <FriendListItem key={user._id} user={user} />;
              else if (user.isSentRequest)
                return <SentRequestListItem key={user._id} user={user} />;
              else if (user?.isReceivedRequest)
                return <RequestListItem key={user._id} user={user} />;
              else return <SearchListItem key={user._id} user={user} />;
            })}
          </ul>
        </ScrollArea>
      </div>
      <div className="h-full flex-grow hidden lg:flex flex-col items-center justify-center p-4 shrink-0">
        <div>
          <img src={img} alt="image" className="h-[400px]" />
        </div>
        <h1 className="text-xl text-blue-500 font-medium mb-12">
          Discover connections, find friends, and explore conversations!
        </h1>
      </div>
    </div>
  );
}

export default Search;
