// Mock podaci

export const LANGUAGE = [
  {
    langId: 1,
    langName: 'Engleski',
    langImg: '/flags/england.png',  
  },
  {
    langId: 2,
    langName: 'Njemački',
    langImg: '/flags/germany.png',
  },
  {
    langId: 3,
    langName: 'Talijanski',
    langImg: '/flags/italy.png',
  },
  {
    langId: 4,
    langName: 'Španjolski',
    langImg: '/flags/spain.png',
  },
];

export const DICTIONARY = [
  // 🇬🇧 Engleski
  { dictId: 1, dictName: 'Family', langId: 1, description: 'Vocabulary about family members' },
  { dictId: 2, dictName: 'Sports', langId: 1, description: 'Vocabulary related to sports and activities' },
  { dictId: 3, dictName: 'Food', langId: 1, description: 'Words related to food and eating' },

  // 🇩🇪 Njemački
  { dictId: 4, dictName: 'Familie', langId: 2, description: 'Wortschatz über Familienmitglieder' },
  { dictId: 5, dictName: 'Sport', langId: 2, description: 'Wörter rund um Sportarten und Aktivitäten' },
  { dictId: 6, dictName: 'Essen', langId: 2, description: 'Vokabeln zum Thema Essen und Trinken' },

  // 🇮🇹 Talijanski
  { dictId: 7, dictName: 'Famiglia', langId: 3, description: 'Vocabolario sui membri della famiglia' },
  { dictId: 8, dictName: 'Sport', langId: 3, description: 'Vocabolario relativo agli sport' },
  { dictId: 9, dictName: 'Cibo', langId: 3, description: 'Vocabolario sul cibo e le bevande' },

  // 🇪🇸 Španjolski
  { dictId: 10, dictName: 'Familia', langId: 4, description: 'Vocabulario sobre los miembros de la familia' },
  { dictId: 11, dictName: 'Deportes', langId: 4, description: 'Vocabulario relacionado con los deportes' },
  { dictId: 12, dictName: 'Comida', langId: 4, description: 'Vocabulario sobre comida y bebida' },
];
