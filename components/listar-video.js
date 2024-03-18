import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";

const ListarVideo = ({ video }) => {
    const {
        title,
        created,
        image,
        categories: { data: categories },
        url,
    } = video;

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
        <div className="listarVideo">
            <Link href={`/video/${url}`}>
                <Image
                    src={image.data.attributes.formats.medium.url}
                    width={400}
                    height={250}
                    alt={`Imagen video ${title}`}
                />
                <div className="listarVideo__information">
                    <h3 className="listarVideo__information__title">{title}</h3>
                    <div className="listarVideo__data">
                        <p className="listarVideo__date">{fechaFormateada}</p>
                        <p className="listarVideo__categories">
                            {categoriesRendered}
                            {remainingCategoriesCount > 0 &&
                                `, +${remainingCategoriesCount}`}
                        </p>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ListarVideo;
