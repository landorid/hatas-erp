export const endpoint = `http://localhost:4000`;
export const roles = [
  { id: 'FRONTOFFICE', name: 'FrontOffice' },
  { id: 'SALES', name: 'Sales' },
  { id: 'GRAPHICDESIGNER', name: 'Grafikus' },
  { id: 'OPERATOR', name: 'Gyártás' },
  { id: 'DECOR', name: 'Dekor' },
];
export const permissions = [
  { id: 'ADMIN', name: 'Adminisztrátor' },
  { id: 'USER', name: 'Felhasználó' },
];

export const fieldTypes = [
  { id: 'text', name: 'Szöveg' },
  { id: 'textarea', name: 'Szövegterület' },
  { id: 'stockitem', name: 'Alapanyag' },
  { id: 'deadline', name: 'Határidő' },
];

export const tableLabels = {
  textLabels: {
    body: {
      noMatch: 'Sajnos nem találtunk semmit!',
      toolTip: 'Rendezés',
    },
    pagination: {
      next: 'Következő Oldal',
      previous: 'Előző Oldal',
      rowsPerPage: 'Megjelenítés:',
      displayRows: '/',
    },
    toolbar: {
      search: 'Keresés',
      downloadCsv: 'CSV letöltés',
      print: 'Nyomtatás',
      viewColumns: 'Megjelenő oszlopok',
      filterTable: 'Szűrés',
    },
    filter: {
      all: 'Összes',
      title: 'SZŰRŐK',
      reset: 'VISSZAÁLLÍT',
    },
    viewColumns: {
      title: 'Megjelenő oszlopok',
      titleAria: 'Elrejtés/megjelenítés',
    },
  },
};

export const SUPPORTED_FORMATS = [
  "image/jpg",
  "image/jpeg",
  "image/gif",
  "image/png"
];