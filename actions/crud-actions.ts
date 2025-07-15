
export function createData(
  key: string,
  newRecord: any,
  identifier: any,
) {
  const existing = localStorage.getItem(key);
  const records = existing ? JSON.parse(existing) : [];

  const exists = records.some(
    (record : any) => record[identifier] === newRecord[identifier]
  );

  if (!exists) {
    records.push(newRecord);
    localStorage.setItem(key, JSON.stringify(records));
   return{status:200}
  } else {
    return {status:409}
  }
}


export function getData(
  key: string,
  identifier?: any,
  value?: any
) {
  const data = localStorage.getItem(key);
  if (!data) return null;

  const parsed = JSON.parse(data);

  if (identifier && value !== undefined) {
    
    const result = parsed.filter((item:any) => item[identifier] === value);
    
    return result.length === 1 ? result[0] : result;
  }

  return parsed;
}

export function updateData(
  key: string,
  identifier: any,
  value: any,
  updatedFields: any
) {
  const existing = localStorage.getItem(key);
  if (!existing) return {status:404};

  const records = JSON.parse(existing);
  const updatedRecords = records.map((record : any) =>
    record[identifier] === value ? { ...record, ...updatedFields } : record
  );

  localStorage.setItem(key, JSON.stringify(updatedRecords));
   return { status: 200 };
}

export function deleteData(
  key: string,
  identifier: any,
  value: any
) {
  const existing = localStorage.getItem(key);
  if (!existing) return{status:404};

  const records = JSON.parse(existing);
  const filtered = records.filter((record : any) => record[identifier] !== value);

  localStorage.setItem(key, JSON.stringify(filtered));
  return{status:200}
}
