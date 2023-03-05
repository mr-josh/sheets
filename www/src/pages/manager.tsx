import { open } from "@tauri-apps/api/dialog";
import { readTextFile } from "@tauri-apps/api/fs";

import { AnimatePresence, motion } from "framer-motion";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../connections/db";
import {
  IconFileImport,
  IconFilePlus,
  IconPresentation,
  IconSearch,
} from "@tabler/icons-react";
import {
  ActionIcon,
  Divider,
  Skeleton,
  Space,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { lazy, Suspense, useState } from "react";
import { emit } from "@tauri-apps/api/event";
import ManagerActions from "../components/manager-actions";
// import SheetCard from "../components/sheet-card";

const SheetCard = lazy(() => import("../components/sheet-card"));

const ManagerPage = () => {
  const [searching, setSearching] = useState("");

  const sheets = useLiveQuery(
    () =>
      db.sheets
        .filter((s) => new RegExp(searching, "i").test(s.name))
        .toArray(),
    [searching]
  );

  const favouriteSheets = useLiveQuery(() =>
    db.sheets.filter((s) => s.favourite).toArray()
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      key="page"
      className="flex flex-col px-6 py-3 w-full h-fit relative"
    >
      {/* Actions */}
      <ManagerActions searchOnChange={(v) => setSearching(v.target.value)} />

      <Divider />
      <Space h="md" />

      {/* Sheets */}
      <div className="grid grid-cols-4 h-full">
        {/* Favourite Sheets */}
        <div className="border-r">
          <h3 className="font-bold underline">Favourites</h3>
          {favouriteSheets && (
            <motion.ul
              variants={{
                show: {
                  transition: {
                    delayChildren: 0.1,
                    staggerChildren: 0.1,
                  },
                },
              }}
              initial="hide"
              animate="show"
              exit="hide"
            >
              <AnimatePresence>
                {favouriteSheets?.map((sheet) => (
                  <motion.li
                    key={sheet.id}
                    exit={{ opacity: 0 }}
                    variants={{
                      hide: { opacity: 0, x: -20 },
                      show: { opacity: 1, x: 0 },
                    }}
                    className="flex items-center w-10/12"
                  >
                    <ActionIcon onClick={() => emit("load-sheet", sheet.id)}>
                      <IconPresentation />
                    </ActionIcon>
                    <span className="whitespace-nowrap overflow-clip text-ellipsis">
                      {sheet.name}
                    </span>
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          )}
        </div>

        {/* All Sheets */}
        {sheets && (
          <motion.div
            className="col-start-2 col-end-5 flex flex-wrap justify-center gap-3 overflow-y-auto h-fit"
            variants={{
              show: {
                transition: {
                  delayChildren: 0.5,
                  staggerChildren: 0.1,
                },
              },
            }}
            initial="hide"
            animate="show"
          >
            <AnimatePresence>
              {sheets?.map((sheet) => (
                <motion.div
                  key={sheet.id}
                  exit={{ opacity: 0 }}
                  variants={{
                    show: { opacity: 1 },
                    hide: { opacity: 0 },
                  }}
                >
                  <Suspense
                    fallback={<Skeleton width="13rem" height="15rem" visible />}
                  >
                    <SheetCard sheet={sheet} />
                  </Suspense>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ManagerPage;
