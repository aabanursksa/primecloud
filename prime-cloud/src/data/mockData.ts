export const branches = [
  { id: 1, en: 'Al Olaya Branch', ar: 'فرع العليا' },
  { id: 2, en: 'Al Rawabi Branch', ar: 'فرع الروابي' },
  { id: 3, en: 'Al Nakheel Branch', ar: 'فرع النخيل' },
  { id: 4, en: 'Al Salam Branch', ar: 'فرع السلام' },
]

export const products = [
  { id: 1, nameEn: 'Beef Burger', nameAr: 'برجر لحم', category: 'Burgers', price: 29.00, stock: 85, status: 'active' },
  { id: 2, nameEn: 'Grilled Chicken', nameAr: 'دجاج مشوي', category: 'Grill', price: 35.00, stock: 62, status: 'active' },
  { id: 3, nameEn: 'Arabic Shawarma', nameAr: 'شاورما عربي', category: 'Sandwiches', price: 18.00, stock: 120, status: 'active' },
  { id: 4, nameEn: 'French Fries', nameAr: 'بطاطس مقلية', category: 'Sides', price: 10.00, stock: 200, status: 'active' },
  { id: 5, nameEn: 'Soft Drink', nameAr: 'مشروب غازي', category: 'Drinks', price: 5.00, stock: 300, status: 'active' },
  { id: 6, nameEn: 'Orange Juice', nameAr: 'عصير برتقال', category: 'Drinks', price: 12.00, stock: 150, status: 'active' },
  { id: 7, nameEn: 'Chicken Meal', nameAr: 'وجبة دجاج', category: 'Meals', price: 38.00, stock: 45, status: 'active' },
  { id: 8, nameEn: 'Family Meal', nameAr: 'وجبة عائلية', category: 'Meals', price: 89.00, stock: 20, status: 'active' },
]

export const categories = ['Burgers', 'Grill', 'Sandwiches', 'Sides', 'Drinks', 'Meals']

export const orders = [
  { id: '#ORD-1001', customer: 'Ahmad Al-Zahrani', branch: 1, time: '12:30 PM', total: 87.00, status: 'new' },
  { id: '#ORD-1002', customer: 'Sara Al-Qahtani', branch: 2, time: '12:45 PM', total: 45.00, status: 'preparing' },
  { id: '#ORD-1003', customer: 'Mohammed Al-Otaibi', branch: 1, time: '1:00 PM', total: 120.00, status: 'ready' },
  { id: '#ORD-1004', customer: 'Noura Al-Shehri', branch: 3, time: '1:15 PM', total: 65.50, status: 'delivered' },
  { id: '#ORD-1005', customer: 'Faisal Al-Ghamdi', branch: 4, time: '1:30 PM', total: 34.00, status: 'cancelled' },
  { id: '#ORD-1006', customer: 'Lama Al-Harbi', branch: 2, time: '1:45 PM', total: 92.00, status: 'new' },
  { id: '#ORD-1007', customer: 'Khalid Al-Dossari', branch: 3, time: '2:00 PM', total: 156.00, status: 'preparing' },
  { id: '#ORD-1008', customer: 'Huda Al-Anazi', branch: 1, time: '2:15 PM', total: 28.50, status: 'ready' },
]

export const customers = [
  { id: 1, nameEn: 'Ahmad Al-Zahrani', nameAr: 'أحمد الزهراني', phone: '+966 55 123 4567', email: 'ahmad@email.com', orders: 45, total: 12340 },
  { id: 2, nameEn: 'Sara Al-Qahtani', nameAr: 'سارة القحطاني', phone: '+966 55 234 5678', email: 'sara@email.com', orders: 32, total: 8900 },
  { id: 3, nameEn: 'Mohammed Al-Otaibi', nameAr: 'محمد العتيبي', phone: '+966 55 345 6789', email: 'mohammed@email.com', orders: 78, total: 23400 },
  { id: 4, nameEn: 'Noura Al-Shehri', nameAr: 'نورة الشهري', phone: '+966 55 456 7890', email: 'noura@email.com', orders: 23, total: 5600 },
]

export const dailySales = [
  { day: 'Mon', sales: 4200, orders: 45 },
  { day: 'Tue', sales: 3800, orders: 38 },
  { day: 'Wed', sales: 5100, orders: 52 },
  { day: 'Thu', sales: 4800, orders: 49 },
  { day: 'Fri', sales: 6200, orders: 65 },
  { day: 'Sat', sales: 5800, orders: 58 },
  { day: 'Sun', sales: 4500, orders: 44 },
]

export const branchPerformance = [
  { nameEn: 'Al Olaya', nameAr: 'العليا', sales: 12500, percentage: 85 },
  { nameEn: 'Al Rawabi', nameAr: 'الروابي', sales: 9800, percentage: 72 },
  { nameEn: 'Al Nakheel', nameAr: 'النخيل', sales: 11200, percentage: 78 },
  { nameEn: 'Al Salam', nameAr: 'السلام', sales: 8500, percentage: 65 },
]

export const topProducts = [
  { nameEn: 'Beef Burger', nameAr: 'برجر لحم', sales: 142, revenue: 4118 },
  { nameEn: 'Grilled Chicken', nameAr: 'دجاج مشوي', sales: 98, revenue: 3430 },
  { nameEn: 'Arabic Shawarma', nameAr: 'شاورما عربي', sales: 85, revenue: 1530 },
  { nameEn: 'French Fries', nameAr: 'بطاطس مقلية', sales: 120, revenue: 1200 },
  { nameEn: 'Chicken Meal', nameAr: 'وجبة دجاج', sales: 67, revenue: 2546 },
]

export const statsData = {
  todaySales: 18450,
  yesterdaySales: 16200,
  todayOrders: 142,
  yesterdayOrders: 128,
  todayNetProfit: 5230,
  yesterdayNetProfit: 4800,
  todayExpenses: 3200,
  yesterdayExpenses: 2900,
  lowStockAlerts: 3,
  yesterdayLowStockAlerts: 5,
}

export const quickActions = [
  { id: 'new-order', icon: 'ShoppingCart', en: 'New Order', ar: 'طلب جديد', color: 'bg-main-purple' },
  { id: 'open-pos', icon: 'Monitor', en: 'Open POS', ar: 'فتح نقاط البيع', color: 'bg-light-purple' },
  { id: 'delivery', icon: 'Truck', en: 'Delivery Order', ar: 'طلب توصيل', color: 'bg-indigo-helper' },
  { id: 'new-product', icon: 'PackagePlus', en: 'New Product', ar: 'منتج جديد', color: 'bg-success' },
  { id: 'inventory', icon: 'Warehouse', en: 'View Inventory', ar: 'عرض المخزون', color: 'bg-warning' },
  { id: 'report', icon: 'BarChart3', en: 'Sales Report', ar: 'تقرير المبيعات', color: 'bg-info' },
]

export const suppliers = [
  { id: 1, nameEn: 'Fresh Food Co.', nameAr: 'شركة الطعام الطازج', phone: '+966 55 111 2233', email: 'info@freshfood.sa', balance: 12500 },
  { id: 2, nameEn: 'Arabian Beverages', nameAr: 'المشروبات العربية', phone: '+966 55 222 3344', email: 'info@arabianbeverages.sa', balance: 8400 },
  { id: 3, nameEn: 'Global Meat Trading', nameAr: 'تجارة اللحوم العالمية', phone: '+966 55 333 4455', email: 'info@globalmeat.sa', balance: 22000 },
]
