import { Attribute } from "./../DataStructure/Attribute";
import { Data } from "./../DataStructure/Data";
import { RenderRow } from "./../type_declarations/types";
import {
  ElementView,
  ElementRenderRows,
  ElementRenderRow
} from "./ElementView";
import { Application } from "provenance_mvvm_framework";
import { ViewModelBase } from "provenance_mvvm_framework";
import "./styles.scss";

export class ElementViewModel extends ViewModelBase {
  private selectedSets: ElementRenderRows;
  private dataset: Data;

  constructor(view: ElementView, app: Application) {
    super(view, app);
    this.selectedSets = [];

    this.App.on("render-rows-changed", (data: Data) => {
      this.dataset = data;
      this.selectedSets = [];
      this.update();
    });

    this.App.on("add-selection", this.addSelection, this);
    this.App.on("remove-selection", this.removeSelection, this);
    this.App.on(
      "add-selection-trigger",
      (d: RenderRow) => {
        this.comm.emit("add-selection-trigger", d);
      },
      this
    );

    this.App.on(
      "remove-selection-trigger",
      (idx: number) => {
        this.comm.emit("remove-selection-trigger", idx);
      },
      this
    );

    this.registerFunctions(
      "add-selection",
      (d: RenderRow) => {
        this.App.emit("add-selection", d);
      },
      this
    );

    this.registerFunctions(
      "add-selection",
      (idx: number) => {
        this.App.emit("remove-selection", idx);
      },
      this,
      false
    );

    this.registerFunctions(
      "remove-selection",
      (idx: number) => {
        this.App.emit("remove-selection", idx);
      },
      this
    );

    this.registerFunctions(
      "remove-selection",
      (d: RenderRow) => {
        this.App.emit("add-selection", d);
      },
      this,
      false
    );

    this.comm.on("add-selection-trigger", (d: RenderRow) => {
      let _do = {
        func: (d: RenderRow) => {
          this.App.emit("add-selection", d);
        },
        args: [d]
      };
      let _undo = {
        func: (idx: number) => {
          this.App.emit("remove-selection", idx);
        },
        args: [this.selectedSets.length]
      };
      this.apply.call(this, ["add-selection", _do, _undo]);
    });

    this.comm.on("remove-selection-trigger", (idx: number) => {
      let _do = {
        func: (idx: number) => {
          this.App.emit("remove-selection", idx);
        },
        args: [idx]
      };
      let _undo = {
        func: (d: RenderRow) => {
          this.App.emit("add-selection", d);
        },
        args: [this.selectedSets[idx]]
      };
      this.apply.call(this, ["remove-selection", _do, _undo]);
    });
  }

  addSelection(sel: RenderRow) {
    let validAttributes = this.dataset.attributes.filter(
      _ => _.name !== "Sets"
    );
    let n_row = createObjectsFromSubsets(sel, validAttributes);
    this.selectedSets.push(n_row);
    this.update();
  }

  removeSelection(idx: number) {
    this.selectedSets.splice(idx, 1);
    this.update();
  }

  update() {
    if (this.selectedSets.length < 1) return;
    let validAttributes = this.dataset.attributes.filter(
      _ => _.name !== "Sets"
    );
    this.comm.emit("update", this.selectedSets, validAttributes);
  }
}

function createObjectsFromSubsets(
  row: RenderRow,
  attributes: Attribute[]
): ElementRenderRow {
  let items = row.data.items;
  let arr = items.map(i => {
    let obj: any = {};
    attributes.forEach((attr: Attribute) => {
      obj[attr.name] = attr.values[i];
    });

    return obj;
  });
  return {
    id: row.id,
    data: row.data,
    arr: arr
  };
}
