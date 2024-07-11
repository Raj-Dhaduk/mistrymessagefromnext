import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };
    // Validation with zod
    const result = UsernameQuerySchema.safeParse(queryParam);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return new Response(
        JSON.stringify({
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(", ")
              : "Invalid query parameters",
        }),
        {
          status: 400,
        }
      );
    }

    const { username } = result.data;
    const existingUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUser) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Username already taken by another user",
        }),
        {
          status: 400,
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Username is unique",
      }),
      {
        status: 200, // Ensure the status code for success is 200
      }
    );
  } catch (error) {
    console.error("Error checking username", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error checking username",
      }),
      {
        status: 500,
      }
    );
  }
}
