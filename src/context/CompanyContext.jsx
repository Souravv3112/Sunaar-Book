import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { getCompanyInfo } from "../server/api";

const CompanyContext = createContext();

export const useCompany = () => useContext(CompanyContext);

const companyId = localStorage.getItem("company_id");

export const CompanyProvider = ({ children }) => {
    const [company, setCompany] = useState({
        name: "",
        logoUrl: "",
        id: "",
        // Add more fields as needed
    });

    useEffect(() => {
        const res = getCompanyInfo()
        console.log("resp", res)
        if (res) {
            setCompany(res?.name)
        }
    })
    // Function to update company info (e.g., after login)
    const updateCompany = (companyData) => {
        setCompany(companyData);
    };

    return (
        <CompanyContext.Provider value={{ company, updateCompany }}>
            {children}
        </CompanyContext.Provider>
    );
};


