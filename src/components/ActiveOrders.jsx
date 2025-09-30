import { Box, styled } from "@mui/material";
import OrderTable from "./OrderTable";

const Container = styled(Box)`
  margin: 15px 15px 0 15px;
  box-shadow: blue;
  border: 1px solid #d1d1d1;
  border-radius: 5px;
  @media (max-width: 900px) {
    margin: 5px 5px 0 5px;
  }
`;


const ActiveOrders = () => {
  return (
    <Container
      sx={{
        boxShadow: "0px 0px 10px 0px #d1d1d1",
      }}
    >
      <OrderTable active={true} />
    </Container>
  );
};

export default ActiveOrders;
