import { db } from "@/database";

function Home() {
  return (
    <div>
      Home
      <br />
      <form
        onSubmit={async () => {
          "use server";

          // await db.insert(usersTable).values({
          //   name: "faiyaz",
          //   email: "faiyaz@gmail.com",
          //   role: "ADMIN",
          // });
        }}
      >
        <button type="submit">Create User!</button>
      </form>
    </div>
  );
}

export default Home;
