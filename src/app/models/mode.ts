import { Zone } from "./zone";

export interface Mode{
    userId : string;
    name : string;
    zones : Zone[];
    creationDate : Date;
    id : string;
}