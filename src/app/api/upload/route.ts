import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Tidak ada file yang diunggah",
        },
        { status: 400 },
      );
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const ext = file.name.split(".").pop() || "jpg";

      const filename = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}.${ext}`;

      const { error } = await supabaseAdmin.storage
        .from("products")
        .upload(filename, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (error) {
        throw error;
      }

      const { data } = supabaseAdmin.storage
        .from("products")
        .getPublicUrl(filename);

      uploadedUrls.push(data.publicUrl);
    }

    return NextResponse.json({
      success: true,
      data: uploadedUrls,
    });
  } catch (error) {
    console.error("[POST /api/upload]", error);

    return NextResponse.json(
      {
        success: false,
        error: "Gagal mengunggah file",
      },
      { status: 500 },
    );
  }
}
