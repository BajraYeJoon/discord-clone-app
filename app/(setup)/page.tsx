import { InitialModal } from "@/components/modals/initial-modal";
import { db } from "@/lib/db";
import { initProfile } from "@/lib/init-profile";
import { redirect } from "next/navigation";

const SetupPage = async () => {
  // TODO: check if user is logged in
  const profile = await initProfile();

  // TODO: check if user is already in a server
  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return <InitialModal />;
};

export default SetupPage;
