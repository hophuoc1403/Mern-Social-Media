import React from "react";

import { VisibilityContext } from "react-horizontal-scrolling-menu";
import { Story } from ".";
import { Typography, Box, Avatar } from "@mui/material";

export function Card(data: Story) {
  const { image, createdAt, user } = data;

  return (
    <div
      role="button"
      style={{
        display: "inline-block",
        margin: "0 10px",
        width: "160px",
        userSelect: "none",
        position: "relative",
        boxShadow: "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
      }}
      tabIndex={0}
      className="card"
    >
      <img
        src={"http://localhost:3001/" + image}
        alt="story img"
        style={{ height: "200px", objectFit: "cover", borderRadius: "8px" }}
      />
      <Typography
        fontSize={"15px"}
        fontWeight={500}
        py={1}
        px={2}
        borderRadius={"50px"}
        bgcolor={"#000"}
        color={"#fff"}
        sx={{ position: "absolute", left: "10px", bottom: "10px" }}
      >
        {user.firstName + " " + user.lastName}
      </Typography>
      <Avatar
        variant="circular"
        src={"http://localhost:3001/" + user.picturePath}
        sx={{
          position: "absolute",
          top: "10px",
          left: "10px",
          boxShadow:
            "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px",
          border: "3px solid blue",
        }}
      />
    </div>
  );
}
