/**
 * HON Athletic Apparel - Shopify Buy Button SDK Integration
 * =========================================================
 *
 * PLACEHOLDER FILE
 * Arthur: Replace the credentials below and uncomment the initialization
 * code once the Shopify storefront is ready.
 *
 * This file handles:
 *  - Loading the Shopify Buy Button SDK
 *  - Initializing the ShopifyBuy client
 *  - Creating embedded Buy Buttons / product components
 *  - GA4 event tracking for add-to-cart actions
 */


// ──────────────────────────────────────────────
// Shopify Credentials
// ──────────────────────────────────────────────
// Arthur: Paste your Shopify domain and Storefront Access Token below.

const SHOPIFY_DOMAIN   = 'your-store-name.myshopify.com';  // <-- Replace with actual Shopify domain
const STOREFRONT_TOKEN = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; // <-- Replace with Storefront Access Token


// ──────────────────────────────────────────────
// GA4 Configuration
// ──────────────────────────────────────────────
// Arthur: Replace with the real GA4 Measurement ID once available.

const GA4_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // <-- Replace with actual GA4 ID


// ──────────────────────────────────────────────
// Load the Shopify Buy Button SDK script
// ──────────────────────────────────────────────

/*
function loadShopifyBuySDK() {
  return new Promise((resolve, reject) => {
    if (window.ShopifyBuy) {
      resolve(window.ShopifyBuy);
      return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';

    script.onload = () => {
      if (window.ShopifyBuy) {
        resolve(window.ShopifyBuy);
      } else {
        reject(new Error('Shopify Buy SDK failed to initialize.'));
      }
    };

    script.onerror = () => reject(new Error('Failed to load Shopify Buy SDK script.'));
    document.head.appendChild(script);
  });
}
*/


// ──────────────────────────────────────────────
// Initialize the Shopify Buy Client
// ──────────────────────────────────────────────

/*
async function initShopifyClient() {
  const ShopifyBuy = await loadShopifyBuySDK();

  const client = ShopifyBuy.buildClient({
    domain:          SHOPIFY_DOMAIN,
    storefrontAccessToken: STOREFRONT_TOKEN,
  });

  return client;
}
*/


// ──────────────────────────────────────────────
// Create Buy Button Components
// ──────────────────────────────────────────────
// Arthur: Call this function for each product embed on the page.
// Pass in the product's Shopify GID and the DOM node to mount into.

/*
async function createBuyButton(productId, containerSelector) {
  const ShopifyBuy = await loadShopifyBuySDK();

  const client = ShopifyBuy.buildClient({
    domain:          SHOPIFY_DOMAIN,
    storefrontAccessToken: STOREFRONT_TOKEN,
  });

  const ui = ShopifyBuy.UI.init(client);

  ui.createComponent('product', {
    id: productId,
    node: document.querySelector(containerSelector),
    moneyFormat: '%24%7B%7Bamount%7D%7D',
    options: {
      product: {
        styles: {
          // Arthur: Customize button styling to match HON brand here
        },
        buttonDestination: 'cart',
        text: {
          button: 'Add to Cart',
        },
        events: {
          addVariantToCart: function (product) {
            // Fire GA4 add_to_cart event
            trackAddToCart(product);
          },
        },
      },
      cart: {
        styles: {
          // Arthur: Customize cart styling here
        },
        text: {
          total: 'Subtotal',
          button: 'Checkout',
        },
        popup: false, // set to true to use popup cart
      },
    },
  });
}
*/


// ──────────────────────────────────────────────
// GA4 Event Tracking — Add to Cart
// ──────────────────────────────────────────────
// Fires an "add_to_cart" event to Google Analytics 4.
// Requires the GA4 tag (gtag.js) to be loaded on the page.

/*
function trackAddToCart(product) {
  if (typeof gtag !== 'function') {
    console.warn('[HON] gtag not found. GA4 add_to_cart event was not sent.');
    return;
  }

  gtag('event', 'add_to_cart', {
    currency: 'USD',
    value: parseFloat(product.selectedVariant.price.amount) || 0,
    items: [
      {
        item_id:    product.selectedVariant.id   || '',
        item_name:  product.title                || '',
        price:      parseFloat(product.selectedVariant.price.amount) || 0,
        quantity:   1,
      },
    ],
  });
}
*/


// ──────────────────────────────────────────────
// Bootstrap
// ──────────────────────────────────────────────
// Arthur: Uncomment the block below and add product IDs / container
// selectors for every Buy Button on the site.

/*
document.addEventListener('DOMContentLoaded', () => {
  // Example — replace with real product GIDs and selectors:
  // createBuyButton('gid://shopify/Product/1234567890', '#buy-button-1');
  // createBuyButton('gid://shopify/Product/0987654321', '#buy-button-2');
});
*/
