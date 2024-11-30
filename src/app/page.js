import { CallToAction } from "@mui/icons-material";
import AboutUs from "./components/AboutUs";
import FeaturedPackages from "./components/FeaturedPackages";
import Headers from "./components/Header";
import Herosection from "./components/Herosection";
import Destinations from "./components/PopularDistinations";
import Services from "./components/Services";
import Testimonials from "./components/Testimonials";
import WhyChooseUs from "./components/WhyChooseUs";
import Contact from "./components/ContactInformation";
import Newsletter from "./components/NewsLetter";
import Partners from "./components/PartenerLogos";
import Footer from "./components/Footer";

export default function Home(){
  return(
    <>
    <Headers/>
    <Herosection/>
    <Services/>
    <AboutUs/>
    <Destinations/>
    <FeaturedPackages/>
    <Testimonials/>
    <WhyChooseUs/>
    <CallToAction/>
    <Contact/>
    <Newsletter/>
    <Partners/>
    <Footer/>
    </>
  )
}