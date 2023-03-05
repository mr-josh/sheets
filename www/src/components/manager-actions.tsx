import { open } from "@tauri-apps/api/dialog";

import { ActionIcon, TextInput, Tooltip } from "@mantine/core";
import { IconFileImport, IconFilePlus, IconSearch } from "@tabler/icons-react";
import React from "react";
import { readTextFile } from "@tauri-apps/api/fs";
import { db } from "../connections/db";

const ManagerActions = (props: {searchOnChange: React.ChangeEventHandler<HTMLInputElement>}) => {
  const importSheet = async () => {
    let selected = await open({
      multiple: true,
      title: "Select Sheets",
      filters: [{ name: "Markdown", extensions: ["md", "mdx"] }],
    });

    if (!selected) return;

    if (typeof selected == "string") selected = [selected];

    for (const file of selected) {
      let sheetText = await readTextFile(file);
      let fileName = file.match(/(?!\/)[^/]*$/g)?.[0];

      db.sheets.add({
        name: fileName ?? file,
        sheet: sheetText,
        favourite: false,
      });
    }
  };

  const createSheet = async () => {
    db.sheets.add({
      name: "New Sheet",
      sheet: "# Hello world!",
      favourite: false,
    });
  };

  return (
    <div className="flex justify-between items-center mb-3">
        {/* Tools */}
        <div className="flex items-center">
          <Tooltip label="Create Sheet">
            <ActionIcon color="green" onClick={createSheet}>
              <IconFilePlus />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Import Sheet">
            <ActionIcon color="cyan" onClick={importSheet}>
              <IconFileImport />
            </ActionIcon>
          </Tooltip>
        </div>
        {/* Search */}
        <div className="flex items-center gap-3">
          <TextInput
            placeholder="Search for sheets"
            onChange={props.searchOnChange}
            icon={<IconSearch />}
          />
        </div>
      </div>
  );
};

export default ManagerActions;