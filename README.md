# img-zoom-js

## Overview

A completely responsive image zoom library based on js. No external dependencies required.

## Demo

[Demo](https://khancirhan.github.io/img-zoom/demo.html)

## Usage

Basic usage example

```javascript
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body>
        <div class="demo-container">
            <img id="zoomImg" class="zoom-img" src="demo.jpg" alt="" />
        </div>
    </body>
    <script src="img-zoom.js"></script>
    <script>
        var options = {
            maxZoomLevel: 14,
            zoomStep: 0.1,
        };
        ImgZoom(document.getElementById('zoomImg'), options);
    </script>
</html>
```

## Arguments

-   **targetEl** (Object) - DOM element
-   **options** (Object) - img-zoom-js options
    -   **maxZoomLevel** (number) - Maximum zoom level of the image (optional)
    -   **zoomStep** (number) - Controls zoom speed (optional)
