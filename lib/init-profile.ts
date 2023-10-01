import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import { db } from "@/lib/db";

interface ProfileCreateInput {
  id?: string;
  userId: string;
  name: string;
  imageUrl: string;
  email: string;
  createdAt?: Date | string;
}

// This utility is used to load the profile if it aready exists in the database, or create it if it doesn't.
export const initProfile = async () => {
  const user = await currentUser();

  if (!user) {
    return redirectToSignIn();
  }

  const profile = await db.profile.findUnique({
    where: { userId: user.id },
  });

  if (profile) {
    return profile;
  }

  const newProfile: ProfileCreateInput = await db.profile.create({
    data: {
      userId: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.emailAddresses[0].emailAddress,
      imageUrl: user.imageUrl,
    },
  });

  return newProfile;
};
