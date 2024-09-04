import { BaseData } from "./basedata";

export interface DocumentData extends BaseData {
    id?:string;
    name?: string;
    createdDate?: Date;
    type: 'document';
    workspaceId: string;
    parentId?: string;
    path: string;

}