import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useDispatch } from "react-redux";
import { LoginUser } from "@/redux/slices/auth";
// import { Loader2 } from "lucide-react";
import { useEffect } from "react";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function Login() {
  const form = useForm({ resolver: zodResolver(schema) });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  // const { isLoading } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    // await new Promise((resolve) => setTimeout(resolve, 1000));

    dispatch(LoginUser(data));
    console.log(data);
  };

  useEffect(() => {
    document.title = "Login | Viby Chat";
  }, []);

  return (
    <div className="w-full lg:grid  lg:grid-cols-5 h-full">
      <div className="flex items-center justify-center lg:py-0 py-10 col-span-3 ">
        <div className="mx-auto grid lg:w-[420px] w-[360px] px-2 gap-8 mb-8">
          <div className="grid gap-4 text-center mb-4">
            <h1 className="text-3xl font-bold">Login</h1>

            <p className="text-balance text-muted-foreground leading-none">
              Enter your email below to login to your account
            </p>
          </div>
          <form
            className="grid gap-4"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                className={` h-12 ${
                  errors.email
                    ? " border-red-500 bg-red-50 focus-visible:ring-red-500"
                    : "border-slate-400"
                }`}
                autoComplete="on"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                className={` h-12 ${
                  errors.password
                    ? " border-red-500 bg-red-50 focus-visible:ring-red-500"
                    : "border-slate-400"
                }`}
                placeholder="Password"
                autoComplete="on"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-500 text-xs">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Link
              to="/auth/reset-password"
              className=" inline-block text-sm underline"
            >
              Forgot your password?
            </Link>
            <Button
              type="submit"
              // disabled={isLoading}
              className="w-full h-11 flex items-center justify-center gap-2"
            >
              {/* {isLoading && <Loader2 className="animate-spin" />} */}
              {/* {isLoading ? "Please wait" : "Login"} */}
              Login
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link to={"/auth/register"} className="underline text-blue-500">
              Sign up
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden lg:flex items-center col-span-2   overflow-hidden">
        {/* <img
          src={bgImg}
          alt="Login or Signup"
          className="h-[640px]  dark:brightness-[0.2] dark:grayscale mb-12"
        /> */}
      </div>
    </div>
  );
}
