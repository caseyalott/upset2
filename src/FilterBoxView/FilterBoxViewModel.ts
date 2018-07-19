/*
 * @Author: Kiran Gadhave 
 * @Date: 2018-06-03 14:38:25 
 * @Last Modified by: Kiran Gadhave
 * @Last Modified time: 2018-07-07 19:30:26
 */
import { Application } from "provenance_mvvm_framework";
import { ViewModelBase } from "provenance_mvvm_framework";
import { FilterBoxView } from "./FilterBoxView";
import "./styles.scss";
import { RenderConfig } from "../DataStructure/AggregateAndFilters";

export class FilterBoxViewModel extends ViewModelBase {
  get config(): RenderConfig {
    if (!sessionStorage["render_config"]) this.saveConfig(new RenderConfig());
    return JSON.parse(sessionStorage["render_config"]);
  }

  constructor(view: FilterBoxView, app: Application) {
    super(view, app);
    this.comm.on("filter-changed", (config: RenderConfig) => {
      this.App.emit("filter-changed", config, null);
    });

    this.App.on("sort-by-set", (id: number) => {
      this.comm.emit("sort-by-set", id);
    });

    this.App.on("sort-by-cardinality", () => {
      this.comm.emit("sort-by-cardinality");
    });

    this.App.on("sort-by-deviation", () => {
      this.comm.emit("sort-by-deviation");
    });

    this.App.on("change-dataset", d => {
      let rc = this.config;
      rc.currentFile = d;
      this.saveConfig(rc);
    });

    this.registerFunctions(
      "applyFirstAggregation",
      view.applyFirstAggregation,
      view
    );
    this.registerFunctions(
      "applySecondAggregation",
      view.applySecondAggregation,
      view
    );
    this.registerFunctions("applySortBy", view.applySortBy, view);
    this.registerFunctions("applyFirstOverlap", view.applyFirstOverlap, view);
    this.registerFunctions("applySecondOverlap", view.applySecondOverlap, view);
    this.registerFunctions(
      "applyMinDegreeChange",
      view.applyMinDegreeChange,
      view
    );
    this.registerFunctions(
      "applyMaxDegreeChange",
      view.applyMaxDegreeChange,
      view
    );
    this.registerFunctions("applyHideEmpty", view.applyHideEmpty, view);
    this.registerFunctions("applySortBySet", view.applySortBySet, view);
    this.registerFunctions(
      "sortByCardinality",
      view.applySortByCardinality,
      view
    );
    this.registerFunctions("sortByDeviation", view.applySortByDeviation, view);

    /** Undo Registration */
    this.registerFunctions(
      "applyFirstAggregation",
      view.applyFirstAggregation,
      view,
      false
    );
    this.registerFunctions(
      "applySecondAggregation",
      view.applySecondAggregation,
      view,
      false
    );
    this.registerFunctions("applySortBy", view.applySortBy, view, false);
    this.registerFunctions(
      "applyFirstOverlap",
      view.applyFirstOverlap,
      view,
      false
    );
    this.registerFunctions(
      "applySecondOverlap",
      view.applySecondOverlap,
      view,
      false
    );
    this.registerFunctions(
      "applyMinDegreeChange",
      view.applyMinDegreeChange,
      view,
      false
    );
    this.registerFunctions(
      "applyMaxDegreeChange",
      view.applyMaxDegreeChange,
      view,
      false
    );
    this.registerFunctions("applyHideEmpty", view.applyHideEmpty, view, false);
    this.registerFunctions(
      "applySortBySet",
      view.unApplySortBySet,
      view,
      false
    );
    this.registerFunctions(
      "sortByCardinality",
      view.unApplySortByCardinality,
      view,
      false
    );
    this.registerFunctions(
      "sortByDeviation",
      view.unApplySortByDeviation,
      view,
      false
    );

    this.comm.on("apply", args => {
      console.log(args);
      console.log(this.App.graph);
      this.apply(args);
    });
  }

  private saveConfig(config: RenderConfig, update: boolean = true) {
    sessionStorage["render_config"] = JSON.stringify(config);
    if (update) this.comm.emit("filter-changed", this.config);
  }
}
