import ListarVideo from "../../components/listar-video";
import Layout from "../../components/layouts";

const Category = ({ category }) => {
    const {
        title,
        videos: { data: videos },
    } = category[0].attributes;
    return (
        <Layout title={title}>
            <main className="category container">
                <h2 className="category__heading">{title}</h2>
                <div className="category__grid">
                    {videos
                        .sort((a, b) => b.id - a.id)
                        .map((video) => (
                            <ListarVideo
                                key={video.id}
                                video={video.attributes}
                            />
                        ))}
                </div>
            </main>
        </Layout>
    );
};
export default Category;

export const getServerSideProps = async ({ query: { url } }) => {
    const respuesta = await fetch(
        `${process.env.API_URL}/categories?filters[url]=${url}&populate=videos.categories,videos.image`
    );
    const { data: category } = await respuesta.json();

    return {
        props: {
            category,
        },
    };
};
