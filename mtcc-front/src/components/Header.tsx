import { ModeToggle } from "./ui/mode-toggle"
import mtccLogo from "../assets/mtcc.svg"
import { Button } from "./ui/button"
import { Github, Info } from "lucide-react"
import { Link } from "react-router-dom";
import { Separator } from "./ui/separator";
import { useEffect, useState } from "react";

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsScrolled(offset > 0);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`sticky top-0 z-50 w-full transition-all ${isScrolled ? 'bg-background/95 supports-[backdrop-filter]:bg-background/30 backdrop-blur' : 'bg-transparent'}`}>
        <div className="flex items-center container h-14">
          <nav className="flex items-center space-x-6 mr-4">
            <div className="hidden md:block">
              <Link to="/" className="flex items-center space-x-2">
                <img
                    src={mtccLogo}
                    alt="Go to Homepage"
                    width={24}
                    height={24}
                />
                <span className="font-bold">mtcc</span>
              </Link>
            </div>
            <Link to="/pres" className="relative after:bg-[#8C52FF] after:absolute after:h-0.5 after:rounded after:w-0 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-700 cursor-pointer">mtcc <span className="text-[#8C52FF]">PRES</span></Link>
            <Link to="/nfo" className="relative after:bg-[#8C52FF] after:absolute after:h-0.5 after:rounded after:w-0 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-700 cursor-pointer">mtcc <span className="text-[#8C52FF]">Nfo Builder</span></Link>
          </nav>
          <div className="flex flex-1 items-center space-x-2 justify-end">
            <Button variant="outline" size="icon" asChild>
              <Link to="/about" download>
                <Info className="h-[1.2rem] w-[1.2rem]" />
              </Link>
            </Button>
            <a target="https://github.com/GuiEpi/mtcc" rel="noopener" href="https://github.com/GuiEpi/mtcc">
              <Button variant="outline" size="icon">
                <Github className="h-[1.2rem] w-[1.2rem]" />
              </Button>
            </a>
            <ModeToggle />
          </div>
        </div>
        <div className={`transition-opacity duration-700 ease-in-out ${isScrolled ? 'opacity-100' : 'opacity-0'}`}>
          <Separator />
        </div>
      </header>
  )
}
