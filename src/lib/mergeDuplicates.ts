import {createWriteStream} from 'fs';
import {IAccessToken, IFieldList, IMarketoLead} from '../interfaces';
import {
  appendLeadToMasterList,
  convertIdsToIntegers,
  isTokenExpiredOrAboutToExpire,
  resetFieldValues,
  sleep,
} from '../utils';
import {generateAccessToken} from './marketoAuth';
import {selectWinningLead} from './selectWinningLeads';
import {mergeLeads} from './mergeLeads';
import {createUpdateLead} from './createUpdateLead';

const LOG_FILE_NAME = new Date().toISOString();

let fieldList: IFieldList = {
  company: [],
  billingCity: [],
  billingCountry: [],
  mainPhone: [],
  id: [],
  mktoName: [],
  email: [],
  phone: [],
  address: [],
  city: [],
  country: [],
  originalSourceType: [],
  originalSourceInfo: [],
  registrationSourceType: [],
  registrationSourceInfo: [],
  originalSearchEngine: [],
  originalReferrer: [],
  unsubscribedReason: [],
  marketingSuspended: [],
  mktoPersonNotes: [],
  sfdcType: [],
  anonymousIP: [],
  inferredCompany: [],
  inferredCountry: [],
  inferredCity: [],
  inferredStateRegion: [],
  inferredPostalCode: [],
  inferredPhoneAreaCode: [],
  createdAt: [],
  updatedAt: [],
  leadSource: [],
  leadStatus: [],
  leadScore: [],
  urgency: [],
  priority: [],
  mktoAcquisitionDate: [],
  marketingSuspendedReason: [],
  personTimeZone: [],
  CurrencyIsoCode: [],
  School__c: [],
  School_Type__c: [],
  Division__c: [],
  Primary_Interest__c: [],
  Email_Opt_Out__c: [],
  Primary_Contact__c: [],
  Unqualified_Reason__c: [],
  Person_Type__c: [],
  Region_Mapping__c: [],
  Region__c: [],
  Lead_Source_Category__c: [],
  Integration_Source__c: [],
  Intended_1st_year_of_study__c: [],
  Parent_Email__c: [],
  Parent_First_Name__c: [],
  Parent_Last_Name__c: [],
  Parent_Phone__c: [],
  EventbriteSync__EventbriteId__c: [],
  Birth_Date__c: [],
  Eventbrite_Status__c: [],
  Gender__c: [],
  Sales_Funnel_Stage__c: [],
  CurrencyIsoCode_account: [],
  Currency__c: [],
  CurrencyIsoCode_contact: [],
  School_Country__c: [],
  Account_Number__c: [],
  New_Not_Contacted_Date_Time__c: [],
  Contact_Number__c: [],
  mkto_si__Add_to_Marketo_Campaign__c: [],
  RecordTypeId: [],
  Student_Email__c: [],
  Student_First_Name__c: [],
  Student_Last_Name__c: [],
  End_Date__c: [],
  Start_Date__c: [],
  Behavioural_Score__c: [],
  Status__c: [],
  Sub_Status__c: [],
  Programme__c: [],
  Interests__c: [],
  Division__c_account: [],
  Primary_Language__c: [],
  Secondary_Language__c: [],
  RecordTypeId_account: [],
  Payment_Method__c: [],
  Payment_Status__c: [],
  Year_of_Graduation__c: [],
  Allocated__c: [],
  Latest_NPS_Score__c: [],
  Primary_Guardian__c: [],
  Converted_from_MQ_to_SQ__c: [],
  Converted_from_SQ_to_WD__c: [],
  Student_Contact__c: [],
  Application_Cycle__c_account: [],
  Number_of_Touches__c: [],
  Enquiry__c: [],
  School_Year_Grade_Level__c: [],
  Marketing_Qualified_Date__c: [],
  Disqualified_Date__c: [],
  OperatingRegion__c: [],
  Sales_Accepted_Date__c: [],
  privacyPolicy: [],
  emailoptin: [],
  LeadDataMigration__c: [],
  Parent_Mobile__c: [],
  Student_Mobile__c: [],
  Student_Phone__c: [],
  Payment_Contact__c: [],
  First_MTA__c: [],
  Last_MTA__c: [],
  First_Lead_Source_Category__c: [],
  First_Lead_Source__c: [],
  Last_LeadSourceCategory__c: [],
  Last_LeadSource__c: [],
  First_Lead_Source_Detail__c: [],
  Last_MKT_UTM_Campaign__c: [],
  subscriptionCGA: [],
  subscriptionCrimsonCore: [],
  subscriptionMedView: [],
  subscriptionAthletics: [],
  subscriptionCrimsonAcademies: [],
  subscriptionCrimsonRise: [],
  subscriptionInternationalTours: [],
  Marketed_by__c: [],
  SalesFunnelStage__c: [],
  Time_to_MarketingQualify__c: [],
  Time_to_SalesAccepted__c: [],
  Lead_Prioritisation__c: [],
  MTA_Score__c: [],
  Number_of_Touches_Formula__c: [],
  CGA_Core_Split__c: [],
  Total_MTA_Count_CGA__c: [],
  Total_MTA_Count_CrimsonCore__c: [],
  Last_Stage_before_DQ__c: [],
  Status_Attempting_Contact__c: [],
  Status_Contacted__c: [],
  Status_Converted__c: [],
  Status_Disqualified__c: [],
  Status_IC_Booked__c: [],
  Status_IC_Complete__c: [],
  Status_New__c: [],
  Create_CrimsonApp__c: [],
  subscriptionPartnerships: [],
  subscriptionTGCC: [],
  subscriptionEssayComp: [],
  LastNpsSurveySent__c: [],
  Qualifies_For_NPS__c: [],
  Academic_goals__c: [],
  Admissions_goals__c: [],
  Extracurricular_goals__c: [],
  subscriptionEssayCompVisibilityRule: [],
  subscriptionTGCCVisibilityRule: [],
  Time_to_Attempting_Contact_Hours__c: [],
  First_Touch_Detail__c: [],
  Last_Modified_Date_Months__c: [],
  DaScoopComposer__Groove_Convert__c: [],
  DaScoopComposer__Groove_Log_a_Call__c: [],
  DaScoopComposer__Groove_Create_Opportunity__c: [],
  mobileSMSReady: [],
  sfdcId: [],
};

