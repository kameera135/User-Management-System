export interface IExtensions {

    initiallizeComponents:()=>void; //Initializes components and variables in the form

    initialDataLoading:()=>void; // Loads data at the page loading

    loadTableGridParameters:()=>void; // Set message parameters for the common table component

    loadFormInformation:()=>void; //Load information required for the form

    loadData:()=> Boolean;//Loads data for the main grid of the page

}