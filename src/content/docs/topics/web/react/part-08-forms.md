---
title: "Part 8: Forms"
description: "Controlled forms from scratch, React Hook Form for complex cases, Zod for schema validation, and submission patterns that handle errors gracefully."
parent: react
tags: [react, javascript, typescript, web, frontend, intermediate]
status: draft
created: 2026-05-04
updated: 2026-05-04
---

Forms are where most of the fiddly work in frontend development lives: validation on change vs on blur vs on submit, error messages in the right place, disabled states during submission, and keeping the UI consistent with the server's response. This part builds up from the controlled form pattern you saw in Part 2 to React Hook Form and Zod for production-grade handling.

## Controlled forms: the baseline

For simple forms, the approach from Part 2 is fine:

```tsx
import { useState } from 'react'

interface LoginForm {
  email: string
  password: string
}

function LoginPage() {
  const [form, setForm] = useState<LoginForm>({ email: '', password: '' })
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await login(form)
      // redirect or update auth state
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
        />
      </div>
      {error && <p role="alert">{error}</p>}
      <button type="submit" disabled={submitting}>
        {submitting ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  )
}
```

This scales to 3-4 fields. Beyond that, manual validation per field becomes repetitive. React Hook Form handles that cleanly.

## React Hook Form

React Hook Form (RHF) uses uncontrolled inputs under the hood and only updates React state when necessary, making it much faster than a fully controlled approach for large forms.

```bash
npm install react-hook-form
```

### Basic usage

```tsx
import { useForm } from 'react-hook-form'

interface LoginFields {
  email: string
  password: string
}

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFields>()

  const onSubmit = async (data: LoginFields) => {
    await login(data)   // RHF passes validated, typed data
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Invalid email format',
            },
          })}
        />
        {errors.email && <p role="alert">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 8, message: 'At least 8 characters' },
          })}
        />
        {errors.password && <p role="alert">{errors.password.message}</p>}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  )
}
```

`register` attaches the field to RHF's tracking. `handleSubmit` validates all fields before calling `onSubmit`. `errors` contains per-field error messages. `isSubmitting` is true while `onSubmit` is running (even async).

### Watch and setValue

```tsx
const { register, watch, setValue } = useForm<{ quantity: number; total: number }>()
const quantity = watch('quantity')

// Automatically compute total whenever quantity changes
useEffect(() => {
  setValue('total', quantity * 9.99)
}, [quantity, setValue])
```

## Zod schema validation

Zod is a TypeScript-first schema library. Define the shape of your data once, and get both runtime validation and TypeScript types from the same definition.

```bash
npm install zod @hookform/resolvers
```

### Define a schema

```tsx
import { z } from 'zod'

const registrationSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username cannot exceed 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores'),
  email: z
    .string()
    .email('Invalid email address'),
  password: z
    .string()
    .min(8, 'At least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
  confirmPassword: z.string(),
  age: z
    .number({ invalid_type_error: 'Age must be a number' })
    .int()
    .min(18, 'Must be at least 18'),
  newsletter: z.boolean().default(false),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

// Derive the TypeScript type from the schema
type RegistrationFields = z.infer<typeof registrationSchema>
```

### Wire Zod to React Hook Form

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

function RegistrationForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<RegistrationFields>({
    resolver: zodResolver(registrationSchema),
    defaultValues: { newsletter: false },
  })

  const onSubmit = async (data: RegistrationFields) => {
    await registerUser(data)
  }

  if (isSubmitSuccessful) {
    return <p>Registration successful! Check your email.</p>
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Username</label>
        <input {...register('username')} />
        {errors.username && <p role="alert">{errors.username.message}</p>}
      </div>

      <div>
        <label>Email</label>
        <input type="email" {...register('email')} />
        {errors.email && <p role="alert">{errors.email.message}</p>}
      </div>

      <div>
        <label>Password</label>
        <input type="password" {...register('password')} />
        {errors.password && <p role="alert">{errors.password.message}</p>}
      </div>

      <div>
        <label>Confirm Password</label>
        <input type="password" {...register('confirmPassword')} />
        {errors.confirmPassword && (
          <p role="alert">{errors.confirmPassword.message}</p>
        )}
      </div>

      <div>
        <label>Age</label>
        <input type="number" {...register('age', { valueAsNumber: true })} />
        {errors.age && <p role="alert">{errors.age.message}</p>}
      </div>

      <div>
        <label>
          <input type="checkbox" {...register('newsletter')} />
          Subscribe to newsletter
        </label>
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating account...' : 'Create account'}
      </button>
    </form>
  )
}
```

Zod validates the entire form on submit (and on change if you set `mode: 'onChange'`). The resolver translates Zod errors into RHF's `errors` shape automatically.

## Validation modes

RHF supports four validation modes:

```tsx
useForm({
  mode: 'onSubmit',    // default: validate on submit only
  mode: 'onChange',    // validate on every keystroke
  mode: 'onBlur',     // validate when field loses focus
  mode: 'onTouched',  // validate on blur, then on change after first blur
})
```

`onBlur` or `onTouched` are the best UX for most forms: users don't see errors before they've interacted with a field, but errors appear quickly once they move on.

## Dynamic fields with useFieldArray

For forms where the user can add and remove rows:

```tsx
import { useForm, useFieldArray } from 'react-hook-form'

interface OrderForm {
  items: { name: string; quantity: number; price: number }[]
}

function OrderForm() {
  const { register, control, handleSubmit } = useForm<OrderForm>({
    defaultValues: { items: [{ name: '', quantity: 1, price: 0 }] },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  })

  return (
    <form onSubmit={handleSubmit(data => console.log(data))}>
      {fields.map((field, index) => (
        <div key={field.id}>
          <input
            {...register(`items.${index}.name`)}
            placeholder="Item name"
          />
          <input
            type="number"
            {...register(`items.${index}.quantity`, { valueAsNumber: true })}
          />
          <input
            type="number"
            step="0.01"
            {...register(`items.${index}.price`, { valueAsNumber: true })}
          />
          <button type="button" onClick={() => remove(index)}>Remove</button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => append({ name: '', quantity: 1, price: 0 })}
      >
        Add item
      </button>
      <button type="submit">Submit order</button>
    </form>
  )
}
```

`useFieldArray` manages the array in the form state. Use `field.id` (not the array index) as the React key: RHF generates stable IDs that survive reordering.

## Server-side errors

After submission, the server may return validation errors (e.g., "email already in use"). Set them back into RHF:

```tsx
import { useForm } from 'react-hook-form'

function LoginPage() {
  const { register, handleSubmit, setError, formState: { errors } } = useForm<LoginFields>()

  const onSubmit = async (data: LoginFields) => {
    try {
      await login(data)
    } catch (err) {
      // Map server errors back to fields
      setError('email', {
        type: 'server',
        message: 'No account found with this email',
      })
      // Or set a root error for form-level messages
      setError('root', { message: 'Login failed. Please try again.' })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="email" {...register('email')} />
      {errors.email && <p>{errors.email.message}</p>}
      {errors.root && <p>{errors.root.message}</p>}
      <button type="submit">Log in</button>
    </form>
  )
}
```

## Gotchas at this stage

- **`register` with a `select`.** Use `{...register('field')}` the same way on `<select>` and `<textarea>`. RHF handles all native inputs.
- **Custom components.** For non-native inputs (date pickers, rich text editors, custom dropdowns), use `Controller` from RHF to integrate them.
- **Zod `.refine()` path.** The `path` option in `refine` tells Zod which field the error belongs to. Without it, the error goes to `errors.root` instead of the specific field.
- **`valueAsNumber` for number inputs.** HTML inputs always return strings. Add `valueAsNumber: true` to `register` or use a Zod `.coerce.number()` to get actual numbers.

## What's next

Part 9 covers performance: when and how to apply `React.memo`, `useMemo`, and `useCallback` correctly, lazy loading with `React.lazy`, code splitting, and using the React Profiler to find what's actually slow.

## References

- [React Hook Form, get started](https://react-hook-form.com/get-started)
- [React Hook Form, useFieldArray](https://react-hook-form.com/docs/usefieldarray)
- [Zod, basic usage](https://zod.dev/?id=basic-usage)
- [hookform/resolvers](https://github.com/react-hook-form/resolvers)
