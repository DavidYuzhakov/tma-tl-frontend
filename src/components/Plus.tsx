interface IPlusProps {
  handler: () => void
}

export function Plus({ handler }: IPlusProps) {
  return (
    <div
      onClick={handler}
      className="fixed bottom-3 right-3 w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-white text-3xl leading-none"
    >
      <span className="mb-1">&#43;</span>
    </div>
  )
}
