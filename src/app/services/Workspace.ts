import { BaseData } from "./basedata";

export interface Directory extends BaseData {
    id?:string;
    name?: string;
    description?: string;
    createdDate?: Date;
  
}