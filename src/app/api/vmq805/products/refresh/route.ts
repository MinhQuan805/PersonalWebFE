import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { ProductModel } from "@/lib/models/product.model";
import { connectDB } from "@/lib/database/connectDB";
export const dynamic = 'force-dynamic';
const filePath = path.join(process.cwd(), "src/data/products.json");

function saveProducts(data: any) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export async function GET() {
  try {
    await connectDB();

    const products = await ProductModel.find();
    saveProducts(products);

    return NextResponse.json({
      success: true,
      message: "Refreshed",
    });
  } catch (err) {
    console.error("Refresh API error:", err);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
