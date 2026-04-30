export const SUPPLIERS = ['All Suppliers', 'Thomasian Merch Co.', 'Golden Tiger Supplies', 'Campus Essentials PH'];
export const CATEGORIES = ['All Categories', 'Apparel', 'Accessories', 'School Supplies', 'Drinkware', 'Souvenirs'];
export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const LEAD_TIME = 7;
export const Z_SCORE = 1.65;

// monthlySales[i] = units sold in month i (0=Jan, 11=Dec) for 2024
// FSN: F=fast (avg>=60), S=slow (avg 15-59), N=non-moving (avg<15)
export const PRODUCTS = [
  { id: 1,  name: 'UST Varsity Jacket',        category: 'Apparel',        supplier: 'Thomasian Merch Co.',   price: 1850, fsn: 'F',
    monthlySales: [95,80,85,90,100,160,130,175,110,105,170,200], currentStock: 280 },
  { id: 2,  name: 'UST College Hoodie',         category: 'Apparel',        supplier: 'Thomasian Merch Co.',   price: 1200, fsn: 'F',
    monthlySales: [110,95,100,105,115,180,155,200,130,120,190,220], currentStock: 190 },
  { id: 3,  name: 'UST Basic Polo Shirt',       category: 'Apparel',        supplier: 'Thomasian Merch Co.',   price: 650,  fsn: 'F',
    monthlySales: [130,115,120,125,140,210,180,240,155,145,220,260], currentStock: 310 },
  { id: 4,  name: 'UST PE Shorts',             category: 'Apparel',        supplier: 'Thomasian Merch Co.',   price: 450,  fsn: 'S',
    monthlySales: [35,28,30,32,40,55,45,60,38,35,42,50], currentStock: 85 },
  { id: 5,  name: 'UST Sports Socks (3-pack)', category: 'Apparel',        supplier: 'Thomasian Merch Co.',   price: 220,  fsn: 'N',
    monthlySales: [5,3,4,2,6,8,4,7,3,2,5,4], currentStock: 90 },
  { id: 6,  name: 'Tiger Logo Cap',            category: 'Accessories',    supplier: 'Golden Tiger Supplies',  price: 450,  fsn: 'F',
    monthlySales: [80,72,75,78,88,140,115,155,95,90,135,160], currentStock: 60 },
  { id: 7,  name: 'UST Tote Bag',              category: 'Accessories',    supplier: 'Golden Tiger Supplies',  price: 380,  fsn: 'S',
    monthlySales: [22,18,20,21,25,35,30,40,24,22,30,36], currentStock: 55 },
  { id: 8,  name: 'UST Lanyard',               category: 'Accessories',    supplier: 'Campus Essentials PH',  price: 120,  fsn: 'F',
    monthlySales: [150,130,140,145,160,240,200,270,170,160,235,280], currentStock: 380 },
  { id: 9,  name: 'UST Wristband',             category: 'Accessories',    supplier: 'Campus Essentials PH',  price: 75,   fsn: 'S',
    monthlySales: [30,25,27,28,33,48,40,55,35,30,44,52], currentStock: 120 },
  { id: 10, name: 'UST Face Mask (5-pack)',    category: 'Accessories',    supplier: 'Campus Essentials PH',  price: 95,   fsn: 'N',
    monthlySales: [8,5,6,4,7,10,6,9,4,3,6,5], currentStock: 200 },
  { id: 11, name: 'UST Ballpen Set',           category: 'School Supplies', supplier: 'Campus Essentials PH',  price: 85,   fsn: 'F',
    monthlySales: [200,170,185,190,210,310,265,350,220,210,300,360], currentStock: 520 },
  { id: 12, name: 'UST Notebook (80 leaves)', category: 'School Supplies', supplier: 'Campus Essentials PH',  price: 145,  fsn: 'F',
    monthlySales: [180,155,165,170,190,280,240,315,200,190,270,330], currentStock: 400 },
  { id: 13, name: 'UST Folder Set',           category: 'School Supplies', supplier: 'Campus Essentials PH',  price: 65,   fsn: 'S',
    monthlySales: [40,33,36,37,42,60,52,68,44,40,55,66], currentStock: 95 },
  { id: 14, name: 'UST Sticky Notes Set',     category: 'School Supplies', supplier: 'Campus Essentials PH',  price: 55,   fsn: 'S',
    monthlySales: [28,23,25,26,30,42,36,48,31,28,38,46], currentStock: 140 },
  { id: 15, name: 'UST Scientific Calculator',category: 'School Supplies', supplier: 'Golden Tiger Supplies',  price: 580,  fsn: 'N',
    monthlySales: [6,4,5,3,7,12,8,14,5,4,8,6], currentStock: 45 },
  { id: 16, name: 'UST Tumbler 600ml',        category: 'Drinkware',      supplier: 'Golden Tiger Supplies',  price: 550,  fsn: 'F',
    monthlySales: [75,65,70,72,82,125,105,140,88,83,120,145], currentStock: 50 },
  { id: 17, name: 'UST Mug 350ml',            category: 'Drinkware',      supplier: 'Golden Tiger Supplies',  price: 320,  fsn: 'S',
    monthlySales: [25,20,22,23,27,38,32,44,28,25,36,42], currentStock: 70 },
  { id: 18, name: 'UST Insulated Bottle 1L',  category: 'Drinkware',      supplier: 'Golden Tiger Supplies',  price: 750,  fsn: 'S',
    monthlySales: [18,14,16,17,20,28,24,32,20,18,26,30], currentStock: 38 },
  { id: 19, name: 'UST Glass Tumbler',        category: 'Drinkware',      supplier: 'Thomasian Merch Co.',   price: 420,  fsn: 'N',
    monthlySales: [5,3,4,2,5,8,5,9,4,3,6,4], currentStock: 55 },
  { id: 20, name: 'UST Keychain',             category: 'Souvenirs',      supplier: 'Campus Essentials PH',  price: 95,   fsn: 'F',
    monthlySales: [100,88,93,96,108,162,138,180,115,108,158,190], currentStock: 145 },
  { id: 21, name: 'UST Ref Magnet',           category: 'Souvenirs',      supplier: 'Campus Essentials PH',  price: 85,   fsn: 'S',
    monthlySales: [32,26,28,29,34,50,42,56,36,32,46,55], currentStock: 88 },
  { id: 22, name: 'UST Enamel Pin Set',       category: 'Souvenirs',      supplier: 'Golden Tiger Supplies',  price: 195,  fsn: 'S',
    monthlySales: [20,16,18,19,22,32,27,36,23,20,29,35], currentStock: 65 },
  { id: 23, name: 'UST Photo Frame',          category: 'Souvenirs',      supplier: 'Thomasian Merch Co.',   price: 350,  fsn: 'N',
    monthlySales: [4,2,3,2,4,7,4,8,3,2,5,4], currentStock: 72 },
  { id: 24, name: 'UST Miniature Trophy',     category: 'Souvenirs',      supplier: 'Thomasian Merch Co.',   price: 480,  fsn: 'N',
    monthlySales: [3,2,2,1,3,5,3,6,2,1,4,3], currentStock: 40 },
  { id: 25, name: 'UST Pennant Flag',         category: 'Souvenirs',      supplier: 'Golden Tiger Supplies',  price: 220,  fsn: 'S',
    monthlySales: [15,12,13,14,17,24,20,28,18,15,22,26], currentStock: 48 },
  { id: 26, name: 'UST Class Ring',           category: 'Accessories',    supplier: 'Thomasian Merch Co.',   price: 2800, fsn: 'N',
    monthlySales: [2,1,1,0,2,4,2,5,1,1,3,2], currentStock: 18 },
  { id: 27, name: 'UST Umbrella',             category: 'Accessories',    supplier: 'Golden Tiger Supplies',  price: 680,  fsn: 'S',
    monthlySales: [10,8,12,18,25,30,20,22,24,18,14,12], currentStock: 32 },
  { id: 28, name: 'UST Polo Barong',          category: 'Apparel',        supplier: 'Thomasian Merch Co.',   price: 1100, fsn: 'S',
    monthlySales: [20,15,18,19,22,30,26,35,21,20,28,34], currentStock: 42 },
];

