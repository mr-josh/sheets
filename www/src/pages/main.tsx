import { lazy, Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { compileSync, runSync } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";

import { listen } from "@tauri-apps/api/event";

import { db } from "../connections/db";

import defaultComponents from "../components/mdx";

const SheetClip = lazy(() => import("../components/sheet-clip"));

const compileSheet = () => {
  const code = compileSync(
    localStorage.getItem("current-sheet") ?? "# No sheet loaded!",
    { outputFormat: "function-body" }
  );

  const result = runSync(code, runtime);

  return result;
};

function MainPage() {
  const [Sheet, setSheet] = useState<any>(compileSheet());

  useEffect(() => {
    const detach = listen("load-sheet", async ({ payload }) => {
      if (typeof payload != "number")
        throw TypeError("Payload was not a number");

      let sheet = await db.sheets.filter((s) => s.id == payload).first();

      localStorage.setItem("current-sheet", sheet?.sheet ?? "Failed to load sheet");
      localStorage.setItem("current-sheet-id", sheet?.id?.toString() ?? "-1");

      setSheet(compileSheet());
    });

    return () => {
      detach.then((d) => d());
    };
  });

  // Window size is 350x400 + 30 for shadowing and sheet-clip
  return (
    <motion.div initial={{y: -10}} animate={{y: 0}} key="page" className="flex w-full h-full justify-center items-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white scrollbar-hide rounded-md w-[350px] h-[400px] p-3 border shadow-md relative isolate"
      >
        <Suspense>
          <SheetClip />
        </Suspense>
        <div className="w-full h-full pb-[50%] overflow-y-auto overflow-x-visible scrollbar-hide">
          <Sheet.default components={defaultComponents} />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default MainPage;
