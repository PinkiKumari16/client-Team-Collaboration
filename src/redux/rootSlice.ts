import { createSlice } from "@reduxjs/toolkit";

const rootSlice = createSlice({
  name: "root",
  initialState: {
    loading: false,
    projectData: [],
    taskData: [],
    allUsersData: [],
    isReloadData: false,
    userRole: "MEMBER",
    userTeam: {},
    alertContent: null,
  },
  reducers: {
    showLoading: (state) => {
      state.loading = true;
    },
    hideLoading: (state) => {
      state.loading = false;
    },
    setProjectData: (state, action) => {
      state.projectData = action.payload;
    },
    setTaskData: (state, action) => {
      state.taskData = action.payload;
    },
    setAllUsersData: (state, action) => {
      state.allUsersData = action.payload;
    },
    setReloadData: (state, action) => {
      state.isReloadData = action.payload;
    },
    setUserRole: (state, action) => {
      state.userRole = action.payload;
    },
    setUserTeam: (state, action) => {
      state.userTeam = action.payload;
    },
    setAlertContent: (state, action) => {
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
