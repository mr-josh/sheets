import {
  Menu,
  ActionIcon,
  Popover,
  Text,
  TextInput,
  Modal,
  Textarea,
  Button,
  Space,
} from "@mantine/core";
import {
  IconDotsCircleHorizontal,
  IconPencil,
  IconEdit,
  IconTrash,
  IconDeviceFloppy,
  IconStarFilled,
  IconStar,
  IconPresentation,
  IconCheck,
} from "@tabler/icons-react";

import { confirm } from "@tauri-apps/api/dialog";

import { db, Sheet } from "../connections/db";
import { useRef, useState } from "react";
import { notifications } from "@mantine/notifications";
import { emit } from "@tauri-apps/api/event";
import { useDisclosure } from "@mantine/hooks";

const SheetCard = (props: { sheet: Sheet }) => {
  const [renaming, setRenaming] = useState(false);
  const editRef = useRef<HTMLTextAreaElement>(null);
  const [editing, { open, close }] = useDisclosure(false);
  const renameInput = useRef<HTMLInputElement>(null);

  const openEditor = () => {
    if (!editRef.current) return;

    editRef.current.value = props.sheet.sheet;
    open();
  };

  const saveEditor = async () => {
    await db.sheets
      .filter((s) => s.id == props.sheet.id)
      .modify({ sheet: editRef.current?.value });

    notifications.show({
      message: "Sheet saved!",
      color: "green",
      icon: <IconCheck />,
    });

    close();
  };

  const discardEditor = async () => {
    let discard = await confirm(
      "Are you sure you want to discard your changes?",
      {
        title: "Discard changes?",
        type: "warning",
      }
    );

    if (discard) close();
  };

  const renameSheet = async (newName?: string) => {
    if (!newName) {
      notifications.show({
        message: `New name can't be "${newName}"`,
        color: "red",
      });
      return;
    }

    await db.sheets
      .filter((s) => s.id == props.sheet.id)
      .modify({ name: newName });

    notifications.show({
      message: "Sheet Renamed!",
      color: "green",
      icon: <IconCheck />,
    });

    setRenaming(false);
  };

  const deleteSheet = async (sheetId: number) => {
    let sheet = await db.sheets.filter((s) => s.id == sheetId).first();

    if (
      await confirm(`Are you sure you want to delete "${sheet?.name}"?`, {
        title: "Delete Sheet",
        type: "warning",
      })
    )
      await db.sheets.filter((s) => s.id == sheetId).delete();
  };

  const favouriteSheet = async () => {
    let sheet = await db.sheets.filter((s) => s.id == props.sheet.id).first();

    await db.sheets
      .filter((s) => s.id == props.sheet.id)
      .modify({ favourite: !sheet?.favourite });
  };

  return (
    <>
      <Modal
        opened={editing}
        onClose={close}
        title="Edit Sheet"
        centered
        closeOnClickOutside={false}
        closeOnEscape={false}
        withCloseButton={false}
        keepMounted
      >
        <Textarea minRows={15} ref={editRef} />
        <Space h="sm" />
        <div className="flex justify-end gap-2">
          <Button variant="outline" color="red" onClick={discardEditor}>
            Discard
          </Button>
          <Button variant="filled" color="lime" onClick={saveEditor}>
            Save
          </Button>
        </div>
      </Modal>

      <div className="flex flex-col justify-between gap-1 p-3 w-52 h-60 border rounded-md relative">
        {/* Options Menu */}
        <div className="absolute right-3">
          <Menu position="bottom-end">
            <Menu.Target>
              <ActionIcon>
                <IconDotsCircleHorizontal />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>Options</Menu.Label>
              <Menu.Item
                icon={<IconPencil />}
                onClick={() => setRenaming(true)}
              >
                Rename
              </Menu.Item>
              <Menu.Item icon={<IconEdit />} onClick={openEditor}>
                Edit
              </Menu.Item>
              <Menu.Item
                icon={<IconTrash />}
                color="red"
                onClick={() => deleteSheet(props.sheet.id ?? -1)}
              >
                Delete
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>

        {/* Title & Preview */}
        <Popover
          position="bottom-start"
          onClose={() => setRenaming(false)}
          opened={renaming}
          trapFocus
        >
          <Popover.Target>
            <h4 className="font-bold whitespace-nowrap text-ellipsis overflow-clip w-10/12">
              {props.sheet.name}
            </h4>
          </Popover.Target>
          <Popover.Dropdown p="xs">
            <div className="flex items-center gap-2">
              <TextInput
                ref={renameInput}
                placeholder="Enter new name"
                onKeyDown={(e) => {
                  if (e.key != "Enter") return;
                  e.preventDefault();

                  renameSheet(e.currentTarget.value);
                }}
              />
              <ActionIcon
                onClick={() => renameSheet(renameInput.current?.value)}
              >
                <IconDeviceFloppy />
              </ActionIcon>
            </div>
            <p className="text-xs">
              Click out of text input to discard changes
            </p>
          </Popover.Dropdown>
        </Popover>
        <pre>
          <Text component="code" lineClamp={5}>
            {props.sheet.sheet}
          </Text>
        </pre>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <ActionIcon
            onClick={() => favouriteSheet()}
            color="yellow"
            size="lg"
            variant="outline"
          >
            {props.sheet.favourite ? <IconStarFilled /> : <IconStar />}
          </ActionIcon>
          <ActionIcon
            color="blue"
            size="lg"
            variant="outline"
            onClick={async () => {
              await emit("load-sheet", props.sheet.id ?? -1);
            }}
          >
            <IconPresentation />
          </ActionIcon>
        </div>
      </div>
    </>
  );
};

export default SheetCard;
