import {IMarketoLead} from '../interfaces';

export const removeLeadsWithoutDuplicates = (
  leads: IMarketoLead[]
): IMarketoLead[] => {
  const leadsWithDuplicates: IMarketoLead[] = [];

  for (let i = 0; i < leads.length; i++) {
    const currentLead = leads[i];
    let isDuplicate = false;

    if (i > 0 && leads[i - 1].email === currentLead.email) {
      isDuplicate = true;
    }

    if (i < leads.length - 1 && leads[i + 1].email === currentLead.email) {
      isDuplicate = true;
    }

    if (isDuplicate) {
      leadsWithDuplicates.push(currentLead);
    }
  }

  return leadsWithDuplicates;
};
