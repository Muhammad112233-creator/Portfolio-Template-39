import Actor from '@/components/home/Actor';
import Hero from '@/components/home/Hero';
import PageTurn from '@/components/home/PageTurn';
import ServicesIntro from '@/components/home/ServicesIntro';
import Why from '@/components/home/Why';
import WorkOrbit from '@/components/home/WorkOrbit';
import Footer from '@/components/site/Footer';

export default function Home() {
  return (
    <main id="main-content" className="relative min-h-screen overflow-x-clip">
      <Hero />
      <PageTurn>
        <Why />
      </PageTurn>
      <Actor />
      <div className="home-titles relative z-[2]">
        <ServicesIntro />
        <WorkOrbit />
      </div>
      <Footer />
    </main>
  );
}
