"use client"

import * as React from "react"
import { ToastProvider as ToastProviderPrimitive } from "@radix-ui/react-toast"
import { 
  Toast, 
  ToastViewport, 
  ToastTitle, 
  ToastDescription, 
  ToastClose 
} from "@/components/ui/toast"
import { useToast } from "../Use-Toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProviderPrimitive>
      {toasts.map(({ id, title, description, action, ...props }) => {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action && React.isValidElement(action) ? action : null}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProviderPrimitive>
  )
}