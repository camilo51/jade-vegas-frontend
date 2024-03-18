import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import Layout from "../../components/layouts";

const Video = ({ video }) => {
    const {
        title,
        image,
        categories: { data: categories },
        created,
        description,
    } = video[0].attributes;
    const fecha = new Date(created);
    const fechaFormateada = format(fecha, "MMM dd yyyy");

    const MAX_CATEGORIES_TO_DISPLAY = 2;

    const categoriesToDisplay = categories.slice(0, MAX_CATEGORIES_TO_DISPLAY);
    const remainingCategoriesCount =
        categories.length - MAX_CATEGORIES_TO_DISPLAY;

    const categoriesRendered = categoriesToDisplay.map((category, index) => (
        <span key={category.id}>
            {category.attributes.title}
            {index < categoriesToDisplay.length - 1 && ", "}
        </span>
    ));
    return (
        <Layout title={title}>
            <main>
                <div className="video__container">
                    <div className="video__content">
                        <Image
                            src={image.data.attributes.url}
                            width={800}
                            height={500}
                            alt={`Imagen video ${title}`}
                        />
                        <div className="video__information">
                            <h3 className="video__title">{title}</h3>
                            <div className="video__categories-date">
                                <p className="video__categories">
                                    {categoriesRendered}
                                    {remainingCategoriesCount > 0 &&
                                        `, +${remainingCategoriesCount}`}
                                </p>
                                <p className="video__date">{fechaFormateada}</p>
                            </div>
                            <p className="video__description">
                                {description[0].children[0].text}
                            </p>
                        </div>
                    </div>
                    <div className="video__buy">
                        <Link href="/memberships">Buy your membership</Link>
                    </div>
                </div>
            </main>
        </Layout>
    );
};
export default Video;

export const getServerSideProps = async ({ query: { url } }) => {
    const respuesta = await fetch(
        `${process.env.API_URL}/videos?filters[url]=${url}&populate=image,categories`
    );
    const { data: video } = await respuesta.json();

    return {
        props: {
            video,
        },
    };
};
