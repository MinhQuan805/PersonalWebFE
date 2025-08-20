import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { ArticleModel } from "@/lib/models/article.model";
import { connectDB } from "@/lib/database/connectDB";
export const dynamic = 'force-dynamic';
const filePath = path.join(process.cwd(), "src/data/articles.json");

function saveArticles(data: any) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export async function GET() {
  try {
    await connectDB();

    const articles = await ArticleModel.find();
    saveArticles(articles);

    return NextResponse.json({
      success: true,
      message: "Refreshed",
    });
  } catch (err) {
    console.error("Refresh API error:", err);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
