export const Location = [
  'Dhaka',
  'Chattogram',
  'Barishal',
  'Rajshahi',
  'Sylhet',
  'Comilla',
  'Rangpur',
  'Mymensingh',
]
export const CattleBreed = [
  'Brahman',
  'Nellore',
  'Sahiwal',
  'Gir',
  'Indigenous',
  'Tharparkar',
  'Kankrej',
]

export const Label = ['for sale', 'sold out'] as const

// export const category = ['Dairy', 'Beef', 'Dual Purpose']

export const cowSearchableFields = ['location', 'breed', 'category']
export const cowFilterableFields = [
  'searchTerm',
  'location',
  'breed',
  'category',
  // 'price',
  'maxPrice',
  'minPrice',
]
