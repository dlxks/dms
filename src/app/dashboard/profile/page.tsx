import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import ProfileForm, { ProfileProps } from "./components/profile-form";
import BackButton from "@/src/components/shared/back-button";

const UserProfilePage = async () => {
  const session = await auth();

  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id },
    select: {
      id: true,
      studentId: true,
      staffId: true,
      firstName: true,
      middleName: true,
      lastName: true,
      email: true,
      phoneNumber: true,
    },
  });

  // Normalize null → undefined for form-friendly values
  const sanitizedUser: ProfileProps | null = user
    ? ({
        id: user.id,
        studentId: user.studentId ?? undefined,
        staffId: user.staffId ?? undefined,
        firstName: user.firstName ?? undefined,
        middleName: user.middleName ?? undefined,
        lastName: user.lastName ?? undefined,
        email: user.email ?? undefined,
        phoneNumber: user.phoneNumber ?? undefined,
      } satisfies ProfileProps)
    : null;

  return (
    <div className="max-w-3xl mx-auto lg:p-6 space-y-6">
      <BackButton
        label="Return to previous page"
        className="cursor-pointer link"
      />
      <div className="space-y-6 p-6 bg-white rounded-2xl shadow-md/20">
        <h1 className="text-xl font-bold tracking-wide">My Information</h1>
        <ProfileForm item={sanitizedUser} />
      </div>
    </div>
  );
};

export default UserProfilePage;
