# APEX CARE — Fashion Store

A responsive, multi-page fashion storefront built with plain HTML, CSS and vanilla JavaScript. It is designed for static hosting on GitHub Pages and does not require Node.js, a database, a build step or a backend.

## Pages and features

- `index.html` — home page, collection highlights, new arrivals, bestsellers, testimonials and newsletter demo.
- `shop.html` — product search, audience/category filters, size filter, price filter and sorting.
- `product.html` — product details, colour and size selection, add to bag and related items. Product is selected with a URL such as `product.html?id=tf001`.
- `cart.html` — persistent cart, quantity changes, remove item, totals and a clearly labelled demo checkout.
- `about.html` — brand story and values.
- `contact.html` — contact form demo.
- Men, Women, Kids and New Arrivals are shop filters, for example `shop.html?category=Women` and `shop.html?new=true`.

The cart, wishlist, demo contact messages, newsletter signups and demo orders use browser `localStorage`. Data remains in that browser and is not shared with a store owner.

## Run locally

You can open `index.html` directly in a modern browser. For a more realistic local preview, use VS Code's Live Server extension. No package installation is needed.

## Publish with GitHub Pages

1. Create a new GitHub repository, for example `apex-care`.
2. Upload the **contents** of this folder (not an extra nested `apex-care/apex-care` folder) to the repository's root. Make sure `index.html` is at the root.
3. Open the repository's **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Choose branch **main** and folder **/(root)**, then select **Save**.
6. Wait for GitHub Pages to publish the repository. The published URL will be shown in the Pages settings.

All local assets and page links use relative paths, so the site works at a GitHub Pages project URL such as `https://USERNAME.github.io/REPOSITORY/` as well as a custom domain.

## Customising the store

- Update products, prices, sizes, colours and image URLs in `js/products.js`.
- Update the store name and page copy in the HTML files.
- Update colours and layout tokens at the top of `css/style.css` inside `:root`.
- Product and editorial photos currently load from Unsplash image URLs, so an internet connection is needed to display them. Replace those URLs with your own licensed product photos before launching the real store. The `images/` folder includes a note for adding local image assets.

## Important limitations of static hosting

This is a front-end storefront prototype. GitHub Pages only hosts static files, so this project does **not** provide secure customer accounts, real payment processing, inventory synchronisation, order fulfilment, email delivery or a private admin dashboard. The checkout, newsletter and contact forms are demos that save sample data in the visitor's browser only. Replace the sample `hello@apexcare.example` address with a real contact address. Connect a secure commerce provider/backend before accepting real orders or payments.

## Browser support

Made for current desktop and mobile versions of Chrome, Edge, Firefox and Safari. JavaScript and localStorage must be enabled for cart and filter interactions.
