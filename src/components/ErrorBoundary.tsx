import React from 'react'
import {
  ErrorBoundary as Boundary,
  type FallbackProps,
} from 'react-error-boundary'
import { isKyError } from 'ky'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const Fallback = ({ error, resetErrorBoundary }: FallbackProps) => (
  <Card className="mx-auto mt-8 max-w-lg">
    <CardContent className="flex flex-col items-start gap-4 p-6">
      <h2 className="text-lg font-semibold text-foreground">
        Something went wrong
      </h2>
      <p className="text-sm text-muted-foreground">
        {isKyError(error) ? error.message : 'This page could not be displayed.'}
      </p>
      <Button onClick={resetErrorBoundary}>Try again</Button>
    </CardContent>
  </Card>
)

export const ErrorBoundary = ({
  children,
  resetKeys,
}: {
  children: React.ReactNode
  resetKeys?: unknown[]
}) => (
  <Boundary
    FallbackComponent={Fallback}
    resetKeys={resetKeys}
    onError={(error, info) =>
      console.error('Unhandled error while rendering:', error, info.componentStack)
    }
  >
    {children}
  </Boundary>
)
