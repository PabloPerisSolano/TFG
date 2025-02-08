import CreateQuiz from "@/components/CreateQuiz";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";

export default function CreatorPage() {
  return (
    <AuthenticatedLayout>
      <CreateQuiz />
    </AuthenticatedLayout>
  );
}
