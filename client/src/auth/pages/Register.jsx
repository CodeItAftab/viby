import { Link, useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RegisterUser } from "@/redux/slices/auth";
import { Loader2 } from "lucide-react";

export default function Register() {
  const [data, setData] = useState({ name: "", email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    document.title = "Register | Viby Chat";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { payload } = await dispatch(RegisterUser(data));
      console.log(payload);
      if (payload?.success) {
        navigate("/auth/verify-otp");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full lg:grid  lg:grid-cols-5 h-full">
      <div className="flex items-center justify-center lg:py-0 py-10 col-span-3 ">
        <div className="mx-auto grid lg:w-[420px] w-[360px] px-2 gap-8 mb-12">
          <div className="grid gap-4 text-center mb-4">
            <h1 className="text-3xl font-bold">Register</h1>

            <p className="text-balance text-muted-foreground leading-none">
              Enter your details to register
            </p>
          </div>
          <form className="grid gap-4" onSubmit={handleSubmit} noValidate>
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="name"
                placeholder="Your Name"
                required
                className="border-slate-400 h-12"
                autoComplete="on"
                value={data.name}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                required
                className="border-slate-400 h-12"
                autoComplete="on"
                value={data.email}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, email: e.target.value }))
                }
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Your Password"
                required
                className="border-slate-400 h-12"
                autoComplete="on"
                value={data.password}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, password: e.target.value }))
                }
              />
            </div>

            <Button disabled={isLoading} type="submit" className="w-full h-11">
              {isLoading && <Loader2 className="animate-spin" />}
              {isLoading ? "Please wait" : "Register"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?
            <Link to={"/auth/login"} className="underline">
              Login
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block col-span-2">
        {/* <img
          src=""
          alt="Image"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        /> */}
      </div>
    </div>
  );
}
