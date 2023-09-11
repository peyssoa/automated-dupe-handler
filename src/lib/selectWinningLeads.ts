import {SKIPPABLE_KEYS} from '../constants';
import {IFieldList} from '../interfaces';
import {allValuesAreEqual} from '../utils';
import handleLeadPrioritisation from './handleLeadPrioritisation';

export const selectWinningLead = (fieldList: IFieldList, final: IFieldList) => {
  const finalList = {...final};
  for (const key in fieldList) {
    const valuesAreEqual = allValuesAreEqual(fieldList[key]);

    if (key !== 'sfdcLeadId' && valuesAreEqual) {
      // All elements in fieldList[key] are the same as the first one,
      // so just choose the first one by default
      finalList[key] = fieldList[key][0];
    } else {
      if (SKIPPABLE_KEYS.includes(key)) {
        continue;
      }

      switch (key) {
        case 'country':
          {
            const [index, value] = handleLeadPrioritisation(
              key,
              fieldList[key]
            );
            finalList[key] = value;
            finalList['city'] = fieldList['city'][index];
            finalList['Region__c'] = fieldList['Region__c'][index];
          }
          break;
        case 'createdAt':
          {
            const [index, value] = handleLeadPrioritisation(
              key,
              fieldList[key]
            );
            finalList[key] = value;
            finalList['First_Lead_Source__c'] =
              fieldList['First_Lead_Source__c'][index];
            finalList['First_Lead_Source_Category__c'] =
              fieldList['First_Lead_Source_Category__c'][index];
            finalList['First_Lead_Source_Detail__c'] =
              fieldList['First_Lead_Source_Detail__c'][index];
            finalList['First_Touch_Detail__c'] =
              fieldList['First_Touch_Detail__c'][index];
            finalList['id'] = fieldList['id'][index];
            finalList['Lead_Source_Category__c'] =
              fieldList['Lead_Source_Category__c'][index];
            finalList['leadSource'] = fieldList['leadSource'][index];
          }
          break;
        case 'updatedAt':
          {
            const [index, value] = handleLeadPrioritisation(
              key,
              fieldList[key]
            );
            finalList[key] = value;
            finalList['Last_LeadSource__c'] =
              fieldList['Last_LeadSource__c'][index];
            finalList['Last_LeadSourceCategory__c'] =
              fieldList['Last_LeadSourceCategory__c'][index];
            finalList['Last_MKT_UTM_Campaign__c'] =
              fieldList['Last_MKT_UTM_Campaign__c'][index];
            finalList['Last_MTA__c'] = fieldList['Last_MTA__c'][index];
            finalList['Total_MTA_Count_CGA__c'] =
              fieldList['Total_MTA_Count_CGA__c'][index];
            finalList['Total_MTA_Count_CrimsonCore__c'] =
              fieldList['Total_MTA_Count_CrimsonCore__c'][index];
          }
          break;
        case 'marketingSuspended':
          {
            const [index, value] = handleLeadPrioritisation(
              key,
              fieldList[key]
            );
            finalList[key] = value;
            finalList['marketingSuspendedReason'] =
              fieldList['marketingSuspendedReason'][index];
          }
          break;
        case 'originalReferrer':
          {
            const [index, value] = handleLeadPrioritisation(
              key,
              fieldList[key]
            );
            finalList[key] = value;
            finalList['originalSearchEngine'] =
              fieldList['originalSearchEngine'][index];
            finalList['originalSourceInfo'] =
              fieldList['originalSourceInfo'][index];

            if (fieldList['originalSourceType']) {
              finalList['originalSourceType'] =
                fieldList['originalSourceType'][index];
            }
          }
          break;
        default:
          finalList[key] = handleLeadPrioritisation(key, fieldList[key])[1];
          break;
      }
    }
  }

  // if final list has no id, then we need to add one.
  if (!finalList.id || finalList.id.length === 0) {
    finalList.id = fieldList.id[0];
  }

  return finalList;
};
