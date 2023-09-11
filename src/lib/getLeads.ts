import {IAccessToken, IMarketoLead} from '../interfaces';
import axios from 'axios';

const fieldList = [
  'company',
  'billingCity',
  'billingCountry',
  'mainPhone',
  'id',
  'mktoName',
  'email',
  'phone',
  'address',
  'city',
  'country',
  'originalSourceType',
  'originalSourceInfo',
  'registrationSourceType',
  'registrationSourceInfo',
  'originalSearchEngine',
  'originalReferrer',
  'unsubscribedReason',
  'marketingSuspended',
  'mktoPersonNotes',
  'sfdcType',
  'anonymousIP',
  'inferredCompany',
  'inferredCountry',
  'inferredCity',
  'inferredStateRegion',
  'inferredPostalCode',
  'inferredPhoneAreaCode',
  'createdAt',
  'updatedAt',
  'leadSource',
  'leadStatus',
  'leadScore',
  'urgency',
  'priority',
  'mktoAcquisitionDate',
  'marketingSuspendedReason',
  'personTimeZone',
  'CurrencyIsoCode',
  'School__c',
  'School_Type__c',
  'Division__c',
  'Primary_Interest__c',
  'Email_Opt_Out__c',
  'Primary_Contact__c',
  'Unqualified_Reason__c',
  'Person_Type__c',
  'Region_Mapping__c',
  'Region__c',
  'Lead_Source_Category__c',
  'Integration_Source__c',
  'Intended_1st_year_of_study__c',
  'Parent_Email__c',
  'Parent_First_Name__c',
  'Parent_Last_Name__c',
  'Parent_Phone__c',
  'EventbriteSync__EventbriteId__c',
  'Birth_Date__c',
  'Eventbrite_Status__c',
  'Gender__c',
  'Sales_Funnel_Stage__c',
  'CurrencyIsoCode_account',
  'Currency__c',
  'CurrencyIsoCode_contact',
  'School_Country__c',
  'Account_Number__c',
  'New_Not_Contacted_Date_Time__c',
  'Contact_Number__c',
  'mkto_si__Add_to_Marketo_Campaign__c',
  'RecordTypeId',
  'Student_Email__c',
  'Student_First_Name__c',
  'Student_Last_Name__c',
  'End_Date__c',
  'Start_Date__c',
  'Behavioural_Score__c',
  'Status__c',
  'Sub_Status__c',
  'Programme__c',
  'Interests__c',
  'Division__c_account',
  'Primary_Language__c',
  'Secondary_Language__c',
  'RecordTypeId_account',
  'Payment_Method__c',
  'Payment_Status__c',
  'Year_of_Graduation__c',
  'Allocated__c',
  'Latest_NPS_Score__c',
  'Primary_Guardian__c',
  'Converted_from_MQ_to_SQ__c',
  'Converted_from_SQ_to_WD__c',
  'Student_Contact__c',
  'Application_Cycle__c_account',
  'Number_of_Touches__c',
  'Enquiry__c',
  'School_Year_Grade_Level__c',
  'Marketing_Qualified_Date__c',
  'Disqualified_Date__c',
  'OperatingRegion__c',
  'Sales_Accepted_Date__c',
  'privacyPolicy',
  'emailoptin',
  'LeadDataMigration__c',
  'Parent_Mobile__c',
  'Student_Mobile__c',
  'Student_Phone__c',
  'Payment_Contact__c',
  'First_MTA__c',
  'Last_MTA__c',
  'First_Lead_Source_Category__c',
  'First_Lead_Source__c',
  'Last_LeadSourceCategory__c',
  'Last_LeadSource__c',
  'First_Lead_Source_Detail__c',
  'Last_MKT_UTM_Campaign__c',
  'subscriptionCGA',
  'subscriptionCrimsonCore',
  'subscriptionMedView',
  'subscriptionAthletics',
  'subscriptionCrimsonAcademies',
  'subscriptionCrimsonRise',
  'subscriptionInternationalTours',
  'Marketed_by__c',
  'SalesFunnelStage__c',
  'Time_to_MarketingQualify__c',
  'Time_to_SalesAccepted__c',
  'Lead_Prioritisation__c',
  'MTA_Score__c',
  'Number_of_Touches_Formula__c',
  'CGA_Core_Split__c',
  'Total_MTA_Count_CGA__c',
  'Total_MTA_Count_CrimsonCore__c',
  'Last_Stage_before_DQ__c',
  'Status_Attempting_Contact__c',
  'Status_Contacted__c',
  'Status_Converted__c',
  'Status_Disqualified__c',
  'Status_IC_Booked__c',
  'Status_IC_Complete__c',
  'Status_New__c',
  'Create_CrimsonApp__c',
  'subscriptionPartnerships',
  'subscriptionTGCC',
  'subscriptionEssayComp',
  'LastNpsSurveySent__c',
  'Qualifies_For_NPS__c',
  'Academic_goals__c',
  'Admissions_goals__c',
  'Extracurricular_goals__c',
  'subscriptionEssayCompVisibilityRule',
  'subscriptionTGCCVisibilityRule',
  'Time_to_Attempting_Contact_Hours__c',
  'First_Touch_Detail__c',
  'Last_Modified_Date_Months__c',
  'DaScoopComposer__Groove_Convert__c',
  'DaScoopComposer__Groove_Log_a_Call__c',
  'DaScoopComposer__Groove_Create_Opportunity__c',
  'mobileSMSReady',
  'sfdcId',
];

const LEADS: IMarketoLead[] = [];
export const getLeads = async (
  accessToken: IAccessToken,
  nextPageToken?: string
) => {
  const baseUrl = process.env.MARKETO_BASE_URL;
  const staticListId = process.env.MARKETO_STATIC_LIST_ID;
  const url = `${baseUrl}rest/v1/lists/${staticListId}/leads.json`;
  const urlWithQueryParams = new URL(url);

  const fieldsToRetrieve = fieldList.join(',');
  const batchSize = 300;

  urlWithQueryParams.searchParams.append('fields', fieldsToRetrieve);
  urlWithQueryParams.searchParams.append('batchSize', batchSize.toString());

  // Add nextPageToken if it exists
  if (nextPageToken) {
    urlWithQueryParams.searchParams.append('nextPageToken', nextPageToken);
  }

  // Add the access token to the request header
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken.accessToken}`,
    },
  };

  const response = await axios.get(urlWithQueryParams.toString(), config);
  const data = response.data;

  if (response.status !== 200) {
    throw new Error(
      `Problem when getting Marketo leads: ${JSON.stringify(response)}`
    );
  }

  LEADS.push(...data.result);

  if (data.nextPageToken) {
    console.log('There are more leads to retrieve - getting another 300');
    // Recursive call to get the next page of leads
    await getLeads(accessToken, data.nextPageToken);
  }

  return LEADS;
};
