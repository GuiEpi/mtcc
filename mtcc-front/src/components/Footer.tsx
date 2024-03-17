export const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="flex items-center justify-center flex-col">
            <p>Made with 💜 by GuiEpi</p>
            <a className="flex items-center space-x-2" href="/">
                <img
                    src="/mtcc.svg"
                    alt="Go to Homepage"
                    width={24}
                    height={24}
                />
                © {currentYear} <span className="font-bold">mtcc</span>
            </a>
        </footer>
    )
};