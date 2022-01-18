// - THIS za pomoca this odwołujemy sie do obiektu na ktorym wywoływana jest funkcja - uproszczenie - kontekstem wywołania mozna sterować i mozemy f-kcjom narzucać kontekst wywolania

export default class JSSlider{
    run() {
        const imagesSelector = '.gallery__item';
        const sliderRootSelector = '.js-slider';

        const imagesList = document.querySelectorAll(imagesSelector);
        const sliderRootElement = document.querySelector(sliderRootSelector);

        this.initEvents(imagesList, sliderRootElement); //  odwołanie do metody 'initEvents', potrzebne slowo kluczowe, this - poniewaz w tym konkretnym obiekcie, znajduje sie ta metoda. 
        this.initCustomEvents(imagesList, sliderRootElement, imagesSelector);
    }

    initEvents(imagesList, sliderRootElement) {
        imagesList.forEach( function(item)  {
            item.addEventListener('click', function(e) {
                this.fireCustomEvent(e.currentTarget, 'js-slider-img-click');
            });
        });

        const navNext = sliderRootElement.querySelector('.js-slider__nav--next');
        if(navNext) {
            navNext.addEventListener('click', function(e) {
                this.fireCustomEvent(sliderRootElement, 'js-slider-img-next')
            });
        }
        const navPrev = sliderRootElement.querySelector('.js-slider__nav--prev');
        if(navPrev) {
            navPrev.addEventListener('click', function(e) {
                this.fireCustomEvent(sliderRootElement, 'js-slider-img-prev')
            });
        }
        const zoom = sliderRootElement.querySelector('.js-slider__zoom');
        if(zoom) {
            zoom.addEventListener('click', function(e) {
                if(e.target === e.currentTarget) {
                    this.fireCustomEvent(sliderRootElement, 'js-slider-close');
                }
            });
        }
    }

    fireCustomEvent(element, name) {
        console.log(element.className, '=>', name);
        const event = new CustomEvent(name, {
            bubbles: true,
        });
        element.dispatchEvent( event );
    }

    initCustomEvents(imagesList, sliderRootElement, imagesSelector) {
        imagesList.forEach(function(img) {
            img.addEventListener('js-slider-img-click', function(event) {
                return this.onImageClick(event, sliderRootElement, imagesSelector);
            });
        });
        sliderRootElement.addEventListener('js-slider-img-next', this.onImageNext);
        sliderRootElement.addEventListener('js-slider-img-prev', this.onImagePrev);
        sliderRootElement.addEventListener('js-slider-close', this.onClose);
    }

    onImageClick(event, sliderRootElement, imagesSelector) {
        sliderRootElement.classList.add('js-slider--active');

        const src = event.currentTarget.querySelector('img').src;
        sliderRootElement.querySelector('.js-slider__image').src = src;

        const groupName = event.currentTarget.dataset.sliderGroupName;
        const thumbsList = document.querySelectorAll(imagesSelector+'[data-slider-group-name='+ groupName +']');
        const prototype = document.querySelector('.js-slider__thumbs-item--prototype');
        thumbsList.forEach( (item) => {
            const thumbElement = prototype.cloneNode(true);
            thumbElement.classList.remove('js-slider__thumbs-item--prototype');
            const thumbImg = thumbElement.querySelector('img');
            thumbImg.src = item.querySelector('img').src;
            if(thumbImg.src === src) {
                thumbImg.classList.add('js-slider__thumbs-image--current');
            }
            document.querySelector('.js-slider__thumbs').appendChild(thumbElement);
        })
    }

    onImageNext(event) {
        const currentClassName = 'js-slider__thumbs-image--current';
        const current = this.querySelector('.'+currentClassName);

        const parentCurrent = current.parentElement;
        const nextElement = parentCurrent.nextElementSibling;
        if(nextElement && !nextElement.className.includes('js-slider__thumbs-item--prototype')) {
            const img = nextElement.querySelector('img')
            img.classList.add(currentClassName);

            this.querySelector('.js-slider__image').src = img.src;
            current.classList.remove(currentClassName);
        }
    }
    onImagePrev(event) {
        const currentClassName = 'js-slider__thumbs-image--current';
        const current = this.querySelector('.'+currentClassName);

        const parentCurrent = current.parentElement;
        const prevElement = parentCurrent.previousElementSibling;
        if(prevElement && !prevElement.className.includes('js-slider__thumbs-item--prototype')) {
            const img = prevElement.querySelector('img')
            img.classList.add(currentClassName);
            this.querySelector('.js-slider__image').src = img.src;
            current.classList.remove(currentClassName);
        }
    }

    onClose(event) {
        event.currentTarget.classList.remove('js-slider--active');
        const thumbsList = this.querySelectorAll('.js-slider__thumbs-item:not(.js-slider__thumbs-item--prototype)');
        thumbsList.forEach( item => item.parentElement.removeChild(item));
    }
}

// export default JSSlider;
