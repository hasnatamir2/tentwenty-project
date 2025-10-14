import HeroSlider from "@/components/hero-slider";
import DraggableSlider from "@/components/draggable-slider";

export default function Home() {
    return (
        <main>
            <HeroSlider />
            <div className='text-center md:mb-16 mt-20'>
                <h4 className='text-[56px]'>Quality Products</h4>
                <p className='md:text-2xl text-base text-[#7A7777] font-normal md:max-w-1/2 m-auto mt-4 px-4'>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
            </div>
            <DraggableSlider />
        </main>
    );
}
