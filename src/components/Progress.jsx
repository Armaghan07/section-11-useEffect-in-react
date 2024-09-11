import { useState, useEffect } from "react";

export default function Progress({ Timer }) {
  const [remainingTime, setRemainingTime] = useState(Timer);

  useEffect(() => {
    const interval = setInterval(() => {
      // console.log("hello time is running");
      setRemainingTime((prevTime) => prevTime - 10);
    }, 10);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <progress value={remainingTime} max={Timer} />
    </>
  );
}
