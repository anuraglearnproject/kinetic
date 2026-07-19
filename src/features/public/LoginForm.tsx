import { useForm } from '@tanstack/react-form'
import { useMutation } from "@tanstack/react-query"
import { Link } from '@tanstack/react-router'
import { useState } from "react"
import { z } from "zod"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

// 1. Declare schema at the top so it's fully defined before the component mounts
const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
})


// Mock Login API Function
const loginUserApi = async (data: { username: string; password: string }) => {
    const response = await fetch("https://xyfronix.com/api/AuthApi/Login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Authentication failed. Invalid credentials.")
    return response.json()
}

export default function LoginForm() {
    const [serverError, setServerError] = useState<string | null>(null)
    
    // 2. Set up the Mutation Engine
    const mutation = useMutation({
        mutationFn: loginUserApi,
        onSuccess: () => {
            alert("Logged in successfully! Welcome back.")
        },
        onError: (error: Error) => {
            setServerError(error.message)
        },
    })

    // 3. Initialize your form state securely now that loginSchema is fully loaded
    const form = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
        validators: {
            onChange: loginSchema,
        },
        onSubmitInvalid: () => {
            const firstErrorField = Object.keys(form.fieldInfo).find((key) => {
                return (form.getFieldMeta(key as any)?.errors?.length ?? 0) > 0
            })

            if (firstErrorField) {
                const element = document.querySelector(`input[name="${firstErrorField}"]`) as HTMLInputElement
                if (element) {
                    element.focus()
                }
            }
        },
        onSubmit: async ({ value }) => {
            const apiPayload ={
                username: value.email,
                password: value.password,
            };
            setServerError(null)
            mutation.mutate(apiPayload)
        },
    })

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4"
            style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url('/kinetic-start-bg.jpg')`
            }}>
            <Card className="w-full max-w-md shadow-lg border-zinc-200 dark:border-zinc-800 bg-card">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-semibold tracking-tight">Log In</CardTitle>
                    <CardDescription>Enter your credentials below to log in</CardDescription>
                </CardHeader>
                <CardContent>

                    <form noValidate
                        onSubmit={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            form.handleSubmit()
                        }}
                        className="space-y-4"
                    >
                        {/* Server-side Context Error */}
                        {serverError && (
                            <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/30 rounded-lg">
                                {serverError}
                            </div>
                        )}

                        {/* Email Field */}
                        <form.Field
                            name="email"
                            children={(field) => (
                                <Field>
                                    <FieldLabel>Email address</FieldLabel>
                                    <Input
                                        name={field.name}
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        onBlur={field.handleBlur}
                                        placeholder="you@example.com"
                                        type="email"
                                    />
                                    {field.state.meta.errors.length > 0 && (
                                        <FieldError>{field.state.meta.errors.map((err: any) => err?.message || err).join(', ')}</FieldError>
                                    )}
                                </Field>
                            )}
                        />

                        {/* Password Field */}
                        <form.Field
                            name="password"
                            children={(field) => (
                                <Field>
                                    <FieldLabel>Password</FieldLabel>
                                    <Input
                                        name={field.name}
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        onBlur={field.handleBlur}
                                        placeholder="••••••••"
                                        type="password"
                                    />
                                    <FieldDescription>Must be at least 8 characters.</FieldDescription>
                                    {field.state.meta.errors.length > 0 && (
                                        <FieldError>{field.state.meta.errors.map((err: any) => err?.message || err).join(', ')}</FieldError>
                                    )}
                                </Field>
                            )}
                        />

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="w-full py-2 px-4 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {mutation.isPending ? "Logging In..." : "Log In"}
                        </button>
                        
                        <div className="mt-4 text-center text-sm text-zinc-400">
                           Don't have an account?{" "}
                            <Link to="/" className="font-medium hover:underline underline-offset-4 transition-all">
                                Sign Up
                            </Link>
                        </div>
                    </form>

                </CardContent>
            </Card>
        </div>
    )
}