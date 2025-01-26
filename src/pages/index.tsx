import { createFileRoute } from "@tanstack/react-router"

const HomePage: React.FC = () => {
  return (
    <div>
      <h3>Home</h3>
    </div>
  )
}

export const Route = createFileRoute("/")({
  component: HomePage,
})
