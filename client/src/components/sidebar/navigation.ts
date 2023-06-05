import WebOutlinedIcon from "@mui/icons-material/WebOutlined";
import {
  HomeOutlined,
  PriceChangeOutlined,
  ShareOutlined,
 Attachment,
} from "@mui/icons-material";
import AllInboxIcon from "@mui/icons-material/AllInbox";

export const navigations = [
  {
    subheader: "Main",
    key: "home",
    label: "Home",
    href: "/home",
    icon: WebOutlinedIcon,
    children: [
      {
        key: "all post",
        href: "/",
        label: "All post",
        icon: HomeOutlined,
      },
      {
        key: "site-agency",
        href: "/search",
        label: "Search post",
        icon: PriceChangeOutlined,
      },
      {
        key: "service-price",
        href: "/add-post",
        label: "Add post",
        icon: AllInboxIcon,
      },
      {
        key: "service-price13",
        href: "/post-tags",
        label: "Taged post",
        icon: Attachment,
      },
    ],
  },
  {
    subheader: "Account",
    key: "home",
    label: "Home",
    href: "/home",
    icon: WebOutlinedIcon,
    children: [
      {
        key: "service-price1",
        href: "/shared-post",
        label: "Shared post",
        icon: ShareOutlined,
      },
      {
        key: "service-price13",
        href: "/activities",
        label: "Activities",
        icon: Attachment,
      },
    ],
  },
];
