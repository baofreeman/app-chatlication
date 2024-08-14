import { FaRegMessage, FaUserGroup, FaBoxArchive } from "react-icons/fa6";
import { IconType } from "react-icons/lib";

interface NavbarProps {
  name: string;
  icon: IconType;
  slug: string;
  notification?: boolean;
}

export const navbar: NavbarProps[] = [
  {
    name: "All Chat",
    icon: FaRegMessage,
    slug: "all-chats",
  },
  {
    name: "Archived",
    icon: FaBoxArchive,
    slug: "archived",
  },
  {
    name: "Requests",
    icon: FaUserGroup,
    slug: "requests",
    notification: true,
  },
];
