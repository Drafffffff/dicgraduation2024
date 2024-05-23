import { useEffect } from "react";
import "./App.css";
import SVGDraw from "./draw/draw";
//@ts-ignore
import ScrambleText from "scramble-text";

function App() {
  useEffect(() => {
    const container = document.querySelector("#svgContainer");
    container!.innerHTML = "";
    const svg = new SVGDraw(container as HTMLElement, 1800, 2000);
    svg.update();
  }, []);
  return (
    <>
      {/* <div className="absolute top-0 left-0 w-[1024px] h-[1280px] "> */}
      {/*   <img src="direction.png" alt="" className="w-full h-full" /> */}
      {/* </div> */}
      {/* <div className="text text-red absolute top-0 left-0 w-[1024px] h-[1280px]"> */}
      {/*   <span className="topt top-[76px] left-[49px]" id="text2"> */}
      {/*     In the forest */}
      {/*   </span> */}
      {/*   <span className="topt top-[76px] left-[293px]"> */}
      {/*     where countless trees grow together , their collective pres- */}
      {/*   </span> */}
      {/*   <span className="topt top-[106px] left-[49px]"> */}
      {/*     ence forms */}
      {/*     <span id="text3" className="w-[372.7px] overflow-hidden "> */}
      {/*       a vibrant and thriving woodland.Beneath the canopy */}
      {/*     </span> */}
      {/*   </span> */}
      {/*   <span className="topt top-[106px] left-[880px]">roots in-</span> */}
      {/*   <span className="topt top-[138px] left-[49px] tracking-[0.35px]"> */}
      {/*     tertwine densely while diverse species flourish in a tapestry of life. */}
      {/*     An island, */}
      {/*   </span> */}
      {/*   <span className="topt top-[168px] left-[49px] tracking-[0.53px]"> */}
      {/*     too, directs our gaze below the waves, to the interconnected and */}
      {/*     intricately */}
      {/*   </span> */}
      {/*   <span className="topt top-[168px] left-[49px] tracking-[0.53px]"> */}
      {/*     too, directs our gaze below the waves, to the interconnected and */}
      {/*     intricately */}
      {/*   </span> */}
      {/*   <span */}
      {/*     id="text4" */}
      {/*     className="topt top-[198px] left-[49px] text-nowrap tracking-[0.03px] w-[579.29px] overflow-hidden" */}
      {/*   > */}
      {/*     woven continents. As poet John Donne once said */}
      {/*   </span> */}
      {/**/}
      {/*   <span */}
      {/*     id="text1" */}
      {/*     className="topt top-[198px] left-[729px] tracking-[0.03px] text-nowrap w-[244.15px] overflow-hidden" */}
      {/*   > */}
      {/*     "No man is an island" */}
      {/*   </span> */}
      {/*   <span className="topt top-[230px] left-[49px] tracking-[0.2px]"> */}
      {/*     reminding us that every individual's actions and fate are intimately */}
      {/*     linked with */}
      {/*   </span> */}
      {/*   <span */}
      {/*     id="text5" */}
      {/*     className="topt top-[262px] left-[49px] tracking-[0.2px]" */}
      {/*   > */}
      {/*     others */}
      {/*   </span> */}
      {/*   <span className="topt top-[262px] left-[295px] tracking-[0.2px]"> */}
      {/*     their */}
      {/*   </span> */}
      {/*   <span className="topt top-[262px] left-[390px] tracking-[0.2px]"> */}
      {/*     joys */}
      {/*   </span> */}
      {/*   <span className="topt top-[262px] left-[480px] tracking-[0.2px]"> */}
      {/*     and */}
      {/*   </span> */}
      {/*   <span className="topt top-[262px] left-[568px] tracking-[0.2px]"> */}
      {/*     sorrows */}
      {/*   </span> */}
      {/*   <span className="topt top-[262px] left-[700px] tracking-[0.2px]"> */}
      {/*     intricately */}
      {/*   </span> */}
      {/*   <span className="topt top-[262px] left-[860px] tracking-[0.2px]"> */}
      {/*     entwined. */}
      {/*   </span> */}
      {/* </div> */}
      {/**/}
      {/* <div className="absolute top-0 left-0 w-[1024px] h-[1280px] "> */}
      {/*   <img src="top.png" alt="" className="w-full h-full" /> */}
      {/* </div> */}
      <div id="svgContainer" className="border-black "></div>
      {/* <div className="absolute top-0 left-0 z-10 w-[1024px] h-[1280px] "> */}
      {/*   <img src="bottom.png" alt="" className="w-full h-full" /> */}
      {/* </div> */}
    </>
  );
}

export default App;
