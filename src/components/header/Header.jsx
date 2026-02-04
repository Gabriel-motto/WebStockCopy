import "./Header.css";
import { CollapsedSidebar } from "@/components/sidebar/Sidebar";

//     return (
//         <Menu.Root>
//             <Menu.Trigger asChild>
//                 <Button variant="plain">
//                     <Stack gap="8">
//                         {users.map((user) => (
//                             <HStack
//                                 key={user.email}
//                                 gap="4"
//                             >
//                                 <Avatar.Root>
//                                     <Avatar.Fallback name={user.name} />
//                                     <Avatar.Image src={user.avatar} />
//                                 </Avatar.Root>
//                                 <Stack gap="0">
//                                     <Text fontWeight="medium">{user.name}</Text>
//                                     <Text
//                                         color="fg.muted"
//                                         textStyle="sm"
//                                     >
//                                         {user.email}
//                                     </Text>
//                                 </Stack>
//                             </HStack>
//                         ))}
//                     </Stack>
//                 </Button>
//             </Menu.Trigger>
//             <Portal>
//                 <Menu.Positioner>
//                     <Menu.Content>
//                         <Menu.Item value="Profile">Mi perfil</Menu.Item>
//                         <Menu.Item value="Settings">Configuración</Menu.Item>
//                         <Menu.Separator />
//                         <Menu.Item value="Logout">
//                             <button onClick={handleClick}>Cerrar sesión</button>
//                         </Menu.Item>
//                     </Menu.Content>
//                 </Menu.Positioner>
//             </Portal>
//         </Menu.Root>
//     );
// }

// const users = [
//     {
//         id: "1",
//         name: "Gabriel Motto",
//         email: "gabriel.motto@gkn.com",
//     },
// ];

export default function Header() {

    return (
        <>
            <img
                src="src/assets/ExampleLogo.pn"
                alt="Example Logo"
                className="header-logo"
            />

            <div className="burger-menu">
                <CollapsedSidebar />
            </div>
        </>
    );
}
