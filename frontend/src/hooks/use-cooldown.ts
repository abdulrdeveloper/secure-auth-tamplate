import { useEffect, useState } from "react";
import {
  OTP_COOLDOWN_SECONDS,
  getCooldownRemaining,
  startOtpCooldown,
} from "../lib/otp-cooldown";

export function useCooldown(key: string) {
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

  const start = () => {
    startOtpCooldown(key);
    setSecondsLeft(OTP_COOLDOWN_SECONDS);
  };

  return { secondsLeft, start };
}
