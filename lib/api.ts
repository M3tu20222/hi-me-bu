import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Well from "@/models/Well";

export async function getUserById(id: string) {
  await dbConnect();
  const user = await User.findById(id).select("-password");
  return user;
}

export async function getWellById(id: string) {
  await dbConnect();
  const well = await Well.findById(id).populate("responsibleUser", "name");
  return well;
}
