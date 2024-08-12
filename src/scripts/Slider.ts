import {
  addCustomEventListener,
  getSiblings,
  removeClassElements,
} from "@/utils/EventListener.ts";

interface AccordionConfig {
  sliderContainer: string;
  dotSelector: string;
  navSelector: string;
  listSelector: string;
  dots: number;
}

export class SLider {
  private sliderContainerSelector: string;
  private sliderDotSelector: string;
  private sliderNavSelector: string;
  private sliderListSelector: string;
  private dots: number;

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

    this.init();
  }

  private init() {
    this.initializeElements();
    this.createButtons();

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

  private createButtons() {
    const startTime = performance.now();
    const navs = this.sliderNav;

    const fragment = new DocumentFragment();

    Array.from({ length: this.dots }, (_, index) => {
      const className = index === 0 ? "slider__dot active" : "slider__dot";

      const button = document.createElement("button");
      button.className = className;
      button.setAttribute("data-value", `${index}`);

      fragment.appendChild(button);
    });

    navs.append(fragment); 

    const endTime = performance.now();
    const timeTaken = endTime - startTime;
    console.log(`Event load slider: ${timeTaken}ms`);
  }
}
