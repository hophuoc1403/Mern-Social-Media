import WebOutlinedIcon from "@mui/icons-material/WebOutlined";
import {
  HomeOutlined,
  PriceChangeOutlined,
  FacebookOutlined,
  FavoriteBorderOutlined,
  MessageOutlined,
  ShareOutlined,
  ThumbUpOutlined,
  PermContactCalendarOutlined,
  PersonAddAltOutlined,
  GroupAddOutlined,
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
        key: "service-price1",
        href: "/shared-post",
        label: "Shared post",
        icon: AllInboxIcon,
      },
      {
        key: "service-price13",
        href: "/post-tags",
        label: "Taged post",
        icon: AllInboxIcon,
      },
    ],
  },
  {
    subheader: "service",
    key: "facebook",
    label: "Facebook",
    icon: FacebookOutlined,
    children: [
      {
        key: "facebook-buff",
        label: "Facebook Buff",
        children: [
          {
            key: "buff-member-v1",
            href: "/orders/facebook/buff-member",
            label: "Buff Member V1",
            icon: PermContactCalendarOutlined,
          },
          {
            key: "buff-likepage-v1",
            href: "/orders/facebook/buff-likepage",
            label: "Buff Likepage V1",
            icon: ThumbUpOutlined,
          },
          {
            key: "buff-follow-v1",
            href: "/orders/facebook/buff-follow",
            label: "Buff Follow V1",
            icon: PersonAddAltOutlined,
          },
          {
            key: "buff-comment",
            href: "/orders/facebook/buff-comment",
            label: "Buff Comment",
            icon: MessageOutlined,
          },
          {
            key: "buff-share",
            href: "/orders/facebook/buff-share",
            label: "Buff Share",
            icon: ShareOutlined,
          },
          {
            key: "buff-friends",
            href: "/orders/facebook/buff-friends",
            label: "Buff Friends",
            icon: GroupAddOutlined,
          },
          {
            key: "buff-likepost",
            href: "/orders/facebook/buff-likepost",
            label: "Buff Likepost",
            icon: ThumbUpOutlined,
          },
          {
            key: "buff-likepage-v2",
            href: "/orders/facebook/buff-likepage-v2",
            label: "Buff Likepage V2",
            icon: ThumbUpOutlined,
          },
          {
            key: "buff-follow-v2",
            href: "/orders/facebook/buff-follow-v2",
            label: "Buff Follow V2",
            icon: PersonAddAltOutlined,
          },
          {
            key: "buff-member-v2",
            href: "/orders/facebook/buff-member-v2",
            label: "Buff Member V2",
            icon: PermContactCalendarOutlined,
          },
          {
            key: "buff-friends-v2",
            href: "/orders/facebook/buff-friends-v2",
            label: "Buff Friends V2",
            icon: GroupAddOutlined,
          },
        ],
      },
      {
        key: "facebook-vip",
        label: "Facebook Vip",
        children: [
          {
            key: "vip-like",
            href: "/vip-like",
            label: "Vip like",
            icon: FavoriteBorderOutlined,
          },
          {
            key: "vip-comment",
            href: "/vip-comment",
            label: "Vip Comment",
            icon: MessageOutlined,
          },
          {
            key: "vip-share",
            href: "/vip-share",
            label: "Vip Share",
            icon: ShareOutlined,
          },
          {
            key: "vip-share",
            href: "/vip-share",
            label: "Vip Share",
            icon: ShareOutlined,
          },
        ],
      },
    ],
  },
];
