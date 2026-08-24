import { BannerStays } from "@/components/home/BannerStays";
import { FAQ } from "@/components/home/FAQ";
import { Header } from "@/components/home/Header";
import { HomeProperties } from "@/components/home/HomeProperties";
import { SobreStayke } from "@/components/home/SobreStayke";
import { Testimonios } from "@/components/home/Testimonios";

export default function Home() {
  return (
    <>
      <Header />
      <HomeProperties />
      <SobreStayke />
      <BannerStays />
      <Testimonios />
      <FAQ />
    </>
  );
}
