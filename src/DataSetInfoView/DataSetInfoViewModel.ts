import { Application } from "provenance_mvvm_framework";
/*
 * @Author: Kiran Gadhave
 * @Date: 2018-06-03 14:36:29
 * @Last Modified by: Kiran Gadhave
 * @Last Modified time: 2018-06-08 11:23:19
 */
import {
  IActionFunctionRegistry,
  IProvenanceGraph,
  ViewModelBase
} from "provenance_mvvm_framework";
import { DataUtils } from "./../DataStructure/DataUtils";
import { IDataSetInfo } from "./../DataStructure/IDataSetInfo";
import { DataSetInfoView } from "./DataSetInfoView";

export class DataSetInfoViewModel extends ViewModelBase {
  public datasets: IDataSetInfo[] = [];
  constructor(view: DataSetInfoView, app: Application) {
    super(view, app);
    this.View.create();
  }
}
