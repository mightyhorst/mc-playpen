import { DefaultValue } from "recoil";

export const isDefault = (val: any|DefaultValue) => val instanceof DefaultValue;
