"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import FormField from "@/components/FormField";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/firebase/client";
import { signUp, signIn } from "@/lib/actions/auth.action";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const formSchema = authFormSchema(type);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (type === "sign-up") {
        const { name, email, password } = data;

        try {
          // Create Firebase user
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );

          // Call server action
          const result = await signUp({
            uid: userCredential.user.uid,
            name: name!,
            email,
            password,
          });

          // Check result from server
          if (!result.success) {
            toast.error(result.message);
            return;
          }

          toast.success("Account created successfully. Please sign in.");
          router.push("/sign-in");
        } catch (error: any) {
          if (error.code === "auth/email-already-in-use") {
            toast.error("Email already exists. Please sign in instead.");
          } else {
            toast.error(error.message || "Sign up failed. Please try again.");
          }
        }
      } else {
        const { email, password } = data;

        try {
          const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
          );

          const idToken = await userCredential.user.getIdToken();
          if (!idToken) {
            toast.error("Sign in Failed. Please try again.");
            return;
          }

          await signIn({
            email,
            idToken,
          });

          toast.success("Signed in successfully.");
          router.push("/");
        } catch (error: any) {
          if (error.code === "auth/invalid-credential") {
            toast.error("Incorrect email or password. Please try again.");
            return;
          }
        }
      }
    } catch (error: any) {
      toast.error(
        error.message || "An unexpected error occurred. Please try again."
      );
    }
  };

  const isSignIn = type === "sign-in";

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/logo.svg" alt="logo" width={38} height={32} />
          <h2 className="text-primary-100">HireReady</h2>
        </div>
        <h3 className="text-center">Practice job interview with AI</h3>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4 form"
          >
            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                label="Name"
                placeholder="Your Name"
                type="text"
              />
            )}

            <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Your email address"
              type="email"
            />

            <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter your password"
              type="password"
            />
            <Button type="submit" className="btn">
              {isSignIn ? "Sign in" : "Create an Account"}
            </Button>
          </form>
        </Form>
        <p className="text-center">
          {isSignIn ? "No account yet?" : "Have an account already?"}
          <Link
            href={!isSignIn ? "/sign-in" : "/sign-up"}
            className="font-bold text-user-primary ml-1 underline hover:text-cyan-500"
          >
            {!isSignIn ? "Sign In" : "Sign Up"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
