import { useState } from "react";
import { Button } from "./ui/button";



interface Props {
	nfoLink: string;
}

export const DownloadNfoButton: React.FC<Props> = (props) => {
	const [isButtonDisabled, setIsButtonDisabled] = useState(false);

	const handleClick = () => {
    setIsButtonDisabled(true);
  };
  
	if (isButtonDisabled) {
		return (
			<Button onClick={handleClick} disabled >
				Download Nfo
			</Button>
  )
	} else {
		return (
			<Button onClick={handleClick} asChild>
				<a href={props.nfoLink} download>
					Download Nfo
				</a>
			</Button>
		)
	}
}