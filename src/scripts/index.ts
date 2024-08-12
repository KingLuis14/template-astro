import {addCustomEventListener} from "@/utils/EventListener.ts";
import { toogleAcordeon } from "./Acordion";
import { SLider } from "@/scripts/Slider.ts";

  


export const main = ()=> {
    addCustomEventListener('click', ".dropdown__button",  toogleAcordeon);
    new SLider({
        sliderContainer: ".slider",
        dotSelector: ".slider__dot",
        navSelector: ".slider__nav",
        listSelector: ".slider__list",
        dots: 5
      });
      new SLider({
        sliderContainer: ".slider.slider2",
        dotSelector: ".slider__dot",
        navSelector: ".slider__nav.slider2",
        listSelector: ".slider__list.slider2",
        dots: 8
      });
    
    
}