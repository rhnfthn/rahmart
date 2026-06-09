import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

type Todo = {
  id: number;
  name: string;
};

export default async function Page() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Berikan tipe data pada hasil query
  const { data: todos } = await supabase
    .from("todos")
    .select()
    .returns<Todo[]>();

  return (
    <ul>
      {todos?.map((todo: Todo) => (
        <li key={todo.id}>{todo.name}</li>
      ))}
    </ul>
  );
}
