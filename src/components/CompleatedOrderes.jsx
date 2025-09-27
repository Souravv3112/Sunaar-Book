import React from "react";

import { Box, styled } from "@mui/material";
import OrderTable from "./OrderTable";

const Container = styled(Box)`
  margin: 15px 15px 0 15px;
  box-shadow: blue;
  border: 1px solid #d1d1d1;
  border-radius: 5px;
  overflow: hidden; /* Ensure zoom doesn't cause layout issues */
`;

const CompleatedOrderes = () => {
  return (
    <Container
      sx={{
        boxShadow: "0px 0px 10px 0px #d1d1d1",
        position: "relative", /* Better positioning for zoom transforms */
      }}
    >
      <OrderTable active={false} />
    </Container>
  );
};

export default CompleatedOrderes;
