exports.seed = async function(knex) {
  // Delete existing categories
  await knex('categories').del();
  
  // Insert categories
  await knex('categories').insert([
    {
      name: 'Elektronika',
      slug: 'elektronika',
      description: 'Smartfonlar, noutbuklar, audio va boshqa elektronika',
      icon: '📱',
      sort_order: 1,
      commission_rate: 5.00,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'Kiyim-kechak',
      slug: 'kiyim-kechak',
      description: 'Erkaklar va ayollar kiyimlari',
      icon: '👕',
      sort_order: 2,
      commission_rate: 4.00,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'Uy va bog\'',
      slug: 'uy-va-bog',
      description: 'Uy jihozlari va bog\' asboblari',
      icon: '🏠',
      sort_order: 3,
      commission_rate: 4.50,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'Go\'zallik va sog\'liq',
      slug: 'gozallik-va-sogliq',
      description: 'Kosmetika va sog\'liq mahsulotlari',
      icon: '💄',
      sort_order: 4,
      commission_rate: 6.00,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'Sport va dam olish',
      slug: 'sport-va-dam-olish',
      description: 'Sport jihozlari va dam olish mahsulotlari',
      icon: '⚽',
      sort_order: 5,
      commission_rate: 4.00,
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);
}; 