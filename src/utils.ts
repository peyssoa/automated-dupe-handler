import {IFieldList, IMarketoLead} from './interfaces';

export const isTokenExpiredOrAboutToExpire = (tokenExpiry: Date) => {
  const now = new Date();
  const expiryDate = new Date(tokenExpiry);

  // Add a 60 seconds buffer
  return now >= new Date(expiryDate.getTime() - 60000);
};

export const resetFieldValues = (masterList: IFieldList) => {
  return Object.keys(masterList).reduce((acc, key) => {
    acc[key as keyof IFieldList] = [];
    return acc;
  }, masterList);
};

export const appendLeadToMasterList = (
  masterList: IFieldList,
  lead: IMarketoLead
) => {
  const newList = {...masterList};

  Object.keys(lead).forEach(key => {
    if (key in newList) {
      newList[key].push(lead[key]);
    }
  });

  return newList;
};

export const convertIdsToIntegers = (masterList: IFieldList) => {
  const newList = {...masterList};

  const idList = newList.id;
  const convertedIdList = idList.map(id => parseInt(id, 10));
  newList.id = convertedIdList;

  return newList;
};

export const allValuesAreEqual = <T>(values: T[]): boolean => {
  if (values.length <= 1) {
    return true;
  }
  return values.every(val => val === values[0]);
};

export const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
