import Dexie, { Table } from "dexie";

export interface Sheet {
  id?: number;
  name: string;
  sheet: string;
  favourite: boolean;
}

export class SheetsDB extends Dexie {
  sheets!: Table<Sheet>;

  constructor() {
    super("sheetsDb");

    this.version(1).stores({
      sheets: "id++, name, favourite",
    });
  }
}

export const db = new SheetsDB();
