"use server";
export interface Country {
  name: string;
  dialCode: string;
  code: string;
}
export async function getCountryCodes(){
 const res = await fetch(
   "https://restcountries.com/v3.1/all?fields=name,idd,cca2"   
 );

 if (!res.ok) {
   throw new Error("Failed to fetch countries");
 }

 const data = await res.json();

 const countries: Country[] = data
   .map((country: any) => {
     const name = country.name?.common || "Unknown";
     const code = country.cca2;

     const root = country.idd?.root || "";
     const suffixes = country.idd?.suffixes;

     if (!root || !suffixes || suffixes.length === 0) {
       return null; 
     }

     
     const dialCode = `${root}${suffixes[0]}`;

     return { name, code, dialCode };
   })
   .filter(Boolean)
   .sort((a : any, b:any) => a!.name.localeCompare(b!.name));

 return countries;
}