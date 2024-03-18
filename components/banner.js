import Image from "next/image";

const Banner = ({ banner: { attributes: banner } }) => {
    return (
        <Image
            src={banner.image.data[0].attributes.url}
            width={1980}
            height={500}
            alt="Banner de pagina"
        />
    );
};
export default Banner;
