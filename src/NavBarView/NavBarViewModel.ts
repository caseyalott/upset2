/*
 * @Author: Kiran Gadhave
 * @Date: 2018-06-03 14:38:33
 * @Last Modified by: Kiran Gadhave
 * @Last Modified time: 2018-07-16 11:15:54
 */
import { ViewModelBase, Application } from "provenance_mvvm_framework";
import { DataUtils } from "./../DataStructure/DataUtils";
import { IDataSetInfo } from "./../DataStructure/IDataSetInfo";
import { IDataSetJSON } from "./../DataStructure/IDataSetJSON";
import { NavBarView } from "./NavBarView";
import "./styles.scss";
export class NavBarViewModel extends ViewModelBase {
  public datasets: IDataSetInfo[] = [];
  constructor(view: NavBarView, app: Application, dsLocation: string) {
    super(view, app);
    this.populateDatasetSelector(dsLocation);
    this.comm.on("change-dataset", dataset => {
      this.App.emit("change-dataset", dataset);
    });
  }

  populateDatasetSelector(dsLocation: string) {
    let results: Promise<any>[] = [];
    let p = fetch(dsLocation)
      .then(results => results.json())
      .then(jsondata => {
        jsondata.forEach((d: string) => {
          let a = fetch(d).then(res => res.json());
          results.push(a);
        });
      })
      .then(() => {
        Promise.all(results)
          .then(d => {
            d.forEach(j => {
              let a: IDataSetJSON = DataUtils.getDataSetJSON(j);
              this.datasets.push(DataUtils.getDataSetInfo(a));
            });
          })
          .then(() => {
            this.comm.emit("update", this.datasets);
          });
      });
  }
}
