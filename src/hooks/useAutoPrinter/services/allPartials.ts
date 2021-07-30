import {hbsRegex} from './hbsRegex';
export const allPartials = (txtMaster: string) => 
    txtMaster.match(hbsRegex);
