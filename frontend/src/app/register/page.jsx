import { RegisterForm } from "@/components/register-form";

export default function Page() {
  return (
    <div className="flex w-full justify-center p-5">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  );
}
