import psycopg2
import json
import sys

def seed_database():
    host = "db.wahtdkceafdhuyrfceub.supabase.co"
    port = 5432
    database = "postgres"
    user = "postgres"
    password = "Chinmay@31handi"

    categories = [
        {
            "id": "cat-1",
            "name": "Apparel",
            "slug": "apparel",
            "description": "Sustainably-made clothing tailored for modern ease and comfort.",
            "image": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80",
            "item_count": 3
        },
        {
            "id": "cat-2",
            "name": "Bags",
            "slug": "bags",
            "description": "Luxury travel gear hand-cut from premium full-grain leathers.",
            "image": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
            "item_count": 1
        },
        {
            "id": "cat-3",
            "name": "Electronics",
            "slug": "electronics",
            "description": "Acoustics and devices reimagined with clean luxury trims.",
            "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
            "item_count": 1
        },
        {
            "id": "cat-4",
            "name": "Accessories",
            "slug": "accessories",
            "description": "Handcrafted chronographs, wallets, and acetate sunglasses.",
            "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
            "item_count": 3
        },
        {
            "id": "cat-5",
            "name": "Home",
            "slug": "home",
            "description": "Sculptural accent furniture and wellness aroma diffusers.",
            "image": "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&auto=format&fit=crop&q=80",
            "item_count": 2
        }
    ]

    products = [
        {
            "id": "prod-1",
            "name": "The Meridian Chronograph Watch",
            "category": "Accessories",
            "category_slug": "accessories",
            "price": 345.0,
            "original_price": 420.0,
            "rating": 4.8,
            "review_count": 124,
            "images": [
                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&auto=format&fit=crop&q=80"
            ],
            "description": "An elegant, precision-crafted timepiece featuring a polished steel body, custom leather strap, and Japanese quartz movement.",
            "long_description": "Designed for the modern voyager, The Meridian Chronograph blends timeless watchmaking traditions with a clean, contemporary design language. Crafted with a 316L stainless steel case, sapphire crystal glass, and a supple vegetable-tanned Italian leather band, it sits comfortably on the wrist for formal galas or casual weekends alike.",
            "colors": [
                {"name": "Silver & Tan", "hex": "#D2B48C"},
                {"name": "Matte Black", "hex": "#1A1A1A"},
                {"name": "Rose Gold", "hex": "#B76E79"}
            ],
            "sizes": [],
            "specs": [
                {"label": "Case Diameter", "value": "40mm"},
                {"label": "Case Thickness", "value": "8.5mm"},
                {"label": "Movement", "value": "Miyota Japanese Quartz"},
                {"label": "Water Resistance", "value": "5 ATM (50 Meters)"},
                {"label": "Strap Width", "value": "20mm"},
                {"label": "Strap Material", "value": "Italian Vegetable-Tanned Leather"}
            ],
            "reviews": [
                {
                    "userName": "Julian K.",
                    "rating": 5,
                    "date": "May 12, 2026",
                    "comment": "Absolutely stunning watch. The leather feels premium and the movement is silent and accurate. A real head-turner.",
                    "helpfulCount": 24
                },
                {
                    "userName": "Marcus Aurelius",
                    "rating": 4,
                    "date": "June 02, 2026",
                    "comment": "Beautiful minimalist watch. The dial is clean and easy to read. Minor scratch on the clasp after a week, but overall great quality.",
                    "helpfulCount": 8
                }
            ],
            "stock": 12,
            "is_featured": True,
            "is_trending": True,
            "is_bestseller": False,
            "tag": "Exclusive"
        },
        {
            "id": "prod-2",
            "name": "Classic Leather Weekender",
            "category": "Bags",
            "category_slug": "bags",
            "price": 280.0,
            "original_price": None,
            "rating": 4.9,
            "review_count": 89,
            "images": [
                "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80"
            ],
            "description": "A spacious travel duffel hand-cut from full-grain leather, built to last a lifetime of journeys.",
            "long_description": "The Ultimate travel companion. Crafted from water-resistant, oil-waxed full-grain cowhide leather that develops a gorgeous dark patina over time. It features a heavy-duty brass zipper, reinforced handles, a padded shoulder strap, and a separate bottom shoe compartment to keep your clothes fresh.",
            "colors": [
                {"name": "Heritage Brown", "hex": "#5C4033"},
                {"name": "Cognac Tan", "hex": "#A0522D"},
                {"name": "Obsidian Black", "hex": "#0D0D0D"}
            ],
            "sizes": [],
            "specs": [
                {"label": "Dimensions", "value": "21.5\" L x 10\" W x 11.5\" H"},
                {"label": "Volume", "value": "40 Liters"},
                {"label": "Weight", "value": "3.2 lbs"},
                {"label": "Hardware", "value": "Solid Brass"},
                {"label": "Lining", "value": "Waterproof Cotton Canvas"}
            ],
            "reviews": [
                {
                    "userName": "Sophia L.",
                    "rating": 5,
                    "date": "April 28, 2026",
                    "comment": "Took this to Paris for a 4-day trip, and it held everything perfectly. Smells amazing and looks so luxury.",
                    "helpfulCount": 42
                }
            ],
            "stock": 25,
            "is_featured": True,
            "is_trending": False,
            "is_bestseller": True,
            "tag": "Best Seller"
        },
        {
            "id": "prod-3",
            "name": "Aura Sound-Isolation Headphones",
            "category": "Electronics",
            "category_slug": "electronics",
            "price": 320.0,
            "original_price": 380.0,
            "rating": 4.7,
            "review_count": 204,
            "images": [
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80"
            ],
            "description": "Wireless over-ear headphones combining premium high-fidelity audio, active hybrid noise cancellation, and a luxurious aluminum trim.",
            "long_description": "Immerse yourself completely. Engineered with custom-tuned 40mm dynamic drivers, the Aura Studio headphones deliver deep, rich bass and crystal-clear highs. Premium memory foam ear cushions wrapped in protein leather provide unmatched all-day comfort, while the active hybrid noise cancellation isolates your environment.",
            "colors": [
                {"name": "Warm Silver", "hex": "#DCDCDC"},
                {"name": "Space Grey", "hex": "#4A4A4A"}
            ],
            "sizes": [],
            "specs": [
                {"label": "Battery Life", "value": "Up to 36 Hours (ANC ON)"},
                {"label": "Bluetooth Version", "value": "Bluetooth 5.3"},
                {"label": "Driver Size", "value": "40mm Custom Dynamic"},
                {"label": "Charging", "value": "USB-C QuickCharge (10m = 5h)"},
                {"label": "Codecs", "value": "LDAC, AAC, SBC"}
            ],
            "reviews": [
                {
                    "userName": "Ethan H.",
                    "rating": 5,
                    "date": "June 15, 2026",
                    "comment": "The noise cancellation is rivaling the best in the market. Comfort is exceptional, doesn't clamp the ears.",
                    "helpfulCount": 15
                }
            ],
            "stock": 18,
            "is_featured": False,
            "is_trending": True,
            "is_bestseller": False,
            "tag": "Trending"
        },
        {
            "id": "prod-4",
            "name": "Nouveau Lounge Chair",
            "category": "Home",
            "category_slug": "home",
            "price": 520.0,
            "original_price": None,
            "rating": 4.6,
            "review_count": 43,
            "images": [
                "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&auto=format&fit=crop&q=80"
            ],
            "description": "A mid-century modern accent chair featuring a curved walnut veneer shell and plush boucle upholstery.",
            "long_description": "Bring sculptural elegance to your living room. The Nouveau lounge chair features a molded walnut plywood frame that hugs the body, supported by architectural powder-coated steel legs. Upholstered in premium textured boucle fabric, it is a statement piece that doesn't compromise on sitting ergonomics.",
            "colors": [
                {"name": "Cream Boucle", "hex": "#F5F5DC"},
                {"name": "Olive Velvet", "hex": "#556B2F"},
                {"name": "Charcoal Wool", "hex": "#36454F"}
            ],
            "sizes": [],
            "specs": [
                {"label": "Height", "value": "32.5\""},
                {"label": "Width", "value": "30\""},
                {"label": "Depth", "value": "31.5\""},
                {"label": "Frame Material", "value": "Molded Walnut Plywood"},
                {"label": "Upholstery", "value": "Textured Boucle (90% Polyester, 10% Acrylic)"}
            ],
            "reviews": [
                {
                    "userName": "Eleanor V.",
                    "rating": 5,
                    "date": "May 20, 2026",
                    "comment": "This chair is a work of art. Upholstery is soft and thick, frame is rock solid. Easy to assemble too.",
                    "helpfulCount": 31
                }
            ],
            "stock": 8,
            "is_featured": True,
            "is_trending": False,
            "is_bestseller": False,
            "tag": "Design Icon"
        },
        {
            "id": "prod-5",
            "name": "Tailored Linen Trench Coat",
            "category": "Apparel",
            "category_slug": "apparel",
            "price": 195.0,
            "original_price": 240.0,
            "rating": 4.5,
            "review_count": 56,
            "images": [
                "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop&q=80"
            ],
            "description": "A lightweight, double-breasted outerwear staple crafted from structured Belgian organic linen.",
            "long_description": "Perfect for transitional layering. The Tailored Linen Trench features a sophisticated double-breasted silhouette, storm flaps, and a removable waist belt. Made from breathable Belgian flax linen, it has been pre-washed to achieve a soft, comfortable texture while keeping a sharp, structured look.",
            "colors": [
                {"name": "Sand", "hex": "#E3C9A8"},
                {"name": "Warm Olive", "hex": "#707E63"},
                {"name": "Navy Blue", "hex": "#1D2A44"}
            ],
            "sizes": ["XS", "S", "M", "L", "XL"],
            "specs": [
                {"label": "Material", "value": "100% Belgian Organic Flax Linen"},
                {"label": "Lining", "value": "Unlined for lightweight breathability"},
                {"label": "Closure", "value": "Horn buttons"},
                {"label": "Care", "value": "Dry Clean Recommended"}
            ],
            "reviews": [
                {
                    "userName": "Aria R.",
                    "rating": 5,
                    "date": "June 10, 2026",
                    "comment": "Perfect weight for spring and summer evenings. Drapes beautifully and fits true to size.",
                    "helpfulCount": 11
                }
            ],
            "stock": 15,
            "is_featured": False,
            "is_trending": False,
            "is_bestseller": True,
            "tag": "Summer Essential"
        },
        {
            "id": "prod-6",
            "name": "Apex Acetate Sunglasses",
            "category": "Accessories",
            "category_slug": "accessories",
            "price": 135.0,
            "original_price": None,
            "rating": 4.7,
            "review_count": 78,
            "images": [
                "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80"
            ],
            "description": "Classic D-frame sunglasses made from bio-degradable acetate with polarized, scratch-resistant Carl Zeiss lenses.",
            "long_description": "Timeless styling meets environmental responsibility. The Apex features a robust, bio-degradable cellulose acetate frame fitted with five-barrel metal hinges for premium tactile feedback and durability. The polarized Carl Zeiss lenses offer 100% UVA/UVB protection and ultimate visual clarity.",
            "colors": [
                {"name": "Tortoiseshell", "hex": "#4E3629"},
                {"name": "Crystal Olive", "hex": "#8FBC8F"},
                {"name": "Gloss Black", "hex": "#000000"}
            ],
            "sizes": [],
            "specs": [
                {"label": "Frame Width", "value": "142mm"},
                {"label": "Lens Width", "value": "48mm"},
                {"label": "Bridge Width", "value": "22mm"},
                {"label": "Lens Rating", "value": "UV400 Polarized (Zeiss)"},
                {"label": "Hinge", "value": "German 5-barrel nickel silver"}
            ],
            "reviews": [
                {
                    "userName": "Oliver G.",
                    "rating": 4,
                    "date": "May 30, 2026",
                    "comment": "The lenses are amazing. Very crisp contrast. The crystal olive color is gorgeous in the sunlight.",
                    "helpfulCount": 6
                }
            ],
            "stock": 30,
            "is_featured": False,
            "is_trending": True,
            "is_bestseller": False,
            "tag": "Trending"
        },
        {
            "id": "prod-7",
            "name": "Ultrasonic Essential Oil Diffuser",
            "category": "Home",
            "category_slug": "home",
            "price": 85.0,
            "original_price": 110.0,
            "rating": 4.8,
            "review_count": 142,
            "images": [
                "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80"
            ],
            "description": "A sculptural stone aroma diffuser that doubles as a minimalist nightlight, atomizing scent silently.",
            "long_description": "Elevate your ambient environment. The Aura Stone Diffuser features a hand-crafted ceramic cover modeled to look like natural stone. Equipped with ultrasonic vibrations, it disperses a cool, fragrant mist without heat, preserving the therapeutic integrity of your essential oils. Includes automated safety shutoff and custom ambient glow cycles.",
            "colors": [
                {"name": "Basalt Grey", "hex": "#708090"},
                {"name": "Chalk White", "hex": "#FDFDFD"},
                {"name": "Terracotta", "hex": "#C46210"}
            ],
            "sizes": [],
            "specs": [
                {"label": "Capacity", "value": "120ml"},
                {"label": "Run Time", "value": "4 Hours (Continuous) / 8 Hours (Interval)"},
                {"label": "Coverage Area", "value": "Up to 500 sq ft"},
                {"label": "Power Source", "value": "USB-C wall plug (included)"},
                {"label": "Material", "value": "BPA-free plastic container, Porcelain exterior"}
            ],
            "reviews": [
                {
                    "userName": "Charlotte D.",
                    "rating": 5,
                    "date": "June 05, 2026",
                    "comment": "Diffuses scent perfectly and fits in with my home styling. The light cycle is warm and soothing.",
                    "helpfulCount": 19
                }
            ],
            "stock": 45,
            "is_featured": False,
            "is_trending": False,
            "is_bestseller": True,
            "tag": "Wellness"
        },
        {
            "id": "prod-8",
            "name": "Modular MagSafe Leather Wallet",
            "category": "Accessories",
            "category_slug": "accessories",
            "price": 65.0,
            "original_price": None,
            "rating": 4.4,
            "review_count": 67,
            "images": [
                "https://images.unsplash.com/photo-1627124112126-7d4ad2e67a36?w=800&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1601597111158-2fceff270190?w=800&auto=format&fit=crop&q=80"
            ],
            "description": "A ultra-slim magnetic wallet crafted from premium leather, featuring an integrated kickstand and quick-access card slots.",
            "long_description": "The intersection of utility and luxury. Designed with ultra-strong N52 neodymium magnets, it clips securely to any MagSafe-compatible phone. Hand-crafted from full-grain leather, it holds up to three cards, features built-in RFID shielding, and folds open to serve as a sturdy landscape or portrait phone stand.",
            "colors": [
                {"name": "Obsidian Black", "hex": "#121212"},
                {"name": "British Tan", "hex": "#8B5A2B"},
                {"name": "Emerald Green", "hex": "#004B49"}
            ],
            "sizes": [],
            "specs": [
                {"label": "Card Capacity", "value": "3 cards max"},
                {"label": "Magnet Strength", "value": "3200 gauss (Super strong)"},
                {"label": "Weight", "value": "1.1 oz"},
                {"label": "RFID Shielding", "value": "Yes, fully shielded"},
                {"label": "Kickstand Angles", "value": "45° Portrait, 60° Landscape"}
            ],
            "reviews": [
                {
                    "userName": "Leo T.",
                    "rating": 5,
                    "date": "April 15, 2026",
                    "comment": "Magnets are much stronger than the official Apple one. Holds three cards tightly and kickstand function is super useful.",
                    "helpfulCount": 14
                }
            ],
            "stock": 50,
            "is_featured": False,
            "is_trending": False,
            "is_bestseller": False,
            "tag": "Utility"
        },
        {
            "id": "prod-9",
            "name": "Minimalist Ceramic Coffee Dripper Set",
            "category": "Home",
            "category_slug": "home",
            "price": 75.0,
            "original_price": None,
            "rating": 4.8,
            "review_count": 32,
            "images": [
                "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80"
            ],
            "description": "A pour-over brewing kit with a double-walled ceramic dripper, a custom walnut server stand, and a hand-blown borosilicate glass carafe.",
            "long_description": "Perfect your morning ritual. The double-walled ceramic construction keeps your brewing temperature stable, optimizing extraction efficiency. The carafe holds up to 600ml of pour-over coffee, and the handcrafted American walnut stand brings a luxurious, modern architectural touch to your kitchen counter.",
            "colors": [
                {"name": "Matte White", "hex": "#FBFBFB"},
                {"name": "Slate Black", "hex": "#2B2B2B"}
            ],
            "sizes": [],
            "specs": [
                {"label": "Capacity", "value": "600ml (1-4 cups)"},
                {"label": "Dripper Material", "value": "Double-walled glazed stoneware"},
                {"label": "Carafe Material", "value": "Borosilicate Glass"},
                {"label": "Stand Material", "value": "FSC-Certified American Walnut, Brass"},
                {"label": "Filter Type", "value": "V60 size 02 (10 filters included)"}
            ],
            "reviews": [
                {
                    "userName": "Naomi S.",
                    "rating": 5,
                    "date": "June 21, 2026",
                    "comment": "Beautiful coffee maker. Extracts coffee beautifully and looks like a sculpture on my kitchen counter.",
                    "helpfulCount": 5
                }
            ],
            "stock": 14,
            "is_featured": True,
            "is_trending": False,
            "is_bestseller": False,
            "tag": "Kitchen Craft"
        },
        {
            "id": "prod-10",
            "name": "Bespoke Silk Pajama Set",
            "category": "Apparel",
            "category_slug": "apparel",
            "price": 220.0,
            "original_price": None,
            "rating": 4.9,
            "review_count": 45,
            "images": [
                "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=800&auto=format&fit=crop&q=80"
            ],
            "description": "Premium sleepwear set tailored from 100% 22-Momme organic Mulberry silk, featuring piping details and an elastic drawstring waist.",
            "long_description": "Indulge in pure comfort. mulberry silk regulates temperature, retains skin hydration, and feels extraordinarily soft. The long-sleeve top features a notched collar and mother-of-pearl buttons, and the relaxed pants offer a flexible elastic drawstring waistband for premium ease.",
            "colors": [
                {"name": "Champagne Pearl", "hex": "#E8D8C8"},
                {"name": "Midnight Navy", "hex": "#1A2535"},
                {"name": "Emerald", "hex": "#0E3A2F"}
            ],
            "sizes": ["XS", "S", "M", "L", "XL"],
            "specs": [
                {"label": "Material", "value": "100% Organic Mulberry Silk (22 Momme)"},
                {"label": "Fit", "value": "Relaxed tailored fit"},
                {"label": "Buttons", "value": "100% Genuine Mother of Pearl"},
                {"label": "Certifications", "value": "OEKO-TEX® Standard 100"}
            ],
            "reviews": [
                {
                    "userName": "Vicky L.",
                    "rating": 5,
                    "date": "June 14, 2026",
                    "comment": "Pure luxury. Keeps me cool all night and feels like a second skin. Definitely worth the investment.",
                    "helpfulCount": 12
                }
            ],
            "stock": 10,
            "is_featured": False,
            "is_trending": False,
            "is_bestseller": True,
            "tag": "Luxury Sleep"
        }
    ]

    print("Connecting to database...")
    try:
        conn = psycopg2.connect(
            host=host,
            port=port,
            database=database,
            user=user,
            password=password
        )
        cursor = conn.cursor()
        print("Connected. Seeding categories...")

        for cat in categories:
            cursor.execute(
                """
                INSERT INTO categories (id, name, slug, description, image, item_count)
                VALUES (%s, %s, %s, %s, %s, %s)
                ON CONFLICT (id) DO UPDATE SET
                    name = EXCLUDED.name,
                    slug = EXCLUDED.slug,
                    description = EXCLUDED.description,
                    image = EXCLUDED.image,
                    item_count = EXCLUDED.item_count;
                """,
                (cat["id"], cat["name"], cat["slug"], cat["description"], cat["image"], cat["item_count"])
            )

        print("Seeding products, inventory and reviews...")
        for p in products:
            # 1. Product table
            cursor.execute(
                """
                INSERT INTO products (
                    id, name, category, category_slug, price, original_price, rating, review_count,
                    images, description, long_description, colors, sizes, specs, stock,
                    is_featured, is_trending, is_bestseller, tag
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (id) DO UPDATE SET
                    name = EXCLUDED.name,
                    category = EXCLUDED.category,
                    category_slug = EXCLUDED.category_slug,
                    price = EXCLUDED.price,
                    original_price = EXCLUDED.original_price,
                    rating = EXCLUDED.rating,
                    review_count = EXCLUDED.review_count,
                    images = EXCLUDED.images,
                    description = EXCLUDED.description,
                    long_description = EXCLUDED.long_description,
                    colors = EXCLUDED.colors,
                    sizes = EXCLUDED.sizes,
                    specs = EXCLUDED.specs,
                    stock = EXCLUDED.stock,
                    is_featured = EXCLUDED.is_featured,
                    is_trending = EXCLUDED.is_trending,
                    is_bestseller = EXCLUDED.is_bestseller,
                    tag = EXCLUDED.tag;
                """,
                (
                    p["id"], p["name"], p["category"], p["category_slug"], p["price"], p["original_price"],
                    p["rating"], p["review_count"], p["images"], p["description"], p["long_description"],
                    json.dumps(p["colors"]), p["sizes"], json.dumps(p["specs"]), p["stock"],
                    p["is_featured"], p["is_trending"], p["is_bestseller"], p["tag"]
                )
            )

            # 2. Inventory table
            cursor.execute(
                """
                INSERT INTO inventory (product_id, stock)
                VALUES (%s, %s)
                ON CONFLICT (product_id) DO UPDATE SET stock = EXCLUDED.stock;
                """,
                (p["id"], p["stock"])
            )

            # 3. Reviews table
            for rev in p["reviews"]:
                cursor.execute(
                    """
                    INSERT INTO reviews (product_id, user_name, rating, comment, helpful_count, date)
                    VALUES (%s, %s, %s, %s, %s, %s);
                    """,
                    (p["id"], rev["userName"], rev["rating"], rev["comment"], rev["helpfulCount"], rev["date"])
                )

        conn.commit()
        print("Commit successful. Database seeded successfully!")
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Error seeding database: {e}")
        sys.exit(1)

if __name__ == "__main__":
    seed_database()
