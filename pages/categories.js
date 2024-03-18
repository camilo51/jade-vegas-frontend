import Link from 'next/link';
import Layout from "../components/layouts";

const Categories = ({categories}) => {
    return (
        <Layout title="Categories">
            <main className="container categories">
                <h2 className="categories__heading">Categories</h2>
                <div className="categories__container">
                    {categories
                        .sort((a, b) => a.id - b.id)
                        .map((category) => {
                            const categoryURL =
                                category.attributes.title.toLowerCase();

                            return (
                                <Link
                                    href={`/categories/${categoryURL}`}
                                    key={category.id}
                                    className="categories__category"
                                >
                                    <p>{category.attributes.title}</p>
                                </Link>
                            );
                        })}
                </div>
            </main>
        </Layout>
    );
};
export default Categories;

export const getServerSideProps = async () => {
    const respuesta = await fetch(`${process.env.API_URL}/categories`);
    const {data: categories} =  await respuesta.json();


  return {
    props: {
        categories
    }
  }
}