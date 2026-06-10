import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
  try {
    console.log("=== UPLOAD START ===");
    console.log("SUPABASE URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log("HAS SERVICE ROLE:", !!process.env.SUPABASE_SERVICE_ROLE_KEY);

    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    console.log("FILES COUNT:", files.length);

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
      console.log("PROCESS FILE:", file.name);

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const ext = file.name.split(".").pop() || "jpg";

      const filename = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}.${ext}`;

      console.log("UPLOAD FILENAME:", filename);

      const { data: uploadData, error: uploadError } =
        await supabaseAdmin.storage.from("products").upload(filename, buffer, {
          contentType: file.type,
          upsert: false,
        });

      console.log("UPLOAD DATA:", uploadData);
      console.log("UPLOAD ERROR:", uploadError);

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrlData } = supabaseAdmin.storage
        .from("products")
        .getPublicUrl(filename);

      console.log("PUBLIC URL:", publicUrlData.publicUrl);

      uploadedUrls.push(publicUrlData.publicUrl);
    }

    return NextResponse.json({
      success: true,
      data: uploadedUrls,
    });
  } catch (error) {
    console.error("=== UPLOAD ERROR ===");
    console.error(error);

    if (error instanceof Error) {
      console.error("MESSAGE:", error.message);
      console.error("STACK:", error.stack);
    }

    return NextResponse.json(
      {
        success: false,
        error: "Gagal mengunggah file",
      },
      { status: 500 },
    );
  }
}
