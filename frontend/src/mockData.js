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


export const WORDS = [
  // Engleske riječi
  { wordId: 1, word: 'apple', langId: 2, translateId: 11 },
  { wordId: 2, word: 'book', langId: 2, translateId: 12 },
  { wordId: 3, word: 'cat', langId: 2, translateId: 13 },
  { wordId: 4, word: 'dog', langId: 2, translateId: 14 },
  { wordId: 5, word: 'house', langId: 2, translateId: 15 },
  { wordId: 6, word: 'water', langId: 2, translateId: 16 },
  { wordId: 7, word: 'sun', langId: 2, translateId: 17 },
  { wordId: 8, word: 'moon', langId: 2, translateId: 18 },
  { wordId: 9, word: 'tree', langId: 2, translateId: 19 },
  { wordId: 10, word: 'car', langId: 2, translateId: 20 },

  // Hrvatski prijevodi
  { wordId: 11, word: 'jabuka', langId: 1, translateId: null },
  { wordId: 12, word: 'knjiga', langId: 1, translateId: null },
  { wordId: 13, word: 'mačka', langId: 1, translateId: null },
  { wordId: 14, word: 'pas', langId: 1, translateId: null },
  { wordId: 15, word: 'kuća', langId: 1, translateId: null },
  { wordId: 16, word: 'voda', langId: 1, translateId: null },
  { wordId: 17, word: 'sunce', langId: 1, translateId: null },
  { wordId: 18, word: 'mjesec', langId: 1, translateId: null },
  { wordId: 19, word: 'drvo', langId: 1, translateId: null },
  { wordId: 20, word: 'auto', langId: 1, translateId: null },
];