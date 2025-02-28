import HeroSection from '../components/HeroSection';
import PartnersGrid from '../components/PartinersGrid';
import ArticleGrid from '../components/ArticleGrid';
import Xstp from '../components/xstp';
import TeamSection from '../components/TeamSection';
import FAQSection from '../components/FAQsection';
import Header from '../components/Header';
import { IMAGES } from '../config/images';

const Home = () => {
    const images: (keyof typeof IMAGES.partners)[] = [
        'l1', 
        'l2', 
        'l3', 
        'l4', 
        'l5', 
        'l6', 
        'l7', 
        'l8',
        'chainlink',
        'transak'
    ];

    return (
        <div className='bg-black'>
           <Header />
           <HeroSection />
            <div className="flex justify-center items-center">
                <PartnersGrid images={images} animationSpeed={1.0} />
            </div>

           <main className="p-1 pb-5 flex flex-col items-center justify-center container max-w-screen-lg mx-auto">
                <ArticleGrid/>
                <Xstp />
           </main>
           <TeamSection />
           <FAQSection />
        </div>
    );
};

export default Home; 