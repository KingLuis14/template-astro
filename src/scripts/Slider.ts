import {
  addCustomEventListener,
  getSiblings,
  removeClassElements,
} from "@/utils/EventListener.ts";

type SliderPosition = "start" | "end";

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
  private slideMovePorcentaje : number;

  private arrayMediaQueries?: CreateButtonDinamic[] = [];

  private sliderContainer?: HTMLElement;
  private sliderDot?: HTMLElement;
  private sliderNav?: HTMLElement;
  private sliderList?: HTMLElement;
  private elementsCloneEnds: HTMLElement[];

  private turns : number = 0;
  private contSlider : number = 0;
  // private turns : number = 0;

  constructor(config: AccordionConfig) {
    this.sliderContainerSelector = config.sliderContainer;
    this.sliderDotSelector = config.dotSelector;
    this.sliderNavSelector = config.navSelector;
    this.sliderListSelector = config.listSelector;
    this.dots = config.dots;
    this.breakpoints = config.breakpoint;
    this.slideMove = config.slidesMove;

    this.init();
    
    this.insertItemsSlider("start", this.slideMove);
    window.addEventListener('resize', ()=> {
      this.setValueTransformCss();

      const computedStyle = window.getComputedStyle(this.sliderList.querySelector('.slider__item'));

    const moveValue = computedStyle.getPropertyValue('--Move').trim();
    const columnsValue = computedStyle.getPropertyValue('--columns').trim();

    console.log('Move:', moveValue);
    console.log('Columns:', columnsValue);
      
      
      // this.insertItemsSlider("start", this.slideMove);
      // this.getWitdhSlider();
      // this.getGapSlider();
    });
    
    // this.getFirstSliderShow();
  }

  private init() {
    this.initializeElements();
    this.createButtons(this.dots);
    this.updateButtonsForBreakpoint();
    addCustomEventListener(
      "click",
      this.sliderDotSelector,
      this.selectDot.bind(this),
      this.sliderContainer
    );
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
    this.sliderList.style.setProperty(
      "--Move",
      this.getPositionValueSlider(ArraySliderList[indexDot])
    );
  };

  private getSLider = (element: HTMLElement) => {
    return Array.from(element.children) as HTMLElement[];
  };

  private getIndexDot(element: HTMLElement): number {
    return parseInt(element.getAttribute("data-value"), 10);
  }

  private getPositionValueSlider(element: HTMLElement): string {
    return element.getAttribute("data-positionValue") || "";
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
      button.setAttribute("data-value", `${index}`);

      fragment.appendChild(button);
    });

    navs.append(fragment);
  }

  private dotsBreakpoints = () => {
    const lengthArrayList = this.getSLider(this.sliderList).length;

    this.breakpoints.forEach((breakpoint, index) => {
      if (index === 0) {
        this.arrayMediaQueries.push({
          mediaQuery: window.matchMedia(
            `(max-width: ${breakpoint.media - 1}px)`
          ),
          dots: this.dots || lengthArrayList,
        });
      }

      if (index === this.breakpoints.length - 1) {
        this.arrayMediaQueries.push({
          mediaQuery: window.matchMedia(`(min-width: ${breakpoint.media}px`),
          dots: breakpoint.dots,
        });
      }

      const nextBreakpoint = this.breakpoints[index + 1];

      if (nextBreakpoint) {
        this.arrayMediaQueries.push({
          mediaQuery: window.matchMedia(
            `(min-width: ${breakpoint.media}px) and (max-width: ${
              nextBreakpoint.media - 1
            }px)`
          ),
          dots: breakpoint.dots,
        });
      }
    });

    this.arrayMediaQueries.forEach(({ mediaQuery, dots }) => {
      mediaQuery.addEventListener("change", () =>
        this.mediaDotFunction(mediaQuery, dots)
      );
      this.mediaDotFunction(mediaQuery, dots);
    });
  };

  private mediaDotFunction = (e: MediaQueryList, dots: number) => {
    if (e.matches) {
      this.createButtons(dots);
    }
  };

  private updateButtonsForBreakpoint() {
    if (this.breakpoints) {
      this.dotsBreakpoints();
      return;
    }

    this.createButtons(this.dots);
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

  private insertItemsSlider = (insert: SliderPosition, elements: number = 1) => {
    if (insert === "start") {
      
      this.elementsCloneEnds = this.getElementsSlider("end", elements);

      const elementsToDuplicate = this.elementsCloneEnds.map(element => {
        this.incrementContSlider();
        return element.cloneNode(true) as HTMLElement;
      });

      this.sliderList.prepend(...elementsToDuplicate);

      this.setValueTransformCss();
      return;
    }

    // const elementStart = this.getElementsSlider("start", elements);

    // const elementsToDuplicate = elementStart.map(element => {
    //   return element.cloneNode(true) as HTMLElement;
    // });
    //   this.sliderList.append(...elementsToDuplicate);

    //   const elementWidths = elementStart.map(
    //     (element) => element.offsetWidth + 15
    //   );

    //   const totalWidth = elementWidths.reduce((sum, width) => sum + width, 0);

      // this.sliderList?.style.setProperty("--Move", `${totalWidth}px`);
  };

  private setValueTransformCss = ()=> {
    const elementWidths = this.elementsCloneEnds.map(element => {
      const percentageTotal = this.getPercentajeElementSlider(element) + this.getGapSlider();
      // console.log(percentageTotal + "%");
      return percentageTotal;
    });

    const totalWidth = elementWidths.reduce((sum, width) => sum + width, 0);
    this.sliderList?.style.setProperty("--Move", `-${totalWidth}%`);
    // console.log("mover en pixeles: " + this.getPercentajeFromPixel(totalWidth) + "px");
  }

  private getPercentajeFromPixel = (value : number)=>{
    const widthSlider = this.getWitdhSlider();
    const valuePixel = widthSlider * ( value / 100);
    return valuePixel;
  }

  private getWitdhSlider = ()=> this.sliderList.getBoundingClientRect().width;
  

  private getGapSlider = ()=> {

    const gap = 15;
    const widthSlider = this.getWitdhSlider(); // Asegúrate de que esta función devuelve el ancho en píxeles.
    const percentage = (gap / widthSlider) * 100;
    return percentage;
    
     
  }

  private getPercentajeElementSlider = (element : HTMLElement)=> {
    const widthSlider = this.getWitdhSlider();
    const widthElementSlider = element.getBoundingClientRect().width;
    const percentaje = (widthElementSlider / widthSlider) * 100;
    return percentaje;
  }

  private getMoveSliderPercentaje = ()=> {
    return 100 / this.slideMove || 1;
  }

  private incrementTurn = ()=> {
    this.turns++;
  }

  private incrementContSlider = ()=> {
    this.contSlider++;
  }

  private getFirstSliderShow = ()=> {
    const ArraySliderList = this.getSLider(this.sliderList);
    // console.table(this.contSlider);
    
    // console.log(ArraySliderList[this.contSlider]);
    
  }

  
}
