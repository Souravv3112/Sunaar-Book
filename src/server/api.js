import axios from "axios";

const URL = "http://localhost:3001";

export const login = async (user) => {
  try {
    let res = await axios.post(`${URL}/api/auth/signin`, user);
    return res?.data;
  } catch (error) {
    console.log(error);
  }
};

export const signup = async (user) => {
  try {
    let res = await axios.post(`${URL}/api/auth/signup`, user);
    return res?.data;
  } catch (error) {
    console.log(error);
  }
};

export const getKarigars = async (companyId) => {
  const token = localStorage.getItem("accessToken");
  const header = {
    headers: { "x-access-token": token },
  };
  try {
    let res = await axios.get(`${URL}/api/karigars?company_id=${companyId}`, header);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const addKarigars = async (karigar) => {
  const token = localStorage.getItem("accessToken");
  const header = {
    headers: { "x-access-token": token },
  };
  try {
    let res = await axios.post(`${URL}/api/karigars`, karigar, header);
    return res;
  } catch (error) {
    console.log(error.message);
    return { status: 400 };
  }
};

export const updateKarigars = async (karigar) => {
  const token = localStorage.getItem("accessToken");
  const header = {
    headers: { "x-access-token": token },
  };
  try {
    let res = await axios.put(
      `${URL}/api/karigars/${karigar.id}`,
      karigar,
      header
    );
    return res;
  } catch (error) {
    console.log(error.message);
    return { status: 400 };
  }
};

export const deleteKarigars = async (id) => {
  const token = localStorage.getItem("accessToken");
  const header = {
    headers: { "x-access-token": token },
  };
  try {
    console.log(id);
    let res = await axios.delete(`${URL}/api/karigars/${id}`, header);
    return res;
  } catch (error) {
    console.log(error.message);
    return { status: 400 };
  }
};

export const getOrders = async () => {
  const company_id = localStorage.getItem("company_id")

  const token = localStorage.getItem("accessToken");
  const header = {
    headers: { "x-access-token": token },
  };
  try {
    let res = await axios.get(`${URL}/api/orders?company_id=${company_id}`, header);
    return res;
  } catch (err) {
    console.log(err);
  }
};

export const uploadImagesToS3 = async (images, id) => {
  const token = localStorage.getItem("accessToken");
  const header = {
    headers: { "x-access-token": token, "Content-Type": "multipart/form-data" },
  };
  const formData = new FormData();

  images.forEach((image) => {
    formData.append("images", image);
  });
  formData.append("order_id", id);
  try {
    const response = await axios.post(
      `${URL}/api/images/upload`,
      formData,
      header
    );
    console.log("Image URLs:", response?.data);
    return response?.data;
  } catch (error) {
    console.error("Error uploading images:", error);
  }
};

export const deleteImageFromS3 = async (imageUrls) => {
  const token = localStorage.getItem("accessToken");
  const header = {
    headers: { "x-access-token": token },
  };
  console.log(imageUrls);
  try {
    const response = await axios.post(
      `${URL}/api/images/delete`,
      imageUrls,
      header
    );
    console.log("Image deleted:", response?.data);
    return response?.data;
  } catch (error) {
    console.error("Error deleting image:", error);
    return null;
  }
};

export const addOrders = async (newOrder, user) => {
  const token = localStorage.getItem("accessToken");
  const header = {
    headers: { "x-access-token": token },
  };
  console.log(newOrder, user);
  try {
    let res = await axios.post(`${URL}/api/orders`, newOrder, header);
    return res;
  } catch (error) {
    console.log(error.message);
    return { status: 400 };
  }
};

export const updateOrders = async (order) => {
  const token = localStorage.getItem("accessToken");
  const header = {
    headers: { "x-access-token": token },
  };
  try {
    let res = await axios.put(
      `${URL}/api/orders/${order.order_id}`,
      order,
      header
    );
    return res;
  } catch (error) {
    console.log(error.message);
    return { status: 400 };
  }
};

export const deleteOrders = async (order_id) => {
  const token = localStorage.getItem("accessToken");
  const header = {
    headers: { "x-access-token": token },
  };
  try {
    let res = await axios.delete(`${URL}/api/orders/${order_id}`, header);
    return res;
  } catch (error) {
    console.log(error.message);
    return { status: 400 };
  }
};
export const registerUser = async (userData) => {
  const token = localStorage.getItem("accessToken");
  const header = {
    headers: { "x-access-token": token },
  };
  try {
    console.log("userData", userData);
    let res = await axios.post(`${URL}/api/auth/signup`, userData, header);
    return res;
  } catch (error) {
    console.log(error);
    return { status: 400 };
  }
};
export const getAllUsers = async () => {
  const company_id = localStorage.getItem("company_id")
  const token = localStorage.getItem("accessToken");
  const header = {
    headers: { "x-access-token": token },
  };
  try {
    let res = await axios.get(`${URL}/api/auth/users?company_id=${company_id}`, header);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteUser = async (userId) => {
  const token = localStorage.getItem("accessToken");
  const header = {
    headers: { "x-access-token": token },
  };
  try {
    let res = await axios.delete(`${URL}/api/auth/users/${userId}`, header);
    return res;
  } catch (error) {
    console.log(error);
    return { status: 400 };
  }
};

export const getCompanyInfo = async () => {
  const company_id = localStorage.getItem("company_id")
  const token = localStorage.getItem("accessToken");
  const header = {
    headers: { "x-access-token": token },
  };
  try {
    let res = await axios.get(`${URL}/api/companies/${company_id}`, header);
    return res;
  } catch (error) {
    console.log(error);
    return { status: 400 };
  }
};
