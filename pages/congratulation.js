import Script from "next/script";
import { useEffect, useState } from "react";
import Layout from "../components/layouts";
import copy from "clipboard-copy";
import { useRouter } from "next/router";

const Congratulation = ({
    resultadoBold,
    resultadoTelegram,
    bot_api,
    chat_id,
}) => {
    const [boldOrderId, setBoldOrderId] = useState(null);
    const { payment_status, reference_id } = resultadoBold;
    // const [botApi, setBotApi] = useState(bot_api);
    // const [charId, setChatId] = useState(chat_id);

    const [generatedLink, setGeneratedLink] = useState(
        resultadoTelegram.result
    );
    const router = useRouter();
    let contenido;
    useEffect(() => {
        if (payment_status !== "APPROVED") {
            router.push("/memberships");
        }
    }, [payment_status, router]);

    useEffect(() => {
        const url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);
        const boldOrderId = params.get("bold-order-id");
        setBoldOrderId(boldOrderId);
    }, [bot_api]);

    if (payment_status === "APPROVED") {
        const membership = reference_id.split("-")[0];
        const month = reference_id.split("-")[1];
        const price = reference_id.split("-")[2];

        const copyText = () => {
            copy(generatedLink);
        };

        const generateNewLink = async () => {

            const response = await fetch(
                `https://api.telegram.org/bot${bot_api}/exportChatInviteLink?chat_id=${chat_id}`
            );
            const data = await response.json();
            const newLink = data.result;
            setGeneratedLink(newLink);
        };

        switch (payment_status) {
            case "APPROVED":
                contenido = (
                    <main className="container congratulation">
                        <h1 className="congratulation__heading">
                            Congratulation
                        </h1>
                        <div className="congratulation__container">
                            <h2 className="congratulation__title">
                                Your {membership} membership has been aproved
                            </h2>
                            <p className="congratulation__information">
                                Enjoy all our content during {month}{" "}
                                {`month${month > 1 ? "s" : ""}`}. To keep
                                accessing our content, simply click on the
                                button below. This button will take you to our
                                Telegram channel, where you can join the group
                                corresponding to your membership or video.
                            </p>

                            <p className="congratulation__information">
                                If the link doesn&lsquo;t work, you can click on{" "}
                                <span className="bold">
                                    &apos;Create new link&apos;
                                </span>
                                . This will automatically generate a new link
                                for you to access the content without any
                                issues.
                            </p>

                            <div className="congratulation__redirect">
                                <a
                                    target="_black"
                                    href={generatedLink}
                                    className="congratulation__btn"
                                >
                                    Ir a telegram
                                </a>
                                <p className="congratulation__link">
                                    {generatedLink}
                                    <span onClick={copyText}>
                                        <i className="fa-solid fa-copy"></i>
                                    </span>
                                </p>

                                <span
                                    onClick={generateNewLink}
                                    className="congratulation__new"
                                >
                                    Create new link
                                </span>
                            </div>
                        </div>
                    </main>
                );
                break;
            default:
                break;
        }
    }

    return (
        <Layout title="Congratulation">
            {contenido}
            <Script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/js/all.min.js" />
        </Layout>
    );
};
export default Congratulation;

export const getServerSideProps = async ({ query }) => {
    const { "bold-order-id": boldOrderId } = query;
    let resultadoBold;
    let resultadoTelegram;
    if (boldOrderId !== null) {
        const respuestaBold = await fetch(
            `https://payments.api.bold.co/v2/payment-voucher/${boldOrderId}`,
            {
                method: "GET",
                headers: {
                    Authorization: `x-api-key ${process.env.LLAVE_IDENTIDAD}`,
                },
            }
        );
        resultadoBold = await respuestaBold.json();
    }

    if (resultadoBold.payment_status !== "APPROVED") {
        return {
            props: {
                resultadoBold,
            },
        };
    }
    let chat_id;
    let bot_api;
    if (resultadoBold.payment_status === "APPROVED") {
        const membership = resultadoBold.reference_id.split("-")[0];
        const month = resultadoBold.reference_id.split("-")[1];

        switch (month) {
            case "1":
                bot_api = "6441888027:AAEgcNTRqojLgSsC0VDqZ9PUTqlNtnfo4aM";
                switch (membership) {
                    case "premium":
                        chat_id = "-1002104147541";
                        break;
                    case "stantard":
                        chat_id = "-1002052214052";
                        break;
                    case "basic":
                        chat_id = "-1002112239832";
                        break;
                }
                break;
            case "3":
                bot_api = "6790015621:AAHFFuJ8F3f2crRz9HyAirA8PMyDM7mEQC8";
                switch (membership) {
                    case "premium":
                        chat_id = "-1002081965430";
                        break;
                    case "stantard":
                        chat_id = "-1002071740646";
                        break;
                    case "basic":
                        chat_id = "-1002097069886";
                        break;
                }
                break;
            case "6":
                bot_api = "7181907496:AAHigAV5yl7iEvpJBcjJUXvl4vKDMRRV0QY";
                switch (membership) {
                    case "premium":
                        chat_id = "-1002118911920";
                        break;
                    case "stantard":
                        chat_id = "-1002120513049";
                        break;
                    case "basic":
                        chat_id = "-1002107936723";
                        break;
                }
                break;
        }
        const respuestaTelegram = await fetch(
            `https://api.telegram.org/bot${bot_api}/exportChatInviteLink?chat_id=${chat_id}`
        );
        resultadoTelegram = await respuestaTelegram.json();
    }

    return {
        props: {
            resultadoBold,
            resultadoTelegram,
            bot_api,
            chat_id,
        },
    };
};
