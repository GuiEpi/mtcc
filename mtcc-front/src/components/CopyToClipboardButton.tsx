import { Check, Copy } from 'lucide-react';
import { useState } from 'react'
import { Button } from './ui/button';

interface Props {
    text: string;
  }

export const CopyToClipboardButton: React.FC<Props> = ({ text }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Réinitialise l'icône après 2 secondes
      } catch (err) {
        console.error('Failed to copy!', err);
      }
    };
  
    return (
      <Button variant="outline" onClick={handleCopy} size="icon">
        {copied ? <Check color="#8c52ff" className="h-[1.2rem] w-[1.2rem]" /> : <Copy className="h-[1.2rem] w-[1.2rem]" />}
      </Button>
    );
}
