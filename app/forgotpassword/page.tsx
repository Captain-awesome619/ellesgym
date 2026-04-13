import { Suspense } from "react";
import ResetPasswordPage from "./forgotpassword";
import { ClipLoader } from "react-spinners";
export default function Page() {
  return (
    <Suspense fallback={<p><ClipLoader /></p>}>
      <ResetPasswordPage />
    </Suspense>
  );
}