import { BaseData } from "./basedata";

export interface LoadDirectory{
    parentDirectory?: BaseData;
    nested_documents?: BaseData[];
    nested_directories?: BaseData[];
  }