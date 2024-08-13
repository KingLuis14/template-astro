import {
  addCustomEventListener,
  getSiblings,
  removeClassElements,
} from "@/utils/EventListener.ts";

interface BreakpointConfig {
  media: number;
  dots: number;
}

interface CreateButtonDinamic {
  mediaQuery : MediaQueryList;
  dots : number;
}



interface AccordionConfig {
  sliderContainer: string;
  dotSelector: string;
  navSelector: string;
  listSelector: string;
  dots?: number;
  breakpoint?: BreakpointConfig[];
}

export class SLider {
  private sliderContainerSelector: string;
  private sliderDotSelector: string;
  private sliderNavSelector: string;
  private sliderListSelector: string;
  private dots: number;
  private breakpoints?: BreakpointConfig[];

  private arrayMediaQueries?: CreateButtonDinamic[] = [];

  private sliderContainer?: HTMLElement;
  private sliderDot?: HTMLElement;
  private sliderNav?: HTMLElement;
  private sliderList?: HTMLElement;

  constructor(config: AccordionConfig) {
    this.sliderContainerSelector = config.sliderContainer;
    this.sliderDotSelector = config.dotSelector;
    this.sliderNavSelector = config.navSelector;
    this.sliderListSelector = config.listSelector;
    this.dots = config.dots;
    this.breakpoints = config.breakpoint;

    this.init();
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

    const $SliderList = this.sliderList;
    const ArraySliderList = this.getSLider($SliderList);

    $SliderList.style.setProperty("--transition", "transform .5s");
    $SliderList.style.setProperty(
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
        this.arrayMediaQueries.push(
          {
            mediaQuery : window.matchMedia(`(max-width: ${breakpoint.media - 1}px)`),
            dots : this.dots || lengthArrayList
          }
        );
      }

      if (index === this.breakpoints.length - 1) {
        this.arrayMediaQueries.push(
          {
            mediaQuery : window.matchMedia(`(min-width: ${breakpoint.media}px`),
            dots : breakpoint.dots
          }
        );
      }

      const nextBreakpoint = this.breakpoints[index + 1];

      if (nextBreakpoint) {
        this.arrayMediaQueries.push(
          {
            mediaQuery : window.matchMedia(
              `(min-width: ${breakpoint.media}px) and (max-width: ${
                nextBreakpoint.media - 1
              }px)`
            ),
            dots : breakpoint.dots
          }
        );
      }
    });

    this.arrayMediaQueries.forEach(({mediaQuery , dots}) => {
      mediaQuery.addEventListener("change", ()=> this.mediaDotFunction(mediaQuery, dots));
      this.mediaDotFunction(mediaQuery, dots);
    });
  };

  private mediaDotFunction = (e: MediaQueryList, dots : number) => {
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
}
