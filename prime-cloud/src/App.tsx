import { Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from './components/layout/DashboardLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import POS from './pages/POS'
import Orders from './pages/Orders'
import Products from './pages/Products'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import Placeholder from './pages/Placeholder'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/pos" element={<POS />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/products" element={<Products />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/kitchen" element={<Placeholder titleEn="Kitchen Display" titleAr="شاشة المطبخ" />} />
        <Route path="/categories" element={<Placeholder titleEn="Categories" titleAr="التصنيفات" />} />
        <Route path="/offers" element={<Placeholder titleEn="Offers & Packages" titleAr="العروض والباقات" />} />
        <Route path="/addons" element={<Placeholder titleEn="Add-ons & Options" titleAr="الإضافات والخيارات" />} />
        <Route path="/branches" element={<Placeholder titleEn="Branches" titleAr="الفروع" />} />
        <Route path="/tables" element={<Placeholder titleEn="Tables" titleAr="الطاولات" />} />
        <Route path="/inventory" element={<Placeholder titleEn="Inventory" titleAr="المخزون" />} />
        <Route path="/inventory-transfers" element={<Placeholder titleEn="Inventory Transfers" titleAr="تحويلات المخزون" />} />
        <Route path="/waste" element={<Placeholder titleEn="Waste & Damaged" titleAr="الهدر والتالف" />} />
        <Route path="/stock-movement" element={<Placeholder titleEn="Stock Movement" titleAr="حركة المخزون" />} />
        <Route path="/purchases" element={<Placeholder titleEn="Purchases" titleAr="المشتريات" />} />
        <Route path="/suppliers" element={<Placeholder titleEn="Suppliers" titleAr="الموردين" />} />
        <Route path="/sales" element={<Placeholder titleEn="Sales & Invoices" titleAr="المبيعات والفواتير" />} />
        <Route path="/customers" element={<Placeholder titleEn="Customers" titleAr="العملاء" />} />
        <Route path="/accounting" element={<Placeholder titleEn="Accounting" titleAr="المحاسبة" />} />
        <Route path="/journal" element={<Placeholder titleEn="Journal Entries" titleAr="القيود اليومية" />} />
        <Route path="/expenses" element={<Placeholder titleEn="Expenses" titleAr="المصروفات" />} />
        <Route path="/einvoicing" element={<Placeholder titleEn="E-Invoicing" titleAr="الفوترة الإلكترونية" />} />
        <Route path="/zatca" element={<Placeholder titleEn="ZATCA Audit" titleAr="تدقيق ZATCA" />} />
        <Route path="/costing" element={<Placeholder titleEn="Product Costing" titleAr="تكلفة المنتجات" />} />
        <Route path="/employees" element={<Placeholder titleEn="Employees & Permissions" titleAr="الموظفين والصلاحيات" />} />
        <Route path="/activity" element={<Placeholder titleEn="Activity Log" titleAr="سجل النشاط" />} />
        <Route path="/subscription" element={<Placeholder titleEn="Subscription & Billing" titleAr="الاشتراك والفوترة" />} />
        <Route path="/pos-devices" element={<Placeholder titleEn="POS Devices" titleAr="أجهزة POS" />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
