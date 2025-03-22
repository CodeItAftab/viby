// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NavLink, useParams } from "react-router-dom";
import {
  Chats,
  ChatsTeardrop,
  Gear,
  MagnifyingGlass,
  // Power,
  SignOut,
  UserPlus,
  Users,
} from "@phosphor-icons/react";
import { IconButton, Switch } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { LogoutUser } from "@/redux/slices/auth";
import AvatarWithoutStatus from "./AvatarWithoutStatus";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { Separator } from "@/components/ui/separator";

import {
  Sheet,
  SheetContent,
  // SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GearSix, MoonStars, Question } from "phosphor-react";

const menu = [
  { Icon: Chats, link: "/" },
  {
    Icon: Users,
    link: "/friends",
  },
  {
    Icon: UserPlus,
    link: "/requests",
  },
  {
    Icon: MagnifyingGlass,
    link: "/search",
  },
  {
    Icon: Gear,
    link: "/settings",
  },
];

function Navbar() {
  const dispatch = useDispatch();
  // const { selectedChatId } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.user);
  const { chatId } = useParams();

  return (
    <nav
      className={
        "lg:h-full lg:w-[72px] h-12 w-full lg:bg-sky-200- border-r-[1px] lg:shadow-sm z-10 bg-white shrink-0 flex lg:flex-col items-center justify-between gap-32 lg:py-1 lg:pl-2 px-2" +
        (chatId ? " chats-container-hide" : "")
        // (selectedChatId ? " chats-container-hide" : "")
      }
    >
      <header className="h-12 w-12 flex items-center justify-center lg:mx-auto">
        <ChatsTeardrop size={32} color="#1976d4" weight="fill" />
      </header>
      <ul className="w-14 lg:flex hidden lg:flex-col gap-4 items-center bg-white py-4 rounded-xl shadow-sm">
        {menu.map(({ Icon, link }) => (
          <NavLink to={link} key={link}>
            {({ isActive }) =>
              isActive ? (
                <div className="h-10 w-10 flex items-center justify-center cursor-pointer active:bg-slate-300 rounded-full hover:bg-slate-200">
                  <Icon size={28} color="#1976d4" weight="fill" />
                </div>
              ) : (
                <div className="h-10 w-10 flex items-center justify-center cursor-pointer active:bg-slate-300 rounded-full hover:bg-slate-200">
                  <Icon size={28} color="black" />
                </div>
              )
            }
          </NavLink>
        ))}
      </ul>
      <footer className="lg:h-20 lg:w-14 h-10 w-10 flex items-center justify-center">
        <div className="h-full w-full hidden lg:flex items-center justify-center">
          <DropdownMenu className="ml-4">
            <DropdownMenuTrigger className="border-none  outline-none focus:outline-none">
              <IconButton size="small" className="nav-user-button">
                <Avatar className="h-8 w-8 border-2">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback>User</AvatarFallback>
                </Avatar>
                {/* <div className="h-8 w-8 object-contain">
                  <AvatarWithoutStatus url={user?.avatar} />
                </div> */}
              </IconButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="ml-4">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex gap-2 items-center">
                <UserCircle size={18} /> View Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex gap-2 items-center"
                onClick={() => dispatch(LogoutUser())}
              >
                <SignOut size={18} />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="lg:hidden flex  items-center justify-center">
          <Sheet>
            <SheetTrigger asChild>
              <IconButton
                className="p-0 mr-2 hover:bg-transparent"
                sx={{
                  border: "1px solid rgba(0,0,0,0.5)",
                  padding: "0",
                }}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </IconButton>
            </SheetTrigger>
            <SheetContent side={"right"} className="w-full">
              <SheetHeader className="items-start">
                <SheetTitle className="flex items-center justify-center gap-2 ">
                  <ChatsTeardrop size={28} color="#1976d4" weight="fill" />
                  <h2 className="text-2xl font-normal leading-none">Viby</h2>
                </SheetTitle>
              </SheetHeader>
              <ul className="sidebar-menu h-full w-full flex flex-col justify-between grow  py-8">
                <div className="w-full flex flex-col gap-2">
                  <li className="w-full h-[64px] px-2 flex gap-3 text-lg leading-none items-center justify-between self-end bg-slate-200 rounded-lg">
                    <div className="h-full w-1/2 flex items-center gap-2">
                      <div className="h-9 w-9 shrink-0">
                        <AvatarWithoutStatus url={user?.avatar} />
                      </div>
                      {user?.name || "Unknown User"}
                    </div>
                  </li>
                  <li className="w-full h-[48px]  flex gap-2 text-lg leading-none items-center hover:text-[#1976d4] ">
                    <UserCircle size={20} />
                    View Profile
                  </li>
                  <Separator />
                  <li className="w-full h-[48px]  flex gap-2 text-lg leading-none items-center hover:text-[#1976d4]">
                    <GearSix size={20} />
                    Settings
                  </li>
                  <Separator />
                  <li className="w-full h-[48px]  flex gap-2 text-lg leading-none items-center hover:text-[#1976d4]">
                    <Question size={20} />
                    Help
                  </li>
                  <Separator />
                  <li
                    className="w-full h-[48px]  flex gap-2 text-lg leading-none items-center hover:text-[#1976d4]"
                    onClick={() => {
                      dispatch(LogoutUser());
                    }}
                  >
                    <SignOut size={20} />
                    Logout
                  </li>
                </div>
                <li className="w-full h-[56px] px-2 flex gap-2 text-lg leading-none items-center justify-between self-end bg-slate-100 rounded-lg">
                  <div className="h-full w-1/2 flex items-center gap-2 leading-none">
                    <MoonStars size={20} />
                    <span className="leading-none">Dark Mode</span>
                  </div>
                  <Switch />
                </li>
              </ul>
            </SheetContent>
          </Sheet>
        </div>
      </footer>
    </nav>
  );
}

export default Navbar;
