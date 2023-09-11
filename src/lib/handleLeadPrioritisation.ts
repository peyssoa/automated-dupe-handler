import {PRIORITY_FIELD_MAP} from '../constants';

const boolTest = (list: any[]) => {
  for (let i = 0; i < list.length; i++) {
    if (list[i]) {
      return [i, list[i]];
    }
  }
  return [0, list[0]];
};

interface IDatesToCompare {
  date: Date;
  index: number;
}

const createdAt = (list: any[]) => {
  const datesToCompare: IDatesToCompare[] = [];

  list.forEach((item, index) => {
    if (!isNaN(Date.parse(item))) {
      datesToCompare.push({
        date: new Date(item),
        index: index,
      });
    }
  });

  if (datesToCompare.length <= 1) {
    return [0, list[0]];
  }

  const earliestDate = datesToCompare.reduce((a, b) =>
    a.date < b.date ? a : b
  );

  return [earliestDate.index, earliestDate.date];
};

const checkForNumbers = (value: any) => {
  if (typeof value === 'number') {
    return value;
  }

  return typeof value === 'string' ? value.toLowerCase() : value;
};

const notNull = (list: any[]) => {
  const valuesConsideredNull = [
    'none',
    'n/a',
    'empty',
    'unknown',
    '[',
    ']',
    null,
    undefined,
  ];

  // Check for numbers and save each item in the list as a new list
  const newList = list.map(item => (item ? checkForNumbers(item) : item));

  // Check each item in newList, and if it's not in valuesConsideredNull,
  // return the index and value. Otherwise return 0 as the index and the first value in the list
  for (let index = 0; index < newList.length; index++) {
    const listItem = newList[index];
    if (!valuesConsideredNull.includes(listItem)) {
      return [index, listItem];
    }
  }

  return [0, list[0]];
};

/**
 * use the PRIORITY_FIELD_MAP to find the highest priority value and corresponding index
 * among the input lead values for a certain field. Else if none of the input
 * lead values has a prioritized value return the first non-null value and index
 */
const priority = (list: any[], key: string) => {
  const priorityList =
    PRIORITY_FIELD_MAP[key as keyof typeof PRIORITY_FIELD_MAP];

  for (let listItemIndex = 0; listItemIndex < list.length; listItemIndex++) {
    const listItem = list[listItemIndex];

    if (priorityList.includes(listItem)) {
      return [listItemIndex, listItem];
    }
  }

  return notNull(list);
};

