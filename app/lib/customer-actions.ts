"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import postgres from "postgres";
import { redirect } from "next/navigation";
import { sanitizeString, sanitizeEmail } from "./sanitize";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

const CustomerFormSchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: "Please enter a customer name." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  image_url: z.string().url().optional().or(z.literal('')),
});

const CreateCustomer = CustomerFormSchema.omit({ id: true });
const UpdateCustomer = CustomerFormSchema.omit({ id: true });

export type CustomerState = {
  errors?: {
    name?: string[];
    email?: string[];
    image_url?: string[];
  };
  message?: string | null;
};

export async function createCustomer(
  prevState: CustomerState,
  formData: FormData
) {
  // Validate form using Zod
  const validatedFields = CreateCustomer.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    image_url: formData.get("image_url"),
  });

  // If form validation fails, return errors early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing or invalid fields. Failed to create customer.",
    };
  }

  // Sanitize data
  const { name, email, image_url } = validatedFields.data;
  const sanitizedName = sanitizeString(name, 100);
  const sanitizedEmail = sanitizeEmail(email);
  const sanitizedImageUrl = image_url || '/customers/default-avatar.png';

  // Insert data into the database
  try {
    // Check if email already exists
    const existingCustomer = await sql`
      SELECT id FROM customers WHERE email = ${sanitizedEmail}
    `;

    if (existingCustomer.length > 0) {
      return {
        message: "A customer with this email already exists.",
      };
    }

    await sql`
      INSERT INTO customers (name, email, image_url)
      VALUES (${sanitizedName}, ${sanitizedEmail}, ${sanitizedImageUrl})
    `;
  } catch (error) {
    console.error("Database Error:", error);
    return {
      message: "Database Error: Failed to create customer.",
    };
  }

  // Revalidate the cache and redirect
  revalidatePath("/dashboard/customers");
  redirect("/dashboard/customers");
}

export async function updateCustomer(
  id: string,
  prevState: CustomerState,
  formData: FormData
) {
  const validatedFields = UpdateCustomer.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    image_url: formData.get("image_url"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing or invalid fields. Failed to update customer.",
    };
  }

  // Sanitize data
  const { name, email, image_url } = validatedFields.data;
  const sanitizedName = sanitizeString(name, 100);
  const sanitizedEmail = sanitizeEmail(email);
  const sanitizedImageUrl = image_url || '/customers/default-avatar.png';

  try {
    // Check if email already exists for another customer
    const existingCustomer = await sql`
      SELECT id FROM customers WHERE email = ${sanitizedEmail} AND id != ${id}
    `;

    if (existingCustomer.length > 0) {
      return {
        message: "A customer with this email already exists.",
      };
    }

    await sql`
      UPDATE customers
      SET name = ${sanitizedName}, email = ${sanitizedEmail}, image_url = ${sanitizedImageUrl}
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error("Database Error:", error);
    return {
      message: "Database Error: Failed to update customer.",
    };
  }

  revalidatePath("/dashboard/customers");
  redirect("/dashboard/customers");
}

export async function deleteCustomer(id: string) {
  try {
    // Check if customer has invoices
    const invoices = await sql`
      SELECT id FROM invoices WHERE customer_id = ${id} LIMIT 1
    `;

    if (invoices.length > 0) {
      return {
        message: "Cannot delete customer with existing invoices. Delete the invoices first.",
      };
    }

    await sql`DELETE FROM customers WHERE id = ${id}`;
    revalidatePath("/dashboard/customers");
    return { message: "Customer deleted successfully." };
  } catch (error) {
    console.error("Database Error:", error);
    return { message: "Database Error: Failed to delete customer." };
  }
}

export async function fetchCustomerById(id: string) {
  try {
    const data = await sql`
      SELECT id, name, email, image_url
      FROM customers
      WHERE id = ${id}
    `;

    return data[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch customer.");
  }
}
