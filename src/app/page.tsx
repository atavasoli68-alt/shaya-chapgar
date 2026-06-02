import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/shop/HeroSection';
import FeaturedProducts from '@/components/shop/FeaturedProducts';
import CategoriesSection from '@/components/shop/CategoriesSection';
import ServicesSection from '@/components/shop/ServicesSection';
import FormsSection from '@/components/shop/FormsSection';
import BrandsSection from '@/components/shop/BrandsSection';
import BlogSection from '@/components/shop/BlogSection';
import ChatWidget from '@/components/ui/ChatWidget';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <CategoriesSection />
        <FeaturedProducts />
        <ServicesSection />
        <FormsSection />
        <BlogSection />
        <BrandsSection />
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
