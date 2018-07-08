import { Handler } from "provenance_mvvm_framework/dist/types/Provenance/Handler";
import { Set } from "./../DataStructure/Set";
import { Data } from "./../DataStructure/Data";
/*
 * @Author: Kiran Gadhave 
 * @Date: 2018-06-03 14:38:25 
 * @Last Modified by: Kiran Gadhave
 * @Last Modified time: 2018-07-07 16:40:19
 */
import * as d3 from "d3";
import { Application } from "provenance_mvvm_framework";
import { ViewModelBase } from "provenance_mvvm_framework";
import { UpsetView } from "./UpsetView";
export class UpsetViewModel extends ViewModelBase {
  constructor(view: UpsetView, app: Application) {
    super(view, app);
    this.App.on("render-rows-changed", this.update, this);

    this.registerFunctions(
      "remove_set",
      (d: any) => {
        this.App.emit("remove-set", d);
      },
      this
    );

    this.registerFunctions(
      "remove_set",
      (d: any) => {
        this.App.emit("add-set", d);
      },
      this,
      false
    );

    this.comm.on("remove-set-trigger", (d: Set) => {
      let _do = {
        func: (d: any) => {
          this.App.emit("remove-set", d);
        },
        args: [d]
      };
      let _undo = {
        func: (d: any) => {
          this.App.emit("add-set", d);
        },
        args: [d]
      };
      this.apply.call(this, ["remove_set", _do, _undo]);
    });
    this.comm.on("set-filter", idx => {
      this.App.emit("filter-changed", null, idx);
      this.App.emit("set-agg-none");
    });
  }

  update(data: Data) {
    this.comm.emit("update", data);
  }

  private registerFunctions(
    str: string,
    func: Handler,
    thisArg: any,
    _do: boolean = true
  ) {
    if (_do) this.App.registry.register(`do_${str}`, func, thisArg);
    else this.App.registry.register(`undo_${str}`, func, thisArg);
  }
}
