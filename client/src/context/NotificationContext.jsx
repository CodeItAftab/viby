import { createContext, useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { GenerateFCMToken } from "@/lib/firebase";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const NotificationContext = createContext(null);

const NotificationProvider = ({ children }) => {
  const [fcmToken, setFcmToken] = useState(null);
  const [open, setOpen] = useState(false);

  // const requestNotificationPermission = useCallback(async () => {
  //   if (!("Notification" in window)) return;
  //   const permission = await Notification.requestPermission();
  //   if (permission === "granted") {
  //     console.log("Notification permission granted.");
  //     const token = await GenerateFCMToken();
  //     if (token) {
  //       setFcmToken(token);
  //       console.log(fcmToken);
  //     }
  //   } else {
  //     console.error("Notification permission denied.");
  //   }
  // }, [fcmToken]);

  const shouldAsk = () => {
    const lastPrompt = window.localStorage.getItem("lastNotificationPrompt");
    console.log(lastPrompt);
    if (!lastPrompt) return true;

    const lastDate = new Date(lastPrompt);
    const now = new Date();

    const diffInMs = now - lastDate;
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    return diffInDays >= 7;
  };

  const requestNotificationPermission = useCallback(async () => {
    if (!("Notification" in window)) return;

    if (shouldAsk()) {
      localStorage.setItem("lastNotificationPrompt", new Date().toISOString());

      if (Notification.permission === "default") {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          console.log("✅ Notification permission granted.");
          const token = await GenerateFCMToken();
          if (token) {
            setFcmToken(token);
          }
        } else {
          console.warn("❌ Notification permission denied.");
          // Optionally show your modal here
          alert(
            "Notifications are disabled. To enable them, go to your browser settings."
          );
        }
      } else if (Notification.permission === "denied") {
        // User has denied — show a reminder or guide
        alert(
          "Notifications are currently blocked. You can enable them from your browser settings."
        );
      } else if (Notification.permission === "granted" && !fcmToken) {
        const token = await GenerateFCMToken();
        if (token) {
          setFcmToken(token);
        }
      }
    }
  }, [fcmToken]);
  // useEffect(() => {
  //   requestNotificationPermission();
  // });

  // ✅ Trigger modal only when user is logged in

  const timeOutRef = useRef(null);

  useEffect(() => {
    shouldAsk();

    if (
      (Notification.permission === "default" ||
        Notification.permission === "denied") &&
      shouldAsk()
    ) {
      timeOutRef.current = setTimeout(() => {
        setOpen(true);
      }, 15000);
    }

    return () => {
      clearTimeout(timeOutRef?.current);
      setOpen(false);
    };
  }, []);

  return (
    <NotificationContext.Provider value={{}}>
      {children}
      <Sheet open={open} onOpenChange={() => setOpen((open) => !open)}>
        <SheetContent showClose={false} side="bottom" className="p-8 pt-4">
          <SheetHeader className={"hidden"}>
            <SheetTitle>Push Notifications</SheetTitle>
            <SheetDescription>
              We’d love to keep you updated! Enable notifications to get alerts
              when you receive new messages — even when you&apos;re not on this
              page.
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-col items-start gap-2 mb-4 py-4">
            <h1 className="text-xl font-semibold">Push Notifications</h1>
            <p>
              We’d love to keep you updated! Enable notifications to get alerts
              when you receive new messages — even when you&apos;re not on this
              page.
            </p>
          </div>
          <div className=" flex gap-5 items-center sm:justify-start justify-center">
            <Button className="w-36" variant="outline">
              Cancel
            </Button>
            <Button className="w-36">Allow</Button>
          </div>
        </SheetContent>
      </Sheet>
    </NotificationContext.Provider>
  );
};

NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { NotificationContext, NotificationProvider };
