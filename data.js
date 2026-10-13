// Own-brand product catalog data.
// Trousers and shirts use real product photography extracted from the ReTrO StItChEs catalog PDF;
// other categories use placeholder art (swap images/*.png for your own product photos later).
// Each product carries `colorOptions` (selectable color swatches) and, for placeholder-image
// categories, `imagesByColor` so the gallery swaps with the chosen color. `customizable: true`
// marks products that support custom text/logo personalization on the product page.
const BRAND_NAME = "ReTrO StItChEs";

const PRODUCTS = [
  {
    "id": "P0009",
    "name": "Slim Fit Checked Shirt",
    "brand": "ReTrO StItChEs",
    "collection": "Formal Line",
    "category": "shirts",
    "categoryLabel": "Shirts",
    "price": 1050,
    "mrp": 1420,
    "discountPct": 26,
    "rating": 4.8,
    "reviews": 3123,
    "color": "Maroon",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "image": "images/products/shirt_1.jpg",
    "images": [
      "images/products/shirt_1.jpg",
      "images/products/shirt_2.jpg",
      "images/products/shirt_3.jpg"
    ],
    "isNew": false,
    "isBestseller": true,
    "description": "Slim Fit Checked Shirt from the ReTrO StItChEs Formal Line collection. Designed in-house and crafted for everyday comfort with a modern fit, breathable fabric, and durable construction. Perfect for casual outings, college, or work.",
    "colorOptions": [
      {
        "name": "Maroon",
        "hex": "#6b1e2b"
      },
      {
        "name": "Beige",
        "hex": "#d8c7a1"
      },
      {
        "name": "Blue",
        "hex": "#2f5fa8"
      }
    ],
    "customizable": true,
    "photoFixed": true
  },
  {
    "id": "P0010",
    "name": "Linen Casual Shirt",
    "brand": "ReTrO StItChEs",
    "collection": "Formal Line",
    "category": "shirts",
    "categoryLabel": "Shirts",
    "price": 540,
    "mrp": 1450,
    "discountPct": 63,
    "rating": 4.6,
    "reviews": 2608,
    "color": "Olive",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "image": "images/products/shirt_2.jpg",
    "images": [
      "images/products/shirt_2.jpg",
      "images/products/shirt_3.jpg",
      "images/products/shirt_1.jpg"
    ],
    "isNew": true,
    "isBestseller": false,
    "description": "Linen Casual Shirt from the ReTrO StItChEs Formal Line collection. Designed in-house and crafted for everyday comfort with a modern fit, breathable fabric, and durable construction. Perfect for casual outings, college, or work.",
    "colorOptions": [
      {
        "name": "Olive",
        "hex": "#5c6b30"
      },
      {
        "name": "Navy",
        "hex": "#1b2a4a"
      },
      {
        "name": "Grey",
        "hex": "#8a8a92"
      }
    ],
    "customizable": true,
    "photoFixed": true
  },
  {
    "id": "P0011",
    "name": "Oxford Formal Shirt",
    "brand": "ReTrO StItChEs",
    "collection": "Formal Line",
    "category": "shirts",
    "categoryLabel": "Shirts",
    "price": 1400,
    "mrp": 3180,
    "discountPct": 56,
    "rating": 4.3,
    "reviews": 2319,
    "color": "Beige",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "image": "images/products/shirt_3.jpg",
    "images": [
      "images/products/shirt_3.jpg",
      "images/products/shirt_1.jpg",
      "images/products/shirt_2.jpg"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Oxford Formal Shirt from the ReTrO StItChEs Formal Line collection. Designed in-house and crafted for everyday comfort with a modern fit, breathable fabric, and durable construction. Perfect for casual outings, college, or work.",
    "colorOptions": [
      {
        "name": "Beige",
        "hex": "#d8c7a1"
      },
      {
        "name": "Olive",
        "hex": "#5c6b30"
      },
      {
        "name": "White",
        "hex": "#f5f5f0"
      }
    ],
    "customizable": true,
    "photoFixed": true
  },
  {
    "id": "P0012",
    "name": "Denim Overshirt",
    "brand": "ReTrO StItChEs",
    "collection": "Formal Line",
    "category": "shirts",
    "categoryLabel": "Shirts",
    "price": 1490,
    "mrp": 2870,
    "discountPct": 48,
    "rating": 4.1,
    "reviews": 3289,
    "color": "White",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "image": "images/products/shirt_1.jpg",
    "images": [
      "images/products/shirt_1.jpg",
      "images/products/shirt_2.jpg",
      "images/products/shirt_3.jpg"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Denim Overshirt from the ReTrO StItChEs Formal Line collection. Designed in-house and crafted for everyday comfort with a modern fit, breathable fabric, and durable construction. Perfect for casual outings, college, or work.",
    "colorOptions": [
      {
        "name": "White",
        "hex": "#f5f5f0"
      },
      {
        "name": "Rust",
        "hex": "#a34a28"
      },
      {
        "name": "Blue",
        "hex": "#2f5fa8"
      }
    ],
    "customizable": true,
    "photoFixed": true
  },
  {
    "id": "P0013",
    "name": "Printed Resort Shirt",
    "brand": "ReTrO StItChEs",
    "collection": "Formal Line",
    "category": "shirts",
    "categoryLabel": "Shirts",
    "price": 1410,
    "mrp": 2510,
    "discountPct": 44,
    "rating": 4.6,
    "reviews": 760,
    "color": "Grey",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "image": "images/products/shirt_2.jpg",
    "images": [
      "images/products/shirt_2.jpg",
      "images/products/shirt_3.jpg",
      "images/products/shirt_1.jpg"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Printed Resort Shirt from the ReTrO StItChEs Formal Line collection. Designed in-house and crafted for everyday comfort with a modern fit, breathable fabric, and durable construction. Perfect for casual outings, college, or work.",
    "colorOptions": [
      {
        "name": "Grey",
        "hex": "#8a8a92"
      },
      {
        "name": "Navy",
        "hex": "#1b2a4a"
      },
      {
        "name": "Maroon",
        "hex": "#6b1e2b"
      }
    ],
    "customizable": true,
    "photoFixed": true
  },
  {
    "id": "P0014",
    "name": "Corduroy Shirt",
    "brand": "ReTrO StItChEs",
    "collection": "Formal Line",
    "category": "shirts",
    "categoryLabel": "Shirts",
    "price": 950,
    "mrp": 2310,
    "discountPct": 59,
    "rating": 3.4,
    "reviews": 1724,
    "color": "Olive",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "image": "images/products/shirt_3.jpg",
    "images": [
      "images/products/shirt_3.jpg",
      "images/products/shirt_1.jpg",
      "images/products/shirt_2.jpg"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Corduroy Shirt from the ReTrO StItChEs Formal Line collection. Designed in-house and crafted for everyday comfort with a modern fit, breathable fabric, and durable construction. Perfect for casual outings, college, or work.",
    "colorOptions": [
      {
        "name": "Olive",
        "hex": "#5c6b30"
      },
      {
        "name": "Grey",
        "hex": "#8a8a92"
      },
      {
        "name": "White",
        "hex": "#f5f5f0"
      }
    ],
    "customizable": true,
    "photoFixed": true
  },
  {
    "id": "P0015",
    "name": "Mandarin Collar Shirt",
    "brand": "ReTrO StItChEs",
    "collection": "Streetwear Edit",
    "category": "shirts",
    "categoryLabel": "Shirts",
    "price": 2360,
    "mrp": 2990,
    "discountPct": 21,
    "rating": 3.9,
    "reviews": 2312,
    "color": "Grey",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "image": "images/products/shirt_1.jpg",
    "images": [
      "images/products/shirt_1.jpg",
      "images/products/shirt_2.jpg",
      "images/products/shirt_3.jpg"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Mandarin Collar Shirt from the ReTrO StItChEs Streetwear Edit collection. Designed in-house and crafted for everyday comfort with a modern fit, breathable fabric, and durable construction. Perfect for casual outings, college, or work.",
    "colorOptions": [
      {
        "name": "Grey",
        "hex": "#8a8a92"
      },
      {
        "name": "Forest Green",
        "hex": "#2f5233"
      },
      {
        "name": "Navy",
        "hex": "#1b2a4a"
      }
    ],
    "customizable": true,
    "photoFixed": true
  },
  {
    "id": "P0016",
    "name": "Flannel Check Shirt",
    "brand": "ReTrO StItChEs",
    "collection": "Formal Line",
    "category": "shirts",
    "categoryLabel": "Shirts",
    "price": 790,
    "mrp": 1220,
    "discountPct": 35,
    "rating": 4.1,
    "reviews": 1962,
    "color": "Black",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "image": "images/products/shirt_2.jpg",
    "images": [
      "images/products/shirt_2.jpg",
      "images/products/shirt_3.jpg",
      "images/products/shirt_1.jpg"
    ],
    "isNew": false,
    "isBestseller": true,
    "description": "Flannel Check Shirt from the ReTrO StItChEs Formal Line collection. Designed in-house and crafted for everyday comfort with a modern fit, breathable fabric, and durable construction. Perfect for casual outings, college, or work.",
    "colorOptions": [
      {
        "name": "Black",
        "hex": "#111113"
      },
      {
        "name": "Beige",
        "hex": "#d8c7a1"
      },
      {
        "name": "Rust",
        "hex": "#a34a28"
      }
    ],
    "customizable": true,
    "photoFixed": true
  },
  {
    "id": "P0023",
    "name": "Chino Trousers",
    "brand": "ReTrO StItChEs",
    "collection": "Formal Line",
    "category": "trousers",
    "categoryLabel": "Trousers",
    "price": 1010,
    "mrp": 1710,
    "discountPct": 41,
    "rating": 3.7,
    "reviews": 292,
    "color": "Blue",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "image": "images/products/p00_00.jpg",
    "images": [
      "images/products/p00_00.jpg",
      "images/products/p00_01.jpg",
      "images/products/p00_02.jpg"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Chino Trousers from the ReTrO StItChEs Formal Line collection. Designed in-house and crafted for everyday comfort with a modern fit, breathable fabric, and durable construction. Perfect for casual outings, college, or work.",
    "colorOptions": [
      {
        "name": "Blue",
        "hex": "#2f5fa8"
      },
      {
        "name": "Rust",
        "hex": "#a34a28"
      },
      {
        "name": "White",
        "hex": "#f5f5f0"
      }
    ],
    "customizable": false,
    "photoFixed": true
  },
  {
    "id": "P0024",
    "name": "Cargo Trousers",
    "brand": "ReTrO StItChEs",
    "collection": "Formal Line",
    "category": "trousers",
    "categoryLabel": "Trousers",
    "price": 1550,
    "mrp": 2180,
    "discountPct": 29,
    "rating": 3.1,
    "reviews": 3862,
    "color": "Grey",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "image": "images/products/p00_03.jpg",
    "images": [
      "images/products/p00_03.jpg",
      "images/products/p00_04.jpg",
      "images/products/p00_05.jpg"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Cargo Trousers from the ReTrO StItChEs Formal Line collection. Designed in-house and crafted for everyday comfort with a modern fit, breathable fabric, and durable construction. Perfect for casual outings, college, or work.",
    "colorOptions": [
      {
        "name": "Grey",
        "hex": "#8a8a92"
      },
      {
        "name": "Maroon",
        "hex": "#6b1e2b"
      },
      {
        "name": "Forest Green",
        "hex": "#2f5233"
      }
    ],
    "customizable": false,
    "photoFixed": true
  },
  {
    "id": "P0025",
    "name": "Formal Slim Trousers",
    "brand": "ReTrO StItChEs",
    "collection": "Athleisure",
    "category": "trousers",
    "categoryLabel": "Trousers",
    "price": 1380,
    "mrp": 1610,
    "discountPct": 14,
    "rating": 4.9,
    "reviews": 1551,
    "color": "Maroon",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "image": "images/products/p00_06.jpg",
    "images": [
      "images/products/p00_06.jpg",
      "images/products/p00_07.jpg",
      "images/products/p00_08.jpg"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Formal Slim Trousers from the ReTrO StItChEs Athleisure collection. Designed in-house and crafted for everyday comfort with a modern fit, breathable fabric, and durable construction. Perfect for casual outings, college, or work.",
    "colorOptions": [
      {
        "name": "Maroon",
        "hex": "#6b1e2b"
      },
      {
        "name": "Black",
        "hex": "#111113"
      },
      {
        "name": "Olive",
        "hex": "#5c6b30"
      }
    ],
    "customizable": false,
    "photoFixed": true
  },
  {
    "id": "P0026",
    "name": "Jogger Trousers",
    "brand": "ReTrO StItChEs",
    "collection": "Formal Line",
    "category": "trousers",
    "categoryLabel": "Trousers",
    "price": 290,
    "mrp": 890,
    "discountPct": 67,
    "rating": 3.8,
    "reviews": 2605,
    "color": "Black",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "image": "images/products/p01_00.jpg",
    "images": [
      "images/products/p01_00.jpg",
      "images/products/p01_01.jpg",
      "images/products/p01_02.jpg"
    ],
    "isNew": false,
    "isBestseller": true,
    "description": "Jogger Trousers from the ReTrO StItChEs Formal Line collection. Designed in-house and crafted for everyday comfort with a modern fit, breathable fabric, and durable construction. Perfect for casual outings, college, or work.",
    "colorOptions": [
      {
        "name": "Black",
        "hex": "#111113"
      },
      {
        "name": "Maroon",
        "hex": "#6b1e2b"
      },
      {
        "name": "Forest Green",
        "hex": "#2f5233"
      }
    ],
    "customizable": false,
    "photoFixed": true
  },
  {
    "id": "P0027",
    "name": "Pleated Wide Trousers",
    "brand": "ReTrO StItChEs",
    "collection": "Formal Line",
    "category": "trousers",
    "categoryLabel": "Trousers",
    "price": 2310,
    "mrp": 3390,
    "discountPct": 32,
    "rating": 4.3,
    "reviews": 141,
    "color": "Black",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "image": "images/products/p01_03.jpg",
    "images": [
      "images/products/p01_03.jpg",
      "images/products/p01_04.jpg",
      "images/products/p01_05.jpg"
    ],
    "isNew": true,
    "isBestseller": false,
    "description": "Pleated Wide Trousers from the ReTrO StItChEs Formal Line collection. Designed in-house and crafted for everyday comfort with a modern fit, breathable fabric, and durable construction. Perfect for casual outings, college, or work.",
    "colorOptions": [
      {
        "name": "Black",
        "hex": "#111113"
      },
      {
        "name": "Rust",
        "hex": "#a34a28"
      },
      {
        "name": "Blue",
        "hex": "#2f5fa8"
      }
    ],
    "customizable": false,
    "photoFixed": true
  },
  {
    "id": "P0028",
    "name": "Corduroy Trousers",
    "brand": "ReTrO StItChEs",
    "collection": "Essentials",
    "category": "trousers",
    "categoryLabel": "Trousers",
    "price": 920,
    "mrp": 1770,
    "discountPct": 48,
    "rating": 3.1,
    "reviews": 74,
    "color": "Blue",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "image": "images/products/p01_06.jpg",
    "images": [
      "images/products/p01_06.jpg",
      "images/products/p01_07.jpg",
      "images/products/p01_08.jpg"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Corduroy Trousers from the ReTrO StItChEs Essentials collection. Designed in-house and crafted for everyday comfort with a modern fit, breathable fabric, and durable construction. Perfect for casual outings, college, or work.",
    "colorOptions": [
      {
        "name": "Blue",
        "hex": "#2f5fa8"
      },
      {
        "name": "Forest Green",
        "hex": "#2f5233"
      },
      {
        "name": "Black",
        "hex": "#111113"
      }
    ],
    "customizable": false,
    "photoFixed": true
  },
  {
    "id": "P0029",
    "name": "Houndstooth Trousers",
    "brand": "ReTrO StItChEs",
    "collection": "Formal Line",
    "category": "trousers",
    "categoryLabel": "Trousers",
    "price": 2230,
    "mrp": 2510,
    "discountPct": 11,
    "rating": 3,
    "reviews": 3527,
    "color": "Maroon",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "image": "images/products/p02_00.jpg",
    "images": [
      "images/products/p02_00.jpg",
      "images/products/p02_01.jpg",
      "images/products/p02_02.jpg"
    ],
    "isNew": false,
    "isBestseller": true,
    "description": "Houndstooth Trousers from the ReTrO StItChEs Formal Line collection. Designed in-house and crafted for everyday comfort with a modern fit, breathable fabric, and durable construction. Perfect for casual outings, college, or work.",
    "colorOptions": [
      {
        "name": "Maroon",
        "hex": "#6b1e2b"
      },
      {
        "name": "Black",
        "hex": "#111113"
      },
      {
        "name": "Navy",
        "hex": "#1b2a4a"
      }
    ],
    "customizable": false,
    "photoFixed": true
  },
  {
    "id": "P0030",
    "name": "Pinstripe Formal Trousers",
    "brand": "ReTrO StItChEs",
    "collection": "Formal Line",
    "category": "trousers",
    "categoryLabel": "Trousers",
    "price": 700,
    "mrp": 780,
    "discountPct": 10,
    "rating": 4.8,
    "reviews": 2891,
    "color": "Black",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "image": "images/products/p02_03.jpg",
    "images": [
      "images/products/p02_03.jpg",
      "images/products/p02_04.jpg",
      "images/products/p02_05.jpg"
    ],
    "isNew": true,
    "isBestseller": false,
    "description": "Pinstripe Formal Trousers from the ReTrO StItChEs Formal Line collection. Designed in-house and crafted for everyday comfort with a modern fit, breathable fabric, and durable construction. Perfect for casual outings, college, or work.",
    "colorOptions": [
      {
        "name": "Black",
        "hex": "#111113"
      },
      {
        "name": "Navy",
        "hex": "#1b2a4a"
      },
      {
        "name": "White",
        "hex": "#f5f5f0"
      }
    ],
    "customizable": false,
    "photoFixed": true
  },
  {
    "id": "P0031",
    "name": "Textured Weave Trousers",
    "brand": "ReTrO StItChEs",
    "collection": "Streetwear Edit",
    "category": "trousers",
    "categoryLabel": "Trousers",
    "price": 280,
    "mrp": 740,
    "discountPct": 62,
    "rating": 4.4,
    "reviews": 360,
    "color": "Blue",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "image": "images/products/p02_06.jpg",
    "images": [
      "images/products/p02_06.jpg",
      "images/products/p03_00.jpg",
      "images/products/p03_01.jpg"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Textured Weave Trousers from the ReTrO StItChEs Streetwear Edit collection. Designed in-house and crafted for everyday comfort with a modern fit, breathable fabric, and durable construction. Perfect for casual outings, college, or work.",
    "colorOptions": [
      {
        "name": "Blue",
        "hex": "#2f5fa8"
      },
      {
        "name": "Olive",
        "hex": "#5c6b30"
      },
      {
        "name": "Maroon",
        "hex": "#6b1e2b"
      }
    ],
    "customizable": false,
    "photoFixed": true
  },
  {
    "id": "P0032",
    "name": "Double-Pleat Trousers",
    "brand": "ReTrO StItChEs",
    "collection": "Formal Line",
    "category": "trousers",
    "categoryLabel": "Trousers",
    "price": 1480,
    "mrp": 3150,
    "discountPct": 53,
    "rating": 3.2,
    "reviews": 3640,
    "color": "Black",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "image": "images/products/p03_02.jpg",
    "images": [
      "images/products/p03_02.jpg",
      "images/products/p03_03.jpg",
      "images/products/p03_04.jpg"
    ],
    "isNew": false,
    "isBestseller": true,
    "description": "Double-Pleat Trousers from the ReTrO StItChEs Formal Line collection. Designed in-house and crafted for everyday comfort with a modern fit, breathable fabric, and durable construction. Perfect for casual outings, college, or work.",
    "colorOptions": [
      {
        "name": "Black",
        "hex": "#111113"
      },
      {
        "name": "Blue",
        "hex": "#2f5fa8"
      },
      {
        "name": "Rust",
        "hex": "#a34a28"
      }
    ],
    "customizable": false,
    "photoFixed": true
  },
  {
    "id": "P0033",
    "name": "Herringbone Trousers",
    "brand": "ReTrO StItChEs",
    "collection": "Formal Line",
    "category": "trousers",
    "categoryLabel": "Trousers",
    "price": 2300,
    "mrp": 2710,
    "discountPct": 15,
    "rating": 4.8,
    "reviews": 303,
    "color": "Navy",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "image": "images/products/p03_05.jpg",
    "images": [
      "images/products/p03_05.jpg",
      "images/products/p03_06.jpg",
      "images/products/p03_07.jpg"
    ],
    "isNew": true,
    "isBestseller": false,
    "description": "Herringbone Trousers from the ReTrO StItChEs Formal Line collection. Designed in-house and crafted for everyday comfort with a modern fit, breathable fabric, and durable construction. Perfect for casual outings, college, or work.",
    "colorOptions": [
      {
        "name": "Navy",
        "hex": "#1b2a4a"
      },
      {
        "name": "Black",
        "hex": "#111113"
      },
      {
        "name": "Beige",
        "hex": "#d8c7a1"
      }
    ],
    "customizable": false,
    "photoFixed": true
  },
  {
    "id": "P0034",
    "name": "Wide-Leg Trousers",
    "brand": "ReTrO StItChEs",
    "collection": "Formal Line",
    "category": "trousers",
    "categoryLabel": "Trousers",
    "price": 340,
    "mrp": 940,
    "discountPct": 64,
    "rating": 3.1,
    "reviews": 1350,
    "color": "Beige",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "image": "images/products/p03_08.jpg",
    "images": [
      "images/products/p03_08.jpg",
      "images/products/p03_09.jpg",
      "images/products/p04_00.jpg"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Wide-Leg Trousers from the ReTrO StItChEs Formal Line collection. Designed in-house and crafted for everyday comfort with a modern fit, breathable fabric, and durable construction. Perfect for casual outings, college, or work.",
    "colorOptions": [
      {
        "name": "Beige",
        "hex": "#d8c7a1"
      },
      {
        "name": "Navy",
        "hex": "#1b2a4a"
      },
      {
        "name": "Olive",
        "hex": "#5c6b30"
      }
    ],
    "customizable": false,
    "photoFixed": true
  }
];

const CATEGORIES = [
  {
    "key": "shirts",
    "label": "Shirts"
  },
  {
    "key": "trousers",
    "label": "Trousers"
  }
];

const COLLECTIONS = [
  "Essentials",
  "Streetwear Edit",
  "Formal Line",
  "Athleisure"
];
