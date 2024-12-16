import { utils, writeFile } from 'xlsx';

interface ScheduleEntry {
  content: string;
}

interface OrderItem {
  id: string;
  supplier: string;
  reference: string;
  name: string;
  quantity: number;
  price: number;
}

export function downloadScheduleAsExcel(
  schedule: Record<string, Record<number, ScheduleEntry>>,
  dates: string[],
  groups: Array<{ id: string; name: string; period: string }>
) {
  // Créer les données pour le fichier Excel
  const data = groups.map(group => {
    const row = {
      'Groupe': group.name,
      'Période': group.period
    };

    // Ajouter les colonnes pour chaque date
    dates.forEach((date, index) => {
      row[`${date || `Date ${index + 1}`}`] = schedule[group.id][index + 1]?.content || '';
    });

    return row;
  });

  // Créer un nouveau classeur
  const wb = utils.book_new();
  
  // Créer une nouvelle feuille
  const ws = utils.json_to_sheet(data);

  // Ajuster la largeur des colonnes
  const colWidths = [
    { wch: 15 }, // Groupe
    { wch: 15 }, // Période
    { wch: 30 }, // Date 1
    { wch: 30 }, // Date 2
    { wch: 30 }, // Date 3
    { wch: 30 }, // Date 4
    { wch: 30 }  // Date 5
  ];
  ws['!cols'] = colWidths;

  // Ajouter la feuille au classeur
  utils.book_append_sheet(wb, ws, "Planning des activités");

  // Télécharger le fichier
  writeFile(wb, "planning_activites.xlsx");
}

export function downloadOrderAsExcel(items: OrderItem[]) {
  // Créer les données pour le fichier Excel
  const data = items.map(item => ({
    'Fournisseur': item.supplier,
    'Référence': item.reference,
    'Article': item.name,
    'Quantité': item.quantity,
    'Prix unitaire (€)': item.price,
    'Total (€)': item.quantity * item.price
  }));

  // Ajouter le total général
  const total = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  data.push({
    'Fournisseur': '',
    'Référence': '',
    'Article': '',
    'Quantité': '',
    'Prix unitaire (€)': 'TOTAL',
    'Total (€)': total
  });

  // Créer un nouveau classeur
  const wb = utils.book_new();
  
  // Créer une nouvelle feuille
  const ws = utils.json_to_sheet(data);

  // Ajuster la largeur des colonnes
  const colWidths = [
    { wch: 20 }, // Fournisseur
    { wch: 15 }, // Référence
    { wch: 30 }, // Article
    { wch: 10 }, // Quantité
    { wch: 15 }, // Prix unitaire
    { wch: 15 }  // Total
  ];
  ws['!cols'] = colWidths;

  // Formater les nombres
  const range = utils.decode_range(ws['!ref'] || 'A1:F1');
  for (let R = range.s.r; R <= range.e.r; R++) {
    for (let C = range.s.c; C <= range.e.c; C++) {
      const cell = ws[utils.encode_cell({r: R, c: C})];
      if (cell && typeof cell.v === 'number') {
        cell.z = '#,##0.00€';
      }
    }
  }

  // Ajouter la feuille au classeur
  utils.book_append_sheet(wb, ws, "Bon de commande");

  // Télécharger le fichier
  writeFile(wb, "bon_de_commande.xlsx");
}