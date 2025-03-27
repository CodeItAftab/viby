import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import loaderElement from "../../lotties/globe.lottie";
import buffering from "../../lotties/buffering.lottie";
import { memo } from "react";

const MainLoadingScreen = memo(() => {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="h-[400px]">
        <DotLottieReact src={loaderElement} loop autoplay />
      </div>
    </div>
  );
});
MainLoadingScreen.displayName = "MainLoadingScreen";

const BufferingScreen = memo(() => {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="h-[100px]">
        <DotLottieReact src={buffering} loop autoplay />
      </div>
    </div>
  );
});
BufferingScreen.displayName = "BufferingScreen";

export { MainLoadingScreen, BufferingScreen };
