import { memo } from "react";
import { IconButton } from "@mui/material";
import { Chats, Users, MagnifyingGlass, UserPlus } from "phosphor-react";
import { NavLink, useParams } from "react-router-dom";

function BottomNavbar() {
  // const { selectedChatId } = useSelector((state) => state.chat);
  const { chatId } = useParams();
  return (
    <ul
      className={`small-device-nav h-[52px] w-full bg-white z-20 absolute !bottom-0 !left-0 flex  items-center justify-evenly lg:hidden border-t-[1px] ${
        chatId && "chats-container-hide"
        // selectedChatId && "chats-container-hide"
      } `}
    >
      <li className="small-nav-item w-16 h-12  flex items-center justify-center rounded-sm ">
        <NavLink to={"/"}>
          {({ isActive }) =>
            isActive ? (
              <IconButton>
                <Chats size={28} color="#1976d4" weight="fill" />
              </IconButton>
            ) : (
              <IconButton>
                <Chats size={28} color="black" />
              </IconButton>
            )
          }
        </NavLink>
      </li>
      <li className="small-nav-item w-16 h-12  flex items-center justify-center rounded-sm ">
        <NavLink to={"/friends"}>
          {({ isActive }) =>
            isActive ? (
              <IconButton>
                <Users size={28} color="#1976d4" weight="fill" />
              </IconButton>
            ) : (
              <IconButton>
                <Users size={28} color="black" />
              </IconButton>
            )
          }
        </NavLink>
      </li>
      <li className="small-nav-item w-16 h-12  flex items-center justify-center rounded-sm ">
        <NavLink to={"/search"}>
          {({ isActive }) =>
            isActive ? (
              <IconButton>
                <MagnifyingGlass size={28} color="#1976d4" weight="fill" />
              </IconButton>
            ) : (
              <IconButton>
                <MagnifyingGlass size={28} color="black" />
              </IconButton>
            )
          }
        </NavLink>
      </li>
      <li className="small-nav-item w-16 h-12  flex items-center justify-center rounded-sm ">
        <NavLink to={"/requests"}>
          {({ isActive }) =>
            isActive ? (
              <IconButton>
                <UserPlus size={28} color="#1976d4" weight="fill" />
              </IconButton>
            ) : (
              <IconButton>
                <UserPlus size={28} color="black" />
              </IconButton>
            )
          }
        </NavLink>
      </li>
    </ul>
  );
}

export default memo(BottomNavbar);
