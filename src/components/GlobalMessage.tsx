import React, { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { setAlertContent } from "../redux/rootSlice.js";

const getAlertStyle = (type: string) => {
  switch (type) {
    case "success":
      return {
        emoji: "✅",
        bg: "bg-green-100 text-green-700 border-green-400",
      };
    case "error":
      return { emoji: "❌", bg: "bg-red-100 text-red-700 border-red-400" };
    case "info":
      return { emoji: "ℹ️", bg: "bg-blue-100 text-blue-700 border-blue-400" };
    case "warning":
      return {
        emoji: "⚠️",
        bg: "bg-yellow-100 text-yellow-800 border-yellow-400",
      };
    default:
      return { emoji: "", bg: "" };
  }
};

const GlobalAlert: React.FC = () => {
  const dispatch = useAppDispatch();
  const alertContent = useAppSelector((state) => state.root.alertContent);

  useEffect(() => {
    if (alertContent) {
      const timer = setTimeout(() => {
        dispatch(setAlertContent(null));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alertContent, dispatch]);

  if (!alertContent) return null;

  const { type, message } = alertContent;
  const { emoji, bg } = getAlertStyle(type);

  return (
    <div className="fixed top-4 min-w-[30%] left-1/2 transform -translate-x-1/2 z-50">
      <div
        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg shadow-md border text-sm font-medium ${bg}`}
      >
        <span className="text-lg">{emoji}</span>
        <span>{message}</span>
      </div>
    </div>
  );
};

export default GlobalAlert;