// Compute derived fields
function stdDev(arr) {
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  return Math.sqrt(arr.reduce((s, x) => s + (x - mean) ** 2, 0) / arr.length);
}

export const PRODUCTS_ENRICHED = PRODUCTS.map(p => {
  const totalUnits = p.monthlySales.reduce((a, b) => a + b, 0);
  const avgMonthly = totalUnits / 12;
  const avgDaily = avgMonthly / 30;
  const sigma = stdDev(p.monthlySales);
  const cv = avgMonthly > 0 ? ((sigma / avgMonthly) * 100) : 0;
  const safetyStock = Math.ceil(Z_SCORE * sigma * Math.sqrt(LEAD_TIME / 30));
  const rop = Math.ceil(avgDaily * LEAD_TIME + safetyStock);
  const eoq = Math.ceil(Math.sqrt((2 * totalUnits * 50) / (p.price * 0.25)));
  const totalRevenue = totalUnits * p.price;
  const status = p.currentStock < rop
    ? 'REORDER NOW'
    : p.currentStock < rop * 1.1
    ? 'APPROACHING'
    : 'OK';

  return {
    ...p,
    totalUnits,
    avgMonthly: Math.round(avgMonthly * 10) / 10,
    cv: Math.round(cv * 10) / 10,
    safetyStock,
    rop,
    eoq,
    totalRevenue,
    status,
    daysOfStock: avgDaily > 0 ? Math.round(p.currentStock / avgDaily) : 999,
  };
});

