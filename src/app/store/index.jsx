import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../../features/auth/authSlice";
import createAccountsReducer from "../../features/admin/createAccountsSlice";
import supervisorsReducer from "../../features/supervisors/supervisorsSlice";
import classesReducer from "../../features/classes/classesSlice";
import studentsReducer from "../../features/students/studentsSlice";
import supervisionReducer from "../../features/supervision/supervisionSlice";
import accountingReducer from "../../features/accounting/accountingSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    createAccounts: createAccountsReducer,
    supervisors: supervisorsReducer,
    classes: classesReducer,
    students: studentsReducer,
    supervision: supervisionReducer,
    accounting: accountingReducer,
  },
});
