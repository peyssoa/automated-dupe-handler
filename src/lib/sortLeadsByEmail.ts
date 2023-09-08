import {IMarketoLead} from '../interfaces';

export const sortLeadsByEmail = (leads: IMarketoLead[]): IMarketoLead[] => {
  return leads.sort((a: IMarketoLead, b: IMarketoLead) => {
    if (a.email < b.email) {
      return -1;
    } else if (a.email > b.email) {
      return 1;
    } else {
      return 0;
    }
  });
};
