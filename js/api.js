async function loadFoodsFromSupabase() {
  const { data: items, error: itemsError } = await supabaseClient
    .from("items")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (itemsError) {
    console.error("Load items error:", itemsError);
    return;
  }

  const { data: shops, error: shopsError } = await supabaseClient
    .from("shops")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (shopsError) {
    console.error("Load shops error:", shopsError);
    return;
  }

  foods = items.map(item => {
    const itemShops = shops.filter(shop => shop.item_id === item.id);

    return {
      id: item.id,
      type: item.type,
      emoji: item.emoji,
      image: item.image || item.emoji,
      name: item.name,
      city: item.city,
      heritage: item.heritage,
      featured: item.featured,
      shortDesc: item.short_desc,
      desc: item.description,
      tags: item.tags || [],
      recommends: itemShops.map(shop => ({
        id: shop.id,
        category: shop.category,
        name: shop.name,
        area: shop.area,
        address: shop.address,
        lat: shop.lat,
        lng: shop.lng,
        phone: shop.phone,
        note: shop.note,
        hours: shop.hours || {},
        map: shop.lat && shop.lng
          ? `https://www.google.com/maps/search/?api=1&query=${shop.lat},${shop.lng}`
          : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${shop.name} ${shop.address || ""} ${shop.area || ""} Sarawak`)}`
      }))
    };
  });
}