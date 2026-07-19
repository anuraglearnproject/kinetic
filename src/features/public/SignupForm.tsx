import { useMutation } from "@tanstack/react-query"
import { z } from "zod"
import { useState } from "react"
import { useForm } from '@tanstack/react-form'
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card"

import { Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

// 1. Define the Validation Schema
const signupSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
})

type SignupData = z.infer<typeof signupSchema>

// Mock Signup API Function
const registerUserApi = async (data: SignupData) => {
    const response = await fetch("https://api.example.com/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Registration failed. Email might be taken.")
    return response.json()
}

export default function SignupForm() {
    const [serverError, setServerError] = useState<string | null>(null)

    // 2. Set up the Mutation Engine
    const mutation = useMutation({
        mutationFn: registerUserApi,
        onSuccess: () => {
            alert("Account created successfully! Welcome aboard.")
        },
        onError: (error: Error) => {
            setServerError(error.message)
        },
    })

    // 3. Initialize the TanStack Form hook with built-in Zod validation rules
    const form = useForm({
        defaultValues: {
            name: '',
            email: '',
            password: '',
        },
        validators: {
            onChange: signupSchema, // Valides every time the user types
        },
        // Triggers automatically when a user hits submit with validation errors
        onSubmitInvalid: () => {
            const firstErrorField = Object.keys(form.fieldInfo).find((key) => {
               return (form.getFieldMeta(key as any)?.errors?.length ?? 0) > 0
            })

            if (firstErrorField) {
                // 2. Query the DOM using the exact field key
                const element = document.querySelector(`input[name="${firstErrorField}"]`) as HTMLInputElement

                if (element) {
                    element.focus() // 3. Snap viewport cursor directly onto the target element
                }
            }
        },
        onSubmit: async ({ value }) => {
            setServerError(null)
            mutation.mutate(value)
        },
    })

    return (
        // Centers the entire Card perfectly inside the viewport shell
        <div className="min-h-screen w-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4"
        style={{ 
backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url('/kinetic-start-bg.jpg')`
        }}>
            <Card className="w-full max-w-md shadow-lg border-zinc-200 dark:border-zinc-800 bg-card">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-semibold tracking-tight">Create an account</CardTitle>
                    <CardDescription>Enter your details below to sign up</CardDescription>
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

                        {/* Name Field */}
                        <form.Field
                            name="name"
                            children={(field) => (
                                <Field>
                                    <FieldLabel>Full Name</FieldLabel>
                                    <Input
                                        name={field.name}
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        onBlur={field.handleBlur}
                                        placeholder="John Doe"
                                        type="text"
                                    />
                                    {field.state.meta.errors.length > 0 && (
                                        <FieldError>{field.state.meta.errors.map((err: any) => err?.message || err).join(', ')}</FieldError>
                                    )}
                                </Field>
                            )}
                        />

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
                                    <FieldError>    {field.state.meta.errors.map((err: any) => err?.message || err).join(', ')}</FieldError>
                                </Field>
                            )}
                        />

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="w-full py-2 px-4 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {mutation.isPending ? "Creating account..." : "Sign Up"}
                        </button>
                    </form>

                </CardContent>
            </Card>
        </div>
    )
}