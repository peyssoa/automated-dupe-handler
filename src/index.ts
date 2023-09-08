import * as dotenv from 'dotenv';
import {generateAccessToken} from './lib/marketoAuth';
import {getLeads} from './lib/getLeads';
import {sortLeadsByEmail} from './lib/sortLeadsByEmail';
import {removeLeadsWithoutDuplicates} from './lib/removeLeadsWithoutDuplicates';
import {mergeDuplicates} from './lib/mergeDuplicates';

dotenv.config();

export async function handleDuplicates() {
  const accessToken = await generateAccessToken();

  const leads = await getLeads(accessToken);
  const sortedLeads = sortLeadsByEmail(leads);
  const leadsWithDuplicates = removeLeadsWithoutDuplicates(sortedLeads);
  await mergeDuplicates(leadsWithDuplicates, accessToken);
}

handleDuplicates();
