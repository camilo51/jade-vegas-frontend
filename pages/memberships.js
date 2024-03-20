import Script from "next/script";
import Layout from "../components/layouts";
import ListarMembership from "../components/listar-membership";
const Memberships = ({memberships}) => {
    return (
        <Layout title="Memberships">
            <Script src="https://checkout.bold.co/library/boldPaymentButton.js" /> 
            <main className="container memberships mb-5">
                <h2 className="memberships__heading">Memberships</h2>
                <p className="memebrships__warning">If the purchase button does not load, please reload the page. </p>
                <div className="memberships__container">
                    {memberships.map((membership) => (
                        <ListarMembership
                        key={membership.id}
                        membership={membership.attributes}
                        />
                        ))}
                </div>
                
            </main>
        </Layout>
    );
};
export default Memberships;

export const getStaticProps = async () => {
    const respuesta = await fetch(`${process.env.API_URL}/memberships`);
    const {data: memberships} =  await respuesta.json();


  return {
    props: {
        memberships
    }
  }
}