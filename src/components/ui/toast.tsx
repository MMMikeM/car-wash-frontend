import * as React from "react"
import { Toast as ToastPrimitive } from "@base-ui/react/toast"
import { CircleAlert, CircleCheck, Info, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

// A standalone manager, so non-component code - validate(), a service - can
// raise a toast without a hook.
export const toastManager = ToastPrimitive.createToastManager()

export const toast = {
  message: (title: string, description?: string) =>
    toastManager.add({ title, description }),
  success: (title: string, description?: string) =>
    toastManager.add({ title, description, type: "success" }),
  error: (title: string, description?: string) =>
    toastManager.add({ title, description, type: "error", priority: "high" }),
}

const icons = {
  error: CircleAlert,
  success: CircleCheck,
}

const accents = {
  error: "text-destructive",
  success: "text-primary",
}

function ToastList() {
  const { toasts } = ToastPrimitive.useToastManager()

  return toasts.map((item) => {
    const Icon = icons[item.type as keyof typeof icons] ?? Info
    const accent = accents[item.type as keyof typeof accents] ?? "text-muted-foreground"

    return (
      <ToastPrimitive.Root
        key={item.id}
        toast={item}
        data-slot="toast"
        className={cn(
          "absolute right-0 bottom-0 left-auto z-50 flex w-[min(22rem,calc(100vw-2rem))] items-start gap-3",
          "rounded-xl border border-white/10 bg-[#232323] py-3 pr-9 pl-3.5 shadow-xl ring-1 ring-black/30",
          // Base UI stacks toasts by index; the offsets come from its own vars.
          "[transform:translateY(calc(var(--toast-index)*-0.75rem))_scale(calc(1-(var(--toast-index)*0.05)))]",
          "transition-[opacity,transform] duration-200 data-ending-style:opacity-0 data-starting-style:translate-y-full data-starting-style:opacity-0"
        )}
      >
        <Icon className={cn("mt-0.5 size-5 shrink-0", accent)} />

        <div className="min-w-0 flex-1">
          <ToastPrimitive.Title
            data-slot="toast-title"
            className="text-sm leading-snug font-semibold"
          />
          <ToastPrimitive.Description
            data-slot="toast-description"
            className="text-muted-foreground mt-0.5 text-sm leading-snug whitespace-pre-line"
          />
        </div>

        <ToastPrimitive.Close
          aria-label="Dismiss"
          className="text-muted-foreground hover:text-foreground hover:bg-white/5 absolute top-2.5 right-2.5 rounded-md p-1 transition-colors"
        >
          <XIcon className="size-4" />
        </ToastPrimitive.Close>
      </ToastPrimitive.Root>
    )
  })
}

export function Toaster() {
  return (
    <ToastPrimitive.Provider toastManager={toastManager}>
      <ToastPrimitive.Portal>
        <ToastPrimitive.Viewport
          data-slot="toast-viewport"
          className="fixed right-4 bottom-24 z-50 w-[min(20rem,calc(100vw-2rem))] md:bottom-4"
        >
          <ToastList />
        </ToastPrimitive.Viewport>
      </ToastPrimitive.Portal>
    </ToastPrimitive.Provider>
  )
}
