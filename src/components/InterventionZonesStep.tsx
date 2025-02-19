import type { NGOInterventionZone } from '../types/user';

interface InterventionZonesStepProps {
  data: NGOInterventionZone[];
  onChange: (data: NGOInterventionZone[]) => void;
}

const WEST_AFRICA_COUNTRIES = [
  'Bénin',
  'Burkina Faso',
  'Cap-Vert',
  'Côte d\'Ivoire',
  'Gambie',
  'Ghana',
  'Guinée',
  'Guinée-Bissau',
  'Libéria',
  'Mali',
  'Niger',
  'Nigeria',
  'Sénégal',
  'Sierra Leone',
  'Togo'
];

const SENEGAL_REGIONS = [
  'Dakar',
  'Diourbel',
  'Fatick',
  'Kaolack',
  'Kédougou',
  'Kolda',
  'Louga',
  'Matam',
  'Saint-Louis',
  'Sédhiou',
  'Tambacounda',
  'Thiès',
  'Ziguinchor',
  'Kaffrine'
];

// Updated with all departments and municipalities
const SENEGAL_REGIONS_DATA: Record<string, Record<string, string[]>> = {
  'Dakar': {
    'Dakar': ['Dakar Plateau', 'Gorée', 'Fann / Point E / Amitié','Gueule Tapee Fass-Colobane','Grand Dakar', 'Biscuiterie', 'HLM', 'Hann Bel Air', 'Sicap Liberte', 'Dieuppeul Derkle', 'Ouakam', 'Ngor', 'Yoff', 'Mermoz/Sacre Coeur', 'Grand Yoff', 'Patte d\'oie', 'Parcelles Assainies', 'Camberene'],
    'Guédiawaye': ['Golf Sud', 'Sam Notaire', 'Ndiarème Limamoulaye', 'Wakhinane Nimzatt', 'Médina Gounass'],
    'Pikine': ['Pikine Est', 'Pikine Nord', 'Pikine Ouest', 'Dalifort-Foirail', 'Djida Thiaroye Kao', 'Guinaw Rail Nord', 'Guinaw Rail Sud', 'Diacksao', 'Diamagueune Sicap Mbao', 'Mbao', 'Thiaroye sur mer', 'Thiaroye Gare'],
    'Rufisque': ['Rufisque Est', 'Rufisque Nord', 'Rufisque Ouest', 'Bargny', 'Sébikotane', 'Sendou', 'Sangalkam', 'Bambylor', 'Yène', 'Tivaouane Peulh-Niaga', 'Diamniadio'],
    'Keur Massar': ['Yeumbeul Nord', 'Yeumbeul Sud', 'Malika', 'Keur Massar Nord', 'Jaxaay-parcelles', 'Keur Massar Sud']
  },
  'Diourbel': {
    'Bambey': ['Bambey', 'Dinguiraye', 'Baba Garage', 'Lambaye', 'Ngoye', 'Ndondol', 'Ndangalma', 'Gawane', 'N’gogom', 'Keur Samba Kane', 'Thiakar'],
    'Diourbel': ['Diourbel', 'Ndoulo', 'Ndindy', 'Tocky Gare', 'Touré Mbonde', 'Keur N\'galou', 'Taiba Moutoupha', 'N\'gohe', 'Gade Escale', 'Dankh Sene', 'Touba Lappe', 'Patar'],
    'Mbacké': ['Mbacké', 'Touba Mosquée', 'Dalla Ngabou', 'Madina', 'Touba Fall', 'Dandeye Gouygui', 'Taïf', 'Sadio', 'Taïba Thiékène', 'Nghaye', 'Missirah', 'Ndioumane Thiekene', 'Kael','Touba Mboul', 'Darou Nahim', 'Darou Salam Typ']
  },
  'Fatick': {
    'Fatick': ['Fatick', 'Dioffior', 'Thiare Ndialgui', 'Diakhao', 'Diarere', 'Diouroup', 'Tataguine', 'Mbellacadiao', 'Ndiop', 'Diaoulé', 'Fimela', 'Loul Sessène', 'Palmarin Facao', 'Niakhar', 'Ngayokhème', 'Patar'],
    'Foundiougne': ['Foundiougne', 'Sokone', 'Keur Saloum Diané', 'Keur Samba Gueye', 'Dionewar', 'Djirnda', 'Toubacouta', 'Nioro Alassane Tall', 'Karang Poste', 'Passy', 'Soum', 'Diossong', 'Djilor', 'Niassène', 'Diagane Barka', 'Mbam'],
    'Gossas': ['Gossas', 'Colobane', 'Mbar', 'Ndiene Lagane', 'Ouadiour', 'Patar Lia']
  },
  'Kaffrine': {
    'Kaffrine': ['Kaffrine', 'Kathiote', 'Médinatoul Salam 2', 'Gniby', 'Boulel', 'Kahi', 'Diokoul M\'belbouck', 'Diamagadio', 'Nganda'],
    'Birkelane': ['Birkelane', 'Keur Mboucki', 'Touba Mbella', 'Diamal', 'Mabo', 'Ndiognick', 'Mbeuleup', 'Segre gatta'],
    'Koungheul': ['Koungheul', 'Missirah Wadène', 'Maka Yop', 'Ngainthe Pathé', 'Fass Thiékène', 'Saly Escale', 'Ida Mouride', 'Ribot Escale', 'Lour Escale'],
    'Malem Hodar': ['Malem Hodar', 'Darou Minam 2', 'Khelcom', 'Ndioum Ngainth', 'Ndiobène Samba Lamo', 'Sagna', 'Dianké Souf']
  },
  'Kaolack': {
    'Kaolack': ['Kaolack', 'Kahone', 'Keur Baka', 'Latmingué', 'Thiaré', 'Ndoffane', 'Keur Socé', 'Ndiaffate', 'Ndiedieng', 'Dya', 'Ndiébel', 'Thiomby', 'Gandiaye', 'Sibassor'],
    'Guinguinéo': ['Guinguinéo', 'Khelcom – Birane', 'Mbadakhoune', 'Ndiago', 'Ngathie Naoudé', 'Fass', 'Gagnick', 'Dara Mboss', 'Mboss', 'Ngélou', 'Ourour', 'Panal Ouolof'],
    'Nioro du Rip': ['Nioro du Rip', 'Kayemor', 'Médina Sabakh', 'Ngayène', 'Gainthe Kaye', 'Dabaly', 'Darou Salam', 'Paos Koto', 'Porokhane', 'Taïba Niassène', 'Keur Maba Diakhou', 'Keur Madiabel', 'Ndrame Escale', 'Keur Madongo', 'Wack Ngouna']
  },
  'Kédougou': {
    'Kédougou': ['Kédougou', 'Ninéfecha', 'Bandafassi', 'Tomboronkoto', 'Dindefelo', 'Fongolimbi'],
    'Salémata': ['Salémata', 'Dakateli', 'Ethiolo', 'Oubadji', 'Dar Salam', 'Kevoye'],
    'Saraya': ['Saraya', 'Bembou', 'Médina Baffé', 'Sabodala', 'Khossanto', 'Missirah Sirimana']
  },
  'Kolda': {
    'Kolda': ['Kolda', 'Dialambéré', 'Médina Chérif', 'Sare Yoba Diega', 'Salikegne', 'Mampatim', 'Coumbacara', 'Bagadadji', 'Dabo', 'Thiétty', 'Saré Bidji', 'Dioulacolon', 'Tankanto Escale', 'Guiro Yéro Bocar', 'Médina El hadj'],
    'Médina Yoro Foulah': ['Médina Yoro Foulah', 'Badion', 'Fafacourou', 'Bourouco', 'Bignarabé', 'Ndorna', 'Koulinto', 'Niaming', 'Dinguiraye', 'Pata', 'Kerewane'],
    'Vélingara': ['Vélingara', 'Diaobé-Kabendou', 'Kounkané', 'Kandiaye', 'Saré Coly Sallé', 'Kandia', 'Némataba', 'Pakour', 'Paroumba', 'Ouassadou', 'Bonconto', 'Linkering', 'Médina Gounass', 'Sinthiang Koundara']
  },
  'Louga': {
    'Kébémer': ['Kébémer', 'Bandegne Ouolof', 'Diokoul Diawrigne', 'Kab Gaye', 'Loro', 'Thiolom Fall','Ngourane Wolof', 'Ndoyene', 'Thieppe', 'Guéoul', 'Mbacké Cajor', 'Darou Marnane', 'Darou Mousty', 'Mbadiane', 'Ndande', 'Sagata Gueth', 'Kanene Ndiob', 'Sam Yabal', 'Touba Merina'],
    'Linguère': ['Linguère', 'Dahra', 'Thiargny', 'Barkedji', 'Gassane', 'Thiel', 'Tessekere', 'Yang Yang', 'Mboula', 'Ouarkhokh', 'Kamb', 'Mbeuleukhe', 'Sagatta Djolof', 'Affé Djolof', 'Dodji', 'Labgar', 'Déaly', 'Thiamene Djolof'],
    'Louga': ['Louga', 'Coki', 'Pete Ouarack', 'Nguer Malal', 'Ndiagne', 'Guet Ardo', 'Thiamène Cayor', 'Mbédiène', 'Niomré', 'Nguidilé', 'Kelle Guèye', 'Léona', 'Keur Momar Sarr', 'Syer', 'Gande', 'Sakal', 'Ngueune Sarr']
  },
  'Matam': {
    'Matam': ['Matam', 'Ourossogui', 'Thilogne', 'Bokidiawé', 'Ogo', 'Nguidilogne', 'Nabadji Civol', 'Dabia', 'Agnam Civol', 'Oréfondé'],
    'Kanel': ['Kanel', 'Odobéré', 'Wouro Sidy', 'Ndendory', 'Sinthiou Bamambé-Banadji', 'Hamady Hounaré', 'Aouré', 'Bokiladji', 'Orkadiere', 'Ouaoundé', 'Semme', 'Dembancané'],
    'Ranérou': ['Ranérou', 'Lougré Thioly', 'Oudalaye', 'Vélingara']
  },
  'Saint-Louis': {
    'Dagana': ['Dagana', 'Richard Toll', 'Ross-Béthio', 'Rosso-Sénégal', 'Ngnith', 'Diama', 'Ronkh', 'Ndombo Sandjiry', 'Gae', 'Bokhol', 'Mbane'],
    'Podor': ['Podor', 'Méry', 'Doumga Lao', 'Madina Diathbé', 'Golléré', 'Mboumba', 'Walaldé', 'Aéré Lao', 'Gamadji Saré', 'Dodel', 'Galoya Toucouleur', 'Guédé Village', 'Guédé Chantier', 'Démette', 'Bodé Lao', 'Fanaye', 'Ndiayene Pendao', 'Niandane', 'Mbolo Birane', 'Boké Dialloubé', 'Pete'],
    'Saint-Louis': ['Saint-Louis', 'Mpal', 'Fass Ngom', 'Ndiébène Gandiol', 'Gandon']
  },
  'Sédhiou': {
    'Bounkiling': ['Bounkiling', 'Ndiamacouta', 'Boghal', 'Tankon', 'Ndiamalathiel', 'Djinany', 'Diacounda', 'Inor', 'Kandion Mangana', 'Diaroume', 'Bona', 'Diambati', 'Faoune', 'Madina Wandifa'],
    'Goudomp': ['Goudomp', 'Diattacounda', 'Samine', 'Yarang Balante', 'Mangaroungou Santo', 'Simbandi Balante', 'Djibanar', 'Kaour', 'Diouboudou', 'Simbandi Brassou', 'Baghere', 'Niagha', 'Tanaff', 'Karantaba'],
    'Sédhiou': ['Sédhiou', 'Diannah Malary', 'Sakar', 'Diendé', 'Marsassoum', 'Bambaly', 'Oudoucar', 'Sama Kanta Peulh', 'San Samba', 'Bémet Bidjini', 'Djirédji', 'Koussy', 'Sakar', 'Diannah Malary']
  },
  'Tambacounda': {
    'Bakel': ['Bakel', 'Bélé', 'Sinthiou Fissa', 'Kidira', 'Toumboura', 'Sadatou', 'Madina Foulbé', 'Gathiary', 'Moudéry', 'Ballou', 'Gabou', 'Diawara'],
    'Goudiry': ['Goudiry', 'Boynguel Bamba', 'Sinthiou Mamadou Boubou', 'Koussan', 'Dounguel', 'Thianguel Bani', 'Bani Israel', 'Sinthiou Bocar Aly', 'Koulor', 'Bala', 'Koar', 'Goumbayel', 'Boutoucoufara'],
    'Koumpentoum': ['Koumpentoum', 'Bamba Thialène', 'Kahène', 'Payar', 'Kouthiaba Wolof', 'Kouthia Gaydi', 'Pass Coto', 'Malem Niany'],
    'Tambacounda': ['Tambacounda', 'Niani Toucouleur', 'Makacolibantang', 'Ndoga Babacar', 'Missirah', 'Néttéboulou', 'Dialacoto', 'Sinthiou Malème', 'Koussanar']
  },
  'Thiès': {
    'Mbour': ['Mbour', 'Joal-Fadiouth', 'Fissel', 'Ndiaganiao', 'Sessene', 'Sandiara', 'Nguéniène', 'Thiadiaye', 'Sindia', 'Malicounda', 'Nguekhokh', 'Diass', 'Ngaparou', 'Saly Portudal', 'Somone', 'Popenguine-Ndayane'],
    'Thiès': ['Thiès Est', 'Thiès Ouest', 'Thiès Nord', 'Kayar', 'Khombole', 'Pout', 'Fandène', 'Ndieyène Sirakh', 'Touba Toul', 'Keur Moussa', 'Diender', 'Ngoundiane', 'Notto', 'Tassète'],
    'Tivaouane': ['Tivaouane', 'Mékhé', 'Mboro', 'Méouane', 'Darou Khoudoss', 'Taïba Ndiaye', 'Mérina Dakhar', 'Mont Rolland', 'Koul', 'Pékèsse', 'Niakhène', 'Mbayène', 'Thilmakha', 'Ngandiouf', 'Notto Gouye Diama', 'Pire Goureye', 'Pambal']
  },
  'Ziguinchor': {
    'Bignona': ['Bignona', 'Thionck Essyl', 'Kataba 1', 'Djinaky', 'Kafountine', 'Diouloulou', 'Tenghory', 'Niamone', 'Ouonck', 'Coubalan', 'Balinghore', 'Diégoune', 'Kartiack', 'Mangagoulack', 'Mlomp', 'Djibidione', 'Oulampane', 'Sindian', 'Suelle'],
    'Oussouye': ['Oussouye', 'Diembéring', 'Santhiaba Manjack', 'Oukout', 'Mlomp'],
    'Ziguinchor': ['Ziguinchor', 'Niaguis', 'Adéane', 'Boutoupa Camaracounda', 'Niassia', 'Enampore']
  }
};

