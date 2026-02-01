import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TabsContent } from "@/components/ui/tabs";
import { validateRequest } from "@/domains/auth/service";
import { fetchUsers } from "@/domains/users/service";
import { Zap } from "lucide-react";
import { redirect } from "next/navigation";
import { ChangePasswordButton } from "@/components/admin/users/ChangePasswordButton";
import { UsersActionButton } from "@/components/admin/users/UsersActionButton";
import { UsersActionMenu } from "@/components/admin/users/UsersActionMenu";

export default async function UsersSettings() {
  const { user } = await validateRequest();
  if (!user) {
    return redirect("/login");
  }

  const [users] = await fetchUsers({ page: 1, size: 100 });
  const rows = users.map((user) => {
    return (
      <TableRow key={user.id}>
        <TableCell>{user.name}</TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell className="flex items-center justify-center w-[50px]">
          <UsersActionMenu user={user} />
        </TableCell>
      </TableRow>
    );
  });

  return (
    <TabsContent value="users" className="my-4">
      <h3 className="scroll-m-20 text-xl mb-4 font-semibold tracking-tight">
        Your Account
      </h3>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Avatar className="size-16">
            <AvatarFallback className="bg-primary text-primary-foreground text-xl font-semibold">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold">{user.name}</span>
            <span className="text-muted-foreground">{user.email}</span>
          </div>
        </div>
        <ChangePasswordButton />
      </div>
      <div className="flex items-center justify-between">
        <h3 className="scroll-m-20 text-xl mb-4 font-semibold tracking-tight">
          All Users
        </h3>
        <UsersActionButton />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="flex items-center justify-center w-[50px]">
              <Zap className="h-4 w-4" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{rows}</TableBody>
      </Table>
    </TabsContent>
  );
}
