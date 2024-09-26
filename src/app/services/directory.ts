import { BaseData } from "./basedata";

export interface Directory extends BaseData {
    nested_documents?: BaseData[];
    nested_directories?: BaseData[];
  }