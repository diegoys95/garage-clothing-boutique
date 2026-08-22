import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import ProductGrid from "@/components/ProductGrid";
import Authenticity from "@/components/Authenticity";
import SizeGuide from "@/components/SizeGuide";
import Shipping from "@/components/Shipping";
import Resellers from "@/components/Resellers";
import Payment from "@/components/Payment";
import AmbientMusic from "@/components/AmbientMusic";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <ProductGrid />
      <Authenticity />
      <SizeGuide />
      <Shipping />
      <Resellers />
      <Payment />
      <AmbientMusic />
    </>
  );
}
