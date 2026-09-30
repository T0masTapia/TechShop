'use server'

import { supabase } from "@/lib/Supabase";
import { revalidatePath } from "next/cache";

export async function createProduct(formData: FormData) {
  // 1. Extraemos los campos del formulario de forma limpia
  const name = formData.get("name") as string;
  const brand = formData.get("brand") as string;
  const price = Number(formData.get("price"));
  const stock = Number(formData.get("stock"));
  const category_id = formData.get("category_id") as string; // <-- Aquí viaja la PK automáticamente
  const image_url = formData.get("image_url") as string || null;

  // Creamos un slug básico automático a partir del nombre (ej: "Mouse Razer" -> "mouse-razer")
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

  // 2. Insertamos el registro en Supabase
  const { error } = await supabase
    .from("product")
    .insert([
      {
        name,
        brand,
        price,
        stock,
        category_id,
        slug,
        image_url,
        specifications: {} // Inicializado vacío por ahora
      }
    ]);

  if (error) {
    console.error("❌ Error al insertar en Supabase:", error.message);
    return { success: false, error: error.message };
  }

  // Refrescamos la página de búsquedas para que el nuevo producto aparezca al tiro
  revalidatePath("/search");
  return { success: true };
}