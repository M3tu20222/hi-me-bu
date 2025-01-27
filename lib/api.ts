import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function getUserById(id: string) {
  await dbConnect();
  const user = await User.findById(id).select("-password");
  return user;
}
