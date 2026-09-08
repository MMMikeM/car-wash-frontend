import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

/**
 * Wraps a placeholder so assistive tech is told the page is busy and what is
 * coming. Without it a skeleton announces nothing: it is decorative markup.
 *
 * `<output>` is implicitly a polite live region, so the label is read without
 * interrupting, and the shapes are hidden so they are not read out one by one.
 */
const LoadingRegion = ({ label, className = '', children }) => (
  <output aria-busy="true" className={cn('block w-full', className)}>
    <span className="sr-only">{label}</span>
    <div aria-hidden="true">{children}</div>
  </output>
)

/**
 * Cycled rather than random: a skeleton that reflows on every render draws the
 * eye, and a screenshot of one is not comparable between runs.
 */
const WIDTHS = ['w-32', 'w-20', 'w-40', 'w-24', 'w-36', 'w-28']
const widthAt = (index: number) => WIDTHS[index % WIDTHS.length]

/**
 * Mirrors BasicTable, down to the breakpoint it switches at and the elements
 * it switches to. Sharing the real Table and Card means the rows occupy the
 * height the data will, so nothing moves when it arrives.
 */
const ListShapes = ({
  rows,
  columns,
  actions,
  actionSize = 'size-8',
  tableOnly = false,
}) => (
  <>
    <div className={cn('flex flex-col gap-3 md:hidden', tableOnly && 'hidden')}>
      {Array.from({ length: rows }, (_, row) => (
        <Card key={row} className="py-0">
          <CardContent className="flex flex-col gap-2 p-4">
            {Array.from({ length: columns }, (_cell, column) => (
              <div key={column} className="flex justify-between gap-4">
                <Skeleton className="h-3 w-20" />
                <Skeleton className={cn('h-4', widthAt(row + column))} />
              </div>
            ))}
            {actions && (
              <div className="border-border mt-2 flex items-center gap-2 border-t pt-3">
                <Skeleton className={cn(actionSize, "rounded-md")} />
                <Skeleton className={cn(actionSize, "rounded-md")} />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>

    <Card className="hidden w-full py-0 md:block">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {Array.from({ length: columns }, (_, column) => (
                <TableHead key={column}>
                  <Skeleton className="h-3 w-16" />
                </TableHead>
              ))}
              {actions && <TableHead />}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rows }, (_, row) => (
              <TableRow key={row}>
                {Array.from({ length: columns }, (_cell, column) => (
                  <TableCell key={column}>
                    <Skeleton className={cn('h-4', widthAt(row + column))} />
                  </TableCell>
                ))}
                {actions && (
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Skeleton className={cn(actionSize, "rounded-md")} />
                      <Skeleton className={cn(actionSize, "rounded-md")} />
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </>
)

export const ListSkeleton = ({
  rows = 5,
  columns = 4,
  actions = true,
  actionSize = 'size-8',
  label = 'Loading',
}) => (
  <LoadingRegion label={label}>
    <ListShapes
      rows={rows}
      columns={columns}
      actions={actions}
      actionSize={actionSize}
    />
  </LoadingRegion>
)

/**
 * The bespoke customer and wash-type lists: a stack of cards on a phone, a
 * table on a wide screen, with a primary action above both.
 */
export const RecordListSkeleton = ({ rows = 5, label = 'Loading' }) => (
  <LoadingRegion label={label}>
    <Skeleton className="mb-4 h-9 w-full" />

    <div className="md:hidden">
      {Array.from({ length: rows }, (_, row) => (
        // The real elements with placeholders inside them, rather than boxes
        // guessed at the right size: line height and the margin base.css puts
        // on an h3 then come from the same CSS the records will use.
        <div
          key={row}
          className="bg-card mb-2 flex flex-col gap-1 rounded-lg px-4 py-3"
        >
          <h3 className="font-semibold text-foreground leading-tight">
            <Skeleton className={cn('inline-block h-[1em] align-middle', widthAt(row))} />
          </h3>
          <div className="flex items-end justify-between gap-3">
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="text-sm">
                <Skeleton className={cn('inline-block h-[1em] align-middle', widthAt(row + 2))} />
              </span>
              <span className="text-sm">
                <Skeleton className="inline-block h-[1em] w-28 align-middle" />
              </span>
              <span className="font-mono text-xs">
                <Skeleton className="inline-block h-[1em] w-24 align-middle" />
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Skeleton className="h-8 w-20 rounded-md" />
              <Skeleton className="size-8 rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </div>

    <div className="hidden md:block">
      {/* xs buttons in these rows, not the default size. */}
      <ListShapes rows={rows} columns={4} actions actionSize="size-6" tableOnly />
    </div>
  </LoadingRegion>
)

/**
 * Mirrors the BasicCard grid on the customer-facing wash prices: the same
 * responsive columns and the same tall card, so the grid does not collapse to
 * a single column and then reflow when the prices land.
 */
export const CardGridSkeleton = ({
  cards = 6,
  descriptionLines = 3,
  label = 'Loading',
}) => (
  <LoadingRegion label={label}>
    <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
      {Array.from({ length: cards }, (_, card) => (
        <div
          key={card}
          className="shadow-custom flex flex-col justify-between rounded-2xl border border-white/5 bg-card p-6"
        >
          <div>
            <h3 className="font-heading mb-0! text-2xl! uppercase tracking-wide">
              <Skeleton className={cn('inline-block h-[1em] align-middle', widthAt(card))} />
            </h3>
            {descriptionLines > 0 && (
              <p className="mt-2 text-sm">
                {Array.from({ length: descriptionLines }, (_line, line) => (
                  <Skeleton
                    key={line}
                    // No margin between lines: wrapped text has none, so the
                    // block matches the paragraph it stands in for exactly.
                    className={cn(
                      'block h-[1em]',
                      line === descriptionLines - 1 ? 'w-2/3' : 'w-full'
                    )}
                  />
                ))}
              </p>
            )}
          </div>
          <div className="mt-6 flex items-end justify-between gap-4">
            <Skeleton className="h-6 w-28 rounded-full" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
      ))}
    </div>
  </LoadingRegion>
)

/**
 * Mirrors the wash-type card: name and order on the left, price and cost on
 * the right, then a divided footer of points and three icon actions. A
 * different shape from the customer card, so it gets its own placeholder
 * rather than borrowing one that is 60px short per row.
 */
export const WashListSkeleton = ({ rows = 8, label = 'Loading' }) => (
  <LoadingRegion label={label}>
    <Skeleton className="mb-4 h-9 w-full" />

    <div className="md:hidden">
      {Array.from({ length: rows }, (_, row) => (
        <Card key={row} className="mb-3">
          <CardContent className="pt-4">
            <div className="mb-3 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">
                  <Skeleton className={cn('inline-block h-[1em] align-middle', widthAt(row))} />
                </h3>
                <span className="text-xs">
                  <Skeleton className="inline-block h-[1em] w-16 align-middle" />
                </span>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold">
                  <Skeleton className="inline-block h-[1em] w-20 align-middle" />
                </div>
                <div className="text-xs">
                  <Skeleton className="inline-block h-[1em] w-16 align-middle" />
                </div>
              </div>
            </div>

            <div className="border-border flex items-center justify-between border-t pt-3">
              <div className="text-sm">
                <Skeleton className="inline-block h-[1em] w-20 align-middle" />
              </div>
              <div className="flex gap-1">
                <Skeleton className="size-8 rounded-md" />
                <Skeleton className="size-8 rounded-md" />
                <Skeleton className="size-8 rounded-md" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    <div className="hidden md:block">
      <ListShapes rows={rows} columns={4} actions actionSize="size-8" tableOnly />
    </div>
  </LoadingRegion>
)

/** A record shown as icon-and-value rows rather than as a form. */
export const DetailSkeleton = ({ rows = 5, label = 'Loading' }) => (
  <LoadingRegion label={label}>
    <div className="bg-3 max-sm flex flex-col rounded px-4 pt-4 pb-3">
      <div className="flex flex-col gap-4 px-2 pt-2">
        {Array.from({ length: rows }, (_, row) => (
          <div key={row} className="flex items-center gap-3">
            <Skeleton className="size-5 shrink-0 rounded" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className={cn('h-4', widthAt(row))} />
          </div>
        ))}
      </div>
    </div>
  </LoadingRegion>
)

/**
 * Mirrors BasicForm: label above input, and the full-width submit it ends on.
 */
export const FormSkeleton = ({ fields = 4, label = 'Loading' }) => (
  <LoadingRegion label={label}>
    {Array.from({ length: fields }, (_, field) => (
      <div key={field} className="mb-4">
        <Skeleton className="mb-1.5 h-3 w-24" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    ))}
    <Skeleton className="mt-4 h-9 w-full rounded-md" />
  </LoadingRegion>
)

/**
 * For a whole route, where the shape of what is coming is not known - a lazy
 * chunk, say. Centred rather than content-shaped.
 */
export const PageLoading = ({ label = 'Loading', className = '' }) => (
  <output
    aria-busy="true"
    className={cn('flex items-center justify-center p-8', className)}
  >
    <span className="sr-only">{label}</span>
    <div
      aria-hidden="true"
      className="border-muted-foreground/30 border-t-primary size-6 animate-spin rounded-full border-2 motion-reduce:animate-none"
    />
  </output>
)
