import { appWindow, WebviewWindow } from "@tauri-apps/api/window";
import { emit } from "@tauri-apps/api/event";
import { exit } from "@tauri-apps/api/process";

import { db } from "../connections/db";

import {
  IconBook,
  IconCircleX,
  IconCircleMinus,
  IconSquareArrowLeft,
  IconSquareArrowRight,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

const SheetClip = () => {
  const loadPreviousSheet = async () => {
    const currentSheetId = parseInt(
      localStorage.getItem("current-sheet-id") ?? "-1"
    );
    let previous = await db.sheets
      .orderBy("id")
      .filter((s) => (s.id ?? -1) < currentSheetId)
      .and((s) => s.favourite)
      .last();

    if (!previous)
      previous = await db.sheets
        .orderBy("id")
        .filter((s) => s.id != currentSheetId)
        .and((s) => s.favourite)
        .last();

    if (!previous) {
      notifications.show({
        id: "sheet-failure",
        message: "No favourite sheets found.",
        color: "red",
        icon: <IconCircleX />,
      });
      return;
    }

    emit("load-sheet", previous.id);
  };

  const loadNextSheet = async () => {
    const currentSheetId = parseInt(
      localStorage.getItem("current-sheet-id") ?? "-1"
    );
    let next = await db.sheets
      .orderBy("id")
      .filter((s) => (s.id ?? -1) > currentSheetId)
      .and((s) => s.favourite)
      .first();

    if (!next)
      next = await db.sheets
        .orderBy("id")
        .filter((s) => s.id != currentSheetId)
        .and((s) => s.favourite)
        .first();

    if (!next) {
      notifications.show({
        id: "sheet-failure",
        message: "No favourite sheets found.",
        color: "red",
        variant: "filled",
        icon: <IconCircleX />,
      });
      return;
    }

    emit("load-sheet", next.id);
  };

  const openManager = async () => {
    const managerWindow = new WebviewWindow("manager", {
      width: 1080,
      height: 720,
      minWidth: 600,
      minHeight: 600,
      url: "/manager",
      title: "Sheets Manager",
      focus: true,
      center: true,
    });

    await managerWindow.setFocus();
  };

  const minimiseApp = async () => {
    await appWindow.minimize();
  };

  const quitApp = async () => {
    await exit();
  };

  return (
    <div
      className="flex justify-between absolute bg-stone-700 shadow-sm opacity-0 hover:opacity-100 transition-opacity rounded-full px-3 h-8 w-3/4 left-1/2 -translate-x-1/2 -top-4 z-10 cursor-grab"
      data-tauri-drag-region
    >
      {/* Quick change */}
      <div className="flex">
        <button
          className="hover:scale-110 transition-transform"
          onClick={loadPreviousSheet}
        >
          <IconSquareArrowLeft color="white" />
        </button>
        <button
          className="hover:scale-110 transition-transform"
          onClick={loadNextSheet}
        >
          <IconSquareArrowRight color="white" />
        </button>
      </div>

      {/* Sheet management */}
      <div className="flex">
        <button
          className="hover:scale-110 transition-transform"
          onClick={openManager}
        >
          <IconBook color="white" />
        </button>
      </div>

      {/* App controls */}
      <div className="flex">
        <button
          className="hover:scale-110 transition-transform"
          onClick={minimiseApp}
        >
          <IconCircleMinus color="white" />
        </button>
        <button
          className="hover:scale-110 transition-transform"
          onClick={quitApp}
        >
          <IconCircleX color="white" />
        </button>
      </div>
    </div>
  );
};

export default SheetClip;
