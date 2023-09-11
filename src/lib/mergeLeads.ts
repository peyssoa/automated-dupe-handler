import axios from 'axios';
import {IFieldList} from '../interfaces';

export const mergeLeads = async (
  winningLead: IFieldList,
  losingIds: number[],
  mergeInCRM: boolean,
  accessToken: string
) => {
  console.log('Beginning the merge process...');
  const baseUrl = process.env.MARKETO_BASE_URL;
  const winnerId = String(winningLead.id);
  const loserIds = losingIds.map(id => String(id));
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  };

  const response = loserIds.map(id => {
    const url = `${baseUrl}rest/v1/leads/${winnerId}/merge.json?leadId=${id}&mergeInCRM=${mergeInCRM}`;

    return axios
      .post(url, {}, {headers})
      .then(response => {
        const parsedResponse = response.data;
        return parsedResponse;
      })
      .catch(error => {
        console.error(`Error merging leadId ${id}:`, error);
        return {
          success: false,
        }; // or some error value to identify failed requests
      });
  });

  const results = await Promise.all(response);
  return results;
};
