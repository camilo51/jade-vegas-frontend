import Image from "next/image";
import Link from "next/link";
import logo from "../public/img/logos/logoPrincipalBlanco.png";

const Header = () => {
    return (
        <header className="header">
            <div className="header__barra container">
                <Link href="/" className="header__logo">
                    <Image
                        src={logo.src}
                        width={300}
                        height={100}
                        alt="Imagen del logo"
                    />
                </Link>

                <nav className="navegation">
                    <Link className="navegation__link" href="/">
                        Home
                    </Link>
                    <Link className="navegation__link" href="/categories">
                        Categories
                    </Link>
                    <Link className="navegation__link" href="/memberships">
                        Memberships
                    </Link>
                </nav>
            </div>
        </header>
    );
};
export default Header;
