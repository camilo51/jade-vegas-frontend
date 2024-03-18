import { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
const ListarMembership = ({ membership }) => {
    const meses = [
        { duration: 1, discount: 0 },
        { duration: 3, discount: 20 },
        { duration: 6, discount: 40 },
    ];
    const { price, title } = membership;
    const [data, setData] = useState([]);

    const URL_HOST =
        "https://3b58-2800-e2-b380-32c0-a84a-9edc-5847-f5d8.ngrok-free.app/congratulation";
    const LLAVE_IDENTIDAD = "dmYmWuK9vCltWzCjn-vLV6RUtaJRwUNm2ZunLlIksAo";
    const LLAVE_SECRETA = "M5ko4UZlLtkiSE6VBaf0gw";

    useEffect(() => {
        const newData = meses.map((mes) => {
            const precioTotal = price * mes.duration;
            const descuento = ((precioTotal * mes.discount) / 100).toFixed(2);
            const precioPagar = (precioTotal - descuento).toFixed(2);
            const precioMes = (precioPagar / mes.duration).toFixed(2);

            const cop = 4000;
            const orderId = `${title.toLowerCase()}-${
                mes.duration
            }-${precioPagar.replace(".", "")}`;
            const amount = cop * precioPagar;
            const divisa = "COP";
            const datosHash = `${orderId}${amount}${divisa}${LLAVE_SECRETA}`;

            const hashHexValue = CryptoJS.SHA256(datosHash).toString(
                CryptoJS.enc.Hex
            );

            return {
                precioMes,
                precioPagar,
                hashHex: hashHexValue,
                orderId,
                divisa,
                amount,
            };
        });

        setData(newData);
    }, [price, title]);

    return (
        <div className="membership">
            <h3 className="memebership__title">{title}</h3>
            <div className="membership__container">
                {data.map((membresiaData, index) => {
                    return (
                        <div key={index} className="membership__option">
                            <div>
                                <h4 className="membership__meses">{`${
                                    membresiaData.duration
                                } Month${
                                    membresiaData.duration > 1 ? "s" : ""
                                }`}</h4>
                                <p className="membership__price-mes">
                                    ${membresiaData.precioMes}{" "}
                                    <span>/Month</span>
                                </p>
                                <p className="membership__price-total">
                                    Billed in one payment of $
                                    {membresiaData.precioPagar}
                                </p>
                            </div>
                            <script
                                data-bold-button
                                data-order-id={membresiaData.orderId}
                                data-currency={membresiaData.divisa}
                                data-amount={membresiaData.amount}
                                data-api-key={LLAVE_IDENTIDAD}
                                data-integrity-signature={membresiaData.hashHex}
                                data-redirection-url={URL_HOST}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
export default ListarMembership;
