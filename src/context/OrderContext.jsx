import React, { createContext, useContext, useEffect, useState } from "react";
import {
  addOrders,
  deleteOrders,
  getOrders,
  updateOrders,
} from "../server/api";
import AlertSnackbar from "../components/AlertSnackbar";
import { UserContext } from "./UserContext";

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const { token, user } = useContext(UserContext);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const companyId = localStorage.getItem("company_id")


  useEffect(() => {
    if (token) {
      const getAllOrders = async () => {
        const res = await getOrders();
        setOrders(res?.data);
      };
      getAllOrders();
    }
  }, [token]);

  const addOrder = async (newOrder) => {
    console.log("added new order: ", newOrder);
    const payload = { ...newOrder, company_id: companyId }
    const res = await addOrders(payload, user);
    if (res.status === 201) {
      setOrders((prevOrders) => [...prevOrders, res?.data]);
      setAlertMessage("Order added successfully!");
      setAlertSeverity("success");
      setAlertOpen(true);
    } else {
      setAlertMessage(`Failed to add Order.`);
      setAlertSeverity("error");
      setAlertOpen(true);
    }
  };

  const updateOrder = async (updatedOrder) => {
    console.log("49", updatedOrder)
    const res = await updateOrders(updatedOrder);
    if (res.status === 200) {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.order_id === updatedOrder.order_id
            ? { ...res.data.order }
            : order
        )
      );
      setAlertMessage("Order updated successfully!");
      setAlertSeverity("success");
      setAlertOpen(true);
    } else {
      setAlertMessage(`Failed to Update Order.`);
      setAlertSeverity("error");
      setAlertOpen(true);
    }
  };
  const deleteOrder = async (order_id) => {
    const res = await deleteOrders(order_id);
    if (res.status === 200) {
      setOrders((prevOrders) =>
        prevOrders?.filter((order) => order.order_id !== order_id)
      );
      setAlertMessage("Order deleted successfully!");
      setAlertSeverity("success");
      setAlertOpen(true);
    } else {
      setAlertMessage(`Failed to delete Order.`);
      setAlertSeverity("error");
      setAlertOpen(true);
    }
  };

  return (
    <OrderContext.Provider
      value={{ orders, addOrder, updateOrder, deleteOrder }}
    >
      {children}
      <AlertSnackbar
        alertOpen={alertOpen}
        alertSeverity={alertSeverity}
        alertMessage={alertMessage}
        setAlertOpen={setAlertOpen}
      />
    </OrderContext.Provider>
  );
};
