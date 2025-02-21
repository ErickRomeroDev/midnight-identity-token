import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';

const Test = () => {
  const [message, setMessage] = useState('0');
  const { toast } = useToast();

  
  useEffect(() => {
    console.log(message);
    toast({
        description: message,
      })
  }, [message]);
  return (
    <>
      <div onClick={() => setMessage('hola1')} className="mt-[70px] text-white">
        HOLA1
      </div>
      <div onClick={() => setMessage('hola2')} className="mt-[70px] text-white">
        HOLA2
      </div>
      <div onClick={() => setMessage('hola3')} className="mt-[70px] text-white">
        HOLA3
      </div>
      {message}
    </>
  );
};

export default Test;