// Monthly totals (revenue) across all products
export const MONTHLY_REVENUE = MONTHS.map((month, i) => ({
  month,
  revenue: PRODUCTS_ENRICHED.reduce((sum, p) => sum + p.monthlySales[i] * p.price, 0),
}));

// Forecast data for each product: actual (Jan-Dec) + forecast (Oct-Feb next)
export function getForecastData(productId) {
  const p = PRODUCTS_ENRICHED.find(x => x.id === productId);
  if (!p) return [];

  const actual = p.monthlySales.map((units, i) => ({
    month: MONTHS[i],
    actual: units,
    forecast: null,
    lower: null,
    upper: null,
  }));

  // Simple linear trend + seasonal for forecast
  const avg = p.avgMonthly;
  const seasonalFactors = p.monthlySales.map(u => u / avg);
  const forecastMonths = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
  const seasonIdxs = [9, 10, 11, 0, 1, 2];
  const noise = avg * 0.12;

  const forecastPoints = forecastMonths.map((month, fi) => {
    const sf = seasonalFactors[seasonIdxs[fi]];
    const fc = Math.round(avg * sf);
    return {
      month: fi < 3 ? `${month}*` : `${month} '25`,
      actual: fi < 3 ? p.monthlySales[seasonIdxs[fi]] : null,
      forecast: fc,
      lower: Math.max(0, Math.round(fc - noise)),
      upper: Math.round(fc + noise),
    };
  });

  // Merge Oct-Dec into actual
  const merged = actual.map((row, i) => {
    if (i >= 9) {
      const fp = forecastPoints[i - 9];
      return { ...row, forecast: fp.forecast, lower: fp.lower, upper: fp.upper };
    }
    return row;
  });

  return [...merged, ...forecastPoints.slice(3)];
}

export function getForecastMetrics(productId) {
  const p = PRODUCTS_ENRICHED.find(x => x.id === productId);
  if (!p) return { rmse: 0, mae: 0, mape: 0 };

  // Simulate accuracy using last 3 months vs "predicted"
  const avg = p.avgMonthly;
  const last3 = p.monthlySales.slice(9);
  const preds = last3.map(u => Math.round(avg * (p.monthlySales[p.monthlySales.indexOf(u)] / avg)));
  const errs = last3.map((a, i) => a - last3[i] * (0.95 + Math.random() * 0.1));
  const mae = Math.round(errs.reduce((s, e) => s + Math.abs(e), 0) / 3 * 10) / 10;
  const rmse = Math.round(Math.sqrt(errs.reduce((s, e) => s + e * e, 0) / 3) * 10) / 10;
  const mape = Math.round(errs.reduce((s, e, i) => s + Math.abs(e / (last3[i] || 1)), 0) / 3 * 1000) / 10;
  return { rmse, mae, mape };
}

// Pareto data: sorted by revenue desc with cumulative %
export function getParetoData() {
  const sorted = [...PRODUCTS_ENRICHED].sort((a, b) => b.totalRevenue - a.totalRevenue);
  const total = sorted.reduce((s, p) => s + p.totalRevenue, 0);
  let cum = 0;
  return sorted.map(p => {
    cum += p.totalRevenue;
    return {
      name: p.name.length > 20 ? p.name.slice(0, 18) + '…' : p.name,
      revenue: p.totalRevenue,
      cumPct: Math.round((cum / total) * 1000) / 10,
    };
  });
}

export function filterProducts(products, { supplier, category }) {
  return products.filter(p =>
    (supplier === 'All Suppliers' || p.supplier === supplier) &&
    (category === 'All Categories' || p.category === category)
  );
}

export function filterRevenue(monthlyRevenue, products, { supplier, category }) {
  if (supplier === 'All Suppliers' && category === 'All Categories') return monthlyRevenue;
  const filtered = filterProducts(PRODUCTS_ENRICHED, { supplier, category });
  return MONTHS.map((month, i) => ({
    month,
    revenue: filtered.reduce((sum, p) => sum + p.monthlySales[i] * p.price, 0),
  }));
}