let finalList: IFieldList = {
  company: [],
  billingCity: [],
  billingCountry: [],
  mainPhone: [],
  id: [],
  mktoName: [],
  email: [],
  phone: [],
  address: [],
  city: [],
  country: [],
  originalSourceType: [],
  originalSourceInfo: [],
  registrationSourceType: [],
  registrationSourceInfo: [],
  originalSearchEngine: [],
  originalReferrer: [],
  unsubscribedReason: [],
  marketingSuspended: [],
  mktoPersonNotes: [],
  sfdcType: [],
  anonymousIP: [],
  inferredCompany: [],
  inferredCountry: [],
  inferredCity: [],
  inferredStateRegion: [],
  inferredPostalCode: [],
  inferredPhoneAreaCode: [],
  createdAt: [],
  updatedAt: [],
  leadSource: [],
  leadStatus: [],
  leadScore: [],
  urgency: [],
  priority: [],
  mktoAcquisitionDate: [],
  marketingSuspendedReason: [],
  personTimeZone: [],
  CurrencyIsoCode: [],
  School__c: [],
  School_Type__c: [],
  Division__c: [],
  Primary_Interest__c: [],
  Email_Opt_Out__c: [],
  Primary_Contact__c: [],
  Unqualified_Reason__c: [],
  Person_Type__c: [],
  Region_Mapping__c: [],
  Region__c: [],
  Lead_Source_Category__c: [],
  Integration_Source__c: [],
  Intended_1st_year_of_study__c: [],
  Parent_Email__c: [],
  Parent_First_Name__c: [],
  Parent_Last_Name__c: [],
  Parent_Phone__c: [],
  EventbriteSync__EventbriteId__c: [],
  Birth_Date__c: [],
  Eventbrite_Status__c: [],
  Gender__c: [],
  Sales_Funnel_Stage__c: [],
  CurrencyIsoCode_account: [],
  Currency__c: [],
  CurrencyIsoCode_contact: [],
  School_Country__c: [],
  Account_Number__c: [],
  New_Not_Contacted_Date_Time__c: [],
  Contact_Number__c: [],
  mkto_si__Add_to_Marketo_Campaign__c: [],
  RecordTypeId: [],
  Student_Email__c: [],
  Student_First_Name__c: [],
  Student_Last_Name__c: [],
  End_Date__c: [],
  Start_Date__c: [],
  Behavioural_Score__c: [],
  Status__c: [],
  Sub_Status__c: [],
  Programme__c: [],
  Interests__c: [],
  Division__c_account: [],
  Primary_Language__c: [],
  Secondary_Language__c: [],
  RecordTypeId_account: [],
  Payment_Method__c: [],
  Payment_Status__c: [],
  Year_of_Graduation__c: [],
  Allocated__c: [],
  Latest_NPS_Score__c: [],
  Primary_Guardian__c: [],
  Converted_from_MQ_to_SQ__c: [],
  Converted_from_SQ_to_WD__c: [],
  Student_Contact__c: [],
  Application_Cycle__c_account: [],
  Number_of_Touches__c: [],
  Enquiry__c: [],
  School_Year_Grade_Level__c: [],
  Marketing_Qualified_Date__c: [],
  Disqualified_Date__c: [],
  OperatingRegion__c: [],
  Sales_Accepted_Date__c: [],
  privacyPolicy: [],
  emailoptin: [],
  LeadDataMigration__c: [],
  Parent_Mobile__c: [],
  Student_Mobile__c: [],
  Student_Phone__c: [],
  Payment_Contact__c: [],
  First_MTA__c: [],
  Last_MTA__c: [],
  First_Lead_Source_Category__c: [],
  First_Lead_Source__c: [],
  Last_LeadSourceCategory__c: [],
  Last_LeadSource__c: [],
  First_Lead_Source_Detail__c: [],
  Last_MKT_UTM_Campaign__c: [],
  subscriptionCGA: [],
  subscriptionCrimsonCore: [],
  subscriptionMedView: [],
  subscriptionAthletics: [],
  subscriptionCrimsonAcademies: [],
  subscriptionCrimsonRise: [],
  subscriptionInternationalTours: [],
  Marketed_by__c: [],
  SalesFunnelStage__c: [],
  Time_to_MarketingQualify__c: [],
  Time_to_SalesAccepted__c: [],
  Lead_Prioritisation__c: [],
  MTA_Score__c: [],
  Number_of_Touches_Formula__c: [],
  CGA_Core_Split__c: [],
  Total_MTA_Count_CGA__c: [],
  Total_MTA_Count_CrimsonCore__c: [],
  Last_Stage_before_DQ__c: [],
  Status_Attempting_Contact__c: [],
  Status_Contacted__c: [],
  Status_Converted__c: [],
  Status_Disqualified__c: [],
  Status_IC_Booked__c: [],
  Status_IC_Complete__c: [],
  Status_New__c: [],
  Create_CrimsonApp__c: [],
  subscriptionPartnerships: [],
  subscriptionTGCC: [],
  subscriptionEssayComp: [],
  LastNpsSurveySent__c: [],
  Qualifies_For_NPS__c: [],
  Academic_goals__c: [],
  Admissions_goals__c: [],
  Extracurricular_goals__c: [],
  subscriptionEssayCompVisibilityRule: [],
  subscriptionTGCCVisibilityRule: [],
  Time_to_Attempting_Contact_Hours__c: [],
  First_Touch_Detail__c: [],
  Last_Modified_Date_Months__c: [],
  DaScoopComposer__Groove_Convert__c: [],
  DaScoopComposer__Groove_Log_a_Call__c: [],
  DaScoopComposer__Groove_Create_Opportunity__c: [],
  mobileSMSReady: [],
  sfdcId: [],
};

