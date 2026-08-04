import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/models/Product";

export async function GET() {
  try {
    await connectToDatabase();

    const products = await Product.find({ isActive: true })
      .sort({ featured: -1, createdAt: -1 })
      .lean();

    return Response.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Unable to load products",
      },
      { status: 500 }
    );
  }
}