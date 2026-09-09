import {
  Schema,
  model,
  models,
} from "mongoose";

const ProductSchema =
  new Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
      },

      category: {
        type: String,
        default: "Serum",
        trim: true,
      },

      shortDescription: {
        type: String,
        default: "",
        trim: true,
      },

      description: {
        type: String,
        default: "",
        trim: true,
      },


      price: {
        type: Number,
        required: true,
        min: 0,
      },

      compareAtPrice: {
        type: Number,
        default: null,
        min: 0,
      },


      stock: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
      },


      images: {
        type: [String],
        default: [],
      },


      // PRODUCT BENEFITS
      benefits: {
        type: [String],
        default: [],
      },


      // PRODUCT INGREDIENTS
      ingredients: {
        type: [
          {
            name: {
              type: String,
              trim: true,
            },

            description: {
              type: String,
              trim: true,
            },

            image: {
              type: String,
              trim: true,
              default: "",
            },
          },
        ],
        default: [],
      },


      // HOW TO USE STEPS
      howToUse: {
        type: [
          {
            title: {
              type: String,
              trim: true,
            },

            description: {
              type: String,
              trim: true,
            },

            image: {
              type: String,
              default: "",
              trim: true,
            },
          },
        ],
        default: [],
      },


      // BRAND STORY
      story: {
        type: String,
        default: "",
        trim: true,
      },

      // BEFORE & AFTER RESULT
      beforeAfter: {
        beforeImage: {
          type: String,
          default: "",
          trim: true,
        },

        afterImage: {
          type: String,
          default: "",
          trim: true,
        },

        description: {
          type: String,
          default: "",
          trim: true,
        },
      },


      isActive: {
        type: Boolean,
        default: true,
      },


      featured: {
        type: Boolean,
        default: false,
      },


      // HOMEPAGE CONTROL
      showOnHomepage: {
        type: Boolean,
        default: false,
      },


      homepageOrder: {
        type: Number,
        default: 0,
        min: 0,
      },


      packType: {
        type: String,
        enum: [
          "single",
          "twin",
          "family",
        ],
        default: "single",
      },


      units: {
        type: Number,
        default: 1,
        min: 1,
      },


      badge: {
        type: String,
        default: "",
        trim: true,
      },

    },

    {
      timestamps: true,
    }
  );


export const Product =
  models.Product ||
  model(
    "Product",
    ProductSchema
  );


export default Product;