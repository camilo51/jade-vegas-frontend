import Head from "next/head";
import Header from "./header";
import Footer from "./footer";
Footer

const Layout = ({ children, title = '' }) => (
    <>
        <Head>
            <title>BbwLoveJadeVegas - {title}</title>
        </Head>

        <div className="ordenPagina">
            <Header />
            {children}
            <Footer />
        </div>
    </>
);

export default Layout;
