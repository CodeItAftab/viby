import { useCallback, useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { GenerateFCMToken, UpdateFCMTokenToServer } from "@/lib/firebase";
function NotificationSheet() {
  const [open, setOpen] = useState(false);

  const shouldAsk = useCallback(() => {
    const lastPrompt = window.localStorage.getItem("lastNotificationPrompt");
    if (!lastPrompt) return true;

    const lastDate = new Date(lastPrompt);
    const now = new Date();

    const diffInMs = now - lastDate;
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    return diffInDays >= 7;
  }, []);

  const updateFCMToken = useCallback(async () => {
    // check if the user has already granted permission
    let browserId = window.localStorage.getItem("browserId");
    if (!browserId) {
      browserId = crypto.randomUUID();
      window.localStorage.setItem("browserId", browserId);
    }
    const permission = Notification.permission;
    if (permission === "granted") {
      console.log("✅Permission already granted");
      // Generate FCM token and send it to the server
      const token = await GenerateFCMToken();
      UpdateFCMTokenToServer({ token, browserId });
      return;
    }
  }, []);

  const requestNotificationPermission = useCallback(async () => {
    if (!shouldAsk()) return;
    const permission = Notification.permission;
    if (permission === "granted") {
      console.log("✅Permission already granted");
      return;
    } else if (permission === "default") {
      const newPermission = await Notification.requestPermission();
      if (newPermission === "granted") {
        console.log("✅Permission granted");
        setOpen(false);
        window.localStorage.setItem("lastNotificationPrompt", new Date());
        updateFCMToken();
      } else {
        console.log("❌Permission denied");
        setOpen(false);
      }
    } else if (permission === "denied") {
      console.log("❌Permission denied");
      alert(
        "Please enable notifications in your browser settings to receive updates."
      );
      setOpen(false);
    }
  }, [updateFCMToken, shouldAsk]);

  useEffect(() => {
    updateFCMToken();
  }, [updateFCMToken]);

  useEffect(() => {
    //this will hanle the notification permission dialog when the user is logged in or once whe should ask is true
    const permission = Notification.permission;

    if ((permission === "default" || permission === "denied") && shouldAsk()) {
      setOpen(true);
    }
  }, [shouldAsk]);

  const handleCancle = useCallback(() => {
    console.log("cancelled...");
    window.localStorage.setItem("lastNotificationPrompt", new Date());
    window.localStorage.removeItem("browserId");
    setOpen(false);
  }, []);

  const handleChangeOpen = useCallback(() => {
    console.log("closedd...");
    window.localStorage.setItem("lastNotificationPrompt", new Date());
    window.localStorage.removeItem("browserId");
    setOpen((prev) => !prev);
  }, []);

  return (
    <Sheet open={open} onOpenChange={handleChangeOpen}>
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
          <Button className="w-36" variant="outline" onClick={handleCancle}>
            Cancel
          </Button>
          <Button className="w-36" onClick={requestNotificationPermission}>
            Allow
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default NotificationSheet;
