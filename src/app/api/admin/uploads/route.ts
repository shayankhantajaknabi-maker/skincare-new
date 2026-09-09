import { NextResponse } from "next/server";
import { type UploadApiResponse } from "cloudinary";

import { getAdminSession } from "@/lib/admin-session";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";

const MAX_IMAGE_SIZE =
  5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export async function POST(
  request: Request
) {
  const admin =
    await getAdminSession();

  if (!admin) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  try {
    const formData =
      await request.formData();

    const file =
      formData.get("image");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please select an image",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !ALLOWED_IMAGE_TYPES.has(
        file.type
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Only JPG, PNG and WebP images are allowed",
        },
        {
          status: 400,
        }
      );
    }

    if (
      file.size >
      MAX_IMAGE_SIZE
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Image must be smaller than 5MB",
        },
        {
          status: 400,
        }
      );
    }

    const buffer =
      Buffer.from(
        await file.arrayBuffer()
      );

    /*
     * IMPORTANT:
     *
     * We store the ORIGINAL source format.
     *
     * PNG/WebP transparency is therefore
     * preserved in Cloudinary.
     *
     * Do NOT use fetch_format:auto during
     * upload because format optimization
     * belongs to the delivery URL.
     */
    const uploaded =
      await new Promise<UploadApiResponse>(
        (
          resolve,
          reject
        ) => {
          const stream =
            cloudinary.uploader.upload_stream(
              {
                folder:
                  "nm-skin-care/products",

                resource_type:
                  "image",

                use_filename:
                  false,

                unique_filename:
                  true,

                overwrite:
                  false,
              },
              (
                error,
                result
              ) => {
                if (
                  error ||
                  !result
                ) {
                  reject(
                    error ||
                      new Error(
                        "Image upload failed"
                      )
                  );

                  return;
                }

                resolve(
                  result
                );
              }
            );

          stream.end(
            buffer
          );
        }
      );

    /*
     * Create an optimized delivery URL.
     *
     * Cloudinary chooses the best browser
     * format at delivery time.
     *
     * Transparent PNG/WebP assets keep
     * their transparency when delivered
     * in a compatible optimized format.
     *
     * Nothing is product-specific here.
     */
    const optimizedUrl =
      cloudinary.url(
        uploaded.public_id,
        {
          secure: true,

          transformation: [
            {
              width: 1600,
              height: 1600,
              crop: "limit",
            },

            {
              quality: "auto",
              fetch_format:
                "auto",
            },
          ],
        }
      );

    return NextResponse.json({
      success: true,

      url: optimizedUrl,

      originalUrl:
        uploaded.secure_url,

      publicId:
        uploaded.public_id,

      format:
        uploaded.format,

      width:
        uploaded.width,

      height:
        uploaded.height,
    });
  } catch (error) {
    console.error(
      "Product image upload failed:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to upload image",
      },
      {
        status: 500,
      }
    );
  }
}