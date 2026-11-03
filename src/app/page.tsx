import Banner from "@/components/home/Banner";
import CauseMarquee from "@/components/home/CauseMarquee";
import Features from "@/components/home/Features";
import Gallery from "@/components/home/Gallery";
import Newsletter from "@/components/home/Newsletter";
import RecentEvents from "@/components/home/RecentEvents";

export default function Home() {
  return (
    <>
      <Banner />
      <CauseMarquee />
      <RecentEvents />
      <Features />
      <Gallery />
      <Newsletter />
    </>
  );
}
