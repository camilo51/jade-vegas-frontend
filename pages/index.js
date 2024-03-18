import Banner from "../components/banner";
import Layout from "../components/layouts";
import ListarVideo from "../components/listar-video";
import { Swiper, SwiperSlide } from "swiper/react";
import {
    Navigation,
    Pagination,
    Scrollbar,
    A11y,
    Autoplay,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

export default function Home({ videos, banners }) {
    return (
        <>
            <Layout title={"Home"}>
                <section>
                    {banners.length > 1 ? (
                        <Swiper
                            style={{
                                "--swiper-navigation-color": "#fff",
                                "--swiper-pagination-color": "#fff",
                            }}
                            modules={[
                                Navigation,
                                Pagination,
                                Scrollbar,
                                A11y,
                                Autoplay,
                            ]}
                            spaceBetween={50}
                            slidesPerView={1}
                            navigation
                            pagination={{ clickable: true }}
                            autoplay={{
                                delay: 4000,
                            }}
                            loop={true}
                        >
                            {banners.map((banner, index) => (
                                <SwiperSlide key={index}>
                                    <Banner banner={banner} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    ) : (
                        <Banner banner={banners[0]} />
                    )}
                </section>
                <main className="videos container">
                    <h1 className="videos__heading">Home</h1>

                    {videos.length > 0 && (
                        <div className="videos__grid">
                            {videos
                                .sort((a, b) => b.id - a.id)
                                .map((video) => (
                                    <ListarVideo
                                        key={video.id}
                                        video={video.attributes}
                                    />
                                ))}
                        </div>
                    )}
                </main>
            </Layout>
        </>
    );
}

export const getServerSideProps = async () => {
    const urlVideos = `${process.env.API_URL}/videos?populate=image,categories`;
    const urlBanners = `${process.env.API_URL}/banners?populate=image`;

    const [resVideos, resBanners] = await Promise.all([
        fetch(urlVideos),
        fetch(urlBanners),
    ]);

    const [{ data: videos }, { data: banners }] = await Promise.all([
        resVideos.json(),
        resBanners.json(),
    ]);
    return {
        props: {
            videos,
            banners,
        },
    };
};
