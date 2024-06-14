const $Slider = document.getElementById("Slider");
// const $SliderLista = document.querySelector(".slider__list") as HTMLElement;
const $Sliders = document.querySelectorAll<HTMLElement>(".slider__list");
let ArrayItemLista = [];
$Sliders.forEach(($SliderLista) => {
    ArrayItemLista = Array.from($SliderLista.children);
});

const $SliderDots = document.querySelector(".slider__dot") as HTMLElement;
const ArrayDots = Array.from($SliderDots.children);
type DIRECTION = "LEFT" | "RIGHT";
let inInTransition = false;
let autoPlaySlider;
const $ClonePositionInitial = ArrayItemLista[ArrayItemLista.length - 1].cloneNode(true) as HTMLElement;
const $ClonePositionLast = ArrayItemLista[0].cloneNode(true) as HTMLElement;

// $Sliders.forEach(($SliderLista: HTMLElement) => {
//     const ArrayItemLista = Array.from($SliderLista.children);
//     if (ArrayItemLista.length === 0) return; // Saltar si no hay elementos en la lista

//     const $ClonePositionInitial = ArrayItemLista[ArrayItemLista.length - 1].cloneNode(true) as HTMLElement;
//     const $ClonePositionLast = ArrayItemLista[0].cloneNode(true) as HTMLElement;

//     const loadSliderInitial = () => {
//         $SliderLista.style.setProperty("--transition", "none");
//         $SliderLista.style.setProperty("--Move", "-100%");
//         console.log($SliderLista);

//         $ClonePositionInitial.setAttribute("data-moveTransition", `0`);
//         $ClonePositionInitial.setAttribute("data-itemInicio", "");

//         $ClonePositionLast.classList.remove("active");
//         $ClonePositionLast.setAttribute("data-moveTransition", `-${(ArrayItemLista.length + 1) * 100}%`);
//         $ClonePositionLast.setAttribute("data-itemFinal", "");

//         $SliderLista.prepend($ClonePositionInitial);
//         $SliderLista.append($ClonePositionLast);
//     }
//     });



export const getItemofArray = (index: number | 'initial' | 'last', array: any[]): Element => {
    if (index === 'initial') {
        return array[0];
    } else if (index === 'last') {
        return array[array.length - 1];
    } else if (typeof index === 'number') {
        return array[index];
    } else {
        throw new Error('Invalid index');
    }
};

export const setDotSlider = (itemSliderToFocus: Element, direction: DIRECTION) => {
    const DotActive = $SliderDots.querySelector(".Slider__dot.active");
    const firstDot = getItemofArray('initial', ArrayDots);
    const lastDot = getItemofArray('last', ArrayDots);

    if (DotActive) {
        DotActive.classList.remove("active");
    }

    if (direction === "LEFT") {
        if (itemSliderToFocus.hasAttribute("data-itemInicio")) {
            lastDot.classList.add("active");
        } else {
            DotActive.previousElementSibling.classList.add("active");
        }
    } else {
        if (itemSliderToFocus.hasAttribute("data-itemFinal")) {
            firstDot.classList.add("active");
        } else {
            DotActive.nextElementSibling.classList.add("active");
        }
    }
};

export const loadSliderInitial = () => {

    $Sliders.forEach(($SliderLista: HTMLElement) => {
        $SliderLista.style.setProperty("--transition", "none");
        $SliderLista.style.setProperty("--Move", "-100%");
        
        $ClonePositionInitial.setAttribute("data-moveTransition", `0`);
        $ClonePositionInitial.setAttribute("data-itemInicio", "");
    
        $ClonePositionLast.classList.remove("active");
        $ClonePositionLast.setAttribute("data-moveTransition",`-${(ArrayItemLista.length + 1) * 100}%`);
        $ClonePositionLast.setAttribute("data-itemFinal", "");
    
        $SliderLista.prepend($ClonePositionInitial);
        $SliderLista.append($ClonePositionLast);
    })

   
};