export default function InterventionZonesStep({ data = [], onChange }: InterventionZonesStepProps) {
  // Group zones by type
  const groupedZones = data.reduce((acc, zone) => {
    if (!acc[zone.zone_type]) {
      acc[zone.zone_type] = [];
    }
    acc[zone.zone_type].push(zone);
    return acc;
  }, {} as Record<string, NGOInterventionZone[]>);

  const isSenegalSelected = groupedZones.country?.some(zone => zone.name === 'Sénégal');

  const handleCountryChange = (country: string) => {
    const isSelected = groupedZones.country?.some(zone => zone.name === country);
    let newZones = [...data];

    if (isSelected) {
      // Remove country and its dependencies if it's Senegal
      if (country === 'Sénégal') {
        newZones = newZones.filter(zone =>
            !(zone.zone_type === 'country' && zone.name === 'Sénégal') &&
            !(zone.zone_type === 'region') &&
            !(zone.zone_type === 'department') &&
            !(zone.zone_type === 'municipality')
        );
      } else {
        newZones = newZones.filter(zone =>
            !(zone.zone_type === 'country' && zone.name === country)
        );
      }
    } else {
      // Add new country
      newZones.push({
        zone_type: 'country',
        name: country
      });
    }

    onChange(newZones);
  };

  const handleRegionChange = (region: string) => {
    const isSelected = groupedZones.region?.some(zone => zone.name === region);
    let newZones = [...data];

    if (isSelected) {
      // Remove region and its dependencies
      newZones = newZones.filter(zone =>
          !(zone.zone_type === 'region' && zone.name === region) &&
          !(zone.zone_type === 'department' && zone.parent_zone_id === region) &&
          !(zone.zone_type === 'municipality' && zone.parent_zone_id?.startsWith(region))
      );
    } else {
      // Add region
      newZones.push({
        zone_type: 'region',
        name: region
      });

      // Ensure Senegal is selected without affecting other countries
      if (!newZones.some(zone => zone.zone_type === 'country' && zone.name === 'Sénégal')) {
        newZones.push({
          zone_type: 'country',
          name: 'Sénégal'
        });
      }
    }

    onChange(newZones);
  };

  const handleDepartmentChange = (region: string, department: string) => {
    const isSelected = groupedZones.department?.some(zone => zone.name === department);
    let newZones = [...data];

    if (isSelected) {
      // Remove department and its municipalities
      newZones = newZones.filter(zone =>
          !(zone.zone_type === 'department' && zone.name === department) &&
          !(zone.zone_type === 'municipality' && zone.parent_zone_id === department)
      );
    } else {
      // Ensure region is selected
      if (!newZones.some(zone => zone.zone_type === 'region' && zone.name === region)) {
        newZones.push({
          zone_type: 'region',
          name: region
        });
      }

      // Ensure Senegal is selected without affecting other countries
      if (!newZones.some(zone => zone.zone_type === 'country' && zone.name === 'Sénégal')) {
        newZones.push({
          zone_type: 'country',
          name: 'Sénégal'
        });
      }
      // Add department
      newZones.push({
        zone_type: 'department',
        name: department,
        parent_zone_id: region
      });
    }

    onChange(newZones);
  };

  const handleMunicipalityChange = (region: string, department: string, municipality: string) => {
    const isSelected = groupedZones.municipality?.some(zone =>
        zone.name === municipality &&
        zone.parent_zone_id === department
    );
    let newZones = [...data];

    if (isSelected) {
      // Remove municipality
      newZones = newZones.filter(zone =>
          !(zone.zone_type === 'municipality' &&
              zone.name === municipality &&
              zone.parent_zone_id === department)
      );
    } else {

      // Ensure Senegal is selected without affecting other countries
      if (!newZones.some(zone => zone.zone_type === 'country' && zone.name === 'Sénégal')) {
        newZones.push({
          zone_type: 'country',
          name: 'Sénégal'
        });
      }

      // Ensure region is selected
      if (!newZones.some(zone => zone.zone_type === 'region' && zone.name === region)) {
        newZones.push({
          zone_type: 'region',
          name: region
        });
      }

      // Ensure department is selected
      if (!newZones.some(zone => zone.zone_type === 'department' && zone.name === department)) {
        newZones.push({
          zone_type: 'department',
          name: department,
          parent_zone_id: region
        });
      }

      // Add municipality
      newZones.push({
        zone_type: 'municipality',
        name: municipality,
        parent_zone_id: department
      });
    }

    onChange(newZones);
  };

  return (
      <div className="space-y-8">
        {/* West Africa Countries */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Pays d'intervention en Afrique de l'Ouest</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {WEST_AFRICA_COUNTRIES.map(country => (
                <label
                    key={country}
                    className="relative flex items-start py-2"
                >
                  <div className="min-w-0 flex-1 text-sm">
                    <div className="flex items-center">
                      <input
                          type="checkbox"
                          checked={groupedZones.country?.some(zone => zone.name === country) || false}
                          onChange={() => handleCountryChange(country)}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-gray-700">{country}</span>
                    </div>
                  </div>
                </label>
            ))}
          </div>
        </div>

        {/* Senegal Regions */}
        <div className={`rounded-lg p-6 ${
            isSenegalSelected ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50 border border-gray-200'
        }`}>
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Régions d'intervention au Sénégal</h3>
            <p className={`text-sm ${
                isSenegalSelected ? 'text-blue-600' : 'text-gray-500'
            }`}>
              {isSenegalSelected
                  ? 'Sélectionnez les régions spécifiques'
                  : 'Sélectionnez d\'abord le Sénégal pour activer la sélection des régions'}
            </p>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SENEGAL_REGIONS.map(region => (
                <label
                    key={region}
                    className={`relative flex items-start py-2 ${
                        !isSenegalSelected && 'opacity-50 cursor-not-allowed'
                    }`}
                >
                  <div className="min-w-0 flex-1 text-sm">
                    <div className="flex items-center">
                      <input
                          type="checkbox"
                          checked={groupedZones.region?.some(zone => zone.name === region) || false}
                          onChange={() => handleRegionChange(region)}
                          disabled={!isSenegalSelected}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                      />
                      <span className="ml-2 text-gray-700">{region}</span>
                    </div>
                  </div>
                </label>
            ))}
          </div>
        </div>

        {/* Departments and Municipalities */}
        {isSenegalSelected && groupedZones.region?.length > 0 && (
            <div className="space-y-6">
              {groupedZones.region.map(regionZone => {
                const regionData = SENEGAL_REGIONS_DATA[regionZone.name];
                if (!regionData) return null;

                return (
                    <div key={regionZone.name} className="bg-white rounded-lg border border-blue-100 p-4">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">{regionZone.name}</h4>

                      <div className="space-y-6">
                        {Object.entries(regionData).map(([department, municipalities]) => (
                            <div key={department} className="pl-4 border-l-2 border-gray-100">
                              <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={groupedZones.department?.some(zone => zone.name === department) || false}
                                    onChange={() => handleDepartmentChange(regionZone.name, department)}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm font-medium text-gray-700">{department}</span>
                              </label>

                              {groupedZones.department?.some(zone => zone.name === department) && (
                                  <div className="mt-2 pl-6 grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {municipalities.map(municipality => (
                                        <label key={municipality} className="flex items-center space-x-2">
                                          <input
                                              type="checkbox"
                                              checked={groupedZones.municipality?.some(zone =>
                                                  zone.name === municipality &&
                                                  zone.parent_zone_id === department
                                              ) || false}
                                              onChange={() => handleMunicipalityChange(
                                                  regionZone.name,
                                                  department,
                                                  municipality
                                              )}
                                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                          />
                                          <span className="text-sm text-gray-700">{municipality}</span>
                                        </label>
                                    ))}
                                  </div>
                              )}
                            </div>
                        ))}
                      </div>
                    </div>
                );
              })}
            </div>
        )}

        {/* Summary */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Résumé des zones d'intervention</h4>
          <div className="space-y-4">
            {groupedZones.country?.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Pays ({groupedZones.country.length}):
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {groupedZones.country.map(zone => (
                        <span
                            key={zone.name}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                    {zone.name}
                  </span>
                    ))}
                  </div>
                </div>
            )}

            {groupedZones.region?.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Régions ({groupedZones.region.length}):
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {groupedZones.region.map(zone => (
                        <span
                            key={zone.name}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                        >
                    {zone.name}
                  </span>
                    ))}
                  </div>
                </div>
            )}

            {groupedZones.department?.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Départements ({groupedZones.department.length}):
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {groupedZones.department.map(zone => (
                        <span
                            key={zone.name}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                        >
                    {zone.name}
                  </span>
                    ))}
                  </div>
                </div>
            )}

            {groupedZones.municipality?.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Communes ({groupedZones.municipality.length}):
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {groupedZones.municipality.map(zone => (
                        <span
                            key={`${zone.parent_zone_id}-${zone.name}`}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                        >
                    {zone.name} ({zone.parent_zone_id})
                  </span>
                    ))}
                  </div>
                </div>
            )}

            {Object.keys(groupedZones).length === 0 && (
                <p className="text-sm text-gray-500">Aucune zone sélectionnée</p>
            )}
          </div>
        </div>
      </div>
  );
}