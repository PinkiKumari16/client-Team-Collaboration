import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface Team {
  id: string;
  name: string;
}

interface RootStateType {
  loading: boolean;
  projectData: any[];
  taskData: any[];
  allUsersData: any[];
  isReloadData: boolean;
  userRole: string;
  userTeam: Team | null;
  alertContent: null | {
    type: "success" | "error" | "info" | "warning";
    message: string;
  };
}

const initialState: RootStateType = {
  loading: false,
  projectData: [],
  taskData: [],
  allUsersData: [],
  isReloadData: false,
  userRole: "MEMBER",
  userTeam: null, // ✅ FIXED: use null instead of {} to match Team | null
  alertContent: null,
};

const rootSlice = createSlice({
  name: "root",
  initialState,
  reducers: {
    showLoading: (state) => {
      state.loading = true;
    },
    hideLoading: (state) => {
      state.loading = false;
    },
    setProjectData: (state, action: PayloadAction<any[]>) => {
      state.projectData = action.payload;
    },
    setTaskData: (state, action: PayloadAction<any[]>) => {
      state.taskData = action.payload;
    },
    setAllUsersData: (state, action: PayloadAction<any[]>) => {
      state.allUsersData = action.payload;
    },
    setReloadData: (state, action: PayloadAction<boolean>) => {
      state.isReloadData = action.payload;
    },
    setUserRole: (state, action: PayloadAction<string>) => {
      state.userRole = action.payload;
    },
    setUserTeam: (state, action: PayloadAction<Team | null>) => {
      state.userTeam = action.payload;
    },
    setAlertContent: (
      state,
      action: PayloadAction<{
        type: "success" | "error" | "info" | "warning";
        message: string;
      } | null>
    ) => {
      state.alertContent = action.payload;
    },
  },
});

export default rootSlice.reducer;
export const {
  showLoading,
  hideLoading,
  setProjectData,
  setTaskData,
  setReloadData,
  setUserRole,
  setUserTeam,
  setAllUsersData,
  setAlertContent,
} = rootSlice.actions;
