import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';

interface LoadingButtonProps {
  isLoading: boolean;
  text: string;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({ isLoading, text }) => {
  console.log('isLoading', isLoading);
  console.log('text', text);
  return (
    <Button className="w-full flex justify-center items-center" type="submit" disabled={isLoading}>
      {isLoading ? (
        <Loader2 className="animate-spin" />
      ) : (
        text
      )}
    </Button>
  );
};

export default LoadingButton;
