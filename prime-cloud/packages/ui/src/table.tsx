import { cn } from './index'

export function Table({ headers, rows, className }: { headers: string[]; rows: (string | React.ReactNode)[][]; className?: string }) {
  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-bg-main border-b border-border-soft">
            {headers.map((h, i) => (
              <th key={i} className="text-right p-4 font-medium text-text-secondary">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="border-b border-border-soft hover:bg-bg-main/50">
              {row.map((cell, ci) => (
                <td key={ci} className="p-4">{cell}</td>
              ))}
            </tr>
          ))}
          {rows.length === 0 && (
            <tr><td colSpan={headers.length} className="p-8 text-center text-text-light">لا توجد بيانات</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