export const mergeDuplicates = async (
  duplicates: IMarketoLead[],
  token: IAccessToken
) => {
  const accessToken: IAccessToken = token;

  try {
    const listLength = duplicates.length;
    
    if (!listLength) {
      throw new Error('No duplicates to merge');
    }
    console.log('Number of duplicates to process: ', listLength);
    console.log('Beginning the duplicate handling process...');

    for (
      let duplicateIndex = 0;
      duplicateIndex < listLength;
      duplicateIndex++
    ) {

      // 2. Reset the fieldList and finalList
      fieldList = resetFieldValues(fieldList);
      finalList = resetFieldValues(finalList);

      // 3. Get the current duplicate in the fieldList
      fieldList = appendLeadToMasterList(fieldList, duplicates[duplicateIndex]);
      let proceedingIndex = duplicateIndex + 1;
      while (
        proceedingIndex < listLength &&
        duplicates[duplicateIndex].email === duplicates[proceedingIndex].email
      ) {
        appendLeadToMasterList(fieldList, duplicates[proceedingIndex]);
        proceedingIndex += 1;
      }
      duplicateIndex = proceedingIndex - 1;

      // 4. Sometimes the ID values aren't integers (floats, strings etc..),
      // so we need to convert them
      fieldList = convertIdsToIntegers(fieldList);

      // 5. Select the winning lead and add it to the finalList
      // const final = selectWinningLead(fieldList, finalList);
      finalList = selectWinningLead(fieldList, finalList);

      // 6. Log the values from each lead for all fields of interest to a file named by the current datetime
      const logFile = createWriteStream(`./src/logs/${LOG_FILE_NAME}.txt`, {
        flags: 'a',
      });
      logFile.write('Winning and losing lead information:\n');
      logFile.write(JSON.stringify(fieldList));
      logFile.write('\n\n');
      logFile.write('Winning ID to be updated after merging:\n');

      const duplicateIds = fieldList['id'];
      const loserIds = duplicateIds.filter(id => id !== finalList['id']);

      logFile.write('\n');
      logFile.write(JSON.stringify(finalList));
      logFile.write('\n\n');

      // 7. Merge the leads
      const res = await mergeLeads(
        finalList,
        loserIds,
        true,
        accessToken.accessToken
      );
      logFile.write('Response from mergeLeads:\n');
      logFile.write(JSON.stringify(res));
      logFile.write('\n\n');

      if (res.some((response) => (response && response.success === false))) {
        logFile.write('Error merging leads:\n');
        logFile.write(
          '---------------------------------------------------------------------------------------\n\n'
        );
        logFile.write('\n\n');
        logFile.end();
      } else {
        const createUpdateLeadResponse = await createUpdateLead(
          finalList,
          accessToken.accessToken
        );
        logFile.write('Updating Response:\n');
        logFile.write(JSON.stringify(createUpdateLeadResponse));
        logFile.write('\n\n');
        let n = 0;

        while (
          createUpdateLeadResponse.success === 'skipped' &&
          n < loserIds.length
        ) {
          // do more
          finalList['id'] = loserIds[n];
          logFile.write(finalList);
          logFile.write('\n\n');
          const res = await createUpdateLead(
            finalList,
            accessToken.accessToken
          );
          logFile.write('Updating Skipped Response:\n');
          logFile.write(JSON.stringify(res));
          logFile.write('\n\n');
          n = n + 1;
        }
        logFile.write('Successfully merged leads:\n');
        logFile.write(
          '---------------------------------------------------------------------------------------\n\n'
        );
        logFile.write('\n\n');
        logFile.end();
      }

      // 8. Check for the token again
      if (
        !accessToken?.accessToken ||
        isTokenExpiredOrAboutToExpire(accessToken.tokenExpiry)
      ) {
        console.log('Token is about to expire. Waiting...');
        const now = new Date().getTime();
        const timeToWait = accessToken.tokenExpiry.getTime() - now;
        if (timeToWait > 0) {
          await sleep(timeToWait + 1000);
        }

        // Generate a new token after waiting
        await generateAccessToken();
        console.log('New token has been generated');
      }
    }

    console.log("Process Complete");
  } catch (error) {
    console.error('mergeDuplicates: ', error);
  }
};
