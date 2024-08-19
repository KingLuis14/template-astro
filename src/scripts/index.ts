import { addCustomEventListener } from "@/utils/EventListener.ts";
import { toogleAcordeon } from "./Acordion";
import { SLider } from "@/scripts/Slider.ts";
import { carruselProduct } from "@/scripts/Comentarios.js";

export const main = () => {
  // const element = document.querySelector(".slider__item");
  // const getComputedStyleValue = () =>
  //   window.getComputedStyle(element).getPropertyValue("--columns").trim();

  // let prevcolumnsValue = getComputedStyleValue();
  // console.log("Valor inicial de --columns:", prevcolumnsValue);

  // const resizeGetColumns = () => {
  //   const columnsValueActual = getComputedStyleValue();

  //   if (columnsValueActual == prevcolumnsValue) return;

  //   console.log("Cambio detectado, nuevo valor:", columnsValueActual);
  //   prevcolumnsValue = columnsValueActual;
  // };

  // window.addEventListener("resize", resizeGetColumns);

  addCustomEventListener("click", ".dropdown__button", toogleAcordeon);
  // new SLider({
  //     sliderContainer: ".slider",
  //     dotSelector: ".slider__dot",
  //     navSelector: ".slider__nav",
  //     listSelector: ".slider__list",
  //     dots: 5
  //   });


  carruselProduct();

  // new SLider({
  //   sliderContainer: ".slider.slider2",
  //   dotSelector: ".slider__dot",
  //   navSelector: ".slider__nav.slider2",
  //   listSelector: ".slider__list.slider2",
  //   slidesMove: 2,
  //   breakpoint: [
  //     {
  //       media: 768,
  //       dots: 4,
  //     },
  //     {
  //       media: 1024,
  //       dots: 2,
  //     },
  //   ],
  // });
};
