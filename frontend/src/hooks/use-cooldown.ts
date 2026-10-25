import { useEffect, useState } from "react";
import { getCooldownRemaining, startOtpCooldown } from "../lib/otp-cooldown";

export function useCooldown(key: string, defaultSeconds = 60) {
  const [secondsLeft, setSecondsLeft] = useState(() => getCooldownRemaining(key));

  useEffect(() => {
    const tick = () => {
      const remaining = getCooldownRemaining(key);
      setSecondsLeft(remaining);
      if (remaining === 0) {
        localStorage.removeItem(key);
      }
    };

    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, [key]);

  const start = (seconds = defaultSeconds) => {
    startOtpCooldown(key, seconds);
    setSecondsLeft(seconds);
  };

  return { secondsLeft, start };
}
