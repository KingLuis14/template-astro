export const carruselProduct = () => {
    if (!(navigator.maxTouchPoints > 1)) {
    
        const $BtnPrevProductSlider = document.querySelectorAll(".slider-boton-izquierda");
        const $BtnNextProductSlider = document.querySelectorAll(".slider-boton-derecha");
    
        $BtnPrevProductSlider.forEach((boton) => {
            boton.classList.add("show");
        });
        $BtnNextProductSlider.forEach((boton) => {
            boton.classList.add("show");
        });
    
        document.addEventListener("click", ({ target }) => {
            const $Element = target ;
    
            if ($Element.classList.contains("slider-boton-izquierda")) {
                const $ScrollProduct = $Element.nextElementSibling;
                const $ArticleProduct = $ScrollProduct?.firstElementChild ;
                $ScrollProduct && $ArticleProduct && ($ScrollProduct.scrollLeft -= $ArticleProduct.offsetWidth);
            }
            if ($Element.classList.contains("slider-boton-derecha")) {
                const $ScrollProduct = $Element.previousElementSibling;
                const $ArticleProduct = $ScrollProduct?.firstElementChild;
                $ScrollProduct && $ArticleProduct && ($ScrollProduct.scrollLeft += $ArticleProduct.offsetWidth);
            }
        });
    }
}