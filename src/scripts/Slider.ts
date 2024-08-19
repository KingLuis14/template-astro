import {
  addCustomEventListener,
  getSiblings,
  removeClassElements,
} from "@/utils/EventListener.ts";

type SliderPosition = "start" | "end";
type Direction = "rigth" | "left";

interface BreakpointConfig {
  media: number;
  dots: number;
}

interface CreateButtonDinamic {
  mediaQuery: MediaQueryList;
  dots: number;
}

interface AccordionConfig {
  sliderContainer: string;
  dotSelector: string;
  navSelector: string;
  listSelector: string;
  dots?: number;
  slidesMove?: number;
  breakpoint?: BreakpointConfig[];
}

export class SLider {
  private sliderContainerSelector: string;
  private sliderDotSelector: string;
  private sliderNavSelector: string;
  private sliderListSelector: string;
  private dots: number;
  private breakpoints?: BreakpointConfig[];
  private slideMove: number;
  private slideMovePorcentaje: string;

  private arrayMediaQueries?: CreateButtonDinamic[] = [];

  private sliderContainer?: HTMLElement;
  private sliderDot?: HTMLElement;
  private sliderNav?: HTMLElement;
  private sliderList?: HTMLElement;
  private elementsCloneEnds: HTMLElement[];
  private contSlider: number = 0;

  private prevcolumnsValue: string = "";
  private actualcolumnsValue: string = "";

  constructor(config: AccordionConfig) {
    this.sliderContainerSelector = config.sliderContainer;
    this.sliderDotSelector = config.dotSelector;
    this.sliderNavSelector = config.navSelector;
    this.sliderListSelector = config.listSelector;
    this.dots = config.dots;
    this.breakpoints = config.breakpoint;
    this.slideMove = config.slidesMove;

    this.init();
  }

  private init() {
    this.initializeElements();
    this.prevcolumnsValue = this.getItemsShowSlider();
    this.createButtons(8 / parseInt(this.prevcolumnsValue));
    addCustomEventListener(
      "click",
      this.sliderDotSelector,
      this.selectDot.bind(this),
      this.sliderContainer
    );

    this.insertItemsSlider("start", parseInt(this.prevcolumnsValue));
    
    console.log(this.contSlider);
    
    console.log("Slider actual: " ,this.getSliderActual());
    

    window.addEventListener("resize", () => {
      
      this.setValueTransformCss();
      this.resizeGetColumns();
      this.createButtons(8 / parseInt(this.actualcolumnsValue));
      // console.log(this.getSlideMove());
    });
  }

  private initializeElements() {
    this.sliderContainer = document.querySelector(
      this.sliderContainerSelector
    ) as HTMLElement;
    this.sliderDot = this.sliderContainer?.querySelector(
      this.sliderDotSelector
    ) as HTMLElement;
    this.sliderNav = this.sliderContainer?.querySelector(
      this.sliderNavSelector
    ) as HTMLElement;
    this.sliderList = this.sliderContainer?.querySelector(
      this.sliderListSelector
    ) as HTMLElement;
  }

  private selectDot = (e: Event) => {
    const $Element = e.target as HTMLElement;
    $Element.classList.add("active"); // activar dot
    removeClassElements(getSiblings($Element), "active");
    const indexDot = this.getIndexDot($Element);

    const ArraySliderList = this.getSLider(this.sliderList);

    this.sliderList.style.setProperty("--transition", "transform .5s");
    // console.log(this.setSliderMove("rigth", ));
  };

  private getSLider = (element: HTMLElement) => {
    return Array.from(element.children) as HTMLElement[];
  };

  private getIndexDot(element: HTMLElement): number {
    return parseInt(element.getAttribute("data-value"), 10);
  }

  private createButtons(dots: number) {
    const lengthArrayList = this.getSLider(this.sliderList).length;
    const navs = this.sliderNav;

    while (navs.firstChild) {
      navs.removeChild(navs.firstChild);
    }

    const fragment = new DocumentFragment();

    Array.from({ length: dots || lengthArrayList }, (_, index) => {
      const className = index === 0 ? "slider__dot active" : "slider__dot";

      const button = document.createElement("button");
      button.className = className;
      button.setAttribute("data-value", `${index + 1}`);

      fragment.appendChild(button);
    });

    navs.append(fragment);
  }

  private getElementsSlider = (
    sliderPosition: SliderPosition,
    numElements: number
  ): HTMLElement[] => {
    const children = Array.from(this.sliderList.children) as HTMLElement[];

    if (sliderPosition === "start") {
      return children.slice(0, numElements);
    } else {
      return children.slice(-numElements);
    }
  };

  private insertItemsSlider = (
    insert: SliderPosition,
    elements: number = 1
  ) => {
    if (insert === "start") {
      this.elementsCloneEnds = this.getElementsSlider("end", elements);

      const elementsToDuplicate = this.elementsCloneEnds.map((element) => {
        this.incrementContSlider(1);
        
        return element.cloneNode(true) as HTMLElement;
      });

      this.sliderList.prepend(...elementsToDuplicate);

      this.setValueTransformCss();
      return;
    }
  };

  private setValueTransformCss = () => {
    const elementWidths = this.elementsCloneEnds.map((element) => {
      const widthSlider = element.getBoundingClientRect().width + 15;
      return this.convertNumberfromPercentaje(widthSlider, this.sliderList);
    });

    const totalWidth = elementWidths.reduce((sum, width) => sum + width, 0);
    this.sliderList?.style.setProperty("--Move", `-${totalWidth}%`);
  };

  private getWitdhSlider = () => this.sliderList.getBoundingClientRect().width;

  private getGapSlider = () => {
    const gap = 15;
    const widthSlider = this.getWitdhSlider();
    const percentage = (gap / widthSlider) * 100;
    return percentage;
  };

  private getPercentajeElementSlider = (element: HTMLElement) => {
    const widthSlider = this.getWitdhSlider();
    const widthElementSlider = element.getBoundingClientRect().width;
    const percentaje = (widthElementSlider / widthSlider) * 100;
    return percentaje;
  };

  private incrementContSlider = (num: number) => {
    return this.contSlider += 1;
  };

  private getItemsShowSlider = () => {
    const element = this.sliderList.querySelector(".slider__item");

    return window
      .getComputedStyle(element)
      .getPropertyValue("--columns")
      .trim();
  };

  private resizeGetColumns = () => {
    this.actualcolumnsValue = this.getItemsShowSlider();

    if (this.actualcolumnsValue == this.prevcolumnsValue) return;

    console.log(
      "Cambio detectado, nuevo valor:",
      parseInt(this.actualcolumnsValue, 10)
    );
    this.prevcolumnsValue = this.actualcolumnsValue;
  };

  private convertNumberfromPercentaje = (num : number , elemt : HTMLElement) => {
    const widthElement = elemt.getBoundingClientRect().width;
    return ( num / widthElement ) * 100;
  }

  private getSliderActual = ()=> {
    const arraySliderList = this.getSLider(this.sliderList);
    return arraySliderList[this.contSlider];
  }

  private setSliderMove = (direction: Direction, value: string) => {
    if (direction == "rigth") {
      this.sliderList.style.setProperty("--Move", `-${value}%`);
      this.incrementContSlider(1);
      return;
    }

    this.sliderList.style.setProperty("--Move", `${value}%`);
    this.incrementContSlider(-1);
  };

  private getSlideMove = () => {
    return this.sliderList.style.getPropertyValue("--Move").trim();
  };
}
