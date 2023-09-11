import axios from 'axios';
import {IFieldList} from '../interfaces';

export const createUpdateLead = async (
  lead: IFieldList,
  accessToken: string
) => {
  const baseUrl = process.env.MARKETO_BASE_URL;
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  };

  const url = `${baseUrl}rest/v1/leads.json`;

  const response = await axios
    .post(
      url,
      {
        action: 'updateOnly',
        lookupField: 'id',
        input: [lead],
      },
      {headers}
    )
    .then(response => {
      const parsedResponse = response.data;
      return parsedResponse;
    })
    .catch(error => {
      console.error(`Error updating leadId: ${lead.id}`, error);
      return null;
    });

  return response;
};
