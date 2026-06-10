import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import FloatingActions from '@/components/layout/FloatingActions'
import HeroSection from '@/components/sections/HeroSection'
import SignatureDishSection from '@/components/sections/SignatureDishSection'
import AboutSection from '@/components/sections/AboutSection'
import MenuSection from '@/components/sections/MenuSection'
import PackagesSection from '@/components/sections/PackagesSection'
import FacilitiesSection from '@/components/sections/FacilitiesSection'
import GallerySection from '@/components/sections/GallerySection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import LocationSection from '@/components/sections/LocationSection'
import CtaSection from '@/components/sections/CtaSection'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <HeroSection />
        <SignatureDishSection />
        <AboutSection />
        <MenuSection />
        <PackagesSection />
        <FacilitiesSection />
        <GallerySection />
        <TestimonialsSection />
        <LocationSection />
        <CtaSection />
      </main>
      <Footer />
      <FloatingActions />
    </>
  )
}
