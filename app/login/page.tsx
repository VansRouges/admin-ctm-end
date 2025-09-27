import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center gap-2 self-center font-medium">
          <div className="bg-app-gold-100 text-black flex size-8 items-center justify-center rounded-md shadow-glow-gold">
            <span className="text-lg font-bold">₵</span>
          </div>
          <span className="text-app-gold-100 text-xl font-semibold">
            CopyTradingMarkets
          </span>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Admin Portal</h2>
          <p className="text-muted-foreground text-sm">
            Secure access for administrators only
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
