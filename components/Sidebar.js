import { HomeIcon, EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import {
  HashtagIcon,
  EllipsisHorizontalCircleIcon,
  BellIcon,
  InboxIcon,
  BookmarkIcon,
  ClipboardIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import SidebarMenu from "./SidebarMenu";
import { useSession, signOut, signIn } from "next-auth/react";

const Sidebar = () => {
  const { data: session } = useSession();

  return (
    <div className="p-3 xl:pl-0 fixed text-gray-700 h-full hidden sm:inline">
      <div className="cursor-pointer">
        <Image
          src="https://cdn-icons-png.flaticon.com/128/733/733579.png"
          width={50}
          height={50}
          alt="Icon"
        />
      </div>
      <div className="mt-4 mb-3 space-y-1">
        <SidebarMenu Text="Home" Icon={HomeIcon} active />
        <SidebarMenu Text="Explore" Icon={HashtagIcon} />
      </div>
      {session ? (
        <>
          <div>
            <SidebarMenu Text="Notifications" Icon={BellIcon} />
            <SidebarMenu Text="Messages" Icon={InboxIcon} />
            <SidebarMenu Text="Bookmars" Icon={BookmarkIcon} />
            <SidebarMenu Text="Lists" Icon={ClipboardIcon} />
            <SidebarMenu Text="Profile" Icon={UserIcon} />
            <SidebarMenu Text="Home" Icon={EllipsisHorizontalCircleIcon} />
          </div>

          <div className="flex items-center mt-10 cursor-pointer xl:hover:bg-gray-100 rounded-full py-2 pr-4 group">
            <div className="rounded-full mr-2 group-hover:scale-110 transition-all ease-in-out">
              <Image
                src={session.user.image}
                width={40}
                height={40}
                alt="User"
                className="rounded-full"
                onClick={signOut}
              ></Image>
            </div>
            <div className="leading-5 mr-4 hidden xl:inline">
              <h2>{session.user.name}</h2>
              <p className="text-sm text-gray-400">
                {session.user.email.length > 12
                  ? `${session.user.email.slice(0, 12)}...`
                  : session.user.email}
              </p>
            </div>
            <EllipsisHorizontalIcon className="h-5 hidden xl:inline" />
          </div>
        </>
      ) : (
        <button
          onClick={signIn}
          className="hidden xl:inline bg-blue-400 w-48 h-12 text-white text-xl rounded-full shadow-md hover:shadow-xl hover:brightness-95"
        >
          Sign in
        </button>
      )}
    </div>
  );
};

export default Sidebar;
