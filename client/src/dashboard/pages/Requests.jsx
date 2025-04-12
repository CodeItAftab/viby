import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

import img from "../../assets/image1.jpg";
import {
  RequestListItem,
  SentRequestListItem,
} from "../components/ChatListItem";
// import { useEffect } from "react";
import { useSelector } from "react-redux";
// import { FetchAllRequests, FetchAllSentRequests } from "@/redux/slices/user";
import SearchInput from "../components/SearchInput";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
// import { FetchAllRequests, FetchAllSentRequests } from "@/redux/slices/request";

function Requests() {
  const { requests, sentRequests } = useSelector((state) => state.request);

  const navigate = useNavigate();

  const NavigateToSearch = () => {
    navigate("/search");
  };

  return (
    <div className="lg:h-full h-[calc(100%-52px)] w-full bg-white  shadow-sm overflow-hidden flex items-center">
      <Tabs
        defaultValue="received"
        className="h-full w-full  lg:w-[360px] lg:bg-slate-100 flex flex-col items-center shrink-0"
      >
        <header className="w-full p-3 flex items-center justify-between">
          <h1 className="font-poppins text-xl text-slate-600 font-medium">
            Requests
          </h1>
          <TabsList className="flex items-center gap-3 bg-slate-200">
            <TabsTrigger value="received" className="w-1/2 font-poppins">
              Received
            </TabsTrigger>
            <TabsTrigger value="sent" className="w-1/2 font-poppins">
              Sent
            </TabsTrigger>
          </TabsList>
        </header>
        <SearchInput />
        <ScrollArea className="w-full flex-grow py-3">
          <TabsContent value="received" className="h-full w-full p-0">
            <ul className="w-full px-4  flex flex-col gap-2 items-center">
              {requests?.map((request) => {
                const user = { ...request?.sender, requestId: request?._id };
                return <RequestListItem key={user._id} user={user} />;
              })}

              {requests.length == 0 && (
                <div className="flex flex-col items-center justify-center gap-4">
                  <span className="text-muted-foreground mt-10 text-sm">
                    No Request Found
                  </span>
                  <Button
                    variant="outline"
                    className="w-44"
                    onClick={NavigateToSearch}
                  >
                    Find Friends
                  </Button>
                </div>
              )}
            </ul>
          </TabsContent>
          <TabsContent value="sent" className="h-full w-full p-0">
            <ul className="w-full px-4  flex flex-col gap-2 items-center">
              {sentRequests?.map((request) => {
                const user = { ...request?.receiver, requestId: request?._id };
                return <SentRequestListItem key={user._id} user={user} />;
              })}

              {sentRequests.length == 0 && (
                <div className="flex flex-col items-center justify-center gap-4">
                  <span className="text-muted-foreground mt-10 text-sm">
                    No Request Found
                  </span>
                  <Button
                    variant="outline"
                    className="w-44"
                    onClick={NavigateToSearch}
                  >
                    Find Friends
                  </Button>
                </div>
              )}
            </ul>
          </TabsContent>
        </ScrollArea>
      </Tabs>
      <div className="h-full flex-grow hidden lg:flex flex-col items-center justify-center p-4 shrink-0">
        <div>
          <img src={img} alt="image" className="h-[400px]" />
        </div>
        <h1 className="text-2xl text-blue-500 font-medium mb-12">
          Select a chat to start new conversation
        </h1>
      </div>
    </div>
  );
}

export default Requests;
