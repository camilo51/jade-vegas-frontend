import Image from "next/image";
import Link from "next/link";
import logo from "../public/img/logos/logoPrincipalBlanco.png";
import { useEffect, useState } from "react";

const Header = () => {
    const [menu, setMenu] = useState(false);
    const handleMenu = () => {
        setMenu(!menu)
        console.log(menu);
    }

    return (
        <header className="header">
            <div className="header__barra container">
                <div className="header__responsive">
                    <Link href="/" className="header__logo">
                        <Image
                            src={logo.src}
                            width={300}
                            height={100}
                            alt="Imagen del logo"
                        />
                    </Link>

                    <div className="header__menu" onClick={handleMenu}>
                        <i className="fa-solid fa-bars"></i>
                    </div>
                </div>
                <nav className="navegation">
                    <div className={`navegation__contenedor navegation__contenedor${menu ? '-active' : ''}`}>

                        <Link className="navegation__link" href="/">
                            Home
                        </Link>
                        <Link className="navegation__link" href="/categories">
                            Categories
                        </Link>
                        <Link className="navegation__link" href="/memberships">
                            Memberships
                        </Link>
                    </div>
                </nav>
            </div>
        </header>
    );
};
export default Header;
