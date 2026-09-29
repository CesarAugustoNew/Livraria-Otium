import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CheckoutLayout } from './components/layout/CheckoutLayout';
import { Layout } from './components/layout/Layout';
import { AuthProvider } from './contexts/AuthContext';
import { ShopProvider } from './contexts/ShopContext';
import { ToastProvider } from './contexts/ToastContext';
import { Cart } from './pages/Cart';
import { Catalog } from './pages/Catalog';
import { Checkout } from './pages/Checkout';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { NotFound } from './pages/NotFound';
import { Register } from './pages/Register';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <ShopProvider>
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="livros" element={<Catalog />} />
                <Route path="entrar" element={<Login />} />
                <Route path="cadastro" element={<Register />} />
                <Route path="favoritos" element={<NotFound soon />} />
                <Route path="*" element={<NotFound />} />
              </Route>
              {/* Carrinho e checkout usam um layout enxuto, sem busca/menu, para reduzir distração. */}
              <Route element={<CheckoutLayout />}>
                <Route path="carrinho" element={<Cart />} />
                <Route path="checkout" element={<Checkout />} />
              </Route>
            </Routes>
          </ShopProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
