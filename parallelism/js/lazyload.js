/**
 * Simple Lazy Loading for Parallelism Gallery
 * Only loads images when they're about to become visible
 */

(function() {
    var lazyImages = [];
    var active = false;

    // Throttle function to limit how often we check
    function throttle(func, wait) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            if (!timeout) {
                timeout = setTimeout(function() {
                    timeout = null;
                    func.apply(context, args);
                }, wait);
            }
        };
    }

    function lazyLoad() {
        if (active === false) {
            active = true;

            setTimeout(function() {
                lazyImages.forEach(function(lazyImage) {
                    if ((lazyImage.getBoundingClientRect().left < window.innerWidth + 500 && 
                         lazyImage.getBoundingClientRect().right > -500) && 
                        getComputedStyle(lazyImage).display !== "none") {
                        
                        // Load the image
                        lazyImage.src = lazyImage.dataset.src;
                        lazyImage.removeAttribute('data-src');
                        
                        // Remove from array
                        lazyImages = lazyImages.filter(function(image) {
                            return image !== lazyImage;
                        });

                        if (lazyImages.length === 0) {
                            document.removeEventListener("scroll", lazyLoad);
                            window.removeEventListener("resize", lazyLoad);
                        }
                    }
                });

                active = false;
            }, 200);
        }
    }

    // Initialize on DOM ready
    document.addEventListener("DOMContentLoaded", function() {
        lazyImages = [].slice.call(document.querySelectorAll("img[data-src]"));
        
        if (lazyImages.length > 0) {
            // Load images in viewport immediately
            lazyLoad();
            
            // Set up scroll listener with throttling
            var scrollHandler = throttle(lazyLoad, 100);
            
            // Listen to main scroller
            var mainElement = document.getElementById('main');
            if (mainElement) {
                mainElement.addEventListener("scroll", scrollHandler);
            }
            
            document.addEventListener("scroll", scrollHandler);
            window.addEventListener("resize", scrollHandler);
        }
    });
})();
