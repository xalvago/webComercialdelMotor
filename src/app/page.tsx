import HeroSection from "@/components/sections/HeroSection";
import StatsBar from "@/components/sections/StatsBar";
import ProductosDestacados from "@/components/sections/ProductosDestacados";
import NoticiasRecientes from "@/components/sections/NoticiasRecientes";
import DelegacionesPreview from "@/components/sections/DelegacionesPreview";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <ProductosDestacados />
      <NoticiasRecientes />
      <DelegacionesPreview />
    </>
  );
}
