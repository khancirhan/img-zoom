function ImgZoom(targetEl, { maxZoomLevel = 14, zoomStep = 0.1 } = {}) {
    // zoomContainerOuter - Only used for resize observer
    let zoomContainerOuter;
    let zoomContainerInner;

    const minZoomLevel = 1;
    let currentZoomLevel = 1;

    let zoomContainerWidth;
    let zoomContainerHeight;

    let currentTop = 0;
    let currentLeft = 0;
    let currentWidth;
    let currentHeight;

    let isDragging = false;

    let xRatio = 0.5;
    let yRatio = 0.5;
    let containerXRatio = 0.5;
    let containerYRatio = 0.5;

    let previousMouseMoveEvent;

    let aspectRatio;

    // UI functions
    function _setElementOffset() {
        targetEl.style.left = currentLeft + 'px';
        targetEl.style.top = currentTop + 'px';
    }

    function _setElementDimensions() {
        targetEl.style.width = currentWidth + 'px';
        targetEl.style.height = currentHeight + 'px';
    }

    function _setZoomContainerInnerDimensions() {
        zoomContainerInner.style.width = zoomContainerWidth + 'px';
        zoomContainerInner.style.height = zoomContainerHeight + 'px';
    }

    function _setTargetElementStyles() {
        targetEl.setAttribute('style', 'position: relative !important; cursor: grab;');
    }

    // Helper Functions
    function _createZoomContainerInner() {
        const parent = targetEl.parentNode;

        // Create Element
        zoomContainerInner = document.createElement('div');

        // Add Id
        zoomContainerInner.id = 'zoomContainerInner';

        // Add Required Styles
        zoomContainerInner.setAttribute('style', 'position: relative; overflow: hidden;');

        // set the wrapper as child (instead of the element)
        parent.replaceChild(zoomContainerInner, targetEl);
        // set element as child of wrapper
        zoomContainerInner.appendChild(targetEl);
    }

    function _createZoomContainerOuter() {
        const parent = zoomContainerInner.parentNode;

        // Create Element
        zoomContainerOuter = document.createElement('div');

        // Add Id
        zoomContainerOuter.id = 'zoomContainerOuter';

        // Add Required Styles
        zoomContainerOuter.setAttribute('style', 'overflow: hidden;');

        // set the wrapper as child (instead of the element)
        parent.replaceChild(zoomContainerOuter, zoomContainerInner);
        // set element as child of wrapper
        zoomContainerOuter.appendChild(zoomContainerInner);
    }

    function _getEventAxisPositionOnDiv(element, e) {
        const elementWidth = element.clientWidth;
        const elementHeight = element.clientHeight;

        var elementRect = element.getBoundingClientRect();
        var elementX = e.clientX - elementRect.left;
        var elementY = e.clientY - elementRect.top;

        const x = elementX / elementWidth;
        const y = elementY / elementHeight;

        return { x, y };
    }

    function _setPositionInsideContainer() {
        currentTop = Math.min(Math.max(currentTop, zoomContainerHeight - currentHeight), 0);

        currentLeft = Math.min(Math.max(currentLeft, zoomContainerWidth - currentWidth), 0);

        _setElementOffset();
    }

    // Core functions
    function zoom() {
        currentWidth = zoomContainerWidth * currentZoomLevel;
        currentHeight = zoomContainerHeight * currentZoomLevel;

        currentTop = -(currentHeight * yRatio - zoomContainerHeight * containerYRatio);
        currentLeft = -(currentWidth * xRatio - zoomContainerWidth * containerXRatio);

        _setElementDimensions();

        _setPositionInsideContainer();
    }

    function zoomIn() {
        currentZoomLevel = Math.min(currentZoomLevel + zoomStep, maxZoomLevel);

        zoom();
    }

    function zoomOut() {
        currentZoomLevel = Math.max(currentZoomLevel - zoomStep, minZoomLevel);

        zoom();
    }

    // Event Listener functions
    function _onMouseWheel(e) {
        e.preventDefault();

        // Get axis for image
        const { x: xPart, y: yPart } = _getEventAxisPositionOnDiv(targetEl, e);

        // Get axis for zoom container
        const { x: containerXPart, y: containerYPart } = _getEventAxisPositionOnDiv(zoomContainerInner, e);

        xRatio = xPart;
        yRatio = yPart;

        containerXRatio = containerXPart;
        containerYRatio = containerYPart;

        if (e.wheelDelta <= 0) {
            zoomOut();
        } else {
            zoomIn();
        }
    }

    function _onMouseDown(e) {
        e.preventDefault();

        previousMouseMoveEvent = e;

        isDragging = true;
        targetEl.style.cursor = 'grabbing';
    }

    function _onMouseUp(e) {
        e.preventDefault();

        isDragging = false;
        targetEl.style.cursor = 'grab';
    }

    function _onMouseMove(e) {
        e.preventDefault();

        if (isDragging) {
            currentTop += e.pageY - previousMouseMoveEvent.pageY;
            currentLeft += e.pageX - previousMouseMoveEvent.pageX;

            previousMouseMoveEvent = e;

            _setPositionInsideContainer();
        }
    }

    // Start up functions
    function reset() {
        currentWidth = zoomContainerWidth;
        currentHeight = zoomContainerHeight;

        currentZoomLevel = 1;
        currentTop = 0;
        currentLeft = 0;

        _setZoomContainerInnerDimensions();
        _setElementDimensions();
        _setElementOffset();
    }

    function setupResizeObserver() {
        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width } = entry.contentRect;

                zoomContainerWidth = width;
                zoomContainerHeight = width / aspectRatio;

                reset();
            }
        });

        resizeObserver.observe(zoomContainerOuter);
    }

    function init() {
        _setTargetElementStyles();
        _createZoomContainerInner();
        _createZoomContainerOuter();

        // Calculate Aspect Ratio of the image
        aspectRatio = targetEl.offsetWidth / targetEl.offsetHeight;

        // Set Container width and height
        zoomContainerWidth = targetEl.offsetWidth;
        zoomContainerHeight = zoomContainerWidth / aspectRatio;

        _setZoomContainerInnerDimensions();

        // Add Event Listeners
        zoomContainerInner.addEventListener('mousewheel', function (e) {
            _onMouseWheel(e);
        });

        zoomContainerInner.addEventListener('mouseout', function (e) {
            _onMouseUp(e);
        });

        targetEl.addEventListener('mousedown', function (e) {
            _onMouseDown(e);
        });

        targetEl.addEventListener('mouseup', function (e) {
            _onMouseUp(e);
        });

        targetEl.addEventListener('mousemove', function (e) {
            _onMouseMove(e);
        });
    }

    // Call the init function
    init();

    // Setup Resize Observer
    setupResizeObserver();

    return {
        zoomIn,
        zoomOut,
    };
}
