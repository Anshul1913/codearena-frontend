import { useEffect, useRef } from "react";

export default function useProctoring(onViolation) {

  const violationCount = useRef(0);

  useEffect(() => {

    // Fullscreen
    document.documentElement.requestFullscreen();

    const handleVisibility = () => {
      if (document.hidden) {
        violationCount.current++;
        onViolation("TAB_SWITCH", violationCount.current);
      }
    };

    const handleBlur = () => {
      violationCount.current++;
      onViolation("WINDOW_BLUR", violationCount.current);
    };

    const handleFullscreenExit = () => {
      if (!document.fullscreenElement) {
        violationCount.current++;
        onViolation("EXIT_FULLSCREEN", violationCount.current);
      }
    };

    window.addEventListener("blur", handleBlur);
    document.addEventListener("visibilitychange", handleVisibility);
    document.addEventListener("fullscreenchange", handleFullscreenExit);

    // Disable Right Click
    document.addEventListener("contextmenu", e => e.preventDefault());

    return () => {
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("visibilitychange", handleVisibility);
      document.removeEventListener("fullscreenchange", handleFullscreenExit);
    };

  }, []);
}
