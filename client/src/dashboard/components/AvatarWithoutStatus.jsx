/* eslint-disable react/prop-types */
import Avatar from "@mui/material/Avatar";
import { faker } from "@faker-js/faker";

function AvatarWithoutStatus({ url }) {
  return (
    <Avatar
      sx={{
        height: "100%",
        width: "100%",
        // border: "1px solid rgba(0,0,0,0.2)",
        objectFit: "cover",
        objectPosition: "center",
      }}
      alt="Remy Sharp"
      src={url || faker.image.avatar()}
    />
  );
}

export default AvatarWithoutStatus;