const prioritisationRules = {
  Academic_goals__c: notNull,
  sfdcId: notNull,
  Account_Number__c: notNull,
  address: notNull,
  Admissions_goals__c: notNull,
  Allocated__c: notNull,
  anonymousIP: notNull,
  Application_Cycle__c_account: notNull,
  Behavioural_Score__c: notNull,
  billingCity: notNull,
  billingCountry: notNull,
  Birth_Date__c: notNull,
  CGA_Core_Split__c: priority,
  company: notNull,
  Contact_Number__c: notNull,
  Converted_from_MQ_to_SQ__c: notNull,
  Converted_from_SQ_to_WD__c: notNull,
  country: priority,
  Create_CrimsonApp__c: boolTest,
  createdAt: createdAt,
  Currency__c: notNull,
  CurrencyIsoCode_account: notNull,
  CurrencyIsoCode_contact: notNull,
  CurrencyIsoCode: notNull,
  DaScoopComposer__Groove_Convert__c: notNull,
  DaScoopComposer__Groove_Create_Opportunity__c: notNull,
  DaScoopComposer__Groove_Log_a_Call__c: notNull,
  Disqualified_Date__c: createdAt,
  Division__c_account: priority,
  Division__c: priority,
  Email_Opt_Out__c: boolTest,
  email: notNull,
  emailoptin: boolTest,
  End_Date__c: createdAt,
  Enquiry__c: notNull,
  Eventbrite_Status__c: notNull,
  EventbriteSync__EventbriteId__c: notNull,
  Extracurricular_goals__c: notNull,
  First_MTA__c: notNull,
  Gender__c: notNull,
  id: notNull,
  inferredCity: notNull,
  inferredCompany: notNull,
  inferredCountry: notNull,
  inferredPhoneAreaCode: notNull,
  inferredPostalCode: notNull,
  inferredStateRegion: notNull,
  Integration_Source__c: notNull,
  Intended_1st_year_of_study__c: notNull,
  Interests__c: notNull,
  Last_Modified_Date_Months__c: notNull,
  Last_Stage_before_DQ__c: notNull,
  LastNpsSurveySent__c: notNull,
  Latest_NPS_Score__c: notNull,
  Lead_Prioritisation__c: notNull,
  LeadDataMigration__c: notNull,
  leadScore: notNull,
  leadStatus: priority,
  mainPhone: notNull,
  Marketed_by__c: notNull,
  Marketing_Qualified_Date__c: createdAt,
  marketingSuspended: boolTest,
  mkto_si__Add_to_Marketo_Campaign__c: notNull,
  mktoAcquisitionDate: createdAt,
  mktoName: notNull,
  mktoPersonNotes: notNull,
  mobileSMSReady: notNull,
  MTA_Score__c: notNull,
  New_Not_Contacted_Date_Time__c: createdAt,
  Number_of_Touches__c: notNull,
  Number_of_Touches_Formula__c: notNull,
  OperatingRegion__c: notNull,
  originalReferrer: notNull,
  Parent_Email__c: notNull,
  Parent_First_Name__c: notNull,
  Parent_Last_Name__c: notNull,
  Parent_Mobile__c: notNull,
  Parent_Phone__c: notNull,
  Payment_Contact__c: notNull,
  Payment_Method__c: notNull,
  Payment_Status__c: notNull,
  Person_Type__c: notNull,
  personTimeZone: notNull,
  phone: notNull,
  Primary_Contact__c: notNull,
  Primary_Guardian__c: notNull,
  Primary_Interest__c: notNull,
  Primary_Language__c: notNull,
  priority: notNull,
  privacyPolicy: boolTest,
  Programme__c: notNull,
  Qualifies_For_NPS__c: notNull,
  RecordTypeId_account: notNull,
  RecordTypeId: notNull,
  Region_Mapping__c: priority,
  registrationSourceInfo: notNull,
  registrationSourceType: notNull,
  Sales_Accepted_Date__c: createdAt,
  Sales_Funnel_Stage__c: notNull,
  SalesFunnelStage__c: notNull,
  School__c: notNull,
  School_Country__c: notNull,
  School_Type__c: notNull,
  School_Year_Grade_Level__c: notNull,
  Secondary_Language__c: notNull,
  sfdcType: priority,
  Start_Date__c: createdAt,
  Status__c: notNull,
  Status_Attempting_Contact__c: notNull,
  Status_Contacted__c: notNull,
  Status_Converted__c: notNull,
  Status_Disqualified__c: notNull,
  Status_IC_Booked__c: notNull,
  Status_IC_Complete__c: notNull,
  Status_New__c: notNull,
  Student_Contact__c: notNull,
  Student_Email__c: notNull,
  Student_First_Name__c: notNull,
  Student_Last_Name__c: notNull,
  Student_Mobile__c: notNull,
  Student_Phone__c: notNull,
  Sub_Status__c: notNull,
  subscriptionAthletics: notNull,
  subscriptionCGA: notNull,
  subscriptionCrimsonAcademies: notNull,
  subscriptionCrimsonCore: notNull,
  subscriptionCrimsonRise: notNull,
  subscriptionEssayComp: notNull,
  subscriptionEssayCompVisibilityRule: notNull,
  subscriptionInternationalTours: notNull,
  subscriptionMedView: notNull,
  subscriptionPartnerships: notNull,
  subscriptionTGCC: notNull,
  subscriptionTGCCVisibilityRule: notNull,
  Time_to_Attempting_Contact_Hours__c: notNull,
  Time_to_MarketingQualify__c: notNull,
  Time_to_SalesAccepted__c: notNull,
  Unqualified_Reason__c: notNull,
  unsubscribedReason: notNull,
  updatedAt: createdAt,
  urgency: notNull,
  Year_of_Graduation__c: notNull,
};

const handleLeadPrioritisation = (fieldKey: string, fieldList: any[]) => {
  try {
    /** @ts-expect-error - just converted directly from py script */
    return prioritisationRules[fieldKey](fieldList, fieldKey);
  } catch (error) {
    console.error(error);
  }
};

export default handleLeadPrioritisation;
