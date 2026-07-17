import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Lenis from 'lenis';
import Navbar from './Navbar';
import Footer from './Footer';
const PublicLayout = () => {
  const location = useLocation();
  const fullFooter = ['/kontak', '/tentang', '/pengalaman', '/proyek', '/keahlian'].includes(
    location.pathname
  );

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
    });
    let frame;
    const raf = (time) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-hero">
      <Navbar />
      <main className="flex-1 pt-24">
        <Outlet />
      </main>
      <Footer variant={fullFooter ? 'full' : 'simple'} />
    </div>
  );
};

export default PublicLayout;
