import { LoginForm } from "./LoginForm";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-xs">
        <LoginForm redirectTo={next} />
      </div>
    </div>
  );
}
