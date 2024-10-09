import { useEffect, useRef, useState } from "react";

const UseIsTruncated = () => {
    const textRef = useRef<HTMLDivElement>(null);
    const [isTruncated, setIsTruncated] = useState(false);
  
    useEffect(() => {
      if (textRef.current) {
        setIsTruncated(textRef.current.scrollWidth > textRef.current.clientWidth);
      }
    }, []);
  
    return [isTruncated, textRef] as const;
  };
export default UseIsTruncated